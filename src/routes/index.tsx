import { createFileRoute } from "@tanstack/react-router";
import hero from "@/assets/secador.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Serragem Seca e Secador | Logística Caltec" },
      { name: "description", content: "Serragem seca de alta qualidade e secadores industriais para biomassa. Umidade controlada para caldeiras, granjas e indústria." },
      { property: "og:title", content: "Serragem Seca e Secador | Logística Caltec" },
      { property: "og:description", content: "Serragem seca com umidade controlada e secadores industriais de biomassa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const usos = [
  { t: "Caldeiras", d: "Combustível de biomassa com maior poder calorífico e queima estável." },
  { t: "Cama de aviário", d: "Absorção eficiente, menos umidade e mais bem-estar animal." },
  { t: "Pellets e briquetes", d: "Matéria-prima ideal com umidade abaixo de 12%." },
  { t: "Indústria", d: "Absorvente para óleos, limpeza e processos diversos." },
];

const etapas = [
  { n: "01", t: "Recebimento", d: "A serragem úmida chega com 40–55% de umidade." },
  { n: "02", t: "Secagem", d: "O secador rotativo usa ar quente para retirar a água de forma uniforme." },
  { n: "03", t: "Controle", d: "Medição constante para atingir de 8% a 12% de umidade." },
  { n: "04", t: "Entrega", d: "Carregamento a granel com logística própria até o cliente." },
];

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden">
        <img src={hero} alt="Secador rotativo de serragem" className="absolute inset-0 h-full w-full object-cover" width={1600} height={900} />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto max-w-6xl px-6 py-32 md:py-44">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Logística Caltec</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight text-hero-foreground md:text-7xl">
            Serragem seca e secador industrial
          </h1>
          <p className="mt-6 max-w-xl text-lg text-hero-foreground/80">
            Biomassa com umidade controlada para gerar mais energia, render mais e custar menos.
          </p>
          <a href="#contato" className="mt-10 inline-block rounded-md bg-primary px-8 py-4 font-semibold text-primary-foreground transition hover:opacity-90">
            Solicitar orçamento
          </a>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2">
        <div>
          <h2 className="font-display text-4xl">Por que serragem seca?</h2>
          <p className="mt-6 text-muted-foreground">
            Serragem úmida desperdiça energia: parte do calor é gasto só para evaporar a água. Com a serragem seca, o poder calorífico aumenta, a queima fica mais limpa e o transporte fica mais leve.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[["até 12%", "umidade"], ["+40%", "poder calorífico"], ["-30%", "peso no frete"]].map(([v, l]) => (
            <div key={l} className="rounded-lg bg-card p-5 text-center shadow-sm">
              <div className="font-display text-3xl text-primary">{v}</div>
              <div className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-4xl">Como funciona o secador</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {etapas.map((e) => (
              <div key={e.n} className="border-t-2 border-primary pt-6">
                <div className="font-display text-2xl text-primary">{e.n}</div>
                <h3 className="mt-2 text-lg font-semibold">{e.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{e.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display text-4xl">Aplicações</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {usos.map((u) => (
            <div key={u.t} className="rounded-lg border bg-card p-8">
              <h3 className="text-xl font-semibold">{u.t}</h3>
              <p className="mt-2 text-muted-foreground">{u.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contato" className="bg-hero py-24 text-center text-hero-foreground">
        <h2 className="font-display text-4xl">Precisa de serragem seca?</h2>
        <p className="mx-auto mt-4 max-w-md text-hero-foreground/70">Fale com a Caltec e receba um orçamento sob medida para o seu volume.</p>
        <a href="mailto:contato@caltec.com.br" className="mt-8 inline-block rounded-md bg-primary px-8 py-4 font-semibold text-primary-foreground">
          Entrar em contato
        </a>
      </section>
    </main>
  );
}
