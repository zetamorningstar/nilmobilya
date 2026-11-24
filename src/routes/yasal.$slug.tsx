import { createFileRoute } from "@tanstack/react-router";
import { legalDocuments, legalLinks } from "@/legal/legal-documents";
import { legalInfo } from "@/legal/legal-info";

export const Route = createFileRoute("/yasal/$slug")({
  component: LegalPage,
});

const legalDraft = legalInfo.version.toLocaleLowerCase("tr-TR").includes("taslak") || [legalInfo.sellerName,legalInfo.sellerAddress,legalInfo.businessRegistration,legalInfo.kvkkChannel,legalInfo.realDataRecipients,legalInfo.actualCookies].some(value=>value.includes("["));

function LegalPage() {
  const { slug } = Route.useParams();
  const doc = legalDocuments[slug];

  if (!doc) {
    return (
      <main className="min-h-screen bg-[#11100f] px-6 py-32 text-[#f0e9df]">
        <h1 className="font-serif text-4xl">Sayfa bulunamadı</h1>
        <a href="/" className="mt-8 inline-block text-[#c6a679] underline">Ana sayfaya dön</a>
      </main>
    );
  }

  return (
    <main lang="tr" className="min-h-screen bg-[#11100f] px-5 pb-20 pt-20 text-[#f0e9df] sm:px-10 sm:pt-28">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="text-xs uppercase tracking-[.2em] text-[#c6a679]">← Nil Mobilya</a>
        <p className="mt-10 text-[11px] uppercase tracking-[.24em] text-[#c6a679]">Kurumsal / Yasal</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-6xl">{doc.title}</h1>
        {legalDraft && <aside role="note" aria-label="Yasal metin taslak uyarısı" className="mt-6 rounded-xl border border-amber-600/45 bg-amber-950/20 px-5 py-4 text-sm leading-7 text-amber-100">
          <strong className="block font-semibold">Bu sayfa henüz tamamlanmamış bir taslaktır.</strong>
          İşletmenin resmî kimlik bilgileri ve bazı veri işleme ayrıntıları doğrulanmayı bekliyor. Bu içerik nihai sözleşme, eksiksiz KVKK aydınlatması veya siparişe özel ön bilgilendirme yerine geçmez. Satış koşulları için sipariş vermeden önce yazılı bilgi isteyin.
        </aside>}
        <p className="mt-5 text-sm leading-7 text-[#c6b9a9]">{doc.description}</p>
        <div className="mt-10 border-t border-[#6b5539]/65" />
        {doc.sections.map((section) => (
          <section key={section.heading} className="border-b border-[#403930] py-7">
            <h2 className="font-serif text-2xl text-[#e3d5c3]">{section.heading}</h2>
            {section.text.map((paragraph) => (
              <p key={paragraph} className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#c7bfb3]">{paragraph}</p>
            ))}
            {section.bullets && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-[#c7bfb3]">
                {section.bullets.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </section>
        ))}
        <p className="mt-8 text-xs text-[#8e8172]">{legalInfo.version}</p>
        <nav aria-label="Diğer yasal sayfalar" className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-t border-[#6b5539]/65 pt-5 text-xs text-[#c6a679]">
          {legalLinks.filter((link) => link.slug !== slug).map((link) => (
            <a href={`/yasal/${link.slug}`} key={link.slug} className="hover:text-white">{link.label}</a>
          ))}
        </nav>
      </div>
    </main>
  );
}
