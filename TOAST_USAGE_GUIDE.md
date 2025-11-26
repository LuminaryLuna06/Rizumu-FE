# 🔔 Toast Notification - Hướng dẫn sử dụng

## 📦 Cài đặt

### Bước 1: Wrap app với ToastProvider

Mở file `src/main.tsx` và wrap app với `ToastProvider`:

```tsx
import { ToastProvider } from "./utils/toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>
);
```

### Bước 2: Sử dụng hook `useToast`

```tsx
import { useToast } from "../utils/toast";

function MyComponent() {
  const toast = useToast();

  return (
    <div>
      <button onClick={() => toast.success("Thành công!")}>Show Success</button>
    </div>
  );
}
```

---

## 🎯 Cách sử dụng cơ bản

### 1. **Success Toast**

```tsx
const toast = useToast();

toast.success("Lưu thành công!");
toast.success("Xóa thành công!", {
  title: "Success",
  duration: 3000,
});
```

### 2. **Error Toast**

```tsx
toast.error("Có lỗi xảy ra!");
toast.error("Không thể kết nối server", {
  title: "Error",
  duration: 5000,
});
```

### 3. **Warning Toast**

```tsx
toast.warning("Bạn chưa lưu thay đổi!");
toast.warning("Dung lượng sắp đầy", {
  title: "Warning",
});
```

### 4. **Info Toast**

```tsx
toast.info("Có cập nhật mới!");
toast.info("Hệ thống sẽ bảo trì vào 2h sáng", {
  title: "Thông báo",
});
```

---

## ⚙️ Tùy chỉnh nâng cao

### Thay đổi vị trí

```tsx
toast.success("Top left!", { position: "top-left" });
toast.success("Top right!", { position: "top-right" });
toast.success("Top center!", { position: "top-center" });
toast.success("Bottom left!", { position: "bottom-left" });
toast.success("Bottom right!", { position: "bottom-right" });
toast.success("Bottom center!", { position: "bottom-center" });
```

### Thay đổi thời gian hiển thị

```tsx
// Tự động ẩn sau 3 giây
toast.success("3 seconds", { duration: 3000 });

// Tự động ẩn sau 10 giây
toast.error("10 seconds", { duration: 10000 });

// Không tự động ẩn
toast.info("Manual close only", { duration: 0 });
```

### Thêm action button

```tsx
toast.info("Bạn có tin nhắn mới", {
  title: "Notification",
  action: {
    label: "Xem ngay",
    onClick: () => {
      console.log("Redirecting to messages...");
      // Navigate to messages page
    },
  },
});
```

### Sử dụng custom icon

```tsx
const CustomIcon = () => <span>🎉</span>;

toast.success("Chúc mừng!", {
  icon: <CustomIcon />,
});
```

### Sử dụng showToast với full options

```tsx
const id = toast.showToast({
  type: "success",
  title: "Upload Complete",
  message: "Your file has been uploaded successfully",
  duration: 5000,
  position: "top-right",
  action: {
    label: "View",
    onClick: () => console.log("View file"),
  },
});
```

### Đóng toast thủ công

```tsx
const id = toast.info("Processing...", { duration: 0 });

// Sau khi xử lý xong
setTimeout(() => {
  toast.hideToast(id);
  toast.success("Done!");
}, 3000);
```

---

## 📝 Ví dụ thực tế

### Form Submit

```tsx
import { useToast } from "../utils/toast";

function LoginForm() {
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Show loading toast
      const loadingId = toast.info("Đang đăng nhập...", { duration: 0 });

      // API call
      await loginAPI();

      // Hide loading, show success
      toast.hideToast(loadingId);
      toast.success("Đăng nhập thành công!");
    } catch (error) {
      toast.error("Sai tên đăng nhập hoặc mật khẩu");
    }
  };

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

### Delete Confirmation

```tsx
function DeleteButton({ itemId }) {
  const toast = useToast();

  const handleDelete = () => {
    toast.warning("Bạn có chắc muốn xóa?", {
      title: "Xác nhận",
      duration: 0,
      action: {
        label: "Xóa",
        onClick: async () => {
          await deleteItem(itemId);
          toast.success("Đã xóa thành công!");
        },
      },
    });
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

### File Upload

```tsx
function FileUpload() {
  const toast = useToast();

  const handleUpload = async (file: File) => {
    const uploadId = toast.info(`Đang tải ${file.name}...`, { duration: 0 });

    try {
      await uploadFile(file);
      toast.hideToast(uploadId);
      toast.success(`${file.name} đã được tải lên!`, {
        title: "Upload thành công",
      });
    } catch (error) {
      toast.hideToast(uploadId);
      toast.error(`Không thể tải ${file.name}`, {
        title: "Upload thất bại",
      });
    }
  };

  return (
    <input type="file" onChange={(e) => handleUpload(e.target.files![0])} />
  );
}
```

---

## 🎨 Customization

### Thay đổi màu sắc

Edit file `src/utils/toast.css`:

```css
.toast-success {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}
```

### Thay đổi border radius

```css
.toast-item {
  border-radius: var(--radius-xl); /* hoặc giá trị khác */
}
```

---

## 📱 Responsive

Toast tự động responsive trên mobile:

- Width: 100% - spacing
- Font size nhỏ hơn
- Gap nhỏ hơn

---

## ✨ Tính năng

- ✅ **4 loại toast**: success, error, warning, info
- ✅ **6 vị trí**: top/bottom × left/center/right
- ✅ **Auto dismiss**: Tự động ẩn sau thời gian
- ✅ **Manual close**: Nút đóng thủ công
- ✅ **Action button**: Thêm nút action
- ✅ **Custom icon**: Tùy chỉnh icon
- ✅ **Smooth animations**: Hiệu ứng mượt mà
- ✅ **Stacking**: Xếp chồng nhiều toast
- ✅ **Responsive**: Tối ưu mobile
- ✅ **TypeScript**: Type-safe
- ✅ **Theme integration**: Sử dụng theme tokens

---

## 🔧 API Reference

### `useToast()` Hook

Returns:

```tsx
{
  success: (message: string, options?) => string,
  error: (message: string, options?) => string,
  warning: (message: string, options?) => string,
  info: (message: string, options?) => string,
  showToast: (toast: Toast) => string,
  hideToast: (id: string) => void,
  toasts: Toast[]
}
```

### Toast Options

```tsx
{
  title?: string;              // Tiêu đề toast
  message: string;             // Nội dung (required)
  duration?: number;           // Thời gian hiển thị (ms), 0 = không tự ẩn
  position?: ToastPosition;    // Vị trí hiển thị
  icon?: ReactNode;            // Custom icon
  action?: {                   // Action button
    label: string;
    onClick: () => void;
  };
}
```

### Toast Positions

```tsx
type ToastPosition =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";
```

---

Chúc bạn code vui vẻ! 🚀
