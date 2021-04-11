module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
      ["auto-import", {
        "declarations": [
          { "default": "React", "path": "react"  }
        ]
      }],
    ],
  };
};
