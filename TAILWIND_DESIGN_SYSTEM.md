# Tailwind CSS Design System

## 🎨 Color Palette

### Primary Colors
- **Primary**: `bg-primary` (#6366F1) - Glavni brand color
- **Primary Light**: `bg-primary-light` (#A5B4FC) - Svetlija varijanta
- **Primary Dark**: `bg-primary-dark` (#4F46E5) - Tamnija varijanta

### Accent Colors
- **Accent**: `bg-accent` (#A5B4FC)
- **Accent Light**: `bg-accent-light` (#C7D2FE)

### Status Colors
- **Success**: `bg-success` (#10D490)
- **Error**: `bg-error` (#EA5858)
- **Error Light**: `bg-error-light` (#FF9898)

### Dark Theme
- **Dark 100**: `bg-dark-100` (#E4E8EB) - Najsvetlija
- **Dark 200**: `bg-dark-200` (#747A83)
- **Dark 300**: `bg-dark-300` (#3E4350)
- **Dark 400**: `bg-dark-400` (#282C37)
- **Dark 500**: `bg-dark-500` (#1A1D24) - Najtamnija

## 📝 Typography

### Font Family
- **Sans**: `font-sans` - Inter, system-ui
- **Heading**: `font-heading` - Inter

### Font Sizes
- `text-xs` - 0.75rem (12px)
- `text-sm` - 0.875rem (14px)
- `text-base` - 1rem (16px)
- `text-lg` - 1.125rem (18px)
- `text-xl` - 1.25rem (20px)
- `text-2xl` - 1.5rem (24px)
- `text-3xl` - 1.875rem (30px)
- `text-4xl` - 2.25rem (36px)

## 🔘 Component Classes

### Buttons

```html
<!-- Primary button -->
<button class="btn btn-primary">Primary Button</button>

<!-- Secondary button -->
<button class="btn btn-secondary">Secondary Button</button>

<!-- Danger button -->
<button class="btn btn-danger">Delete</button>
```

### Cards

```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>
```

### Inputs

```html
<input type="text" class="input" placeholder="Enter text...">
```

## 💡 Usage Examples

### Kanban Card
```html
<div class="card border-l-4 border-primary">
  <h4 class="text-lg font-semibold text-gray-900">Task Title</h4>
  <p class="text-sm text-gray-600 mt-2">Task description</p>
  <div class="flex items-center justify-between mt-4">
    <span class="text-xs text-gray-500">High Priority</span>
    <button class="btn btn-danger">Delete</button>
  </div>
</div>
```

### Kanban Column
```html
<div class="bg-gray-100 rounded-lg p-4">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-xl font-semibold text-gray-800">To Do</h3>
    <span class="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">5</span>
  </div>
  <!-- Cards here -->
</div>
```

### Board Header
```html
<header class="bg-white shadow-md p-6">
  <h1 class="text-3xl font-bold text-gray-900">Project Board</h1>
</header>
```

## 🌙 Dark Mode

Dodaj `dark` class na root element:

```html
<html class="dark">
```

Koristi dark mode varijante:
```html
<div class="bg-white dark:bg-dark-400 text-gray-900 dark:text-gray-100">
  Content
</div>
```

## 🎯 Utility Classes

### Spacing
- Padding: `p-4`, `px-4`, `py-2`, `pt-4`, `pb-4`, `pl-4`, `pr-4`
- Margin: `m-4`, `mx-4`, `my-2`, `mt-4`, `mb-4`, `ml-4`, `mr-4`

### Border Radius
- `rounded-sm` - 0.25rem
- `rounded` - 0.375rem
- `rounded-md` - 0.5rem
- `rounded-lg` - 0.75rem
- `rounded-xl` - 1rem

### Shadows
- `shadow-sm` - Mala senka
- `shadow` - Default senka
- `shadow-md` - Srednja senka
- `shadow-lg` - Velika senka
- `shadow-xl` - Extra velika senka

### Transitions
```html
<button class="transition-all duration-200 hover:scale-105">
  Hover me
</button>
```

## 📦 Component Examples with Tailwind

### Primer: Button Primary (L)
```html
<button class="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
  Button Primary (L)
</button>
```

### Primer: Button Destructive
```html
<button class="bg-error hover:bg-error-dark text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2">
  Button Destructive
</button>
```

### Primer: Text Field Error
```html
<div>
  <input type="text" class="w-full px-4 py-2 border-2 border-error rounded-lg focus:outline-none focus:ring-2 focus:ring-error" placeholder="Text field label">
  <p class="text-error text-sm mt-1">Error! Emergency!</p>
</div>
```

### Primer: Dropdown (select)
```html
<select class="input">
  <option>Doing</option>
  <option>Todo</option>
  <option>Done</option>
</select>
```

## 🚀 Kako Koristiti

1. Svi stilovi su automatski dostupni u obe aplikacije
2. Koristi Tailwind utility classes direktno u template-ima
3. Konfigurisane boje iz dizajn sistema
4. Pre-definisane component classes (`.btn`, `.card`, `.input`)

## 📝 Napomena

Tailwind CSS je konfigurisan da skenira:
- `apps/kanban-signal/src/**/*.{html,ts}`
- `apps/kanban-ngxs/src/**/*.{html,ts}`
- `libs/shared/src/**/*.{html,ts}`

Sve promene u bilo kom od ovih foldera će automatski biti obrađene.
