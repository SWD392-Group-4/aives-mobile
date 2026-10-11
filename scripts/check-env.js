const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env');
const examplePath = path.resolve(__dirname, '..', '.env.example');

console.log('\n🔍 [AIVES Mobile] Đang kiểm tra cấu hình biến môi trường...');

if (!fs.existsSync(envPath)) {
  console.error('\n' + '='.repeat(75));
  console.error('❌ LỖI KHỞI ĐỘNG: KHÔNG TÌM THẤY FILE .env TRONG aives-mobile!');
  console.error('👉 Team member vui lòng copy file .env.example thành .env:');
  console.error('   Lệnh: cp .env.example .env');
  console.error('='.repeat(75) + '\n');
  process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf8');
const apiUrlLine = content.split('\n').find((line) => line.trim().startsWith('EXPO_PUBLIC_API_URL='));
const apiUrl = apiUrlLine ? apiUrlLine.split('=')[1]?.trim() : '';

if (!apiUrl || apiUrl.includes('<ngrok-id>') || apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1')) {
  console.error('\n' + '='.repeat(75));
  console.error('❌ LỖI CẤU HÌNH BIẾN MÔI TRƯỜNG TRONG aives-mobile/.env:');
  console.error('   Biến EXPO_PUBLIC_API_URL chưa được cấu hình URL Tunnel thực tế!');
  console.error('   Giá trị hiện tại: ' + (apiUrl || '(Đang trống)'));
  console.error('\n👉 Hướng dẫn:');
  console.error('   1. Nếu dùng VS Code: Ports tab -> Forward port 8080 -> Public -> Copy link asse.devtunnels.ms');
  console.error('   2. Hoặc chạy ngrok: ngrok http 8080 -> Copy link ngrok-free.app');
  console.error('='.repeat(75) + '\n');
  process.exit(1);
}

console.log('✅ Cấu hình .env hợp lệ! API Backend: ' + apiUrl + '\n');
