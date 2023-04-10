/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  semi: true,
  trailingComma: 'none',
  singleQuote: true,
  printWidth: 120
};

module.exports = config;
