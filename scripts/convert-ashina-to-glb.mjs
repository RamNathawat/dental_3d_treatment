import fs from "node:fs";
import path from "node:path";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { capPlanarOpenings } from "../src/viewer/cap-planar.ts";
import { computeAnatomicalColors } from "../src/viewer/dental-segmentation.ts";

// Polyfill FileReader for Node.js GLTFExporter binary export
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
  };
}

const ashinaDir = path.resolve("models/Ashina models");
const stlFiles = fs.readdirSync(ashinaDir).filter((f) => f.endsWith(".stl")).sort();

console.log(`Found ${stlFiles.length} STL files to convert in ${ashinaDir}`);

const stlLoader = new STLLoader();
const gltfExporter = new GLTFExporter();

let totalStlBytes = 0;
let totalGlbBytes = 0;

for (const file of stlFiles) {
  const stlPath = path.join(ashinaDir, file);
  const glbFilename = file.replace(/\.stl$/i, ".glb");
  const glbPath = path.join(ashinaDir, glbFilename);

  const stlBytes = fs.readFileSync(stlPath);
  totalStlBytes += stlBytes.length;
  const isUpper = !file.toLowerCase().includes("lower");
  const isTemplate = file.toLowerCase().includes("template");

  console.log(`\nProcessing "${file}" (${(stlBytes.length / (1024 * 1024)).toFixed(2)} MB)...`);

  const arrayBuffer = stlBytes.buffer.slice(
    stlBytes.byteOffset,
    stlBytes.byteOffset + stlBytes.byteLength,
  );

  const raw = stlLoader.parse(arrayBuffer);
  const capped = capPlanarOpenings(raw, isUpper);
  capped.computeVertexNormals();

  if (!isTemplate) {
    computeAnatomicalColors(capped, isUpper ? "Upper" : "Lower");
  }

  // Fast vertex welder to create indexed BufferGeometry
  const posAttr = capped.getAttribute("position");
  const normAttr = capped.getAttribute("normal");
  const colAttr = capped.getAttribute("color");

  const vertexMap = new Map();
  const newPositions = [];
  const newNormals = [];
  const newColors = [];
  const indices = [];

  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const z = posAttr.getZ(i);

    const kx = Math.round(x * 1000);
    const ky = Math.round(y * 1000);
    const kz = Math.round(z * 1000);
    const key = `${kx}_${ky}_${kz}`;

    let idx = vertexMap.get(key);
    if (idx === undefined) {
      idx = newPositions.length / 3;
      vertexMap.set(key, idx);

      newPositions.push(x, y, z);
      if (normAttr) {
        newNormals.push(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i));
      }
      if (colAttr) {
        newColors.push(colAttr.getX(i), colAttr.getY(i), colAttr.getZ(i));
      }
    }
    indices.push(idx);
  }

  const indexedGeom = new THREE.BufferGeometry();
  indexedGeom.setAttribute("position", new THREE.Float32BufferAttribute(newPositions, 3));
  if (normAttr) indexedGeom.setAttribute("normal", new THREE.Float32BufferAttribute(newNormals, 3));
  if (colAttr) indexedGeom.setAttribute("color", new THREE.Float32BufferAttribute(newColors, 3));
  indexedGeom.setIndex(indices);

  const material = new THREE.MeshStandardMaterial({
    vertexColors: Boolean(colAttr),
    roughness: 0.36,
    metalness: 0.01,
  });

  const mesh = new THREE.Mesh(indexedGeom, material);
  mesh.name = path.basename(file, ".stl");

  const glbArrayBuffer = await gltfExporter.parseAsync(mesh, { binary: true });
  const glbBuffer = Buffer.from(glbArrayBuffer);

  fs.writeFileSync(glbPath, glbBuffer);
  totalGlbBytes += glbBuffer.length;

  const reduction = ((1 - glbBuffer.length / stlBytes.length) * 100).toFixed(1);
  console.log(
    `✓ Converted to "${glbFilename}": ${(glbBuffer.length / (1024 * 1024)).toFixed(2)} MB (${reduction}% smaller!)`,
  );
}

console.log("\n========================================================");
console.log(`Total original STL size: ${(totalStlBytes / (1024 * 1024)).toFixed(1)} MB`);
console.log(`Total optimized GLB size: ${(totalGlbBytes / (1024 * 1024)).toFixed(1)} MB`);
console.log(`Overall reduction: ${((1 - totalGlbBytes / totalStlBytes) * 100).toFixed(1)}%`);
console.log("========================================================");
