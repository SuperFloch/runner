const UP = "UP";
const DOWN = "DOWN";
const LEFT = "LEFT";
const RIGHT = "RIGHT";
const NONE = "NONE";

function Game(width, height) {
    this.width = width;
    this.height = height;
    this.distance = 0;
    this.score = 0;
    this.scrollX = 0;
    this.speed = 1;
    this.gravityForce = 1.01;
    this.speedMultiplier = 1;
    this.entities = [];
    this.entities.push(new Player());
    this.entities.push(new Platform(0, 600, this.width, 20));
    this.entities.push(new Platform(120, 580, 100, 20));

    this.keysPressed = {
        left: false,
        right: false,
        up: false,
        down: false
    };

    this.update = function() {
        this.movePlayer(this.entities.find(e => e.isPlayer));
        this.gravity();
        this.applyForces();
        this.animate();
        this.scroll();
    };
    this.gravity = function() {
        this.entities.forEach((e1) => {
            if (!e1.static) {
                if (!this.isOnTopOfSomething(e1)) {
                    var gravityForce = e1.forces.find(f => f.name == "gravity");
                    if (gravityForce == undefined) {
                        e1.forces.push(new Force(DOWN, 1.12, this.gravityForce, 10, 0.02, "gravity"));
                    }
                }
            }
        });
    };
    this.animate = function() {
        this.entities.forEach((e1) => {
            e1.update();
        });
    };
    this.scroll = function() {
        this.scrollX += this.speed;
        this.entities = this.entities.filter(e => e.isPlayer || e.x + e.width > this.scrollX);
        if (this.entities.length < 50) {
            this.spawnNewPlatforms();
        }
    };
    this.spawnNewPlatforms = function() {
            this.entities.push(new Platform(Math.floor(Math.random() * this.width + this.width) + this.scrollX, Math.floor(Math.random() * this.height), 200, 20));
        },
        this.applyForces = function() {
            this.entities.forEach((e1) => {
                e1.forces.forEach((f) => {
                    f.update();
                    if (f.value > 0) {
                        switch (f.direction) {
                            case UP:
                                e1.y -= f.value;
                                if (this.collidesWithAnything(e1)) {
                                    while (this.collidesWithAnything(e1)) {
                                        e1.y += 1;
                                    }
                                    f.value = 0;
                                }
                                break;
                            case DOWN:
                                e1.y += f.value;
                                if (this.collidesWithAnything(e1)) {
                                    while (this.collidesWithAnything(e1)) {
                                        e1.y -= 1;
                                    }
                                    f.value = 0;
                                }
                                break;
                            case LEFT:
                                e1.x -= f.value;
                                if (this.collidesWithAnything(e1)) {
                                    while (this.collidesWithAnything(e1)) {
                                        e1.x += 1;
                                    }
                                    f.value = 0;
                                }
                                break;
                            case RIGHT:
                                e1.x += f.value;
                                if (this.collidesWithAnything(e1)) {
                                    while (this.collidesWithAnything(e1)) {
                                        e1.x -= 1;
                                    }
                                    f.value = 0;
                                }
                                break;
                        }
                    }
                });
                e1.forces = e1.forces.filter(f => f.value > 0);
            });
        };
    this.collidesWithAnything = function(e1) {
        var blocked = false;
        this.entities.forEach((e2) => {
            if (e1 != e2 && e2.block && intersects(e1, e2)) {
                blocked = true;
            }
        });
        return blocked;
    };
    this.isOnTopOfSomething = function(e1) {
        var blocked = false;
        e1.y++;
        this.entities.forEach((e2) => {
            if (e1 != e2 && e2.block && intersects(e1, e2)) {
                blocked = true;
            }
        });
        e1.y--;
        return blocked;
    };
    this.movePlayer = function(player) {
        if (this.keysPressed.left) {
            var leftForce = this.entities.find(e => e.isPlayer).forces.find(f => f.name == "keyLeft");
            if (leftForce == undefined) {
                this.entities.find(e => e.isPlayer).forces.push(new Force(LEFT, 1, 0.98, 4, 0.2, "keyLeft"));
            } else {
                leftForce.value *= player.acceleration;
            }
        }
        if (this.keysPressed.right) {
            var rightForce = this.entities.find(e => e.isPlayer).forces.find(f => f.name == "keyRight");
            if (rightForce == undefined) {
                this.entities.find(e => e.isPlayer).forces.push(new Force(RIGHT, 1, 0.98, 4, 0.2, "keyRight"));
            } else {
                rightForce.value *= player.acceleration;
            }
        }
        if (this.keysPressed.up && !player.falling()) {
            var jumpForce = this.entities.find(e => e.isPlayer).forces.find(f => f.name == "keyUp");
            if (jumpForce == undefined) {
                this.entities.find(e => e.isPlayer).forces.push(new Force(UP, 4, 0.98, 20, 1, "keyUp"));
            } else {
                jumpForce.value *= player.acceleration;
            }
        }
    };
    this.keyPressed = function(key) {
        switch (key) {
            case "z":
            case "ArrowUp":
                this.keysPressed.up = true;
                break;
            case "s":
            case "ArrowDown":
                this.keysPressed.down = true;
                break;
            case "d":
            case "ArrowRight":
                this.keysPressed.right = true;
                break;
            case "q":
            case "ArrowLeft":
                this.keysPressed.left = true;
                break;
        }
    };
    this.keyReleased = function(key) {
        switch (key) {
            case "z":
            case "ArrowUp":
                this.keysPressed.up = false;
                break;
            case "s":
            case "ArrowDown":
                this.keysPressed.down = false;
                break;
            case "d":
            case "ArrowRight":
                this.keysPressed.right = false;
                break;
            case "q":
            case "ArrowLeft":
                this.keysPressed.left = false;
                break;
        }
    }
}

