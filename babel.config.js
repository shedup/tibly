module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
<<<<<<< HEAD
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
=======
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
>>>>>>> d3a0859e56b50e0e3d2e211d1fbaae3c7b8f3e03
    ],
  };
};
