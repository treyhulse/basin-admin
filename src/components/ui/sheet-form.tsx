"use client"

import * as React from "react"
import { useForm, type FieldValues, type UseFormReturn, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Save, Edit, Trash2 } from "lucide-react"


import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"

// Generic types for the sheet form
export type SheetFormMode = "create" | "edit" | "view" | "delete"

export interface SheetFormProps<T extends FieldValues> {
  // Core props
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: SheetFormMode
  title: string
  description?: string
  
  // Form configuration
  schema?: z.ZodSchema<T>
  defaultValues?: Partial<T>
  onSubmit?: SubmitHandler<T>
  onDelete?: () => void | Promise<void>
  
  // Customization
  fields?: React.ReactNode
  actions?: React.ReactNode
  children?: React.ReactNode
  
  // Styling
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  
  // State
  loading?: boolean
  disabled?: boolean
  
  // Validation
  showValidation?: boolean
}


// Mode configurations
const modeConfig = {
  create: {
    icon: undefined,
    submitText: "Create",
    submitVariant: "default" as const
  },
  edit: {
    icon: Edit,
    submitText: "Save Changes",
    submitVariant: "secondary" as const
  },
  view: {
    icon: undefined,
    submitText: "Close",
    submitVariant: "secondary" as const
  },
  delete: {
    icon: Trash2,
    submitText: "Delete",
    submitVariant: "destructive" as const
  }
}

export function SheetForm<T extends FieldValues>({
  open,
  onOpenChange,
  mode,
  title,
  description,
  schema,
  defaultValues = {},
  onSubmit,
  onDelete,
  fields,
  actions,
  children,
  className,
  size = "lg",
  loading = false,
  disabled = false,
  showValidation = true
}: SheetFormProps<T>) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  // Initialize form with react-hook-form
  const form = useForm<T>({
    resolver: schema ? zodResolver(schema as any) : undefined,
    defaultValues: defaultValues as any,
    mode: showValidation ? "onChange" : "onSubmit"
  })

  // Handle form submission
  const handleSubmit = async (data: T) => {
    if (!onSubmit) return
    
    try {
      setIsSubmitting(true)
      await onSubmit(data)
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete action
  const handleDelete = async () => {
    if (!onDelete) return
    
    try {
      setIsSubmitting(true)
      await onDelete()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Delete error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }



  // Get mode configuration
  const config = modeConfig[mode]
  const ModeIcon = config.icon

  // Determine if form should be disabled
  const isFormDisabled = disabled || loading || isSubmitting || mode === "view"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right"
        className={`rounded-xl ${className || ''}`}
      >
        {/* Header */}
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center gap-3">
            {ModeIcon && (
              <ModeIcon className="h-5 w-5" />
            )}
            <div>
              <SheetTitle className="text-lg font-semibold">
                {title}
              </SheetTitle>
              {description && (
                <SheetDescription className="text-sm text-muted-foreground mt-1">
                  {description}
                </SheetDescription>
              )}
            </div>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {mode === "delete" ? (
            // Delete confirmation view
            <div className="space-y-4">
              <div className="text-center">
                <Trash2 className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Confirm Deletion
                </h3>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete this item? This action cannot be undone.
                </p>
              </div>
            </div>
          ) : (
            // Form view
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-6">
                {fields}
                {children}
              </form>
            </Form>
          )}
        </div>

        {/* Footer */}
        <SheetFooter className="border-t pt-4">
          <div className="flex items-center justify-between gap-3 w-full">
            {/* Custom actions */}
            {actions}
            
            {/* Default actions */}
            <div className="flex items-center gap-2 ml-auto">
              {mode === "delete" ? (
                <Button
                  type="button"
                  variant={config.submitVariant}
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="min-w-[100px]"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  {config.submitText}
                </Button>
              ) : mode !== "view" ? (
                <Button
                  type="submit"
                  variant={config.submitVariant}
                  disabled={isFormDisabled}
                  className="min-w-[100px]"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {config.submitText}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant={config.submitVariant}
                  onClick={() => onOpenChange(false)}
                  className="min-w-[100px]"
                >
                  {config.submitText}
                </Button>
              )}
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// Helper component for form fields
export function SheetFormField<T extends FieldValues>({
  name,
  label,
  description,
  children,
  className,
  ...props
}: {
  name: keyof T
  label: string
  description?: string
  children: React.ReactNode
  className?: string
} & Omit<React.ComponentProps<typeof FormItem>, "children">) {
  return (
    <FormField
      name={name as any}
      render={({ field, fieldState }) => (
        <FormItem className={`space-y-2 ${className || ''}`} {...props}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {React.cloneElement(children as React.ReactElement, { ...field })}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Export the form instance type for external use
export type SheetFormInstance<T extends FieldValues> = UseFormReturn<T>
