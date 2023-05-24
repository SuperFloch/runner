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

/**
 *	Dessine une image pivotée
 **/
function drawImage(ctx, image, x, y, w, h, degrees = 0) {
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(degrees * Math.PI / 180.0);
    ctx.translate(-x - w / 2, -y - h / 2);
    drawImageAtMaxSize(ctx, image, x, y, w, h);
    ctx.restore();
}
/**
 *	Dessine une image dans un rectangle en le remplissant au max
 **/
function drawImageAtMaxSize(ctx, image, x, y, rectW, rectH) {
    var ratio = image.height / image.width;
    var w = rectW;
    var h = rectH;
    if (rectW * ratio > rectH) {
        w = Math.floor(h / ratio);
    } else {
        h = Math.floor(w * ratio);
    }
    ctx.drawImage(image, x + Math.floor((rectW - w) / 2), y + Math.floor((rectH - h) / 2), w, h);
}

/**
 * Dessine un sprite sur une planche determinee
 **/
function drawSprite(ctx, spritesheet, x, y, w, h, sheetColsCount = 1, sheetRowsCount = 1, index, reversed = false) {
    ctx.save();
    var frameWidth = Math.floor(spritesheet.width / sheetColsCount);
    var frameHeight = Math.floor(spritesheet.height / sheetRowsCount);
    var c = index % sheetColsCount;
    var r = Math.floor(index / sheetColsCount);
    if (reversed) {
        ctx.scale(-1, 1);
        x *= -1;
        x -= w;
    }
    ctx.drawImage(spritesheet, c * frameWidth, r * frameHeight, frameWidth, frameHeight, x, y, w, h);
    ctx.restore();
}