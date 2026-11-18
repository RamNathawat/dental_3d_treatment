/**
 * 3D Interactive Digital Wax Carver (Sculpting Engine).
 *
 * Implements the digital analogue of the laboratory wax spatula:
 * - Add Wax: Deposits material outward along local surface normals.
 * - Carve / Scrape Wax: Shaves material down toward base dental envelope.
 * - Smooth Wax: Laplacian relaxation for seamless thermoforming transitions.
 *
 * Supports desktop mouse and mobile touch interaction with undo/redo history.
 */

import {
  BufferGeometry,
  Color,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  PerspectiveCamera,
  Raycaster,
  RingGeometry,
  Scene,
  Vector2,
  Vector3,
} from "three";
import type { SculptConfig } from "./types";

export interface SculptStrokeEvent {
  stageId: string;
  affectedVerticesCount: number;
  deltas: Map<number, [number, number, number]>;
}

export class WaxSculptor {
  private config: SculptConfig = {
    mode: "off",
    radiusMm: 3.5,
    strength: 0.5,
  };

  private scene: Scene;
  private camera: PerspectiveCamera;
  private domElement: HTMLElement;
  private targetMesh: Mesh | null = null;
  private baseGeometry: BufferGeometry | null = null;

  // Active stage deltas and undo/redo stacks
  private currentStageId = "stage-01";
  private activeDeltas = new Map<number, [number, number, number]>();
  private undoStack: Array<Map<number, [number, number, number]>> = [];
  private redoStack: Array<Map<number, [number, number, number]>> = [];

  // 3D Cursor Indicator
  private cursorRing: LineLoop | null = null;
  private raycaster = new Raycaster();
  private pointerPos = new Vector2();
  private isPointerDown = false;
  private hasStrokeModified = false;

  private onStrokeFinished?: (evt: SculptStrokeEvent) => void;

  constructor(
    scene: Scene,
    camera: PerspectiveCamera,
    domElement: HTMLElement,
    onStrokeFinished?: (evt: SculptStrokeEvent) => void,
  ) {
    this.scene = scene;
    this.camera = camera;
    this.domElement = domElement;
    this.onStrokeFinished = onStrokeFinished;

    this.createCursorRing();
    this.bindEvents();
  }

  public setConfig(config: Partial<SculptConfig>): void {
    Object.assign(this.config, config);
    if (this.cursorRing) {
      this.cursorRing.visible = this.config.mode !== "off";
      const scale = this.config.radiusMm;
      this.cursorRing.scale.set(scale, scale, scale);
    }
  }

  public getConfig(): SculptConfig {
    return { ...this.config };
  }

  public setTargetMesh(mesh: Mesh | null, stageId = "stage-01"): void {
    this.targetMesh = mesh;
    this.currentStageId = stageId;
    if (mesh && !this.baseGeometry) {
      this.baseGeometry = mesh.geometry.clone();
    }
  }

  public setStageDeltas(stageId: string, deltas?: Map<number, [number, number, number]>): void {
    this.currentStageId = stageId;
    this.activeDeltas = deltas ? new Map(deltas) : new Map();
    this.undoStack = [];
    this.redoStack = [];
  }

  public getStageDeltas(): Map<number, [number, number, number]> {
    return new Map(this.activeDeltas);
  }

  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  public undo(): boolean {
    if (this.undoStack.length === 0) return false;
    const prev = this.undoStack.pop()!;
    this.redoStack.push(new Map(this.activeDeltas));
    this.activeDeltas = prev;
    this.applyCurrentDeltasToMesh();
    this.notifyStroke();
    return true;
  }

  public redo(): boolean {
    if (this.redoStack.length === 0) return false;
    const next = this.redoStack.pop()!;
    this.undoStack.push(new Map(this.activeDeltas));
    this.activeDeltas = next;
    this.applyCurrentDeltasToMesh();
    this.notifyStroke();
    return true;
  }

  public dispose(): void {
    this.unbindEvents();
    if (this.cursorRing) {
      this.scene.remove(this.cursorRing);
      this.cursorRing.geometry.dispose();
      (this.cursorRing.material as any).dispose();
      this.cursorRing = null;
    }
  }

