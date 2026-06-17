import { cn } from "@/lib/utils"
import { type, typeDark } from "@/lib/typography"
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react"

const fieldBase = "w-full font-sans transition-colors duration-200 focus:outline-none"

const lightField =
  "rounded-lg border border-neutral-200 bg-white px-3 py-2 text-body text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"

const darkField =
  "rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-secondary text-[#fdf8f0] placeholder:text-[#fdf8f0]/30 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  tone?: "light" | "dark"
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, tone = "light", ...props }, ref) => {
    const fieldClass = tone === "light" ? lightField : darkField
    const labelClass = tone === "light" ? type.label : typeDark.label

    return (
      <div className="flex w-full flex-col gap-1">
        {label && (
          <label htmlFor={id} className={labelClass}>
            {label}
          </label>
        )}
        <input ref={ref} id={id} className={cn(fieldBase, fieldClass, className)} {...props} />
      </div>
    )
  }
)
Input.displayName = "Input"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  tone?: "light" | "dark"
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, id, tone = "light", ...props }, ref) => {
    const fieldClass = tone === "light" ? `${lightField} resize-y` : `${darkField} resize-y`
    const labelClass = tone === "light" ? type.label : typeDark.label

    return (
      <div className="flex w-full flex-col gap-1">
        {label && (
          <label htmlFor={id} className={labelClass}>
            {label}
          </label>
        )}
        <textarea ref={ref} id={id} className={cn(fieldBase, fieldClass, className)} {...props} />
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  children: React.ReactNode
  tone?: "light" | "dark"
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, id, children, tone = "light", ...props }, ref) => {
    const fieldClass =
      tone === "light"
        ? `${lightField} cursor-pointer appearance-none`
        : `${darkField} cursor-pointer appearance-none`
    const labelClass = tone === "light" ? type.label : typeDark.label
    const chevron = tone === "light" ? "%23374151" : "%23c9a84c"

    return (
      <div className="flex w-full flex-col gap-1">
        {label && (
          <label htmlFor={id} className={labelClass}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(fieldBase, fieldClass, "bg-[right_12px_center] bg-no-repeat", className)}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='${chevron}' fill='none' stroke-width='2'/%3E%3C/svg%3E")`,
          }}
          {...props}
        >
          {children}
        </select>
      </div>
    )
  }
)
Select.displayName = "Select"

export { Input, Textarea, Select }
