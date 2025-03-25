/** @type {import('prettier').Config} */
module.exports = {
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
    plugins: [require('prettier-plugin-tailwindcss')],
    tailwindConfig: './tailwind.config.js',
}