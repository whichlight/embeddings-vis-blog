// Setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 400); // Adjust z to ensure the data fits in view

const categoryColors = {
  "Innovative Web Technologies": 0xff0000, // Red
  "Digital Design and Creativity": 0x00ff00, // Green
  "Content Strategy and Management": 0x0000ff, // Blue
  "Tech Solutions for Social Good": 0x00ffff, // Cyan
  "Workplace Innovation and Culture": 0xff00ff, // Magenta
};

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
const categoryBox = document.getElementById("category");
const topicsBox = document.getElementById("topics");

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
        const materialColor = categoryColors[item.category] || 0xffffff; // Fallback color if category not found
        const material = new THREE.MeshPhongMaterial({ color: materialColor });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(item["tsne-2d-one"], item["tsne-2d-two"], 0);

        sphere.userData = {
          title: item.title,
          link: item.link,
          summary: item.summaries,
          category: item.category,
          topics: item.topics,
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
    let topics = intersectedObject.userData.topics.join("<br>");
    console.log(topics);
    infoBox.style.display = "block";
    titleBox.innerHTML = intersectedObject.userData.title;
    summaryBox.innerHTML = intersectedObject.userData.summary;
    categoryBox.innerHTML = intersectedObject.userData.category;
    topicsBox.innerHTML = topics;
    console.log(intersectedObject);
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

document.addEventListener("DOMContentLoaded", function () {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    alert("For the best experience, please open this app on a desktop device.");
  }
});
// Initialize
initScatterPlot();
animate();
