function drawLine(x1, y1, x2, y2) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

for(let i = 0; i < 100; i++) { 
    for(let j = 0; j < 100; j++) {
        drawLine(0,0,i,j);
    }
}