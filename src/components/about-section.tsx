import { ArrowUpRight, DraftingCompass, Layers3, Ruler, Hammer } from "lucide-react";
import { whatsappOfferUrl } from "@/lib/sales";

const photos = {
  workshop: "/Ah%C5%9Fap%20Z%C4%B1mparalayan%20Usta%20Eller.webp",
  detail: "/Koyu%20Ceviz%20%C4%B0%C5%9F%C3%A7ili%C4%9Finde%20Zarif%20Bir%20K%C3%B6%C5%9Fe.webp",
  interior: "/S%C4%B1cak%20I%C5%9F%C4%B1kl%C4%B1%20Modern%20Salon.webp",
};

const services = [
  { icon: Ruler, title: "Tasarım", description: "Mekâna ve ihtiyaca özel çözümler." },
  { icon: Layers3, title: "Üretim", description: "Malzemeye ve detaylara özen." },
  { icon: Hammer, title: "Uygulama", description: "Projeye uygun titiz işçilik." },
];

export function AboutSection() {
  return (
    <section id="hikaye" aria-label="Hakkımızda" lang="tr" className="nil-scene nil-scene--hk nil-restored-gold relative isolate">
      <div className="nil-scene__body relative z-10 mx-auto flex h-full w-full max-w-[1660px] flex-col justify-center gap-5 px-5 py-7 md:gap-7 md:px-7 lg:px-8">
        <div className="grid items-center gap-5 lg:grid-cols-[1.02fr_1.06fr_.92fr] lg:gap-9">
          <div className="min-w-0">
            <p data-s="fade" className="mb-3 text-[10px] uppercase tracking-[.36em] text-[#c4a36b]">NİL MOBİLYA / HİKÂYEMİZ</p>
            <h2 data-s="text" className="font-display text-[clamp(3rem,4.7vw,5rem)] leading-[1.08] text-[#e8ded0]">Hakkımızda</h2>
            <p data-s="fade" className="mt-4 max-w-[460px] text-base leading-7 text-[#bdb2a5]">
              Özel ölçü mobilya, ahşap üretim ve mimari uygulamalarda; mekânın karakterine uyum sağlayan, özenli çözümler geliştiriyoruz.
            </p>
            <a data-s="fade" href="#koleksiyon" className="mt-5 inline-flex items-center gap-3 border-b border-[#8d744f]/60 pb-2 text-xs text-[#d5bb90] transition-colors hover:text-white">
              Koleksiyonumuzu keşfedin <ArrowUpRight className="size-4" />
            </a>
          </div>
          <div data-s="frame" className="relative min-h-[185px] overflow-hidden rounded-[22px] border border-white/10 bg-[#131313] lg:h-[315px]">
            <img src={photos.workshop} alt="Ahşap yüzey üzerinde çalışan usta ellerini gösteren temsili görsel" className="h-full w-full object-cover opacity-80" loading="lazy" />
          </div>
          <div className="grid gap-3">
            {services.map(({ icon: Icon, title, description }) => (
              <div data-s="fade" key={title} className="flex items-center gap-3 rounded-[16px] border border-[#66543a]/35 bg-[#151515]/85 px-5 py-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10"><Icon className="size-5 text-[#c4a36b]" strokeWidth={1.3} /></div>
                <div><h3 className="font-display text-xl text-[#ddd6d0]">{title}</h3><p className="text-xs leading-5 text-[#96908b]">{description}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[.82fr_1.18fr]">
          <div data-s="frame" className="relative min-h-[125px] overflow-hidden rounded-[20px] border border-white/10 bg-[#141414] lg:h-[210px]">
            <img src={photos.detail} alt="Özel ahşap mobilya birleşim detayını gösteren temsili görsel" className="h-full w-full object-cover opacity-75" loading="lazy" />
            <span className="absolute bottom-3 left-4 text-[10px] uppercase tracking-[.2em] text-white/80">Malzeme ve detay</span>
          </div>
          <a data-s="fade" href={whatsappOfferUrl()} target="_blank" rel="noopener noreferrer" className="group flex min-h-[125px] items-center gap-5 rounded-[20px] border border-[#66543a]/35 bg-[#171615]/90 px-5 py-5 transition-colors hover:bg-[#202020] lg:h-[170px]">
            <DraftingCompass className="size-12 shrink-0 text-[#c4a36b]" strokeWidth={1} />
            <div className="flex-1">
              <h3 className="font-display text-[clamp(1.2rem,2vw,1.7rem)] text-[#e0d9d2]">Mimari Projeler</h3>
              <p className="mt-2 max-w-[390px] text-xs leading-6 text-[#a19a95]">Konut, ofis, kafe ve ticari mekânlara yönelik özel mobilya ve ahşap uygulamaları için bize ulaşın.</p>
            </div>
            <ArrowUpRight className="size-5 shrink-0 text-[#c4a36b] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid items-center gap-4 lg:grid-cols-[1.5fr_.5fr]">
          <div data-s="frame" className="relative h-[115px] overflow-hidden rounded-[20px] border border-white/10 bg-[#131313] lg:h-[180px]">
            <img src={photos.interior} alt="Koyu tonlarda mobilya ve mimari ahşap detayları içeren temsili iç mekân" className="h-full w-full object-cover object-center opacity-65" loading="lazy" />
          </div>
          <div data-s="fade" className="border-l border-[#8d744f]/60 pl-5">
            <p className="text-[10px] tracking-[.3em] text-[#c4a36b]">TASARIM · ÜRETİM · UYGULAMA</p>
            <p className="mt-3 font-display text-xl leading-snug text-[#d6cec7]">Üretimden mekâna, bütüncül bir yaklaşım.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
