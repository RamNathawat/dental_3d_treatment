import fs from "node:fs";
import path from "node:path";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { capPlanarOpenings } from "../src/viewer/cap-planar.ts";

// Polyfill FileReader for Node.js GLTFExporter
if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (this.onload) this.onload({ target: this });
        if (this.onloadend) this.onloadend({ target: this });
      }).catch((err) => {
        if (this.onerror) this.onerror(err);
        if (this.onloadend) this.onloadend({ target: this });
      });
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = `data:${blob.type || "application/octet-stream"};base64,${Buffer.from(buf).toString("base64")}`;
        if (this.onload) this.onload({ target: this });
        if (this.onloadend) this.onloadend({ target: this });
      }).catch((err) => {
        if (this.onerror) this.onerror(err);
        if (this.onloadend) this.onloadend({ target: this });
      });
    }
  };
}

const objLoader = new OBJLoader();
const gltfExporter = new GLTFExporter();

const sourceBaseDir = path.resolve("models/NIYA ");
const targetDir = path.resolve("models/Ashina models");

if (!fs.existsSync(sourceBaseDir)) {
  console.error("Source directory not found:", sourceBaseDir);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

const jaws = [
  { name: "Upper", folder: "Niya Priority- Upper" },
  { name: "Lower", folder: "Niya Priority- Lower" },
];

const stages = [
  { stageNum: 1, dirName: "01", isTemplate: false },
  { stageNum: 2, dirName: "02", isTemplate: false },
  { stageNum: 3, dirName: "03", isTemplate: false },
  { stageNum: 4, dirName: "04", isTemplate: false },
  { stageNum: 5, dirName: "05", isTemplate: false },
  { stageNum: 6, dirName: "06", isTemplate: false },
  { stageNum: 7, dirName: "07", isTemplate: false },
  { stageNum: 8, dirName: "08", isTemplate: false },
  { stageNum: 9, dirName: "09", isTemplate: false },
  { stageNum: 10, dirName: "10", isTemplate: false },
  { stageNum: 1, dirName: "01 Template", isTemplate: true },
];

console.log("========================================================");
console.log("Starting Conversion of Clean NIYA OBJ Models to GLB...");
console.log("========================================================");

let totalObjFiles = 0;
let totalGlbBytes = 0;

for (const jaw of jaws) {
  const jawDir = path.join(sourceBaseDir, jaw.folder);

  for (const st of stages) {
    const stageDir = path.join(jawDir, st.dirName);
    if (!fs.existsSync(stageDir)) {
      console.warn(`Stage directory missing: ${stageDir}`);
      continue;
    }

    const pad = String(st.stageNum).padStart(2, "0");
    const outputFilename = st.isTemplate
      ? `Niya Priority ${jaw.name} jaw - ${pad} - Template.glb`
      : `Niya Priority ${jaw.name} jaw - ${pad} - Model.glb`;
    const outputPath = path.join(targetDir, outputFilename);

    console.log(`\nProcessing ${jaw.name} jaw Stage ${st.dirName} -> "${outputFilename}"...`);

    const allFiles = fs.readdirSync(stageDir);
    const filesToLoad = allFiles.filter((f) => {
      if (f === "gum.obj" || f.startsWith("tooth_")) return true;
      if (st.isTemplate && f.startsWith("attachment_")) return true;
      return false;
    });

    totalObjFiles += filesToLoad.length;

    const vertexMap = new Map();
    const newPositions = [];
    const newColors = [];
    const indices = [];

    for (const f of filesToLoad) {
      const filePath = path.join(stageDir, f);
      const text = fs.readFileSync(filePath, "utf8");
      const parsed = objLoader.parse(text);

      for (const child of parsed.children) {
        if (!child.isMesh) continue;
        let geom = child.geometry;
        if (f === "gum.obj") {
          geom = capPlanarOpenings(geom, jaw.name === "Upper");
        }
        const pos = geom.attributes.position;
        const col = geom.attributes.color;

        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          const z = pos.getZ(i);

          const key = `${Math.round(x * 1000)}_${Math.round(y * 1000)}_${Math.round(z * 1000)}`;
          let idx = vertexMap.get(key);
          if (idx === undefined) {
            idx = newPositions.length / 3;
            vertexMap.set(key, idx);
            newPositions.push(x, y, z);
            if (col && i < col.count) {
              const cr = col.getX(i);
              const cg = col.getY(i);
              const cb = col.getZ(i);
              // Preserve distinct green CAD labels or attachment markings (e.g., "NIYA 1", "NIYA 2")
              if (cg > 0.40 && cg > cr * 1.30) {
                newColors.push(cr, cg, cb);
              } else if (f === "gum.obj") {
                newColors.push(0.46, 0.085, 0.105);
              } else {
                newColors.push(0.76, 0.74, 0.72);
              }
            } else {
              if (f === "gum.obj") {
                newColors.push(0.46, 0.085, 0.105);
              } else {
                newColors.push(0.76, 0.74, 0.72);
              }
            }
          }
          indices.push(idx);
        }
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(newPositions, 3));
    geom.setAttribute("color", new THREE.Float32BufferAttribute(newColors, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.35,
      metalness: 0.02,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.name = path.basename(outputFilename, ".glb");

    const glbArrayBuffer = await gltfExporter.parseAsync(mesh, { binary: true });
    const glbBuf = Buffer.from(glbArrayBuffer);

    fs.writeFileSync(outputPath, glbBuf);
    totalGlbBytes += glbBuf.length;

    console.log(
      `✓ Exported "${outputFilename}": ${(glbBuf.length / (1024 * 1024)).toFixed(2)} MB (${(newPositions.length / 3).toLocaleString()} unique vertices, ${(indices.length / 3).toLocaleString()} triangles)`,
    );
  }
}

console.log("\n========================================================");
console.log(`Successfully converted ${totalObjFiles} OBJ files across 22 stages!`);
console.log(`Total output GLB size: ${(totalGlbBytes / (1024 * 1024)).toFixed(1)} MB`);
console.log("========================================================");
