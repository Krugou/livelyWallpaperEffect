class Particle {
  constructor(c) {
    this.pos = createVector(width / 2, height / 2);
    this.history = [];
    this.maxHistory = 50;
    this.angle = random(TWO_PI);
    this.speed = random(2, 5);
    this.noiseOffset = random(1000);

    if (c) {
       this.color = color(c);
    } else {
       this.color = color(random(100, 255), random(100, 255), 255);
    }
    this.target = null;
  }

  update(mode) {
    // Delegate specific update logic to Effects module
    if (Effects[mode] && Effects[mode].update) {
        Effects[mode].update(this, config);
    }

    // Common Move Logic
    let vel = p5.Vector.fromAngle(this.angle);
    vel.setMag(this.speed);

    // Steering Logic (if target exists)
    if (this.target) {
      let desired = p5.Vector.sub(this.target, this.pos);
      let d = desired.mag();

      let arrivalDist = 100; // Increased arrival distance for smoother entry
      if (d < arrivalDist) {
        let m = map(d, 0, arrivalDist, 0, this.speed);
        desired.setMag(m);
      } else {
        desired.setMag(this.speed);
      }

      let steer = p5.Vector.sub(desired, vel);
      steer.limit(0.3);
      vel.add(steer);
    }

    this.pos.add(vel);

    if (vel.mag() > 0.1) {
       this.angle = vel.heading();
    }

    this.history.push(this.pos.copy());

    // Use effect-specific maxHistory if defined, otherwise default
    let limit = (Effects[mode] && Effects[mode].maxHistory) ? Effects[mode].maxHistory : this.maxHistory;

    // Hardcoded overrides if needed for specific tuning not in module
    if (mode === "Star Trails") limit = 40;
    if (mode === "Fireflies") limit = 5;

    if (this.history.length > limit) {
      this.history.shift();
    }
  }

  show(mode) {
    if (Effects[mode] && Effects[mode].draw) {
        Effects[mode].draw(this);
    }
  }

  isDead() {
    return (this.pos.x < -100 || this.pos.x > width + 100 ||
            this.pos.y < -100 || this.pos.y > height + 100);
  }
}
