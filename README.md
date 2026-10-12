# AIVES Mobile App (React Native / Expo)

Ứng dụng di động dành cho hệ thống Vấn đáp & Đánh giá trực tuyến tích hợp AI (**AIVES**).

---

## 🛠️ Yêu cầu môi trường (Prerequisites)
* **Node.js:** >= 18.x
* Ứng dụng **Expo Go** trên điện thoại:
  * [Tải trên Android (Google Play)](https://play.google.com/store/apps/details?id=host.exp.exponent)
  * [Tải trên iOS (App Store)](https://apps.apple.com/app/expo-go/id982107779)

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy nhanh (Quick Start)

### Bước 1: Cài đặt thư viện
Tại thư mục `aives-mobile`, mở terminal và chạy:
```bash
npm install
```

### Bước 2: Cấu hình biến môi trường (`.env`)
> ⚡ **TỰ ĐỘNG ĐỒNG BỘ:** Khi bạn khởi chạy Backend (`mvn spring-boot:run`), Backend sẽ tự động bật Cloudflare Tunnel và **tự động ghi `EXPO_PUBLIC_API_URL` vào file `.env` của mobile**. Bạn hầu như không cần làm gì thêm!
> Script `check-env.js` cũng sẽ tự động đồng bộ từ file chia sẻ nếu phát hiện Backend đang chạy.

Nếu muốn cấu hình thủ công hoặc kiểm tra, file `.env` sẽ có dạng:
```env
EXPO_PUBLIC_API_URL=https://<subdomain-ngẫu-nhiên>.trycloudflare.com/api
```

---

## 🌐 Khởi chạy Mobile với Cloudflare Tunnel

Khi test Mobile qua Expo Go, máy điện thoại cần kết nối với Expo Metro Bundler và Backend API. Hiện tại dự án đã chuyển toàn diện sang **Cloudflare Tunnel (Miễn phí, không cần tài khoản, ổn định)**:

### 🚀 Lệnh Khởi Chạy:

#### 🔹 Chế độ Tunnel qua Cloudflare (Khuyên dùng - 4G/5G hoặc bất kỳ mạng Wi-Fi nào):
```bash
npm run tunnel
```
*Lệnh này sẽ tự động mở Cloudflare Tunnel cho Expo Metro (port 8081), tạo URL công khai và in mã QR để quét qua app Expo Go.*

#### 🔹 Chế độ Local thông thường (Chỉ dùng khi máy tính & điện thoại chung 1 mạng Wi-Fi):
```bash
npm start
```

#### 🔹 Chế độ Ngrok cũ (Dự phòng):
```bash
npm run tunnel:ngrok
```

---

## 📱 Cách mở và kiểm tra ứng dụng:
1. **Mở trên điện thoại thật:** Mở app **Expo Go** trên điện thoại, quét mã QR hiển thị ở Terminal.
2. **Mở trên Trình duyệt Web máy tính:** Nhấn phím `w` trong terminal.
3. **Tải lại ứng dụng sau khi đổi .env:** Nhấn phím `r` trong terminal.

### 🔑 Tài khoản mẫu có sẵn trong DB để đăng nhập test:
* **Sinh viên:** `testmobile@fpt.edu.vn` / Mật khẩu: `Password@123`
* **Giảng viên:** `lamnn@fe.edu.vn` / Mật khẩu: `Aives@123`

---

## 🏗️ Cấu trúc Thư mục Dự án
```text
aives-mobile/
├── .env.example              # File mẫu cấu hình biến môi trường
├── .env                      # File cấu hình thực tế (Được gitignore bảo mật)
├── scripts/
│   └── check-env.js          # Script tự động chặn và cảnh báo nếu thiếu .env khi start
├── app/                      # Expo Router (Điều hướng theo cấu trúc file)
│   ├── (tabs)/               # Bottom Tabs: Dashboard & Vào phòng thi
│   ├── _layout.tsx           # Quản lý toàn bộ stack màn hình
│   ├── login.tsx             # Màn hình Đăng nhập (Gọi API POST /api/auth/login)
│   ├── exam-room.tsx         # Phòng thi vấn đáp AI (Timer, Mic ghi âm, Rubric)
│   └── results.tsx           # Kết quả điểm số, AI feedback & Phúc khảo
├── services/                 # Gọi API Backend
│   ├── apiClient.ts          # Cấu hình fetch, tự động gắn JWT Bearer token
│   ├── authService.ts        # API Đăng nhập / Đăng xuất
│   └── examSessionService.ts # API Tham gia ca thi
├── constants/
│   └── Colors.ts             # Bảng màu chuẩn thương hiệu AIVES
└── package.json
```
