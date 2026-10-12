const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const METRO_PORT = process.env.PORT || 8081;
const TUNNEL_URL_REGEX = /https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/;
const SHARED_ENDPOINTS_PATH = path.resolve(__dirname, '..', '..', 'tunnel-endpoints.json');

// 1. Chạy check-env trước
try {
  require('./check-env');
} catch (e) {
  process.exit(1);
}

// 2. Tìm binary cloudflared
function findCloudflared() {
  // Thử PATH
  try {
    execSync('cloudflared --version', { stdio: 'ignore' });
    return 'cloudflared';
  } catch (err) {
    // Không có trong PATH
  }

  const candidates = [
    'C:\\Program Files (x86)\\cloudflared\\cloudflared.exe',
    'C:\\Program Files\\cloudflared\\cloudflared.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Programs', 'cloudflared', 'cloudflared.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Links', 'cloudflared.exe'),
    path.join(process.env.USERPROFILE || '', 'bin', 'cloudflared.exe'),
    path.resolve(__dirname, '..', 'tools', 'cloudflared.exe'),
    path.resolve(__dirname, '..', '..', 'tools', 'cloudflared.exe'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

const cloudflaredBin = findCloudflared();
if (!cloudflaredBin) {
  console.error('\n' + '='.repeat(80));
  console.error('❌ KHÔNG TÌM THẤY CLOUDFLARED CLI TRÊN MÁY TÍNH!');
  console.error('👉 Vui lòng cài đặt Cloudflare Tunnel qua winget (PowerShell):');
  console.error('   winget install --id Cloudflare.cloudflared');
  console.error('='.repeat(80) + '\n');
  process.exit(1);
}

console.log(`\n☁️  Đang khởi tạo Cloudflare Tunnel cho Expo Metro Bundler (port ${METRO_PORT})...`);

const cfArgs = ['tunnel', '--url', `http://localhost:${METRO_PORT}`, '--no-autoupdate'];
const cfProcess = spawn(cloudflaredBin, cfArgs, { stdio: ['ignore', 'pipe', 'pipe'] });

let tunnelUrl = null;
let expoProcess = null;

function cleanup() {
  if (cfProcess && !cfProcess.killed) {
    try {
      cfProcess.kill();
    } catch (_) {}
  }
  if (expoProcess && !expoProcess.killed) {
    try {
      expoProcess.kill();
    } catch (_) {}
  }
}

process.on('SIGINT', () => {
  cleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  cleanup();
  process.exit(0);
});

process.on('exit', cleanup);

function handleOutput(data) {
  const text = data.toString();
  if (!tunnelUrl) {
    const match = text.match(TUNNEL_URL_REGEX);
    if (match) {
      tunnelUrl = match[0];
      onTunnelReady(tunnelUrl);
    }
  }
}

cfProcess.stdout.on('data', handleOutput);
cfProcess.stderr.on('data', handleOutput);

cfProcess.on('exit', (code) => {
  if (!tunnelUrl) {
    console.error(`\n❌ Cloudflare Tunnel đóng sớm với mã thoát: ${code}`);
  }
});

function onTunnelReady(url) {
  console.log('\n' + '='.repeat(80));
  console.log('🚀 [CLOUDFLARE TUNNEL FOR EXPO] KẾT NỐI METRO THÀNH CÔNG!');
  console.log(`   🌐 Expo Public Tunnel: ${url}`);
  console.log('   📱 Thiết bị mọi mạng (Wi-Fi, 4G/5G) đều có thể kết nối và tải bundle!');
  console.log('='.repeat(80) + '\n');

  // Lưu URL mobile vào shared endpoints json nếu có
  try {
    let shared = {};
    if (fs.existsSync(SHARED_ENDPOINTS_PATH)) {
      shared = JSON.parse(fs.readFileSync(SHARED_ENDPOINTS_PATH, 'utf8'));
    }
    shared.mobile = {
      expoTunnelUrl: url,
      localPort: METRO_PORT,
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(SHARED_ENDPOINTS_PATH, JSON.stringify(shared, null, 2), 'utf8');
  } catch (_) {}

  // Chuyển tiếp tham số dòng lệnh cho expo start
  const extraArgs = process.argv.slice(2);
  const expoArgs = ['start', ...extraArgs];

  console.log(`▶️ Đang khởi chạy Expo với proxy: ${url} ...\n`);

  expoProcess = spawn('npx', ['expo', ...expoArgs], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      EXPO_PACKAGER_PROXY_URL: url,
    },
  });

  expoProcess.on('exit', (code) => {
    cleanup();
    process.exit(code || 0);
  });
}
