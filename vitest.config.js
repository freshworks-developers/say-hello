import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      include: ['app/scripts/**/*.js'],
      reportsDirectory: 'coverage/unit',
      reporter: ['json', 'text']
    }
  }
});
