// Get the canvas element
var canvas = document.getElementById("renderCanvas");
    
// Generate the Babylon.js engine
var engine = new BABYLON.Engine(canvas, true);
let divFps = document.getElementById("fps");
// Create the scene
var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    // Create and position a free camera
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // Target the camera to the scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // Attach the camera to the canvas
    camera.attachControl(canvas, true);

    // Create a hemispheric light
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7; // Dim the light slightly

    // Create a sphere mesh
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
    sphere.position.y = 1; // Move sphere upwards

    // Create a ground mesh
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

    return scene;
};

// Call the createScene function
var scene = createScene();

// Run the render loop
engine.runRenderLoop(function () {
    scene.render();
    divFps.innerHTML = engine.getFps().toFixed() + " fps";
});

// Resize the engine if the window is resized
window.addEventListener("resize", function () {
    engine.resize();
});