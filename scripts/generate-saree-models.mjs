import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';

// Node.js FileReader polyfill for GLTFExporter
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buffer) => {
        this.result = buffer;
        if (this.onloadend) this.onloadend();
        if (this.onload) this.onload({ target: this });
      });
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((buffer) => {
        this.result = 'data:application/octet-stream;base64,' + Buffer.from(buffer).toString('base64');
        if (this.onloadend) this.onloadend();
        if (this.onload) this.onload({ target: this });
      });
    }
  };
}

const outputDir = path.resolve('public/models/test');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function createSareeModel({ bodyColor, zariColor, accentColor, name }) {
  const group = new THREE.Group();
  group.name = name;

  // Materials
  const silkMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(bodyColor),
    roughness: 0.52,
    metalness: 0.12,
    bumpScale: 0.05,
  });

  const zariMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(zariColor),
    roughness: 0.28,
    metalness: 0.85,
  });

  const accentMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(accentColor),
    roughness: 0.45,
    metalness: 0.2,
  });

  const standMaterial = new THREE.MeshStandardMaterial({
    color: 0x1f1814,
    roughness: 0.35,
    metalness: 0.75,
  });

  // 1. Mannequin Stand Base & Neck
  const baseGeo = new THREE.CylinderGeometry(0.35, 0.38, 0.04, 32);
  const baseMesh = new THREE.Mesh(baseGeo, standMaterial);
  baseMesh.position.y = -1.22;
  group.add(baseMesh);

  const poleGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.4, 16);
  const poleMesh = new THREE.Mesh(poleGeo, standMaterial);
  poleMesh.position.y = 0;
  group.add(poleMesh);

  // Neck / Form top
  const neckGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.25, 24);
  const neckMesh = new THREE.Mesh(neckGeo, standMaterial);
  neckMesh.position.y = 0.95;
  group.add(neckMesh);

  const finialGeo = new THREE.SphereGeometry(0.06, 16, 16);
  const finialMesh = new THREE.Mesh(finialGeo, zariMaterial);
  finialMesh.position.y = 1.1;
  group.add(finialMesh);

  // 2. Torso / Blouse bodice
  const torsoGeo = new THREE.CylinderGeometry(0.24, 0.19, 0.65, 32);
  const torsoMesh = new THREE.Mesh(torsoGeo, silkMaterial);
  torsoMesh.position.y = 0.55;
  group.add(torsoMesh);

  // Blouse Zari Border Trim
  const blouseBorderGeo = new THREE.TorusGeometry(0.21, 0.015, 12, 32);
  const blouseBorderMesh = new THREE.Mesh(blouseBorderGeo, zariMaterial);
  blouseBorderMesh.rotation.x = Math.PI / 2;
  blouseBorderMesh.position.y = 0.35;
  group.add(blouseBorderMesh);

  // 3. Lower Saree Skirt (Flared conical silhouette)
  const skirtGeo = new THREE.CylinderGeometry(0.2, 0.44, 1.45, 32, 1, true);
  const skirtMesh = new THREE.Mesh(skirtGeo, silkMaterial);
  skirtMesh.position.y = -0.45;
  group.add(skirtMesh);

  // 4. Skirt Bottom Grand Zari Border
  const hemBorderGeo = new THREE.CylinderGeometry(0.435, 0.45, 0.24, 32, 1, true);
  const hemBorderMesh = new THREE.Mesh(hemBorderGeo, zariMaterial);
  hemBorderMesh.position.y = -1.06;
  group.add(hemBorderMesh);

  // Secondary Accent line on hem
  const hemAccentGeo = new THREE.CylinderGeometry(0.428, 0.435, 0.04, 32, 1, true);
  const hemAccentMesh = new THREE.Mesh(hemAccentGeo, accentMaterial);
  hemAccentMesh.position.y = -0.92;
  group.add(hemAccentMesh);

  // 5. Front Pleats (Kosu) - Authentic vertical cascading pleats
  const pleatCount = 7;
  for (let i = 0; i < pleatCount; i++) {
    const angleOffset = (i - pleatCount / 2) * 0.055;
    const depth = 0.02 + i * 0.005;
    const pleatGeo = new THREE.BoxGeometry(0.045, 1.35, depth);
    const pleatMesh = new THREE.Mesh(pleatGeo, silkMaterial);
    pleatMesh.position.set(angleOffset, -0.48, 0.23 + (i % 2) * 0.015);
    pleatMesh.rotation.z = angleOffset * 0.3;
    group.add(pleatMesh);

    // Zari edge on each front pleat tip
    const pleatZariGeo = new THREE.BoxGeometry(0.045, 0.18, depth + 0.004);
    const pleatZariMesh = new THREE.Mesh(pleatZariGeo, zariMaterial);
    pleatZariMesh.position.set(angleOffset, -1.08, 0.235 + (i % 2) * 0.015);
    group.add(pleatZariMesh);
  }

  // 6. Diagonal Pallu Sweep (Torso wrap across bust to left shoulder)
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.22, 0.25, 0.12),
    new THREE.Vector3(0.12, 0.45, 0.22),
    new THREE.Vector3(-0.08, 0.65, 0.21),
    new THREE.Vector3(-0.25, 0.82, 0.08),
    new THREE.Vector3(-0.28, 0.8, -0.12),
  ]);
  const palluSweepGeo = new THREE.TubeGeometry(curve, 32, 0.065, 16, false);
  const palluSweepMesh = new THREE.Mesh(palluSweepGeo, silkMaterial);
  group.add(palluSweepMesh);

  // Zari border running along the pallu chest sweep
  const zariCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.24, 0.24, 0.16),
    new THREE.Vector3(0.14, 0.44, 0.26),
    new THREE.Vector3(-0.06, 0.64, 0.25),
    new THREE.Vector3(-0.24, 0.83, 0.12),
    new THREE.Vector3(-0.27, 0.81, -0.09),
  ]);
  const zariSweepGeo = new THREE.TubeGeometry(zariCurve, 32, 0.02, 12, false);
  const zariSweepMesh = new THREE.Mesh(zariSweepGeo, zariMaterial);
  group.add(zariSweepMesh);

  // 7. Cascading Pallu falling gracefully down the back & left side
  const drapeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.28, 0.8, -0.12),
    new THREE.Vector3(-0.32, 0.35, -0.18),
    new THREE.Vector3(-0.35, -0.2, -0.21),
    new THREE.Vector3(-0.37, -0.75, -0.22),
    new THREE.Vector3(-0.38, -1.1, -0.22),
  ]);
  const drapeGeo = new THREE.TubeGeometry(drapeCurve, 32, 0.11, 16, false);
  const drapeMesh = new THREE.Mesh(drapeGeo, silkMaterial);
  group.add(drapeMesh);

  // Grand Gold Pallu End-Piece
  const palluEndGeo = new THREE.BoxGeometry(0.26, 0.45, 0.04);
  const palluEndMesh = new THREE.Mesh(palluEndGeo, zariMaterial);
  palluEndMesh.position.set(-0.36, -0.88, -0.2);
  palluEndMesh.rotation.y = 0.2;
  group.add(palluEndMesh);

  // 8. Traditional Gold Zari Waistband (Oddiyanam / Belt)
  const beltGeo = new THREE.TorusGeometry(0.21, 0.02, 16, 32);
  const beltMesh = new THREE.Mesh(beltGeo, zariMaterial);
  beltMesh.rotation.x = Math.PI / 2;
  beltMesh.position.y = 0.28;
  group.add(beltMesh);

  const buckleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16);
  const buckleMesh = new THREE.Mesh(buckleGeo, zariMaterial);
  buckleMesh.position.set(0, 0.28, 0.21);
  buckleMesh.rotation.x = Math.PI / 2;
  group.add(buckleMesh);

  return group;
}

