const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// --- 1. SİYAH DELİK (KARA DELİK / GİRDAP) ---
const holeGeo = new THREE.CircleGeometry(2.5, 64);
const holeMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
const blackHole = new THREE.Mesh(holeGeo, holeMat);
blackHole.rotation.x = Math.PI / 2;
scene.add(blackHole);

// --- 2. PARILTI DOKUSU OLUSTURMA ---
function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 0, 127, 0.8)');
    gradient.addColorStop(0.6, 'rgba(128, 0, 128, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
}

// --- 3. GALAKSİ PARÇACIKLARI (GİRDAP TOZLARI) ---
const count = 3500;
const particleGeo = new THREE.BufferGeometry();
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

const c1 = new THREE.Color(0xff007f);
const c2 = new THREE.Color(0xff66cc);

for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 2) * 14 + 2.5;
    const angle = r * 1.8 + ((i % 2) * Math.PI);
    
    positions[i * 3] = Math.cos(angle) * r + (Math.random() - 0.5) * 0.4;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
    positions[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * 0.4;

    const mixed = c1.clone().lerp(c2, Math.random());
    colors[i * 3] = mixed.r;
    colors[i * 3 + 1] = mixed.g;
    colors[i * 3 + 2] = mixed.b;
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particleMat = new THREE.PointsMaterial({
    size: 0.35,
    map: createGlowTexture(),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexColors: true
});

const galaxyParticles = new THREE.Points(particleGeo, particleMat);
scene.add(galaxyParticles);

// --- 4. 3D KALP GEOMETRİSİ (YÜZEN PEMBE KALPLER) ---
function create3DHeart() {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.2);
    shape.bezierCurveTo(0, 0.2, -0.25, 0.5, -0.5, 0.2);
    shape.bezierCurveTo(-0.5, -0.1, 0, -0.5, 0, -0.5);
    shape.bezierCurveTo(0, -0.5, 0.5, -0.1, 0.5, 0.2);
    shape.bezierCurveTo(0.25, 0.5, 0, 0.2, 0, 0.2);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 });
}

const heartGeo = create3DHeart();
const heartMat = new THREE.MeshBasicMaterial({ color: 0xff007f });
const heartGroup = new THREE.Group();

const heartCount = 120;
for (let i = 0; i < heartCount; i++) {
    const mesh = new THREE.Mesh(heartGeo, heartMat);
    const radius = 3.5 + Math.random() * 11;
    const angle = Math.random() * Math.PI * 2;
    
    mesh.position.x = Math.cos(angle) * radius;
    mesh.position.z = Math.sin(angle) * radius;
    mesh.position.y = (Math.random() - 0.5) * 1.5;
    
    mesh.scale.set(0.3, 0.3, 0.3);
    mesh.rotation.x = Math.PI / 2;
    mesh.rotation.z = Math.random() * Math.PI;

    heartGroup.add(mesh);
}
scene.add(heartGroup);

// --- 5. YÖRÜNGEDE DÖNEN YAZILAR ---
const textGroup = new THREE.Group();
const texts = ["HAPPY BIRTHDAY", "AMOR DE MI VIDA", "ERES MAGIA", "FELIZ CUMPLEAÑOS", "TE ADORO", "MI AMOR ETERNO"];

function createTextCanvas(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.font = 'Bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = 12;
    ctx.fillText(text, 256, 45);
    return new THREE.CanvasTexture(canvas);
}

texts.forEach((txt, idx) => {
    const tex = createTextCanvas(txt);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    
    const angle = (idx / texts.length) * Math.PI * 2;
    const r = 7 + (idx % 2) * 3;
    sprite.position.x = Math.cos(angle) * r;
    sprite.position.z = Math.sin(angle) * r;
    sprite.position.y = (Math.random() - 0.5) * 1.5;
    sprite.scale.set(4, 0.5, 1);
    
    textGroup.add(sprite);
});
scene.add(textGroup);

// --- 6. MERKEZDEKİ BÜYÜK NEON KALP ---
const bigHeartShape = new THREE.Shape();
bigHeartShape.moveTo(0, 0.5);
bigHeartShape.bezierCurveTo(0, 0.5, -0.6, 1.2, -1.2, 0.5);
bigHeartShape.bezierCurveTo(-1.2, -0.3, 0, -1.2, 0, -1.2);
bigHeartShape.bezierCurveTo(0, -1.2, 1.2, -0.3, 1.2, 0.5);
bigHeartShape.bezierCurveTo(0.6, 1.2, 0, 0.5, 0, 0.5);

const bigHeartGeo = new THREE.ShapeGeometry(bigHeartShape);
const bigHeartMat = new THREE.MeshBasicMaterial({ color: 0xff007f, wireframe: true, transparent: true, opacity: 0.9 });
const mainHeart = new THREE.Mesh(bigHeartGeo, bigHeartMat);
mainHeart.position.set(0, 3.5, 0);
scene.add(mainHeart);

// --- 7. KAMERA AÇISI VE ANIMASYON DÖNGÜSÜ ---
camera.position.set(0, 14, 16);
camera.lookAt(0, 1, 0);

let clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Galaksi, kalpler ve yazılar dönüyor
    galaxyParticles.rotation.y = t * 0.08;
    heartGroup.rotation.y = t * 0.08;
    textGroup.rotation.y = t * 0.05;

    // Merkezdeki büyük kalp atışı
    const pulse = 1.8 + Math.sin(t * 3.5) * 0.2;
    mainHeart.scale.set(pulse, pulse, pulse);
    mainHeart.rotation.y = Math.sin(t * 0.5) * 0.3;

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
