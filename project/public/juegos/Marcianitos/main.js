const scoreEl = document.querySelector("#scoreEl");
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const reset = document.getElementById("resetButton");

//seleccionamos los elementos del DOM y declaramos el tamaño del canvas
canvas.width = 1024;
canvas.height = 576;

//Construimos el jugador
class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.rotation = 0;
    this.opacity = 1;

    const image = new Image();
    image.src = "./img/spaceship.png";
    image.onload = () => {
      const scale = 0.15;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;

      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      };
    };
  }

  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
    );

    c.rotate(this.rotation);

    c.translate(
      -player.position.x - player.width / 2,
      -player.position.y - player.height / 2
    );

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    c.restore();
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
    }
  }
}

//esta clase construye los proyectles
class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.sound = new Audio("./img/scifi002.mp3");
    this.radius = 4;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "orange";
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

//Esta clase construye las particulas que salen volando
class Particle {
  constructor({ position, velocity, radius, color, fades }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = radius;
    this.color = color;
    this.opacity = 1;
    this.fades = fades;
  }

  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.fades) this.opacity -= 0.01;
  }
}

//Esta es la clase que crea los proyectiles que nos disparan los aliens
class InvasorProjectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.width = 3;
    this.height = 10;
  }

  draw() {
    c.fillStyle = "white";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

//Constructor de los aliens
class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0,
    };

    const image = new Image();
    image.src = "./img/invader.png";
    image.onload = () => {
      const scale = 1;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update({ velocity }) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }
  shoot(InvasorProjectiles) {
    if (audioINV.readyState >= 3) {
      audioINV.currentTime = 0;
      audioINV.play();
      InvasorProjectiles.push(
        new InvasorProjectile({
          position: {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height,
          },
          velocity: {
            x: 0,
            y: 5,
          },
          sound: audioINV,
        })
      );
    }
  }
}

//construye los grids de aliens que salen aleatoriamente
class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };
    this.velocity = {
      x: 2,
      y: 0,
    };
    this.invaders = [];

    const columns = Math.floor(Math.random() * 10 + 5);
    const rows = Math.floor(Math.random() * 5 + 2);

    this.width = columns * 30;

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Invader({
            position: {
              x: x * 30,
              y: y * 30,
            },
          })
        );
      }
    }
  }
  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.velocity.y = 0;

    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 30;
    }
  }
}
//Declaracion de variables para las animaciones
let player = new Player();
let projectiles = [];
let grids = [new Grid()];
let InvasorProjectiles = [];
let particles = [];

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

let frames = 0;
let randomInterval = Math.floor(Math.random() * 500 + 500);
let game = {
  over: false,
  active: true,
};

let score = 0;

for (let i = 0; i < 100; i++) {
  particles.push(
    new Particle({
      position: {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      },
      velocity: {
        x: 0,
        y: 0.4,
      },
      radius: Math.random() * 3,
      color: "white",
    })
  );
}

function createParticles({ object, color, fades }) {
  for (let i = 0; i < 15; i++) {
    particles.push(
      new Particle({
        position: {
          x: object.position.x + object.width / 2,
          y: object.position.y + object.height / 2,
        },
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        },
        radius: Math.random() * 3,
        color: color || "#8b0000",
        fades,
      })
    );
  }
}

