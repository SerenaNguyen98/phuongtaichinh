# Phuongtaichinh — CLAUDE.md

## 1. Tổng Quan Dự Án

Trang landing page giới thiệu **khóa học luyện thi chứng chỉ hành nghề chứng khoán** (chứng chỉ Quản Lý Quỹ), thuộc thương hiệu **Phuongtaichinh**.

- **Framework**: Next.js 15 (App Router, TypeScript)
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **Website**: `src/app/page.tsx` (trang landing đơn trang, Next.js App Router)
- **Ngôn ngữ**: Tiếng Việt (`lang="vi"`)
- **Người dùng mục tiêu**: Người đi làm trong ngành chứng khoán, sinh viên tài chính, người chuẩn bị thi Quản Lý Quỹ
- **Liên hệ**: Hotline 0907.951.800 | phuongnt91188@gmail.com

---

## 2. Mục Đích Trang

- Giới thiệu khóa học 8 buổi thực chiến luyện thi chứng chỉ hành nghề chứng khoán
- Tạo landing page chuyển đổi — dẫn dắt người đọc đăng ký qua form
- Thu thập lead (email, tên, SĐT) qua form đăng ký và newsletter
- Cung cấp thông tin giá (7.000.000đ, giảm 30% từ 10.000.000đ)
- Tăng trust qua FAQ, chương trình học chi tiết, testimonial section

---

## 3. Cấu Trúc Trang (Sections)

| # | Section | Mục đích |
|---|---------|----------|
| 1 | **Navbar** | Điều hướng cố định + nút CTA đăng ký |
| 2 | **Hero** | Tiêu đề chính, giá, nút CTA, badge "Khai giảng tháng 7/2026" |
| 3 | **Problem Statement** | 4 pain points của người học (quá nhiều kiến thức, học sai trọng tâm,...) |
| 4 | **Solution** | 6 giải pháp của khóa học |
| 5 | **Target Audience** | 4 nhóm đối tượng phù hợp |
| 6 | **Course Content (Timeline)** | 8 buổi học chi tiết dạng timeline |
| 7 | **CTA / Register Form** | Form thu thập lead (họ tên, email, SĐT) + hotline |
| 8 | **FAQ** | 6 câu hỏi thường gặp dạng accordion `<details>` |
| 9 | **Footer** | Brand, liên hệ, newsletter signup |

---

## 4. Quy Tắc Thiết Kế Chung (Design System)

### 4.1 Màu Sắc

```
Background chính:   #090A14   (bg)
Background card:     #13141F   (bg-card)
Border:             #1F2030   (border-c)
Primary:            #DF6B33   (primary) — màu cam chính
Primary hover:      #C55A28   (primary-hover)
Text chính:         #FFFFFF   (text-main)
Text phụ:          #A0A0B0   (text-sub)
Background tối hơn: #050610   (bg-darker)
```

> **Mọi trang mới** phải khai báo các màu này trong `tailwind.config` (nếu dùng Tailwind) hoặc CSS variables. Không được phép dùng màu hex ngẫu nhiên ngoài palette trên.

### 4.2 Font Chữ

```
Heading:  Plus Jakarta Sans (Google Fonts) — bold, exb, exl
Body:     Inter (Google Fonts) — regular, medium, semibold
```

Cấu trúc trong HTML:
```html
<h1, h2, h3, h4, h5, h6> → class="font-heading font-bold/extrabold"
body / <p> / input / button → class="font-body"
```

### 4.3 Icons

Dùng **Lucide Icons** qua CDN, cấu trúc:

```html
<script src="https://unpkg.com/lucide@latest"></script>
<script>
  lucide.createIcons();
</script>
```

- Icon phải có `class="w-X h-X text-primary"` (hoặc `text-text-sub` cho icon phụ)
- Icon được dùng trong: navbar, feature cards, stats, FAQ, footer, CTA buttons
- Luôn gọi `lucide.createIcons()` sau khi thêm icon động (VD: mobile menu toggle)

### 4.4 Responsive Design

```
Container tối đa: max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8
Grid: sm: (640px+), md: (768px+), lg: (1024px+)
Mobile-first, tránh hardcoded pixel cho spacing
```

- Navbar: desktop hiển thị menu, mobile hiển thị hamburger menu
- Timeline (section 6): hiển thị đường kẻ giữa trên md+, layout block trên mobile
- Card grid: 1 col → 2 col → 3-4 col tùy section

### 4.5 Animation & Interaction

