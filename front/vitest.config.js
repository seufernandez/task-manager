import { defineConfig } from 'vitest/config'

export default defineConfig({
 test: {
    environment: 'jsdom',
    // outras opções de configuração de teste aqui...
 },
})
