// const canvas = document.querySelector('canvas')
// const c = canvas.getContext('2d')

// const socket = io()

// const scoreEl = document.querySelector('#scoreEl')

// const devicePixelRatio = window.devicePixelRatio || 1

// canvas.width = 1024 * devicePixelRatio
// canvas.height = 576 * devicePixelRatio

// c.scale(devicePixelRatio, devicePixelRatio)

// const x = canvas.width / 2
// const y = canvas.height / 2

// const frontEndPlayers = {}
// const frontEndProjectiles = {}

// socket.on('updateProjectiles', (backEndProjectiles) => {
//   for (const id in backEndProjectiles) {
//     const backEndProjectile = backEndProjectiles[id]

//     if (!frontEndProjectiles[id]) {
//       frontEndProjectiles[id] = new Projectile({
//         x: backEndProjectile.x,
//         y: backEndProjectile.y,
//         radius: 5,
//         color: frontEndPlayers[backEndProjectile.playerId]?.color,
//         velocity: backEndProjectile.velocity
//       })
//     } else {
//       frontEndProjectiles[id].x += backEndProjectiles[id].velocity.x
//       frontEndProjectiles[id].y += backEndProjectiles[id].velocity.y
//     }
//   }

//   for (const frontEndProjectileId in frontEndProjectiles) {
//     if (!backEndProjectiles[frontEndProjectileId]) {
//       delete frontEndProjectiles[frontEndProjectileId]
//     }
//   }
// })

// socket.on('updatePlayers', (backEndPlayers) => {
//   for (const id in backEndPlayers) {
//     const backEndPlayer = backEndPlayers[id]

//     if (!frontEndPlayers[id]) {
//       frontEndPlayers[id] = new Player({
//         x: backEndPlayer.x,
//         y: backEndPlayer.y,
//         radius: 10,
//         color: backEndPlayer.color,
//         username: backEndPlayer.username
//       })

//       document.querySelector(
//         '#playerLabels'
//       ).innerHTML += `<div data-id="${id}" data-score="${backEndPlayer.score}">${backEndPlayer.username}: ${backEndPlayer.score}</div>`
//     } else {
//       document.querySelector(
//         `div[data-id="${id}"]`
//       ).innerHTML = `${backEndPlayer.username}: ${backEndPlayer.score}`

//       document
//         .querySelector(`div[data-id="${id}"]`)
//         .setAttribute('data-score', backEndPlayer.score)

//       // sorts the players divs
//       const parentDiv = document.querySelector('#playerLabels')
//       const childDivs = Array.from(parentDiv.querySelectorAll('div'))

//       childDivs.sort((a, b) => {
//         const scoreA = Number(a.getAttribute('data-score'))
//         const scoreB = Number(b.getAttribute('data-score'))

//         return scoreB - scoreA
//       })

//       // removes old elements
//       childDivs.forEach((div) => {
//         parentDiv.removeChild(div)
//       })

//       // adds sorted elements
//       childDivs.forEach((div) => {
//         parentDiv.appendChild(div)
//       })

//       frontEndPlayers[id].target = {
//         x: backEndPlayer.x,
//         y: backEndPlayer.y
//       }

//       if (id === socket.id) {
//         const lastBackendInputIndex = playerInputs.findIndex((input) => {
//           return backEndPlayer.sequenceNumber === input.sequenceNumber
//         })

//         if (lastBackendInputIndex > -1)
//           playerInputs.splice(0, lastBackendInputIndex + 1)

//         playerInputs.forEach((input) => {
//           frontEndPlayers[id].target.x += input.dx
//           frontEndPlayers[id].target.y += input.dy
//         })
//       }
//     }
//   }

//   // this is where we delete frontend players
//   for (const id in frontEndPlayers) {
//     if (!backEndPlayers[id]) {
//       const divToDelete = document.querySelector(`div[data-id="${id}"]`)
//       divToDelete.parentNode.removeChild(divToDelete)

