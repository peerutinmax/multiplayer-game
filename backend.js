// const express = require('express')
// const app = express()

// // socket.io setup
// const http = require('http')
// const server = http.createServer(app)
// const { Server } = require('socket.io')
// const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 })

// const port = 3000

// app.use(express.static('public'))

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html')
// })



// const backEndPlayers = {}
// const backEndProjectiles = {}

// const SPEED = 5
// const RADIUS = 10
// const PROJECTILE_RADIUS = 5
// let projectileId = 0

// io.on('connection', (socket) => {
//   console.log('a user connected')

//   io.emit('updatePlayers', backEndPlayers)

//   socket.on('shoot', ({ x, y, angle }) => {
//     projectileId++

//     const velocity = {
//       x: Math.cos(angle) * 5,
//       y: Math.sin(angle) * 5
//     }

//     backEndProjectiles[projectileId] = {
//       x,
//       y,
//       velocity,
//       playerId: socket.id
//     }

//     console.log(backEndProjectiles)
//   })

//   socket.on('initGame', ({ username, width, height }) => {
//     console.log("Player conncected: ${socket.id}, username: ${username}")
//     backEndPlayers[socket.id] = {
//       x: 1024 * Math.random(),
//       y: 576 * Math.random(),
//       color: `hsl(${360 * Math.random()}, 100%, 50%)`,
//       sequenceNumber: 0,
//       score: 0,
//       username,
//       canvas: { width, height },
//       radius: RADIUS
//     };

//     io.emit('updatePlayers', backEndPlayers);
//   });

//   socket.on('disconnect', (reason) => {
//     console.log(reason)
//     delete backEndPlayers[socket.id]
//     io.emit('updatePlayers', backEndPlayers)
//   })

//   socket.on('keydown', ({ keycode, sequenceNumber }) => {
//     const backEndPlayer = backEndPlayers[socket.id]

//     if (!backEndPlayers[socket.id]) return

//     backEndPlayers[socket.id].sequenceNumber = sequenceNumber
//     switch (keycode) {
//       case 'KeyW':
//         backEndPlayers[socket.id].y -= SPEED
//         break

//       case 'KeyA':
//         backEndPlayers[socket.id].x -= SPEED
//         break

//       case 'KeyS':
//         backEndPlayers[socket.id].y += SPEED
//         break

//       case 'KeyD':
//         backEndPlayers[socket.id].x += SPEED
//         break
//     }

//     const playerSides = {
//       left: backEndPlayer.x - backEndPlayer.radius,
//       right: backEndPlayer.x + backEndPlayer.radius,
//       top: backEndPlayer.y - backEndPlayer.radius,
//       bottom: backEndPlayer.y + backEndPlayer.radius
//     }

//     if (playerSides.left < 0) backEndPlayers[socket.id].x = backEndPlayer.radius

//     if (playerSides.right > 1024)
//       backEndPlayers[socket.id].x = 1024 - backEndPlayer.radius

//     if (playerSides.top < 0) backEndPlayers[socket.id].y = backEndPlayer.radius

//     if (playerSides.bottom > 576)
//       backEndPlayers[socket.id].y = 576 - backEndPlayer.radius
//   })
// })

// // backend ticker
// setInterval(() => {
//   // update projectile positions
//   for (const id in backEndProjectiles) {
//     backEndProjectiles[id].x += backEndProjectiles[id].velocity.x
//     backEndProjectiles[id].y += backEndProjectiles[id].velocity.y

//     const PROJECTILE_RADIUS = 5
//     if (
//       backEndProjectiles[id].x - PROJECTILE_RADIUS >=
//         backEndPlayers[backEndProjectiles[id].playerId]?.canvas?.width ||
//       backEndProjectiles[id].x + PROJECTILE_RADIUS <= 0 ||
//       backEndProjectiles[id].y - PROJECTILE_RADIUS >=
//         backEndPlayers[backEndProjectiles[id].playerId]?.canvas?.height ||
//       backEndProjectiles[id].y + PROJECTILE_RADIUS <= 0
//     ) {
//       delete backEndProjectiles[id]
//       continue
//     }

//     for (const playerId in backEndPlayers) {
//       const backEndPlayer = backEndPlayers[playerId]

//       const DISTANCE = Math.hypot(
//         backEndProjectiles[id].x - backEndPlayer.x,
//         backEndProjectiles[id].y - backEndPlayer.y
//       )

//       // collision detection
//       if (
//         DISTANCE < PROJECTILE_RADIUS + backEndPlayer.radius &&
//         backEndProjectiles[id].playerId !== playerId
//       ) {
//         if (backEndPlayers[backEndProjectiles[id].playerId])
//           backEndPlayers[backEndProjectiles[id].playerId].score++

//         console.log(backEndPlayers[backEndProjectiles[id].playerId])
//         delete backEndProjectiles[id]
//         delete backEndPlayers[playerId]
//         break
//       }
//     }
//   }

//   io.emit('updateProjectiles', backEndProjectiles)
//   io.emit('updatePlayers', backEndPlayers)
// }, 15)

// server.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

// console.log('server did load')

// module.exports = { backEndPlayers, backEndProjectiles }

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 });

const port = 3000;

// Game state variables
const backEndPlayers = {};
const backEndProjectiles = {};

const SPEED = 5;
const RADIUS = 10;
const PROJECTILE_RADIUS = 5;
let projectileId = 0;

