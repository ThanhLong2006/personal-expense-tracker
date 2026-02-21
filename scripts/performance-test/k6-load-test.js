/**
 * k6 Performance / Stress Test - Quản Lý Chi Tiêu Cá Nhân
 * 
 * Chạy: k6 run scripts/performance-test/k6-load-test.js
 * 
 * Cài k6: https://k6.io/docs/getting-started/installation/
 * - Windows: choco install k6
 * - Mac: brew install k6
 * - Linux: https://k6.io/docs/getting-started/installation/
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

// Cấu hình test
const BASE_URL = __ENV.API_URL || 'http://localhost:8085/api';

export const options = {
  stages: [
    { duration: '1m', target: 20 },   // Ramp up: 20 users trong 1 phút
    { duration: '3m', target: 20 },   // Giữ 20 users trong 3 phút
    { duration: '1m', target: 50 },   // Stress: tăng lên 50 users
    { duration: '3m', target: 50 },   // Giữ 50 users
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% requests < 3s
    http_req_failed: ['rate<0.05'],    // Error rate < 5%
  },
};

export default function () {
  // Test health endpoint (public)
  const healthRes = http.get(`${BASE_URL}/actuator/health`);
  check(healthRes, {
    'health status 200': (r) => r.status === 200,
    'health response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // Test auth endpoints
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: 'test@example.com',
    password: 'wrongpassword', // Sẽ fail - test error handling
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  check(loginRes, {
    'login responds': (r) => r.status === 200 || r.status === 401 || r.status === 400,
  });

  sleep(2);
}

