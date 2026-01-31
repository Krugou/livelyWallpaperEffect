class Particle {
  constructor(config, p) {
    this.history = [];
    this.maxHistory = 50;

    let dir = config.wormDirection || "Random";
    this.hasDirection = dir !== "Random";
    this.baseAngle = 0;

    if (dir === "Right") {
        this.baseAngle = 0;
        this.angle = p.random(-p.PI/4, p.PI/4);
        this.pos = p.createVector(-50, p.random(p.height));
    } else if (dir === "Left") {
        this.baseAngle = p.PI;
        this.angle = p.random(p.PI - p.PI/4, p.PI + p.PI/4);
        this.pos = p.createVector(p.width + 50, p.random(p.height));
    } else if (dir === "Top") {
        this.baseAngle = -p.HALF_PI; // Up
        this.angle = p.random(-p.HALF_PI - p.PI/4, -p.HALF_PI + p.PI/4);
        this.pos = p.createVector(p.random(p.width), p.height + 50);
    } else if (dir === "Bottom") {
        this.baseAngle = p.HALF_PI; // Down
        this.angle = p.random(p.HALF_PI - p.PI/4, p.HALF_PI + p.PI/4);
        this.pos = p.createVector(p.random(p.width), -50);
    } else {
        this.angle = p.random(p.TWO_PI);
        this.pos = p.createVector(p.random(p.width), p.random(p.height));
    }

    this.speed = p.random(2, 5);
    this.noiseOffset = p.random(1000);

    if (config.wormColor) {
       this.color = p.color(config.wormColor);
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
    let vel = p5.Vector.fromAngle(this.angle);
    vel.setMag(this.speed);

    // Steering Logic
    if (this.target) {
      let desired = p5.Vector.sub(this.target, this.pos);
      let d = desired.mag();

      let arrivalDist = 10;
      if (d < arrivalDist) {
        let m = p.map(d, 0, arrivalDist, 0, this.speed);
        desired.setMag(m);
      } else {
        desired.setMag(this.speed);
      }

      let steer = p5.Vector.sub(desired, vel);
      steer.limit(this.target ? 1.0 : 0.5);
      vel.add(steer);
    }

    this.pos.add(vel);

    if (vel.mag() > 0.1) {
       this.angle = vel.heading();
    }

    this.history.push(this.pos.copy());

    let limit = (Effects[mode] && Effects[mode].maxHistory) ? Effects[mode].maxHistory : this.maxHistory;
    if (this.target) limit = 15; // Shorter tails for clearer text
    else if (mode === "Star Trails") limit = 40;
    else if (mode === "Fireflies") limit = 5;

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
