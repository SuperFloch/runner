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
    this.currentScrollPanel = -1;
    this.speed = 2;
    this.gravityForce = 1.02;
    this.speedMultiplier = 1;
    this.entities = [];
    this.entities.push(new Player());
    this.entities.push(new Platform(0, 600, this.width, 200));

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
        this.entities = this.entities.filter(e => e.isPlayer || e.displayBox.x + e.displayBox.width > this.scrollX || e.displayBox.y < this.height || e.displayBox.y - e.displayBox.height > 0);
        if (Math.floor(this.scrollX / this.width) > this.currentScrollPanel) {
            this.spawnNewPlatforms();
            this.currentScrollPanel++;
            this.speed *= this.speedMultiplier;
        }
    };
    this.spawnNewPlatforms = function() {
        var tmp = Math.floor(Math.random() * templates.length);
        templates[tmp].platforms.forEach((p) => {
            var clone = null;
            switch (p.constructor.name) {
                case "Platform":
                    clone = new Platform(p.hitBox.x + this.width + this.scrollX, p.hitBox.y, p.hitBox.width, p.hitBox.height);
                    break;
                case "FallingPlatform":
                    clone = new FallingPlatform(p.hitBox.x + this.width + this.scrollX, p.hitBox.y, p.hitBox.width, p.hitBox.height, p.delay);
                    break;
                case "BouncyPlatform":
                    clone = new BouncyPlatform(p.hitBox.x + this.width + this.scrollX, p.hitBox.y, p.hitBox.width, p.hitBox.height);
                    break;
                case "Enemy":
                    clone = new Enemy(p.hitBox.x + this.width + this.scrollX, p.hitBox.y, p.hitBox.width, p.hitBox.height);
                    break;
                case "LiftingPlatform":
                    clone = new LiftingPlatform(p.hitBox.x + this.width + this.scrollX, p.hitBox.y, p.hitBox.width, p.hitBox.height, p.delay, p.direction);
                    break;
            }
            this.entities.push(clone);
        });
    };
    this.applyForces = function() {
        this.entities.forEach((e1) => {
            e1.forces.forEach((f) => {
                f.update();
                if (f.value > 0) {
                    switch (f.direction) {
                        case UP:
                            e1.moveY(-f.value);
                            if (this.collidesWithAnything(e1)) {
                                while (this.collidesWithAnything(e1)) {
                                    e1.moveY(1);
                                }
                                f.value = 0;
                            }
                            break;
                        case DOWN:
                            e1.moveY(f.value);
                            if (this.collidesWithAnything(e1)) {
                                while (this.collidesWithAnything(e1)) {
                                    e1.moveY(-1);
                                }
                                f.value = 0;
                            }
                            break;
                        case LEFT:
                            e1.moveX(-f.value);
                            if (this.collidesWithAnything(e1)) {
                                while (this.collidesWithAnything(e1)) {
                                    e1.moveX(1);
                                }
                                f.value = 0;
                            }
                            break;
                        case RIGHT:
                            e1.moveX(f.value);
                            if (this.collidesWithAnything(e1)) {
                                while (this.collidesWithAnything(e1)) {
                                    e1.moveX(-1);
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
            if (e1 != e2 && e2.block && intersects(e1.hitBox, e2.hitBox)) {
                blocked = true;
                e2.collide(e1);
            }
        });
        return blocked;
    };
    this.isOnTopOfSomething = function(e1) {
        var blocked = false;
        e1.moveY(1);
        this.entities.forEach((e2) => {
            if (e1 != e2 && e2.block && intersects(e1.hitBox, e2.hitBox)) {
                blocked = true;
                e2.collide(e1);
            }
        });
        e1.moveY(-1);
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
                this.entities.find(e => e.isPlayer).forces.push(new Force(UP, 7, 0.98, 20, 1, "keyUp"));
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
    this.hitBox = new Rectangle(x, y, width, height);
    this.displayBox = new Rectangle(x, y, width, height);
    this.block = block;
    this.static = static;
    this.isPlayer = false;

    this.moveX = function(val) {
        this.hitBox.x += val;
        this.displayBox.x += val;
    };
    this.moveY = function(val) {
        this.hitBox.y += val;
        this.displayBox.y += val;
    };

    this.setX = function(val) {
        this.hitBox.x = val;
        this.displayBox.x = val;
    };
    this.setY = function(val) {
        this.hitBox.y = val;
        this.displayBox.y = val;
    };

    this.collide = function(e2) {};

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
            if (f.animate) {
                forceMap[f.direction] += f.value;
            }
        });
        return Object.keys(forceMap).reduce((a, b) => forceMap[a] > forceMap[b] ? a : b);
    };
    this.forces = [];
}

function Rectangle(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
}



function Force(direction, value, inertia, maxValue, minValue = 0.02, name = "force", animate = true) {
    this.name = name;
    this.direction = direction;
    this.value = value;
    this.inertia = inertia;
    this.maxValue = maxValue;
    this.minValue = minValue;
    this.animate = animate;
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
    Entity.call(this, 500, 0, 90, 138, true, false);
    this.isPlayer = true;
    this.acceleration = 1.2;
}

function Enemy(x, y, w, h) {
    Entity.call(this, x, y, w, h);
    var newW = w * 1.2;
    var newH = h * 1.2;
    this.displayBox = new Rectangle(x - Math.abs(newW - w), y - Math.abs(newH - h), newW, newH);
    this.static = false;
    this.forces.push(new Force(LEFT, 1, 1, 1, 0.2, 'left'));
    this.collide = function(e2) {
        if (this.getMainDirection() == NONE) {
            this.forces.push(new Force(RIGHT, 1, 1, 1, 0.2, 'right'));
        }
    };
}

function Platform(x, y, width, height) {
    Entity.call(this, x, y, width, height);
    this.static = true;
}

function FallingPlatform(x, y, w, h, delay) {
    Platform.call(this, x, y, w, h);
    this.delay = delay;
    this.collide = function(e2) {
        if (e2.isPlayer) {
            setTimeout(() => { this.static = false; }, this.delay);
        }
    };
}

function LiftingPlatform(x, y, w, h, delay, direction) {
    Platform.call(this, x, y, w, h);
    this.delay = delay;
    this.direction = direction;
    this.collide = function(e2) {
        if (e2.isPlayer) {
            if (this.forces.filter(f => f.direction == this.direction).length > 0 && e2.forces.filter(f => f.name == "add" + this.direction).length == 0) {
                e2.forces.push(new Force(this.direction, 2, 1, 4, 1, "add" + this.direction, false));
            }
            setTimeout(() => {
                if (this.forces.filter(f => f.direction == this.direction).length == 0) {
                    this.forces.push(new Force(this.direction, 2, 1, 4, 1, this.direction));
                }
            }, this.delay);
        }
    };
}

function BouncyPlatform(x, y, w, h) {
    Platform.call(this, x, y, w, h);
    this.collide = function(e2) {
        if (e2.isPlayer) {
            var bounceForce = e2.forces.find(f => f.name == "bounce");
            if (bounceForce == undefined) {
                e2.forces.push(new Force(UP, 7, 0.99, 50, 2.5, "bounce"));
            } else {
                bounceForce.value = 7;
            }
        }
    }
}

function PlatformGroupTemplate() {
    this.platforms = [];
    this.addPlatform = function(x, y, w, h) {
        this.platforms.push(new Platform(x, y, w, h));
    };
}

function draw(canvas, game) {
    var ctx = canvas.getContext("2d");
    drawBackground(ctx, game, game.width, game.height);
    drawInterface(ctx, game);
    game.entities.forEach((e, i) => {
        drawEntity(ctx, e, game);
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
    drawSprite(ctx, document.getElementById("playerSpriteSheet"), player.displayBox.x - game.scrollX, player.displayBox.y, player.displayBox.width, player.displayBox.height, 14, 1, player.frames[Math.floor(player.currentFrameIndex)], flipped);
}

function drawEnemy(ctx, enemy, game) {
    var direction = enemy.getMainDirection();
    var flipped = direction == LEFT;
    if (enemy.falling()) {
        enemy.frames = [9];
    } else {
        if (direction == NONE) {
            enemy.frames = [0];
        } else {
            enemy.frames = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        }
    }
    drawSprite(ctx, document.getElementById("enemySpriteSheet"), enemy.displayBox.x - game.scrollX, enemy.displayBox.y, enemy.displayBox.width, enemy.displayBox.height, 9, 1, enemy.frames[Math.floor(enemy.currentFrameIndex)], flipped);
}

function drawEntity(ctx, entity, game, color = "#1e5210") {
    switch (entity.constructor.name) {
        case "Platform":
            ctx.fillStyle = "green";
            ctx.fillRect(entity.displayBox.x - game.scrollX, entity.displayBox.y, entity.displayBox.width, entity.displayBox.height);
            break;
        case "FallingPlatform":
            ctx.fillStyle = "yellow";
            ctx.fillRect(entity.displayBox.x - game.scrollX, entity.displayBox.y, entity.displayBox.width, entity.displayBox.height);
            break;
        case "LiftingPlatform":
            ctx.fillStyle = "red";
            ctx.fillRect(entity.displayBox.x - game.scrollX, entity.displayBox.y, entity.displayBox.width, entity.displayBox.height);
            break;
        case "Player":
            drawPlayer(ctx, entity, game);
            break;
        case "Enemy":
            drawEnemy(ctx, entity, game);
            break;
        default:
            ctx.fillStyle = "white";
            ctx.fillRect(entity.displayBox.x - game.scrollX, entity.displayBox.y, entity.displayBox.width, entity.displayBox.height);
    }
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