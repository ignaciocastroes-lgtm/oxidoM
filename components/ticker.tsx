type TickerProps = {
  items: string[]
}

function TickerGroup({ items, hidden }: { items: string[]; hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-display text-3xl md:px-10 md:text-5xl">
            {item}
          </span>
          <span className="size-2 shrink-0 rounded-full bg-primary md:size-2.5" aria-hidden="true" />
        </li>
      ))}
    </ul>
  )
}

export function Ticker({ items }: TickerProps) {
  return (
    <div className="overflow-hidden border-y border-border py-5 md:py-6" aria-label="Artistas del sello">
      <div className="flex w-max animate-ticker motion-reduce:animate-none">
        <TickerGroup items={items} />
        <TickerGroup items={items} hidden />
      </div>
    </div>
  )
}
