function drawLine(x1, y1, x2, y2) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

var x = [ 0, 50, 0, 50 ]
var y = [ 0, 0, 50, 50 ]
var z = [ 0, 50, 0, 50 ]

var cameraX = 0
var cameraY = 0
var cameraZ = 0

function updateFrame() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    for(i in x) {
        for(j in x) {
            for(k in x) {
                drawLine(x[i]+cameraX, y[i]+cameraY, x[j]+cameraX, y[j]+cameraY)
            }
        }
    }
    requestAnimationFrame(updateFrame);
}

requestAnimationFrame(updateFrame);

document.body.addEventListener("keydown", (ev) => {
    if (ev.key == "d") {
        cameraX += 2
    }
    if (ev.key == "a") {
        cameraX -= 2
    }
})