const WebExtPlugin = require('web-ext-plugin');

module.exports = {
  plugins: [new WebExtPlugin({ sourceDir: 'extension-dist' })],
};
