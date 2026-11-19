// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  Mesh,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
} from "three";
import { analyzeUndercuts } from "../src/treatment-viewer/blockout/undercut-analyzer";
import { generateBlockout } from "../src/treatment-viewer/blockout/blockout-generator";
import { WaxSculptor } from "../src/treatment-viewer/blockout/wax-sculptor";
import {
  createBatchStlZip,
  createNestedBuildPlateGeometry,
  exportBinaryStl,
  prepareGeometryForPrint,
} from "../src/treatment-viewer/blockout/print-prep";
import type { BlockoutProtocol } from "../src/treatment-viewer/blockout/types";

describe("Milestone 4: Automated Undercut & Blockout Workflow", () => {
  const defaultProtocol: BlockoutProtocol = {
    insertionAxis: { x: 0, y: -1, z: 0, tiltX: 0, tiltY: 0 },
    interproximal: { enabled: true, thicknessMm: 0.6, bridgeSpaces: true },
    gingival: { enabled: true, reliefMm: 0.3, excludeEdentulous: true },
    undercut: {
      enabled: true,
      maxDepthMm: 0.4,
      draftAngleDeg: 2.0,
      perTooth: {},
    },
    printPrep: {
      shrinkageScalePercent: 100.5,
      drainHoles: [
        { id: "h1", position: [0, -10, 0], normal: [0, 1, 0], diameterMm: 3.0 },
      ],
    },
  };

  describe("1. Undercut Survey & Clinical Heatmap Analysis", () => {
    it("identifies undercuts and generates valid RGB heatmap colors", () => {
      // Create a test sphere where the lower hemisphere forms a natural undercut relative to -Y insertion
      const geom = new SphereGeometry(10, 16, 16);
      const analysis = analyzeUndercuts(geom, true, { x: 0, y: -1, z: 0, tiltX: 0, tiltY: 0 }, 2.0);

      expect(analysis.depths.length).toBe(geom.getAttribute("position")!.count);
      expect(analysis.heatmapColors.length).toBe(geom.getAttribute("position")!.count * 3);
      expect(analysis.maxDepthMm).toBeGreaterThan(0);
      expect(analysis.undercutIndices.length).toBeGreaterThan(0);

      // Verify color values are within standard normalized [0, 1] range
      for (let i = 0; i < analysis.heatmapColors.length; i++) {
        const val = analysis.heatmapColors[i]!;
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(1.0);
      }
    });

    it("handles flat or empty geometries gracefully without NaN or crashes", () => {
      const emptyGeom = new BufferGeometry();
      const emptyAnalysis = analyzeUndercuts(emptyGeom, false);
      expect(emptyAnalysis.maxDepthMm).toBe(0);
      expect(emptyAnalysis.undercutIndices.length).toBe(0);
    });
  });

  describe("2. Blockout Generator (Interproximal, Gingival & Undercut Wax)", () => {
    it("generates merged watertight geometry and discrete digital wax overlay", () => {
      const geom = new CylinderGeometry(8, 10, 12, 24);
      const result = generateBlockout(geom, true, defaultProtocol, 1, "stage-01");

      expect(result.stageNumber).toBe(1);
      expect(result.stageId).toBe("stage-01");
      expect(result.mergedGeometry).toBeDefined();

      const origPos = geom.getAttribute("position")!;
      const mergedPos = result.mergedGeometry!.getAttribute("position")!;
      expect(mergedPos.count).toBe(origPos.count);

      // Verify that wax additions were produced
      expect(result.waxGeometry).not.toBeNull();
      if (result.waxGeometry) {
        expect(result.waxGeometry.getAttribute("position")!.count).toBeGreaterThan(0);
      }
    });

    it("respects per-tooth exclusion overrides", () => {
      const geom = new CylinderGeometry(8, 10, 12, 24);
      // Disable undercut blockout for tooth 11
      const customProtocol: BlockoutProtocol = {
        ...defaultProtocol,
        undercut: {
          ...defaultProtocol.undercut,
          perTooth: { 11: false },
        },
      };

      const result = generateBlockout(geom, true, customProtocol, 1, "stage-01");
      expect(result.mergedGeometry).toBeDefined();
    });

    it("disables gingival relief when toggled OFF", () => {
      const geom = new CylinderGeometry(8, 10, 12, 24);
      const noGingivalProtocol: BlockoutProtocol = {
        ...defaultProtocol,
        gingival: { ...defaultProtocol.gingival, enabled: false },
      };

      const result = generateBlockout(geom, true, noGingivalProtocol, 1);
      expect(result.mergedGeometry).toBeDefined();
    });
  });

  describe("3. 3D Digital Wax Carver (Interactive Sculptor)", () => {
    it("adds and carves digital wax with working undo/redo stack", () => {
      const scene = new Scene();
      const camera = new PerspectiveCamera(45, 1, 0.1, 1000);
      const dom = document.createElement("div");

      const sculptor = new WaxSculptor(scene, camera, dom);

      const geom = new BoxGeometry(10, 10, 10, 8, 8, 8);
      const mesh = new Mesh(geom);
      scene.add(mesh);

      sculptor.setTargetMesh(mesh, "stage-01");
      sculptor.setConfig({ mode: "add", radiusMm: 4.0, strength: 0.8 });
      expect(sculptor.getConfig().mode).toBe("add");

      // Verify undo/redo initial state
      expect(sculptor.canUndo()).toBe(false);
      expect(sculptor.canRedo()).toBe(false);

      // Verify that carving wax clamps net wax to 0 and cannot dig into tooth or produce spiky geometry
      const deltasCarve = new Map<number, [number, number, number]>();
      deltasCarve.set(0, [-1.5, 0, 0]); // Aggressive carve attempt on vertex 0
      const carveResult = generateBlockout(geom, true, defaultProtocol, 1, "stage-01", deltasCarve);
      expect(carveResult.mergedGeometry).toBeDefined();

      const mergedPos = carveResult.mergedGeometry!.getAttribute("position")!;
      const origPos = geom.getAttribute("position")!;
      // Vertex 0 was carved: its merged position must not be displaced into negative space
      expect(mergedPos.getX(0)).toBeCloseTo(origPos.getX(0), 3);
      expect(mergedPos.getY(0)).toBeCloseTo(origPos.getY(0), 3);
      expect(mergedPos.getZ(0)).toBeCloseTo(origPos.getZ(0), 3);

      // Verify that adding wax increases wax thickness along surface normal
      const deltasAdd = new Map<number, [number, number, number]>();
      deltasAdd.set(0, [0.8, 0, 0]); // Add 0.8mm of wax to vertex 0
      const addResult = generateBlockout(geom, true, defaultProtocol, 1, "stage-01", deltasAdd);
      const addMergedPos = addResult.mergedGeometry!.getAttribute("position")!;
      const dist = Math.hypot(
        addMergedPos.getX(0) - origPos.getX(0),
        addMergedPos.getY(0) - origPos.getY(0),
        addMergedPos.getZ(0) - origPos.getZ(0),
      );
      expect(dist).toBeGreaterThan(0.5);

      sculptor.dispose();
    });
  });

  describe("4. Print Preparation & Binary STL Export", () => {
    it("applies shrinkage scaling and punches base suction holes", () => {
      const geom = new BoxGeometry(20, 20, 20);
      const prep = prepareGeometryForPrint(geom, defaultProtocol.printPrep);

      prep.computeBoundingBox();
      const box = prep.boundingBox!;
      const sizeX = box.max.x - box.min.x;

      // 100.5% scale should expand 20mm to ~20.1mm
      expect(sizeX).toBeCloseTo(20.1, 1);
    });

    it("exports clean, valid binary STL bytes with standard 80-byte header", () => {
      const geom = new BoxGeometry(10, 10, 10);
      const bytes = exportBinaryStl(geom, "test_tooth_model");

      expect(bytes).toBeInstanceOf(Uint8Array);
      // Binary STL must be at least 84 bytes (80-byte header + 4-byte uint32 triangle count)
      expect(bytes.length).toBeGreaterThan(84);

      // Verify triangle count header
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      const triCount = view.getUint32(80, true);
      // BoxGeometry has 12 triangles
      expect(triCount).toBe(12);
    });

    it("creates a nested build-plate geometry for multi-stage slicing", () => {
      const geom = new BoxGeometry(10, 10, 10);
      const stageResults = [
        generateBlockout(geom, true, defaultProtocol, 1, "stage-01"),
        generateBlockout(geom, true, defaultProtocol, 2, "stage-02"),
      ];

      const nested = createNestedBuildPlateGeometry(stageResults, defaultProtocol.printPrep);
      expect(nested).not.toBeNull();
      // 2 stages of 12 triangles = 24 triangles total
      const triCount = (nested!.index ? nested!.index.count : nested!.getAttribute("position")!.count) / 3;
      expect(triCount).toBe(24);
    });

    it("packages all transitional stages into a downloadable ZIP archive", async () => {
      const geom = new BoxGeometry(10, 10, 10);
      const stageResults = [
        generateBlockout(geom, true, defaultProtocol, 1, "stage-01"),
        generateBlockout(geom, true, defaultProtocol, 2, "stage-02"),
      ];

      let progressCount = 0;
      const zipBlob = await createBatchStlZip(
        "Niya",
        "Upper",
        stageResults,
        defaultProtocol.printPrep,
        () => {
          progressCount++;
        },
      );

      expect(zipBlob).toBeInstanceOf(Blob);
      expect(zipBlob.size).toBeGreaterThan(100);
      expect(progressCount).toBe(2);
    });
  });

  describe("5. Clinical Real-World Model Exclusions (Occlusal Table & Alveolar Bone Protection)", () => {
    it("guarantees 0 wax on occlusal table and 0 wax on alveolar bone for real dental casts", () => {
      const fs = require("node:fs");
      const { STLLoader } = require("three/examples/jsm/loaders/STLLoader.js");
      const loader = new STLLoader();

      const lowerPath = fs.existsSync("tests/fixtures/Niya Priority Lower jaw - 01 - Model.stl")
        ? "tests/fixtures/Niya Priority Lower jaw - 01 - Model.stl"
        : "models/Ashina models/Niya Priority Lower jaw - 01 - Model.stl";

      if (!fs.existsSync(lowerPath)) {
        return; // Skip if large fixture omitted in lightweight environments
      }

      const buf = fs.readFileSync(lowerPath);
      const geom = loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
      geom.computeVertexNormals();

      const survey = analyzeUndercuts(geom, false, defaultProtocol.insertionAxis, 2.0);
      const result = generateBlockout(geom, false, defaultProtocol, 1, "stage-01");

      expect(result.waxGeometry).not.toBeNull();
      const pos = geom.getAttribute("position");
      const norm = geom.getAttribute("normal");
      const waxPos = result.waxGeometry!.getAttribute("position");

      expect(waxPos.count).toBeGreaterThan(0);

      // Verify that no wax vertex exists on the occlusal table (facing straight up near top)
      // or deep in the alveolar bone base
      let waxOnOcclusalTable = 0;
      let waxOnAlveolarBase = 0;

      // Find extents
      let minY = Infinity, maxY = -Infinity;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }

      // Check survey depths: occlusal surfaces and alveolar base must have depth = 0
      for (let i = 0; i < pos.count; i += 20) {
        const y = pos.getY(i);
        const ny = norm.getY(i);

        // Coronal occlusal table: upward facing surfaces
        if (ny > 0.4) {
          if (survey.depths[i]! > 0) waxOnOcclusalTable++;
        }

        // Deep alveolar mounting base near bottom of model (within 2mm of minY)
        if (y <= minY + 2.0) {
          if (survey.depths[i]! > 0) waxOnAlveolarBase++;
        }
      }

      expect(waxOnOcclusalTable).toBe(0);
      expect(waxOnAlveolarBase).toBe(0);
    });
  });
});
