import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

// --- Scene setup -----------------------------------------------------------
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x04040a, 0.18);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.6, 6);
camera.lookAt(0, 0.5, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.appendChild(renderer.domElement);

// --- Post processing (subtle bloom) ---------------------------------------
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.4, 0.8, 0.1);
bloomPass.enabled = true;
composer.addPass(bloomPass);

// --- Lighting --------------------------------------------------------------
const ambientLight = new THREE.HemisphereLight(0x6b81ff, 0x050505, 0.6);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xc3cfff, 1.1);
keyLight.position.set(5, 6, 4);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffaacc, 0.6);
fillLight.position.set(-4, 3, -5);
scene.add(fillLight);

// --- Audio -----------------------------------------------------------------
const listener = new THREE.AudioListener();
camera.add(listener);

const ambientAudio = new THREE.Audio(listener);
ambientAudio.setLoop(true);
ambientAudio.setVolume(0.25);
ambientAudio.hasPlaybackControl = true;

const flipAudio = new THREE.Audio(listener);
flipAudio.setVolume(0.6);

// Generate soft ambient pad and flip pluck tones procedurally.
const audioContext = listener.context;
function createSineBuffer(duration, frequency, gain = 0.2, attack = 0.2, release = 0.3) {
  const sampleRate = audioContext.sampleRate;
  const frameCount = Math.floor(sampleRate * duration);
  const buffer = audioContext.createBuffer(1, frameCount, sampleRate);
  const channel = buffer.getChannelData(0);

  for (let i = 0; i < frameCount; i++) {
    const t = i / sampleRate;
    const env = t < attack
      ? t / attack
      : t > duration - release
      ? Math.max(0, (duration - t) / release)
      : 1;
    channel[i] = Math.sin(2 * Math.PI * frequency * t) * gain * env;
  }
  return buffer;
}

ambientAudio.setBuffer(createSineBuffer(8, 110, 0.15));
ambientAudio.offset = 0;

let audioStarted = false;
async function startAmbient() {
  if (audioStarted) return;
  try {
    await audioContext.resume();
  } catch (err) {
    // ignore resume failures, browser may already be running
  }
  try {
    await ambientAudio.play();
    audioStarted = true;
  } catch (err) {
    // playback will retry on next user gesture
  }
}

const flipBaseFreqs = [220, 330, 440, 550];

function playFlipTone() {
  startAmbient();
  const freq = flipBaseFreqs[Math.floor(Math.random() * flipBaseFreqs.length)] * THREE.MathUtils.randFloat(0.8, 1.2);
  const buffer = createSineBuffer(0.5, freq, 0.3, 0.05, 0.4);
  flipAudio.setBuffer(buffer);
  flipAudio.play();
}

// --- Background gradient + dust -------------------------------------------
const backgroundUniforms = {
  uTime: { value: 0 },
  uColorA: { value: new THREE.Color(0x050711) },
  uColorB: { value: new THREE.Color(0x111e33) },
};

const backgroundGeometry = new THREE.SphereGeometry(50, 32, 32);
const backgroundMaterial = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  uniforms: backgroundUniforms,
  vertexShader: /* glsl */ `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  fragmentShader: /* glsl */ `
    varying vec3 vWorldPosition;
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    void main() {
      float height = normalize(vWorldPosition).y * 0.5 + 0.5;
      float hueShift = sin(uTime * 0.03 + height * 5.0) * 0.1;
      vec3 color = mix(uColorA, uColorB, height + hueShift);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
});
scene.add(new THREE.Mesh(backgroundGeometry, backgroundMaterial));

const dustCount = 600;
const dustGeometry = new THREE.BufferGeometry();
const dustPositions = new Float32Array(dustCount * 3);
const dustSpeeds = new Float32Array(dustCount);

for (let i = 0; i < dustCount; i++) {
  const i3 = i * 3;
  dustPositions[i3] = THREE.MathUtils.randFloatSpread(20);
  dustPositions[i3 + 1] = THREE.MathUtils.randFloatSpread(12);
  dustPositions[i3 + 2] = THREE.MathUtils.randFloatSpread(20);
  dustSpeeds[i] = THREE.MathUtils.randFloat(0.02, 0.08);
}

dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));

const dustMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.05,
  transparent: true,
  opacity: 0.25,
  depthWrite: false,
});
const dust = new THREE.Points(dustGeometry, dustMaterial);
scene.add(dust);

