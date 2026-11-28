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
  isLivePreview?: boolean;
}

export interface WaxSculptorCallbacks {
  onStrokeFinished?: (evt: SculptStrokeEvent) => void;
  onOrbitLockChange?: (locked: boolean) => void;
  onConfigSync?: (config: SculptConfig) => void;
  onShortcutUndo?: () => boolean;
  onShortcutRedo?: () => boolean;
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

  // Modifier keys for ergonomic CAD combo controls (Alt+Draw, Shift+Smooth)
  private isSculptTabActive = false;
  private lastActiveBrush: "add" | "remove" | "smooth" = "add";
  private altHeld = false;
  private shiftHeld = false;
  private orbitLocked = false;

  // 3D Cursor Indicator
  private cursorRing: LineLoop | null = null;
  private raycaster = new Raycaster();
  private pointerPos = new Vector2();
  private isPointerDown = false;
  private hasStrokeModified = false;
  private strokeStrokeMode: "add" | "remove" | "smooth" = "add";

  private onStrokeFinished?: (evt: SculptStrokeEvent) => void;
  private onOrbitLockChange?: (locked: boolean) => void;
  private onConfigSync?: (config: SculptConfig) => void;
  private onShortcutUndo?: () => boolean;
  private onShortcutRedo?: () => boolean;

  constructor(
    scene: Scene,
    camera: PerspectiveCamera,
    domElement: HTMLElement,
    onStrokeFinishedOrCallbacks?:
      | ((evt: SculptStrokeEvent) => void)
      | WaxSculptorCallbacks,
  ) {
    this.scene = scene;
    this.camera = camera;
    this.domElement = domElement;
    if (typeof onStrokeFinishedOrCallbacks === "function") {
      this.onStrokeFinished = onStrokeFinishedOrCallbacks;
    } else if (onStrokeFinishedOrCallbacks) {
      this.onStrokeFinished = onStrokeFinishedOrCallbacks.onStrokeFinished;
      this.onOrbitLockChange = onStrokeFinishedOrCallbacks.onOrbitLockChange;
      this.onConfigSync = onStrokeFinishedOrCallbacks.onConfigSync;
      this.onShortcutUndo = onStrokeFinishedOrCallbacks.onShortcutUndo;
      this.onShortcutRedo = onStrokeFinishedOrCallbacks.onShortcutRedo;
    }

    this.createCursorRing();
    this.bindEvents();
  }

  public setSculptTabActive(active: boolean): void {
    this.isSculptTabActive = active;
    if (!active) {
      this.altHeld = false;
      this.shiftHeld = false;
      if (this.cursorRing) this.cursorRing.visible = false;
      this.updateOrbitLock(false);
    } else {
      this.syncCursorAppearance();
      this.updateOrbitLock(this.shouldLockOrbitForAlt());
    }
  }

  public isAltQuickDrawActive(): boolean {
    return this.isSculptTabActive && this.altHeld;
  }

  public getEffectiveMode(): "off" | "add" | "remove" | "smooth" {
    if (this.isPointerDown) {
      return this.shiftHeld ? "smooth" : this.strokeStrokeMode;
    }
    if (this.isSculptTabActive && this.altHeld) {
      if (this.shiftHeld) return "smooth";
      return this.config.mode !== "off" ? this.config.mode : this.lastActiveBrush;
    }
    if (this.config.mode !== "off") {
      return this.shiftHeld ? "smooth" : this.config.mode;
    }
    return "off";
  }

  private shouldLockOrbitForAlt(): boolean {
    return this.isPointerDown || (this.isSculptTabActive && this.altHeld);
  }

  private updateOrbitLock(lock: boolean): void {
    if (this.orbitLocked !== lock) {
      this.orbitLocked = lock;
      this.onOrbitLockChange?.(lock);
    }
  }

  private syncCursorAppearance(): void {
    if (!this.cursorRing) return;
    const mode = this.getEffectiveMode();
    const mat = this.cursorRing.material as LineBasicMaterial;
    if (mode === "add") mat.color.setHex(0x22c55e); // Emerald green: Add Wax
    else if (mode === "remove") mat.color.setHex(0xef4444); // Coral red: Carve Wax
    else if (mode === "smooth") mat.color.setHex(0x38bdf8); // Sky cyan: Smooth
    else mat.color.setHex(0xffc107);

    const scale = this.config.radiusMm;
    this.cursorRing.scale.set(scale, scale, scale);
    if (mode === "off") {
      this.cursorRing.visible = false;
    }
    this.domElement.style.cursor = mode === "off" ? "grab" : "crosshair";
  }

