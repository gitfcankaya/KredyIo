# Design System Tokens

**KredyIo Design System** - Extracted from component analysis (ProductCard, FilterSidebar, CalculatorWidget, Navigation)

This document describes the design tokens used throughout the KredyIo application. All tokens are configured in `tailwind.config.js`.

---

## 🎨 Color Palette

### Primary (Blue)

Main brand color for buttons, links, and interactive elements.

```
primary-50  : #eff6ff (Light backgrounds)
primary-100 : #dbeafe (Hover states)
primary-200 : #bfdbfe (Borders)
primary-300 : #93c5fd (Disabled states)
primary-400 : #60a5fa (Interactive)
primary-500 : #3b82f6 (Default)
primary-600 : #2563eb (Primary buttons) ⭐ Most used
primary-700 : #1d4ed8 (Hover)
primary-800 : #1e40af (Active)
primary-900 : #1e3a8a (Dark backgrounds)
```

**Usage:**

- Buttons: `bg-primary-600 hover:bg-primary-700`
- Links: `text-primary-600 hover:text-primary-700`
- Backgrounds: `bg-primary-50`
- Borders: `border-primary-200`

### Secondary (Indigo)

Accent color for gradients and secondary actions.

```
secondary-500 : #6366f1 (Default)
secondary-600 : #4f46e5 (Buttons)
secondary-700 : #4338ca (Hover)
```

**Usage:**

- Gradients: `bg-gradient-to-r from-primary-600 to-secondary-600`
- Secondary buttons: `bg-secondary-600`

### Success (Green)

Positive feedback, successful states, approvals.

```
success-50  : #f0fdf4 (Backgrounds)
success-100 : #dcfce7 (Light badges)
success-500 : #22c55e (Default)
success-600 : #16a34a (Buttons) ⭐
success-700 : #15803d (Hover)
```

**Usage:**

- Success messages: `bg-success-100 text-success-700`
- Approved badges: `bg-success-600 text-white`

### Warning (Yellow/Orange)

Alerts, important information, pending states.

```
warning-50  : #fffbeb (Backgrounds)
warning-100 : #fef3c7 (Light badges)
warning-500 : #f59e0b (Default)
warning-600 : #d97706 (Buttons)
warning-700 : #b45309 (Hover)
```

**Usage:**

- Warning messages: `bg-warning-100 text-warning-700`
- Attention badges: `bg-warning-500 text-white`

### Danger/Error (Red)

Errors, destructive actions, rejections.

```
danger-50  : #fef2f2 (Backgrounds)
danger-100 : #fee2e2 (Light badges)
danger-500 : #ef4444 (Default)
danger-600 : #dc2626 (Buttons) ⭐
danger-700 : #b91c1c (Hover)
```

**Usage:**

- Error messages: `bg-danger-100 text-danger-700`
- Delete buttons: `bg-danger-600 hover:bg-danger-700`

### Neutral (Gray)

Text, backgrounds, borders, and UI elements.

```
neutral-50  : #fafafa (Page backgrounds)
neutral-100 : #f5f5f5 (Card backgrounds)
neutral-200 : #e5e5e5 (Borders)
neutral-300 : #d4d4d4 (Disabled)
neutral-400 : #a3a3a3 (Placeholder)
neutral-500 : #737373 (Secondary text)
neutral-600 : #525252 (Body text) ⭐
neutral-700 : #404040 (Headings)
neutral-800 : #262626 (Dark headings)
neutral-900 : #171717 (Almost black)
```

**Usage:**

- Body text: `text-neutral-600`
- Headings: `text-neutral-900`
- Backgrounds: `bg-neutral-50`
- Borders: `border-neutral-200`

---

## 📐 Typography

### Font Families

```css
font-sans    : Inter, system-ui, sans-serif
font-display : Inter, system-ui, sans-serif
```

### Font Sizes

```
text-xs   : 12px / 1rem     (Small labels, badges)
text-sm   : 14px / 1.25rem  (Body text, descriptions) ⭐
text-base : 16px / 1.5rem   (Default text) ⭐
text-lg   : 18px / 1.75rem  (Subtitles)
text-xl   : 20px / 1.75rem  (Section titles)
text-2xl  : 24px / 2rem     (Page titles) ⭐
text-3xl  : 30px / 2.25rem  (Hero subtitles)
text-4xl  : 36px / 2.5rem   (Hero titles) ⭐
text-5xl  : 48px / 1        (Large hero)
text-6xl  : 60px / 1        (XL hero)
```

