import fs from "node:fs";
import path from "node:path";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Polyfill FileReader for Node.js GLTFExporter binary export
globalThis.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
    });
  }
};

const modelsDir = path.resolve("models");
const stlFiles = fs.readdirSync(modelsDir).filter((f) => f.endsWith(".stl"));

console.log(`Found ${stlFiles.length} STL files to convert in ${modelsDir}`);

const stlLoader = new STLLoader();
const gltfExporter = new GLTFExporter();

for (const file of stlFiles) {
  const stlPath = path.join(modelsDir, file);
  const glbFilename = file.replace(/\.stl$/i, ".glb");
  const glbPath = path.join(modelsDir, glbFilename);

  const stlBytes = fs.readFileSync(stlPath);
  console.log(`\nProcessing "${file}" (${(stlBytes.length / (1024 * 1024)).toFixed(2)} MB)...`);

  const arrayBuffer = stlBytes.buffer.slice(
    stlBytes.byteOffset,
    stlBytes.byteOffset + stlBytes.byteLength,
  );

  let geometry = stlLoader.parse(arrayBuffer);

  // Deduplicate and index vertices for massive size reduction
  geometry = BufferGeometryUtils.mergeVertices(geometry);
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    color: 0xf2ede8,
    roughness: 0.28,
    metalness: 0.04,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = path.basename(file, ".stl");

  const glbArrayBuffer = await gltfExporter.parseAsync(mesh, { binary: true });
  const glbBuffer = Buffer.from(glbArrayBuffer);

  fs.writeFileSync(glbPath, glbBuffer);
  const reduction = (
    (1 - glbBuffer.length / stlBytes.length) *
    100
  ).toFixed(1);

  console.log(
    `✓ Converted to "${glbFilename}": ${(glbBuffer.length / (1024 * 1024)).toFixed(2)} MB (${reduction}% smaller!)`,
  );
}

console.log("\nAll files converted successfully!");
