const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// --- KARA DELİK (MERKEZİ SİYAH DİSK) ---
const holeGeo = new THREE.CircleGeometry(2.2, 64);
const holeMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
const blackHole = new THREE.Mesh(holeGeo, holeMat);
blackHole.rotation.x = Math.PI / 2;
scene.add(blackHole);

// --- PARILTI TEKSTÜRÜ ---
function createGlow() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.3, 'rgba(255, 0, 127, 0.8)');
    g.addColorStop(0.7, 'rgba(128,0,128,0.2)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0,0,64,64);
    return new THREE.CanvasTexture(canvas);
}

// --- GİRDAP PARÇACIKLARI ---
const count = 3000;
const particleGeo = new THREE.BufferGeometry();
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
const c1 = new THREE.Color(0xff007f);
const c2 = new THREE.Color(0xffb6c1);

for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 2) * 12 + 2.2;
    const angle = r * 2 + ((i % 2) * Math.PI);
    
    positions[i * 3] = Math.cos(angle) * r + (Math.random() - 0.5) * 0.3;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
    positions[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * 0.3;

    const mixed = c1.clone().lerp(c2, Math.random());
    colors[i * 3] = mixed.r; colors[i * 3 + 1] = mixed.g; colors[i * 3 + 2] = mixed.b;
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particleMat = new THREE.PointsMaterial({
    size: 0.3, map: createGlow(), transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, vertexColors: true
});
const galaxyParticles = new THREE.Points(particleGeo, particleMat);
scene.add(galaxyParticles);

// --- DÖNEN MİNİK 3D KALPLER ---
function createHeartShape() {
    const s = new THREE.Shape();
    s.moveTo(0,0.1); s.bezierCurveTo(0,0.1,-0.15,0.3,-0.3,0.1);
    s.bezierCurveTo(-0.3,-0.1,0,-0.3,0,-0.3);
    s.bezierCurveTo(0,-0.3,0.3,-0.1,0.3,0.1);
    s.bezierCurveTo(0.15,0.3,0,0.1,0,0.1);
    return new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: false });
}

const heartGeo = createHeartShape();
const heartMat = new THREE.MeshBasicMaterial({ color: 0xff007f });
const heartGroup = new THREE.Group();

for (let i = 0; i < 100; i++) {
    const mesh = new THREE.Mesh(heartGeo, heartMat);
    const r = 3 + Math.random() * 9;
    const angle = Math.random() * Math.PI * 2;
    mesh.position.set(Math.cos(angle) * r, (Math.random() - 0.5) * 1.2, Math.sin(angle) * r);
    mesh.rotation.x = Math.PI / 2;
    mesh.scale.set(0.4, 0.4, 0.4);
    heartGroup.add(mesh);
}
scene.add(heartGroup);

// --- YÖRÜNGEDE DÖNEN YAZILAR ---
const textGroup = new THREE.Group();
const texts = ["HAPPY BIRTHDAY", "AMOR DE MI VIDA", "ERES MAGIA", "FELIZ CUMPLEAÑOS", "TE ADORO"];

texts.forEach((txt, idx) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.font = 'Bold 32px Arial';
    ctx.textAlign = 'center'; ctx.shadowColor = '#ff007f'; ctx.shadowBlur = 10;
    ctx.fillText(txt, 256, 40);
    
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true }));
    const angle = (idx / texts.length) * Math.PI * 2;
    const r = 6.5;
    sprite.position.set(Math.cos(angle) * r, (Math.random() - 0.5) * 1, Math.sin(angle) * r);
    sprite.scale.set(3.5, 0.4, 1);
    textGroup.add(sprite);
});
scene.add(textGroup);

// --- MERKEZDEKİ NEON KALP ---
const bigShape = new THREE.Shape();
bigShape.moveTo(0,0.4); bigShape.bezierCurveTo(0,0.4,-0.5,0.9,-1,0.4);
bigShape.bezierCurveTo(-1,-0.2,0,-0.9,0,-0.9);
bigShape.bezierCurveTo(0,-0.9,1,-0.2,1,0.4);
bigShape.bezierCurveTo(0.5,0.9,0,0.4,0,0.4);

const mainHeart = new THREE.Mesh(
    new THREE.ShapeGeometry(bigShape),
    new THREE.MeshBasicMaterial({ color: 0xff007f, wireframe: true, transparent: true, opacity: 0.9 })
);
mainHeart.position.set(0, 2.5, 0);
scene.add(mainHeart);

// --- KAMERA AÇISI VE DÖNGÜ ---
camera.position.set(0, 11, 14);
camera.lookAt(0, 1, 0);

let clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    galaxyParticles.rotation.y = t * 0.08;
    heartGroup.rotation.y = t * 0.08;
    textGroup.rotation.y = t * 0.05;
    
    const pulse = 1.4 + Math.sin(t * 3.5) * 0.15;
    mainHeart.scale.set(pulse, pulse, pulse);
    mainHeart.rotation.y = Math.sin(t * 0.5) * 0.2;
    
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
