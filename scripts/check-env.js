const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env');
const examplePath = path.resolve(__dirname, '..', '.env.example');
const sharedEndpointsPath = path.resolve(__dirname, '..', '..', 'tunnel-endpoints.json');

console.log('\n🔍 [AIVES Mobile] Đang kiểm tra cấu hình biến môi trường...');

// Tự động tạo .env từ .env.example nếu chưa có
if (!fs.existsSync(envPath)) {
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log('ℹ️ Đã tự động tạo aives-mobile/.env từ .env.example.');
  } else {
    console.error('\n' + '='.repeat(75));
    console.error('❌ LỖI KHỞI ĐỘNG: KHÔNG TÌM THẤY FILE .env HOẶC .env.example TRONG aives-mobile!');
    console.error('='.repeat(75) + '\n');
    process.exit(1);
  }
}

// Kiểm tra xem có file tunnel-endpoints.json từ Backend vừa chạy không
let autoSyncedFromBackend = false;
let content = fs.readFileSync(envPath, 'utf8');
let apiUrlLine = content.split('\n').find((line) => line.trim().startsWith('EXPO_PUBLIC_API_URL='));
let apiUrl = apiUrlLine ? apiUrlLine.split('=')[1]?.trim() : '';

const isPlaceholderOrLocal = !apiUrl || apiUrl.includes('<ngrok-id>') || apiUrl.includes('<URL_BACKEND') || apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1');

if (isPlaceholderOrLocal && fs.existsSync(sharedEndpointsPath)) {
  try {
    const sharedData = JSON.parse(fs.readFileSync(sharedEndpointsPath, 'utf8'));
    if (sharedData?.backend?.apiUrl) {
      const newApiUrl = sharedData.backend.apiUrl;
      let lines = content.split(/\r?\n/);
      let updated = false;
      lines = lines.map((line) => {
        if (line.trim().startsWith('EXPO_PUBLIC_API_URL=')) {
          updated = true;
          return `EXPO_PUBLIC_API_URL=${newApiUrl}`;
        }
        return line;
      });
      if (!updated) {
        lines.push(`EXPO_PUBLIC_API_URL=${newApiUrl}`);
      }
      fs.writeFileSync(envPath, lines.join('\n'), 'utf8');
      apiUrl = newApiUrl;
      autoSyncedFromBackend = true;
      console.log(`⚡ [Auto-Sync] Đã tự động cập nhật Backend URL từ Cloudflare Tunnel: ${apiUrl}`);
    }
  } catch (err) {
    // Bỏ qua lỗi parse shared file
  }
}

if (!apiUrl || apiUrl.includes('<') || apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1')) {
  console.error('\n' + '='.repeat(75));
  console.error('❌ LỖI CẤU HÌNH BIẾN MÔI TRƯỜNG TRONG aives-mobile/.env:');
  console.error('   Biến EXPO_PUBLIC_API_URL chưa có URL công khai hợp lệ!');
  console.error('   Giá trị hiện tại: ' + (apiUrl || '(Đang trống)'));
  console.error('\n👉 Hướng dẫn khắc phục:');
  console.error('   1. Hãy khởi động Backend bằng lệnh: mvn spring-boot:run trong aives-backend.');
  console.error('      Backend sẽ tự động bật Cloudflare Tunnel và cập nhật URL vào đây!');
  console.error('   2. Hoặc cấu hình thủ công EXPO_PUBLIC_API_URL trong aives-mobile/.env');
  console.error('='.repeat(75) + '\n');
  process.exit(1);
}

if (autoSyncedFromBackend) {
  console.log('✅ Đã đồng bộ Backend Cloudflare Tunnel! API: ' + apiUrl + '\n');
} else {
  console.log('✅ Cấu hình .env hợp lệ! API Backend: ' + apiUrl + '\n');
}
