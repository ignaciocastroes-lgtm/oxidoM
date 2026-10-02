import type { SemaphoreStatus } from '@/lib/supabase/status'

const COLORS: Record<SemaphoreStatus, string> = {
  green: '#22C55E',
  yellow: '#EAB308',
  red: '#EF4444',
}

const LABELS: Record<SemaphoreStatus, string> = {
  green: 'Supabase conectado',
  yellow: 'Supabase con avisos',
  red: 'Supabase desconectado',
}

export function Semaphore({ status, message }: { status: SemaphoreStatus; message: string }) {
  const color = COLORS[status]

  return (
    <div className="group relative flex items-center gap-2">
      <span
        className="size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 0 3px ${color}22` }}
        aria-hidden="true"
      />
      <span className="hidden text-xs text-muted-foreground md:inline">{LABELS[status]}</span>

      <div
        role="tooltip"
        className="pointer-events-none absolute right-0 top-7 z-50 w-72 border border-border bg-background p-3 text-xs leading-relaxed text-muted-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      >
        <span className="mb-1 block font-medium" style={{ color }}>
          {LABELS[status]}
        </span>
        {message}
      </div>
    </div>
  )
}