// --- Card definitions ------------------------------------------------------
const cardWords = [
  "Calm",
  "Shift",
  "Echo",
  "Spark",
  "Drift",
  "Glow",
  "Trace",
  "Breathe",
  "Merge",
  "Still",
  "Pulse",
  "Bloom",
  "Flow",
  "Rise",
  "Dream",
];

// Helper to create gradient texture for each session.
function createGradientTexture(colorStops) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  colorStops.forEach(([stop, color]) => gradient.addColorStop(stop, color));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const paletteOptions = [
  [[0, "#23395d"], [1, "#3a6073"]],
  [[0, "#3a1c71"], [1, "#d76d77"]],
  [[0, "#093028"], [1, "#237a57"]],
  [[0, "#1f4037"], [1, "#99f2c8"]],
  [[0, "#0f0c29"], [1, "#302b63"]],
  [[0, "#1a2a6c"], [1, "#fdbb2d"]],
];

function randomPalette() {
  return paletteOptions[Math.floor(Math.random() * paletteOptions.length)];
}

// Card group container
const cardsGroup = new THREE.Group();
scene.add(cardsGroup);

// Card store
const cards = [];
let flipsThisRound = 0;
const flipsBeforeReset = 5;

const cardCount = THREE.MathUtils.randInt(10, 15);

function shuffleWords() {
  return [...cardWords].sort(() => Math.random() - 0.5);
}

let availableWords = shuffleWords();

function drawWord() {
  if (availableWords.length === 0) {
    availableWords = shuffleWords();
  }
  return availableWords.pop();
}

function createCardLabelTexture(word) {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, size, size);
  const bgGradient = ctx.createRadialGradient(size * 0.5, size * 0.45, size * 0.1, size * 0.5, size * 0.55, size * 0.5);
  bgGradient.addColorStop(0, "rgba(255,255,255,0.15)");
  bgGradient.addColorStop(1, "rgba(255,255,255,0.02)");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, size, size);
  ctx.font = "bold 120px 'Helvetica Neue', Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(word, size / 2, size / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createCard(positionIndex) {
  const palette = randomPalette();
  const frontTexture = createGradientTexture(palette);
  const backWord = drawWord();
  const backTexture = createCardLabelTexture(backWord);

  const frontMaterial = new THREE.MeshPhysicalMaterial({
    map: frontTexture,
    metalness: 0.2,
    roughness: 0.15,
    transmission: 0.68,
    thickness: 0.4,
    transparent: true,
    envMapIntensity: 1.0,
    reflectivity: 0.4,
  });

  const backMaterial = new THREE.MeshPhysicalMaterial({
    map: backTexture,
    metalness: 0.1,
    roughness: 0.2,
    emissive: new THREE.Color(palette[1][1]).multiplyScalar(0.15),
    transmission: 0.25,
    transparent: true,
  });

  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(palette[1][1]).offsetHSL(0, 0, -0.2),
    roughness: 0.35,
    metalness: 0.5,
  });

  const cardThickness = 0.06;
  const cardWidth = 1;
  const cardHeight = 1.45;

  const cardGroup = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(cardWidth, cardHeight, cardThickness), [frontMaterial, frontMaterial, edgeMaterial, edgeMaterial, frontMaterial, backMaterial]);
  body.castShadow = true;
  body.receiveShadow = true;

  cardGroup.add(body);

  // Text floating above surface for extra depth.
  const textMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.8, 0.2),
    new THREE.MeshBasicMaterial({
      map: createCardLabelTexture(backWord),
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
  );
  textMesh.position.z = cardThickness * 0.6;
  cardGroup.add(textMesh);

  const radius = 3.2;
  const angle = positionIndex * ((Math.PI * 2) / cardCount);
  cardGroup.position.set(Math.cos(angle) * radius * THREE.MathUtils.randFloat(0.75, 1.05), THREE.MathUtils.randFloat(-0.6, 1.4), Math.sin(angle) * radius * THREE.MathUtils.randFloat(0.75, 1.05));
  cardGroup.rotation.y = angle + Math.PI * 0.5;

  const wobbleAxis = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
  const wobbleSpeed = THREE.MathUtils.randFloat(0.3, 0.7);

  const cardData = {
    group: cardGroup,
    mesh: body,
    text: textMesh,
    frontTexture,
    backTexture,
    isFlipping: false,
    flipProgress: 0,
    targetRotation: 0,
    baseRotation: cardGroup.rotation.y,
    reveal: false,
    wobbleAxis,
    wobbleSpeed,
    wobbleOffset: Math.random() * Math.PI * 2,
    driftOffset: new THREE.Vector3().randomDirection().multiplyScalar(0.05),
  };

  cardsGroup.add(cardGroup);
  cards.push(cardData);
}

