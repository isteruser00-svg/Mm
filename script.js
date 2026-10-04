const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function createHeartGeometry() {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.5);
    shape.bezierCurveTo(0, 0.5, -0.5, 1, -1, 0.5);
    shape.bezierCurveTo(-1, 0, 0, -1, 0, -1);
    shape.bezierCurveTo(0, -1, 1, 0, 1, 0.5);
    shape.bezierCurveTo(1, 1, 0, 0.5, 0, 0.5);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: true });
}

const heartGeo = createHeartGeometry();
const heartMat = new THREE.MeshBasicMaterial({ color: 0xff007f });
const heartGroup = new THREE.Group();

const count = 800;
for (let i = 0; i < count; i++) {
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.userData = {
        radius: 4 + Math.random() * 14,
        angle: Math.random() * Math.PI * 2,
        ySpeed: 0.000 + Math.random() * 0.012,
        yOffset: (Math.random() - 0.5) * 6
    };

    heartMesh.position.x = Math.cos(heartMesh.userData.angle) * heartMesh.userData.radius;
    heartMesh.position.z = Math.sin(heartMesh.userData.angle) * heartMesh.userData.radius;
    heartMesh.position.y = heartMesh.userData.yOffset;
    heartMesh.scale.set(0.15, 0.15, 0.15);

    scene.add(heartMesh);
    heartGroup.add(heartMesh);
}

scene.add(heartGroup);
camera.position.z = 18;
camera.position.y = 5;
camera.lookAt(0, 0, 0);

function animate() {
    requestAnimationFrame(animate);
    heartGroup.rotation.y += 0.003;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
