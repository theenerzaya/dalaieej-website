import { useTranslations } from 'next-intl';

export default function CataloguePage() {
  const t = useTranslations('catalogue');

  return (
    <main className="bg-main min-h-screen">
      {/* --- HERO: The "Number One Candidate" Headline --- */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-body uppercase tracking-[0.3em] text-[10px] md:text-xs text-stone-500 mb-4 block">
            {t('archiveLabel')} 
          </span>
          <h1 className="font-heading text-4xl md:text-7xl text-stone-900 leading-tight uppercase tracking-tight">
            {t('mainTitle')}
          </h1>
          <div className="h-px w-20 bg-stone-300 mx-auto mt-8" />
          <p className="font-editorial italic text-stone-600 mt-8 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* --- THE JOURNAL: Interactive Flipbook Embed --- */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="relative w-full aspect-[4/3] md:aspect-video shadow-2xl rounded-sm overflow-hidden border border-stone-200 bg-white">
            <iframe 
              src="https://online.fliphtml5.com/scxec/iewd/?wmode=opaque" 
              className="absolute inset-0 w-full h-full"
              seamless 
              scrolling="no" 
              allowFullScreen 
              title="The Dalai Eej Journal"
            />
          </div>
        </div>
      </section>

      {/* --- THE ACTION: Archival PDF Download --- */}
      <section className="px-6 pb-32 border-t border-stone-200 pt-20">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <h2 className="font-heading text-2xl text-stone-800 uppercase tracking-tight mb-2">
              {t('downloadHeading')}
            </h2>
            <p className="font-body text-stone-500 text-sm tracking-wide">
              {t('downloadSubtext')}
            </p>
          </div>

          <a 
            href="/s/catalogue2026.pdf" 
            target="_blank"
            className="group relative inline-block px-12 py-5 bg-stone-900 text-white font-body tracking-[0.2em] uppercase text-[10px] hover:bg-stone-800 transition-all"
          >
            <span className="relative z-10">{t('downloadButton')}</span>
            <div className="absolute inset-0 border border-stone-900 translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
          </a>
        </div>
      </section>
    </main>
  );
}