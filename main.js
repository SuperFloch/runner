var canvas = document.getElementById("canvas");
canvas.height = getHeight();
canvas.width = getWidth();

var game = new Game(getWidth(), getHeight());
document.addEventListener("keydown", function(e) {
    game.keyPressed(e.key);
});
document.addEventListener("keyup", function(e) {
    game.keyReleased(e.key);
});

setInterval(() => {
    game.update();
    draw(canvas, game)
}, 10);

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