//       if (id === socket.id) {
//         document.querySelector('#usernameForm').style.display = 'block'
//       }

//       delete frontEndPlayers[id]
//     }
//   }
// })

// let animationId
// function animate() {
//   animationId = requestAnimationFrame(animate)
//   // c.fillStyle = 'rgba(0, 0, 0, 0.1)'
//   c.clearRect(0, 0, canvas.width, canvas.height)

//   for (const id in frontEndPlayers) {
//     const frontEndPlayer = frontEndPlayers[id]

//     // linear interpolation
//     if (frontEndPlayer.target) {
//       frontEndPlayers[id].x +=
//         (frontEndPlayers[id].target.x - frontEndPlayers[id].x) * 0.5
//       frontEndPlayers[id].y +=
//         (frontEndPlayers[id].target.y - frontEndPlayers[id].y) * 0.5
//     }

//     frontEndPlayer.draw()
//   }

//   for (const id in frontEndProjectiles) {
//     const frontEndProjectile = frontEndProjectiles[id]
//     frontEndProjectile.draw()
//   }

//   // for (let i = frontEndProjectiles.length - 1; i >= 0; i--) {
//   //   const frontEndProjectile = frontEndProjectiles[i]
//   //   frontEndProjectile.update()
//   // }
// }

// animate()

// const keys = {
//   w: {
//     pressed: false
//   },
//   a: {
//     pressed: false
//   },
//   s: {
//     pressed: false
//   },
//   d: {
//     pressed: false
//   }
// }

// const SPEED = 5
// const playerInputs = []
// let sequenceNumber = 0
// setInterval(() => {
//   if (keys.w.pressed) {
//     sequenceNumber++
//     playerInputs.push({ sequenceNumber, dx: 0, dy: -SPEED })
//     // frontEndPlayers[socket.id].y -= SPEED
//     socket.emit('keydown', { keycode: 'KeyW', sequenceNumber })
//   }

//   if (keys.a.pressed) {
//     sequenceNumber++
//     playerInputs.push({ sequenceNumber, dx: -SPEED, dy: 0 })
//     // frontEndPlayers[socket.id].x -= SPEED
//     socket.emit('keydown', { keycode: 'KeyA', sequenceNumber })
//   }

//   if (keys.s.pressed) {
//     sequenceNumber++
//     playerInputs.push({ sequenceNumber, dx: 0, dy: SPEED })
//     // frontEndPlayers[socket.id].y += SPEED
//     socket.emit('keydown', { keycode: 'KeyS', sequenceNumber })
//   }

//   if (keys.d.pressed) {
//     sequenceNumber++
//     playerInputs.push({ sequenceNumber, dx: SPEED, dy: 0 })
//     // frontEndPlayers[socket.id].x += SPEED
//     socket.emit('keydown', { keycode: 'KeyD', sequenceNumber })
//   }
// }, 15)

// window.addEventListener('keydown', (event) => {
//   if (!frontEndPlayers[socket.id]) return

//   switch (event.code) {
//     case 'KeyW':
//       keys.w.pressed = true
//       break

//     case 'KeyA':
//       keys.a.pressed = true
//       break

//     case 'KeyS':
//       keys.s.pressed = true
//       break

//     case 'KeyD':
//       keys.d.pressed = true
//       break
//   }
// })

// window.addEventListener('keyup', (event) => {
//   if (!frontEndPlayers[socket.id]) return

//   switch (event.code) {
//     case 'KeyW':
//       keys.w.pressed = false
//       break

//     case 'KeyA':
//       keys.a.pressed = false
//       break

//     case 'KeyS':
//       keys.s.pressed = false
//       break

//     case 'KeyD':
//       keys.d.pressed = false
//       break
//   }
// })

