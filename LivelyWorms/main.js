let currentAdapter = null;
let adapters = {};
let config = {
  // Common Config
  wormSpeed: 3,
  wormDensity: 5,
  wormColor: '#E31937',
  bgColor: '#000000',
  wormText: "",
  effectMode: "Star Trails", // Logic specific to p5/others
  renderer: "p5.js" // Which library to use
};

function init() {
    // Initialize Adapters
    adapters["p5.js"] = new P5Adapter();
    adapters["Three.js"] = new ThreeAdapter();
    adapters["Pixi.js"] = new PixiAdapter();

    // Start default
    changeAdapter(config.renderer);
}

function changeAdapter(name) {
    if (currentAdapter) {
        currentAdapter.stop();
    }

    if (adapters[name]) {
        currentAdapter = adapters[name];
        currentAdapter.start(config);
    } else {
        console.error("Adapter not found: " + name);
    }
}

function livelyPropertyListener(name, val) {
  // Update Config
  switch(name) {
    case "wormSpeed":
      config.wormSpeed = val;
      break;
    case "wormColor":
      config.wormColor = val;
      break;
    case "wormDensity":
      config.wormDensity = val;
      break;
    case "wormText":
       let textToUse = (!val || val.trim() === "") ? "CGI" : val;
       config.wormText = textToUse;
       break;
    case "effectMode":
       config.effectMode = ["Worms", "Star Trails", "Fireflies", "Matrix"][val];
       break;
    case "renderer":
       config.renderer = ["p5.js", "Three.js", "Pixi.js"][val];
       changeAdapter(config.renderer);
       return; // Don't propagate to updateProps immediately if we just switched
  }

  // Propagate to current adapter if it has an update method
  if (currentAdapter && currentAdapter.updateProps) {
      currentAdapter.updateProps(config);
  }
}

window.onload = init;

function windowResized() {
    if (currentAdapter && currentAdapter.resize) {
        currentAdapter.resize(window.innerWidth, window.innerHeight);
    }
}
