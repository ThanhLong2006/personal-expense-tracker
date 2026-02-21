/**
 * PWA Utilities
 * Hàm tiện ích cho Progressive Web App
 */

/**
 * Kiểm tra xem app có thể cài đặt không
 */
export const isInstallable = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Kiểm tra xem browser có support PWA install không
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  return !isStandalone && !isIOS;
};

/**
 * Hiển thị prompt cài đặt PWA
 */
export const showInstallPrompt = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  // Kiểm tra xem có beforeinstallprompt event không
  const deferredPrompt = (window as any).deferredPrompt;
  
  if (!deferredPrompt) {
    console.log('PWA install prompt không khả dụng');
    return false;
  }

  try {
    // Hiển thị prompt
    deferredPrompt.prompt();
    
    // Đợi user phản hồi
    const { outcome } = await deferredPrompt.userChoice;
    
    // Xóa prompt
    (window as any).deferredPrompt = null;
    
    return outcome === 'accepted';
  } catch (error) {
    console.error('Lỗi khi hiển thị install prompt:', error);
    return false;
  }
};

/**
 * Kiểm tra xem app đã được cài đặt chưa
 */
export const isInstalled = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Kiểm tra standalone mode (đã cài đặt)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  // Kiểm tra iOS (đã thêm vào home screen)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isIOSStandalone = isIOS && (window.navigator as any).standalone === true;
  
  return isStandalone || isIOSStandalone;
};

/**
 * Đăng ký service worker update
 */
export const registerServiceWorkerUpdate = (): void => {
  if (typeof window === 'undefined') return;
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Service worker đã được update, reload trang
      window.location.reload();
    });
  }
};

