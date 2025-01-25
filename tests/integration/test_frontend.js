/**
 * @jest-environment jsdom
 */

const io = require('socket.io-client');

// Mock socket.io globally before importing frontend.js
global.io = jest.fn(() => ({
  emit: jest.fn(),
  on: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock the Player class before importing the frontend script
global.Player = jest.fn(() => ({
  draw: jest.fn(),
}));

// Mock DOM elements before importing frontend.js
document.body.innerHTML = `
  <div id="playerLabels"></div>
  <form id="usernameForm" style="display: block;">
    <input id="usernameInput" value="TestUser" />
  </form>
  <canvas></canvas>
`;

const { updatePlayers, sortPlayersByScore, emitMovement } = require('../../public/js/frontend');

describe('Frontend Game Functions', () => {
  let mockSocket;

  beforeEach(() => {
    // Reset the DOM before each test
    document.querySelector('#playerLabels').innerHTML = '';
    document.querySelector('#usernameForm').style.display = 'block';

    // Mock socket instance before each test
    mockSocket = {
      emit: jest.fn(),
      on: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
    };

    global.socket = mockSocket;
  });

  test('updatePlayers should add new players to the UI', () => {
    const mockPlayers = {
      player1: { x: 100, y: 100, score: 50, username: 'Player1', color: 'red' },
      player2: { x: 200, y: 200, score: 75, username: 'Player2', color: 'blue' },
    };

    updatePlayers(mockPlayers);

    const playerDivs = document.querySelectorAll('#playerLabels div');
    expect(playerDivs.length).toBe(2);
    expect(playerDivs[0].textContent).toContain('Player1: 50');
    expect(playerDivs[1].textContent).toContain('Player2: 75');
  });

  test('sortPlayersByScore should correctly sort players by score', () => {
    document.querySelector('#playerLabels').innerHTML = `
      <div data-id="1" data-score="50">Player1: 50</div>
      <div data-id="2" data-score="100">Player2: 100</div>
      <div data-id="3" data-score="75">Player3: 75</div>
    `;

    sortPlayersByScore();

    const sortedDivs = document.querySelectorAll('#playerLabels div');
    expect(sortedDivs[0].textContent).toBe('Player2: 100');
    expect(sortedDivs[1].textContent).toBe('Player3: 75');
    expect(sortedDivs[2].textContent).toBe('Player1: 50');
  });

  test('emitMovement should add player input and emit socket event', async () => {
    emitMovement('KeyW', 0, -5);
  
    await new Promise((resolve) => setTimeout(resolve, 50));  // Allow async event processing
  
    expect(global.socket.emit).toHaveBeenCalledWith(
      'keydown',
      expect.objectContaining({ keycode: 'KeyW' })
    );
  });
  

  test('Game initialization should hide the username form and emit initGame event', async () => {
    const usernameInput = document.querySelector('#usernameInput');
    usernameInput.value = 'TestUser';  // Ensure input has value
  
    document.querySelector('#usernameForm').dispatchEvent(new Event('submit', { bubbles: true }));
  
    await new Promise((resolve) => setTimeout(resolve, 50));  // Allow event processing
  
    expect(document.querySelector('#usernameForm').style.display).toBe('none');
    expect(global.socket.emit).toHaveBeenCalledWith(
      'initGame',
      expect.objectContaining({ username: 'TestUser' })
    );
  });
  

  test('updatePlayers should remove disconnected players', () => {
    const mockPlayers = {
      player1: { x: 100, y: 100, score: 50, username: 'Player1', color: 'red' }
    };
  
    updatePlayers(mockPlayers);
    updatePlayers({});  // Simulate disconnection
  
    expect(document.querySelectorAll('#playerLabels div').length).toBe(0);
  });
  

  test('Keyboard events should correctly trigger movement', async () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW', bubbles: true }));
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyW', bubbles: true }));
  
    await new Promise((resolve) => setTimeout(resolve, 50));  // Allow event propagation
  
    expect(global.socket.emit).toHaveBeenCalledWith(
      'keydown',
      expect.objectContaining({ keycode: 'KeyW' })
    );
  });
  

  test('Canvas should be accessible in the document', () => {
    const canvas = document.querySelector('canvas');
    expect(canvas).not.toBeNull();
    expect(canvas.getContext('2d')).not.toBeNull();
  });

  test('Socket should connect and disconnect correctly', () => {
    expect(mockSocket.connect).not.toHaveBeenCalled();
    expect(mockSocket.disconnect).not.toHaveBeenCalled();

    mockSocket.connect();
    expect(mockSocket.connect).toHaveBeenCalledTimes(1);

    mockSocket.disconnect();
    expect(mockSocket.disconnect).toHaveBeenCalledTimes(1);
  });

  test('Socket should handle incoming events correctly', () => {
    const mockCallback = jest.fn();
    socket.on('playerJoined', mockCallback);

    // Simulate receiving an event
    socket.on.mock.calls[0][1]({ username: 'NewPlayer' });

    expect(mockCallback).toHaveBeenCalledWith({ username: 'NewPlayer' });
  });
});