// document.querySelector('#usernameForm').addEventListener('submit', (event) => {
//   event.preventDefault(); // Prevent the form from refreshing the page
//   document.querySelector('#usernameForm').style.display = 'none'; // Hide the form

//   const username = document.querySelector('#usernameInput').value;
//   const width = canvas.width;
//   const height = canvas.height;
//   const devicePixelRatio = window.devicePixelRatio || 1;

//   // Emit the initGame event with the username and canvas dimensions
//   socket.emit('initGame', { username, width, height, devicePixelRatio });
// });

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const socket = io();
const scoreEl = document.querySelector('#scoreEl');

const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = 1024 * devicePixelRatio;
canvas.height = 576 * devicePixelRatio;
c.scale(devicePixelRatio, devicePixelRatio);

const frontEndPlayers = {};
const frontEndProjectiles = {};

const keys = { w: { pressed: false }, a: { pressed: false }, s: { pressed: false }, d: { pressed: false } };
const SPEED = 5;
const playerInputs = [];
let sequenceNumber = 0;
let animationId;

// Initialize event listeners
function initializeGame() {
  setupSocketListeners();
  setupEventListeners();
  startGameLoop();
}

// Handle game initialization
function handleGameInit(event) {
  event.preventDefault();
  document.querySelector('#usernameForm').style.display = 'none';

  const username = document.querySelector('#usernameInput').value;
  const width = canvas.width;
  const height = canvas.height;

  socket.emit('initGame', { username, width, height });
}

// Listen for WebSocket events from the server
function setupSocketListeners() {
  socket.on('updateProjectiles', (backEndProjectiles) => updateProjectiles(backEndProjectiles));
  socket.on('updatePlayers', (backEndPlayers) => updatePlayers(backEndPlayers));
}

// Setup keyboard and UI event listeners
function setupEventListeners() {
  document.querySelector('#usernameForm').addEventListener('submit', handleGameInit);

  window.addEventListener('keydown', (event) => handleKeyDown(event));
  window.addEventListener('keyup', (event) => handleKeyUp(event));
}

// Handle keyboard input (keydown)
function handleKeyDown(event) {
  if (!frontEndPlayers[socket.id]) return;

  switch (event.code) {
    case 'KeyW': keys.w.pressed = true; break;
    case 'KeyA': keys.a.pressed = true; break;
    case 'KeyS': keys.s.pressed = true; break;
    case 'KeyD': keys.d.pressed = true; break;
  }
}

// Handle keyboard input (keyup)
function handleKeyUp(event) {
  if (!frontEndPlayers[socket.id]) return;

  switch (event.code) {
    case 'KeyW': keys.w.pressed = false; break;
    case 'KeyA': keys.a.pressed = false; break;
    case 'KeyS': keys.s.pressed = false; break;
    case 'KeyD': keys.d.pressed = false; break;
  }
}

// Update front-end projectiles from backend data
function updateProjectiles(backEndProjectiles) {
  for (const id in backEndProjectiles) {
    const backEndProjectile = backEndProjectiles[id];

    if (!frontEndProjectiles[id]) {
      frontEndProjectiles[id] = new Projectile({
        x: backEndProjectile.x,
        y: backEndProjectile.y,
        radius: 5,
        color: frontEndPlayers[backEndProjectile.playerId]?.color,
        velocity: backEndProjectile.velocity,
      });
    } else {
      frontEndProjectiles[id].x += backEndProjectiles[id].velocity.x;
      frontEndProjectiles[id].y += backEndProjectiles[id].velocity.y;
    }
  }

  for (const id in frontEndProjectiles) {
    if (!backEndProjectiles[id]) {
      delete frontEndProjectiles[id];
    }
  }
}

