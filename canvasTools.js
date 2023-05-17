const COLOR_BLACK = "black";

function intersects(r1, r2) {
    if (r2.x < r1.x + r1.width && r1.x < r2.x + r2.width && r2.y < r1.y + r1.height) {
        return r1.y < r2.y + r2.height;
    }
    return false;
}

function drawTextInRect(ctx, theText, x, y, w, h, color = COLOR_BLACK) {

    ctx.fillStyle = color;
    ctx.font = "2.5vh serif";
    var textProps = ctx.measureText(theText);
    var tryCounts = 0;
    while (textProps.width > w && tryCounts < 200) {
        var fontSize = parseFloat(ctx.font.split("vh")[0], 10) - 0.1;
        ctx.font = fontSize + 'vh serif';
        textProps = ctx.measureText(theText);
        tryCounts++;
    }
    ctx.fillText(theText, x + Math.floor(w / 2) - Math.floor(textProps.width / 2), y + Math.floor(h / 2));
}