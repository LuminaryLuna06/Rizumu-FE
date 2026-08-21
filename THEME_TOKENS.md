# 🎨 Theme Tokens Reference

Tài liệu này chứa toàn bộ design tokens đã được setup trong `src/index.css`.

---

## 📋 **1. Typography - Fonts & Sizes**

### **Font Families:**
| Token Name | CSS Variable    | Giá trị                 | Mục đích                                    |
| ---------- | --------------- | ----------------------- | ------------------------------------------- |
| Inter      | `--font-inter`   | `Inter, sans-serif`     | Font mặc định cho toàn bộ body, nút, inputs |
| Poppins    | `--font-poppins` | `Poppins, sans-serif`   | Font tiêu đề, header, modals                |

### **Font Sizes:**
| Token Name  | CSS Variable       | Giá trị    | Kích thước | Sử dụng với class |
| ----------- | ------------------ | ---------- | ---------- | ----------------- |
| Extra Small | `--font-size-xs`   | `0.75rem`  | 12px       | `text-xs`         |
| Small       | `--font-size-sm`   | `0.875rem` | 14px       | `text-sm`         |
| Base        | `--font-size-base` | `1rem`     | 16px       | `text-base`       |
| Large       | `--font-size-lg`   | `1.125rem` | 18px       | `text-lg`         |
| Extra Large | `--font-size-xl`   | `1.25rem`  | 20px       | `text-xl`         |
| 2X Large    | `--font-size-2xl`  | `1.5rem`   | 24px       | `text-2xl`        |
| 3X Large    | `--font-size-3xl`  | `1.875rem` | 30px       | `text-3xl`        |
| 4X Large    | `--font-size-4xl`  | `2.25rem`  | 36px       | `text-4xl`        |
| 5X Large    | `--font-size-5xl`  | `5rem`     | 80px       | `text-5xl`        |

---

## 📐 **2. Typography - Line Heights & Numerical Display**

| Token Name | CSS Variable        | Giá trị | Sử dụng với class |
| ---------- | ------------------- | ------- | ----------------- |
| Tight      | `--leading-tight`   | `1.25`  | `leading-tight`   |
| Normal     | `--leading-normal`  | `1.5`   | `leading-normal`  |
| Relaxed    | `--leading-relaxed` | `1.75`  | `leading-relaxed` |
| Tabular    | -                   | -       | `tabular-nums` (Chống rung lắc số đồng hồ) |

---

## 🔢 **3. Z-Index Layers**

| Token Name   | CSS Variable       | Giá trị | Mục đích               | Sử dụng với class |
| ------------ | ------------------ | ------- | ---------------------- | ----------------- |
| Base         | `--z-base`         | `0`     | Default layer          | `z-base`          |
| Dropdown     | `--z-dropdown`     | `1000`  | Dropdown menus         | `z-dropdown`      |
| Sticky       | `--z-sticky`       | `1100`  | Sticky headers/footers | `z-sticky`        |
| Modal        | `--z-modal`        | `2000`  | Modal overlays         | `z-modal`         |
| Popover      | `--z-popover`      | `2100`  | Popovers               | `z-popover`       |
| Tooltip      | `--z-tooltip`      | `3000`  | Tooltips               | `z-tooltip`       |
| Notification | `--z-notification` | `4000`  | Toast notifications    | `z-notification`  |

---

## ⚡ **4. Transitions - Animation Durations**

| Token Name | CSS Variable          | Giá trị | Khi nào dùng                      | Sử dụng với class |
| ---------- | --------------------- | ------- | --------------------------------- | ----------------- |
| Fast       | `--transition-fast`   | `150ms` | Hover effects, quick changes      | `duration-fast`   |
| Base       | `--transition-base`   | `300ms` | Default transitions (recommended) | `duration-base`   |
| Slow       | `--transition-slow`   | `500ms` | Large animations                  | `duration-slow`   |
| Slower     | `--transition-slower` | `700ms` | Modals, complex animations        | `duration-slower` |

---

## 🎨 **5. Colors & Design Palette**

### **Core Palette & Overlays:**
| Token Name      | CSS Variable              | Giá trị                  | Sử dụng với class                |
| --------------- | ------------------------- | ------------------------ | -------------------------------- |
| Primary         | `--color-primary`         | `#000000`                | `bg-primary`, `text-primary`     |
| Primary Light   | `--color-primary-light`   | `rgba(0,0,0,0.2)`        | `bg-primary-light`               |
| Primary Hover   | `--color-primary-hover`   | `rgba(0,0,0,0.5)`        | `bg-primary-hover`               |
| Secondary       | `--color-secondary`       | `#ffffff`                | `bg-secondary`, `text-secondary` |
| Secondary Hover | `--color-secondary-hover` | `rgba(255,255,255,0.85)` | `bg-secondary-hover`             |
| Popover Overlay | `--color-popover-overlay` | `rgba(0,0,0,0.5)`        | `bg-popover-overlay`             |
| Modal Overlay   | `--color-modal-overlay`   | `rgba(0,0,0,0.85)`       | `bg-modal-overlay`               |

