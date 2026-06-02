import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const WEDDING_DATE = new Date("2026-08-26T14:00:00");

const COUPLE_PHOTO = "https://cdn.poehali.dev/projects/166d446d-8a02-41d9-8496-f23587488617/bucket/d0b921d3-db34-4d68-917a-982349ade069.jpg";
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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Фото выезжает вниз: при scrollY=0 торчит на 20px, полностью выезжает к scrollY~320
  const photoSlot = 280; // высота фото
  const initialPeek = 20; // сколько видно изначально
  const eject = Math.min(scrollY * 0.85, photoSlot - initialPeek);
  const photoTranslateY = -(photoSlot - initialPeek - eject);

  return (
    <div className="min-h-screen" style={{ background: "var(--paper)" }}>

      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 py-16">
        <div className="fade-in-up text-center mb-8">
          <p className="handwriting text-xl mb-4" style={{ color: "var(--wine)" }}>Это мы ↓</p>

          {/* Polaroid camera + выезжающее фото */}
          <div className="relative mx-auto" style={{ width: 280 }}>

            {/* Корпус поляроида */}
            <div style={{
              background: "#f2f0ec",
              borderRadius: "14px 14px 4px 4px",
              padding: "14px 16px 0 16px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.1)",
              position: "relative",
              zIndex: 10,
            }}>
              {/* Верхняя панель: вспышка + объектив + видоискатель */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, padding: "0 4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {/* Вспышка */}
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #e8e8e8, #aaa)", border: "3px solid #999", boxShadow: "inset 0 1px 4px rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.2)" }} />
                  {/* Красная кнопка */}
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #e84455, #aa1122)", boxShadow: "0 2px 6px rgba(0,0,0,0.35)" }} />
                </div>
                {/* Объектив */}
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #1a3a6b 0%, #050a1a 70%)", border: "5px solid #555", boxShadow: "0 4px 14px rgba(0,0,0,0.55), inset 0 2px 6px rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, #2a55cc 0%, #020410 80%)", border: "2px solid #333" }} />
                </div>
                {/* Видоискатель */}
                <div style={{ width: 30, height: 22, background: "#1a1a1a", borderRadius: "4px", border: "2px solid #666", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.8)" }} />
              </div>
              {/* Лейбл polaroid */}
              <p style={{ fontFamily: "Georgia, serif", fontSize: "0.65rem", color: "#999", letterSpacing: "0.15em", textAlign: "center", marginBottom: 10, fontStyle: "italic" }}>polaroid</p>
              {/* Щель выхода */}
              <div style={{ height: 14, background: "linear-gradient(to bottom, #c8c4bc, #dedad4)", borderTop: "1px solid #bbb", margin: "0 -16px" }} />
            </div>

            {/* Фото — выезжает из щели вниз при скролле */}
            <div style={{ overflow: "hidden", position: "relative", zIndex: 5 }}>
              <div style={{
                transform: `translateY(${photoTranslateY}px)`,
                willChange: "transform",
              }}>
                <div style={{
                  background: "#fff",
                  padding: "8px 8px 44px 8px",
                  boxShadow: "0 6px 28px rgba(0,0,0,0.18)",
                  width: 280,
                  boxSizing: "border-box",
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
          </div>
        </div>

        <div className="fade-in-up delay-300 text-center">
          <h1 className="serif" style={{ fontSize: "clamp(2.8rem, 8vw, 5rem)", fontWeight: 300, letterSpacing: "0.04em", lineHeight: 1.1, color: "var(--ink)" }}>
            Богдан <span style={{ color: "var(--wine)", fontStyle: "italic" }}>&</span> Эльвира
          </h1>
          <p className="serif-sc text-sm tracking-[0.25em] mt-4 opacity-60">ПРИГЛАШАЮТ ВАС НА СВОЮ СВАДЬБУ</p>
        </div>

        <div className="fade-in-up delay-500 mt-10 text-center">
          <p className="serif font-light" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", color: "var(--wine)" }}>26 августа 2026</p>
          <p className="handwriting text-base mt-2 opacity-60">Заокский район, Тульская область</p>
        </div>

        <div className="fade-in-up delay-700 mt-16 flex flex-col items-center gap-2">
          <p className="serif-sc text-xs tracking-widest opacity-50">ЛИСТАЙТЕ ВНИЗ</p>
          <div className="bounce-slow" style={{ color: "var(--wine)" }}>
            <Icon name="ChevronDown" size={20} />
          </div>
        </div>

        <div className="absolute top-12 right-8 handwriting text-5xl opacity-10 select-none" style={{ color: "var(--wine)", transform: "rotate(15deg)" }}>♥</div>
        <div className="absolute bottom-20 left-6 handwriting text-4xl opacity-10 select-none" style={{ color: "var(--wine)", transform: "rotate(-10deg)" }}>✦</div>
      </section>

      {/* ── ДАТА ── */}
      <section className="py-16 px-6" id="date">
        <Section>
          <Ornament />
          <div className="max-w-lg mx-auto">
            {/* Заголовок — рукописный как на референсе */}
            <h2 className="handwriting text-center mb-6" style={{ fontSize: "clamp(2.6rem, 9vw, 4.5rem)", color: "var(--ink)", lineHeight: 1.1 }}>
              Дорогие друзья!
            </h2>
            {/* Текст печатной машинкой */}
            <p className="text-center mb-12 leading-relaxed" style={{
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
              color: "var(--ink)",
              letterSpacing: "0.04em",
              opacity: 0.85,
            }}>
              Это официальное приглашение на нашу свадьбу!<br />
              А получили вы его потому, что мы очень<br />
              хотим видеть вас в этот день рядом с нами!
            </p>

            {/* Цифры даты столбиком с пометками */}
            <div className="relative flex justify-center">
              {/* Левая пометка */}
              <div className="absolute left-0 bottom-8 flex flex-col items-start">
                <p className="handwriting" style={{ fontSize: "1.4rem", color: "var(--wine)", transform: "rotate(-4deg)", lineHeight: 1.2 }}>
                  Сохраните<br />дату
                </p>
                <svg width="50" height="28" viewBox="0 0 50 28" fill="none" style={{ marginTop: 2, marginLeft: 20 }}>
                  <path d="M2 4 Q12 16 30 18 Q42 19 48 24" stroke="#8B1A2E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                  <path d="M42 20 L48 24 L44 28" stroke="#8B1A2E" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Правая пометка */}
              <div className="absolute right-0 top-4 flex flex-col items-end">
                <p className="handwriting" style={{ fontSize: "1.4rem", color: "var(--wine)", transform: "rotate(3deg)", lineHeight: 1.2, textAlign: "right" }}>
                  Ждём вас в<br />наш день!
                </p>
                <svg width="44" height="28" viewBox="0 0 44 28" fill="none" style={{ marginTop: 2, marginRight: 16 }}>
                  <path d="M42 4 Q30 14 16 18 Q8 20 4 24" stroke="#8B1A2E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                  <path d="M4 24 Q10 16 14 22" stroke="#8B1A2E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                </svg>
              </div>

              {/* Цифры столбиком */}
              <div className="flex flex-col items-center" style={{ gap: 0 }}>
                {/* 26 */}
                <span style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: "clamp(5rem, 18vw, 9rem)",
                  fontWeight: 700,
                  color: "var(--ink)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                }}>26</span>
                {/* разделитель */}
                <span style={{ fontFamily: "'Caveat', cursive", fontSize: "2.5rem", color: "var(--ink)", opacity: 0.5, lineHeight: 0.8 }}>|</span>
                {/* 08 */}
                <span style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: "clamp(5rem, 18vw, 9rem)",
                  fontWeight: 700,
                  color: "var(--ink)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                }}>08</span>
                {/* разделитель */}
                <span style={{ fontFamily: "'Caveat', cursive", fontSize: "2.5rem", color: "var(--ink)", opacity: 0.5, lineHeight: 0.8 }}>|</span>
                {/* 26 */}
                <span style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: "clamp(5rem, 18vw, 9rem)",
                  fontWeight: 700,
                  color: "var(--ink)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                }}>26</span>
                {/* нижний разделитель */}
                <span style={{ fontFamily: "'Caveat', cursive", fontSize: "2.5rem", color: "var(--ink)", opacity: 0.5, lineHeight: 0.8 }}>|</span>
              </div>
            </div>
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