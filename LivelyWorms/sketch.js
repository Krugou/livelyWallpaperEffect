// Global Configuration Variables
let config = {
  wormSpeed: 3,
  wormDensity: 5,
  wormColor: '#E31937',
  bgColor: '#000000',
  wormText: "",
  effectMode: "Worms"
};

let particles = [];
let textManager;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  textManager = new TextManager();
}

function draw() {
  background(config.bgColor);

  // Spawn Logic
  if (random(100) < config.wormDensity) {
    particles.push(new Particle(config.wormColor));
  }

  // Target Management
  let targets = textManager.getTargets();

  // Assign targets
  if (targets.length > 0) {
      for (let i = 0; i < particles.length; i++) {
          let targetIndex = i % targets.length;
          particles[i].target = targets[targetIndex];
      }
  } else {
       for (let p of particles) {
          p.target = null;
      }
  }

  // Update and Draw
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].speed = config.wormSpeed;

    particles[i].update(config.effectMode);
    particles[i].show(config.effectMode);

    // Kill logic
    if (!particles[i].target && particles[i].isDead()) {
      particles.splice(i, 1);
    } else if (particles[i].target && particles[i].pos.dist(particles[i].target) > width * 2) {
       particles.splice(i, 1);
    }
  }

  // Cap array size
  let limit = targets.length > 0 ? max(500, targets.length) : 500;
  if (particles.length > limit) {
      particles.splice(0, particles.length - limit);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if(config.wormText) textManager.generateTargets(config.wormText);
}

function livelyPropertyListener(name, val) {
  switch(name) {
    case "wormSpeed":
      config.wormSpeed = val;
      break;
    case "wormColor":
      config.wormColor = val;
      for(let p of particles) p.color = color(val);
      break;
    case "wormDensity":
      config.wormDensity = val;
      break;
    case "wormText":
      // Default to "CGI" if text is empty
      let textToUse = (!val || val.trim() === "") ? "CGI" : val;
      config.wormText = textToUse;
      textManager.generateTargets(textToUse);
      break;
    case "effectMode":
      config.effectMode = ["Worms", "Star Trails", "Fireflies"][val];
      break;
  }
}
