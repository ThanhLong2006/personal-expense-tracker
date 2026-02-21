// frontend/vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load env file – BẮT BUỘC PHẢI CÓ DÒNG NÀY ĐỂ VITE ĐỌC .env +
  const env = loadEnv(mode, process.cwd(), '')

  // IN RA ĐỂ BẠN THẤY NGAY TRONG TERMINAL KHI CHẠY npm run dev
  console.log('VITE_API_URL:', env.VITE_API_URL || 'CHƯA CÓ .env – ĐANG DÙNG DEFAULT')

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'icon-192x192.png', 'icon-512x512.png'],
        manifest: {
          name: 'Quản Lý Chi Tiêu Cá Nhân',
          short_name: 'QLCTCN',
          description: 'Ứng dụng quản lý chi tiêu cá nhân hiện đại và tiện lợi',
          theme_color: '#3b82f6',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait-primary',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: '/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: '/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ],
          shortcuts: [
            {
              name: 'Thêm giao dịch',
              short_name: 'Thêm',
              description: 'Thêm giao dịch mới',
              url: '/transactions?action=add',
              icons: [{ src: '/icon-192x192.png', sizes: '192x192' }]
            },
            {
              name: 'Xem báo cáo',
              short_name: 'Báo cáo',
              description: 'Xem báo cáo chi tiêu',
              url: '/reports',
              icons: [{ src: '/icon-192x192.png', sizes: '192x192' }]
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\./i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 // 24 hours
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                }
              }
            }
          ]
        },
        devOptions: {
          enabled: true,
          type: 'module',
          navigateFallback: 'index.html'
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      host: true,
      watch: {
        usePolling: true,   // Thêm dòng này để Vite watch file tốt hơn trong Docker
      },
      // Bonus: Tăng thời gian timeout nếu mạng chậm hoặc Docker
      hmr: {
        overlay: true,
      },
    },
  }
})
// # Bật MySQL + Redis lên trước (chỉ cần chạy 1 lần)
// docker-compose up -d mysql redis

// # Đợi 10-15 giây để MySQL khởi động xong (rất quan trọng!)
// timeout /t 15

// # Sau đó mới chạy backend bên vs code hoặc terminal khác
//mvn spring-boot:run -Dspring-boot.run.profiles=localdocker
//  thì phải dừng bên docker lại rồi chạy lại lệnh trên
 // docker stop qlcn-backend
// # Cuối cùng chạy frontend
// cd frontend
// npm run dev