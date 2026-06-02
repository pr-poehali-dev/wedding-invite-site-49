import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const WEDDING_DATE = new Date("2026-08-26T14:00:00");

const COUPLE_PHOTO = "https://cdn.poehali.dev/projects/166d446d-8a02-41d9-8496-f23587488617/bucket/d0b921d3-db34-4d68-917a-982349ade069.jpg";
const BRIDE_CHILD = "https://cdn.poehali.dev/projects/166d446d-8a02-41d9-8496-f23587488617/bucket/2765b74f-42c8-45ad-9c07-5afbd85f400d.jpg";
const GROOM_CHILD = "https://cdn.poehali.dev/projects/166d446d-8a02-41d9-8496-f23587488617/bucket/c63801be-650d-413e-9c9a-7ec9fb61c821.jpg";

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

const wishTexts = [
  "Мы с теплотой относимся к детям любого возраста. Но для свадьбы выбрали формат 18+.",
  "Пожалуйста, не дарите нам цветы! Мы не успеем насладиться их красотой и ароматом. Если хотите подарить нам ценный и нужный подарок, мы будем очень благодарны за вклад в бюджет нашей молодой семьи.",
  "Будем очень признательны, если Вы воздержитесь от криков «Горько». Ведь поцелуй — это знак выражения чувств, и он не может быть по заказу.",
];

function WishesSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = (next: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(next);
      setAnimating(false);
    }, 250);
  };
  const prev = () => go((current - 1 + wishTexts.length) % wishTexts.length);
  const next = () => go((current + 1) % wishTexts.length);

  return (
    <div className="max-w-lg mx-auto">
      {/* Заголовок — статичный */}
      <div className="relative mb-2">
        <p className="handwriting" style={{ color: "var(--wine)", fontSize: "1.2rem", position: "absolute", top: 0, left: 0 }}>
          Мы бы<br />хотели...
        </p>
        <svg width="44" height="30" viewBox="0 0 44 30" fill="none" style={{ position: "absolute", top: 8, left: 90 }}>
          <path d="M2 4 Q14 20 30 22 Q38 23 42 26" stroke="#8B1A2E" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
          <path d="M36 22 L42 26 L38 30" stroke="#8B1A2E" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h2 className="handwriting text-center" style={{ fontSize: "clamp(2.4rem, 8vw, 3.8rem)", color: "var(--ink)", paddingTop: 48, lineHeight: 1.1 }}>
          Пожелания
        </h2>
      </div>

      {/* Текст + стрелки */}
      <div className="relative flex items-center gap-4 mt-8" style={{ minHeight: 160 }}>
        {/* Стрелка влево */}
        <button onClick={prev} aria-label="Назад" style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0, padding: "4px 0" }}>
          <svg width="36" height="20" viewBox="0 0 36 20" fill="none">
            <path d="M34 10 L4 10 M12 2 L2 10 L12 18" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Текст */}
        <p
          key={current}
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: "clamp(0.8rem, 2.4vw, 1rem)",
            color: "var(--ink)",
            lineHeight: 1.85,
            textAlign: "center",
            opacity: animating ? 0 : 1,
            transition: "opacity 0.25s ease",
            flex: 1,
          }}
        >
          {wishTexts[current]}
        </p>

        {/* Стрелка вправо */}
        <button onClick={next} aria-label="Вперёд" style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0, padding: "4px 0" }}>
          <svg width="36" height="20" viewBox="0 0 36 20" fill="none">
            <path d="M2 10 L32 10 M24 2 L34 10 L24 18" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Точки-индикаторы */}
      <div className="flex justify-center gap-2 mt-6">
        {wishTexts.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            style={{
              width: 8, height: 8,
              borderRadius: "50%",
              background: i === current ? "var(--wine)" : "rgba(139,26,46,0.25)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "background 0.2s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

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
      <section className="py-16 px-6" id="childhood">
        <Section>
          <Ornament />
          <div className="mx-auto" style={{ maxWidth: 520 }}>

            {/* Два поляроида рядом — жених слева, невеста справа */}
            <div className="flex justify-center gap-4">

              {/* Невеста — наклон влево */}
              <div style={{ transform: "rotate(-4deg)", transition: "transform 0.3s", flexShrink: 0 }}
                onMouseEnter={e => (e.currentTarget.style.transform = "rotate(0deg) scale(1.03)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "rotate(-4deg)")}
              >
                <div style={{ background: "#fff", padding: "8px 8px 20px 8px", boxShadow: "0 4px 22px rgba(0,0,0,0.15)", width: 210 }}>
                  <img src="https://cdn.poehali.dev/projects/166d446d-8a02-41d9-8496-f23587488617/bucket/105ebe81-ba7d-4376-b252-7d18e8fdd101.jpg" alt="Маленькая Эльвира" style={{ width: "100%", height: 250, objectFit: "cover", objectPosition: "top", display: "block" }} />
                </div>
              </div>

              {/* Жених — наклон вправо */}
              <div style={{ transform: "rotate(3.5deg)", transition: "transform 0.3s", flexShrink: 0, marginTop: 32 }}
                onMouseEnter={e => (e.currentTarget.style.transform = "rotate(0deg) scale(1.03)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "rotate(3.5deg)")}
              >
                <div style={{ background: "#fff", padding: "8px 8px 20px 8px", boxShadow: "0 4px 22px rgba(0,0,0,0.15)", width: 210 }}>
                  <img src="https://cdn.poehali.dev/projects/166d446d-8a02-41d9-8496-f23587488617/bucket/8391e7ce-d08a-406e-b202-d6171611e2f6.jpg" alt="Маленький Богдан" style={{ width: "100%", height: 250, objectFit: "cover", objectPosition: "top", display: "block" }} />
                </div>
              </div>
            </div>

            {/* Сердечко + надпись под фото */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <svg width="40" height="36" viewBox="0 0 48 44" fill="none">
                <path d="M24 38 C24 38 4 26 4 13 C4 7 8.5 3 14 3 C18 3 22 5.5 24 9 C26 5.5 30 3 34 3 C39.5 3 44 7 44 13 C44 26 24 38 24 38Z" fill="#8B1A2E" opacity="0.85"/>
              </svg>
              <p className="handwriting" style={{ fontSize: "1.6rem", color: "var(--wine)", lineHeight: 1.2, transform: "rotate(-1.5deg)" }}>
                Разделите с нами<br />этот момент
              </p>
            </div>

          </div>
        </Section>
      </section>

      {/* ── МЕСТО ── */}
      <section className="py-12 px-6" id="venue">
        <Section>
          <Ornament />
          <div className="max-w-lg mx-auto">
            {/* Заголовок — рукописный */}
            <h2 className="handwriting text-center mb-6" style={{ fontSize: "clamp(2.4rem, 8vw, 4rem)", color: "var(--ink)", lineHeight: 1.1 }}>
              Место проведения
            </h2>

            {/* Адрес — печатная машинка */}
            <p className="text-center mb-8" style={{
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "clamp(0.78rem, 2.2vw, 0.95rem)",
              color: "var(--ink)",
              lineHeight: 1.9,
              opacity: 0.85,
            }}>
              Курорт Заокские Поля<br />
              Ресторан «Трапезная»<br />
              Тульская область, Заокский район,<br />
              муниципальное образование Малаховское
            </p>

            {/* Фото места */}
            <div style={{ position: "relative", marginBottom: 8 }}>
              <img
                src="https://cdn.poehali.dev/projects/166d446d-8a02-41d9-8496-f23587488617/bucket/7ea6b24d-0b24-479e-9a02-688b001513ce.jpg"
                alt="Курорт Заокские поля"
                style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
              />
              {/* Надпись поверх фото */}
              <div style={{ position: "absolute", bottom: -16, left: 16, zIndex: 10 }}>
                <p className="handwriting" style={{ fontSize: "1.6rem", color: "var(--wine)", transform: "rotate(-3deg)" }}>
                  Вы приглашены
                </p>
                {/* Стрелка */}
                <svg width="52" height="38" viewBox="0 0 52 38" fill="none" style={{ marginLeft: 30, marginTop: -4 }}>
                  <path d="M4 8 Q16 28 36 30 Q44 31 48 34" stroke="#8B1A2E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                  <path d="M42 30 L48 34 L44 38" stroke="#8B1A2E" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Кнопка "Как добраться" */}
            <div className="mt-12">
              <a
                href="https://yandex.ru/maps/?text=Курорт+Заокские+Поля+Тульская+область+Заокский+район"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  background: "var(--wine)",
                  color: "#fff",
                  textAlign: "center",
                  padding: "18px 24px",
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: "0.9rem",
                  letterSpacing: "0.18em",
                  textDecoration: "none",
                  transition: "background 0.2s, transform 0.1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#6B1222")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--wine)")}
              >
                КАК ДОБРАТЬСЯ
              </a>
            </div>
          </div>
        </Section>
      </section>

      {/* ── ТАЙМИНГ ── */}
      <section className="py-12 px-6" id="timeline">
        <Section>
          <Ornament />
          <div className="max-w-lg mx-auto">
            <img
              src="https://cdn.poehali.dev/projects/166d446d-8a02-41d9-8496-f23587488617/bucket/b6a70792-6694-4727-9068-1a989b21b507.jpg"
              alt="Тайминг торжества"
              style={{ width: "100%", display: "block" }}
            />
          </div>
        </Section>
      </section>

      {/* ── ДРЕСС-КОД ── */}
      <section className="py-12 px-6" id="dresscode">
        <Section>
          <Ornament />
          <div className="max-w-lg mx-auto flex flex-col gap-4">
            <img
              src="https://cdn.poehali.dev/projects/166d446d-8a02-41d9-8496-f23587488617/bucket/3a726b99-01e3-4c66-9ac0-75f6850c4b00.jpg"
              alt="Дресс-код"
              style={{ width: "100%", display: "block" }}
            />
            <img
              src="https://cdn.poehali.dev/projects/166d446d-8a02-41d9-8496-f23587488617/bucket/6e9e8fca-edd3-494f-9970-1f163728ab28.jpg"
              alt="Дресс-код мужской"
              style={{ width: "100%", display: "block" }}
            />
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
          <WishesSlider />
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
          <div className="max-w-sm mx-auto text-center">
            {/* Заголовок */}
            <p className="serif-sc text-xs tracking-widest opacity-50 mb-2">До скорой встречи! С любовью</p>
            <h2 className="handwriting mb-8" style={{ fontSize: "clamp(2.8rem, 10vw, 4.5rem)", color: "var(--ink)", lineHeight: 1.05 }}>
              Богдан<br /><span style={{ color: "var(--wine)" }}>&amp; Эльвира</span>
            </h2>

            {/* Поляроид со скрепкой */}
            <div className="relative inline-block">
              {/* Скрепка */}
              <div style={{ display: "flex", justifyContent: "center", position: "relative", zIndex: 10, marginBottom: -6 }}>
                <svg width="22" height="36" viewBox="0 0 22 36" fill="none">
                  <path d="M11 2 L11 34 M7 2 Q3 2 3 8 L3 28 Q3 34 11 34 Q19 34 19 28 L19 8 Q19 2 15 2 L7 2Z" stroke="#c8a882" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                </svg>
              </div>
              {/* Фото в рамке поляроида */}
              <div
                style={{
                  background: "#fff",
                  padding: "10px 10px 52px 10px",
                  boxShadow: "0 6px 32px rgba(0,0,0,0.16)",
                  transform: "rotate(-2deg)",
                  transition: "transform 0.3s",
                  display: "inline-block",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "rotate(0deg) scale(1.02)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "rotate(-2deg)")}
              >
                <img
                  src="https://cdn.poehali.dev/projects/166d446d-8a02-41d9-8496-f23587488617/bucket/19b579fa-4673-4e6f-9e9a-a9ca4a6c365a.jpg"
                  alt="Богдан и Эльвира"
                  style={{ width: 280, height: 320, objectFit: "cover", display: "block" }}
                />
              </div>
            </div>

            {/* Сердечко */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8, paddingRight: 16 }}>
              <svg width="44" height="40" viewBox="0 0 48 44" fill="none">
                <path d="M24 38 C24 38 4 26 4 13 C4 7 8.5 3 14 3 C18 3 22 5.5 24 9 C26 5.5 30 3 34 3 C39.5 3 44 7 44 13 C44 26 24 38 24 38Z" fill="#8B1A2E" opacity="0.85"/>
              </svg>
            </div>
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