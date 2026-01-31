class TextManager {
    constructor() {
        this.targets = [];
    }

    generateTargets(txt) {
        this.targets = [];
        if (!txt) return;

        // Create an off-screen graphics buffer
        let pg = createGraphics(width, height);
        pg.pixelDensity(1);
        pg.background(0);
        pg.fill(255);
        pg.textAlign(CENTER, CENTER);
        pg.textStyle(BOLD);

        // Adjust text size based on string length to fit screen
        let fontSize = width / (txt.length * 0.7);
        if (fontSize > height * 0.8) fontSize = height * 0.8;
        pg.textSize(fontSize);

        pg.text(txt, width / 2, height / 2);

        pg.loadPixels();
        // Scan pixels. Step size determines density of points.
        let step = 5; // Higher density
        for (let y = 0; y < height; y += step) {
            for (let x = 0; x < width; x += step) {
                let index = (x + y * width) * 4;
                // Check brightness
                if (pg.pixels[index] > 128) {
                    this.targets.push(createVector(x, y));
                }
            }
        }
        pg.remove();
    }

    getTargets() {
        return this.targets;
    }
}
