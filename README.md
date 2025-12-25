# 🎯 Rizumu - Rhymth

Rizumu là một ứng dụng Pomodoro Timer thế hệ mới, kết hợp giữa quản lý thời gian hiệu quả và tính năng social, giúp bạn tập trung làm việc/học tập cùng bạn bè một cách thú vị và đầy động lực.

## ✨ Tính năng nổi bật

### 🕐 Pomodoro Timer

- **Timer tùy chỉnh**: Điều chỉnh thời gian làm việc, nghỉ ngắn, nghỉ dài theo ý muốn
- **Tag hóa công việc**: Gắn tag (với 10 màu sắc) cho mỗi phiên làm việc để theo dõi chi tiết
- **Picture-in-Picture**: Hiển thị timer ở chế độ PiP để theo dõi khi làm việc khác
- **Preset quản lý**: Lưu và chuyển đổi giữa các cấu hình timer yêu thích

### 👥 Study Rooms

- **Phòng học tập nhóm**: Tạo hoặc tham gia phòng học cùng bạn bè
- **Background tùy chỉnh**: Chọn hình ảnh hoặc video làm nền cho phòng
- **Chia sẻ link phòng**: Mời bạn bè qua link đơn giản
- **Quản lý thành viên**: Chủ phòng có thể quản lý và kick thành viên

### 💬 Real-time Chat

- **Chat trong phòng**: Trò chuyện với các thành viên trong phòng học
- **Socket.io**: Cập nhật tin nhắn theo thời gian thực
- **Chia sẻ link**: Tự động fetch metadata cho Spotify và YouTube links

### 📊 Thống kê & Tiến độ

- **Biểu đồ thống kê**: Xem thời gian tập trung theo giờ, ngày, tuần
- **Streak tracking**: Theo dõi chuỗi ngày học tập liên tục
- **Ranking board**: Xếp hạng với bạn bè dựa trên thời gian tập trung
- **Profile Analytics**: Xem tổng giờ học, trung bình hàng ngày, phân bổ theo tag

### 🎨 Giao diện & Trải nghiệm

- **Modern UI/UX**: Thiết kế hiện đại với dark theme chủ đạo
- **Responsive**: Hoạt động mượt mà trên mọi thiết bị
- **Glassmorphism effects**: Hiệu ứng kính mờ đẹp mắt
- **Smooth animations**: Chuyển động mượt mà, tự nhiên
- **Background đa dạng**: Hỗ trợ cả ảnh tĩnh và video động

### 🤝 Quản lý bạn bè

- **Thêm/xóa bạn bè**: Tìm kiếm và kết nối với bạn bè qua email/username
- **Friend requests**: Quản lý lời mời kết bạn
- **Xem profile**: Xem thống kê và tiến độ của bạn bè

## 🛠️ Tech Stack

### Frontend Core

- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **React Router DOM** - Client-side Routing

### Styling

- **TailwindCSS 4** - Utility-first CSS Framework
- **Custom Design System** - Theme tokens chuẩn hóa (xem [THEME_TOKENS.md](./THEME_TOKENS.md))

### UI Components & Charts

- **Tabler Icons** - Icon set
- **Recharts** - Advanced charting library

### State Management & Data

- **React Context API** - Global state management (Auth, User data)
- **Custom Hooks** - Reusable logic (toast, server keep-alive)

### Real-time & API

- **Socket.io Client** - Real-time WebSocket communication
- **Axios** - HTTP client
- **Spotify Web API SDK** - Spotify integration

### Utilities

- **Day.js** - Date manipulation library

## 📋 Yêu cầu hệ thống

- **Node.js**: >= 18.x
- **Yarn**: >= 1.22.x (khuyến nghị) hoặc npm
- **Browser**: Chrome, Firefox, Safari, Edge (phiên bản mới nhất)

## 🚀 Cài đặt và Chạy

### 1. Clone repository

```bash
git clone https://github.com/LuminaryLuna06/Rizumu-FE.git
cd Rizumu-FE
```

