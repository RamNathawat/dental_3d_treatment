import {
  ACESFilmicToneMapping,
  Box3,
  BufferAttribute,
  type BufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  GridHelper,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  type Texture,
  Timer,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { capPlanarOpenings } from "./cap-planar";
import { computeAnatomicalColors } from "./dental-segmentation";
import { WELD_FRACTION, type CurvatureKind } from "../domain/curvature";
import { separationOffsets, type Bounds } from "../domain/explode";
import type { Matrix4Entries } from "../domain/matrix4";
import {
  DEFAULT_SMOOTHING,
  clampSmoothing,
  clampUnit,
  type CameraView,
  type LayerSurface,
} from "../domain/view-settings";
import { errorMessage } from "../support/errors";
import {
  DEFAULT_DIRECTION,
  GRID_EXTENT_MM,
  extentOf,
  framingFor,
  gridPlacementFor,
  poseFor,
  resizeFor,
  visibleBoundsOf,
  zoomLimitsFor,
  type ViewSize,
} from "./camera-framing";
import { appearanceOf } from "./layer-appearance";
import { layerPlacement } from "./layer-placement";
import {
  applySurfaceReply,
  showOwnColour,
  type SurfaceLayer,
  type SurfaceMaterial,
} from "./layer-surface";
import { createOrbitCentreMarker } from "./orbit-centre-marker";
import { installLongPress } from "./long-press";
import { installOrbitDrag } from "./orbit-drag";
import { turnAbout, turnFor } from "./orbit";
import {
  pickedPoint,
  pickedMesh,
} from "./picking";
import {
  createSurfacePainter,
  replyFor,
  type PaintRequest,
  type SurfaceEvent,
  type SurfacePainter,
} from "./surface-painter";
import { installTwoFingerScroll } from "./two-finger-scroll";
import {
  STATS_INTERVAL_SECONDS,
  createStatsWindow,
  visibleTrianglesOf,
  type DrawnContent,
} from "./viewport-stats";
import type {
  AddLayerOutcome,
  LayerSpec,
  ScreenPoint,
  StandardView,
  SurfaceProgress,
  Viewport,
  ViewportOptions,
} from "./viewport";

// Studio neutral alabaster — clinical backdrop with calibrated contrast.
const BACKGROUND_COLOUR = 0xebe7e0;

const GRID_DIVISIONS = 40;
const GRID_COLOUR_LINES = 0xd8d3ca;  // subtle warm grid lines
const GRID_COLOUR_AXIS  = 0xc2bcb0;  // slightly stronger axis



/**
 * A layer as this viewport keeps it: what it is drawn with, and where it sits.
 *
 * How a surface is shown on it is `layer-surface`'s business, which is what the rest of these
 * fields are declared for.
 */
interface RenderedLayer extends Omit<SurfaceLayer, "geometry"> {
  geometry: BufferGeometry;
  /** The layer's own colour, kept while a curvature ramp is the thing on screen. */
  colour: string;
  triangles: number;
  bounds: Bounds;
  /** Distance along the occlusal axis at full separation, taken from the scan geometry. */
  separationOffset: number;
  /** The user's visibility setting; `isolate` overlays on top of it. */
  visible: boolean;
  opacity: number;
  transform: Matrix4Entries | null;
}

/**
 * Renders the bundle with three.js: one mesh per scan, orbit/pan/zoom input, and an
 * environment map so the surfaces read clearly without a studio setup.
 */
class ThreeViewport implements Viewport {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera: PerspectiveCamera;
  private readonly controls: OrbitControls;
  private readonly grid: GridHelper;
  private readonly roomEnvironment: RoomEnvironment;
  private readonly environment: Texture;
  private readonly content = new Group();
  private readonly layers = new Map<string, RenderedLayer>();
  private readonly resizeObserver: ResizeObserver;
  private readonly loader = new STLLoader();
  private readonly orbitMarker = createOrbitCentreMarker();
  private readonly timer = new Timer();
  private readonly options: ViewportOptions;
  private readonly painter: SurfacePainter = createSurfacePainter();
  private readonly stats = createStatsWindow(STATS_INTERVAL_SECONDS);

  private isolatedId: string | null = null;
  private separationFactor = 0;
  private lastSize: ViewSize | null = null;
  /** Layer id the cursor is currently over, for change-detection in the hover callback. */
  private hoveredLayerId: string | null = null;
  /** rAF token used to throttle mousemove raycasts. */
  private hoverRafPending = false;
  /**
   * The point the camera turns about, which the user sets and `OrbitControls` is never told about.
   *
   * Kept apart from what the camera looks at on purpose: setting it must move nothing, and the way
   * to do that is to leave the camera — and so what it looks at — exactly where it was.
   */
  private readonly orbitCentre = new Vector3();

  constructor(canvas: HTMLCanvasElement, options: ViewportOptions = {}) {
    this.options = options;
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: options.transparentBackground ?? false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.camera = new PerspectiveCamera(45, 1, 0.1, 10_000);
    this.camera.up.set(0, 0, 1);
    this.camera.position.copy(DEFAULT_DIRECTION).multiplyScalar(200);

    if (!options.transparentBackground) {
      this.scene.background = new Color(BACKGROUND_COLOUR);
    }
    this.scene.add(this.content);
    // In the scene rather than in the content: it marks the camera's pivot, so framing the model and
    // pressing on it must both leave it out of the picture.
    this.scene.add(this.orbitMarker.object);
    this.addLights();

    this.roomEnvironment = new RoomEnvironment();
    this.environment = new PMREMGenerator(this.renderer).fromScene(
      this.roomEnvironment,
      0.04,
    ).texture;
    this.scene.environment = this.environment;

    this.grid = new GridHelper(
      GRID_EXTENT_MM,
      GRID_DIVISIONS,
      GRID_COLOUR_AXIS,
      GRID_COLOUR_LINES,
    );
    this.grid.rotation.x = Math.PI / 2; // the helper is built in XZ; scans are XY
    this.scene.add(this.grid);

    // Initialise grid colors based on user theme
    const savedTheme =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("dental_theme")
        : null;
    const isDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (isDark) {
      this.setGridTheme(true);
    }

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.screenSpacePanning = true;
    this.controls.zoomToCursor = true;
    // Turning is left to `orbit.ts`: `OrbitControls` turns about the point it looks at, and this
    // viewer turns about the point the user set, wherever that is. Panning and zooming stay here.
    this.controls.enableRotate = false;
    // Mouse: drag orbits, wheel zooms, right-drag pans.
    // Touch: one finger orbits and nothing else, so a drag never scrolls as well; two fingers
    // scroll the page. OrbitControls would otherwise set `touch-action: none` and claim both.
    this.controls.addEventListener("end", this.handleCameraSettled);
    canvas.style.touchAction = "none";
    installTwoFingerScroll(canvas, {
      setPanning: (enabled) => {
        this.controls.enablePan = enabled;
      },
    });
    installOrbitDrag(canvas, {
      onTurn: (drag) => {
        this.turnCamera(drag);
      },
      onEnd: () => {
        this.handleCameraSettled();
      },
    });
    // A held finger asks for a new orbit centre, which is what a touch screen has instead of the
    // right-drag that moves one around with a mouse.
    installLongPress(canvas, {
      onLongPress: (point) => {
        this.setOrbitCentreAt(point);
      },
    });

    // The timer is deliberately not connected to the Page Visibility API: nothing here is
    // animated against wall-clock time, and that API reports a zero delta whenever the tab
    // is in the background, which would stall the readout instead of just slowing it.
    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(canvas);
    this.handleResize();

    // Curvature is measured off the main thread; what comes back is turned into colours here.
    this.painter.onEvent(this.handleSurface);

    // Hover raycasting — throttled with rAF so we never fire more than once per frame.
    if (options.onToothHover) {
      canvas.addEventListener("mousemove", (e: MouseEvent) => {
        if (this.hoverRafPending) return;
        this.hoverRafPending = true;
        requestAnimationFrame(() => {
          this.hoverRafPending = false;
          this.handleHoverMove(e);
        });
      });
      canvas.addEventListener("mouseleave", () => {
        if (this.hoveredLayerId !== null) {
          this.hoveredLayerId = null;
          this.options.onToothHover?.(null);
        }
      });
    }

    this.renderer.setAnimationLoop(this.render);
  }

  addLayer(spec: LayerSpec): AddLayerOutcome {
    let layer: RenderedLayer;
    try {
      layer = this.createLayer(spec);
    } catch (error) {
      return { ok: false, reason: errorMessage(error) };
    }

    this.layers.set(layer.id, layer);
    this.content.add(layer.mesh);
    this.refreshSeparation();
    return { ok: true };
  }

  private readonly geometryCache = new Map<ArrayBuffer, BufferGeometry>();

  private createLayer(spec: LayerSpec): RenderedLayer {
    let geometry = spec.geometry;
    if (!geometry) {
      if (spec.stl) {
        geometry = this.geometryCache.get(spec.stl);
        if (!geometry) {
          const raw = this.loader.parse(spec.stl);
          const isUpper = !spec.label.toLowerCase().includes("lower");
          geometry = capPlanarOpenings(raw, isUpper);
          // Scanner exports often carry unusable facet normals, so shading is derived from
          // the triangles themselves.
          geometry.computeVertexNormals();
          geometry.computeBoundingBox();
          this.geometryCache.set(spec.stl, geometry);
        }
      } else {
        throw new Error(`Layer ${spec.id} missing both geometry and stl buffer`);
      }
    }

    // Only compute anatomical colors if the geometry does not already have native pre-baked colors
    if (spec.colour === "anatomical") {
      if (!geometry.getAttribute("color")) {
        computeAnatomicalColors(geometry, spec.label);
      }
    }

    const isAnatomical = spec.colour === "anatomical";
    const baseColor = isAnatomical ? "#ffffff" : spec.colour;

    const material = new MeshPhysicalMaterial({
      color: new Color(baseColor),
      roughness: 0.32,
      metalness: 0.01,
      clearcoat: 0.65,
      clearcoatRoughness: 0.14,
      ior: 1.55,
      envMapIntensity: 0.30,
      vertexColors: isAnatomical && Boolean(geometry.getAttribute("color")),
      side: DoubleSide,
    });

    if (isAnatomical) {
      material.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <lights_physical_fragment>",
          `#include <lights_physical_fragment>
          #if defined( USE_COLOR )
            // Distinguish Gum vs Attachment vs Tooth Enamel:
            // Attachment: Vibrant clinical contrast amber-orange (r > 0.85, g in [0.35, 0.72], b < 0.28)
            bool isAttachment = (vColor.r > 0.85 && vColor.g > 0.35 && vColor.g < 0.72 && vColor.b < 0.28);
            // Gum: rich vascular oral mucosa (r > 0.35, r - g > 0.10, not attachment)
            bool isGum = (!isAttachment && vColor.r > 0.35 && (vColor.r - vColor.g) > 0.10);

            if (isAttachment) {
              // Clinical composite resin engager / attachment finish (crisp semi-gloss surface, clean reflections)
              material.roughness = 0.20;
              #ifdef USE_CLEARCOAT
                material.clearcoat = 0.55;
                material.clearcoatRoughness = 0.12;
              #endif
            } else if (isGum) {
              // Moist biological oral mucosa (wet saliva clearcoat)
              material.roughness = 0.32;
              #ifdef USE_CLEARCOAT
                material.clearcoat = 0.88;
                material.clearcoatRoughness = 0.08;
              #endif
            } else {
              // Glazed dental ceramic enamel
              material.roughness = 0.28;
              #ifdef USE_CLEARCOAT
                material.clearcoat = 0.35;
                material.clearcoatRoughness = 0.18;
              #endif
              // Occlusal fissure & groove depth enhancement based on normal derivative curvature
              float crevice = clamp((length(dxy) - 0.04) * 1.6, 0.0, 0.38);
              material.diffuseColor *= (1.0 - crevice);
            }
          #endif
          `
        );
      };
    }

    // White on its own, because the ramp that arrives in the vertex colours is the reading.
    const measuredMaterial = new MeshBasicMaterial({
      vertexColors: true,
      // The ramp was chosen by what it looks like on a screen, and a tone curve would print it as
      // something else again.
      toneMapped: false,
      side: DoubleSide,
    });

    const mesh: Mesh<BufferGeometry, SurfaceMaterial> = new Mesh(
      geometry,
      material,
    );
    mesh.name = spec.label;
    // Placement is composed by hand, so three must not overwrite it each frame.
    mesh.matrixAutoUpdate = false;

    return {
      id: spec.id,
      label: spec.label,
      colour: spec.colour,
      mesh,
      geometry,
      material,
      measuredMaterial,
      triangles: triangleCountOf(geometry),
      bounds: boundsOf(geometry),
      separationOffset: 0,
      visible: true,
      opacity: 1,
      transform: null,
      surface: "colour",
      smoothing: DEFAULT_SMOOTHING,
      measured: false,
    };
  }

  clearLayers(): void {
    for (const layer of this.layers.values()) {
      this.content.remove(layer.mesh);
      let isCached = false;
      for (const cached of this.geometryCache.values()) {
        if (cached === layer.geometry) {
          isCached = true;
          break;
        }
      }
      if (!isCached) {
        layer.geometry.dispose();
      }
      layer.material.dispose();
      layer.measuredMaterial.dispose();
    }
    this.layers.clear();
    this.isolatedId = null;
    this.hoveredLayerId = null;

    // Whatever the thread was measuring was measured from meshes that no longer exist, and a new
    // bundle's layers can reuse the same ids, so its work is stopped rather than inherited.
    this.painter.discard();
  }

  removeLayer(id: string): void {
    const layer = this.layers.get(id);
    if (!layer) return;
    this.content.remove(layer.mesh);
    let isCached = false;
    for (const cached of this.geometryCache.values()) {
      if (cached === layer.geometry) {
        isCached = true;
        break;
      }
    }
    if (!isCached) {
      layer.geometry.dispose();
    }
    layer.material.dispose();
    layer.measuredMaterial.dispose();
    this.layers.delete(id);
    if (this.isolatedId === id) this.isolatedId = null;
    if (this.hoveredLayerId === id) this.hoveredLayerId = null;
  }

  getLayerGeometry(id: string): BufferGeometry | null {
    return this.layers.get(id)?.geometry ?? null;
  }

  projectPoint(point: { x: number; y: number; z: number }): { x: number; y: number; visible: boolean } | null {
    const width = this.lastSize?.width || this.renderer.domElement.clientWidth;
    const height = this.lastSize?.height || this.renderer.domElement.clientHeight;
    if (width <= 0 || height <= 0) return null;

    const v = new Vector3(point.x, point.y, point.z);
    v.project(this.camera);

    const visible = v.z < 1.0;
    const x = (v.x * 0.5 + 0.5) * width;
    const y = (-v.y * 0.5 + 0.5) * height;

    return { x, y, visible };
  }

  setLayerGeometry(id: string, geometry: BufferGeometry): void {
    const layer = this.layers.get(id);
    if (!layer) return;
    if (!geometry.boundingBox) geometry.computeBoundingBox();
    if (!geometry.boundingSphere) geometry.computeBoundingSphere();
    layer.geometry = geometry;
    layer.mesh.geometry = geometry;
    layer.bounds = boundsOf(geometry);
    layer.triangles = triangleCountOf(geometry);
    if (layer.colour === "anatomical") {
      if (geometry.userData.baseColors instanceof BufferAttribute && !geometry.getAttribute("color")) {
        geometry.setAttribute("color", geometry.userData.baseColors.clone());
      } else if (!geometry.getAttribute("color")) {
        computeAnatomicalColors(geometry, layer.label);
      }
      const hasColors = Boolean(geometry.getAttribute("color"));
      if (layer.material.vertexColors !== hasColors) {
        layer.material.vertexColors = hasColors;
        layer.material.needsUpdate = true;
      }
    }
    this.refreshSeparation();
  }

  setLayerVisible(id: string, visible: boolean): void {
    const layer = this.layerFor(id);
    layer.visible = visible;
    this.applyLayerState(layer);
  }

  setLayerOpacity(id: string, opacity: number): void {
    const layer = this.layerFor(id);
    layer.opacity = clampUnit(opacity);
    this.applyLayerState(layer);
  }

  setLayerColour(id: string, colour: string): void {
    const layer = this.layerFor(id);
    layer.colour = colour;
    if (colour === "anatomical") {
      // Restore clean base colors if present (e.g. after contacts mode is disabled)
      if (layer.geometry.userData.baseColors instanceof BufferAttribute) {
        layer.geometry.setAttribute("color", layer.geometry.userData.baseColors.clone());
        layer.geometry.attributes["color"]!.needsUpdate = true;
      } else if (!layer.geometry.getAttribute("color")) {
        // ONLY compute if no vertex colors exist at all; NEVER overwrite existing vertex colors!
        computeAnatomicalColors(layer.geometry, layer.label);
      }
      layer.material.vertexColors = Boolean(layer.geometry.getAttribute("color"));
      layer.material.color.set("#ffffff");
    } else if (colour === "contacts") {
      // Retain the contact collision heatmap vertex colors computed on the geometry
      layer.material.vertexColors = Boolean(layer.geometry.getAttribute("color"));
      layer.material.color.set("#ffffff");
    } else {
      layer.material.vertexColors = false;
      layer.material.color.set(colour);
    }
    layer.material.needsUpdate = true;
  }

  setLayerTransform(id: string, transform: Matrix4Entries | null): void {
    const layer = this.layerFor(id);
    layer.transform = transform;
    this.applyPlacement(layer);
  }

  setLayerSurface(id: string, surface: LayerSurface): void {
    const layer = this.layerFor(id);
    if (layer.surface === surface) return;

    layer.surface = surface;
    this.refreshSurface(layer);
  }

  setLayerSmoothing(id: string, smoothing: number): void {
    const layer = this.layerFor(id);
    const passes = clampSmoothing(smoothing);
    if (layer.smoothing === passes) return;

    layer.smoothing = passes;
    this.refreshSurface(layer);
  }

  /**
   * Spreads the layers apart, and pulls the camera back with them when they open.
   *
   * Being asked for the separation the layers already have is not a request to reframe: every
   * settings change comes through here, so reframing on each one would throw away a zoom or a pan
   * as soon as the user touched anything — switching the surface, moving an opacity slider,
   * soloing a layer.
   */
  setSeparation(factor: number): void {
    const wanted = clampUnit(factor);
    if (wanted === this.separationFactor) return;

    this.separationFactor = wanted;
    for (const layer of this.layers.values()) {
      this.applyPlacement(layer);
    }
    this.pullBackToFit();
  }

  isolate(id: string | null): void {
    this.isolatedId = id;
    for (const layer of this.layers.values()) {
      this.applyLayerState(layer);
    }
  }

  fitAll(): void {
    const box = this.contentBounds();
    if (box === null) return;

    this.frame(box, this.currentDirection());
    this.syncGrid(box);
  }

  fitLayer(id: string): void {
    this.frame(
      new Box3().setFromObject(this.layerFor(id).mesh),
      this.currentDirection(),
    );
  }

  setView(view: StandardView): void {
    const pose = poseFor(view);
    this.camera.up.copy(pose.up);

    const box = this.contentBounds();
    if (box !== null) this.frame(box, pose.direction);
  }

  setGridVisible(visible: boolean): void {
    this.grid.visible = visible;
  }

  setGridTheme(isDark: boolean): void {
    const axisColor = new Color(isDark ? 0x38bdf8 : GRID_COLOUR_AXIS); // luminous medical cyan in dark mode
    const lineColor = new Color(isDark ? 0x27354a : GRID_COLOUR_LINES); // crisp visible slate lines in dark mode
    const colors = this.grid.geometry.attributes.color;
    const positions = this.grid.geometry.attributes.position;
    if (!colors || !positions) return;

    for (let i = 0; i < colors.count; i += 2) {
      const x1 = positions.getX(i);
      const z1 = positions.getZ(i);
      const x2 = positions.getX(i + 1);
      const z2 = positions.getZ(i + 1);
      const isCenter =
        (Math.abs(x1) < 0.001 && Math.abs(x2) < 0.001) ||
        (Math.abs(z1) < 0.001 && Math.abs(z2) < 0.001);
      const col = isCenter ? axisColor : lineColor;
      colors.setXYZ(i, col.r, col.g, col.b);
      colors.setXYZ(i + 1, col.r, col.g, col.b);
    }
    colors.needsUpdate = true;
  }

  setBackgroundColor(color: number | string): void {
    const c = new Color(color);
    if (this.scene.background instanceof Color) {
      this.scene.background.copy(c);
    } else {
      this.scene.background = c.clone();
    }
    const luminance = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
    this.setGridTheme(luminance < 0.5);
  }

  setOrbitCentreAt(point: ScreenPoint): boolean {
    const canvas = this.renderer.domElement;
    const { left, top, width, height } = canvas.getBoundingClientRect();

    const picked = pickedPoint({
      camera: this.camera,
      surfaces: [...this.layers.values()].map((layer) => layer.mesh),
      point: { x: point.x - left, y: point.y - top },
      size: { width, height },
    });
    if (picked === null) return false;

    // The whole of it: the centre moves, and nothing else does. It is what every turn from here on
    // goes round, which is why the camera — and so the picture — is left exactly as it is.
    this.orbitCentre.copy(picked);
    this.markOrbitCentre(picked);
    this.handleCameraSettled();
    this.options.onOrbitCentre?.();
    return true;
  }

  /**
   * Raycasts the current mouse position and fires `onToothHover` when the hovered layer changes.
   * Called at most once per animation frame (throttled by the caller).
   */
  private handleHoverMove(e: MouseEvent): void {
    const canvas = this.renderer.domElement;
    const { left, top, width, height } = canvas.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const hit = pickedMesh({
      camera: this.camera,
      surfaces: [...this.layers.values()].map((layer) => layer.mesh),
      point: { x, y },
      size: { width, height },
    });

    if (hit === null) {
      if (this.hoveredLayerId !== null) {
        this.hoveredLayerId = null;
        this.options.onToothHover?.(null);
      }
      return;
    }

    // Identify the layer by matching the mesh's name to layer labels.
    let hitLayerId: string | null = null;
    for (const [id, layer] of this.layers) {
      if (layer.mesh === hit.mesh) {
        hitLayerId = id;
        break;
      }
    }
    if (hitLayerId === null) return;

    this.hoveredLayerId = hitLayerId;
    this.options.onToothHover?.({
      layerId: hitLayerId,
      canvasX: x,
      canvasY: y,
      hitPoint: { x: hit.point.x, y: hit.point.y, z: hit.point.z },
    });
  }

  getCamera(): CameraView {
    const { x, y, z } = this.camera.position;
    const { x: tx, y: ty, z: tz } = this.controls.target;
    const { x: cx, y: cy, z: cz } = this.orbitCentre;

    return {
      position: [x, y, z],
      target: [tx, ty, tz],
      orbitCentre: [cx, cy, cz],
    };
  }

  setCamera(view: CameraView): void {
    this.camera.position.set(...view.position);
    this.controls.target.set(...view.target);
    // A view stored before the centre was the user's to move has none to come back to, and what the
    // camera looks at is the best the middle of the model can be recovered from.
    this.orbitCentre.set(...(view.orbitCentre ?? view.target));

    const box = this.contentBounds();
    if (box !== null) this.limitZoom(box);
    this.controls.update();
  }

  dispose(): void {
    this.renderer.setAnimationLoop(null);
    this.timer.dispose();
    this.resizeObserver.disconnect();
    this.controls.removeEventListener("end", this.handleCameraSettled);
    this.clearLayers();
    this.painter.dispose();
    this.orbitMarker.dispose();
    this.grid.geometry.dispose();
    this.grid.material.dispose();
    this.roomEnvironment.dispose();
    this.environment.dispose();
    this.controls.dispose();
    this.renderer.dispose();
    for (const geom of this.geometryCache.values()) {
      geom.dispose();
    }
    this.geometryCache.clear();
  }

  private addLights(): void {
    // Balanced studio lighting calibrated for clinical CAD models:
    // Retains warm ivory/off-white enamel and deep fissure contrast without diffuse bleaching/blowout
    this.scene.add(new HemisphereLight(0xfff8ee, 0x141824, 0.22));

    // Primary key light: crisp form, depth, and specular contour (calibrated to preserve ivory enamel tone)
    const key = new DirectionalLight(0xfffbf2, 0.65);
    key.position.set(35, -65, 80);
    this.scene.add(key);

    // Daylight fill light: lifts contralateral shadows while preserving occlusal grooves
    const fill = new DirectionalLight(0xeef4ff, 0.25);
    fill.position.set(-55, -45, 35);
    this.scene.add(fill);

    // Incisal rim light: highlights incisal crowns and silhouettes against dark canvas
    const rim = new DirectionalLight(0xffffff, 0.28);
    rim.position.set(0, 75, 55);
    this.scene.add(rim);

    // Subtle upward bounce: prevents lingual undercuts from turning pitch black
    const bounce = new DirectionalLight(0xf5f3ee, 0.10);
    bounce.position.set(0, -40, -50);
    this.scene.add(bounce);
  }

  private layerFor(id: string): RenderedLayer {
    const layer = this.layers.get(id);
    if (layer === undefined)
      throw new Error(`No layer with id "${id}" has been added.`);
    return layer;
  }

  /**
   * Recomputes how far each layer travels, because separation depends on the whole set: a
   * layer added later changes what "the middle" means for the ones already there.
   */
  private refreshSeparation(): void {
    const offsets = separationOffsets(
      [...this.layers.values()].map((layer) => ({
        id: layer.id,
        bounds: layer.bounds,
      })),
    );

    for (const layer of this.layers.values()) {
      layer.separationOffset = offsets.get(layer.id) ?? 0;
      this.applyPlacement(layer);
    }
  }

  private applyPlacement(layer: RenderedLayer): void {
    layer.mesh.matrix.copy(
      layerPlacement(
        layer.transform,
        layer.separationOffset * this.separationFactor,
      ),
    );
    layer.mesh.matrixWorldNeedsUpdate = true;
  }

  /** Folds the user's settings and any isolated layer into what the renderer sees. */
  private applyLayerState(layer: RenderedLayer): void {
    const look = appearanceOf(layer, this.isolatedId);
    layer.mesh.visible = look.visible;

    for (const material of [layer.material, layer.measuredMaterial]) {
      material.opacity = layer.opacity;
      material.transparent = look.transparent;
      material.depthWrite = look.depthWrite;
    }
  }

  /**
   * Asks for the layer's corners to be coloured by its surface, or puts its own colour back.
   *
   * The geometry goes to the thread the first time and is kept there, so changing the scalar — and
   * switching back to plain colour — costs no measuring at all. The measurement is deliberately
   * not thrown away when colour is shown again: a jaw is big enough that letting it go would turn
   * every toggle into a wait.
   */
  private refreshSurface(layer: RenderedLayer): void {
    if (layer.surface === "colour") return showOwnColour(layer);

    this.paint(layer, layer.surface);
  }

  private paint(layer: RenderedLayer, surface: CurvatureKind): void {
    const first = !layer.measured;
    layer.measured = true;
    this.painter.paint({
      id: layer.id,
      surface,
      smoothing: layer.smoothing,
      ...this.geometryFor(layer, first),
    });
  }

  /** The geometry, on the one request that hands it over, and nothing on the ones that do not. */
  private geometryFor(
    layer: RenderedLayer,
    first: boolean,
  ): Pick<PaintRequest, "geometry"> {
    if (!first) return {};

    return {
      geometry: {
        positions: cornersOf(layer.geometry),
        tolerance: toleranceOf(layer.bounds),
      },
    };
  }

  /** The box around what is on screen, which is what the camera is framed on. */
  private contentBounds(): Box3 | null {
    return visibleBoundsOf(this.content.children);
  }

  /** Flashes the mark that says where the orbit centre went, sized to what is on screen. */
  private markOrbitCentre(centre: Vector3): void {
    const bounds = this.contentBounds();
    if (bounds !== null) this.orbitMarker.flash(centre, extentOf(bounds));
  }

  /** Turns the camera about the orbit centre, as the pointer drags. */
  private turnCamera(drag: { readonly x: number; readonly y: number }): void {
    // How far in front of the camera the point it looks at sits, which is `OrbitControls`' business
    // and has to survive the turn: the turn is about the orbit centre, not about that point.
    const reach = this.camera.position.distanceTo(this.controls.target);

    turnAbout(
      this.camera,
      this.orbitCentre,
      turnFor(drag, this.renderer.domElement.clientHeight),
    );
    this.controls.target
      .copy(this.camera.position)
      .addScaledVector(this.viewDirection(), reach);
    this.controls.update();
  }

  /** The way the camera looks, which is the line the point it looks at has to sit on. */
  private viewDirection(): Vector3 {
    return this.camera.getWorldDirection(new Vector3());
  }

  /**
   * Pulls back to keep all of the assembly in view, without moving the grid.
   *
   * Opening it makes the assembly taller, so this is what a separation change ends with.
   */
  private pullBackToFit(): void {
    const box = this.contentBounds();
    if (box === null) return;

    this.frame(box, this.currentDirection());
  }

  /**
   * Frames `box` from `direction`.
   *
   * The camera ends up looking at the middle of the box, which is also what puts the orbit centre
   * back where it started — the whole of what Re-center promises about it.
   */
  private frame(box: Box3, direction: Vector3): void {
    const framing = framingFor({
      bounds: box,
      fov: this.camera.fov,
      aspect: this.camera.aspect,
      direction,
    });

    this.camera.position.copy(framing.position);
    this.camera.near = framing.near;
    this.camera.far = framing.far;
    this.camera.updateProjectionMatrix();

    this.controls.target.copy(framing.target);
    this.controls.minDistance = framing.minDistance;
    this.controls.maxDistance = framing.maxDistance;
    // Framing is what puts the orbit centre back in the middle of the model, which is what Re-center
    // promises: the camera turns about what it was just framed on. That is a change to the view a
    // session remembers like any other.
    this.orbitCentre.copy(framing.target);
    this.controls.update();
    this.handleCameraSettled();
  }

  private limitZoom(box: Box3): void {
    const limits = zoomLimitsFor(box);
    this.controls.minDistance = limits.minDistance;
    this.controls.maxDistance = limits.maxDistance;
  }

  private syncGrid(box: Box3): void {
    const placement = gridPlacementFor(box);
    this.grid.scale.setScalar(placement.scale);
    this.grid.position.copy(placement.position);
  }

  private currentDirection(): Vector3 {
    const direction = this.camera.position.clone().sub(this.controls.target);
    return direction.lengthSq() === 0
      ? DEFAULT_DIRECTION.clone()
      : direction.normalize();
  }

  /** The way the camera looks, which is the line an orbit centre has to sit along. */

  private readonly handleResize = (): void => {
    const size = resizeFor({
      width: this.renderer.domElement.clientWidth,
      height: this.renderer.domElement.clientHeight,
      previous: this.lastSize,
    });
    if (size === null) return;

    this.lastSize = size;
    this.renderer.setSize(size.width, size.height, false);
    this.camera.aspect = size.aspect;
    this.camera.updateProjectionMatrix();
  };

  private readonly handleCameraSettled = (): void => {
    this.options.onCameraSettled?.();
  };

  /**
   * Takes the colours the thread measured, or gives up on them.
   *
   * A reply can arrive for a scalar the user has already moved on from; what to do about that is
   * `replyFor`'s decision, and all that is left here is telling the renderer about it.
   */
  private readonly handleSurface = (event: SurfaceEvent): void => {
    const layer = this.layers.get(event.id);
    if (layer === undefined) return;

    applySurfaceReply(layer, replyFor(event, layer), this.tell);
  };

  /** Says how a layer's surfacing is going, when there is anyone to say it to. */
  private readonly tell = (progress: SurfaceProgress): void => {
    this.options.onSurface?.(progress);
  };

  private readonly render = (timestamp: number): void => {
    this.timer.update(timestamp);
    const elapsed = this.timer.getDelta();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.reportStats(elapsed);
  };

  private reportStats(elapsed: number): void {
    const stats = this.stats.add(elapsed, () => this.drawnContent());
    if (stats !== null) this.options.onStats?.(stats);
  }

  /** What a reading says about the work, read only on the frames a reading is due. */
  private drawnContent(): DrawnContent {
    return {
      visibleTriangles: visibleTrianglesOf(this.layers.values()),
      drawCalls: this.renderer.info.render.calls,
    };
  }
}

