# 🎨 Theme Tokens Reference

Tài liệu này chứa toàn bộ design tokens đã được setup trong `src/index.css`.

---

## 📋 **1. Typography - Font Sizes**

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
| 5X Large    | `--font-size-5xl`  | `3rem`     | 48px       | `text-5xl`        |

### **Ví dụ:**

```tsx
<p className="text-xs">Caption - 12px</p>
<p className="text-sm">Small text - 14px</p>
<p className="text-base">Body - 16px</p>
<h3 className="text-xl">Subheading - 20px</h3>
<h2 className="text-2xl">Heading - 24px</h2>
<h1 className="text-3xl">Main Heading - 30px</h1>
<h1 className="text-5xl">Hero - 48px</h1>
```

---

## 📐 **2. Typography - Line Heights**

| Token Name | CSS Variable        | Giá trị | Sử dụng với class |
| ---------- | ------------------- | ------- | ----------------- |
| Tight      | `--leading-tight`   | `1.25`  | `leading-tight`   |
| Normal     | `--leading-normal`  | `1.5`   | `leading-normal`  |
| Relaxed    | `--leading-relaxed` | `1.75`  | `leading-relaxed` |

### **Ví dụ:**

```tsx
<p className="leading-tight">Tight line height (1.25)</p>
<p className="leading-normal">Normal line height (1.5)</p>
<p className="leading-relaxed">Relaxed line height (1.75)</p>
```

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

### **Ví dụ:**

```tsx
<div className="z-base">Normal content</div>
<div className="z-dropdown">Dropdown menu</div>
<header className="z-sticky sticky top-0">Sticky header</header>
<div className="z-modal fixed inset-0">Modal overlay</div>
<div className="z-tooltip">Tooltip</div>
<div className="z-notification fixed top-4 right-4">Notification</div>
```

---

## ⚡ **4. Transitions - Animation Durations**

| Token Name | CSS Variable          | Giá trị | Khi nào dùng                      | Sử dụng với class |
| ---------- | --------------------- | ------- | --------------------------------- | ----------------- |
| Fast       | `--transition-fast`   | `150ms` | Hover effects, quick changes      | `duration-fast`   |
| Base       | `--transition-base`   | `300ms` | Default transitions (recommended) | `duration-base`   |
| Slow       | `--transition-slow`   | `500ms` | Large animations                  | `duration-slow`   |
| Slower     | `--transition-slower` | `700ms` | Modals, complex animations        | `duration-slower` |

### **Ví dụ:**

```tsx
{
  /* Fast hover - 150ms */
}
<button className="hover:bg-primary-hover transition-all duration-fast">
  Quick
</button>;

{
  /* Normal transition - 300ms */
}
<button className="hover:bg-secondary-hover transition-all duration-base">
  Normal
</button>;

{
  /* Slow fade - 500ms */
}
<div className="opacity-0 hover:opacity-100 transition-opacity duration-slow">
  Slow fade
</div>;

{
  /* Modal animation - 700ms */
}
<div className="scale-95 hover:scale-100 transition-transform duration-slower">
  Modal
</div>;
```

---

## 🎨 **5. Colors**

| Token Name      | CSS Variable              | Giá trị                  | Sử dụng với class                |
| --------------- | ------------------------- | ------------------------ | -------------------------------- |
| Primary         | `--color-primary`         | `#000000`                | `bg-primary`, `text-primary`     |
| Primary Light   | `--color-primary-light`   | `rgba(0,0,0,0.2)`        | `bg-primary-light`               |
| Primary Hover   | `--color-primary-hover`   | `rgba(0,0,0,0.5)`        | `bg-primary-hover`               |
| Secondary       | `--color-secondary`       | `#ffffff`                | `bg-secondary`, `text-secondary` |
| Secondary Hover | `--color-secondary-hover` | `rgba(255,255,255,0.85)` | `bg-secondary-hover`             |
| Modal Overlay   | `--color-modal-overlay`   | `rgba(0,0,0,0.9)`        | `bg-modal-overlay`               |
| Text Inactive   | `--color-text-inactive`   | `rgba(255,255,255,0.5)`  | `text-text-inactive`             |
| Text Active     | `--color-text-active`     | `rgba(255,255,255,1)`    | `text-text-active`               |

---

## 🔲 **6. Border Radius**

| Token Name  | CSS Variable    | Giá trị   | Kích thước | Sử dụng với class |
| ----------- | --------------- | --------- | ---------- | ----------------- |
| Small       | `--radius-sm`   | `0.25rem` | 4px        | `rounded-sm`      |
| Medium      | `--radius-md`   | `0.5rem`  | 8px        | `rounded-md`      |
| Large       | `--radius-lg`   | `0.75rem` | 12px       | `rounded-lg`      |
| Extra Large | `--radius-xl`   | `1rem`    | 16px       | `rounded-xl`      |
| 2X Large    | `--radius-2xl`  | `1.5rem`  | 24px       | `rounded-2xl`     |
| Full        | `--radius-full` | `9999px`  | ∞          | `rounded-full`    |

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

---

## 🎯 **Ví dụ tổng hợp**

```tsx
import React from "react";

export default function Example() {
  return (
    <div className="p-2xl">
      {/* Button chính */}
      <button className="bg-primary-light text-white font-bold text-lg px-lg py-md rounded-lg hover:bg-primary-hover transition-all duration-base">
        Mở Modal
      </button>

      {/* Modal */}
      <div className="fixed inset-0 z-modal bg-modal-overlay flex items-center justify-center">
        <div className="bg-white p-2xl rounded-xl max-w-md">
          <h2 className="text-2xl font-bold mb-xl leading-tight">Settings</h2>

          <p className="text-base text-text-inactive hover:text-text-active transition-colors duration-fast mb-md leading-normal cursor-pointer">
            Option 1
          </p>

          <p className="text-base text-text-active leading-normal">
            Option 2 (Active)
          </p>

          {/* Start button */}
          <button className="bg-secondary text-primary text-xl font-semibold px-xl py-lg rounded-md hover:bg-secondary-hover transition-all duration-base mt-2xl w-full">
            Start
          </button>
        </div>
      </div>

      {/* Notification */}
      <div className="fixed top-4 right-4 z-notification bg-primary text-white text-sm px-lg py-md rounded-lg">
        Task completed!
      </div>
    </div>
  );
}
```

---

## ✅ **Checklist Theme đã setup**

- ✅ **Colors** - Primary, secondary, modal, text states
- ✅ **Typography** - Font sizes (xs → 5xl) + Line heights
- ✅ **Border Radius** - sm → full
- ✅ **Spacing** - xs → 6xl (padding/margin)
- ✅ **Z-Index** - 7 layers (base → notification)
- ✅ **Transitions** - 4 durations (fast → slower)

Design system hoàn chỉnh! 🎉
