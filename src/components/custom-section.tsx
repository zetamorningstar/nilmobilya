import { ArrowUpRight, Ruler, Palette, Hammer, MessageCircle, Layers3 } from "lucide-react";
import { whatsappOfferUrl } from "@/lib/sales";
import customHero from "@/assets/custom-hero.jpg";
import customCraft from "@/assets/custom-craft.jpg";
import woodImage from "@/assets/material-ceviz.jpg";
import fabricImage from "@/assets/material-boucle.jpg";
import marbleImage from "@/assets/about-detail.jpg";

const steps = [
  {icon: MessageCircle, title: "İhtiyaçlarınızı dinliyoruz", text: "Mekânınızı, kullanım amacınızı ve beklentilerinizi konuşuyoruz."},
  {icon: Ruler, title: "Ölçü ve tasarım", text: "Alanınıza uygun ölçü, form ve detayları birlikte belirliyoruz."},
  {icon: Hammer, title: "Üretim ve uygulama", text: "Kararlaştırılan tasarımı özenli işçilikle hayata geçiriyoruz."},
];

export function CustomSection() {
  return (
    <section id="ozel-uretim" aria-label="Özel üretim" lang="tr" className="nil-scene nil-scene--ou nil-restored-gold">
      <div className="nil-scene__body relative z-10 mx-auto flex h-full w-full max-w-[1660px] flex-col justify-center gap-5 px-5 py-7 md:gap-7 md:px-7 lg:px-8">
        <div className="grid items-center gap-5 lg:grid-cols-[1.04fr_1.06fr_.9fr] lg:gap-9">
          <div className="min-w-0">
            <p data-s="fade" className="mb-3 text-[10px] uppercase tracking-[.34em] text-[#c4a36b]">NİL MOBİLYA / SİZE ÖZEL</p>
            <h2 data-s="text" className="font-display text-[clamp(3rem,4.7vw,5rem)] leading-[1.08] text-[#e8ded0]">Özel Üretim</h2>
            <p data-s="fade" className="mt-4 max-w-[450px] text-base leading-7 text-[#bdb2a5]">Her mekânın ölçüsü, her yaşamın ihtiyacı farklı. Size özel mobilya ve mimari ahşap çözümlerini birlikte şekillendiriyoruz.</p>
            <a data-s="fade" href={whatsappOfferUrl()} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-3 border-b border-[#8d744f]/60 pb-2 text-sm text-[#d5bb90] transition-colors hover:text-white">Özel üretim için teklif alın <ArrowUpRight className="size-4" /></a>
          </div>
          <div data-s="frame" className="relative h-[215px] overflow-hidden rounded-[22px] border border-white/10 bg-[#141414] lg:h-[315px]">
            <img src={customHero} alt="Özel üretim mobilya tasarımını temsil eden görsel" className="h-full w-full object-cover opacity-80" loading="lazy" />
          </div>
          <div className="grid gap-3">
            {steps.map(({icon:Icon,title,text},i)=>(
              <div data-s="fade" key={title} className="flex items-center gap-3 rounded-[16px] border border-[#66543a]/35 bg-[#151515]/85 px-4 py-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10"><Icon className="size-5 text-[#c4a36b]" strokeWidth={1.3}/></div>
                <div className="min-w-0"><p className="mb-0.5 text-[10px] tracking-[.16em] text-[#b69a73]">0{i+1} / SÜREÇ</p><h3 className="font-display text-xl text-[#ded7d0]">{title}</h3><p className="text-xs leading-5 text-[#9f9791]">{text}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-[.86fr_1.14fr]">
          <div data-s="frame" className="relative h-[150px] overflow-hidden rounded-[20px] border border-white/10 bg-[#141414] lg:h-[210px]">
            <img src={customCraft} alt="Mobilya işçiliğini temsil eden fotoğraf" className="h-full w-full object-cover opacity-75" loading="lazy"/>
            <span className="absolute bottom-3 left-4 text-[10px] uppercase tracking-[.2em] text-white/85">Detaylarda ustalık</span>
          </div>
          <div data-s="fade" className="flex flex-col justify-center rounded-[20px] border border-[#66543a]/35 bg-[#151515]/85 px-5 py-4">
            <div className="flex items-center gap-3"><Layers3 className="size-5 text-[#c4a36b]" strokeWidth={1.3}/><h3 className="font-display text-xl text-[#e0d8d0]">Malzemeyi birlikte seçelim</h3></div>
            <p className="mt-2 max-w-[600px] text-xs leading-6 text-[#a9a19a]">Ahşap dokusu, kumaş, yüzey ve renk seçenekleriyle tasarımınızı mekânınıza uygun hale getirelim.</p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[{src:woodImage,label:"Ahşap"},{src:fabricImage,label:"Kumaş"},{src:marbleImage,label:"Yüzey"}].map(({src,label})=>(
                <div key={label} className="relative h-[62px] overflow-hidden rounded-xl border border-white/10 bg-[#222]"><img src={src} alt={label+" malzeme örneği"} className="h-full w-full object-cover opacity-75"/><span className="absolute bottom-1 left-2 text-[10px] text-white drop-shadow">{label}</span></div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div data-s="fade" className="flex min-h-[120px] items-center gap-4 rounded-[19px] border border-[#66543a]/35 bg-[#151515]/85 px-5 py-4">
            <Palette className="size-9 shrink-0 text-[#c4a36b]" strokeWidth={1.2}/>
            <div><h3 className="font-display text-xl text-[#e1dad4]">Her detayda sizin tercihiniz.</h3><p className="mt-1 text-xs leading-5 text-[#9e9690]">Ölçüden malzemeye, tasarımdan son dokunuşa.</p></div>
          </div>
          <a data-s="fade" href={whatsappOfferUrl()} target="_blank" rel="noopener noreferrer" className="group flex min-h-[105px] items-center gap-4 rounded-[19px] border border-[#66543a]/40 bg-[#191715]/90 px-5 py-4 transition-colors hover:bg-[#252321]">
            <MessageCircle className="size-9 shrink-0 text-[#c4a36b]" strokeWidth={1.2}/>
            <div className="flex-1"><h3 className="font-display text-xl text-[#e1dad4]">Projenizi konuşalım</h3><p className="mt-1 text-xs leading-5 text-[#9e9690]">Özel ölçü mobilya ve mimari uygulamalar için iletişime geçin.</p></div>
            <ArrowUpRight className="size-5 text-[#c4a36b] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"/>
          </a>
        </div>
      </div>
    </section>
  );
}
