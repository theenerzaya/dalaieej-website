"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function EditorialIntro() {
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';
  const reduceMotion = useReducedMotion();
  const storyHref = `${localePrefix}/#`;

  // #region agent log
  fetch('http://127.0.0.1:7577/ingest/f83ec0af-df30-48e2-bcbb-7c51993513d3',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'412f50'},body:JSON.stringify({sessionId:'412f50',runId:'verify',hypothesisId:'H3-H5',location:'EditorialIntro.tsx:mount',message:'locale href motion',data:{locale,localePrefix,storyHref,reduceMotion:reduceMotion??null},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  return (
    <section
      id="editorial-intro"
      className="scroll-mt-24 py-24 md:py-32 px-6 bg-surface"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/*
        <motion.p
          initial={
            reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
          className="font-body text-water-deep/60 text-sm tracking-[0.3em] uppercase mb-8"
        >
          {locale === 'mn' ? "Монгол орны хоймор хязгаарт" : "In the far north of Mongolia"}
        </motion.p>
        */}

        <motion.h2
          initial={
            reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: reduceMotion ? 0 : 0.8,
            delay: reduceMotion ? 0 : 0.1,
          }}
          className="font-serif font-light text-3xl md:text-4xl lg:text-5xl text-water-deep leading-relaxed mb-8"
        >
          {locale === 'mn' ? (
            <>
              АРИУН ДАГШИН, ХОСГҮЙ, ҮНЭТ ӨВ 
              <br />
              — ЗҮҮН ЭРГИЙН АМИН ЗҮРХ.
            </>
          ) : (
            <>
              SOLITARY, SACRED, SINGULAR
              <br />
              — THE HEART OF KHUVSGUL.
            </>
          )}
        </motion.h2>
        
        <motion.div
          initial={
            reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            delay: reduceMotion ? 0 : 0.2,
          }}
        >
          <Link
            href={storyHref}
            className="inline-flex items-center gap-2 font-body text-water-deep font-medium hover:gap-4 transition-all group"
          >
            <span className="border-b border-ink/30 group-hover:border-ink transition-colors">
              {locale === 'mn' ? "Бидний тухай" : "About us"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