```
Scroll reveal:  class="reveal" → .visible (opacity 1, translateY 0)
               IntersectionObserver threshold: 0.1, rootMargin: "0px 0px -40px 0px"
               Mỗi phần tử delay thêm i * 80ms

Card hover:    translateY(-4px) + border-color → primary, transition 0.3s
Button hover:  background darken + scale(0.98), transition 0.3s
Navbar:        backdrop-blur(12px) + border-bottom khi scrollY > 50

Accordion:     <details>/<summary> với CSS chevron rotation + slideDown animation
Toast:         fixed bottom-right, translate + opacity transition, auto-hide 3.5s
```

### 4.6 Form Validation

Mọi form phải có:

```javascript
// Validation rules
- Họ tên: bắt buộc, trim whitespace
- Email: bắt buộc, regex /^[^\s@]+@[^\s@]+\.[^\s@]+$/
- SĐT: tùy chọn (VD: form đăng ký), nhưng nếu có thì format tùy chỉnh

// Error display
- Inline error dưới input: <p class="error-msg text-red-400 text-xs mt-1 hidden">
- Border đổi màu: input.style.borderColor = '#ef4444'
- Clear error on input: lắng nghe 'input' event để reset

// Success feedback
- Dùng showToast() để hiển thị thông báo thành công
- Reset form sau khi submit thành công
```

### 4.7 Navigation & Cross-Linking

```
Trang này dùng anchor links (#register, #faq, #course, #documents)
→ Các trang khác cũng nên follow cùng quy ước:
  #register    → form đăng ký
  #faq         → FAQ section
  #course      → chương trình học
  #documents   → tài liệu miễn phí (section tương lai)

Footer links bắt buộc:
- Hotline: <a href="tel:0907951800">
- Email:   <a href="mailto:phuongnt91188@gmail.com">
```

---

## 5. Các Hành Động (Actions) Đã Implement

| Hành động | Mã nguồn | Ghi chú |
|-----------|----------|---------|
| Toggle mobile menu | `menuBtn.addEventListener('click')` | Toggle `hidden` class, update aria-expanded, reinit icons |
| Đăng ký khóa học | `handleRegister(e)` → `form#registerForm` | Validate name + email, showToast, reset form |
| Newsletter signup | `subscribeNewsletter()` → `input#footerEmail` | Validate email, showToast, reset input |
| Navbar scroll effect | `scroll` event listener | Thêm class `nav-scrolled` khi scrollY > 50 |
| Scroll reveal | `IntersectionObserver` | Thêm class `visible` với stagger delay |
| Toast notification | `showToast(message)` | Hiện toast bottom-right, auto-hide 3.5s |
| Input error clear | `input` event listener trên mọi input | Clear error-msg + border color |

---

## 6. Kết Quả Mong Đợi

- Người dùng hiểu rõ khóa học, chương trình học, và giá trị
- Người dùng điền form đăng ký và nhận liên hệ tư vấn trong 24h
- Người dùng đăng ký newsletter để nhận tài liệu miễn phí
- Tỷ lệ chuyển đổi cao nhờ: social proof (stats bar), pain-solution flow, CTA rõ ràng

---

## 7. Cấu Trúc Thư Mục

```
src/
├── app/
│   ├── globals.css       # Tailwind + design tokens + scroll reveal CSS
│   ├── layout.tsx        # Root layout (metadata, fonts)
│   └── page.tsx          # Landing page (chuyển từ index.html)
├── components/
│   ├── ui/               # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── accordion.tsx
│   │   ├── toast.tsx + use-toast.ts + toaster.tsx
│   │   ├── separator.tsx
│   │   ├── dialog.tsx
│   │   ├── avatar.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── tabs.tsx
│   │   └── textarea.tsx
│   └── (sẽ thêm landing page sections ở đây)
└── lib/
    └── utils.ts          # cn() helper (shadcn/utils)
```

## 8. Checklist Khi Tạo Trang Mới

```
[ ] Copy tailwind.config colors + fontFamily (đã có trong tailwind.config.ts)
[ ] Import Google Fonts trong globals.css (@import)
[ ] Import và dùng icon từ lucide-react (thay vì CDN)
[ ] Navbar: fixed, blur, hamburger cho mobile
[ ] Footer: brand, liên hệ, newsletter
[ ] Form inputs: dùng shadcn Input + Label, validate + toast feedback
[ ] Responsive: test trên mobile (375px), tablet (768px), desktop (1200px+)
[ ] Scroll reveal cho các section chính (CSS .reveal + JS IntersectionObserver)
[ ] Điền href tel: và mailto: cho mọi liên kết liên hệ
[ ] Dark theme: background #090A14, không dùng màu sáng không có trong palette
```

## 9. Chạy Dự Án

```bash
npm run dev    # Dev server (localhost:3000)
npm run build  # Production build
npm run start  # Production server
```
