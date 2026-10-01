import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn('size-7 text-primary', className)}
    >
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M9 7.5 L15 14 L13 16.5 L18.5 20 L17 22 L23.5 26"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  )
}
