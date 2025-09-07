# Dark Form Styling Guide

This guide explains how to use the new dark form styling system that matches the beautiful design from your uploaded image.

## 🎨 Design System

### Color Palette
- **Background**: Deep slate gradients (`from-slate-900 via-slate-800 to-slate-900`)
- **Form Container**: `form-bg` (#1e293b - slate-800)
- **Input Fields**: `form-input` (#475569 - slate-600)
- **Text**: `form-text` (#f1f5f9 - slate-100)
- **Borders**: `form-border` (#64748b - slate-500)
- **Accent**: Cyan/Teal for focus states and primary actions

### Key Features
- **Glassmorphism Effects**: Backdrop blur and translucent surfaces
- **Rounded Corners**: 12px for inputs, 16px for containers
- **Smooth Transitions**: 200ms duration for all interactions
- **Focus States**: Cyan glow with shadow effects
- **Background Pattern**: Subtle dot pattern for texture

## 🛠️ Quick Start

### 1. Basic Dark Form

```tsx
import { FormWrapper, UniversalInput, UniversalButton } from '@/components/ui/FormElements';

function MyForm() {
  return (
    <FormWrapper dark fullScreen>
      <form className="space-y-6">
        <UniversalInput
          dark
          label="Email"
          placeholder="Enter your email"
          icon={<Mail className="w-5 h-5" />}
        />
        
        <UniversalButton dark type="submit">
          Submit
        </UniversalButton>
      </form>
    </FormWrapper>
  );
}
```

### 2. SSH Team Setup Form (Matching Uploaded Image)

```tsx
import { RadioGroup } from '@/components/ui/FormElements';

function SSHTeamForm() {
  const [teamSize, setTeamSize] = useState('just-me');
  
  const options = [
    { value: 'just-me', label: 'Just me' },
    { value: '2-4', label: '2-4' },
    { value: '5+', label: '5+' }
  ];

  return (
    <FormWrapper dark>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-form-text mb-2">
          How many team members use SSH?
        </h2>
        <p className="text-form-text-muted text-sm">
          This helps customize your vault structure for your team to manage connections and credentials.
        </p>
      </div>

      <RadioGroup
        name="team-size"
        options={options}
        value={teamSize}
        onChange={setTeamSize}
        dark
      />

      <UniversalButton dark type="submit" className="w-full mt-8">
        Next
      </UniversalButton>
    </FormWrapper>
  );
}
```

## 📚 Component Reference

### FormWrapper
Main container for dark forms with background and pattern.

```tsx
<FormWrapper 
  dark={true}           // Enable dark mode
  fullScreen={true}     // Full screen height
  pattern={true}        // Show background pattern
  className="max-w-lg"  // Custom classes
>
  {children}
</FormWrapper>
```

### UniversalInput
Adaptive input component that works in both light and dark modes.

```tsx
<UniversalInput
  dark={true}                    // Dark mode styling
  label="Username"               // Field label
  placeholder="Enter username"   // Placeholder text
  icon={<User className="w-5 h-5" />} // Left icon
  error="This field is required" // Error message
  helperText="Choose wisely"     // Helper text
  value={value}
  onChange={handleChange}
/>
```

### UniversalButton
Button component with dark mode variants.

```tsx
<UniversalButton
  dark={true}              // Dark mode styling
  variant="primary"        // primary | secondary | outline
  size="md"               // sm | md | lg
  loading={isLoading}     // Show loading spinner
  className="w-full"      // Custom classes
>
  Submit
</UniversalButton>
```

### RadioGroup
Multiple choice component matching the uploaded image style.

```tsx
<RadioGroup
  name="choice"
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ]}
  value={selectedValue}
  onChange={handleChange}
  dark={true}
/>
```

### UniversalTextarea
Multi-line text input with dark styling.

```tsx
<UniversalTextarea
  dark={true}
  label="Description"
  placeholder="Enter description..."
  rows={4}
  value={value}
  onChange={handleChange}
/>
```

### UniversalSelect
Dropdown select with custom arrow and dark styling.

```tsx
<UniversalSelect
  dark={true}
  label="Country"
  value={selectedCountry}
  onChange={handleChange}
>
  <option value="">Select country</option>
  <option value="us">United States</option>
  <option value="uk">United Kingdom</option>
</UniversalSelect>
```

### UniversalCheckbox
Checkbox with dark styling and custom labels.

```tsx
<UniversalCheckbox
  dark={true}
  id="terms"
  label={
    <span>
      I agree to the{' '}
      <a href="#" className="text-cyan-400 hover:text-cyan-300">
        Terms of Service
      </a>
    </span>
  }
  checked={agreed}
  onChange={handleCheck}
/>
```

## 🎯 CSS Classes Reference

### Form Containers
- `.form-container-dark` - Main form container with dark background
- `.form-surface-dark` - Secondary surface for grouped content
- `.form-bg-pattern` - Background dot pattern

### Input Elements
- `.input-dark` - Dark input field styling
- `.textarea-dark` - Dark textarea styling  
- `.select-dark` - Dark select dropdown styling
- `.checkbox-dark` - Dark checkbox styling
- `.radio-dark` - Dark radio button styling

### Buttons
- `.btn-dark` - Dark button base styling
- `.btn-dark-primary` - Primary dark button with gradient

### Text and Labels
- `.label-dark` - Dark form labels
- `.form-error` - Error message styling
- `.text-form-text` - Primary text color
- `.text-form-text-muted` - Muted text color
- `.text-form-text-placeholder` - Placeholder text color

### States
- `.input-error` - Error state for inputs
- Focus states automatically applied with cyan glow

## 🔧 Customization

### Custom Colors
You can customize the color palette in `tailwind.config.js`:

```javascript
colors: {
  'form-bg': {
    DEFAULT: '#1e293b', // Your custom dark background
    dark: '#0f172a',
  },
  'form-input': {
    DEFAULT: '#475569', // Your custom input background
    focus: '#64748b',
  },
  // ... more custom colors
}
```

### Custom Patterns
Create your own background patterns:

```css
.custom-form-pattern {
  background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0);
  background-size: 24px 24px;
}
```

## 📱 Responsive Design

All form components are fully responsive:
- Mobile: Single column layout, touch-friendly sizing
- Tablet: Adaptive grid layouts
- Desktop: Multi-column forms where appropriate

## ♿ Accessibility

The dark form system includes:
- Proper ARIA labels and descriptions
- Keyboard navigation support
- High contrast ratios for readability
- Focus indicators for all interactive elements
- Screen reader friendly markup

## 🚀 Examples

Visit `/examples/dark-forms` to see all components in action with:
- SSH Team Setup Form (matching your uploaded image)
- Complete registration form
- Comparison with light mode forms

## 🎨 Design Principles

1. **Consistency**: All form elements share the same visual language
2. **Accessibility**: High contrast and proper focus states
3. **Responsiveness**: Works beautifully on all screen sizes
4. **Performance**: Lightweight CSS with smooth animations
5. **Flexibility**: Easy to customize and extend

## 💡 Best Practices

1. **Use consistent spacing**: Stick to the predefined spacing scale
2. **Group related fields**: Use FormWrapper and spacing effectively
3. **Provide clear feedback**: Use error states and helper text
4. **Test in different contexts**: Ensure forms work in various layouts
5. **Consider loading states**: Use the loading prop for async operations

---

This styling system ensures all your forms have a consistent, beautiful dark theme that matches your uploaded design while remaining accessible and user-friendly.