// Serve static files
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle new player connections
function handleConnection(socket) {
  console.log('A user connected:', socket.id);
  io.emit('updatePlayers', backEndPlayers);

  socket.on('initGame', (data) => handleInitGame(socket, data));
  socket.on('shoot', (data) => handleShoot(socket, data));
  socket.on('keydown', (data) => handlePlayerMovement(socket, data));
  socket.on('disconnect', () => handleDisconnect(socket));
}

// Handle game initialization
function handleInitGame(socket, { username, width, height }) {
  console.log(`Player connected: ${socket.id}, username: ${username}`);
  
  backEndPlayers[socket.id] = {
    x: 1024 * Math.random(),
    y: 576 * Math.random(),
    color: `hsl(${360 * Math.random()}, 100%, 50%)`,
    sequenceNumber: 0,
    score: 0,
    username,
    canvas: { width, height },
    radius: RADIUS,
  };

  io.emit('updatePlayers', backEndPlayers);
}

// Handle player shooting projectiles
function handleShoot(socket, { x, y, angle }) {
  projectileId++;
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5,
  };

  backEndProjectiles[projectileId] = {
    x,
    y,
    velocity,
    playerId: socket.id,
  };

  console.log('Projectiles:', backEndProjectiles);
}

// Handle player disconnection
function handleDisconnect(socket) {
  console.log(`Player disconnected: ${socket.id}`);
  delete backEndPlayers[socket.id];
  io.emit('updatePlayers', backEndPlayers);
}

// Handle player movement based on key press
function handlePlayerMovement(socket, { keycode, sequenceNumber }) {
  const player = backEndPlayers[socket.id];
  if (!player) return;

  player.sequenceNumber = sequenceNumber;
  switch (keycode) {
    case 'KeyW': player.y -= SPEED; break;
    case 'KeyA': player.x -= SPEED; break;
    case 'KeyS': player.y += SPEED; break;
    case 'KeyD': player.x += SPEED; break;
  }

  enforceBoundaries(player);
}

// Ensure players stay within canvas boundaries
function enforceBoundaries(player) {
  if (player.x - player.radius < 0) player.x = player.radius;
  if (player.x + player.radius > 1024) player.x = 1024 - player.radius;
  if (player.y - player.radius < 0) player.y = player.radius;
  if (player.y + player.radius > 576) player.y = 576 - player.radius;
}

// Update projectiles and check for collisions
function updateGameLoop() {
  for (const id in backEndProjectiles) {
    moveProjectile(id);
    checkProjectileCollision(id);
  }

  io.emit('updateProjectiles', backEndProjectiles);
  io.emit('updatePlayers', backEndPlayers);
}

// Move projectiles based on their velocity
function moveProjectile(id) {
  backEndProjectiles[id].x += backEndProjectiles[id].velocity.x;
  backEndProjectiles[id].y += backEndProjectiles[id].velocity.y;

  // Remove projectiles if they go out of bounds
  const player = backEndPlayers[backEndProjectiles[id].playerId];
  if (!player || isProjectileOutOfBounds(backEndProjectiles[id], player.canvas)) {
    delete backEndProjectiles[id];
  }
}

// Check if projectile is outside canvas bounds
function isProjectileOutOfBounds(projectile, canvas) {
  return (
    projectile.x - PROJECTILE_RADIUS >= canvas?.width ||
    projectile.x + PROJECTILE_RADIUS <= 0 ||
    projectile.y - PROJECTILE_RADIUS >= canvas?.height ||
    projectile.y + PROJECTILE_RADIUS <= 0
  );
}

// Check projectile collision with players
function checkProjectileCollision(projectileId) {
  for (const playerId in backEndPlayers) {
    const player = backEndPlayers[playerId];
    const projectile = backEndProjectiles[projectileId];

    if (player && projectile) {
      const distance = Math.hypot(projectile.x - player.x, projectile.y - player.y);
      
      if (distance < PROJECTILE_RADIUS + player.radius && projectile.playerId !== playerId) {
        handlePlayerHit(projectile.playerId, playerId, projectileId);
      }
    }
  }
}

// Handle when a player is hit by a projectile
function handlePlayerHit(shooterId, hitPlayerId, projectileId) {
  if (backEndPlayers[shooterId]) {
    backEndPlayers[shooterId].score++;
  }

  console.log('Player hit:', hitPlayerId);
  delete backEndProjectiles[projectileId];
  delete backEndPlayers[hitPlayerId];
}

// Start the server
function startServer() {
  server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

// Game loop (15ms interval)
let intervalId;
function startGameLoop() {
  intervalId = setInterval(updateGameLoop, 15);
}

// Stop the game loop (for testing purposes)
function stopGameLoop() {
  clearInterval(intervalId);
}

// Server initialization logic
if (require.main === module) {
  io.on('connection', handleConnection);
  startGameLoop();
  startServer();
  console.log('Server did load');
}

// Export modules for testing
module.exports = {
  app,
  server,
  io,
  startServer,
  startGameLoop,
  stopGameLoop,
  handleConnection,
  handleInitGame,
  handleShoot,
  handleDisconnect,
  handlePlayerMovement,
  enforceBoundaries,
  moveProjectile,
  checkProjectileCollision,
  handlePlayerHit,
  backEndPlayers,
  backEndProjectiles,
};

