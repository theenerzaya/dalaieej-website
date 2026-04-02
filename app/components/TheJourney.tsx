"use client";

import { motion } from "framer-motion";
import { Plane, Car, Users } from "lucide-react";
import LocationMap from "./LocationMap";

interface TheJourneyProps {
  locale?: string;
}

export default function TheJourney({ locale = 'en' }: TheJourneyProps) {
  const isMn = locale === 'mn';

  const infoItems = [
    {
      icon: Plane,
      title: isMn ? "Агаараар" : "By Air",
      description: isMn 
        ? "УБ-аас Мөрөн хүртэл (1.5 цаг). Өдөр бүрийн нислэг." 
        : "UB to Murun (1.5 hrs). Daily flights."
    },
    {
      icon: Car,
      title: isMn ? "Газраар" : "By Land",
      description: isMn 
        ? "Хойд чиглэлийн зам. 4x4 машин санал болгоно." 
        : "The northern route. 4x4 recommended."
    },
    {
      icon: Users,
      title: isMn ? "Түншлэл" : "Trade & Partners",
      description: isMn 
        ? "жолооч & операторуудын нэвтрэлт" 
        : "drivers & operators login",
      isLink: true
    }
  ];

  return (
    <section className="bg-surface py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - The Remote Reality Warning */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <p className="font-body text-leaf text-sm tracking-[0.2em] uppercase mb-6">
              {isMn ? "Аяллын мэдээлэл" : "The Journey"}
            </p>
            
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink mb-8 leading-tight">
              {isMn 
                ? "Дэлхийн захад тав тух." 
                : "Comfort at the Edge of the World."}
            </h2>
            
            <div className="w-16 h-0.5 bg-leaf mb-8" />
            
            <div className="space-y-6 font-body text-ink/70 text-lg leading-relaxed">
              <p>
                {isMn 
                  ? "Хөх сувдын ойролцоо байх нь эрхэм боловч удаан хурдыг шаарддаг. Бид энгийн загвараар тохижуулсан ариун газрыг санал болгодог."
                  : "To be this close to the Blue Pearl is a privilege, and it demands a slower pace. We offer a sanctuary that is simple by design."}
              </p>
              <p>
                {isMn 
                  ? "Та энд орчин үеийн хүрэлцээг олох болно... гэхдээ хотын хүлээлтээ асфальт дээр үлдээнэ үү. Энд wifi үүлс шиг хөвөрч магадгүй..."
                  : "You will find modern touches here... but please leave your city expectations at the tarmac. Here, the wifi may drift like the clouds..."}
              </p>
              <p className="italic text-leaf">
                {isMn 
                  ? "Бид танд хэрэгтэй бүхнийг санал болгож, үзэмжээс анхаарлыг сарниулах юмгүй."
                  : "We offer everything you need, and nothing that distracts from the view."}
              </p>
            </div>
          </motion.div>

          {/* Right Column - Map & Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col"
          >
            {/* Map */}
            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl mb-8">
              <LocationMap />
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {infoItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-center p-4"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-ink/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-water-deep" />
                  </div>
                  <h4 className="font-serif text-lg text-ink mb-2">{item.title}</h4>
                  {item.isLink ? (
                    <a 
                      href="#partners" 
                      className="font-body text-sm text-ink/50 hover:text-leaf transition-colors underline underline-offset-2"
                    >
                      {item.description}
                    </a>
                  ) : (
                    <p className="font-body text-sm text-ink/60">{item.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
