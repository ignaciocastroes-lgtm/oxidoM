import { PhotoPlaceholder } from '@/components/photo-placeholder'

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="mx-auto max-w-7xl px-5 pb-12 pt-12 md:px-8 md:pb-20 md:pt-20">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col justify-end gap-8 lg:col-span-8">
          <h1 id="hero-title" className="font-display text-[clamp(4rem,19vw,10.5rem)]">
            ÓXIDO
          </h1>
          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {'Bogotá — fundado en 2027 — rap · trap · afro · hip-hop y lo que salga de mezclar los cuatro.'}
          </p>
          <a
            href="#lanzamiento"
            className="w-fit font-medium text-primary underline decoration-1 underline-offset-[6px] transition-colors hover:text-foreground"
          >
            Escuchar el último lanzamiento
          </a>
        </div>
        <PhotoPlaceholder
          label="foto de artista — reemplazar"
          src="https://picsum.photos/seed/oxido-hero/900/1125"
          alt="Foto de referencia de artista del roster"
          credit="Foto de referencia — sustituir"
          className="aspect-[4/5] w-full lg:col-span-4"
        />
      </div>
    </section>
  )
}