for (let i = 0; i < cardCount; i++) {
  createCard(i);
}

// --- Interaction -----------------------------------------------------------
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let hoveredCard = null;

function setPointerFromEvent(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  pointer.set(x * 2 - 1, -(y * 2 - 1));
}

function flipCard(card) {
  if (!card || card.isFlipping) return;
  card.isFlipping = true;
  card.flipProgress = 0;
  card.reveal = false;
  flipsThisRound += 1;
  playFlipTone();
  spawnFlipParticles(card.group.position);
  nudgeCamera(card.group.position);

  if (flipsThisRound >= flipsBeforeReset) {
    setTimeout(resetDeck, 1400);
  }
}

window.addEventListener("pointermove", (event) => {
  setPointerFromEvent(event);
});

window.addEventListener("pointerdown", () => {
  startAmbient();
});

window.addEventListener("click", (event) => {
  setPointerFromEvent(event);
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(cards.map((c) => c.mesh));
  if (intersects.length > 0) {
    const mesh = intersects[0].object;
    const card = cards.find((c) => c.mesh === mesh);
    flipCard(card);
  }
});

window.addEventListener("touchstart", (event) => {
  if (event.touches.length > 0) {
    const touch = event.touches[0];
    setPointerFromEvent(touch);
    startAmbient();
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(cards.map((c) => c.mesh));
    if (intersects.length > 0) {
      const mesh = intersects[0].object;
      const card = cards.find((c) => c.mesh === mesh);
      flipCard(card);
    }
  }
});

window.addEventListener("keydown", (event) => {
  startAmbient();
  if (event.key.toLowerCase() === "r") {
    resetDeck();
  }
});

// --- Flip reaction helpers -------------------------------------------------
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute([], 3));
const particleMaterial = new THREE.PointsMaterial({
  color: 0xffeedd,
  size: 0.1,
  transparent: true,
  opacity: 1,
  depthWrite: false,
});

const activeBursts = [];

function spawnFlipParticles(position) {
  const count = 20;
  const positions = [];
  for (let i = 0; i < count; i++) {
    positions.push(position.x, position.y, position.z);
  }
  const geometry = particleGeometry.clone();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  const particles = new THREE.Points(geometry, particleMaterial.clone());
  particles.userData = { startTime: performance.now(), count };
  scene.add(particles);
  activeBursts.push(particles);
}

let cameraDrift = new THREE.Vector3();
function nudgeCamera(targetPosition) {
  const direction = new THREE.Vector3().subVectors(targetPosition, camera.position);
  cameraDrift.add(direction.multiplyScalar(0.02));
}

// --- Deck reset ------------------------------------------------------------
function resetDeck() {
  flipsThisRound = 0;
  availableWords = shuffleWords();
  cards.forEach((card, index) => {
    const newPalette = randomPalette();
    const newFrontTexture = createGradientTexture(newPalette);
    const newWord = drawWord();
    const newBackTexture = createCardLabelTexture(newWord);
    card.frontTexture.dispose();
    card.backTexture.dispose();
    card.frontTexture = newFrontTexture;
    card.backTexture = newBackTexture;
    card.mesh.material[0].map = newFrontTexture;
    card.mesh.material[1].map = newFrontTexture;
    card.mesh.material[4].map = newFrontTexture;
    card.mesh.material[5].map = newBackTexture;
    card.mesh.material[5].emissive = new THREE.Color(newPalette[1][1]).multiplyScalar(0.15);
    card.text.material.map.dispose();
    card.text.material.map = createCardLabelTexture(newWord);
    card.text.material.opacity = 0;

    const radius = 3.2;
    const angle = index * ((Math.PI * 2) / cards.length) + Math.random() * 0.4;
    card.group.position.set(
      Math.cos(angle) * radius * THREE.MathUtils.randFloat(0.75, 1.05),
      THREE.MathUtils.randFloat(-0.6, 1.4),
      Math.sin(angle) * radius * THREE.MathUtils.randFloat(0.75, 1.05)
    );
    card.group.rotation.y = angle + Math.PI * 0.5;
    card.baseRotation = card.group.rotation.y;
    card.isFlipping = false;
    card.flipProgress = 0;
    card.reveal = false;
  });
}

