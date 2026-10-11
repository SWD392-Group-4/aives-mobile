# AIVES Mobile App (React Native / Expo)

Ứng dụng di động dành cho hệ thống Vấn đáp & Đánh giá trực tuyến tích hợp AI (**AIVES**).

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy nhanh (Quick Start)

### 1. Yêu cầu môi trường
* **Node.js** >= 18.x
* Ứng dụng **Expo Go** trên điện thoại ([Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)).

### 2. Cài đặt thư viện
Tại thư mục `aives-mobile`, chạy:
```bash
npm install
```

### 3. Cấu hình biến môi trường (`.env`)
Tạo file `.env` từ file mẫu `.env.example`:
```bash
cp .env.example .env
```
Nội dung file `.env` cần có:
```env
EXPO_PUBLIC_API_URL=https://<URL_TUNNEL>/api
```

> ⚠️ **QUY TẮC BẮT BUỘC KHI TEST MOBILE:**
> **Tuyệt đối không để `localhost` hoặc `127.0.0.1`** trong `.env` vì điện thoại di động là thiết bị riêng biệt, không thể kết nối tới localhost của máy tính.
> Bạn cần chọn **1 trong 2 cách kết nối qua Tunnel** dưới đây:
>
> * **Cách 1 (Nếu dùng VS Code): Host Port trên VS Code (Khuyên dùng)**
>   1. Mở tab **Ports** trong VS Code (nằm cạnh tab Terminal).
>   2. Bấm **Forward a Port** ➔ Nhập `8080` (port Spring Boot Backend).
>   3. Chuột phải vào port 8080 vừa thêm ➔ **Port Visibility** ➔ Chọn **Public**.
>   4. Copy URL dạng `https://xxxx-8080.asse.devtunnels.ms` dán vào `.env`:
>      ```env
>      EXPO_PUBLIC_API_URL=https://xxxx-8080.asse.devtunnels.ms/api
>      ```
>
> * **Cách 2: Qua Ngrok (Nếu không dùng VS Code hoặc Ports bị lỗi)**
>   1. Mở một terminal riêng và chạy:
>      ```bash
>      ngrok http 8080
>      ```
>   2. Copy link HTTPS công khai (dạng `https://xxxx.ngrok-free.app`) dán vào `.env`:
>      ```env
>      EXPO_PUBLIC_API_URL=https://xxxx.ngrok-free.app/api
>      ```

---

### 4. Khởi chạy ứng dụng

#### 🔹 Chế độ Khuyên dùng (Chạy qua Tunnel - Khác Wi-Fi hay 4G/5G đều quét test được):
```bash
npm run tunnel
```
*(Nếu lần đầu chạy mà terminal hỏi cài `@expo/ngrok`, chỉ cần gõ `y` rồi Enter).*

#### 🔹 Chế độ Local (Chỉ khi máy tính và điện thoại chung 1 Wi-Fi):
```bash
npm start
```

* **Mở trên điện thoại:** Mở app **Expo Go**, quét mã QR trên màn hình terminal.
* **Mở trên Web:** Bấm phím `w` trong terminal.
* **Tải lại app sau khi đổi .env:** Bấm phím `r` trong terminal.

---

## 📱 Cấu trúc Thư mục Dự án

```text
aives-mobile/
├── .env.example              # File mẫu cấu hình biến môi trường
├── .env                      # File cấu hình thực tế (chứa URL Tunnel)
├── app/                      # Expo Router (Cấu trúc màn hình theo file-based routing)
│   ├── (tabs)/               # Bottom Navigation Tabs
│   │   ├── _layout.tsx       # Cấu hình thanh TabBar (Icon, Colors)
│   │   ├── index.tsx         # Trang chủ / Dashboard tổng quan
│   │   └── two.tsx           # Màn hình Tham gia ca thi (Kết nối API POST /exam-sessions/join)
│   ├── _layout.tsx           # Root navigation stack
│   ├── login.tsx             # Màn hình Đăng nhập (Kết nối API POST /auth/login)
│   ├── exam-room.tsx         # Màn hình Phòng thi vấn đáp AI (Timer, Mic ghi âm, Rubric)
│   └── results.tsx           # Màn hình Kết quả đánh giá & Điểm số, AI Feedback
├── services/                 # Tầng giao tiếp API Backend
│   ├── apiClient.ts          # Cấu hình fetch, tự động gắn Bearer Token & bypass header ngrok
│   ├── authService.ts        # API Đăng nhập / Đăng xuất / Me
│   ├── examSessionService.ts # API Tham gia ca thi / Nộp bài
│   └── tokenStorage.ts       # Lưu trữ token bảo mật trên điện thoại (Expo SecureStore)
├── constants/
│   └── Colors.ts             # Bảng màu thương hiệu chuẩn AIVES
└── package.json              # Khai báo thư viện & script lệnh
```

---

## 🛠️ Lưu ý quan trọng cho Thành viên Team
1. **Không kéo thả tay thư mục `node_modules`:** Khi tải code về máy mới, chỉ cần chạy `npm install`.
2. **Khi xóa cache hoặc cài lại:**
   * PowerShell: `Remove-Item -Recurse -Force node_modules, .expo` rồi chạy lại `npm install`.
3. **Biến môi trường trong Expo:** Bắt buộc phải có tiền tố `EXPO_PUBLIC_` ở đầu (ví dụ: `EXPO_PUBLIC_API_URL`) thì code trong app mới nhận diện được.
