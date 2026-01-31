class TextManager {
    constructor(p) {
        this.p = p; // Store instance
        this.targets = [];
    }

    generateTargets(txt) {
        this.targets = [];
        if (!txt) return;

        let p = this.p;

        // Create an off-screen graphics buffer using instance
        let pg = p.createGraphics(p.width, p.height);
        pg.pixelDensity(1);
        pg.background(0);
        pg.fill(255);
        pg.textAlign(p.CENTER, p.CENTER);
        pg.textStyle(p.BOLD);

        // Adjust text size based on string length to fit screen
        let fontSize = p.width / (txt.length * 0.7);
        if (fontSize > p.height * 0.8) fontSize = p.height * 0.8;
        pg.textSize(fontSize);

        pg.text(txt, p.width / 2, p.height / 2);

        pg.loadPixels();
        let step = 3;
        for (let y = 0; y < p.height; y += step) {
            for (let x = 0; x < p.width; x += step) {
                let index = (x + y * p.width) * 4;
                if (pg.pixels[index] > 128) {
                    this.targets.push(p.createVector(x, y));
                }
            }
        }
        pg.remove();
    }

    getTargets() {
        return this.targets;
    }
}
