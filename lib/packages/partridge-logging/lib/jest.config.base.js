// inspired by - https://goo.gl/LovoZ2
module.exports = {
    // preset: 'ts-jest',
    preset: 'ts-jest/presets/js-with-babel',
    // moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
    // testEnvironment: 'jsdom',
    // testEnvironment: 'node',
    // testRegex: '(/tests/.*.(test|spec)).(jsx?|tsx?)$',
    // testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    // testMatch: null,
    // transform: {
    //   // '^.+\\.jsx?$': 'babel-jest',
    //   '^.+\\.tsx?$': 'ts-jest',
    // },
    snapshotSerializers: ['enzyme-to-json/serializer'],
    verbose: true,
};
//# sourceMappingURL=jest.config.base.js.map
//# sourceMappingURL=jest.config.base.js.map