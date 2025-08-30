# DrawerForm Component

A dynamic, reusable drawer form component that combines form functionality with a right-side drawer layout for CRUD operations on any database model.

## Features

- **Full CRUD Support**: Create, Read, Update, Delete operations
- **Flexible Schema**: Works with any Zod schema for validation
- **Consistent Styling**: Right-side drawer with rounded corners and proper margins
- **Type Safety**: Full TypeScript support with generic types
- **Form Validation**: Built-in validation with react-hook-form and Zod
- **Responsive Design**: Multiple size options for different use cases
- **Loading States**: Built-in loading and submission states
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Installation

The component is built on top of existing UI components and requires:

```bash
npm install react-hook-form @hookform/resolvers zod
```

## Basic Usage

```tsx
import { DrawerForm, DrawerFormField } from "@/components/ui/drawer-form"
import { z } from "zod"

// Define your schema
const UserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "user", "moderator"])
})

type User = z.infer<typeof UserSchema>

// Use in your component
function UserManagement() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  
  const handleSubmit = async (data: User) => {
    // Handle form submission
    console.log(data)
  }
  
  return (
    <DrawerForm<User>
      open={drawerOpen}
      onOpenChange={setDrawerOpen}
      mode="create"
      title="Create New User"
      description="Add a new user to the system"
      schema={UserSchema}
      onSubmit={handleSubmit}
    >
      <DrawerFormField name="name" label="Full Name">
        <Input placeholder="John Doe" />
      </DrawerFormField>
      
      <DrawerFormField name="email" label="Email Address">
        <Input type="email" placeholder="john@example.com" />
      </DrawerFormField>
      
      <DrawerFormField name="role" label="Role">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="moderator">Moderator</SelectItem>
          </SelectContent>
        </Select>
      </DrawerFormField>
    </DrawerForm>
  )
}
```

## Props

### Core Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `open` | `boolean` | Yes | Controls drawer visibility |
| `onOpenChange` | `(open: boolean) => void` | Yes | Callback when drawer state changes |
| `mode` | `DrawerFormMode` | Yes | Form operation mode |
| `title` | `string` | Yes | Drawer header title |
| `description` | `string` | No | Optional description below title |

### Form Configuration

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `schema` | `z.ZodSchema<T>` | No | Zod schema for validation |
| `defaultValues` | `Partial<T>` | No | Initial form values |
| `onSubmit` | `SubmitHandler<T>` | No | Form submission handler |
| `onDelete` | `() => void \| Promise<void>` | No | Delete operation handler |

### Customization

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `fields` | `React.ReactNode` | No | Form fields content |
| `actions` | `React.ReactNode` | No | Custom action buttons |
| `children` | `React.ReactNode` | No | Additional content |
| `className` | `string` | No | Additional CSS classes |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | No | Drawer width (default: "lg") |

### State & Validation

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `loading` | `boolean` | No | External loading state |
| `disabled` | `boolean` | No | Disable form interactions |
| `showValidation` | `boolean` | No | Show validation errors (default: true) |

## Modes

The component supports four operation modes:

### Create Mode
- **Icon**: Plus icon
- **Color**: Green
- **Submit Text**: "Create"
- **Behavior**: Form submission creates new record

### Edit Mode
- **Icon**: Edit icon
- **Color**: Blue
- **Submit Text**: "Save Changes"
- **Behavior**: Form submission updates existing record

### View Mode
- **Icon**: None
- **Color**: Gray
- **Submit Text**: "Close"
- **Behavior**: Form is read-only, no submission

### Delete Mode
- **Icon**: Trash icon
- **Color**: Red
- **Submit Text**: "Delete"
- **Behavior**: Shows confirmation dialog, no form fields

## Sizes

| Size | Width | Use Case |
|------|-------|----------|
| `sm` | `320px` | Simple forms with few fields |
| `md` | `384px` | Standard forms |
| `lg` | `500px` | Complex forms (default) |
| `xl` | `600px` | Very complex forms |

## Helper Components

### DrawerFormField

A helper component that wraps form fields with proper labeling and validation:

```tsx
<DrawerFormField 
  name="email" 
  label="Email Address" 
  description="Enter a valid email address"
>
  <Input type="email" placeholder="john@example.com" />
</DrawerFormField>
```

Props:
- `name`: Field name (must match schema)
- `label`: Field label
- `description`: Optional help text
- `className`: Additional CSS classes
- All FormItem props

## Advanced Usage

### Custom Actions

Add custom action buttons in the footer:

```tsx
<DrawerForm
  // ... other props
  actions={
    <Button variant="outline" onClick={handleCustomAction}>
      Custom Action
    </Button>
  }
>
  {/* form fields */}
</DrawerForm>
```

### Conditional Fields

Show/hide fields based on form state:

```tsx
<DrawerForm>
  <DrawerFormField name="name" label="Name">
    <Input />
  </DrawerFormField>
  
  {watch("name") && (
    <DrawerFormField name="email" label="Email">
      <Input type="email" />
    </DrawerFormField>
  )}
</DrawerForm>
```

### Form State Access

Access form state for advanced logic:

```tsx
const form = useForm<User>()
const { watch, setValue, formState } = form

// Watch specific fields
const name = watch("name")

// Set field values programmatically
setValue("email", "default@example.com")

// Access form state
const { errors, isSubmitting } = formState
```

## Styling

The component uses Tailwind CSS and follows the design system:

- **Position**: Right side of screen
- **Margins**: Consistent top, bottom, and right margins
- **Corners**: Rounded corners for modern appearance
- **Borders**: Subtle borders for visual separation
- **Colors**: Semantic colors based on operation mode
- **Spacing**: Consistent padding and margins throughout

## Accessibility

- Proper ARIA labels and descriptions
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Semantic HTML structure

## Error Handling

The component includes built-in error handling:

- Form validation errors display below fields
- Submission errors are logged to console
- Loading states prevent multiple submissions
- Graceful error recovery

## Performance

- Form state is managed efficiently with react-hook-form
- Minimal re-renders with proper memoization
- Lazy loading of form validation
- Optimized for large forms

## Examples

See `drawer-form-example.tsx` for comprehensive examples including:

- User management
- Product catalog
- Order processing
- Different form layouts
- Various field types
- CRUD operations

## Best Practices

1. **Use Zod schemas** for type safety and validation
2. **Provide meaningful descriptions** for better UX
3. **Handle loading states** appropriately
4. **Use appropriate sizes** for your form complexity
5. **Implement proper error handling** in submit/delete handlers
6. **Keep forms focused** on single operations
7. **Use consistent field layouts** across your application

## Troubleshooting

### Form not submitting
- Check that `onSubmit` prop is provided
- Verify schema validation passes
- Ensure required fields are filled

### Validation not working
- Confirm Zod schema is provided
- Check field names match schema
- Verify `showValidation` is true

### Styling issues
- Check Tailwind CSS is properly configured
- Verify component imports are correct
- Ensure no conflicting CSS classes

### Type errors
- Confirm generic type parameter matches schema
- Check field names are valid keys
- Verify all required props are provided