export function createViewport(
  canvas: HTMLCanvasElement,
  options: ViewportOptions = {},
): Viewport {
  return new ThreeViewport(canvas, options);
}

function triangleCountOf(geometry: BufferGeometry): number {
  const positions = geometry.attributes["position"];
  return positions === undefined ? 0 : Math.floor(positions.count / 3);
}

function boundsOf(geometry: BufferGeometry): Bounds {
  const box = geometry.boundingBox;
  if (box === null) return { min: [0, 0, 0], max: [0, 0, 0] };

  return {
    min: [box.min.x, box.min.y, box.min.z],
    max: [box.max.x, box.max.y, box.max.z],
  };
}

/**
 * The mesh's corners as a flat array, which is what the curvature fit welds into a surface.
 *
 * Read through the attribute rather than off its array, so nothing has to be assumed about how
 * three is holding them — and copied, because the thread takes the buffer away with it.
 */
function cornersOf(geometry: BufferGeometry): Float32Array {
  const attribute = geometry.getAttribute("position");
  const corners = new Float32Array(attribute.count * 3);

  for (let corner = 0; corner < attribute.count; corner += 1) {
    corners[corner * 3] = attribute.getX(corner);
    corners[corner * 3 + 1] = attribute.getY(corner);
    corners[corner * 3 + 2] = attribute.getZ(corner);
  }
  return corners;
}