### 2. Cài đặt dependencies

```bash
yarn install
# hoặc
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cập nhật các biến môi trường trong file `.env`:

```env
VITE_API_URL=https://your-backend-url.com/api
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

> **Lưu ý**:
>
> - `VITE_API_URL`: URL của backend API
> - Spotify credentials: Cần thiết để fetch metadata từ Spotify links (tùy chọn)

### 4. Chạy development server

```bash
yarn dev
# hoặc
npm run dev
```

Ứng dụng sẽ chạy trên `http://localhost:5173`

### 5. Build cho production

```bash
yarn build
# hoặc
npm run build
```

Build output sẽ được tạo trong thư mục `dist/`

### 6. Preview production build

```bash
yarn preview
# hoặc
npm run preview
```

## 📁 Cấu trúc Project

```
Rizumu-FE/
├── public/                 # Static assets (images, sounds, videos)
│   ├── image/             # Background images
│   ├── sound/             # Alarm sounds
│   └── video/             # Background videos
├── src/
│   ├── api/               # API configuration
│   │   └── config/        # Axios client setup
│   ├── components/        # Reusable UI components
│   │   ├── Auth/          # Login/Signup components
│   │   ├── Modal/         # Modal wrapper
│   │   ├── Popover/       # Popover wrapper
│   │   ├── ProfileModal/  # User profile & statistics
│   │   ├── ManageFriendModal/
│   │   ├── ActivitiesModal/
│   │   ├── BackgroundModal/
│   │   ├── FindStudyRoomModal/
│   │   ├── RankingBoard/
│   │   ├── StreakPopover/
│   │   ├── AppSetting/
│   │   └── ...            # Form inputs, buttons, etc.
│   ├── constants/         # App constants
│   ├── context/           # React Context (AuthContext)
│   ├── hooks/             # Custom React hooks
│   ├── models/            # TypeScript interfaces/types
│   ├── pages/
│   │   ├── Pomodoro/      # Main Pomodoro page
│   │   │   ├── components/
│   │   │   │   ├── Timer.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── ChatPopover.tsx
│   │   │   │   ├── RoomPopover.tsx
│   │   │   │   ├── IframePopover.tsx
│   │   │   │   └── TagSelector.tsx
│   │   │   └── index.tsx
│   │   └── LandingPage/
│   ├── routes/            # Route configuration
│   ├── types/             # Additional TypeScript types
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles + Design tokens
├── .env.example           # Environment variables template
├── THEME_TOKENS.md        # Design system documentation
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 Design System

Project sử dụng một design system nhất quán với các design tokens được định nghĩa trong `src/index.css`. Chi tiết đầy đủ về các tokens có thể xem tại [THEME_TOKENS.md](./THEME_TOKENS.md).

### Các token chính:

- **Colors**: Primary, Secondary, Text colors, Overlay colors
- **Typography**: Font sizes (xs → 5xl), Line heights
- **Spacing**: Padding/Margin (xs → 6xl)
- **Border Radius**: sm → full
- **Transitions**: Animation durations (fast → slower)
- **Z-index**: Layering system

## 📝 License

Dự án này được phân phối dưới giấy phép MIT. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 👥 Authors

- **Luna** - [@LuminaryLuna06](https://github.com/LuminaryLuna06) - maithetranh@gmail.com
- **Stn** - [@stn-1](https://github.com/stn-1) - Backend
- **Sinon** - [@Itz-Sinon](https://github.com/Itz-Sinon)
- **Hung** - [@nguyentienhung147mhdhn](https://github.com/nguyentienhung147mhdhn)

## 🙏 Acknowledgments

- Design inspiration từ các ứng dụng Pomodoro hiện đại
- Icons từ [Tabler Icons](https://tabler-icons.io/)

---

<p align="center">Made with ❤️ by Luna, Stn, Sinon and Hung</p>
<p align="center">⭐ Star this repo nếu bạn thấy hữu ích!</p>
