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
> ⚠️ **LƯU Ý:** Mobile có script `check-env.js` tự động kiểm tra trước khi chạy. Nếu **quên tạo file `.env`** hoặc **để `localhost`/URL mẫu**, lệnh khởi chạy sẽ **dừng ngay lập tức** kèm hướng dẫn sửa lỗi.

1. Copy file cấu hình mẫu `.env.example`:
   ```bash
   cp .env.example .env
   # Trên Windows PowerShell:
   Copy-Item .env.example .env
   ```
2. Mở file `.env` và điền URL Backend theo **1 trong 2 Lựa chọn** bên dưới:
   ```env
   EXPO_PUBLIC_API_URL=https://<URL_BACKEND_CỦA_BẠN>/api
   ```

---

## 🌐 2 Lựa chọn kết nối Backend khi test Mobile

Vì điện thoại là thiết bị riêng biệt nên **không thể gọi `localhost:8080` của máy tính**. Bạn chọn **1 trong 2 cách** sau:

### ⭐ Lựa chọn 1: Dùng Port Forwarding của VS Code (Dễ nhất - Khuyên dùng)
> Không cần cài thêm phần mềm gì, chỉ cần máy tính đang mở VS Code.

1. Tại cửa sổ **VS Code** đang mở Backend, nhìn xuống bảng điều khiển dưới cùng cạnh tab Terminal, chọn tab **Ports**.
2. Bấm **Forward a Port** ➔ Nhập `8080` (port Spring Boot).
3. Chuột phải vào dòng port `8080` ➔ chọn **Port Visibility** ➔ **Public**.
4. Copy link dạng `https://xxxx-8080.asse.devtunnels.ms` dán vào file `.env` của mobile:
   ```env
   EXPO_PUBLIC_API_URL=https://xxxx-8080.asse.devtunnels.ms/api
   ```

---

### ⭐ Lựa chọn 2: Dùng Ngrok (Nếu không dùng VS Code)
> Dành cho ai dùng IntelliJ IDEA, Eclipse hoặc chạy backend ngoài terminal.

1. Tải Ngrok tại [ngrok.com](https://ngrok.com) và cấu hình authtoken theo hướng dẫn của Ngrok.
2. Mở một cửa sổ terminal riêng và chạy:
   ```bash
   ngrok http 8080
   ```
3. Copy link HTTPS công khai (VD: `https://xxxx.ngrok-free.app`) dán vào file `.env` của mobile:
   ```env
   EXPO_PUBLIC_API_URL=https://xxxx.ngrok-free.app/api
   ```

---

### Bước 3: Khởi chạy ứng dụng Mobile

#### 🔹 Chế độ Khuyên dùng (Chạy qua Tunnel - Bất kỳ mạng Wi-Fi nào hoặc 4G/5G đều test được):
```bash
npm run tunnel
```
*Lần đầu tiên chạy lệnh này nếu terminal hỏi cài `@expo/ngrok`, gõ `y` rồi nhấn Enter.*

#### 🔹 Chế độ Local thông thường (Chỉ dùng khi điện thoại & máy tính bắt chung 1 Wi-Fi):
```bash
npm start
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