// Update players from backend data
function updatePlayers(backEndPlayers) {
  for (const id in backEndPlayers) {
    const backEndPlayer = backEndPlayers[id];

    if (!frontEndPlayers[id]) {
      frontEndPlayers[id] = new Player({
        x: backEndPlayer.x,
        y: backEndPlayer.y,
        radius: 10,
        color: backEndPlayer.color,
        username: backEndPlayer.username,
      });

      addPlayerToUI(id, backEndPlayer);
    } else {
      updatePlayerInUI(id, backEndPlayer);
      updatePlayerPosition(id, backEndPlayer);
    }
  }

  removeDisconnectedPlayers(backEndPlayers);
}

// Add a new player to the UI scoreboard
function addPlayerToUI(id, player) {
  document.querySelector('#playerLabels').innerHTML += `
    <div data-id="${id}" data-score="${player.score}">
      ${player.username}: ${player.score}
    </div>`;
}

// Update an existing player's UI and position
function updatePlayerInUI(id, player) {
  const playerElement = document.querySelector(`div[data-id="${id}"]`);
  playerElement.innerHTML = `${player.username}: ${player.score}`;
  playerElement.setAttribute('data-score', player.score);

  sortPlayersByScore();
}

// Remove disconnected players from the UI
function removeDisconnectedPlayers(backEndPlayers) {
  for (const id in frontEndPlayers) {
    if (!backEndPlayers[id]) {
      const divToDelete = document.querySelector(`div[data-id="${id}"]`);
      divToDelete.parentNode.removeChild(divToDelete);
      delete frontEndPlayers[id];
    }
  }
}

// Sort the player score list
function sortPlayersByScore() {
  const parentDiv = document.querySelector('#playerLabels');
  const childDivs = Array.from(parentDiv.querySelectorAll('div'));

  childDivs.sort((a, b) => Number(b.getAttribute('data-score')) - Number(a.getAttribute('data-score')));

  childDivs.forEach((div) => {
    parentDiv.appendChild(div);
  });
}

// Smoothly interpolate player movement
function updatePlayerPosition(id, backEndPlayer) {
  frontEndPlayers[id].target = { x: backEndPlayer.x, y: backEndPlayer.y };

  if (id === socket.id) {
    applyClientPrediction(id, backEndPlayer);
  }
}

// Apply client-side prediction to smooth movement
function applyClientPrediction(id, backEndPlayer) {
  const lastBackendInputIndex = playerInputs.findIndex((input) => backEndPlayer.sequenceNumber === input.sequenceNumber);

  if (lastBackendInputIndex > -1) {
    playerInputs.splice(0, lastBackendInputIndex + 1);
  }

  playerInputs.forEach((input) => {
    frontEndPlayers[id].target.x += input.dx;
    frontEndPlayers[id].target.y += input.dy;
  });
}

// Game loop to animate players and projectiles
function startGameLoop() {
  function animate() {
    animationId = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    for (const id in frontEndPlayers) {
      if (frontEndPlayers[id].target) {
        frontEndPlayers[id].x += (frontEndPlayers[id].target.x - frontEndPlayers[id].x) * 0.5;
        frontEndPlayers[id].y += (frontEndPlayers[id].target.y - frontEndPlayers[id].y) * 0.5;
      }
      frontEndPlayers[id].draw();
    }

    for (const id in frontEndProjectiles) {
      frontEndProjectiles[id].draw();
    }
  }

  animate();
}

// Handle player input and send movement to the server
setInterval(() => {
  if (keys.w.pressed) emitMovement('KeyW', 0, -SPEED);
  if (keys.a.pressed) emitMovement('KeyA', -SPEED, 0);
  if (keys.s.pressed) emitMovement('KeyS', 0, SPEED);
  if (keys.d.pressed) emitMovement('KeyD', SPEED, 0);
}, 15);

function emitMovement(keycode, dx, dy) {
  sequenceNumber++;
  playerInputs.push({ sequenceNumber, dx, dy });
  socket.emit('keydown', { keycode, sequenceNumber });
}

// Initialize the game
initializeGame();

module.exports = {updatePlayers, sortPlayersByScore, emitMovement};
