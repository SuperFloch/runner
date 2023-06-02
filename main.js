var canvas = document.getElementById("canvas");
var game = new Game(getWidth(), getHeight());

window.addEventListener('resize', resizeCanvas);

resizeCanvas();

populateTemplates(getWidth(), getHeight());

document.addEventListener("keydown", function(e) {
    game.keyPressed(e.key);
});
document.addEventListener("keyup", function(e) {
    game.keyReleased(e.key);
});

setInterval(() => {
    game.update();
    draw(canvas, game)
}, 8);

function getWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}

function getHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    game.height = canvas.height;
    game.width = canvas.width;
}