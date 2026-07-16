const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
});

revealItems.forEach((item) => revealObserver.observe(item));

const parallaxElements = document.querySelectorAll('[data-speed]');
window.addEventListener('scroll', () => {
  const offsetY = window.scrollY;
  parallaxElements.forEach((element) => {
    const speed = parseFloat(element.getAttribute('data-speed')) || 0.1;
    element.style.transform = `translate3d(0, ${offsetY * speed}px, 0)`;
  });
});

const canvas = document.getElementById('hero-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const group = new THREE.Group();
scene.add(group);

const geometry = new THREE.TorusKnotGeometry(1.35, 0.3, 180, 20);
const material = new THREE.MeshPhysicalMaterial({
  color: '#5fe2ff',
  emissive: '#123a56',
  emissiveIntensity: 0.6,
  metalness: 0.2,
  roughness: 0.25,
  transparent: true,
  opacity: 0.85,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.position.y = 0.3;
group.add(mesh);

const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 1500;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i += 3) {
  positions[i] = (Math.random() - 0.5) * 18;
  positions[i + 1] = (Math.random() - 0.5) * 18;
  positions[i + 2] = (Math.random() - 0.5) * 18;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.025,
  color: '#7acfff',
  transparent: true,
  opacity: 0.9,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.006;
  mesh.rotation.y += 0.008;
  group.rotation.z += 0.002;
  particles.rotation.y -= 0.0006;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
