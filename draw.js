const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class Point3D {
            constructor(x, y, z) {
                this.x = x;
                this.y = y;
                this.z = z;
            }
}

let vertices = [];
let edges = [];

const gridSize = 30;
const step = 10;
const amplitude = 15;
for(let i = 0; i < gridSize; i++) { 
    for(let j = 0; j < gridSize; j++) {
        const x = i * step - gridSize/2;
        const z = j * step - gridSize/2;
        const y = Math.sin(i * 0.5 + j * 0.3) * amplitude; 
        vertices.push(new Point3D(x, y, z));
    }
}

for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        const currentIdx = i * gridSize + j;
        if (j < gridSize - 1) {
            edges.push([currentIdx, currentIdx + 1]);
        }
        if (i < gridSize - 1) {
            edges.push([currentIdx, currentIdx + gridSize]);
        }
    }
}

function drawLine(x1, y1, x2, y2, color, lineWidth) {
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
}

function updateFrame() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const view = createViewMatrix(cameraX, cameraY, cameraZ, rotationX, rotationY);

    const transformedAndProjectedVertices = vertices.map(p => {

        let transformedPoint = multiplyMatrixVector(view.rotation, [p.x, p.y, p.z]);
        
        transformedPoint[0] += view.translation[0];
        transformedPoint[1] += view.translation[1];
        transformedPoint[2] += view.translation[2];

        const x_cam = transformedPoint[0];
        const y_cam = transformedPoint[1];
        const z_cam = transformedPoint[2];

        if (z_cam <= 1) {
            return null;
        }

        const projectedX = (x_cam / z_cam) * PROJECTION_PLANE_DISTANCE;
        const projectedY = (y_cam / z_cam) * PROJECTION_PLANE_DISTANCE;

        const screenX = projectedX + canvas.width / 2;
        const screenY = projectedY + canvas.height / 2;

        return { x: screenX, y: screenY, z: z_cam };
    });

    edges.forEach(edge => {
        const p1 = transformedAndProjectedVertices[edge[0]];
        const p2 = transformedAndProjectedVertices[edge[1]];

        if (p1 && p2) {

            const avgZ = (p1.z + p2.z) / 2;
            
            const alpha = Math.max(0.1, Math.min(1, PROJECTION_PLANE_DISTANCE / avgZ * 0.8));
            
            const lineWidth = Math.max(0.5, 1 * (PROJECTION_PLANE_DISTANCE / avgZ));
            
            drawLine(p1.x, p1.y, p2.x, p2.y, `rgba(255, 255, 255, ${alpha})`, lineWidth);
        }
    });


    if (document.pointerLockElement === canvas) {

        const clickPrompt = document.getElementById("clickPrompt");
        if (clickPrompt) {
            clickPrompt.style.display = 'none'; 
        }

        if (!pointerLock) {
            pointerLock = (e) => {

                rotationY += e.movementX * MOUSE_SENSITIVITY; 
                
                rotationX -= e.movementY * MOUSE_SENSITIVITY; 

                rotationX = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, rotationX));
            };
            document.addEventListener("mousemove", pointerLock);
        }
    } else {
        const clickPrompt = document.getElementById("clickPrompt");
        if (clickPrompt) {
            clickPrompt.style.display = 'block'; 
        }

        if (pointerLock) {
            document.removeEventListener("mousemove", pointerLock);
            pointerLock = null;
        }
    }

    // Request the next animation frame to continue the rendering loop.
    requestAnimationFrame(updateFrame);
}

requestAnimationFrame(updateFrame);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function multiplyMatrixVector(matrix, vector) {
    const result = [0, 0, 0];
    result[0] = matrix[0][0] * vector[0] + matrix[0][1] * vector[1] + matrix[0][2] * vector[2];
    result[1] = matrix[1][0] * vector[0] + matrix[1][1] * vector[1] + matrix[1][2] * vector[2];
    result[2] = matrix[2][0] * vector[0] + matrix[2][1] * vector[1] + matrix[2][2] * vector[2];
    return result;
}

