// Setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 400); // Adjust z to ensure the data fits in view

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Setup raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Setup info box for displaying titles on hover
const infoBox = document.getElementById("infoBox");
const titleBox = document.getElementById("postTitle");
const summaryBox = document.getElementById("summary");

// Ambient light
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Color, intensity
directionalLight.position.set(1, 1, 1); // Position the light
scene.add(directionalLight);

// Function to initialize objects in the scene based on CSV data
function initScatterPlot() {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        const geometry = new THREE.SphereGeometry(5, 32, 32); // Sphere size
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(item["tsne-2d-one"], item["tsne-2d-two"], 0);

        sphere.userData = {
          title: item.title,
          link: item.link,
          summary: item.summaries,
        };
        scene.add(sphere);
      });
    });
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update raycaster and check for intersections
  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    let intersectedObject = intersects[0].object;
    infoBox.style.display = "block";
    titleBox.innerHTML = intersectedObject.userData.title;
    summaryBox.innerHTML = intersectedObject.userData.summary;
  } else {
    infoBox.style.display = "none";
  }

  renderer.render(scene, camera);
}

// Mouse Events
function onMouseClick(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    let intersectedObject = intersects[0].object;
    if (intersectedObject.userData.link) {
      window.open(intersectedObject.userData.link, "_blank");
    }
  }
}

function onMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Event listeners
window.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("click", onMouseClick, false);

// Initialize
initScatterPlot();
animate();
