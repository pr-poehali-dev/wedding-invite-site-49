import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const WEDDING_DATE = new Date("2026-08-26T14:00:00");

const COUPLE_PHOTO = "https://cdn.poehali.dev/projects/166d446d-8a02-41d9-8496-f23587488617/bucket/e614a56b-63b5-4b83-9da0-043ba5cdd3df.jpg";
const BRIDE_CHILD = "https://cdn.poehali.dev/projects/166d446d-8a02-41d9-8496-f23587488617/files/302d338f-d604-4f42-990b-a0b3d2f7ed4b.jpg";
const GROOM_CHILD = "https://cdn.poehali.dev/projects/166d446d-8a02-41d9-8496-f23587488617/files/b5ace827-8178-4033-83ce-e52d7012bb22.jpg";

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

function useInView(ref: React.RefObject<HTMLElement>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return inView;
}

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<HTMLElement>);
  return (
    <div ref={ref} className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
}

function Ornament() {
  return (
    <div className="divider-ornament my-8 px-8">
      <span className="handwriting text-lg" style={{ color: "var(--wine)" }}>✦</span>
    </div>
  );
}

function PolaroidCard({ src, label, rotate = 0 }: { src: string; label: string; rotate?: number }) {
  return (
    <div
      className="polaroid"
      style={{ transform: `rotate(${rotate}deg)`, transition: "transform 0.3s" }}
      onMouseEnter={e => (e.currentTarget.style.transform = "rotate(0deg) scale(1.03)")}
      onMouseLeave={e => (e.currentTarget.style.transform = `rotate(${rotate}deg)`)}
    >
      <img src={src} alt={label} className="block" style={{ width: 220, height: 220, objectFit: "cover" }} />
      <span className="polaroid-label">{label}</span>
    </div>
  );
}

function AugustCalendar() {
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const startDay = 5;
  const totalDays = 31;
  const cells: (number | null)[] = Array(startDay).fill(null);
  for (let i = 1; i <= totalDays; i++) cells.push(i);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="bg-white p-6 shadow-md max-w-sm mx-auto" style={{ border: "1px solid rgba(139,26,46,0.1)" }}>
      <div className="text-center mb-4">
        <p className="serif-sc text-xs tracking-widest mb-1" style={{ color: "var(--wine)" }}>август</p>
        <p className="serif text-3xl font-light">2026</p>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(d => (
          <div key={d} className="cal-day serif-sc text-xs font-semibold opacity-40 flex items-center justify-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => (
          <div key={i} className={`cal-day flex items-center justify-center ${d === 26 ? "highlight" : ""} ${!d ? "muted" : ""}`}>
            {d || ""}
          </div>
        ))}
      </div>
      <p className="handwriting text-center mt-4 text-sm" style={{ color: "var(--wine)" }}>← наш день ♥</p>
    </div>
  );
}

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="countdown-box p-4 flex flex-col items-center min-w-[72px]">
      <span className="serif text-4xl font-light leading-none" style={{ color: "var(--wine)" }}>
        {String(value).padStart(2, "0")}
      </span>
      <span className="serif-sc text-xs tracking-widest mt-1 opacity-60">{label}</span>
    </div>
  );
}

const timeline = [
  { time: "14:00", event: "Сбор гостей" },
  { time: "14:30", event: "Церемония бракосочетания" },
  { time: "15:30", event: "Фотосессия" },
  { time: "16:30", event: "Фуршет" },
  { time: "18:00", event: "Первый танец молодожёнов" },
  { time: "19:00", event: "Торжественный ужин" },
  { time: "22:00", event: "Торт и сюрпризы" },
  { time: "00:00", event: "Танцевальная ночь" },
];

const dresscodes = [
  { color: "#D4C5A9", name: "Кремовый" },
  { color: "#B8A99A", name: "Пудровый" },
  { color: "#8B1A2E", name: "Бордовый" },
  { color: "#6B5B4B", name: "Тауп" },
  { color: "#C8B8A8", name: "Беж" },
];

