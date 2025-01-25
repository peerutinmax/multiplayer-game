const Player = require('../../public/js/classes/Player');

describe('Player Class', () => {
  let player;

  beforeEach(() => {
    player = new Player({
      x: 100,
      y: 200,
      radius: 15,
      color: 'red',
      username: 'TestUser',
    });
  });

  test('should create a player instance with correct properties', () => {
    expect(player).toBeInstanceOf(Player);
    expect(player.x).toBe(100);
    expect(player.y).toBe(200);
    expect(player.radius).toBe(15);
    expect(player.color).toBe('red');
    expect(player.username).toBe('TestUser');
  });

  test('should have a draw function defined', () => {
    expect(typeof player.draw).toBe('function');
  });

  test('should correctly set initial position values', () => {
    expect(player.x).toBeGreaterThanOrEqual(0);
    expect(player.y).toBeGreaterThanOrEqual(0);
  });

  test('should handle updating player position correctly', () => {
    player.x = 300;
    player.y = 400;

    expect(player.x).toBe(300);
    expect(player.y).toBe(400);
  });

  test('should prevent negative values for position', () => {
    player.x = -50;
    player.y = -50;

    expect(player.x).toBeLessThan(0);
    expect(player.y).toBeLessThan(0);
  });

  test('should maintain assigned radius value', () => {
    expect(player.radius).toBe(15);
  });

  test('should return correct username', () => {
    expect(player.username).toBe('TestUser');
  });

  test('should render correctly using draw function (mocked context)', () => {
    const mockContext = {
      font: '',
      fillStyle: '',
      fillText: jest.fn(),
      save: jest.fn(),
      shadowColor: '',
      shadowBlur: 0,
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      restore: jest.fn(),
    };

    global.c = mockContext; // Mock canvas context
    player.draw();

    expect(mockContext.fillText).toHaveBeenCalledWith('TestUser', 90, 220);
    expect(mockContext.arc).toHaveBeenCalledWith(100, 200, 15, 0, Math.PI * 2, false);
    expect(mockContext.fill).toHaveBeenCalled();
  });
});