function createRotationYMatrix(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [
        [c, 0, s],
        [0, 1, 0],
        [-s, 0, c]
    ];
}

function createRotationXMatrix(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [
        [1, 0, 0],
        [0, c, -s],
        [0, s, c]
    ];
}

function invertMatrix(matrix) {
    return [
        [matrix[0][0], matrix[1][0], matrix[2][0]],
        [matrix[0][1], matrix[1][1], matrix[2][1]],
        [matrix[0][2], matrix[1][2], matrix[2][2]]
    ];
}

function multiplyMatrices(m1, m2) {
    const result = [];
    for (let i = 0; i < 3; i++) {
        result[i] = [];
        for (let j = 0; j < 3; j++) {
            result[i][j] = m1[i][0] * m2[0][j] + m1[i][1] * m2[1][j] + m1[i][2] * m2[2][j];
        }
    }
    return result;
}

function createViewMatrix(cameraX, cameraY, cameraZ, rotationX, rotationY) {

    const rotXMatrix = createRotationXMatrix(-rotationX);
    const rotYMatrix = createRotationYMatrix(-rotationY);

    const cameraRotationMatrix = multiplyMatrices(rotXMatrix, rotYMatrix);

    const translatedCameraPos = multiplyMatrixVector(cameraRotationMatrix, [-cameraX, -cameraY, -cameraZ]);

    const viewMatrix = [
        [cameraRotationMatrix[0][0], cameraRotationMatrix[0][1], cameraRotationMatrix[0][2], translatedCameraPos[0]],
        [cameraRotationMatrix[1][0], cameraRotationMatrix[1][1], cameraRotationMatrix[1][2], translatedCameraPos[1]],
        [cameraRotationMatrix[2][0], cameraRotationMatrix[2][1], cameraRotationMatrix[2][2], translatedCameraPos[2]],
        [0, 0, 0, 1]
    ];

    return {
        rotation: cameraRotationMatrix,
        translation: translatedCameraPos
    };
}

// CAMERA CONTROLLER
   
const CAMERA_DISTANCE = 300;
const FOV = Math.PI / 3; // 60
const PROJECTION_PLANE_DISTANCE = CAMERA_DISTANCE / Math.tan(FOV / 2);

const MOUSE_SENSITIVITY = 0.002;

var cameraX = 0;
var cameraY = 0;
var cameraZ = 0;
var rotationY = 0;
var rotationX = 0;
let pointerLock = null; 

let deltaTime = 0;
let lastTimestamp = 0;

function elapsedTime(timestamp) {
  if (lastTimestamp === 0) {
    lastTimestamp = timestamp;
  }

  deltaTime = (timestamp - lastTimestamp) / 1000; // milliseconds
  lastTimestamp = timestamp;

  requestAnimationFrame(elapsedTime);
}

requestAnimationFrame(elapsedTime);

document.body.addEventListener("keydown", (ev) => {

    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);

    const forwardX = sinY * cosX;
    const forwardY = -sinX;
    const forwardZ = cosY * cosX;

    const rightX = cosY;
    const rightZ = -sinY;

    var moveSpeed = 50 * deltaTime;

    if (ev.key === "w") {
        cameraX += forwardX * moveSpeed;
        cameraY += forwardY * moveSpeed;
        cameraZ += forwardZ * moveSpeed;
    }
    if (ev.key === "s") {
        cameraX -= forwardX * moveSpeed;
        cameraY -= forwardY * moveSpeed;
        cameraZ -= forwardZ * moveSpeed;
    }
    if (ev.key === "a") {
        cameraX -= rightX * moveSpeed;
        cameraZ -= rightZ * moveSpeed;
    }
    if (ev.key === "d") {
        cameraX += rightX * moveSpeed;
        cameraZ += rightZ * moveSpeed;
    }
    if (ev.key === "q") {
        cameraY += moveSpeed;
    }
    if (ev.key === "e") {
        cameraY -= moveSpeed;
    }
});

canvas.addEventListener("click", async () => {
  await canvas.requestPointerLock();
});