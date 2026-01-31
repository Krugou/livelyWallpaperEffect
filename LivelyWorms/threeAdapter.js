class ThreeAdapter {
    constructor() {
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.tunnelGroup = null;
        this.starField = null;
        this.animationId = null;
    }

    start(config) {
        // Setup Three.js Scene
        this.scene = new THREE.Scene();
        // Fog for depth fading
        this.scene.fog = new THREE.FogExp2(config.bgColor || 0x000000, 0.05);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 100;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(config.bgColor || 0x000000);
        document.body.appendChild(this.renderer.domElement);

        // Create Tunnel Geometry
        // A series of torus loops
        const geometry = new THREE.TorusGeometry(10, 0.3, 16, 50);
        // Additive blending for neon glow
        const material = new THREE.MeshBasicMaterial({
            color: config.wormColor || 0xFF0055,
            wireframe: false,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });

        this.tunnelGroup = new THREE.Group();

        let count = 20;
        let spacing = 15;

        for(let i = 0; i < count; i++) {
            let torus = new THREE.Mesh(geometry, material);
            torus.position.z = i * -spacing;
            torus.rotation.z = i * 0.1;
            // Add some user data for animation reference if needed
            torus.userData = { initialZ: torus.position.z, id: i };
            this.tunnelGroup.add(torus);
        }

        this.scene.add(this.tunnelGroup);

        // Add some particles for speed sensation
        const starGeo = new THREE.BufferGeometry();
        const starCount = 200;
        const positions = new Float32Array(starCount * 3);
        for(let i=0; i<starCount*3; i++) {
            positions[i] = (Math.random() - 0.5) * 200;
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const starMat = new THREE.PointsMaterial({color: 0xffffff, size: 0.5, transparent: true});
        this.starField = new THREE.Points(starGeo, starMat);
        this.scene.add(this.starField);


        // Animation Loop
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);

            let speed = 0.5 * (config.wormSpeed || 5);

            // Move tunnel segments towards camera
            for(let child of this.tunnelGroup.children) {
                child.position.z += speed;
                child.rotation.z += 0.01;

                if(child.position.z > 20) {
                   child.position.z = -((count-1) * spacing) + 20;
                }
            }

            this.starField.rotation.z -= 0.002;

            this.renderer.render(this.scene, this.camera);
        };

        animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            document.body.removeChild(this.renderer.domElement);
            this.renderer.dispose();
            this.renderer = null;
        }
    }

    updateProps(config) {
        if (this.renderer) {
            this.renderer.setClearColor(config.bgColor);
            if(this.scene.fog) this.scene.fog.color.set(config.bgColor);
        }
        if (this.tunnelGroup) {
            for(let child of this.tunnelGroup.children) {
                child.material.color.set(config.wormColor);
            }
        }
    }

    resize(w, h) {
        if (this.camera && this.renderer) {
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        }
    }
}
