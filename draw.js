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
const gridSize = 20;
const step = 10;
for(let i = 0; i < gridSize; i++) { 
    for(let j = 0; j < gridSize; j++) {
        const x = i * step - gridSize/2;
        const z = j * step - gridSize/2;
        const y = Math.sin(i)*step
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

    const rotYMatrix = createRotationYMatrix(rotationY);
    const rotXMatrix = createRotationXMatrix(rotationX);
    
    const transformedAndProjectedVertices = vertices.map(p => {
        let rotatedPoint = multiplyMatrixVector(rotYMatrix, [p.x, p.y, p.z]);
        rotatedPoint = multiplyMatrixVector(rotXMatrix, rotatedPoint);

        const translatedX = rotatedPoint[0] - cameraX;
        const translatedY = rotatedPoint[1] - cameraY;
        const translatedZ = rotatedPoint[2] - cameraZ + CAMERA_DISTANCE;

        if (translatedZ <= 0) {
            return null;
        }

        const scale = PROJECTION_PLANE_DISTANCE / translatedZ;
        const projectedX = translatedX * scale;
        const projectedY = translatedY * scale;

        const screenX = projectedX + canvas.width / 2;
        const screenY = projectedY + canvas.height / 2;

        return { x: screenX, y: screenY, z: translatedZ };
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
        // locked
        function mouseMovement(e) {
            rotationY -= e.movementX * MOUSE_SENSITIVITY
            rotationX += e.movementY * MOUSE_SENSITIVITY
        }
        document.addEventListener("mousemove", mouseMovement);
    } else {
        // unlocked
    }

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

// CAMERA CONTROLLER
   
const CAMERA_DISTANCE = 300;
const FOV = Math.PI / 3; // 60
const PROJECTION_PLANE_DISTANCE = CAMERA_DISTANCE / Math.tan(FOV / 2);

const MOUSE_SENSITIVITY = 0.0002;

var cameraX = 0;
var cameraY = 0;
var cameraZ = 0;
var rotationY = 0;
var rotationX = 0;

document.body.addEventListener("keydown", (ev) => {
    if (ev.key == "e") {
        cameraY -= 2
    }
    if (ev.key == "a") {
        rotationY += 0.02
    }
    if (ev.key == "q") {
        cameraY += 2
    }
    if (ev.key == "d") {
        rotationY -= 0.02
    }
    if (ev.key == "w") {
        cameraZ += 2
    }
    if (ev.key == "s") {
        cameraZ -= 2
    }
})

canvas.addEventListener("click", async () => {
  await canvas.requestPointerLock();
});