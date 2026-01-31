import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.browser,
        p5: "readonly",
        createCanvas: "readonly",
        windowWidth: "readonly",
        windowHeight: "readonly",
        pixelDensity: "readonly",
        background: "readonly",
        random: "readonly",
        createVector: "readonly",
        color: "readonly",
        map: "readonly",
        noise: "readonly",
        noFill: "readonly",
        stroke: "readonly",
        strokeWeight: "readonly",
        beginShape: "readonly",
        endShape: "readonly",
        vertex: "readonly",
        width: "readonly",
        height: "readonly",
        createGraphics: "readonly",
        noStroke: "readonly",
        fill: "readonly",
        ellipse: "readonly",
        drawingContext: "readonly",
        TWO_PI: "readonly",
        CENTER: "readonly",
        BOLD: "readonly",
        resizeCanvas: "readonly",
        max: "readonly",
        PIXI: "readonly",
        THREE: "readonly",
        Particle: "readonly",
        TextManager: "readonly",
        Effects: "readonly",
        P5Adapter: "readonly",
        ThreeAdapter: "readonly",
        PixiAdapter: "readonly"
      },
    },
    rules: {
      "prefer-arrow-callback": "error",
      "func-style": [
        "error",
        "expression",
        {
          "allowArrowFunctions": true
        }
      ],
      "no-unused-vars": "off" // Diabled for now as many variables are global/cross-file
    }
  }
];
