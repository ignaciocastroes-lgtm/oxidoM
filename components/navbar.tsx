import { Menu } from 'lucide-react'
import { LogoMark } from '@/components/logo-mark'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { navLinks } from '@/lib/data'

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8"
      >
        <a href="#top" className="flex items-center gap-3" aria-label="ÓXIDO, ir al inicio">
          <LogoMark />
          <span className="font-display text-2xl">ÓXIDO</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <Sheet>
          <SheetTrigger
            className="flex size-10 items-center justify-center text-foreground md:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="size-6" aria-hidden="true" />
          </SheetTrigger>
          <SheetContent side="right" className="w-full border-border bg-background px-6 pt-20">
            <SheetTitle className="sr-only">Menú</SheetTitle>
            <ul className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <SheetClose
                    render={<a href={link.href} />}
                    className="font-display text-5xl text-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </SheetClose>
                </li>
              ))}
            </ul>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
