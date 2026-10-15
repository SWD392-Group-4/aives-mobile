const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env');
const examplePath = path.resolve(__dirname, '..', '.env.example');

const appEnv = process.env.APP_ENV || process.env.EXPO_PUBLIC_APP_ENV;
const isDeploy =
  appEnv === 'deploy' ||
  appEnv === 'production' ||
  process.env.EAS_BUILD === 'true' ||
  process.env.CI === 'true';

if (isDeploy) {
  console.log('\n🚀 [AIVES Mobile] Đang ở chế độ DEPLOY/PRODUCTION: Bỏ qua kiểm tra file .env cục bộ.\n');
  process.exit(0);
}

function parseEnvKeys(filePath) {
  if (!fs.existsSync(filePath)) return new Set();
  const content = fs.readFileSync(filePath, 'utf8');
  const keys = new Set();
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line && !line.startsWith('#') && line.includes('=')) {
      const key = line.substring(0, line.indexOf('=')).trim();
      if (key) keys.add(key);
    }
  }
  return keys;
}

console.log('\n🔍 [AIVES Mobile] Đang kiểm tra cấu hình biến môi trường...');

// Tự động tạo .env từ .env.example nếu chưa có
if (!fs.existsSync(envPath)) {
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log('ℹ️  Đã tự động tạo aives-mobile/.env từ .env.example.');
  } else {
    console.error('\n' + '='.repeat(75));
    console.error('❌ LỖI KHỞI ĐỘNG: KHÔNG TÌM THẤY FILE .env HOẶC .env.example TRONG aives-mobile!');
    console.error('='.repeat(75) + '\n');
    process.exit(1);
  }
}

// Kiểm tra đồng bộ key giữa .env và .env.example
if (fs.existsSync(examplePath)) {
  const exampleKeys = parseEnvKeys(examplePath);
  const envKeys = parseEnvKeys(envPath);

  const missingInEnv = [...exampleKeys].filter((k) => !envKeys.has(k));
  if (missingInEnv.length > 0) {
    console.error('\n' + '='.repeat(75));
    console.error('❌ LỖI ĐỒNG BỘ: aives-mobile/.env thiếu biến so với .env.example!');
    console.error('   Các biến cần bổ sung vào .env:');
    missingInEnv.forEach((k) => console.error(`   - ${k}`));
    console.error('\n👉 Vui lòng mở aives-mobile/.env.example và cập nhật vào .env của bạn!');
    console.error('='.repeat(75) + '\n');
    process.exit(1);
  }

  const missingInExample = [...envKeys].filter((k) => !exampleKeys.has(k));
  if (missingInExample.length > 0) {
    console.warn('\n⚠️  CẢNH BÁO: Phát hiện biến mới trong aives-mobile/.env chưa có trong .env.example:');
    missingInExample.forEach((k) => console.warn(`   - ${k}`));
    console.warn('👉 Hãy nhớ cập nhật lại .env.example để chia sẻ cho cả team!\n');
  }
}

// Kiểm tra biến EXPO_PUBLIC_API_URL
const content = fs.readFileSync(envPath, 'utf8');
const apiUrlLine = content.split('\n').find((line) => line.trim().startsWith('EXPO_PUBLIC_API_URL='));
const apiUrl = apiUrlLine ? apiUrlLine.split('=')[1]?.trim() : '';

if (!apiUrl || apiUrl.includes('<') || apiUrl.includes('>')) {
  console.error('\n' + '='.repeat(75));
  console.error('❌ LỖI CẤU HÌNH BIẾN MÔI TRƯỜNG TRONG aives-mobile/.env:');
  console.error('   Biến EXPO_PUBLIC_API_URL chưa có URL backend hợp lệ!');
  console.error('   Giá trị hiện tại: ' + (apiUrl || '(Đang trống)'));
  console.error('\n👉 Hướng dẫn khắc phục:');
  console.error('   Hãy điền URL backend vào EXPO_PUBLIC_API_URL trong aives-mobile/.env');
  console.error('   (Ví dụ: https://aives-backend-f40m.onrender.com/api)');
  console.error('='.repeat(75) + '\n');
  process.exit(1);
}

console.log('✅ Cấu hình .env hợp lệ! API Backend: ' + apiUrl + '\n');