### Font Weights

```
font-normal    : 400 (Body text)
font-medium    : 500 (Labels, nav items) ⭐
font-semibold  : 600 (Headings, buttons) ⭐
font-bold      : 700 (Important headings)
font-extrabold : 800 (Hero titles)
```

### Typography Examples

```html
<!-- Heading 1 -->
<h1 class="text-4xl font-bold text-neutral-900">
  <!-- Heading 2 -->
  <h2 class="text-2xl font-semibold text-neutral-800">
    <!-- Body Text -->
    <p class="text-base text-neutral-600">
      <!-- Small Text -->
      <span class="text-sm text-neutral-500">
        <!-- Button Text -->
        <button class="text-sm font-semibold"></button
      ></span>
    </p>
  </h2>
</h1>
```

---

## 📏 Spacing System

### Common Spacing Values

```
0.5 : 2px
1   : 4px
2   : 8px   ⭐
3   : 12px  ⭐
4   : 16px  ⭐
5   : 20px
6   : 24px  ⭐
8   : 32px  ⭐
10  : 40px
12  : 48px  ⭐
16  : 64px
20  : 80px
24  : 96px
```

### Spacing Usage

**Padding:**

```
p-2  : Small buttons, badges
p-3  : Input fields
p-4  : Cards, containers
p-6  : Large cards
p-8  : Sections
```

**Margins:**

```
mb-2 : Between elements
mb-4 : Paragraph spacing
mb-6 : Section spacing
mb-8 : Large section gaps
```

**Gaps:**

```
gap-2 : Tight grids
gap-4 : Normal grids ⭐
gap-6 : Loose grids
gap-8 : Section gaps
```

---

## 🔘 Border Radius

```
rounded-none : 0px
rounded-sm   : 2px  (Small elements)
rounded      : 4px  (Default) ⭐
rounded-md   : 6px  (Cards, inputs) ⭐
rounded-lg   : 8px  (Large cards) ⭐
rounded-xl   : 12px (Modals)
rounded-2xl  : 16px (Large containers)
rounded-3xl  : 24px (Hero sections)
rounded-full : 9999px (Pills, avatars) ⭐
```

### Border Radius Examples

```html
<!-- Button -->
<button class="rounded-lg">
  <!-- Card -->
  <div class="rounded-xl">
    <!-- Badge -->
    <span class="rounded-full">
      <!-- Input -->
      <input class="rounded-md"
    /></span>
  </div>
</button>
```

---

## 🌑 Box Shadows

### Shadow Scale

```
shadow-xs   : Subtle depth
shadow-sm   : Small cards ⭐
shadow      : Default cards
shadow-md   : Elevated cards ⭐
shadow-lg   : Dropdowns ⭐
shadow-xl   : Modals
shadow-2xl  : High elevation
```

### Custom Shadows

```
shadow-card       : Card default state
shadow-card-hover : Card hover state ⭐
shadow-dropdown   : Dropdown menus ⭐
shadow-modal      : Modal overlays
shadow-focus      : Focus rings (blue) ⭐
```

### Shadow Examples

```html
<!-- Card -->
<div class="shadow-md hover:shadow-card-hover">
  <!-- Dropdown -->
  <div class="shadow-dropdown">
    <!-- Modal -->
    <div class="shadow-modal">
      <!-- Focus State -->
      <input class="focus:shadow-focus" />
    </div>
  </div>
</div>
```

---

## ⚡ Transitions & Animations

### Duration

```
duration-75  : Very fast
duration-150 : Fast ⭐
duration-200 : Normal ⭐
duration-300 : Smooth ⭐
duration-500 : Slow
```

### Timing Functions

```
ease-smooth : cubic-bezier(0.4, 0, 0.2, 1)
ease-bounce : cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### Animations

```
animate-fade-in        : Fade in effect
animate-fade-out       : Fade out effect
animate-slide-in-right : Slide from right
animate-slide-in-left  : Slide from left
animate-slide-up       : Slide from bottom
animate-scale-in       : Scale up effect
```

### Transition Examples

```html
<!-- Button Hover -->
<button class="transition-colors duration-200 hover:bg-primary-700">
  <!-- Dropdown -->
  <div class="animate-fade-in duration-200">
    <!-- Card Hover -->
    <div class="transition-all duration-300 hover:shadow-lg"></div>
  </div>
