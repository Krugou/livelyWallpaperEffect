function applyDirectionBias(part, wiggle, p, strength = 0.1) {
    if (part.hasDirection && !part.target) {
        let diff = part.baseAngle - part.angle;
        while (diff < -p.PI) diff += p.TWO_PI;
        while (diff > p.PI) diff -= p.TWO_PI;
        return wiggle + diff * strength;
    }
    return wiggle;
}

const Effects = {
    "Worms": {
        init: (p) => {
            // p.maxHistory unused here
        },
        update: (part, config, p) => {
            let noiseScale = 0.05;
            let wiggle = p.map(p.noise(part.noiseOffset), 0, 1, -0.5, 0.5);

            if (part.target) {
                wiggle *= 0.2; // Reduce wandering when forming letters
            }
            wiggle = applyDirectionBias(part, wiggle, p, 0.1);
            part.angle += wiggle;
            part.noiseOffset += noiseScale;
        },
        draw: (part, p) => {
            p.noFill();
            p.stroke(part.color);
            p.strokeWeight(2);
            p.beginShape();
            for (let v of part.history) {
                p.vertex(v.x, v.y);
            }
            p.endShape();
        }
    },
    "Star Trails": {
        update: (part, config, p) => {
            let noiseScale = 0.01;
            let straightness = 0.8;
            part.speed *= 2.5;

            let wiggle = p.map(p.noise(part.noiseOffset), 0, 1, -0.5, 0.5);
            wiggle *= (1 - straightness);
            wiggle = applyDirectionBias(part, wiggle, p, 0.05);

            part.angle += wiggle;
            part.noiseOffset += noiseScale;
        },
        draw: (part, p) => {
            p.noFill();
            p.stroke(part.color);
            p.strokeWeight(3);
            p.beginShape();
            for (let v of part.history) {
                p.vertex(v.x, v.y);
            }
            p.endShape();
        }
    },
    "Fireflies": {
        update: (part, config, p) => {
            let noiseScale = 0.1;
            part.speed *= 0.5;

            let wiggle = p.map(p.noise(part.noiseOffset), 0, 1, -0.5, 0.5);
            wiggle = applyDirectionBias(part, wiggle, p, 0.15); // Fireflies are jumpier, so stronger pull

            part.angle += wiggle;
            part.noiseOffset += noiseScale;
        },
        draw: (part, p) => {
            p.noStroke();
            p.fill(part.color);
            p.drawingContext.shadowBlur = 10;
            p.drawingContext.shadowColor = part.color.toString(); // p5 color to string?
            // In instance mode, color object might differ. .toString() usually works.
            p.ellipse(part.pos.x, part.pos.y, 8, 8);
            p.drawingContext.shadowBlur = 0;
        }
    },
    "Matrix": {
        init: (p) => {
             p.maxHistory = 1; // No history needed for matrix rain particles, they are heads of logic
             // But our particle system keeps history.
             // We'll treat 'pos' as the head of the droplet.
             // We might need to store a "char" for the droplet.
             // And speed needs to be strictly vertical.
        },
        update: (part, config, p) => {
             // Re-init behavior if it hasn't been set up for Matrix
             if(!part.matrixChar) {
                 part.matrixChar = String.fromCharCode(0x30A0 + p.round(p.random(96))); // Katakana
                 part.speed = p.random(2, 5); // Fall speed
                 part.pos.x = p.floor(p.random(p.width / 20)) * 20; // Snap to grid columns
                 part.pos.y = p.random(-500, 0); // Start above
                 part.angle = p.HALF_PI; // Down
             }

             // Fall
             part.pos.y += part.speed;

             // Randomly change char
             if (p.random(1) < 0.05) {
                part.matrixChar = String.fromCharCode(0x30A0 + p.round(p.random(96)));
             }

             // Reset if bottom
             if (part.pos.y > p.height) {
                 part.pos.y = p.random(-100, 0);
             }
        },
        draw: (part, p) => {
            p.textSize(20);
            p.fill(part.color);
            p.noStroke();
            // Draw head
            p.text(part.matrixChar, part.pos.x, part.pos.y);

            // Draw simulated trail using history?
            // Our generic particle pushes history.
            // We can iterate history to draw fainter characters.
            p.drawingContext.shadowBlur = 5;
            p.drawingContext.shadowColor = part.color.toString();

            for (let i = 0; i < part.history.length; i+=2) { // Skip some for spacing
                 let v = part.history[i];
                 let opacity = p.map(i, 0, part.history.length, 0, 1);
                 // We need distinct chars for the trail? or same?
                 // Let's just draw darker rectangles or same char
                 p.fill(p.red(part.color), p.green(part.color), p.blue(part.color), opacity * 255);
                 p.text(String.fromCharCode(0x30A0 + (i % 5)), v.x, v.y);
            }
            p.drawingContext.shadowBlur = 0;
        }
    }
};
