/**
 * @jest-environment node
 */

const {
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
    startGameLoop,
    stopGameLoop
} = require('../../backend');

// Mock Socket.IO object
const mockSocket = {
    id: 'test-player',
    emit: jest.fn(),
};

// Reset game state before each test
beforeEach(() => {
    Object.keys(backEndPlayers).forEach((key) => delete backEndPlayers[key]);
    Object.keys(backEndProjectiles).forEach((key) => delete backEndProjectiles[key]);
});

describe('Game Backend Tests', () => {
    // Test handleInitGame function
    test('should initialize a player correctly', () => {
        handleInitGame(mockSocket, { username: 'TestUser', width: 800, height: 600 });

        expect(backEndPlayers[mockSocket.id]).toBeDefined();
        expect(backEndPlayers[mockSocket.id].username).toBe('TestUser');
        expect(backEndPlayers[mockSocket.id].canvas.width).toBe(800);
    });

    // Test handleShoot function
    test('should add a projectile when shooting', () => {
        handleShoot(mockSocket, { x: 100, y: 200, angle: Math.PI / 4 });

        expect(Object.keys(backEndProjectiles).length).toBe(1);
        expect(backEndProjectiles[1]).toEqual({
            x: 100,
            y: 200,
            velocity: expect.objectContaining({
                x: expect.any(Number),
                y: expect.any(Number),
            }),
            playerId: mockSocket.id,
        });
    });

    // Test handleDisconnect function
    test('should remove a player on disconnect', () => {
        handleInitGame(mockSocket, { username: 'TestUser', width: 800, height: 600 });

        expect(backEndPlayers[mockSocket.id]).toBeDefined();
        handleDisconnect(mockSocket);
        expect(backEndPlayers[mockSocket.id]).toBeUndefined();
    });

    // Test handlePlayerMovement function
    test('should move the player correctly on keydown', () => {
        handleInitGame(mockSocket, { username: 'TestUser', width: 800, height: 600 });
        handlePlayerMovement(mockSocket, { keycode: 'KeyW', sequenceNumber: 1 });

        expect(backEndPlayers[mockSocket.id].y).toBeLessThan(576);
    });

    // Test enforceBoundaries function
    test('should keep player within canvas bounds', () => {
        backEndPlayers[mockSocket.id] = { x: -10, y: -10, radius: 10 };
        enforceBoundaries(backEndPlayers[mockSocket.id]);

        expect(backEndPlayers[mockSocket.id].x).toBe(10);
        expect(backEndPlayers[mockSocket.id].y).toBe(10);
    });

    // Test moveProjectile function
    test('should move projectile correctly', () => {
        backEndPlayers['test-player'] = { canvas: { width: 1024, height: 576 } };

        backEndProjectiles[1] = {
            x: 100,
            y: 100,
            velocity: { x: 5, y: -5 },
            playerId: 'test-player',
        };

        moveProjectile(1);

        expect(backEndProjectiles[1]).toBeDefined();
        expect(backEndProjectiles[1].x).toBe(105);
        expect(backEndProjectiles[1].y).toBe(95);
    });

    // Test checkProjectileCollision function (no collision case)
    test('should not detect collision if projectile does not hit a player', () => {
        backEndPlayers['player1'] = { x: 200, y: 200, radius: 10 };
        backEndProjectiles[1] = { x: 100, y: 100, velocity: { x: 1, y: 1 }, playerId: 'test-player' };

        checkProjectileCollision(1);
        expect(backEndPlayers['player1']).toBeDefined();
    });

    // Test checkProjectileCollision function (collision case)
    test('should remove player on collision', () => {
        backEndPlayers['player1'] = { x: 100, y: 100, radius: 10 };
        backEndProjectiles[1] = { x: 100, y: 100, velocity: { x: 1, y: 1 }, playerId: 'test-player' };

        checkProjectileCollision(1);
        expect(backEndPlayers['player1']).toBeUndefined();
    });

    // Test handlePlayerHit function
    test('should increase shooter score when hitting another player', () => {
        backEndPlayers['shooter'] = { score: 0 };
        backEndPlayers['victim'] = { x: 100, y: 100, radius: 10 };
        backEndProjectiles[1] = { x: 100, y: 100, playerId: 'shooter' };

        handlePlayerHit('shooter', 'victim', 1);

        expect(backEndPlayers['shooter'].score).toBe(1);
        expect(backEndPlayers['victim']).toBeUndefined();
        expect(backEndProjectiles[1]).toBeUndefined();
    });

    // Test startGameLoop and stopGameLoop
    test('should start and stop the game loop', (done) => {
        startGameLoop();
        setTimeout(() => {
            stopGameLoop();
            done();
        }, 50);
    });
});