//funcion donde se crean todas la animaciones
function animate() {
  if (!game.active) return;
  requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  particles.forEach((particle, i) => {
    if (particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width;
      particle.position.y = -particle.radius;
    }
    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(i, 1);
      }, 0);
    } else {
      particle.update();
    }
  });

  InvasorProjectiles.forEach((InvasorProjectile, index) => {
    if (
      InvasorProjectile.position.y + InvasorProjectile.height >=
      canvas.height
    ) {
      setTimeout(() => {
        InvasorProjectiles.splice(index, 1);
      }, 0);
    } else InvasorProjectile.update();

    //pryectiles que disparan al jugador y controla si el jugador esta muerto o no
    if (
      InvasorProjectile.position.y + InvasorProjectile.height >=
        player.position.y &&
      InvasorProjectile.position.x + InvasorProjectile.width >=
        player.position.x &&
      InvasorProjectile.position.x <= player.position.x + player.width
    ) {
      setTimeout(() => {
        InvasorProjectiles.splice(index, 1);
        player.opacity = 0;
        game.over = true;
      }, 0);
      setTimeout(() => {
        game.active = false;
      }, 2000);

      createParticles({
        object: player,
        color: "white",
        fades: true,
      });
      // Muestra el mensaje de "GAME OVER" en un elemento HTML en lugar de usar alert
      const gameOverMessage = document.getElementById("game-over-message");
      gameOverMessage.textContent = "¡GAME OVER!,tu puntuación es de " + score;
    } 
  });

  projectiles.forEach((projectile, index) => {
    projectile.update();
    // Elimina los proyectiles que salen del lienzo
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    } else {
      projectile.update();
    }
  });

  grids.forEach((grid, gridIndex) => {
    grid.update();
    //spawn misiles
    if (frames % 100 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        InvasorProjectiles
      );
    }

    grid.invaders.forEach((invader, i) => {
      invader.update({ velocity: grid.velocity });
      //proyectiles que disparan a enemigos
      projectiles.forEach((projectile, j) => {
        if (
          projectile.position.y - projectile.radius <=
            invader.position.y + invader.height &&
          projectile.position.x + projectile.radius >= invader.position.x &&
          projectile.position.x - projectile.radius <=
            invader.position.x + invader.width &&
          projectile.position.y + projectile.radius >= invader.position.y
        ) {
          setTimeout(() => {
            const invaderFound = grid.invaders.find((invader2) => {
              return invader2 === invader;
            });
            const projectileFound = projectiles.find(
              (projectile2) => projectile2 === projectile
            );
            //elimina enemigos y proyectiles
            if (invaderFound && projectileFound) {
              score += 100;
              scoreEl.innerHTML = score;

              createParticles({
                object: invader,
                fades: true,
              });
              grid.invaders.splice(i, 1);
              projectiles.splice(j, 1);

              if (grid.invaders.length > 0) {
                const firstInvader = grid.invaders[0];
                const lastInvader = grid.invaders[grid.invaders.length - 1];

                grid.width =
                  lastInvader.position.x -
                  firstInvader.position.x +
                  lastInvader.width;
                grid.position.x = firstInvader.position.x;
              } else {
                grids.splice(gridIndex, 1);
              }
            }
          }, 0);
        }
      });
    });
  });

  if (keys.a.pressed) {
    player.velocity.x = -7;
    player.rotation = -0.15;
  } else if (keys.d.pressed) {
    player.velocity.x = 7;
    player.rotation = 0.15;
  } else {
    player.velocity.x = 0;
    player.rotation = 0;
  }

  //spawning enemies
  if (frames % randomInterval === 0) {
    grids.push(new Grid());
    randomInterval = Math.floor(Math.random() * 500 + 500);
    frames = 0;
    console.log(randomInterval);
  }

  frames++;
}

//Activacion de los eventos de teclado para disparar y mover el jugador
const audio = new Audio("./img/scifi002.mp3");
const audioINV = new Audio("./img/enemyShoot.wav");

audio.addEventListener("canplaythrough", () => {
  // El audio se carga y está listo para reproducirse.
});

addEventListener("keydown", ({ key }) => {
  if (game.over) return;

  switch (key) {
    case "a":
      keys.a.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
      break;
    case "ArrowLeft":
      keys.a.pressed = true;
      break;
    case "ArrowRight":
      keys.d.pressed = true;
      break;
    case " ":
      if (audio.readyState >= 3) {
        audio.currentTime = 0;
        audio.play();
        projectiles.push(
          new Projectile({
            position: {
              x: player.position.x + player.width / 2,
              y: player.position.y,
            },
            velocity: {
              x: 0,
              y: -10,
            },
            sound: audio,
          })
        );
      }
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "ArrowLeft":
      keys.a.pressed = false;
      break;
    case "ArrowRight":
      keys.d.pressed = false;
      break;
    case " ":
      break;
  }
});
// resetButton.addEventListener("click", () => {
//   // Reinicia todas las variables del juego
//   player = new Player();
//   projectiles = [];
//   grids = [new Grid()];
//   InvasorProjectiles = [];
//   keys.a.pressed = false;
//   keys.d.pressed = false;
//   frames = 0;
//   score = 0;
//   scoreEl.innerHTML = score;

//   // Restaura el estado del juego
//   game.over = false;
//   game.active = true;
// });

animate();
