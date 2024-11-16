// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // より多くのNode.jsモジュールをポリフィル
      include: [
        'process',
        'util',
        'stream',
        'buffer',
        'events',
      ],
      globals: {
        process: true,
        Buffer: true,
      },
      // Node.jsのutilモジュールの完全なポリフィル
      // util: true
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Node.jsモジュールのブラウザバージョンを使用
      stream: 'stream-browserify',
      util: 'util/'
    }
  },
  optimizeDeps: {
    include: ['@circle-fin/w3s-pw-web-sdk']
  }
});