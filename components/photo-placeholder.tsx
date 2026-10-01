import { cn } from '@/lib/utils'

type PhotoPlaceholderProps = {
  label: string
  src?: string
  alt?: string
  credit?: string
  className?: string
}

/**
 * Sin `src`: muestra el marco punteado original (para cuando falte una foto).
 * Con `src`: muestra la imagen en tratamiento duotono (escala de grises por
 * defecto, revela color al hover/focus) con un crédito discreto — son fotos
 * de referencia de un banco libre, pensadas para sustituir por fotografía
 * real del roster antes de publicar.
 */
export function PhotoPlaceholder({ label, src, alt, credit, className }: PhotoPlaceholderProps) {
  if (!src) {
    return (
      <div role="img" aria-label={label} className={cn('placeholder-frame flex items-end p-4', className)}>
        <span className="bg-background px-2 py-1 text-sm text-muted-foreground">{label}</span>
      </div>
    )
  }

  return (
    <div className={cn('group relative overflow-hidden bg-secondary', className)}>
      <img
        src={src || '/placeholder.svg'}
        alt={alt ?? label}
        loading="lazy"
        className="h-full w-full object-cover grayscale contrast-110 transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0 group-focus-within:grayscale-0"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
      {credit && (
        <span className="absolute bottom-2 left-2 bg-background/70 px-1.5 py-0.5 text-[11px] leading-none text-muted-foreground">
          {credit}
        </span>
      )}
    </div>
  )
}
