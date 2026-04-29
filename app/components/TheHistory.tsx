/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";

interface TheHistoryProps {
  locale?: string;
}

export default function TheHistory({ locale = 'en' }: TheHistoryProps) {
  const isMn = locale === 'mn';
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(percentage, 5), 95));
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <section className="bg-surface py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16 max-w-3xl mx-auto"
        >
          <p className="font-body text-leaf text-sm tracking-[0.2em] uppercase mb-4">
            {isMn ? "Түүх" : "History"}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink mb-8">
            {isMn ? "Инээдний уламжлал." : "A Legacy of Laughter."}
          </h2>
          <div className="w-16 h-0.5 bg-leaf mx-auto mb-8" />
          <p className="font-body text-ink/70 text-lg md:text-xl leading-relaxed">
            {isMn 
              ? "Олон арван жилийн турш энэ бол хүүхдүүд байгаль дэлхийг хайрлаж сурсан газар байсан. Бид энэ газрыг музей биш, амьд дурсамж болгон хадгалсан. Тэдгээр зунуудын баяр баясгалан хөрсөнд хэвээр байна."
              : "For decades, this was a place where children learned to love nature. We preserved the site not as a museum, but as a living memory. The joy of those summers is still in the soil."}
          </p>
        </motion.div>

        {/* Before/After Slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          ref={containerRef}
          className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-2xl cursor-ew-resize select-none"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onTouchStart={() => isDragging.current = true}
          onTouchEnd={() => isDragging.current = false}
        >
          {/* Current Lodge (Color) - Background */}
          <img
            src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&auto=format&fit=crop&q=80"
            alt={isMn ? "Одоогийн лодж" : "Current Lodge"}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
          
          {/* Historic Camp (B&W) - Foreground with clip */}
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=1200&auto=format&fit=crop&q=80"
              alt={isMn ? "Түүхэн зураг" : "Historic Camp"}
              className="absolute inset-0 w-full h-full object-cover grayscale sepia-[0.2]"
              draggable={false}
            />
          </div>
          
          {/* Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white/90 shadow-lg cursor-ew-resize z-10"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-leaf/20">
              <div className="flex items-center gap-1.5">
                <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-leaf" />
                <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[6px] border-transparent border-l-leaf" />
              </div>
            </div>
          </div>
          
          {/* Labels */}
          <div className="absolute bottom-6 left-6 bg-ink-secondary/80 backdrop-blur-sm text-main px-4 py-2 rounded-lg text-sm font-body z-20">
            <span className="opacity-70">{isMn ? "Өчигдөр" : "Then"}</span>
            <span className="mx-2 opacity-40">|</span>
            <span>{isMn ? "1960-аад он" : "1960s"}</span>
          </div>
          <div className="absolute bottom-6 right-6 bg-surface/90 backdrop-blur-sm text-ink px-4 py-2 rounded-lg text-sm font-body z-20">
            <span className="opacity-70">{isMn ? "Өнөөдөр" : "Now"}</span>
            <span className="mx-2 opacity-40">|</span>
            <span>{isMn ? "2024" : "2024"}</span>
          </div>

          {/* Instruction Hint */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 3, duration: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-ink-secondary/70 backdrop-blur-sm text-main px-6 py-3 rounded-full text-sm font-body pointer-events-none z-30"
          >
            {isMn ? "Чирж харьцуулах" : "Drag to compare"}
          </motion.div>
        </motion.div>

        {/* Happy Ghosts Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="font-serif text-2xl md:text-3xl text-ink/80 italic">
            &quot;{isMn ? "Аз жаргалтай сүнснүүд" : "Happy Ghosts"}&quot;
          </p>
          <p className="font-body text-ink/50 text-sm mt-3">
            {isMn ? "Өнгөрсөн үеийн хүүхдүүдийн инээд энд хэвээр байна" : "The laughter of generations past still echoes here"}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
