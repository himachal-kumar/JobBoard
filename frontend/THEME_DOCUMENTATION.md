# Theme System Documentation

## Overview

This project features a comprehensive, modern theme system built with Material-UI (MUI) that provides both light and dark themes with enhanced styling, animations, and accessibility features.

## Features

### 🎨 **Dual Theme Support**
- **Light Theme**: Clean, professional design with modern blue and purple color scheme
- **Dark Theme**: Sophisticated dark mode with optimized contrast and readability
- **Automatic System Preference Detection**: Respects user's system theme preference
- **Persistent Theme Selection**: Remembers user's choice across sessions

### 🚀 **Enhanced Components**
- **Modern Color Palette**: Professional color scheme with proper contrast ratios
- **Enhanced Typography**: Optimized font weights, sizes, and line heights
- **Improved Shadows**: Subtle, layered shadow system for depth
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Responsive Design**: Mobile-first approach with breakpoint optimization

### ♿ **Accessibility Features**
- **High Contrast Support**: Enhanced contrast for better readability
- **Focus Indicators**: Clear focus states for keyboard navigation
- **Reduced Motion Support**: Respects user's motion preferences
- **Screen Reader Friendly**: Proper ARIA labels and semantic markup

## Theme Structure

### Color Palette

#### Primary Colors
- **Primary**: Modern blue (#2563eb) - Main brand color
- **Secondary**: Modern purple (#7c3aed) - Accent color
- **Success**: Green (#059669) - Success states
- **Warning**: Orange (#d97706) - Warning states
- **Error**: Red (#dc2626) - Error states
- **Info**: Blue (#0891b2) - Information states

#### Background Colors
- **Light Theme**: Light gray (#f8fafc) with white paper (#ffffff)
- **Dark Theme**: Dark blue (#0f172a) with dark gray paper (#1e293b)

#### Text Colors
- **Light Theme**: Dark text (#0f172a) with secondary gray (#475569)
- **Dark Theme**: Light text (#f8fafc) with secondary gray (#cbd5e1)

### Typography

The theme uses the **Inter** font family with optimized:
- **Heading Hierarchy**: H1-H6 with proper sizing and weights
- **Body Text**: Optimized line heights and readability
- **Button Text**: Consistent sizing and weight
- **Caption & Overline**: Specialized text styles

### Component Styling

#### Cards
- Rounded corners (16px border radius)
- Subtle shadows with hover effects
- Smooth transitions and animations

#### Buttons
- Gradient backgrounds for primary buttons
- Hover effects with elevation changes
- Consistent sizing and spacing

#### Form Controls
- Enhanced focus states
- Improved border styling
- Better contrast and readability

## Usage

### Basic Theme Usage

```tsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { themeMode, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {themeMode}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### Theme Toggle Component

```tsx
import ThemeToggle from './components/common/ThemeToggle';

// Basic usage
<ThemeToggle />

// With custom size
<ThemeToggle size="small" />

// Without tooltip
<ThemeToggle showTooltip={false} />
```

### Custom CSS Classes

The theme includes several utility CSS classes:

#### Animation Classes
- `.fade-in` - Fade in animation
- `.slide-in-left` - Slide in from left
- `.slide-in-right` - Slide in from right
- `.scale-in` - Scale in animation
- `.bounce` - Bounce effect

#### Effect Classes
- `.gradient-text` - Gradient text effect
- `.glass-effect` - Glass morphism effect
- `.shimmer` - Loading shimmer effect
- `.card-hover` - Enhanced card hover effects

## Implementation Details

### Theme Context

The theme system uses React Context for state management:

```tsx
interface ThemeContextType {
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark') => void;
}
```

### Theme Provider

The `ThemeProvider` component:
- Manages theme state
- Detects system preferences
- Persists user choices
- Provides theme context

### Automatic Theme Detection

The system automatically:
1. Checks localStorage for saved preference
2. Falls back to system preference
3. Updates when system preference changes
4. Saves user selections

## Customization

### Adding New Colors

```tsx
// In themes.ts
const lightTheme = createTheme({
  palette: {
    custom: {
      main: '#your-color',
      light: '#your-light-color',
      dark: '#your-dark-color',
    },
  },
});
```

### Custom Component Styling

```tsx
// In themes.ts
components: {
  MuiCustomComponent: {
    styleOverrides: {
      root: {
        // Your custom styles
      },
    },
  },
},
```

### Adding New Animations

```css
/* In index.css */
@keyframes yourAnimation {
  0% { /* start state */ }
  100% { /* end state */ }
}

.your-animation {
  animation: yourAnimation 0.5s ease-out;
}
```

## Best Practices

### Theme Consistency
- Use theme colors from the palette
- Maintain consistent spacing and sizing
- Follow the established component patterns

### Performance
- Minimize theme changes during animations
- Use CSS transitions for smooth effects
- Optimize for reduced motion preferences

### Accessibility
- Ensure sufficient color contrast
- Provide clear focus indicators
- Support keyboard navigation

## Browser Support

- **Modern Browsers**: Full support for all features
- **Legacy Browsers**: Graceful degradation
- **Mobile Browsers**: Optimized for touch interactions

## File Structure

```
frontend/
├── src/
│   ├── contexts/
│   │   └── ThemeContext.tsx          # Theme context and provider
│   ├── components/
│   │   └── common/
│   │       ├── ThemeToggle.tsx       # Theme toggle component
│   │       └── ThemeShowcase.tsx     # Theme demonstration
│   ├── themes.ts                     # Theme definitions
│   └── index.css                     # Global styles and animations
└── THEME_DOCUMENTATION.md            # This documentation
```

## Troubleshooting

### Common Issues

1. **Theme not persisting**: Check localStorage permissions
2. **System preference not detected**: Ensure media query support
3. **Animation performance**: Check for reduced motion settings
4. **Color contrast issues**: Verify theme color definitions

### Debug Mode

Enable debug logging by adding to your component:

```tsx
const { themeMode } = useTheme();
console.log('Current theme:', themeMode);
```

## Future Enhancements

- [ ] Additional theme variants (high contrast, sepia)
- [ ] Custom color scheme builder
- [ ] Animation library expansion
- [ ] Theme export/import functionality
- [ ] Advanced accessibility features

## Contributing

When contributing to the theme system:

1. Follow the established color palette
2. Maintain accessibility standards
3. Test both light and dark themes
4. Ensure responsive behavior
5. Document new features

## Support

For theme-related issues or questions:
1. Check this documentation
2. Review the theme showcase component
3. Test with different user preferences
4. Verify browser compatibility
