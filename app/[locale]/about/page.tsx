"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useRef, useState } from "react";
import { Compass, Flag, Flame, Link2 } from "lucide-react";
import TrustBadge from "@/app/components/TrustBadge";
import LocationMap from "@/app/components/LocationMap";

export default function AboutPage() {
  const t = useTranslations();
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';
  
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroTextY = useTransform(heroProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);

  const peninsulaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: peninsulaProgress } = useScroll({
    target: peninsulaRef,
    offset: ["start end", "center center"]
  });
  const maskWidth = useTransform(peninsulaProgress, [0, 1], ["30%", "100%"]);

  const [sliderPosition, setSliderPosition] = useState(50);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(percentage, 5), 95));
  };

  const valuesData = [
    {
      icon: Compass,
      title: locale === 'mn' ? "Өв уламжлал & Шинэчлэл" : "Heritage & Innovation",
      description: locale === 'mn' 
        ? "Уламжлалт Монгол зочломтгой байдлыг орчин үеийн тав тухтай байдалтай хослуулах"
        : "Blending traditional Mongolian hospitality with modern comfort"
    },
    {
      icon: Flag,
      title: locale === 'mn' ? "Хойд нутгийн стандарт" : "The Standard of the North",
      description: locale === 'mn'
        ? "Хөвсгөлийн тэргүүлэгч зочломтгой газар болох"
        : "Setting the benchmark for Khuvsgul hospitality"
    },
    {
      icon: Flame,
      title: locale === 'mn' ? "Байгалийн ид шид" : "The Magic of Nature",
      description: locale === 'mn'
        ? "Thoreau-гийн 'Зэрлэг байгалийн эмчилгээ' - нь бидний удирдамж юм"
        : "Thoreau's 'Tonic of Wildness' guides our philosophy"
    },
    {
      icon: Link2,
      title: locale === 'mn' ? "Хатгалын холбоо" : "The Khatgal Connection",
      description: locale === 'mn'
        ? "Орон нутгийнхаа хамт олонд үндэслэсэн"
        : "Rooted in our community"
    }
  ];

  return (
    <main className="min-h-screen bg-surface">
      <section 
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&auto=format&fit=crop&q=80"
            alt="Lake Khuvsgul"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/30 to-ink/60" />
        </div>
        
        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-body text-main/80 text-sm tracking-[0.3em] uppercase mb-8"
          >
            {locale === 'mn' ? "Далай Ээж Resort" : "Dalai Eej Resort"}
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight"
          >
            {locale === 'mn' ? "Бидний Түүх" : "The Legend of Dalai Eej"}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-body text-main/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            {locale === 'mn' 
              ? "Түүх модны бүх давхаргад суусан... Нэгэн цагт эзэн хаадын сонгосон, одоо чимээгүй байдлыг хайгчдад хадгалагдсан газар нутаг."
              : "History sits in every timber... A landscape once chosen by royalty, now preserved for the seeker of silence."}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-surface/50 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-surface rounded-full"
            />
          </div>
        </motion.div>
      </section>

      <section className="py-24 md:py-32 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-lg shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop&q=80"
                  alt="The Lodge"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-leaf/20 rounded-lg -z-10" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:pl-8"
            >
              <p className="font-body text-leaf text-sm tracking-[0.2em] uppercase mb-4">
                {locale === 'mn' ? "Архитектур" : "Architecture"}
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-ink mb-6 leading-tight">
                {locale === 'mn' ? "Хөндийн нугас" : "The Fold of the Valley"}
              </h2>
              <div className="w-16 h-0.5 bg-leaf mb-8" />
              <p className="font-body text-ink/70 text-lg leading-relaxed mb-6">
                {locale === 'mn'
                  ? "Хатгалын хил хязгаараас өнгөрөхөд та мэддэг ертөнцийг орхидог..."
                  : "Once past the edge of Khatgal, you leave the known world..."}
              </p>
              <p className="font-body text-ink/70 text-lg leading-relaxed">
                {locale === 'mn'
                  ? "Байшин нь зочид буудал биш харин түүхэн ариун газар болж харагддаг."
                  : "The lodge reveals itself not as a hotel, but as a historic sanctuary."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section ref={peninsulaRef} className="py-24 md:py-32 px-6 bg-ink overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="font-body text-main/60 text-sm tracking-[0.2em] uppercase mb-4">
              {locale === 'mn' ? "Нууцлал" : "Privacy"}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-main mb-6">
              {locale === 'mn' ? "Усны захад амьдрал" : "Life on the Water's Edge"}
            </h2>
          </motion.div>
          
          <motion.div
            style={{ width: maskWidth }}
            className="mx-auto overflow-hidden rounded-lg shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1600&auto=format&fit=crop&q=80"
              alt="The Peninsula"
              className="w-full h-[50vh] md:h-[60vh] object-cover"
            />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-body text-main/80 text-lg md:text-xl text-center max-w-3xl mx-auto mt-12 leading-relaxed"
          >
            {locale === 'mn'
              ? "Гурван талаараа нуурт хүрээлэгдсэн... Хамгийн ховор тансаг: тасралтгүй хүрээ."
              : "Surrounded on three sides by the lake... The rarest luxury of all: unbroken horizons."}
          </motion.p>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="font-body text-leaf text-sm tracking-[0.2em] uppercase mb-4">
              {locale === 'mn' ? "Түүх" : "History"}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-ink mb-6">
              {locale === 'mn' ? "Удирдагчдын чимээгүй сонголт" : "The Quiet Choice of Leaders"}
            </h2>
            <p className="font-body text-ink/70 text-lg max-w-2xl mx-auto">
              {locale === 'mn'
                ? "Хойморь нь удаан хугацаанд итгэмжит хоргодох газар байсан. Кувейтийн Шейхээс Монголын Ерөнхийлөгч нар хүртэл бид амар амгаланг хайгчдын айлчлалыг хамгаалдаг."
                : "The peninsula has long been a trusted refuge. From the Sheikh of Kuwait to Mongolia's Presidents, we shield the visits of those who seek peace."}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-[16/9] rounded-lg overflow-hidden shadow-2xl cursor-ew-resize select-none"
            onMouseMove={handleSliderMove}
          >
            <img
              src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&auto=format&fit=crop&q=80"
              alt="Current Lodge"
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=1200&auto=format&fit=crop&q=80&sat=-100"
                alt="Historic Camp"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: `${10000 / sliderPosition}%` }}
              />
            </div>
            
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="flex items-center gap-1">
                  <div className="w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-ink-secondary" />
                  <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-ink-secondary" />
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 bg-ink-secondary/80 text-main px-3 py-1.5 rounded text-sm font-body">
              {locale === 'mn' ? "1960-аад он" : "1960s"}
            </div>
            <div className="absolute bottom-4 right-4 bg-surface/90 text-ink px-3 py-1.5 rounded text-sm font-body">
              {locale === 'mn' ? "Өнөөдөр" : "Today"}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="history" className="py-24 md:py-32 px-6 bg-leaf/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="font-body text-leaf text-sm tracking-[0.2em] uppercase mb-4">
              {locale === 'mn' ? "Үнэт зүйлс" : "Values"}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-ink">
              {locale === 'mn' ? "Манай ёс зүй" : "The Ethos"}
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {valuesData.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`p-8 md:p-10 rounded-lg transition-all duration-300 cursor-default ${
                  hoveredCard === index 
                    ? 'bg-leaf text-main shadow-xl scale-[1.02]' 
                    : 'bg-white text-ink shadow-md'
                }`}
              >
                <value.icon className={`w-10 h-10 mb-6 transition-colors duration-300 ${
                  hoveredCard === index ? 'text-main' : 'text-leaf'
                }`} />
                <h3 className={`font-serif text-2xl mb-4 transition-colors duration-300 ${
                  hoveredCard === index ? 'text-main' : 'text-ink'
                }`}>
                  {value.title}
                </h3>
                <p className={`font-body leading-relaxed transition-colors duration-300 ${
                  hoveredCard === index ? 'text-main/80' : 'text-ink/70'
                }`}>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Location & Trust */}
      <section className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center py-12 bg-surface"
        >
          <p className="font-body text-leaf text-sm tracking-[0.2em] uppercase mb-4">
            {locale === 'mn' ? "Байршил" : "Location"}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-ink">
            {locale === 'mn' ? "Биднийг олоорой" : "Find Us"}
          </h2>
        </motion.div>
        
        <div className="h-[60vh] md:h-[70vh] w-full relative">
          <LocationMap />
          
          {/* Trust Badge - Desktop: Top Right */}
          <div className="hidden md:block absolute top-8 right-8 z-10 w-72">
            <TrustBadge locale={locale} />
          </div>
          
          {/* View Directions Button - Bottom Center */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
            <motion.a
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              href={`${localePrefix}/contact`}
              className="inline-block px-8 py-3 bg-surface text-water-deep font-body font-medium text-sm tracking-wide hover:bg-white transition-colors rounded shadow-lg"
            >
              {locale === 'mn' ? "Чиглэлийг харах" : "View Directions"}
            </motion.a>
          </div>
        </div>
        
        {/* Trust Badge - Mobile: Below Map */}
        <div className="md:hidden px-6 py-8 bg-leaf/5">
          <div className="max-w-sm mx-auto">
            <TrustBadge locale={locale} />
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-ink">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-main mb-6">
              {locale === 'mn' ? "Өөрийн аялалаа эхлүүлээрэй" : "Begin Your Journey"}
            </h2>
            <p className="font-body text-main/70 mb-10 max-w-xl mx-auto">
              {locale === 'mn'
                ? "Хөвсгөл нуурын эргэнд тантай уулзахыг хүлээж байна"
                : "We await your arrival on the shores of Lake Khuvsgul"}
            </p>
            <a
              href={`${localePrefix}/booking`}
              className="inline-block px-10 py-4 bg-surface text-water-deep font-body font-semibold tracking-wide hover:bg-white transition-colors rounded"
            >
              {locale === 'mn' ? "Захиалга хийх" : "Reserve Your Stay"}
            </a>
          </motion.div>
        </div>
      </section>

      <footer className="bg-ink-secondary py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-serif text-2xl text-main mb-4">Dalai Eej</p>
          <p className="font-body text-main/50 text-sm">
            &copy; {new Date().getFullYear()} Dalai Eej Resort. {locale === 'mn' ? "Бүх эрх хуулиар хамгаалагдсан." : "All rights reserved."}
          </p>
        </div>
      </footer>
    </main>
  );
}
