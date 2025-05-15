// import { createDefaultPreset } from "ts-jest/presets";

// const tsJestTransformCfg = createDefaultPreset().transform

// /** @type {import("jest").Config} **/
// preset: 'ts-jest',
// export const testEnvironment = "node";
// export const transform = {
//   ...tsJestTransformCfg,
// };

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 30000, // 30 sec timeout, useful for DB tests
  // You can add more config here if needed
};