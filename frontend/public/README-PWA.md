# PWA Setup Guide

## Mô tả
Ứng dụng đã được cấu hình như một Progressive Web App (PWA), cho phép người dùng cài đặt và sử dụng offline.

## Tính năng PWA

1. **Cài đặt trên thiết bị**: Người dùng có thể cài đặt app lên điện thoại/desktop
2. **Offline Support**: Service worker cache các tài nguyên để sử dụng offline
3. **App-like Experience**: Chạy như native app với standalone display mode
4. **Auto Update**: Service worker tự động cập nhật khi có phiên bản mới

## Icons cần thiết

Bạn cần tạo 2 file icon trong thư mục `public/`:
- `icon-192x192.png` (192x192 pixels)
- `icon-512x512.png` (512x512 pixels)

Có thể sử dụng tool online để tạo:
- https://www.pwabuilder.com/imageGenerator
- https://realfavicongenerator.net/

## Cài đặt

### 1. Cài đặt dependencies
```bash
cd frontend
npm install
```

### 2. Build ứng dụng
```bash
npm run build
```

Service worker sẽ được tự động generate trong thư mục `dist/`.

### 3. Test PWA

#### Chrome DevTools
1. Mở Chrome DevTools (F12)
2. Vào tab "Application"
3. Kiểm tra:
   - Service Workers: Xem service worker đã register chưa
   - Manifest: Xem manifest.json có đúng không
   - Cache Storage: Xem các cache đã được tạo chưa

#### Lighthouse
1. Mở Chrome DevTools
2. Vào tab "Lighthouse"
3. Chọn "Progressive Web App"
4. Chạy audit

## Cấu hình

### Manifest
File: `public/manifest.json`

Các thông tin có thể tùy chỉnh:
- `name`: Tên ứng dụng
- `short_name`: Tên ngắn
- `theme_color`: Màu theme
- `background_color`: Màu nền
- `icons`: Danh sách icons

### Service Worker
File: `vite.config.ts` (trong VitePWA plugin)

Cấu hình caching:
- `globPatterns`: Các file sẽ được cache
- `runtimeCaching`: Cấu hình cache cho API và images

## Sử dụng

### Kiểm tra cài đặt
```typescript
import { isInstalled } from './utils/pwa';

if (isInstalled()) {
  console.log('App đã được cài đặt');
}
```

### Hiển thị prompt cài đặt
Component `PWAInstallPrompt` sẽ tự động hiển thị prompt sau 3 giây nếu:
- Browser hỗ trợ PWA install
- App chưa được cài đặt
- User chưa dismiss prompt

### Manual install
```typescript
import { showInstallPrompt } from './utils/pwa';

const handleInstall = async () => {
  const installed = await showInstallPrompt();
  if (installed) {
    console.log('App đã được cài đặt');
  }
};
```

## Troubleshooting

### Service worker không register
1. Kiểm tra HTTPS (PWA yêu cầu HTTPS hoặc localhost)
2. Kiểm tra console có lỗi không
3. Kiểm tra `vite.config.ts` có đúng cấu hình không

### Icons không hiển thị
1. Kiểm tra file icons có tồn tại trong `public/` không
2. Kiểm tra path trong `manifest.json` có đúng không
3. Kiểm tra kích thước icons (192x192 và 512x512)

### App không cài đặt được
1. Kiểm tra manifest.json có valid không
2. Kiểm tra service worker có register thành công không
3. Kiểm tra HTTPS (production cần HTTPS)

### Cache không hoạt động
1. Kiểm tra service worker có active không
2. Kiểm tra `runtimeCaching` config trong `vite.config.ts`
3. Xóa cache và reload: Application → Clear storage → Clear site data

## Production Checklist

- [ ] Icons đã được tạo (192x192 và 512x512)
- [ ] Manifest.json đã được cấu hình đúng
- [ ] Service worker đã được test
- [ ] HTTPS đã được cấu hình
- [ ] PWA đã được test trên mobile
- [ ] Lighthouse score >= 90 cho PWA

