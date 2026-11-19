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
  private secondaryMesh: Mesh | null = null;
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

  public setSecondaryMesh(mesh: Mesh | null): void {
    this.secondaryMesh = mesh;
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
    this.notifyStroke();
    return true;
  }

  public redo(): boolean {
    if (this.redoStack.length === 0) return false;
    const next = this.redoStack.pop()!;
    this.undoStack.push(new Map(this.activeDeltas));
    this.activeDeltas = next;
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

    // Use capture phase so we can intercept events when in sculpt mode before orbit drag claims them
    this.domElement.addEventListener("pointermove", this.onPointerMove, { capture: true, passive: false });
    this.domElement.addEventListener("pointerdown", this.onPointerDown, { capture: true, passive: false });
    window.addEventListener("pointerup", this.onPointerUp, { capture: true });
    window.addEventListener("pointercancel", this.onPointerUp, { capture: true });
  }

  private unbindEvents(): void {
    this.domElement.removeEventListener("pointermove", this.onPointerMove, { capture: true });
    this.domElement.removeEventListener("pointerdown", this.onPointerDown, { capture: true });
    window.removeEventListener("pointerup", this.onPointerUp, { capture: true });
    window.removeEventListener("pointercancel", this.onPointerUp, { capture: true });
  }

  private updatePointerCoord(e: PointerEvent): void {
    const rect = this.domElement.getBoundingClientRect();
    this.pointerPos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointerPos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private getRaycastTargets(): Mesh[] {
    const targets: Mesh[] = [];
    if (this.targetMesh && this.targetMesh.visible) targets.push(this.targetMesh);
    if (this.secondaryMesh && this.secondaryMesh.visible) targets.push(this.secondaryMesh);
    return targets;
  }

  private onPointerMove(e: PointerEvent): void {
    if (this.config.mode === "off" || !this.targetMesh) return;

    if (this.isPointerDown) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }

    this.updatePointerCoord(e);
    this.raycaster.setFromCamera(this.pointerPos, this.camera);
    const targets = this.getRaycastTargets();
    const hits = this.raycaster.intersectObjects(targets, false);

    if (hits.length > 0 && hits[0]) {
      const hit = hits[0];
      if (this.cursorRing) {
        this.cursorRing.visible = true;
        this.cursorRing.position.copy(hit.point);
        if (hit.face) {
          const hitObj = hit.object as Mesh;
          this.cursorRing.quaternion.setFromUnitVectors(
            new Vector3(0, 0, 1),
            hit.face.normal.clone().transformDirection(hitObj.matrixWorld),
          );
        }
      }

      if (this.isPointerDown) {
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
    const targets = this.getRaycastTargets();
    const hits = this.raycaster.intersectObjects(targets, false);

    if (hits.length > 0 && hits[0]) {
      // Prevent orbit camera from turning while actively sculpting on the mesh
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      try {
        this.domElement.setPointerCapture(e.pointerId);
      } catch (_) {}

      // Record undo state at start of stroke
      this.undoStack.push(new Map(this.activeDeltas));
      if (this.undoStack.length > 30) this.undoStack.shift();
      this.redoStack = [];

      this.isPointerDown = true;
      this.hasStrokeModified = false;
      this.applyBrushStroke(hits[0].point);
    }
  }

  private onPointerUp(e?: PointerEvent): void {
    if (this.isPointerDown) {
      this.isPointerDown = false;
      if (e) {
        try {
          this.domElement.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }
      if (this.hasStrokeModified) {
        this.notifyStroke();
      }
    }
  }

  private lastStrokeUpdateTime = 0;

  private applyBrushStroke(center: Vector3): void {
    if (!this.targetMesh) return;
    const geom = this.targetMesh.geometry;
    const pos = geom.getAttribute("position");
    if (!pos) return;

    // Convert world hit point into mesh local space
    const localCenter = center.clone();
    this.targetMesh.worldToLocal(localCenter);

    const radius = this.config.radiusMm;
    const radiusSq = radius * radius;
    const strength = this.config.strength;
    const mode = this.config.mode;

    const count = pos.count;
    const vP = new Vector3();

    // Pass 1: Find all vertices within brush sphere and their falloffs
    const affectedIndices: number[] = [];
    const falloffs: number[] = [];
    let sumDelta = 0;

    for (let i = 0; i < count; i++) {
      vP.set(pos.getX(i), pos.getY(i), pos.getZ(i));
      const distSq = vP.distanceToSquared(localCenter);

      if (distSq <= radiusSq) {
        const dist = Math.sqrt(distSq);
        const f = Math.max(0, 1.0 - dist / radius);
        const falloff = f * f; // Smooth quadratic falloff

        affectedIndices.push(i);
        falloffs.push(falloff);

        const d = this.activeDeltas.get(i);
        sumDelta += d ? d[0] : 0;
      }
    }

    if (affectedIndices.length === 0) return;

    const avgDelta = sumDelta / affectedIndices.length;

    // Pass 2: Apply wax adjustment based on selected tool mode
    // (Never mutates the base tooth scan geometry; only modulates digital wax thickness)
    for (let k = 0; k < affectedIndices.length; k++) {
      const i = affectedIndices[k]!;
      const falloff = falloffs[k]!;
      const step = strength * falloff * 0.05; // Controlled 0.02 - 0.05 mm step per event

      const d = this.activeDeltas.get(i) || [0, 0, 0];

      if (mode === "add") {
        // Deposit digital wax outward (up to +2.5mm)
        d[0] = Math.min(2.5, d[0] + step);
      } else if (mode === "remove") {
        // Carve / shave wax down (clamped at -2.5mm; blockout generator clamps net wax at 0mm)
        d[0] = Math.max(-2.5, d[0] - step);
      } else if (mode === "smooth") {
        // Smooth wax: blend delta toward local average of neighboring wax
        const blendFactor = strength * falloff * 0.35;
        d[0] = d[0] * (1.0 - blendFactor) + avgDelta * blendFactor;
      }

      this.activeDeltas.set(i, d);
    }

    this.hasStrokeModified = true;

    // Throttle real-time visual update during continuous drag (every 40ms)
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    if (now - this.lastStrokeUpdateTime > 40) {
      this.lastStrokeUpdateTime = now;
      this.notifyStroke();
    }
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
