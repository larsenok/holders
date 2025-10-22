import * as THREE from "three";

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#0f0f0f");

// Camera
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 3;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// Card (simple plane)
const geometry = new THREE.PlaneGeometry(1, 1.4, 32);
const material = new THREE.MeshStandardMaterial({ color: "#f97316", roughness: 0.5 });
const card = new THREE.Mesh(geometry, material);
scene.add(card);

// Lighting
const light = new THREE.PointLight("#ffffff", 1.2);
light.position.set(2, 2, 3);
scene.add(light);

// Animate
function animate() {
  requestAnimationFrame(animate);
  card.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