  private createCursorRing(): void {
    const segments = 32;
    const ringGeom = new RingGeometry(0.95, 1.0, segments);
    const pos = ringGeom.getAttribute("position");
    const points: Vector3[] = [];
    for (let i = 0; i < pos.count; i++) {
      points.push(new Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)));
    }
    const loopGeom = new BufferGeometry().setFromPoints(points);

    // Warm gold/amber cursor ring matching clinical UI
    const mat = new LineBasicMaterial({
      color: new Color(0xffc107),
      depthTest: false,
      transparent: true,
      opacity: 0.85,
    });
    this.cursorRing = new LineLoop(loopGeom, mat);
    this.cursorRing.renderOrder = 9999;
    this.cursorRing.visible = false;
    this.scene.add(this.cursorRing);
  }

  private bindEvents(): void {
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);

    this.domElement.addEventListener("pointermove", this.onPointerMove, { passive: false });
    this.domElement.addEventListener("pointerdown", this.onPointerDown, { passive: false });
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("pointercancel", this.onPointerUp);
  }

  private unbindEvents(): void {
    this.domElement.removeEventListener("pointermove", this.onPointerMove);
    this.domElement.removeEventListener("pointerdown", this.onPointerDown);
    window.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("pointercancel", this.onPointerUp);
  }

  private updatePointerCoord(e: PointerEvent): void {
    const rect = this.domElement.getBoundingClientRect();
    this.pointerPos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointerPos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private onPointerMove(e: PointerEvent): void {
    if (this.config.mode === "off" || !this.targetMesh) return;
    this.updatePointerCoord(e);

    this.raycaster.setFromCamera(this.pointerPos, this.camera);
    const hits = this.raycaster.intersectObject(this.targetMesh, false);

    if (hits.length > 0 && hits[0]) {
      const hit = hits[0];
      if (this.cursorRing) {
        this.cursorRing.visible = true;
        this.cursorRing.position.copy(hit.point);
        if (hit.face) {
          this.cursorRing.quaternion.setFromUnitVectors(
            new Vector3(0, 0, 1),
            hit.face.normal.clone().transformDirection(this.targetMesh.matrixWorld),
          );
        }
      }

      if (this.isPointerDown) {
        e.preventDefault();
        this.applyBrushStroke(hit.point);
      }
    } else if (this.cursorRing && !this.isPointerDown) {
      this.cursorRing.visible = false;
    }
  }

  private onPointerDown(e: PointerEvent): void {
    if (this.config.mode === "off" || !this.targetMesh) return;
    if (e.button !== 0 && e.pointerType === "mouse") return; // Primary button only

    this.updatePointerCoord(e);
    this.raycaster.setFromCamera(this.pointerPos, this.camera);
    const hits = this.raycaster.intersectObject(this.targetMesh, false);

    if (hits.length > 0 && hits[0]) {
      e.preventDefault();
      // Record undo state at start of stroke
      this.undoStack.push(new Map(this.activeDeltas));
      if (this.undoStack.length > 30) this.undoStack.shift();
      this.redoStack = [];

      this.isPointerDown = true;
      this.hasStrokeModified = false;
      this.applyBrushStroke(hits[0].point);
    }
  }

  private onPointerUp(): void {
    if (this.isPointerDown) {
      this.isPointerDown = false;
      if (this.hasStrokeModified) {
        this.notifyStroke();
      }
    }
  }

  private applyBrushStroke(center: Vector3): void {
    if (!this.targetMesh) return;
    const geom = this.targetMesh.geometry;
    const pos = geom.getAttribute("position");
    const norm = geom.getAttribute("normal");
    if (!pos || !norm) return;

    // Convert world hit point into mesh local space
    const localCenter = center.clone();
    this.targetMesh.worldToLocal(localCenter);

    const radius = this.config.radiusMm;
    const radiusSq = radius * radius;
    const strength = this.config.strength;
    const mode = this.config.mode;

    const count = pos.count;
    let modified = 0;

    const vP = new Vector3();
    const vN = new Vector3();

    for (let i = 0; i < count; i++) {
      vP.set(pos.getX(i), pos.getY(i), pos.getZ(i));
      const distSq = vP.distanceToSquared(localCenter);

      if (distSq <= radiusSq) {
        const falloff = Math.exp(-distSq / (radiusSq * 0.5));
        const amount = strength * falloff * 0.25; // Millimeter step per frame

        vN.set(norm.getX(i), norm.getY(i), norm.getZ(i)).normalize();
        const existingDelta = this.activeDeltas.get(i) || [0, 0, 0];

        if (mode === "add") {
          // Deposit digital wax outward along surface normal
          existingDelta[0] += vN.x * amount;
          existingDelta[1] += vN.y * amount;
          existingDelta[2] += vN.z * amount;
          this.activeDeltas.set(i, existingDelta);

          pos.setXYZ(i, vP.x + vN.x * amount, vP.y + vN.y * amount, vP.z + vN.z * amount);
          modified++;
        } else if (mode === "remove") {
          // Carve / shave wax inward toward original base surface
          const carveX = existingDelta[0] * 0.25;
          const carveY = existingDelta[1] * 0.25;
          const carveZ = existingDelta[2] * 0.25;

          existingDelta[0] -= carveX;
          existingDelta[1] -= carveY;
          existingDelta[2] -= carveZ;
          this.activeDeltas.set(i, existingDelta);

          pos.setXYZ(i, vP.x - carveX, vP.y - carveY, vP.z - carveZ);
          modified++;
        } else if (mode === "smooth") {
          // Smooth wax: blend position toward average center
          const blendX = (localCenter.x - vP.x) * amount * 0.35;
          const blendY = (localCenter.y - vP.y) * amount * 0.35;
          const blendZ = (localCenter.z - vP.z) * amount * 0.35;

          existingDelta[0] += blendX;
          existingDelta[1] += blendY;
          existingDelta[2] += blendZ;
          this.activeDeltas.set(i, existingDelta);

          pos.setXYZ(i, vP.x + blendX, vP.y + blendY, vP.z + blendZ);
          modified++;
        }
      }
    }

    if (modified > 0) {
      pos.needsUpdate = true;
      geom.computeVertexNormals();
      this.hasStrokeModified = true;
    }
  }

  private applyCurrentDeltasToMesh(): void {
    if (!this.targetMesh || !this.baseGeometry) return;
    const basePos = this.baseGeometry.getAttribute("position");
    const geom = this.targetMesh.geometry;
    const pos = geom.getAttribute("position");
    if (!basePos || !pos) return;

    for (let i = 0; i < pos.count; i++) {
      const bx = basePos.getX(i);
      const by = basePos.getY(i);
      const bz = basePos.getZ(i);

      const delta = this.activeDeltas.get(i);
      if (delta) {
        pos.setXYZ(i, bx + delta[0], by + delta[1], bz + delta[2]);
      } else {
        pos.setXYZ(i, bx, by, bz);
      }
    }
    pos.needsUpdate = true;
    geom.computeVertexNormals();
  }

  private notifyStroke(): void {
    if (this.onStrokeFinished) {
      this.onStrokeFinished({
        stageId: this.currentStageId,
        affectedVerticesCount: this.activeDeltas.size,
        deltas: new Map(this.activeDeltas),
      });
    }
  }
}
