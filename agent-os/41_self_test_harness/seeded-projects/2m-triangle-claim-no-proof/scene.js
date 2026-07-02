// SEEDED DEFECT: Large mesh claim without proof
// Expected detection: threejs, large-mesh

import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();

// Claim: this scene handles 2,000,000 triangleCount triangles (2M tri)
// but there is no renderer.info measurement to back this up
const geometry = new THREE.BufferGeometry();
const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
scene.add(mesh);

// No LOD, no instancing, no renderer.info logging
// triangleCount claim is unverified
