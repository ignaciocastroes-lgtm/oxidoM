export function About() {
  return (
    <section id="sello" aria-labelledby="about-title" className="border-t border-border">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-20 md:grid-cols-12 md:gap-8 md:px-8 md:py-28">
        <h2 id="about-title" className="font-display text-5xl md:col-span-4 md:text-7xl">
          Sobre el sello
        </h2>
        <div className="flex max-w-[680px] flex-col gap-6 text-lg leading-relaxed md:col-span-8">
          <p>
            ÓXIDO arrancó en 2027 en un cuarto de ensayo en Chapinero, entre cuatro artistas que
            estaban sacando música por su cuenta y perdiendo plata en cada paso: distribuidoras que
            cobraban de más, splits sin papel y portadas hechas a última hora. Juntamos lo que cada
            uno sabía hacer y lo volvimos un sello.
          </p>
          <p className="text-muted-foreground">
            Hoy hacemos cuatro cosas: distribuimos a todas las plataformas, producimos y mezclamos en
            nuestro estudio, dejamos los splits firmados antes de publicar y diseñamos las portadas
            con fotógrafos e ilustradores de la ciudad. El artista conserva sus masters.
          </p>
        </div>
      </div>
    </section>
  )
}
