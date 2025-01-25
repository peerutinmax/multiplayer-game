const Particle = require('../../public/js/classes/Particle');

describe('Particle Class', () => {
  let particle;

  // Mock the global canvas context
  beforeAll(() => {
    global.c = {
      save: jest.fn(),
      globalAlpha: 1,
      beginPath: jest.fn(),
      arc: jest.fn(),
      fillStyle: '',
      fill: jest.fn(),
      restore: jest.fn(),
    };
  });

  beforeEach(() => {
    particle = new Particle(100, 150, 10, 'red', { x: 5, y: -3 });
  });

  test('should create a particle instance with correct properties', () => {
    expect(particle).toBeInstanceOf(Particle);
    expect(particle.x).toBe(100);
    expect(particle.y).toBe(150);
    expect(particle.radius).toBe(10);
    expect(particle.color).toBe('red');
    expect(particle.velocity).toEqual({ x: 5, y: -3 });
    expect(particle.alpha).toBe(1);
  });

  test('should update particle position based on velocity', () => {
    particle.update();

    expect(particle.x).toBeCloseTo(100 + 5 * 0.99);
    expect(particle.y).toBeCloseTo(150 - 3 * 0.99);
  });

  test('should gradually decrease velocity due to friction', () => {
    particle.update();
    particle.update();

    expect(particle.velocity.x).toBeCloseTo(5 * 0.99 * 0.99);
    expect(particle.velocity.y).toBeCloseTo(-3 * 0.99 * 0.99);
  });

  test('should decrease alpha value over time', () => {
    particle.update();
    expect(particle.alpha).toBeCloseTo(0.99);
  });

  test('should not decrease alpha below 0', () => {
    for (let i = 0; i < 200; i++) {
      particle.update();
    }
    expect(particle.alpha).toBeGreaterThanOrEqual(0);
  });

  test('should call draw function when update is called', () => {
    particle.update();
    expect(c.save).toHaveBeenCalled();
    expect(c.beginPath).toHaveBeenCalled();
    expect(c.arc).toHaveBeenCalledWith(100, 150, 10, 0, Math.PI * 2, false);
    expect(c.fill).toHaveBeenCalled();
    expect(c.restore).toHaveBeenCalled();
  });

  test('should maintain particle radius value', () => {
    expect(particle.radius).toBe(10);
  });
});
