let currentAdapter = null;
let adapters = {};
let config = {
  // Common Config
  wormSpeed: 3,
  wormDensity: 5,
  wormColor: '#E31937',
  bgColor: '#000000',
  wormText: "cgi",
  wormDirection: "left",
  effectMode: "worms", // Logic specific to p5/others
  renderer: "p5.js" // Which library to use
};

function init() {
    // Initialize Adapters
    adapters["p5.js"] = new P5Adapter();
    adapters["Three.js"] = new ThreeAdapter();
    adapters["Pixi.js"] = new PixiAdapter();

    // Start default
    updateTitle();
    changeAdapter(config.renderer);

    setupTestMode();
}

function setupTestMode() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('testmode') === 'true') {
        fetch('LivelyProperties.json')
            .then(response => response.json())
            .then(props => createTestUI(props))
            .catch(err => console.error("Failed to load properties for test mode:", err));
    }
}

function createTestUI(props) {
    const container = document.createElement('div');
    Object.assign(container.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        width: '300px',
        maxHeight: '90vh',
        overflowY: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        zIndex: '10000',
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
    });

    const title = document.createElement('h3');
    title.textContent = 'Test Mode Controls';
    title.style.margin = '0 0 10px 0';
    container.appendChild(title);

    for (const [key, param] of Object.entries(props)) {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';

        const label = document.createElement('label');
        label.textContent = param.text || key;
        label.style.fontSize = '12px';
        label.style.marginBottom = '4px';
        wrapper.appendChild(label);

        let input;

        if (param.type === 'dropdown') {
            input = document.createElement('select');
            param.items.forEach((item, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = item;
                if (index === param.value) option.selected = true;
                input.appendChild(option);
            });
            input.onchange = (e) => livelyPropertyListener(key, parseInt(e.target.value));
        } else if (param.type === 'slider') {
            input = document.createElement('input');
            input.type = 'range';
            input.min = param.min;
            input.max = param.max;
            input.step = param.step || 1;
            input.value = param.value;

            const valDisplay = document.createElement('span');
            valDisplay.textContent = param.value;
            valDisplay.style.fontSize = '11px';
            valDisplay.style.alignSelf = 'flex-end';

            input.oninput = (e) => {
                const val = parseFloat(e.target.value);
                valDisplay.textContent = val;
                livelyPropertyListener(key, val);
            };
            wrapper.appendChild(input);
            wrapper.appendChild(valDisplay);
        } else if (param.type === 'color') {
            input = document.createElement('input');
            input.type = 'color';
            input.value = param.value;
            input.oninput = (e) => livelyPropertyListener(key, e.target.value);
        } else if (param.type === 'textbox') {
            input = document.createElement('input');
            input.type = 'text';
            input.value = param.value;
            input.oninput = (e) => livelyPropertyListener(key, e.target.value);
        }

        if (input && param.type !== 'slider') { // slider already appended
            wrapper.appendChild(input);
        }

        container.appendChild(wrapper);
    }

    const resetBtn = document.createElement('button');
    resetBtn.textContent = "Restart Generation";
    resetBtn.style.marginTop = "10px";
    resetBtn.style.padding = "8px";
    resetBtn.style.cursor = "pointer";
    resetBtn.style.backgroundColor = "#E31937";
    resetBtn.style.color = "white";
    resetBtn.style.border = "none";
    resetBtn.style.borderRadius = "4px";
    resetBtn.onclick = () => resetAdapter();
    container.appendChild(resetBtn);

    document.body.appendChild(container);
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

function resetAdapter() {
    changeAdapter(config.renderer);
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
    case "wormDirection":
       config.wormDirection = ["Random", "Right", "Left", "Top", "Bottom"][val];
       break;
    case "effectMode":
       config.effectMode = ["Worms", "Star Trails", "Fireflies", "Matrix"][val];
       break;
    case "renderer":
       config.renderer = ["p5.js", "Three.js", "Pixi.js"][val];
       updateTitle();
       changeAdapter(config.renderer);
       return; // Don't propagate to updateProps immediately if we just switched
  }

  updateTitle();

  // Propagate to current adapter if it has an update method
  if (currentAdapter && currentAdapter.updateProps) {
      currentAdapter.updateProps(config);
  }
}

function updateTitle() {
    let title = `${config.renderer} - ${config.effectMode}`;
    if (config.wormText && config.wormText !== "CGI") {
        title += ` - ${config.wormText}`;
    }
    document.title = title;
}

window.onload = init;

function windowResized() {
    if (currentAdapter && currentAdapter.resize) {
        currentAdapter.resize(window.innerWidth, window.innerHeight);
    }
}
