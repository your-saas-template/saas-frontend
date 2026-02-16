const plugin = require("tailwindcss/plugin");
const { colors } = require("../ui/theme/colors.js");

const themePlugin = plugin(function ({ addBase }) {
  const lightVars = {};
  const darkVars = {};

  Object.entries(colors).forEach(function ([key, value]) {
    lightVars[`--color-${key}`] = value.light;
    darkVars[`--color-${key}`] = value.dark;
  });

  addBase({
    ":root": lightVars,
    ".dark": darkVars,
  });
});

module.exports = { themePlugin };