// --- Animation loop --------------------------------------------------------
const clock = new THREE.Clock();

function updateCards(delta) {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(cards.map((c) => c.mesh));
  hoveredCard = intersects.length > 0 ? cards.find((c) => c.mesh === intersects[0].object) : null;

  cards.forEach((card) => {
    const { group, mesh, text } = card;

    // Idle motion
    const wobble = Math.sin(clock.elapsedTime * card.wobbleSpeed + card.wobbleOffset) * 0.06;
    const subtleDrift = Math.sin(clock.elapsedTime * 0.18 + card.wobbleOffset) * 0.04;
    group.quaternion.slerp(
      new THREE.Quaternion().setFromAxisAngle(card.wobbleAxis, wobble),
      0.08
    );
    group.position.addScaledVector(card.driftOffset, Math.sin(clock.elapsedTime * 0.12 + card.wobbleOffset) * 0.0025);
    group.position.y += Math.sin(clock.elapsedTime * 0.7 + card.wobbleOffset) * 0.0008;

    if (hoveredCard === card && !card.isFlipping) {
      group.position.y += 0.01;
    }

    // Flip animation
    if (card.isFlipping) {
      card.flipProgress += delta * 1.8;
      const progress = Math.min(card.flipProgress, 1);
      const rotation = THREE.MathUtils.smoothstep(progress, 0, 1) * Math.PI;
      mesh.rotation.y = rotation;
      text.material.opacity = THREE.MathUtils.smoothstep(progress, 0.5, 1);

      if (!card.reveal && progress > 0.5) {
        card.reveal = true;
      }

      if (progress >= 1) {
        card.isFlipping = false;
        card.flipProgress = 0;
        setTimeout(() => {
          text.material.opacity = 0;
          mesh.rotation.y = 0;
        }, 1500);
      }
    } else {
      mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, 0, 0.08);
      text.material.opacity = THREE.MathUtils.lerp(text.material.opacity, 0, 0.04);
    }

    // Gentle orbit motion
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, card.baseRotation + subtleDrift, 0.02);
  });
}

function updateDust(delta) {
  const positions = dustGeometry.attributes.position.array;
  for (let i = 0; i < dustCount; i++) {
    const i3 = i * 3;
    positions[i3 + 1] += Math.sin(clock.elapsedTime * dustSpeeds[i] + i) * 0.0008;
    positions[i3] += Math.cos(clock.elapsedTime * dustSpeeds[i] * 0.4 + i) * 0.0008;
  }
  dustGeometry.attributes.position.needsUpdate = true;
}

function updateParticles() {
  const now = performance.now();
  for (let i = activeBursts.length - 1; i >= 0; i--) {
    const burst = activeBursts[i];
    const age = (now - burst.userData.startTime) / 1000;
    const positions = burst.geometry.attributes.position;
    const array = positions.array;
    for (let j = 0; j < burst.userData.count; j++) {
      const idx = j * 3;
      array[idx] += (Math.random() - 0.5) * 0.02;
      array[idx + 1] += Math.random() * 0.02;
      array[idx + 2] += (Math.random() - 0.5) * 0.02;
    }
    positions.needsUpdate = true;
    const material = burst.material;
    material.opacity = THREE.MathUtils.lerp(material.opacity, 0, 0.12);
    material.size = THREE.MathUtils.lerp(material.size, 0.02, 0.1);
    if (age > 1) {
      scene.remove(burst);
      burst.geometry.dispose();
      burst.material.dispose();
      activeBursts.splice(i, 1);
    }
  }
}

function updateCamera(delta) {
  camera.position.addScaledVector(cameraDrift, 0.03);
  camera.lookAt(0, 0.5, 0);
  cameraDrift.multiplyScalar(0.92);
  const slowOrbit = Math.sin(clock.elapsedTime * 0.05) * 0.25;
  camera.position.x = slowOrbit;
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  backgroundUniforms.uTime.value += delta * 60;
  updateCards(delta);
  updateDust(delta);
  updateParticles();
  updateCamera(delta);
  composer.render();
}
animate();

// --- Resize ----------------------------------------------------------------
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  bloomPass.setSize(window.innerWidth, window.innerHeight);
});

// --- Guidance comments -----------------------------------------------------
// To introduce new moods: add their labels into `cardWords`. The drawWord() helper
// automatically cycles through them between resets. To give specific reactions per mood,
// extend flipCard() to check the revealed word and trigger custom particle colors,
// lights, or camera motions tailored to that mood.
