class Projectile {
  constructor({ x, y, radius, color = 'white', velocity }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    if (typeof c !== 'undefined') {  // Ensure 'c' exists before drawing
      c.save();
      c.shadowColor = this.color;
      c.shadowBlur = 20;
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
      c.restore();
    }
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

module.exports = Projectile;