function Entity(x = 0, y = 0, width = 10, height = 10, block = true, static = true) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.block = block;
    this.static = static;
    this.isPlayer = false;

    // Animation
    this.frames = [1, 2, 3, 4, 5, 6, 7, 8];
    this.currentFrameIndex = 0;
    this.update = function() {
        this.currentFrameIndex += 0.1;
        if (this.currentFrameIndex > this.frames.length) {
            this.currentFrameIndex = 0;
        }
    }

    this.falling = function() {
        return this.forces.filter(f => f.direction == DOWN).length > 0;
    };
    this.getMainDirection = function() {
        var forceMap = {
            UP: 0,
            LEFT: 0,
            RIGHT: 0,
            DOWN: 0,
            NONE: 0.1
        };
        this.forces.forEach((f) => {
            forceMap[f.direction] += f.value;
        });
        return Object.keys(forceMap).reduce((a, b) => forceMap[a] > forceMap[b] ? a : b);
    };
    this.forces = [];
}

function Force(direction, value, inertia, maxValue, minValue = 0.02, name = "force") {
    this.name = name;
    this.direction = direction;
    this.value = value;
    this.inertia = inertia;
    this.maxValue = maxValue;
    this.minValue = minValue;
    this.update = function() {
        this.value *= this.inertia;
        if (this.value < this.minValue) {
            this.value = 0;
        }
        if (this.value >= this.maxValue) {
            this.value = this.maxValue;
        }
    };
}

function Player() {
    Entity.call(this, 500, 0, 30, 46, true, false);
    this.isPlayer = true;
    this.acceleration = 1.2;
}

function Platform(x, y, width, height) {
    Entity.call(this, x, y, width, height);
    this.static = true;
}

function draw(canvas, game) {
    var ctx = canvas.getContext("2d");
    drawBackground(ctx, game, canvas.width, canvas.height);
    drawPlayer(ctx, game.entities.find(e => e.isPlayer), game);
    drawInterface(ctx, game);
    game.entities.forEach((e, i) => {
        if (i > 0) {
            drawEntity(ctx, e, game);
        }
    });
}

function drawBackground(ctx, game, width, height) {
    ctx.drawImage(document.getElementById("background"), 0, 0, width, height);
    var layer1 = document.getElementById("backLayer_1");
    var layer2 = document.getElementById("backLayer_2");
    ctx.drawImage(layer1, 0 - (game.scrollX * 0.7 % width), 0, width, height);
    ctx.drawImage(layer1, width - (game.scrollX * 0.7 % width), 0, width, height);
    ctx.drawImage(layer2, 0 - (game.scrollX % width), 0, width, height);
    ctx.drawImage(layer2, width - (game.scrollX % width), 0, width, height);
}

function drawPlayer(ctx, player, game) {
    var direction = player.getMainDirection();
    var flipped = direction == LEFT;
    if (player.falling()) {
        player.frames = [9];
    } else {
        if (direction == NONE) {
            player.frames = [0];
        } else {
            player.frames = [1, 2, 3, 4, 5, 6, 7, 8];
        }
    }
    drawSprite(ctx, document.getElementById("playerSpriteSheet"), player.x - game.scrollX, player.y, player.width, player.height, 14, 1, player.frames[Math.floor(player.currentFrameIndex)], flipped);

}

function drawEntity(ctx, entity, game, color = "#1e5210") {
    ctx.fillStyle = color;
    ctx.fillRect(entity.x - game.scrollX, entity.y, entity.width, entity.height);
}

function drawInterface(ctx, game) {
    ctx.fillStyle = "black";
    drawTextInRect(ctx, "Forces", 1000, 100, 500, 200);
    game.entities.find(e => e.isPlayer).forces.forEach((f, index) => {
        drawTextInRect(ctx, f.direction + " : " + f.value, 1000, 150 + index * 20, 500, 200);
    });
    drawTextInRect(ctx, " Nombre de plateformes : " + (game.entities.length - 1), 1000, 50, 500, 200);
    drawTextInRect(ctx, "Distance : " + game.scrollX, 1000, 10, 500, 200);

    drawTextInRect(ctx, "Direction : " + game.entities.find(e => e.isPlayer).getMainDirection(), 1000, 500, 500, 200);

}