class Particle {
  constructor(c, p) {
    this.pos = p.createVector(p.width / 2, p.height / 2);
    this.history = [];
    this.maxHistory = 50;
    this.angle = p.random(p.TWO_PI);
    this.speed = p.random(2, 5);
    this.noiseOffset = p.random(1000);

    if (c) {
       this.color = p.color(c);
    } else {
       this.color = p.color(p.random(100, 255), p.random(100, 255), 255);
    }
    this.target = null;
  }

  update(mode, config, p) {
    // Delegate specific update logic to Effects module
    if (Effects[mode] && Effects[mode].update) {
        Effects[mode].update(this, config, p);
    }

    // Common Move Logic
    let vel = p.p5.Vector.fromAngle(this.angle); // static method typically available on p5 or p.constructor.Vector?
    // In instance mode, p5.Vector is usually p.createVector or p5.Vector if p5 global is available.
    // However, p.createVector returns an object with methods.
    // Static methods like fromAngle might need 'p5.Vector' if global, or 'p.constructor.Vector'?
    // Safest in instance mode is usually creating a vector and setting angle.
    // let vel = p.createVector(1, 0); vel.setHeading(this.angle)? setHeading might not exist in older p5.
    // p5.Vector.fromAngle exists in global. In instance, it might be p.createVector()... wait.
    // p5 instance 'p' usually has 'p.createVector'.
    // For static methods, we can use 'p5.Vector.fromAngle' if p5 is globally defined (which it is via script tag).
    // Or 'p.constructor.Vector.fromAngle'?
    // Let's rely on global p5.Vector for static methods since we loaded p5.min.js globally.
    // BUT if we want true isolation... let's stick to global p5.Vector since the library is global.
    vel = p5.Vector.fromAngle(this.angle);
    vel.setMag(this.speed);

    // Steering Logic
    if (this.target) {
      let desired = p5.Vector.sub(this.target, this.pos);
      let d = desired.mag();

      let arrivalDist = 100;
      if (d < arrivalDist) {
        let m = p.map(d, 0, arrivalDist, 0, this.speed);
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

    let limit = (Effects[mode] && Effects[mode].maxHistory) ? Effects[mode].maxHistory : this.maxHistory;
    if (mode === "Star Trails") limit = 40;
    if (mode === "Fireflies") limit = 5;

    if (this.history.length > limit) {
      this.history.shift();
    }
  }

  show(mode, p) {
    if (Effects[mode] && Effects[mode].draw) {
        Effects[mode].draw(this, p);
    }
  }

  isDead(p) {
    return (this.pos.x < -100 || this.pos.x > p.width + 100 ||
            this.pos.y < -100 || this.pos.y > p.height + 100);
  }
}
