import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  root: "/crypto_marketdata" // Use 'root' instead of 'base' if specifying the project root directory
});