  public setConfig(config: Partial<SculptConfig>): void {
    Object.assign(this.config, config);
    if (this.config.mode !== "off") {
      this.lastActiveBrush = this.config.mode;
    }
    this.syncCursorAppearance();
    this.onConfigSync?.(this.getConfig());
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

  public setStageDeltas(
    stageId: string,
    deltas?: Map<number, [number, number, number]>,
    preserveHistory = false,
  ): void {
    const isSameStage = stageId === this.currentStageId;
    this.currentStageId = stageId;
    this.activeDeltas = deltas ? new Map(deltas) : new Map();
    if (!preserveHistory || !isSameStage) {
      this.undoStack = [];
      this.redoStack = [];
    }
  }

  public getStageDeltas(): Map<number, [number, number, number]> {
    return new Map(this.activeDeltas);
  }

  public clearAllDeltas(): boolean {
    if (this.activeDeltas.size === 0) return false;
    this.undoStack.push(new Map(this.activeDeltas));
    if (this.undoStack.length > 30) this.undoStack.shift();
    this.redoStack = [];
    this.activeDeltas.clear();
    this.notifyStroke(false);
    return true;
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
    this.notifyStroke(false);
    return true;
  }

  public redo(): boolean {
    if (this.redoStack.length === 0) return false;
    const next = this.redoStack.pop()!;
    this.undoStack.push(new Map(this.activeDeltas));
    this.activeDeltas = next;
    this.notifyStroke(false);
    return true;
  }

  public dispose(): void {
    this.updateOrbitLock(false);
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

    // Emerald/gold surface cursor ring
    const mat = new LineBasicMaterial({
      color: new Color(0x22c55e),
      depthTest: false,
      transparent: true,
      opacity: 0.9,
    });
    this.cursorRing = new LineLoop(loopGeom, mat);
    this.cursorRing.renderOrder = 9999;
    this.cursorRing.visible = false;
    this.scene.add(this.cursorRing);
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (!this.isSculptTabActive) return;
    const target = e.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable)
    ) {
      return;
    }

    if (e.key === "Alt") {
      if (!this.altHeld) {
        this.altHeld = true;
        this.syncCursorAppearance();
        this.updateOrbitLock(true);
      }
      return;
    }
    if (e.key === "Shift") {
      if (!this.shiftHeld) {
        this.shiftHeld = true;
        this.syncCursorAppearance();
      }
      return;
    }

