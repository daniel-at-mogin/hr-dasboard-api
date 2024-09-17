import { defineConfig } from 'tsup';
import { config } from 'dotenv';

config();

export default defineConfig({
  entry: ['src/server.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ['cjs'],
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
  onSuccess: 'node dist/server.js',
});