const exporter = new GLTFExporter();

const productsToGenerate = [
  {
    name: 'Royal Maroon',
    filename: 'royal-maroon.glb',
    bodyColor: 0x641424,
    zariColor: 0xd4af37,
    accentColor: 0x420d18,
  },
  {
    name: 'Temple Green',
    filename: 'temple-green.glb',
    bodyColor: 0x154734,
    zariColor: 0xd4af37,
    accentColor: 0x0d2e22,
  },
  {
    name: 'Heritage Gold',
    filename: 'heritage-gold.glb',
    bodyColor: 0xb8860b,
    zariColor: 0xf3d26a,
    accentColor: 0x8a1b24,
  },
];

async function generateAll() {
  for (const item of productsToGenerate) {
    const model = createSareeModel(item);
    await new Promise((resolve, reject) => {
      exporter.parse(
        model,
        (result) => {
          const filePath = path.join(outputDir, item.filename);
          fs.writeFileSync(filePath, Buffer.from(result));
          console.log(`Generated GLB: ${filePath} (${result.byteLength} bytes)`);
          resolve();
        },
        (error) => {
          console.error(`Failed to export ${item.name}:`, error);
          reject(error);
        },
        { binary: true }
      );
    });
  }
}

generateAll().then(() => {
  console.log('All 3D GLB test models generated successfully!');
}).catch(console.error);
