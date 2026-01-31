class PixiAdapter {
    constructor() {
        this.app = null;
        this.particles = [];
        this.particleContainer = null;
        this.mouseX = 0;
        this.mouseY = 0;
    }

    start(config) {
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: config.bgColor || 0x000000,
            resolution: window.devicePixelRatio || 1,
            antialias: true
        });
        document.body.appendChild(this.app.view);

        // Handle Mouse
        this.app.view.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;

        // Create texture for particles (a simple circle)
        const gfx = new PIXI.Graphics();
        gfx.beginFill(0xFFFFFF);
        gfx.drawCircle(0, 0, 4);
        gfx.endFill();
        const texture = this.app.renderer.generateTexture(gfx);

        // ParticleContainer is faster for many sprites
        this.particleContainer = new PIXI.ParticleContainer(2000, {
            scale: true,
            position: true,
            rotation: true,
            uvs: true,
            alpha: true
        });
        this.app.stage.addChild(this.particleContainer);

        let count = 1000;
        let colorInt = parseInt(config.wormColor.replace('#', '0x'), 16);

        // Handle bad color parsing if necessary
        if(isNaN(colorInt)) colorInt = 0xFFFFFF;

        for (let i = 0; i < count; i++) {
            let p = new PIXI.Sprite(texture);
            p.tint = colorInt;
            p.x = Math.random() * this.app.screen.width;
            p.y = Math.random() * this.app.screen.height;
            p.vx = (Math.random() - 0.5);
            p.vy = (Math.random() - 0.5);
            p.speed = Math.random() * 2 + 1;
            p.anchor.set(0.5);
            p.originalScale = Math.random() * 0.5 + 0.2;
            p.scale.set(p.originalScale);
            this.particles.push(p);
            this.particleContainer.addChild(p);
        }

        this.app.ticker.add(() => {
            let speed = config.wormSpeed || 3;

            for (let i = 0; i < this.particles.length; i++) {
                let p = this.particles[i];

                // Simple flow field or attraction to mouse
                let dx = this.mouseX - p.x;
                let dy = this.mouseY - p.y;
                let dist = Math.sqrt(dx*dx + dy*dy);

                // Repel from mouse slightly
                if (dist < 200) {
                    p.vx -= (dx / dist) * 0.5;
                    p.vy -= (dy / dist) * 0.5;
                } else {
                     // Drift back to randomness
                     p.vx += (Math.random() - 0.5) * 0.1;
                     p.vy += (Math.random() - 0.5) * 0.1;
                }

                // Apply velocity
                p.x += p.vx * speed * 0.5;
                p.y += p.vy * speed * 0.5;

                // Friction
                p.vx *= 0.95;
                p.vy *= 0.95;

                // Bounds wrap
                if (p.x < 0) p.x = this.app.screen.width;
                if (p.x > this.app.screen.width) p.x = 0;
                if (p.y < 0) p.y = this.app.screen.height;
                if (p.y > this.app.screen.height) p.y = 0;
            }
        });
    }

    stop() {
        if (this.app) {
            this.app.destroy(true, { children: true, texture: true, baseTexture: true });
            this.app = null;
            this.particles = [];
        }
    }

    updateProps(config) {
        if (this.app) {
            // Need to handle color string to hex
            let bg = parseInt(config.bgColor.replace('#', '0x'), 16);
            if(!isNaN(bg)) this.app.renderer.backgroundColor = bg;
        }
        // Update tints
        let colorInt = parseInt(config.wormColor.replace('#', '0x'), 16);
        if(!isNaN(colorInt)) {
            for(let p of this.particles) {
                p.tint = colorInt;
            }
        }
    }

    resize(w, h) {
        if (this.app) {
            this.app.renderer.resize(w, h);
        }
    }
}