### **Text Hierarchy:**
| Token Name      | CSS Variable              | Giá trị                  | Mục đích sử dụng                 | Sử dụng với class    |
| --------------- | ------------------------- | ------------------------ | -------------------------------- | -------------------- |
| Text Active/Main| `--color-text-main`       | `rgba(255,255,255,1)`    | Tiêu đề chính, số đồng hồ, highlight | `text-text-main` |
| Text Muted      | `--color-text-muted`      | `rgba(255,255,255,0.7)`  | Subtitle, label form, mô tả      | `text-text-muted`    |
| Text Inactive   | `--color-text-inactive`   | `rgba(255,255,255,0.5)`  | Mục chưa active, icon mờ         | `text-text-inactive` |
| Text Subtle     | `--color-text-subtle`     | `rgba(255,255,255,0.4)`  | Placeholder, timestamp, hint     | `text-text-subtle`   |

### **Semantic Status Colors:**
| Token Name    | CSS Variable            | Giá trị                   | Mục đích sử dụng                 | Sử dụng với class                  |
| ------------- | ----------------------- | ------------------------- | -------------------------------- | ---------------------------------- |
| Danger        | `--color-danger`        | `#ef4444`                 | Báo lỗi, xóa task, kick thành viên | `text-danger`, `bg-danger`       |
| Danger Light  | `--color-danger-light`  | `rgba(239, 68, 68, 0.15)` | Nền cảnh báo lỗi mờ              | `bg-danger-light`                  |
| Warning       | `--color-warning`       | `#f59e0b`                 | Streak flame, cảnh báo gần hết giờ | `text-warning`, `bg-warning`     |
| Warning Light | `--color-warning-light` | `rgba(245, 158, 11, 0.15)`| Nền cảnh báo vàng mờ             | `bg-warning-light`                 |
| Success       | `--color-success`       | `#10b981`                 | Hoàn thành phiên, kết bạn        | `text-success`, `bg-success`       |
| Success Light | `--color-success-light` | `rgba(16, 185, 129, 0.15)`| Nền xanh lá mờ                   | `bg-success-light`                 |
| Info          | `--color-info`          | `#3b82f6`                 | Tooltip, huy hiệu thông tin      | `text-info`, `bg-info`             |
| Info Light    | `--color-info-light`    | `rgba(59, 130, 246, 0.15)`| Nền thông tin xanh dương mờ      | `bg-info-light`                    |
| Copy / Accent | `--color-copy`          | `#34d399`                 | Nút copy, hành động nhanh        | `text-copy`, `bg-copy`             |

---

## 🔲 **6. Border Radius**

| Token Name  | CSS Variable    | Giá trị    | Kích thước | Sử dụng với class |
| ----------- | --------------- | ---------- | ---------- | ----------------- |
| Small       | `--radius-sm`   | `0.25rem`  | 4px        | `rounded-sm`      |
| Medium      | `--radius-md`   | `0.5rem`   | 8px        | `rounded-md`      |
| Large       | `--radius-lg`   | `0.75rem`  | 12px       | `rounded-lg`      |
| Extra Large | `--radius-xl`   | `1rem`     | 16px       | `rounded-xl`      |
| 2X Large    | `--radius-2xl`  | `1.5rem`   | 24px       | `rounded-2xl`     |
| 3X Large    | `--radius-3xl`  | `1.25rem`  | 20px       | `rounded-3xl`     |
| Full        | `--radius-full` | `9999px`   | ∞          | `rounded-full`    |

---

## 📏 **7. Spacing (Padding & Margin)**

| Token Name  | CSS Variable    | Giá trị   | Kích thước | Sử dụng với class                |
| ----------- | --------------- | --------- | ---------- | -------------------------------- |
| Extra Small | `--spacing-xs`  | `0.25rem` | 4px        | `p-xs`, `m-xs`, `px-xs`, `py-xs` |
| Small       | `--spacing-sm`  | `0.5rem`  | 8px        | `p-sm`, `m-sm`                   |
| Medium      | `--spacing-md`  | `0.75rem` | 12px       | `p-md`, `m-md`                   |
| Large       | `--spacing-lg`  | `1rem`    | 16px       | `p-lg`, `m-lg`                   |
| Extra Large | `--spacing-xl`  | `1.5rem`  | 24px       | `p-xl`, `m-xl`                   |
| 2X Large    | `--spacing-2xl` | `2rem`    | 32px       | `p-2xl`, `m-2xl`                 |
| 3X Large    | `--spacing-3xl` | `2.5rem`  | 40px       | `p-3xl`, `m-3xl`                 |
| 4X Large    | `--spacing-4xl` | `3rem`    | 48px       | `p-4xl`, `m-4xl`                 |
| 5X Large    | `--spacing-5xl` | `4rem`    | 64px       | `p-5xl`, `m-5xl`                 |
| 6X Large    | `--spacing-6xl` | `5rem`    | 80px       | `p-6xl`, `m-6xl`                 |
