// jest.config.js
module.exports = {
  preset: "ts-jest", // Use ts-jest for transforming TypeScript files
  testEnvironment: "jest-environment-jsdom", // Use jsdom so that DOM APIs are available
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // Transform TypeScript and TSX files using ts-jest
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    // If you import CSS modules, this mocks them
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transformIgnorePatterns: ["/node_modules/"],
};
