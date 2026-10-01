import { LogoMark } from '@/components/logo-mark'
import type { SocialLink } from '@/lib/data'

type FooterProps = {
  email: string
  socials: SocialLink[]
}

export function Footer({ email, socials }: FooterProps) {
  return (
    <footer id="contacto" className="overflow-hidden border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 pt-20 md:px-8 md:pt-28">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="flex flex-col gap-4 md:col-span-7">
            <h2 className="font-display text-5xl md:text-7xl">Contacto</h2>
            <a
              href={`mailto:${email}`}
              className="w-fit break-all text-2xl font-medium underline decoration-primary decoration-1 underline-offset-[6px] transition-colors hover:text-primary md:text-3xl"
            >
              {email}
            </a>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              Demos, booking y prensa. Respondemos todo lo que llega con link de escucha.
            </p>
          </div>
          <nav aria-label="Redes sociales" className="md:col-span-5 md:justify-self-end">
            <ul className="flex flex-col gap-3">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg text-foreground transition-colors hover:text-primary"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <LogoMark className="size-5" />
            <span>{`© ${new Date().getFullYear()} ÓXIDO. Bogotá, Colombia.`}</span>
          </div>
          <a href="#top" className="transition-colors hover:text-foreground">
            Volver arriba
          </a>
        </div>
      </div>

      <div aria-hidden="true" className="select-none whitespace-nowrap pt-8 font-display text-[clamp(7rem,28vw,24rem)] leading-[0.8] text-border">
        ÓXIDO ÓXIDO ÓXIDO
      </div>
    </footer>
  )
}
