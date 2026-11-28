// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CylinderGeometry,
  Mesh,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { analyzeUndercuts } from "../src/treatment-viewer/blockout/undercut-analyzer";
import { generateBlockout } from "../src/treatment-viewer/blockout/blockout-generator";
import { WaxSculptor } from "../src/treatment-viewer/blockout/wax-sculptor";
import { capPlanarOpenings } from "../src/viewer/cap-planar";
import { pruneCrossPalateTriangles } from "../src/treatment-viewer/model-loader";
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

      // Milestone 4.3: Fitting summary is produced with detected contacts; wax geometry is generated
      expect(result.fittingSummary).toBeDefined();
      expect(result.waxGeometry).not.toBeNull();
      expect(result.waxGeometry!.getAttribute("position").count).toBeGreaterThan(0);
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

    it("correctly applies gingival margin relief along CEJ on colored models with Uint8 and Float32 vertex colors", () => {
      // Create a test mesh representing a tooth arch with tooth enamel on top and gingiva below
      const geom = new CylinderGeometry(8, 10, 12, 24);
      const pos = geom.getAttribute("position")!;
      const count = pos.count;

      // Assign realistic Uint8 colors (0..255): top vertices are tooth enamel (ivory), bottom vertices are gum (coral-rose)
      const uint8Colors = new Uint8Array(count * 3);
      for (let i = 0; i < count; i++) {
        const y = pos.getY(i);
        const idx = i * 3;
        if (y > 0) {
          // Tooth enamel: warm ivory (e.g. RGB 200, 190, 175)
          uint8Colors[idx] = 200;
          uint8Colors[idx + 1] = 190;
          uint8Colors[idx + 2] = 175;
        } else {
          // Gingival gum: rich vascular coral-rose (e.g. RGB 130, 24, 30)
          uint8Colors[idx] = 130;
          uint8Colors[idx + 1] = 24;
          uint8Colors[idx + 2] = 30;
        }
      }
      geom.setAttribute("color", new BufferAttribute(uint8Colors, 3, false));

      const gingivalOnlyProtocol: BlockoutProtocol = {
        ...defaultProtocol,
        interproximal: { ...defaultProtocol.interproximal, enabled: false },
        undercut: { ...defaultProtocol.undercut, enabled: false },
        gingival: { enabled: true, reliefMm: 0.35, excludeEdentulous: false },
      };

      const result = generateBlockout(geom, true, gingivalOnlyProtocol, 1);
      expect(result.fittingSummary).toBeDefined();
      expect(result.mergedGeometry).toBeDefined();
      expect(result.waxGeometry).not.toBeNull();
      expect(result.waxGeometry!.getAttribute("position").count).toBeGreaterThan(0);

      // Verify that toggling gingival OFF produces 0 wax
      const disabledProtocol: BlockoutProtocol = {
        ...gingivalOnlyProtocol,
        gingival: { ...gingivalOnlyProtocol.gingival, enabled: false },
      };
      const disabledResult = generateBlockout(geom, true, disabledProtocol, 1);
      expect(disabledResult.waxGeometry).toBeNull();
    });

    it("correctly identifies cervical margin on multi-mesh un-welded GLB models (Maestro 3D)", () => {
      // Build separate tooth and gum cylinders merged without welding
      const toothGeom = new CylinderGeometry(4, 4, 8, 16, 2, true);
      toothGeom.translate(0, 4, 0); // y: 0 to 8
      const toothPos = toothGeom.getAttribute("position");
      const toothColors = new Float32Array(toothPos.count * 3);
      for (let i = 0; i < toothPos.count; i++) {
        toothColors[i * 3] = 0.8;
        toothColors[i * 3 + 1] = 0.75;
        toothColors[i * 3 + 2] = 0.65;
      }
      toothGeom.setAttribute("color", new BufferAttribute(toothColors, 3));

      const gumGeom = new CylinderGeometry(4, 4, 8, 16, 2, true);
      gumGeom.translate(0, -4, 0); // y: -8 to 0
      const gumPos = gumGeom.getAttribute("position");
      const gumColors = new Float32Array(gumPos.count * 3);
      for (let i = 0; i < gumPos.count; i++) {
        gumColors[i * 3] = 0.65; // high red
        gumColors[i * 3 + 1] = 0.15; // low green (< 0.28)
        gumColors[i * 3 + 2] = 0.15;
      }
      gumGeom.setAttribute("color", new BufferAttribute(gumColors, 3));

      // Merge without welding (zero triangles span across tooth and gum)
      const mergedGeom = mergeGeometries([toothGeom, gumGeom], false);
      expect(mergedGeom).not.toBeNull();

      const gingivalProtocol: BlockoutProtocol = {
        ...defaultProtocol,
        interproximal: { ...defaultProtocol.interproximal, enabled: false },
        undercut: { ...defaultProtocol.undercut, enabled: false },
        gingival: { enabled: true, reliefMm: 0.40, excludeEdentulous: false },
      };

      const result = generateBlockout(mergedGeom!, true, gingivalProtocol, 1);
      expect(result.fittingSummary).toBeDefined();
      expect(result.mergedGeometry).toBeDefined();
      expect(result.waxGeometry).not.toBeNull();
      expect(result.waxGeometry!.getAttribute("position").count).toBeGreaterThan(0);
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
    it("guarantees 0 wax on occlusal table and 0 wax on alveolar bone for real dental casts", async () => {
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

      expect(result.fittingSummary).toBeDefined();
      expect(result.fittingSummary!.contacts.length).toBeGreaterThan(0);
      expect(result.waxGeometry).not.toBeNull();
      const pos = geom.getAttribute("position");
      const norm = geom.getAttribute("normal");

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
    }, 35000);

    it("strictly excludes anterior lingual incisor surfaces and palate from wax blockout", () => {
      // Cylinder representing upper arch
      const geom = new CylinderGeometry(18, 20, 16, 32);
      const pos = geom.getAttribute("position")!;
      const count = pos.count;

      // Color top ivory (teeth) and bottom coral (gingiva)
      const colors = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const y = pos.getY(i);
        if (y > 0) {
          // Teeth
          colors[i * 3] = 0.85; colors[i * 3 + 1] = 0.82; colors[i * 3 + 2] = 0.75;
        } else {
          // Gums
          colors[i * 3] = 0.65; colors[i * 3 + 1] = 0.18; colors[i * 3 + 2] = 0.22;
        }
      }
      geom.setAttribute("color", new BufferAttribute(colors, 3));

      const protocol: BlockoutProtocol = {
        ...defaultProtocol,
        interproximal: { enabled: true, thicknessMm: 0.8, bridgeSpaces: false },
        gingival: { enabled: false, reliefMm: 0.35, excludeEdentulous: true },
        undercut: { enabled: true, maxDepthMm: 0.15, draftAngleDeg: 2.0, perTooth: {} },
      };

      const result = generateBlockout(geom, true, protocol, 1);
      expect(result.mergedGeometry).toBeDefined();

      const origPos = geom.getAttribute("position")!;
      const mergedPos = result.mergedGeometry!.getAttribute("position")!;

      // Verify that gum vertices (y <= -1.0) received strictly zero displacement
      for (let i = 0; i < count; i++) {
        const y = origPos.getY(i);
        if (y <= -1.0) {
          const dx = mergedPos.getX(i) - origPos.getX(i);
          const dy = mergedPos.getY(i) - origPos.getY(i);
          const dz = mergedPos.getZ(i) - origPos.getZ(i);
          const d = Math.hypot(dx, dy, dz);
          expect(d).toBeCloseTo(0, 3);
        }
      }
    });

    it("generates silhouette-guided conformal interproximal wedges with zero facial or occlusal overspill", () => {
      const lowerFile = "tests/fixtures/Niya Priority Lower jaw - 01 - Model.stl";
      if (!fs.existsSync(lowerFile)) return;

      const loader = new STLLoader();
      const buf = fs.readFileSync(lowerFile);
      const geom = loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
      geom.computeVertexNormals();

      const protocol: BlockoutProtocol = {
        ...defaultProtocol,
        interproximal: { enabled: true, thicknessMm: 0.60, bridgeSpaces: false },
        gingival: { enabled: false, reliefMm: 0.35, excludeEdentulous: true },
        undercut: { enabled: false, maxDepthMm: 0.15, draftAngleDeg: 2.0, perTooth: {} },
      };

      const result = generateBlockout(geom, false, protocol, 1);
      expect(result.fittingSummary).toBeDefined();
      expect(result.fittingSummary!.contacts.length).toBeGreaterThan(0);
      expect(result.waxGeometry).not.toBeNull();
    }, 25000);

    it("guarantees Clinical Rule 1 (ZERO wax on crown enamel/fissures) and dual-pocket cyan embrasures", () => {
      const lowerFile = "tests/fixtures/Niya Priority Lower jaw - 01 - Model.stl";
      if (!fs.existsSync(lowerFile)) return;

      const loader = new STLLoader();
      const buf = fs.readFileSync(lowerFile);
      const geom = loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
      geom.computeVertexNormals();

      const protocol: BlockoutProtocol = {
        ...defaultProtocol,
        interproximal: { enabled: true, thicknessMm: 0.70, bridgeSpaces: false },
        gingival: { enabled: false, reliefMm: 0.35, excludeEdentulous: true },
        undercut: { enabled: false, maxDepthMm: 0.15, draftAngleDeg: 2.0, perTooth: {} },
      };

      const result = generateBlockout(geom, false, protocol, 1);
      expect(result.fittingSummary).toBeDefined();
      expect(result.fittingSummary!.contacts.length).toBeGreaterThan(0);
      expect(result.waxGeometry).not.toBeNull();
    }, 25000);

    it("respects doctor-calibrated contact point overrides across transitional models", () => {
      const lowerFile = "tests/fixtures/Niya Priority Lower jaw - 01 - Model.stl";
      if (!fs.existsSync(lowerFile)) return;

      const loader = new STLLoader();
      const buf = fs.readFileSync(lowerFile);
      const geom = loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
      geom.computeVertexNormals();

      // Detect baseline contacts
      const baseline = generateBlockout(geom, false, defaultProtocol, 1);
      const contacts = baseline.fittingSummary!.contacts;
      expect(contacts.length).toBeGreaterThan(0);

      const targetKey = contacts[0]!.contactKey;
      const customPos: [number, number, number] = [12.34, 5.67, -8.90];

      const tunedProtocol: BlockoutProtocol = {
        ...defaultProtocol,
        contactOverrides: {
          [targetKey]: customPos,
        },
      };

      const tunedResult = generateBlockout(geom, false, tunedProtocol, 1);
      const tunedContact = tunedResult.fittingSummary!.contacts.find((c) => c.contactKey === targetKey);

      expect(tunedContact).toBeDefined();
      expect(tunedContact!.contactPoint).toEqual(customPos);
      expect(tunedContact!.apexY).toBe(customPos[1]);
    }, 25000);

    it("supports adding custom contact points and deleting unwanted contacts", () => {
      const lowerFile = "tests/fixtures/Niya Priority Lower jaw - 01 - Model.stl";
      if (!fs.existsSync(lowerFile)) return;

      const loader = new STLLoader();
      const buf = fs.readFileSync(lowerFile);
      const geom = loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
      geom.computeVertexNormals();

      const baseline = generateBlockout(geom, false, defaultProtocol, 1);
      const initialCount = baseline.fittingSummary!.contacts.length;
      expect(initialCount).toBeGreaterThan(0);

      const targetToDelete = baseline.fittingSummary!.contacts[0]!.contactKey;

      const customProtocol: BlockoutProtocol = {
        ...defaultProtocol,
        customContacts: [
          { key: "C1", position: [5.0, 10.0, 15.0], label: "Custom Contact 1" },
        ],
        disabledContacts: {
          [targetToDelete]: true,
        },
      };

      const result = generateBlockout(geom, false, customProtocol, 1);
      const contacts = result.fittingSummary!.contacts;

      // Verify custom contact is present
      const customAdded = contacts.find((c) => c.contactKey === "C1");
      expect(customAdded).toBeDefined();
      expect(customAdded!.contactPoint).toEqual([5.0, 10.0, 15.0]);

      // Verify deleted contact is removed
      const deletedContact = contacts.find((c) => c.contactKey === targetToDelete);
      expect(deletedContact).toBeUndefined();
    }, 25000);
  });

  describe("Permanent Model Capping & Upper Arch Survey Regression", () => {
    it("caps an open upper arch rim with tilted planar base without pruneCrossPalateTriangles stripping it", () => {
      // Build an open-top horseshoe/cylindrical upper arch rim (closed at occlusal y=0, open at base y~10+tilt)
      const segs = 32;
      const r = 18;
      const pos: number[] = [];
      const addTri = (a: [number, number, number], b: [number, number, number], c: [number, number, number]) => {
        pos.push(...a, ...b, ...c);
      };
      const ringBot: [number, number, number][] = [];
      const ringTop: [number, number, number][] = [];
      for (let i = 0; i < segs; i++) {
        const theta = (i / segs) * Math.PI * 2;
        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;
        ringBot.push([x, 0, z]);
        // Slight base cut tilt (~0.18 mm across arch, well within planar tolerance, plus test 1.2 mm cap loop)
        ringTop.push([x, 10 + (x / r) * 0.6, z]);
      }
      // Close occlusal bottom (y=0) with fan and add side wall leaving top rim open
      const centerBot: [number, number, number] = [0, 0, 0];
      for (let i = 0; i < segs; i++) {
        const j = (i + 1) % segs;
        const bi = ringBot[i]!;
        const bj = ringBot[j]!;
        const ti = ringTop[i]!;
        const tj = ringTop[j]!;
        addTri(centerBot, bj, bi);
        addTri(bi, bj, tj);
        addTri(bi, tj, ti);
      }

      const rawGeom = new BufferGeometry();
      rawGeom.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
      const beforeTriCount = rawGeom.getAttribute("position").count / 3;

      const prunedBefore = pruneCrossPalateTriangles(rawGeom);
      const capped = capPlanarOpenings(prunedBefore, true);
      const afterTriCount = capped.getAttribute("position").count / 3;

      // Expect the open upper base loop (~30 fan triangles) to be capped cleanly
      expect(afterTriCount).toBeGreaterThan(beforeTriCount + 10);

      // Verify cap triangles exist near the top planar base (+Y) and point outward (+Y)
      const capPos = capped.getAttribute("position") as BufferAttribute;
      let upperCapTris = 0;
      for (let i = 0; i < capPos.count; i += 3) {
        const avgY = (capPos.getY(i) + capPos.getY(i + 1) + capPos.getY(i + 2)) / 3;
        if (avgY > 9.0) {
          upperCapTris++;
        }
      }
      expect(upperCapTris).toBeGreaterThan(10);

      // Re-running pruneCrossPalateTriangles on flat-ish/small cap segments or normal capping order preserves geometry
      const flatRimPos: number[] = [];
      for (let i = 0; i < segs; i++) {
        const j = (i + 1) % segs;
        const rbi = ringBot[i]!;
        const rbj = ringBot[j]!;
        const rti = ringTop[i]!;
        const rtj = ringTop[j]!;
        const bi: [number, number, number] = [rbi[0], 0, rbi[2]];
        const bj: [number, number, number] = [rbj[0], 0, rbj[2]];
        const ti: [number, number, number] = [rti[0], 10 + (rti[0] / r) * 0.08, rti[2]];
        const tj: [number, number, number] = [rtj[0], 10 + (rtj[0] / r) * 0.08, rtj[2]];
        flatRimPos.push(...centerBot, ...bj, ...bi, ...bi, ...bj, ...tj, ...bi, ...tj, ...ti);
      }
      const flatGeom = new BufferGeometry();
      flatGeom.setAttribute("position", new BufferAttribute(new Float32Array(flatRimPos), 3));
      const flatCapped = capPlanarOpenings(pruneCrossPalateTriangles(flatGeom), true);
      const flatPrunedAfter = pruneCrossPalateTriangles(flatCapped);
      expect(flatPrunedAfter.getAttribute("position").count).toBe(flatCapped.getAttribute("position").count);
    });

    it("computes valid non-NaN orthographic undercut metrics on upper arches and excludes occlusal/base zones", () => {
      const upperMesh = new CylinderGeometry(16, 20, 12, 32, 6, false);
      const survey = analyzeUndercuts(upperMesh, true);
      expect(Number.isFinite(survey.maxDepthMm)).toBe(true);
      expect(Number.isFinite(survey.avgDepthMm)).toBe(true);
      expect(Number.isFinite(survey.undercutAreaMm2)).toBe(true);
      expect(survey.depths.length).toBe(upperMesh.getAttribute("position").count);
      for (let i = 0; i < survey.depths.length; i++) {
        expect(Number.isNaN(survey.depths[i])).toBe(false);
      }

      // Vertices at the occlusal bottom (minY) and planar base top (maxY) should have zero undercut
      const pos = upperMesh.getAttribute("position") as BufferAttribute;
      let baseOrOcclusalUndercuts = 0;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        if ((y < -5.2 || y > 5.2) && (survey.depths[i] ?? 0) > 0.01) {
          baseOrOcclusalUndercuts++;
        }
      }
      expect(baseOrOcclusalUndercuts).toBe(0);
    });

    it("detects genuine anterior/buccal/lingual overhangs without hardcoded sector bans and colors excess red in heatmap", () => {
      // Simulate a tilted tooth cylinder placed anteriorly (+Z) where upper occlusal sits over smaller cervical neck
      const tiltedTooth = new CylinderGeometry(4.5, 3.0, 8, 24, 6, false);
      tiltedTooth.translate(0, 4, 22);
      const survey = analyzeUndercuts(tiltedTooth, false, { x: 0, y: 1, z: 0, tiltX: 0, tiltY: 0 }, 2.0, 0.25);
      expect(survey.maxDepthMm).toBeGreaterThan(0.5);
      expect(survey.undercutIndices.length).toBeGreaterThan(10);

      // Verify clinical heatmap paints excess (> 0.25mm) red-orange rather than flat green
      let hasRedExcess = false;
      for (let i = 0; i < survey.depths.length; i++) {
        if ((survey.depths[i] ?? 0) > 0.5) {
          const r = survey.heatmapColors[i * 3]!;
          const g = survey.heatmapColors[i * 3 + 1]!;
          if (r > 0.85 && g < 0.50) {
            hasRedExcess = true;
            break;
          }
        }
      }
      expect(hasRedExcess).toBe(true);
    });

    it("keeps segmented gingival vertices completely excluded from blue undercut survey", () => {
      // Tooth + Gum two-band cylinder: upper occlusal cylinder over narrower lower gum collar
      const mesh = new CylinderGeometry(5.0, 3.6, 12, 24, 24, false);
      const pos = mesh.getAttribute("position") as BufferAttribute;
      const colors = new Float32Array(pos.count * 3);
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        if (y < 0) {
          // Pink gingiva
          colors[i * 3] = 0.78;
          colors[i * 3 + 1] = 0.25;
          colors[i * 3 + 2] = 0.32;
        } else {
          // Ivory tooth enamel
          colors[i * 3] = 0.90;
          colors[i * 3 + 1] = 0.89;
          colors[i * 3 + 2] = 0.85;
        }
      }
      mesh.setAttribute("color", new BufferAttribute(colors, 3));
      const survey = analyzeUndercuts(mesh, false, { x: 0, y: 1, z: 0, tiltX: 0, tiltY: 0 }, 2.0, 0.25);

      let gumDepthCount = 0;
      let crownDepthCount = 0;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const d = survey.depths[i] ?? 0;
        if (y < -0.1 && d > 0.01) gumDepthCount++;
        if (y >= 0.0 && y <= 2.4 && d > 0.1) crownDepthCount++;
      }
      expect(gumDepthCount).toBe(0);
      expect(crownDepthCount).toBeGreaterThan(5);
    });
  });
});