const galleryImages = [
  { src: COUPLE_PHOTO, label: "наша история" },
  { src: GROOM_CHILD, label: "маленький богдан" },
  { src: BRIDE_CHILD, label: "маленькая эльвира" },
  { src: COUPLE_PHOTO, label: "вместе" },
  { src: BRIDE_CHILD, label: "она" },
  { src: GROOM_CHILD, label: "он" },
];

export default function Index() {
  const countdown = useCountdown(WEDDING_DATE);
  const [wishes, setWishes] = useState("");
  const [wishName, setWishName] = useState("");
  const [wishesSent, setWishesSent] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [rsvp, setRsvp] = useState({ name: "", attending: "", guests: "1", dietary: "", song: "" });

  const heroRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const photoEject = Math.min(scrollY * 0.55, 260);

  return (
    <div className="min-h-screen" style={{ background: "var(--paper)" }}>

      {/* ── HERO ── */}
      <section ref={heroRef} className="min-h-screen flex flex-col items-center relative overflow-hidden px-6 pt-10 pb-16">

        {/* Заголовок — самый верх */}
        <div className="fade-in-up text-center mt-2 mb-6 z-10">
          <h1 className="handwriting" style={{ fontSize: "clamp(2.6rem, 10vw, 5.5rem)", lineHeight: 1.05, color: "var(--ink)" }}>
            Богдан<br /><span style={{ color: "var(--wine)" }}>&amp; Эльвира</span>
          </h1>
          <p className="serif-sc text-xs tracking-[0.22em] mt-3 opacity-50">ПРИГЛАШАЮТ ВАС НА СВОЮ СВАДЬБУ</p>
        </div>

        {/* Поляроид с выезжающим фото */}
        <div className="fade-in-up delay-200 relative mx-auto" style={{ width: 280 }}>

          {/* Ангелочек слева сверху */}
          <div style={{
            position: "absolute",
            left: -80,
            top: -10,
            animation: "angel-sway 3s ease-in-out infinite",
            transformOrigin: "top center",
            zIndex: 20,
          }}>
            <svg width="72" height="72" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.85 }}>
              {/* Body */}
              <ellipse cx="60" cy="78" rx="18" ry="22" stroke="#8B1A2E" strokeWidth="2.2" fill="none"/>
              {/* Head */}
              <circle cx="60" cy="48" r="16" stroke="#8B1A2E" strokeWidth="2.2" fill="none"/>
              {/* Halo */}
              <ellipse cx="60" cy="30" rx="14" ry="5" stroke="#8B1A2E" strokeWidth="1.8" fill="none"/>
              {/* Left wing */}
              <path d="M42 68 C20 55 10 38 28 30 C36 46 40 58 42 68Z" stroke="#8B1A2E" strokeWidth="2" fill="none"/>
              {/* Right wing */}
              <path d="M78 68 C100 55 110 38 92 30 C84 46 80 58 78 68Z" stroke="#8B1A2E" strokeWidth="2" fill="none"/>
              {/* Wing feather lines left */}
              <path d="M28 30 C30 42 34 52 38 62" stroke="#8B1A2E" strokeWidth="1" opacity="0.5"/>
              <path d="M20 40 C24 50 28 58 33 66" stroke="#8B1A2E" strokeWidth="1" opacity="0.5"/>
              {/* Wing feather lines right */}
              <path d="M92 30 C90 42 86 52 82 62" stroke="#8B1A2E" strokeWidth="1" opacity="0.5"/>
              <path d="M100 40 C96 50 92 58 87 66" stroke="#8B1A2E" strokeWidth="1" opacity="0.5"/>
              {/* Eyes */}
              <circle cx="54" cy="46" r="2" fill="#8B1A2E"/>
              <circle cx="66" cy="46" r="2" fill="#8B1A2E"/>
              {/* Smile */}
              <path d="M54 55 Q60 60 66 55" stroke="#8B1A2E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              {/* Arms */}
              <path d="M42 80 Q35 90 38 100" stroke="#8B1A2E" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M78 80 Q85 90 82 100" stroke="#8B1A2E" strokeWidth="2" fill="none" strokeLinecap="round"/>
              {/* Heart in hands */}
              <path d="M38 100 Q40 95 43 100 Q46 95 48 100 Q43 107 38 100Z" stroke="#8B1A2E" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>

          {/* «Это мы» подпись слева */}
          <div style={{
            position: "absolute",
            left: -90,
            top: "50%",
            transform: "translateY(-10px)",
            zIndex: 20,
          }}>
            <p className="handwriting" style={{ color: "var(--wine)", fontSize: "1.3rem", transform: "rotate(-8deg)" }}>Это мы</p>
            <svg width="55" height="30" viewBox="0 0 55 30" fill="none" style={{ marginTop: 2 }}>
              <path d="M5 5 Q10 20 30 18 Q45 16 50 24" stroke="#8B1A2E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              <path d="M44 20 L50 24 L46 28" stroke="#8B1A2E" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Корпус поляроида */}
          <div style={{
            background: "#f0eeea",
            borderRadius: "12px 12px 6px 6px",
            padding: "14px 14px 0 14px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)",
            position: "relative",
            zIndex: 10,
          }}>
            {/* Видоискатель и объектив */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "0 4px" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {/* Вспышка */}
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#ddd,#bbb)", border: "3px solid #aaa", boxShadow: "inset 0 1px 3px rgba(255,255,255,0.8)" }}/>
                {/* Красная кнопка */}
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#cc2233", boxShadow: "0 2px 4px rgba(0,0,0,0.3)" }}/>
              </div>
              {/* Объектив */}
              <div style={{ width: 68, height: 68, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #1a3a6b, #0a0a1a)", border: "4px solid #555", boxShadow: "0 4px 12px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #2255aa, #050510)", border: "2px solid #333" }}/>
              </div>
              {/* Видоискатель */}
              <div style={{ width: 28, height: 22, background: "#111", borderRadius: 4, border: "2px solid #555" }}/>
            </div>
            {/* Название */}
            <p style={{ fontFamily: "Georgia, serif", fontSize: "0.7rem", color: "#888", letterSpacing: "0.12em", textAlign: "center", marginBottom: 8 }}>polaroid</p>

            {/* Слот выхода — обрезает фото */}
            <div style={{
              overflow: "hidden",
              height: 18,
              borderRadius: "0 0 2px 2px",
              background: "#e8e4de",
            }}/>
          </div>

          {/* Фото выезжает вниз из поляроида при скролле */}
          <div style={{
            position: "relative",
            zIndex: 5,
            marginTop: 0,
            transform: `translateY(${-260 + photoEject}px)`,
            transition: "transform 0.05s linear",
          }}>
            <div style={{
              background: "#fff",
              padding: "8px 8px 44px 8px",
              boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
              width: 280,
            }}>
              <img
                src={COUPLE_PHOTO}
                alt="Богдан и Эльвира"
                style={{ width: "100%", height: 264, objectFit: "cover", display: "block" }}
              />
              <span className="polaroid-label handwriting" style={{ fontSize: "1rem" }}>Богдан &amp; Эльвира</span>
            </div>
          </div>
        </div>

        {/* Дата */}
        <div className="fade-in-up delay-500 mt-8 text-center" style={{ position: "relative", zIndex: 10 }}>
          <p className="serif font-light" style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", color: "var(--wine)" }}>26 августа 2026</p>
          <p className="handwriting text-base mt-1 opacity-60">Заокский район, Тульская область</p>
        </div>

        <div className="fade-in-up delay-700 mt-10 flex flex-col items-center gap-2">
          <p className="serif-sc text-xs tracking-widest opacity-50">ЛИСТАЙТЕ ВНИЗ</p>
          <div className="bounce-slow" style={{ color: "var(--wine)" }}>
            <Icon name="ChevronDown" size={20} />
          </div>
        </div>
      </section>

      {/* ── ДАТА ── */}
      <section className="py-16 px-6" id="date">
        <Section>
          <Ornament />
          <div className="max-w-lg mx-auto text-center">
            <p className="handwriting text-xl mb-4" style={{ color: "var(--wine)" }}>Запомните эту дату</p>
            <h2 className="serif text-4xl font-light mb-6">26 · 08 · 2026</h2>
            <p className="serif text-lg font-light leading-relaxed opacity-80">
              В этот день мы скажем друг другу «да» — и хотим разделить это счастье с вами, нашими самыми близкими людьми.
            </p>
          </div>
        </Section>
      </section>

      {/* ── КАЛЕНДАРЬ ── */}
      <section className="py-12 px-6" id="calendar">
        <Section>
          <div className="max-w-sm mx-auto">
            <p className="handwriting text-center text-xl mb-6" style={{ color: "var(--wine)" }}>Отметьте в календаре</p>
            <AugustCalendar />
          </div>
        </Section>
      </section>

      {/* ── ДЕТСКИЕ ФОТО ── */}
      <section className="py-12 px-6" id="childhood">
        <Section>
          <Ornament />
          <p className="handwriting text-center text-2xl mb-10" style={{ color: "var(--wine)" }}>Мы были такими маленькими...</p>
          <div className="flex flex-wrap justify-center gap-12">
            <div className="flex flex-col items-center gap-3">
              <PolaroidCard src={GROOM_CHILD} label="Маленький Богдан" rotate={-3} />
              <p className="handwriting text-sm opacity-60">«Будущий жених»</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <PolaroidCard src={BRIDE_CHILD} label="Маленькая Эльвира" rotate={2.5} />
              <p className="handwriting text-sm opacity-60">«Будущая невеста»</p>
            </div>
          </div>
        </Section>
      </section>

      {/* ── МЕСТО ── */}
      <section className="py-12 px-6" id="venue">
        <Section>
          <Ornament />
          <div className="max-w-lg mx-auto text-center">
            <p className="handwriting text-xl mb-3" style={{ color: "var(--wine)" }}>Где это будет</p>
            <h2 className="serif text-3xl font-light mb-6">Место проведения</h2>
            <div className="bg-white p-8 shadow-md" style={{ border: "1px solid rgba(139,26,46,0.1)" }}>
              <div className="flex justify-center mb-4">
                <Icon name="MapPin" size={28} style={{ color: "var(--wine)" } as React.CSSProperties} />
              </div>
              <p className="serif text-xl font-semibold mb-1">Курорт «Заокские поля»</p>
              <p className="serif text-lg italic mb-4" style={{ color: "var(--wine)" }}>Ресторан «Трапезная»</p>
              <p className="serif text-base opacity-70 leading-relaxed">
                Тульская область, Заокский район,<br />
                муниципальное образование Малаховское
              </p>
              <div className="mt-6 pt-6" style={{ borderTop: "1px solid rgba(139,26,46,0.1)" }}>
                <p className="serif-sc text-xs tracking-widest opacity-50 mb-3">КАК ДОБРАТЬСЯ</p>
                <p className="serif text-sm opacity-60">~120 км от Москвы по Симферопольскому шоссе</p>
              </div>
            </div>
          </div>
        </Section>
      </section>

      {/* ── ТАЙМИНГ ── */}
      <section className="py-12 px-6" id="timeline">
        <Section>
          <Ornament />
          <div className="max-w-md mx-auto">
            <p className="handwriting text-center text-xl mb-2" style={{ color: "var(--wine)" }}>Как пройдёт день</p>
            <h2 className="serif text-center text-3xl font-light mb-8">Тайминг торжества</h2>
            <div className="relative pl-8">
              <div className="absolute left-3 top-2 bottom-2 w-px" style={{ background: "rgba(139,26,46,0.2)" }}></div>
              {timeline.map((item, i) => (
                <div key={i} className="relative mb-6 flex items-start gap-4">
                  <div className="timeline-dot absolute -left-[14px] mt-1"></div>
                  <div className="serif-sc text-xs tracking-wider pt-0.5 min-w-[52px]" style={{ color: "var(--wine)" }}>{item.time}</div>
                  <div className="serif text-base">{item.event}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </section>

      {/* ── ДРЕСС-КОД ── */}
      <section className="py-12 px-6" id="dresscode">
        <Section>
          <Ornament />
          <div className="max-w-lg mx-auto text-center">
            <p className="handwriting text-xl mb-3" style={{ color: "var(--wine)" }}>Как одеться</p>
            <h2 className="serif text-3xl font-light mb-4">Дресс-код</h2>
            <p className="serif text-base opacity-70 mb-8 leading-relaxed">
              Мы будем рады, если вы поддержите нашу палитру — нежные тёплые оттенки.<br />
              Пожалуйста, избегайте белого и чёрного цвета.
            </p>
            <div className="flex justify-center gap-5 flex-wrap mb-6">
              {dresscodes.map(({ color, name }) => (
                <div key={name} className="flex flex-col items-center gap-2">
                  <div className="color-swatch" style={{ background: color }}></div>
                  <span className="serif text-xs opacity-60">{name}</span>
                </div>
              ))}
            </div>
            <p className="handwriting text-sm opacity-50">«Элегантно и нежно — именно так»</p>
          </div>
        </Section>
      </section>

      {/* ── ОБРАТНЫЙ ОТСЧЁТ ── */}
      <section className="py-16 px-6" id="countdown">
        <Section>
          <Ornament />
          <div className="max-w-lg mx-auto text-center">
            <p className="handwriting text-xl mb-6" style={{ color: "var(--wine)" }}>До нашего дня осталось</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <CountdownBlock value={countdown.days} label="дней" />
              <div className="serif text-3xl font-light self-center opacity-30">:</div>
              <CountdownBlock value={countdown.hours} label="часов" />
              <div className="serif text-3xl font-light self-center opacity-30">:</div>
              <CountdownBlock value={countdown.minutes} label="минут" />
              <div className="serif text-3xl font-light self-center opacity-30">:</div>
              <CountdownBlock value={countdown.seconds} label="секунд" />
            </div>
          </div>
        </Section>
      </section>

      {/* ── ПОЖЕЛАНИЯ ── */}
      <section className="py-12 px-6" id="wishes">
        <Section>
          <Ornament />
          <div className="max-w-lg mx-auto">
            <p className="handwriting text-center text-xl mb-3" style={{ color: "var(--wine)" }}>Скажите нам что-то тёплое</p>
            <h2 className="serif text-center text-3xl font-light mb-8">Пожелания</h2>
            {wishesSent ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-4">💌</p>
                <p className="serif text-lg">Спасибо! Ваши слова согреют нам сердце.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setWishesSent(true); }} className="flex flex-col gap-4">
                <input
                  className="wedding-input"
                  placeholder="Ваше имя"
                  value={wishName}
                  onChange={e => setWishName(e.target.value)}
                  required
                />
                <textarea
                  className="wedding-input"
                  placeholder="Ваши пожелания молодожёнам..."
                  rows={4}
                  value={wishes}
                  onChange={e => setWishes(e.target.value)}
                  required
                  style={{ resize: "vertical" }}
                />
                <button type="submit" className="wedding-btn">Отправить пожелание</button>
              </form>
            )}
          </div>
        </Section>
      </section>

      {/* ── АНКЕТА ГОСТЯ ── */}
      <section className="py-12 px-6" id="rsvp">
        <Section>
          <Ornament />
          <div className="max-w-lg mx-auto">
            <p className="handwriting text-center text-xl mb-3" style={{ color: "var(--wine)" }}>Ждём вашего ответа</p>
            <h2 className="serif text-center text-3xl font-light mb-2">Подтверждение присутствия</h2>
            <p className="serif text-center text-base opacity-60 mb-8">Пожалуйста, заполните до 1 августа 2026</p>
            {rsvpSent ? (
              <div className="text-center py-8 bg-white shadow-md p-8">
                <p className="text-4xl mb-4">🥂</p>
                <p className="serif text-lg">Замечательно! Мы вас ждём.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setRsvpSent(true); }}
                className="bg-white p-8 shadow-md flex flex-col gap-5"
                style={{ border: "1px solid rgba(139,26,46,0.1)" }}
              >
                <div className="flex flex-col gap-1">
                  <label className="serif-sc text-xs tracking-wider opacity-60">ИМЯ И ФАМИЛИЯ</label>
                  <input
                    className="wedding-input"
                    placeholder="Иван Петров"
                    value={rsvp.name}
                    onChange={e => setRsvp({ ...rsvp, name: e.target.value })}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="serif-sc text-xs tracking-wider opacity-60">ВЫ ПРИДЁТЕ?</label>
                  <div className="flex gap-6 flex-wrap">
                    {[["yes", "Да, буду!"], ["no", "К сожалению, нет"]] .map(([val, label]) => (
                      <label key={val} className="flex items-center gap-2 cursor-pointer serif text-base">
                        <input
                          type="radio"
                          name="attending"
                          value={val}
                          checked={rsvp.attending === val}
                          onChange={e => setRsvp({ ...rsvp, attending: e.target.value })}
                          required
                          style={{ accentColor: "var(--wine)" }}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="serif-sc text-xs tracking-wider opacity-60">КОЛ-ВО ГОСТЕЙ</label>
                  <select
                    className="wedding-input"
                    value={rsvp.guests}
                    onChange={e => setRsvp({ ...rsvp, guests: e.target.value })}
                  >
                    {["1", "2", "3"].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="serif-sc text-xs tracking-wider opacity-60">ПИЩЕВЫЕ ОГРАНИЧЕНИЯ</label>
                  <input
                    className="wedding-input"
                    placeholder="Вегетарианец, аллергия и т.д."
                    value={rsvp.dietary}
                    onChange={e => setRsvp({ ...rsvp, dietary: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="serif-sc text-xs tracking-wider opacity-60">ЛЮБИМАЯ ПЕСНЯ ДЛЯ ТАНЦПОЛА</label>
                  <input
                    className="wedding-input"
                    placeholder="Название и исполнитель"
                    value={rsvp.song}
                    onChange={e => setRsvp({ ...rsvp, song: e.target.value })}
                  />
                </div>

                <button type="submit" className="wedding-btn mt-2">Подтвердить присутствие</button>
              </form>
            )}
          </div>
        </Section>
      </section>

      {/* ── ГАЛЕРЕЯ ── */}
      <section className="py-12 px-6" id="gallery">
        <Section>
          <Ornament />
          <p className="handwriting text-center text-xl mb-3" style={{ color: "var(--wine)" }}>Наша история</p>
          <h2 className="serif text-center text-3xl font-light mb-8">Фотогалерея</h2>
          <div className="max-w-2xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((item, i) => (
              <div
                key={i}
                className="gallery-item polaroid"
                style={{ transform: `rotate(${(i % 3 - 1) * 1.5}deg)`, transition: "transform 0.3s" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "rotate(0deg) scale(1.04)")}
                onMouseLeave={e => (e.currentTarget.style.transform = `rotate(${(i % 3 - 1) * 1.5}deg)`)}
              >
                <img src={item.src} alt={item.label} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
                <span className="polaroid-label handwriting text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16 px-6 text-center" style={{ borderTop: "1px solid rgba(139,26,46,0.1)", marginTop: "3rem" }}>
        <Ornament />
        <p className="serif font-light mb-2" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", color: "var(--wine)" }}>
          Богдан <span style={{ fontStyle: "italic" }}>&</span> Эльвира
        </p>
        <p className="handwriting text-lg opacity-60">26 · 08 · 2026</p>
        <p className="serif text-sm opacity-40 mt-6">С любовью и нетерпением ждём вас ♥</p>
      </footer>
    </div>
  );
}