    // Undo / Redo shortcuts (Cmd+Z / Ctrl+Z, Cmd+Shift+Z / Ctrl+Y)
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      if (e.shiftKey) {
        if (this.onShortcutRedo) this.onShortcutRedo();
        else this.redo();
      } else {
        if (this.onShortcutUndo) this.onShortcutUndo();
        else this.undo();
      }
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "y") {
      e.preventDefault();
      if (this.onShortcutRedo) this.onShortcutRedo();
      else this.redo();
      return;
    }

    // Brush size bracket hotkeys [ and ]
    if (e.key === "[") {
      const next = Math.max(1.0, Number((this.config.radiusMm - 0.5).toFixed(1)));
      this.setConfig({ radiusMm: next });
      return;
    }
    if (e.key === "]") {
      const next = Math.min(8.0, Number((this.config.radiusMm + 0.5).toFixed(1)));
      this.setConfig({ radiusMm: next });
      return;
    }

    // Quick tool mode switching: 0/Escape -> Rotate, 1 -> Add, 2 -> Carve, 3 -> Smooth
    if (e.key === "Escape" || e.key === "0") {
      this.setConfig({ mode: "off" });
    } else if (e.key === "1") {
      this.setConfig({ mode: "add" });
    } else if (e.key === "2") {
      this.setConfig({ mode: "remove" });
    } else if (e.key === "3") {
      this.setConfig({ mode: "smooth" });
    }
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    if (e.key === "Alt") {
      this.altHeld = false;
      this.syncCursorAppearance();
      if (!this.isPointerDown) this.updateOrbitLock(false);
    } else if (e.key === "Shift") {
      this.shiftHeld = false;
      this.syncCursorAppearance();
    }
  };

  private onWindowBlur = (): void => {
    this.altHeld = false;
    this.shiftHeld = false;
    if (!this.isPointerDown) {
      this.syncCursorAppearance();
      this.updateOrbitLock(false);
    }
  };

  private bindEvents(): void {
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);

    // Use capture phase so we can intercept events when in sculpt mode before orbit drag claims them
    this.domElement.addEventListener("pointermove", this.onPointerMove, { capture: true, passive: false });
    this.domElement.addEventListener("pointerdown", this.onPointerDown, { capture: true, passive: false });
    window.addEventListener("pointerup", this.onPointerUp, { capture: true });
    window.addEventListener("pointercancel", this.onPointerUp, { capture: true });
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", this.onKeyDown);
      window.addEventListener("keyup", this.onKeyUp);
      window.addEventListener("blur", this.onWindowBlur);
    }
  }

  private unbindEvents(): void {
    this.domElement.removeEventListener("pointermove", this.onPointerMove, { capture: true });
    this.domElement.removeEventListener("pointerdown", this.onPointerDown, { capture: true });
    window.removeEventListener("pointerup", this.onPointerUp, { capture: true });
    window.removeEventListener("pointercancel", this.onPointerUp, { capture: true });
    if (typeof window !== "undefined") {
      window.removeEventListener("keydown", this.onKeyDown);
      window.removeEventListener("keyup", this.onKeyUp);
      window.removeEventListener("blur", this.onWindowBlur);
    }
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
    if (this.isSculptTabActive) {
      if (e.altKey !== this.altHeld || e.shiftKey !== this.shiftHeld) {
        this.altHeld = e.altKey;
        this.shiftHeld = e.shiftKey;
        this.syncCursorAppearance();
        this.updateOrbitLock(this.shouldLockOrbitForAlt());
      }
    }

    const activeMode = this.getEffectiveMode();
    if (activeMode === "off" || !this.targetMesh) return;

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
        if (hit.face) {
          const hitObj = hit.object as Mesh;
          const worldNorm = hit.face.normal
            .clone()
            .transformDirection(hitObj.matrixWorld)
            .normalize();
          this.cursorRing.position.copy(hit.point).addScaledVector(worldNorm, 0.08);
          this.cursorRing.quaternion.setFromUnitVectors(
            new Vector3(0, 0, 1),
            worldNorm,
          );
        } else {
          this.cursorRing.position.copy(hit.point);
        }
      }

      if (this.isPointerDown) {
        this.applyBrushStroke(hit.point, activeMode);
      }
    } else if (this.cursorRing && !this.isPointerDown) {
      this.cursorRing.visible = false;
    }
  }

  private onPointerDown(e: PointerEvent): void {
    if (this.isSculptTabActive) {
      this.altHeld = e.altKey;
      this.shiftHeld = e.shiftKey;
      this.syncCursorAppearance();
    }

    const activeMode = this.getEffectiveMode();
    if (activeMode === "off" || !this.targetMesh) return;
    if (e.button !== 0 && e.pointerType === "mouse") return; // Primary button only

    this.updatePointerCoord(e);
    this.raycaster.setFromCamera(this.pointerPos, this.camera);
    const targets = this.getRaycastTargets();
    const hits = this.raycaster.intersectObjects(targets, false);

    if (hits.length > 0 && hits[0]) {
      // Lock camera orbit completely during sculpt stroke
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      this.strokeStrokeMode = activeMode;
      this.updateOrbitLock(true);

      try {
        this.domElement.setPointerCapture(e.pointerId);
      } catch {}

      // Record undo state at start of stroke
      this.undoStack.push(new Map(this.activeDeltas));
      if (this.undoStack.length > 30) this.undoStack.shift();
      this.redoStack = [];

      this.isPointerDown = true;
      this.hasStrokeModified = false;
      this.applyBrushStroke(hits[0].point, activeMode);
    } else if (this.altHeld) {
      // Holding Alt outside mesh still keeps camera locked so accidental clicks don't jump the view
      e.preventDefault();
      e.stopPropagation();
      this.updateOrbitLock(true);
    }
  }

  private onPointerUp(e?: PointerEvent): void {
    if (this.isPointerDown) {
      this.isPointerDown = false;
      if (e) {
        try {
          this.domElement.releasePointerCapture(e.pointerId);
        } catch {}
      }
      this.updateOrbitLock(this.isSculptTabActive && this.altHeld);
      this.syncCursorAppearance();
      if (this.hasStrokeModified) {
        this.notifyStroke(false);
      }
    }
  }

  private lastStrokeUpdateTime = 0;

  private applyBrushStroke(
    center: Vector3,
    mode: "add" | "remove" | "smooth",
  ): void {
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
      const step = strength * falloff * 0.08;

      const d = this.activeDeltas.get(i) || [0, 0, 0];

      if (mode === "add") {
        d[0] = Math.min(2.5, d[0] + step);
      } else if (mode === "remove") {
        d[0] = Math.max(-2.5, d[0] - step);
      } else if (mode === "smooth") {
        const blendFactor = strength * falloff * 0.4;
        d[0] = d[0] * (1.0 - blendFactor) + avgDelta * blendFactor;
      }

      if (Math.abs(d[0]) < 0.002) {
        this.activeDeltas.delete(i);
      } else {
        this.activeDeltas.set(i, d);
      }
    }

    this.hasStrokeModified = true;

    // Throttle live preview update during drag (every 90ms for responsiveness on 8GB RAM laptops)
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    if (now - this.lastStrokeUpdateTime > 90) {
      this.lastStrokeUpdateTime = now;
      this.notifyStroke(true);
    }
  }

  private notifyStroke(isLivePreview = false): void {
    if (this.onStrokeFinished) {
      this.onStrokeFinished({
        stageId: this.currentStageId,
        affectedVerticesCount: this.activeDeltas.size,
        deltas: new Map(this.activeDeltas),
        isLivePreview,
      });
    }
  }
}
