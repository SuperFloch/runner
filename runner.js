const UP = "UP";
const DOWN = "DOWN";
const LEFT = "LEFT";
const RIGHT = "RIGHT";

function Game() {
    this.distance = 0;
    this.score = 0;
    this.speed = 10;
    this.gravityForce = 1.01;
    this.speedMultiplier = 1;
    this.entities = [];
    this.entities.push(new Player());
    this.entities.push(new Platform(10, 50, 100, 20));
    this.entities.push(new Platform(0, 120, 100, 20));
    this.entities.push(new Platform(40, 200, 400, 20));
    this.entities.push(new Platform(90, 230, 100, 20));
    this.entities.push(new Platform(20, 350, 100, 20));
    this.entities.push(new Platform(120, 600, 500, 20));
    this.entities.push(new Platform(720, 600, 500, 20));
    this.entities.push(new Platform(120, 580, 100, 20));

    this.keysPressed = {
        left: false,
        right: false,
        up: false,
        down: false
    };

    this.update = function() {
        this.movePlayer(this.entities[0]);
        this.gravity();
        this.applyForces();
    };
    this.gravity = function() {
        this.entities.forEach((e1) => {
            if (!e1.static) {
                if (!this.isOnTopOfSomething(e1)) {
                    var gravityForce = this.entities[0].forces.find(f => f.name == "gravity");
                    if (gravityForce == undefined) {
                        this.entities[0].forces.push(new Force(DOWN, 1.12, this.gravityForce, 10, 0.02, "gravity"));
                    }
                }
            }
        });
    };
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
            var leftForce = this.entities[0].forces.find(f => f.name == "keyLeft");
            if (leftForce == undefined) {
                this.entities[0].forces.push(new Force(LEFT, 1, 0.98, 4, 0.2, "keyLeft"));
            } else {
                leftForce.value *= player.acceleration;
            }
        }
        if (this.keysPressed.right) {
            var rightForce = this.entities[0].forces.find(f => f.name == "keyRight");
            if (rightForce == undefined) {
                this.entities[0].forces.push(new Force(RIGHT, 1, 0.98, 4, 0.2, "keyRight"));
            } else {
                rightForce.value *= player.acceleration;
            }
        }
        if (this.keysPressed.up && !player.falling()) {
            var jumpForce = this.entities[0].forces.find(f => f.name == "keyUp");
            if (jumpForce == undefined) {
                this.entities[0].forces.push(new Force(UP, 4, 0.98, 20, 1, "keyUp"));
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
    this.falling = function() {
        return this.forces.filter(f => f.direction == DOWN).length > 0;
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
    Entity.call(this, 500, 0, 10, 20, true, false);
    this.acceleration = 1.2;
}

function Platform(x, y, width, height) {
    Entity.call(this, x, y, width, height);
    this.static = true;
}

function draw(canvas, game) {
    var ctx = canvas.getContext("2d");
    drawBackground(ctx, canvas.width, canvas.height);
    drawPlayer(ctx, game.entities[0]);
    drawInterface(ctx, game);
    game.entities.forEach((e, i) => {
        if (i > 0) {
            drawEntity(ctx, e);
        }
    });
}

function drawBackground(ctx, width, height) {
    ctx.fillStyle = "#8adbde";
    ctx.fillRect(0, 0, width, height);
}

function drawPlayer(ctx, player) {
    ctx.fillStyle = "#ad2457";
    if (player.falling()) {
        ctx.fillStyle = "#a8329e";
    }
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawEntity(ctx, entity, color = "#1e5210") {
    ctx.fillStyle = color;
    ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
}

function drawInterface(ctx, game) {
    ctx.fillStyle = "black";
    drawTextInRect(ctx, "Forces", 1000, 100, 500, 200);
    game.entities[0].forces.forEach((f, index) => {
        drawTextInRect(ctx, f.direction + " : " + f.value, 1000, 150 + index * 20, 500, 200);
    });

}