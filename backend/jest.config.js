const { createDefaultPreset } = require("ts-jest/presets")

const tsJestTransformCfg = createDefaultPreset().transform

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};