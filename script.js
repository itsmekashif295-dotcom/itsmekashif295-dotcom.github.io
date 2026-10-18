import * as THREE from "three";

/* ---------- Edit these ---------- */
const ROLES = ["CIT Student", "Web Developer", "App Developer", "Graphic Designer"];
/* -------------------------------- */

/* ---------- Three.js scene ---------- */
const canvas = document.getElementById("bg");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x07070f, 0.035);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 0, 9);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.35));
const pLight1 = new THREE.PointLight(0x7c5cff, 60, 40);
pLight1.position.set(6, 4, 6);
scene.add(pLight1);
const pLight2 = new THREE.PointLight(0x00d4ff, 60, 40);
pLight2.position.set(-6, -3, 4);
scene.add(pLight2);

// Hero object: glowing torus knot placed on the right side
const knotGeo = new THREE.TorusKnotGeometry(1.6, 0.48, 220, 36);
const knotMat = new THREE.MeshStandardMaterial({
  color: 0x7c5cff,
  metalness: 0.85,
  roughness: 0.2,
  emissive: 0x1a0f4d,
  emissiveIntensity: 0.6,
});
const knot = new THREE.Mesh(knotGeo, knotMat);
scene.add(knot);

// Wireframe shell around the knot
const shell = new THREE.Mesh(
  new THREE.IcosahedronGeometry(3.1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.12 })
);
scene.add(shell);

// Floating shapes
const floaters = [];
const shapes = [
  new THREE.OctahedronGeometry(0.4),
  new THREE.TetrahedronGeometry(0.45),
  new THREE.BoxGeometry(0.5, 0.5, 0.5),
  new THREE.IcosahedronGeometry(0.4),
];
const palette = [0x7c5cff, 0x00d4ff, 0xff5c8a, 0x00e0a4];
for (let i = 0; i < 26; i++) {
  const mesh = new THREE.Mesh(
    shapes[i % shapes.length],
    new THREE.MeshStandardMaterial({
      color: palette[i % palette.length],
      metalness: 0.6,
      roughness: 0.3,
      flatShading: true,
    })
  );
  mesh.position.set((Math.random() - 0.5) * 24, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 14 - 3);
  mesh.userData = {
    rx: (Math.random() - 0.5) * 0.01,
    ry: (Math.random() - 0.5) * 0.01,
    speed: 0.3 + Math.random() * 0.7,
    offset: Math.random() * Math.PI * 2,
    baseY: mesh.position.y,
  };
  scene.add(mesh);
  floaters.push(mesh);
}

// Starfield
const starCount = 1400;
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  starPos[i * 3] = (Math.random() - 0.5) * 120;
  starPos[i * 3 + 1] = (Math.random() - 0.5) * 120;
  starPos[i * 3 + 2] = (Math.random() - 0.5) * 120;
}
const starGeo = new THREE.BufferGeometry();
starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
const stars = new THREE.Points(
  starGeo,
  new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.8 })
);
scene.add(stars);

/* ---------- Interaction ---------- */
const mouse = { x: 0, y: 0 };
window.addEventListener("pointermove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
});

let scrollY = 0;
window.addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });

function layout() {
  const w = window.innerWidth;
  const mobile = w < 800;
  knot.position.x = mobile ? 0 : 4.2;
  knot.position.y = mobile ? 2.6 : 0;
  shell.position.copy(knot.position);
  const s = mobile ? 0.6 : 1;
  knot.scale.setScalar(s);
  shell.scale.setScalar(s);
}
layout();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  layout();
});

/* ---------- Animation loop ---------- */
const clock = new THREE.Clock();
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animate() {
  const t = clock.getElapsedTime();

  if (!reduceMotion) {
    knot.rotation.x = t * 0.25;
    knot.rotation.y = t * 0.35;
    shell.rotation.y = -t * 0.12;
    shell.rotation.x = t * 0.08;

    floaters.forEach((m) => {
      m.rotation.x += m.userData.rx;
      m.rotation.y += m.userData.ry;
      m.position.y = m.userData.baseY + Math.sin(t * m.userData.speed + m.userData.offset) * 0.6;
    });

    stars.rotation.y = t * 0.01;
  }

  // Camera follows the mouse and scroll for a parallax / depth effect
  camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.04;
  camera.position.y += (-mouse.y * 0.8 - scrollY * 0.004 - camera.position.y) * 0.04;
  camera.lookAt(0, -scrollY * 0.004, 0);

  // Knot drifts upward and fades slightly as you scroll
  knot.position.y = (window.innerWidth < 800 ? 2.6 : 0) + scrollY * 0.003;
  shell.position.y = knot.position.y;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

/* ---------- Loader ---------- */
window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("loader").classList.add("done"), 400);
});

/* ---------- Typing effect ---------- */
const typedEl = document.getElementById("typed");
let roleIdx = 0, charIdx = 0, deleting = false;
function type() {
  const word = ROLES[roleIdx];
  typedEl.textContent = word.slice(0, charIdx);
  if (!deleting && charIdx < word.length) {
    charIdx++;
    setTimeout(type, 90);
  } else if (!deleting) {
    deleting = true;
    setTimeout(type, 1400);
  } else if (charIdx > 0) {
    charIdx--;
    setTimeout(type, 45);
  } else {
    deleting = false;
    roleIdx = (roleIdx + 1) % ROLES.length;
    setTimeout(type, 300);
  }
}
type();

/* ---------- Reveal on scroll ---------- */
document.querySelectorAll(".section-title, .glass").forEach((el) => {
  if (!el.classList.contains("skill")) el.classList.add("reveal");
});
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal, .skill").forEach((el) => io.observe(el));

/* ---------- 3D tilt on project cards ---------- */
document.querySelectorAll(".tilt").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