/** How far apart two corners can be and still have been the same point to the scanner. */
function toleranceOf(bounds: Bounds): number {
  const span = Math.hypot(
    bounds.max[0] - bounds.min[0],
    bounds.max[1] - bounds.min[1],
    bounds.max[2] - bounds.min[2],
  );
  return span * WELD_FRACTION;
}

/**
 * Computes realistic anatomical vertex colors for dental models:
 * Enamel tooth ivory on the crowns and healthy gingival mucosa pink on the gums.
 */
/**
 * Paints each vertex with an anatomically correct colour based on its vertical
 * (occlusal-to-gingival) position in the scan.
 *
 * Axis conventions in this viewer (camera.up = Z, grid lies in XY):
 *   X = left / right across the arch
 *   Y = labial-to-lingual depth (front-to-back)
 * Axis conventions in dental scan space:
 *   X = left / right across the arch
 *   Z = anterior-to-posterior depth (front-to-back)
 *   Y = occlusal-to-gingival HEIGHT — the vertical axis for crown vs gum separation
 *
 * Upper arch in scene space:
 *   Y high → gingival base (attached to maxilla)
 *   Y low  → crown tips (pointing downward toward the mandible)
 *
 * Lower arch in scene space:
 *   Y low  → gingival base (attached to mandibular ridge)
 *   Y high → crown tips (pointing upward toward the maxilla)
 */
export { computeAnatomicalColors } from "./dental-segmentation";