</button>
```

---

## 📱 Responsive Breakpoints

```
xs  : 475px  (Small phones)
sm  : 640px  (Phones)
md  : 768px  (Tablets) ⭐
lg  : 1024px (Desktops) ⭐
xl  : 1280px (Large desktops)
2xl : 1536px (Extra large)
```

### Responsive Examples

```html
<!-- Mobile First -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- Hide on Mobile -->
  <div class="hidden lg:block">
    <!-- Text Size -->
    <h1 class="text-2xl lg:text-4xl"></h1>
  </div>
</div>
```

---

## 📦 Container Max Widths

```
max-w-sm   : 384px  (Small content)
max-w-md   : 448px  (Forms)
max-w-lg   : 512px  (Cards)
max-w-xl   : 576px  (Articles)
max-w-2xl  : 672px  (Long form)
max-w-3xl  : 768px  (Content)
max-w-4xl  : 896px  (Wide content)
max-w-5xl  : 1024px (Containers) ⭐
max-w-7xl  : 1280px (Page width) ⭐
```

---

## 🔢 Z-Index Scale

```
z-0   : Base level
z-10  : Above base
z-20  : Elements
z-30  : Elevated
z-40  : Higher
z-50  : Sticky elements ⭐
z-60  : Dropdowns ⭐
z-70  : Modals ⭐
z-80  : Notifications
z-90  : Tooltips
z-100 : Highest priority
```

---

## 🎯 Common Patterns

### Button Styles

```html
<!-- Primary Button -->
<button
  class="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg 
               hover:bg-primary-700 transition-colors duration-200 
               focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
>
  <!-- Secondary Button -->
  <button
    class="px-6 py-3 bg-white text-neutral-700 font-semibold rounded-lg 
               border border-neutral-300 hover:bg-neutral-50 
               transition-colors duration-200"
  >
    <!-- Danger Button -->
    <button
      class="px-6 py-3 bg-danger-600 text-white font-semibold rounded-lg 
               hover:bg-danger-700 transition-colors duration-200"
    ></button>
  </button>
</button>
```

### Card Styles

```html
<!-- Standard Card -->
<div
  class="bg-white rounded-xl shadow-md p-6 
            hover:shadow-card-hover transition-shadow duration-300"
>
  <!-- Featured Card -->
  <div
    class="bg-gradient-to-br from-primary-50 to-secondary-50 
            rounded-xl shadow-lg p-6 border-2 border-primary-200"
  ></div>
</div>
```

### Input Styles

```html
<!-- Text Input -->
<input
  class="w-full px-4 py-3 bg-white border border-neutral-300 
              rounded-md text-neutral-900 placeholder-neutral-400
              focus:outline-none focus:ring-2 focus:ring-primary-500 
              focus:border-transparent transition-colors duration-200"
/>
```

### Badge Styles

```html
<!-- Primary Badge -->
<span
  class="px-3 py-1 bg-primary-100 text-primary-700 
             text-xs font-semibold rounded-full"
>
  <!-- Success Badge -->
  <span
    class="px-3 py-1 bg-success-100 text-success-700 
             text-xs font-semibold rounded-full"
  >
    <!-- Warning Badge -->
    <span
      class="px-3 py-1 bg-warning-100 text-warning-700 
             text-xs font-semibold rounded-full"
    ></span></span
></span>
```

---

## 📚 Resources

- **Tailwind CSS Documentation:** https://tailwindcss.com/docs
- **Color Palette Tool:** https://uicolors.app
- **Inter Font:** https://rsms.me/inter/

---

## 🔄 Updates

- **v1.0.0** (2025-10-15): Initial design system extracted from components
  - Color palette from Turkish banking patterns
  - Typography scale from ProductCard, Navigation
  - Spacing system from FilterSidebar, CalculatorWidget
  - Shadow system from all components
  - Animation patterns standardized

---

**Note:** All design tokens are centralized in `tailwind.config.js` for easy maintenance and consistency across the application.
