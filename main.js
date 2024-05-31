import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";



const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5, 30, 50);
const Control = new OrbitControls(camera, renderer.domElement);


//Creating a room
const roomSize = Math.sqrt(1000);
const planeObject = (size, color = 0xffffff) => {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size * 1),
    new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
      // wireframe: true,
    })
  );
  return mesh;
};

const surface = planeObject(roomSize);
surface.rotation.x = -Math.PI / 2;
scene.add(surface);

const Wallleft = planeObject(roomSize);
Wallleft.rotation.y = -Math.PI / 2;
Wallleft.position.set(-roomSize / 2, roomSize / 2, 0);
scene.add(Wallleft);

const wallRight = planeObject(roomSize);
wallRight.rotation.y = -Math.PI / 2;
wallRight.position.set(roomSize / 2, roomSize / 2, 0);
scene.add(wallRight);

const wallBack = planeObject(roomSize, 0x333333);
wallBack.position.set(0, roomSize / 2, -roomSize / 2);
scene.add(wallBack);

// creating random objects
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function placeObject(object, objectCount) {
  let placed = false;
  let attempts = 0;

  while (!placed && attempts < objectCount) {
    attempts++;
    // Generate random position
    const positionX = getRandomInt(-(roomSize / 2 - 2), roomSize / 2 - 3);
    const positionY = getRandomInt(2, roomSize - 2);
    const positionZ = getRandomInt(-(roomSize / 2) + 2, roomSize / 2 - 2);
    object.position.set(positionX, positionY, positionZ);

    placed = true; // Assume placed initially

    // Check for overlap with existing objects
    for (const child of scene.children) {
      if (child !== object && child.isMesh) {
        const distance = object.position.distanceTo(child.position);
        console.log(distance);
        if (distance < 2 * 2) {
          // Overlap if distance is less than twice the radius
          placed = false;
          break;
        }
      }
    }
  }
window.addEventListener('mousemove',(e)=>{
    console.log(scene.children)
})
  //   console.log(scene.children);

  if (placed) {
    scene.add(object);
  } else {
    console.warn("Failed to place object after", attempts, "attempts");
  }
}
const ObjectNum = 40;

for (let index = 0; index < ObjectNum; index++) {
  const geo = new THREE.SphereGeometry(2);
  const mat = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
  const mesh = new THREE.Mesh(geo, mat);
  placeObject(mesh, ObjectNum);
}

const animate = () => {
 
  renderer.render(scene, camera);

  Control.update();
};

document.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
renderer.setAnimationLoop(animate);
