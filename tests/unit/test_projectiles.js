const Projectile = require('../../public/js/classes/Projectile');

describe('Projectile Class', () => {
  let projectile;

  // Mock the global canvas context 'c'
  beforeEach(() => {
    global.c = {
      save: jest.fn(),
      shadowColor: '',
      shadowBlur: 0,
      beginPath: jest.fn(),
      arc: jest.fn(),
      fillStyle: '',
      fill: jest.fn(),
      restore: jest.fn(),
    };
  });

  test('should create a projectile instance with provided properties', () => {
    projectile = new Projectile({
      x: 100,
      y: 150,
      radius: 5,
      color: 'blue',
      velocity: { x: 2, y: 3 },
    });

    expect(projectile).toBeInstanceOf(Projectile);
    expect(projectile.x).toBe(100);
    expect(projectile.y).toBe(150);
    expect(projectile.radius).toBe(5);
    expect(projectile.color).toBe('blue');
    expect(projectile.velocity).toEqual({ x: 2, y: 3 });
  });

  test('should assign default color if none is provided', () => {
    projectile = new Projectile({
      x: 50,
      y: 50,
      radius: 10,
      velocity: { x: 1, y: 1 },
    });

    expect(projectile.color).toBe('white'); // Default color should be assigned
  });

  test('should update position correctly based on velocity', () => {
    projectile = new Projectile({
      x: 100,
      y: 200,
      radius: 5,
      color: 'red',
      velocity: { x: 4, y: -2 },
    });

    projectile.update();
    expect(projectile.x).toBe(104);
    expect(projectile.y).toBe(198);
  });

  test('should call draw function methods when drawing', () => {
    projectile = new Projectile({
      x: 100,
      y: 150,
      radius: 5,
      color: 'blue',
      velocity: { x: 2, y: 3 },
    });

    projectile.draw();

    expect(c.save).toHaveBeenCalled();
    expect(c.shadowColor).toBe('blue');
    expect(c.arc).toHaveBeenCalledWith(100, 150, 5, 0, Math.PI * 2, false);
    expect(c.fill).toHaveBeenCalled();
    expect(c.restore).toHaveBeenCalled();
  });

  test('should handle case where canvas context is undefined', () => {
    global.c = undefined; // Simulate case where 'c' is not defined

    projectile = new Projectile({
      x: 100,
      y: 100,
      radius: 5,
      velocity: { x: 1, y: 1 },
    });

    expect(() => projectile.draw()).not.toThrow();
  });

  test('should update position correctly even with negative velocity', () => {
    projectile = new Projectile({
      x: 200,
      y: 200,
      radius: 10,
      color: 'green',
      velocity: { x: -5, y: -5 },
    });

    projectile.update();
    expect(projectile.x).toBe(195);
    expect(projectile.y).toBe(195);
  });

  test('should handle zero velocity correctly', () => {
    projectile = new Projectile({
      x: 300,
      y: 300,
      radius: 5,
      color: 'yellow',
      velocity: { x: 0, y: 0 },
    });

    projectile.update();
    expect(projectile.x).toBe(300);
    expect(projectile.y).toBe(300);
  });
});
