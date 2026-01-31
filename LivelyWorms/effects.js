const Effects = {
    "Worms": {
        init: (p) => {
            p.maxHistory = 20;
        },
        update: (p, config) => {
            let noiseScale = 0.05;
            let wiggle = map(noise(p.noiseOffset), 0, 1, -0.5, 0.5);
            p.angle += wiggle;
            p.noiseOffset += noiseScale;
        },
        draw: (p) => {
            noFill();
            stroke(p.color);
            strokeWeight(2);
            beginShape();
            for (let v of p.history) {
                vertex(v.x, v.y);
            }
            endShape();
        }
    },
    "Star Trails": {
        init: (p) => {
            p.maxHistory = 40;
        },
        update: (p, config) => {
            let noiseScale = 0.01;
            let straightness = 0.8;
            p.speed *= 2.5; // Faster temporary modifier

            let wiggle = map(noise(p.noiseOffset), 0, 1, -0.5, 0.5);
            wiggle *= (1 - straightness);

            p.angle += wiggle;
            p.noiseOffset += noiseScale;
        },
        draw: (p) => {
            noFill();
            stroke(p.color);
            strokeWeight(3);
            beginShape();
            for (let v of p.history) {
                vertex(v.x, v.y);
            }
            endShape();
        }
    },
    "Fireflies": {
        init: (p) => {
            p.maxHistory = 5;
        },
        update: (p, config) => {
            let noiseScale = 0.1;
            p.speed *= 0.5; // Slower

            let wiggle = map(noise(p.noiseOffset), 0, 1, -0.5, 0.5);
            p.angle += wiggle;
            p.noiseOffset += noiseScale;
        },
        draw: (p) => {
            noStroke();
            fill(p.color);
            drawingContext.shadowBlur = 10;
            drawingContext.shadowColor = p.color;
            ellipse(p.pos.x, p.pos.y, 8, 8);
            drawingContext.shadowBlur = 0;
        }
    }
};
