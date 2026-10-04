const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Kalp Geometrisi
function createHeartGeometry() {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.3);
    shape.bezierCurveTo(0, 0.3, -0.3, 0.6, -0.6, 0.3);
    shape.bezierCurveTo(-0.6, 0, 0, -0.6, 0, -0.6);
    shape.bezierCurveTo(0, -0.6, 0.6, 0, 0.6, 0.3);
    shape.bezierCurveTo(0.6, 0.6, 0, 0.3, 0, 0.3);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: false });
}

const heartGeo = createHeartGeometry();
const heartMat = new THREE.MeshBasicMaterial({ color: 0xff007f });
const heartGroup = new THREE.Group();

// Galaksi Spiral Yapısı
const count = 1200;
for (let i = 0; i < count; i++) {
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    
    // Yarıçap ve spiral açıları
    const radius = 2 + Math.random() * 20;
    const angle = (i / count) * Math.PI * 8 + (Math.random() - 0.5) * 0.5;
    
    heartMesh.position.x = Math.cos(angle) * radius;
    heartMesh.position.z = Math.sin(angle) * radius;
    heartMesh.position.y = (Math.random() - 0.5) * 2;

    // Kalpleri küçültüyoruz ki ekranı kaplamasınlar
    heartMesh.scale.set(0.08, 0.08, 0.08);
    heartMesh.rotation.x = Math.PI / 2;

    heartGroup.add(heartMesh);
}

scene.add(heartGroup);

// Kamerayı geriye ve yukarıya çekerek açıyı düzeltiyoruz
camera.position.set(0, 25, 25);
camera.lookAt(0, 0, 0);

function animate() {
    requestAnimationFrame(animate);
    heartGroup.rotation.y += 0.002;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
