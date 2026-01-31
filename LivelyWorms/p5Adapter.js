class P5Adapter {
    constructor() {
        this.myp5 = null;
    }

    start(initialConfig) {
        let sketch = (p) => {
            let particles = [];
            let textManager;

            p.setup = () => {
                p.createCanvas(p.windowWidth, p.windowHeight);
                p.pixelDensity(1);
                textManager = new TextManager(p); // Pass p instance if needed, or make TextManager generic
                // Note: TextManager currently relies on global functions like createGraphics.
                // We will need to update TextManager to accept 'p' or run in global mode?
                // For now, let's assume we fix TextManager.
            };

            p.draw = () => {
                p.background(initialConfig.bgColor);

                // Target Management
                let targets = textManager.getTargets();

                // Spawn Logic
                let spawnCount = 0;
                let needed = 0;
                if (targets.length > 0) {
                     needed = targets.length - particles.length;
                }

                if (needed > 0) {
                    // Spawn aggressively to fill text
                    let spawnBatch = p.min(needed, 10); // Spawn up to 10 per frame
                    for(let k=0; k<spawnBatch; k++){
                        particles.push(new Particle(initialConfig, p));
                    }
                } else if (p.random(100) < initialConfig.wormDensity) {
                    // Regular spawn
                    particles.push(new Particle(initialConfig, p));
                }

                // Assign targets
                if (targets.length > 0) {
                    for (let i = 0; i < particles.length; i++) {
                        let targetIndex = i % targets.length;
                        particles[i].target = targets[targetIndex];
                    }
                } else {
                     for (let part of particles) {
                        part.target = null;
                    }
                }

                for (let i = particles.length - 1; i >= 0; i--) {
                    particles[i].speed = initialConfig.wormSpeed;

                    // Update Particle to accept p for drawing
                    particles[i].update(initialConfig.effectMode, initialConfig, p);
                    particles[i].show(initialConfig.effectMode, p);

                    if (!particles[i].target && particles[i].isDead(p)) {
                        particles.splice(i, 1);
                    } else if (particles[i].target && particles[i].pos.dist(particles[i].target) > p.width * 2) {
                        particles.splice(i, 1);
                    }
                }

                 // Cap array size
                let limit = targets.length > 0 ? targets.length + 200 : 500;
                if (particles.length > limit) {
                    particles.splice(0, particles.length - limit);
                }
            };

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
                if(initialConfig.wormText) textManager.generateTargets(initialConfig.wormText);
            };

            // Attach methods for external control
            p.updateConfig = (newConfig) => {
                initialConfig = newConfig;
                 // Regenerate text if needed
                 if (textManager) textManager.generateTargets(initialConfig.wormText);
            };
        };

        this.myp5 = new p5(sketch);
    }

    stop() {
        if (this.myp5) {
            this.myp5.remove();
            this.myp5 = null;
        }
    }

    updateProps(config) {
        if (this.myp5 && this.myp5.updateConfig) {
            this.myp5.updateConfig(config);
        }
    }

    resize(w, h) {
        // p5 handles windowResized automatically via listener usually,
        // but if we removed the global listener, we might need to manually trigger.
        // In instance mode, p.windowResized is called by p5.
    }
}
