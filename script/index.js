window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1280;
  canvas.height = 720;

  ctx.fillStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "black";
  ctx.font = "40px Heveltica";
  ctx.textAlign = "center";

  class Player {
    constructor(game) {
      this.game = game;
      this.collisionX = this.game.width * 0.5;
      this.collisionY = this.game.height * 0.5;
      this.collisionRadius = 30;
      this.speedX = 0;
      this.speedY = 0;
      this.dx = 0;
      this.dy = 0;
      this.speedModifier = 4;
      this.spriteWidth = 255;
      this.spriteHeight = 255;
      this.height = this.spriteHeight;
      this.width = this.spriteWidth;
      this.spriteX;
      this.spriteY;
      this.frameX = 0;
      this.frameY = 0;
      this.image = document.getElementById("bull");
    }

    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.spriteX,
        this.spriteY,
        this.width,
        this.height
      );
      if (this.game.debug) {
        context.beginPath();
        context.arc(
          this.collisionX,
          this.collisionY,
          this.collisionRadius,
          0,
          Math.PI * 2
        );
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
        context.beginPath();
        context.moveTo(this.collisionX, this.collisionY);
        context.lineTo(this.game.mouse.x, this.game.mouse.y);
        context.stroke();
      }
    }
    // [distance < sumOfRadii, distance, sumOfRadii, dx, dy];
    update() {
      this.dx = this.game.mouse.x - this.collisionX;
      this.dy = this.game.mouse.y - this.collisionY;
      const angle = Math.atan2(this.dy, this.dx);
      if (angle < -2.74 || angle > 2.74) this.frameY = 6;
      else if (angle < -1.96) this.frameY = 7;
      else if (angle < -1.17) this.frameY = 0;
      else if (angle < -0.39) this.frameY = 1;
      else if (angle < 0.39) this.frameY = 2;
      else if (angle < -1.17) this.frameY = 0;
      else if (angle < 1.17) this.frameY = 3;
      else if (angle < -1.96) this.frameY = 4;
      else if (angle < 2.74) this.frameY = 5;
      else if (angle < 2.74) this.frameY = 5;

      const distance = Math.hypot(this.dy, this.dx);
      if (distance > this.speedModifier) {
        this.speedX = this.dx / distance || 0;
        this.speedY = this.dy / distance || 0;
      } else {
        this.speedX = 0;
        this.speedY = 0;
      }
      this.collisionX += this.speedX * this.speedModifier;
      this.collisionY += this.speedY * this.speedModifier;
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 100;

      if (this.collisionX < 0 + this.collisionRadius) {
        this.collisionX = 0 + this.collisionRadius;
      } else if (this.collisionX > this.game.width - this.collisionRadius) {
        this.collisionX = this.game.width - this.collisionRadius;
      }

      if (this.collisionY < this.game.topMargin + this.collisionRadius) {
        this.collisionY = this.game.topMargin + this.collisionRadius;
      } else if (this.collisionY > this.game.height - this.collisionRadius) {
        this.collisionY = this.game.height - this.collisionRadius;
      }

      this.game.obstacles.forEach((obstacle) => {
        let [collision, distance, sumOfRadii, dx, dy] =
          this.game.checkCollision(this, obstacle);
        if (collision) {
          const unit_x = dx / distance;
          const unit_y = dy / distance;
          this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;
          this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;
        }
      });
    }
  }

  class Obstacle {
    constructor(game) {
      this.game = game;
      this.collisionX = Math.random() * this.game.width;
      this.collisionY = Math.random() * this.game.height;
      this.collisionRadius = 50;
      this.image = document.getElementById("obstacles");
      //width = divide the width of the spritesheet with number of coloumns
      this.spriteWidth = 250;
      //height = divide the height of the spritesheet with number of rows
      this.spriteHeight = 250;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.width * 0.5 - 70;
      this.frameX = Math.floor(Math.random() * 4);
      this.frameY = Math.floor(Math.random() * 3);
    }

    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.spriteX,
        this.spriteY,
        this.height,
        this.width
      );
      if (this.game.debug) {
        context.beginPath();
        context.arc(
          this.collisionX,
          this.collisionY,
          this.collisionRadius,
          0,
          Math.PI * 2
        );
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
      }
    }

    update() {
      // console.log('1')
    }
  }

  class Egg {
    constructor(game) {
      this.collisionRadius = 40;
      this.game = game;
      this.margin = this.collisionRadius * 2;
      this.collisionX =
        this.margin + Math.random() * (this.game.width - this.margin * 2);
      this.collisionY =
        this.game.topMargin +
        Math.random() * (this.game.height - this.game.topMargin - this.margin);

      this.image = document.getElementById("egg");
      this.spriteWidth = 120;
      this.spriteHeight = 135;
      this.height = this.spriteHeight;
      this.width = this.spriteWidth;
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 30;
      this.markedForDeletion = false;
      this.hatchTimer = 0;
      this.hatchInterval = 3500;
    }

    draw(context) {
      context.drawImage(
        this.image,
        this.spriteX,
        this.spriteY,
        this.spriteWidth,
        this.spriteHeight
      );
      if (this.game.debug) {
        context.beginPath();
        context.arc(
          this.collisionX,
          this.collisionY,
          this.collisionRadius,
          0,
          Math.PI * 2
        );
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
        const displayTimer = (this.hatchTimer * 0.001).toFixed(0);
        context.fillText(
          this.hatchTimer,
          this.collisionX,
          this.collisionY - this.collisionRadius * 2.5
        );
      }
    }

    update(deltaTime) {
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 30;
      let collisonObject = [
        this.game.player,
        ...this.game.obstacles,
        ...this.game.enemies,
      ];
      collisonObject.forEach((object) => {
        let [collision, distance, sumOfRadii, dx, dy] =
          this.game.checkCollision(this, object);
        if (collision) {
          const unit_x = dx / distance;
          const unit_y = dy / distance;
          this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x;
          this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;
        }
      });

      // hatching

      if (this.hatchTimer > this.hatchInterval) {
        this.game.hatchlings.push(
          new Larva(this.game, this.collisionX, this.collisionY)
        );
        this.markedForDeletion = true;
        this.game.removeGameObjects();
        // console.log(this.game.eggs);
      } else {
        this.hatchTimer += deltaTime;
      }
    }
  }

  class Larva {
    constructor(game, x, y) {
      this.game = game;
      this.collisionX = x;
      this.collisionY = y;
      this.collisionRadius = 30;
      this.image = document.getElementById("larva");
      this.spriteWidth = 150;
      this.spriteHeight = 150;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX;
      this.spriteY;
      this.speedY = 1 + Math.random();
      this.hatchTimer = 0;
      this.hatchInterval = 5000;
      this.speedY = Math.random();
      this.frameX = 0;
      this.frameY = Math.floor(Math.random() * 2);
    }

    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.spriteX,
        this.spriteY,
        this.width,
        this.height
      );
      //   console.log(this.spriteX, this.spriteY);
      if (this.game.debug) {
        context.beginPath();
        context.arc(
          this.collisionX,
          this.collisionY,
          this.collisionRadius,
          0,
          Math.PI * 2
        );
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
      }
    }

    update() {
      this.collisionY -= this.speedY;
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 30;
      //   console.log(this.spriteX, this.spriteY);
      if (this.collisionY < this.game.topMargin) {
        this.markedForDeletion = true;
        this.game.removeGameObjects();
        this.game.score++;
        for (let i = 0; i < 3; i++) {
          this.game.particles.push(
            new Firefly(this.game, this.collisionX, this.collisionY, "yellow")
          );
        }
      }
      //collison with objects
      let collisonObject = [this.game.player, ...this.game.obstacles];
      collisonObject.forEach((object) => {
        let [collision, distance, sumOfRadii, dx, dy] =
          this.game.checkCollision(this, object);
        if (collision) {
          const unit_x = dx / distance;
          const unit_y = dy / distance;
          this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x;
          this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;
        }
      });

      //collision with enemies
      this.game.enemies.forEach((enemy) => {
        if (this.game.checkCollision(this, enemy)[0]) {
          this.markedForDeletion = true;
          this.game.removeGameObjects();
          this.game.lostHatchlings++;
        //   for (let i = 0; i < 3; i++) {
        //     this.game.particles.push(
        //       new Spark(this.game, this.collisionX, this.collisionY, "red")
        //     );
        //   }
        }
      });
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.collisionRadius = 30;

      this.speedX = Math.random() * 3 + 0.5;
      this.image = document.getElementById("toad");
      this.spriteHeight = 260;
      this.spriteWidth = 140;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.collisionX =
        this.game.width + this.width + Math.random() * this.game.width * 0.5;
      this.collisionY =
        this.game.topMargin +
        (Math.random() * this.game.height - this.game.topMargin);
      this.spriteX;
      this.spriteY;
    }

    draw(context) {
      context.drawImage(this.image, this.spriteX, this.spriteY);
      if (this.game.debug) {
        context.beginPath();
        context.arc(
          this.collisionX,
          this.collisionY,
          this.collisionRadius,
          0,
          Math.PI * 2
        );
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();

        // console.log("dis", displayTimer);
      }
    }

    update(deltaTime) {
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 50;
      this.collisionX -= this.speedX;
      if (this.spriteX + this.width < 0) {
        this.collisionX =
          this.game.width + this.width + Math.random() * this.game.width * 0.5;
        this.collisionY =
          this.game.topMargin +
          (Math.random() * this.game.height - this.game.topMargin);
      }
      let collisonObject = [this.game.player, ...this.game.obstacles];
      collisonObject.forEach((object) => {
        let [collision, distance, sumOfRadii, dx, dy] =
          this.game.checkCollision(this, object);
        if (collision) {
          const unit_x = dx / distance;
          const unit_y = dy / distance;
          this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x;
          this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;
        }
      });
    }
  }

  class Particle {
    constructor(game, x, y, color) {
      this.game = game;
      this.collisionX = x;
      this.collisionY = y;
      this.color = color;
      this.radius = Math.floor(Math.random() * 10 + 5);
      this.speedX = Math.random() * 6 - 3;
      this.speedY = Math.random() * 2 + 0.5;
      this.va = Math.random() * 0.1 + 0.01;
      this.markedForDeletion = false;
    }

    draw(context) {
      context.save();
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(
        this.collisionX,
        this.collisionY,
        this.radius,
        0,
        Math.PI * 2
      );
      context.fill();
      context.stroke();
      context.restore();
    }
  }

  class Firefly extends Particle {
    update() {
      this.angle += this.va;
      this.collisionX += Math.cos(this.angle) * this.speedX;
      this.collisionY -= this.speedY;
      if (this.collisionY < 0 - this.radius) {
        this.markedForDeletion = true;
        this.game.removeGameObjects();
      }
    }
  }

  class Spark extends Particle {
    update() {
    //   this.angle += this.va * 0.5;
    //   this.collisionX -= Math.cos(this.angle) * this.speedX;
    //   this.collisionY -= Math.sine(this.angle) * this.speedY;
    //   if (this.radius > 0.1) {
    //     this.radius -= 0.05;
    //   }
    //   if(this.radius<0.2){
    //     this.markedForDeletion = true;
    //   }
    }
  }

  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.debug = false;
      this.player = new Player(this);
      this.numberOfObstacles = 5;
      this.obstacles = [];
      this.topMargin = 260;
      this.fps = 70;
      this.timer = 0;
      this.maxEggs = 10;
      this.eggs = [];
      this.eggsTimer = 0;
      this.eggInterval = 2000;
      this.gameObjects = [];
      this.interval = 1000 / this.fps;
      this.enemies = [];
      this.hatchlings = [];
      this.score = 0;
      this.lostHatchlings = 0;
      this.particles = [];
      this.mouse = {
        x: this.width * 0.5,
        y: this.height * 0.5,
        pressed: false,
      };

      canvas.addEventListener("mousedown", (e) => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = true;
        // console.log(e.offsetX, e.offsetY);
      });
      canvas.addEventListener("mouseup", (e) => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = false;
        // console.log(e.offsetX, e.offsetY);
      });
      canvas.addEventListener("mousemove", (e) => {
        if (this.mouse.pressed) {
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
        }
        window.addEventListener("keydown", (e) => {
          if (e.key == "d") this.debug = !this.debug;
          //   console.log(this.debug)
        });
        // this.mouse.pressed = true;
        // console.log(e.offsetX, e.offsetY);
      });
    }
    render(context, deltaTime) {
      if (this.timer > this.interval) {
        context.clearRect(0, 0, this.width, this.height);
        this.gameObjects = [
          this.player,
          ...this.eggs,
          ...this.obstacles,
          ...this.enemies,
          ...this.hatchlings,
          ...this.particles,
        ];
        this.gameObjects.sort((a, b) => {
          return a.collisionY - b.collisionY;
        });
        this.gameObjects.forEach((object) => {
          object.draw(context);
          object.update(deltaTime);
        });
        // this.obstacles.forEach((item) => item.draw(context));

        // this.player.draw(context);
        // this.player.update();
        this.timer = 0;
      }
      this.timer += deltaTime;

      //add eggs
      if (
        this.eggsTimer > this.eggInterval &&
        this.eggs.length < this.maxEggs
      ) {
        this.addEgg();
        this.eggsTimer = 0;
        // console.log(this.eggs);
      } else {
        this.eggsTimer += deltaTime;
      }

      //draw status text
      context.save();
      context.textAlign = "left";
      context.fillText("Score: " + this.score, 25, 50);
      if (this.debug) {
        context.fillText("Lost HatchLings: " + this.lostHatchlings, 25, 100);
      }
      context.restore();
    }

    checkCollision(a, b) {
      const dx = a.collisionX - b.collisionX;
      const dy = a.collisionY - b.collisionY;
      const distance = Math.hypot(dy, dx);
      const sumOfRadii = a.collisionRadius + b.collisionRadius;

      return [distance < sumOfRadii, distance, sumOfRadii, dx, dy];
    }

    addEgg() {
      this.eggs.push(new Egg(this));
    }

    addEnemy() {
      this.enemies.push(new Enemy(this));
    }

    removeGameObjects() {
      this.eggs = this.eggs.filter((el) => !el.markedForDeletion);
      this.hatchlings = this.hatchlings.filter((el) => !el.markedForDeletion);
      this.particles = this.particles.filter((el) => !el.markedForDeletion);
    }

    init() {
      for (let i = 0; i < 3; i++) {
        this.addEnemy();
        console.log(this.enemies);
      }
      let attempts = 0;
      try {
        while (
          this.obstacles.length < this.numberOfObstacles &&
          attempts < 500
        ) {
          let testObstacle = new Obstacle(this);
          let overlap = false;
          this.obstacles.forEach((obstacle) => {
            const dx = testObstacle.collisionX - obstacle.collisionX;
            const dy = testObstacle.collisionY - obstacle.collisionY;
            const distance = Math.hypot(dy, dx);
            const distanceBuffer = 100;
            const sumOfRadius =
              testObstacle.collisionRadius +
              obstacle.collisionRadius +
              distanceBuffer;
            if (distance < sumOfRadius) {
              overlap = true;
            }
          });
          //   console.log(testObstacle);
          const margin = testObstacle.collisionRadius * 3;
          if (
            !overlap &&
            testObstacle.spriteX > 0 &&
            testObstacle.spriteX < this.width - testObstacle.width &&
            testObstacle.collisionY > this.topMargin + margin &&
            testObstacle.collisionY < this.height - margin
          ) {
            this.obstacles.push(testObstacle);
          }

          attempts++;
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  const game = new Game(canvas);
  game.init();
  //   console.log(game);

  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    // console.log(deltaTime)
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx, deltaTime);

    window.requestAnimationFrame(animate);
  }

  animate(0);
});

// for (let i = 0; i < this.numberOfObstacles; i++) {
//     this.obstacles.push(new Obstacle(this));
//   }
