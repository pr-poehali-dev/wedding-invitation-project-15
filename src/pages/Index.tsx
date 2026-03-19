import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const WEDDING_DATE = new Date("2026-09-12T15:00:00");
const FLORAL_IMAGE =
  "https://cdn.poehali.dev/projects/2c19be70-82ff-4474-942e-2256ab01f504/files/8378822f-41cf-4d8c-a792-3da821e0fbd6.jpg";

function useCountdown(target: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function useIntersection(ref: React.RefObject<Element>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useIntersection(ref as React.RefObject<Element>);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <div className="h-px w-24" style={{ background: "var(--blue-light)" }} />
      <span style={{ color: "var(--pink-accent)", fontSize: "1.1rem" }}>✿</span>
      <div className="h-px w-24" style={{ background: "var(--blue-light)" }} />
    </div>
  );
}

export default function Index() {
  const countdown = useCountdown(WEDDING_DATE);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [form, setForm] = useState({ name: "", guests: "1", menu: "", comment: "", attend: "" });
  const [submitted, setSubmitted] = useState(false);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen font-montserrat" style={{ background: "var(--bg-cream)" }}>
      <audio ref={audioRef} loop>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
      </audio>

      {/* Music toggle */}
      <button
        onClick={toggleMusic}
        className="fixed top-5 right-5 z-50 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        style={{ background: "var(--blue-light)", color: "var(--blue-deep)" }}
        title={playing ? "Выключить музыку" : "Включить музыку"}
      >
        <Icon name={playing ? "Volume2" : "VolumeX"} size={18} />
      </button>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={FLORAL_IMAGE} alt="" className="w-full h-full object-cover opacity-25" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(240,248,255,0.55) 0%, rgba(255,248,252,0.80) 55%, var(--bg-cream) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <p
            className="uppercase tracking-[0.45em] text-xs mb-7"
            style={{ color: "var(--blue-mid)" }}
          >
            Вы приглашены
          </p>

          <h1
            className="font-cormorant my-2 py-[5px]"
            style={{
              fontSize: "clamp(3rem, 10vw, 6.5rem)",
              lineHeight: 1.05,
              color: "var(--blue-deep)",
              fontWeight: 300,
              fontStyle: "italic",
            }}
          >
            Елизавета
            <br />&amp;<br />
            Сергей
          </h1>

          <div className="flex items-center justify-center mb-8 mt-4">
            <svg width="90" height="48" viewBox="0 0 90 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="30" cy="24" r="18" stroke="#c8849a" strokeWidth="3" fill="none"/>
              <circle cx="60" cy="24" r="18" stroke="#4a7096" strokeWidth="3" fill="none"/>
              <path d="M45 14 Q45 24 45 34" stroke="#c8849a" strokeWidth="1" strokeDasharray="2 2" opacity="0.4"/>
            </svg>
          </div>

          <p
            className="font-cormorant text-2xl mb-2"
            style={{ color: "var(--blue-mid)", fontStyle: "italic" }}
          >
            12 сентября 2026
          </p>
          <p className="text-xs tracking-widest uppercase mb-10" style={{ color: "var(--text-muted)" }}>
            Начало в 15:00 · Москва
          </p>

          <a
            href="#rsvp"
            className="inline-block px-10 py-3 rounded-full text-xs tracking-[0.25em] uppercase font-medium transition-all hover:opacity-80 hover:scale-105"
            style={{ background: "var(--blue-deep)", color: "#fff" }}
          >
            Подтвердить участие
          </a>
        </div>

        <a
          href="#greeting"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce"
          style={{ color: "var(--blue-mid)" }}
        >
          <Icon name="ChevronDown" size={28} />
        </a>
      </section>

      {/* ── ПРИВЕТСТВИЕ ── */}
      <section id="greeting" className="py-20 px-6">
        <Section className="max-w-xl mx-auto text-center">
          <p className="uppercase tracking-[0.3em] text-xs mb-6" style={{ color: "var(--pink-accent)" }}>
            Приветствие
          </p>
          <p
            className="font-cormorant text-2xl leading-relaxed mb-6"
            style={{ color: "var(--blue-deep)", fontStyle: "italic" }}
          >
            «Самое прекрасное в жизни — это когда два сердца находят друг друга и решают идти одним путём»
          </p>
          <p className="text-sm leading-7" style={{ color: "var(--text-muted)" }}>
            Дорогие друзья и близкие! Мы счастливы пригласить вас разделить с нами один из самых важных дней
            нашей жизни. Ваше присутствие сделает этот праздник поистине незабываемым.
          </p>
        </Section>
      </section>

      <Divider />

      {/* ── МУЗЫКА ── */}
      <section className="py-16 px-6" style={{ background: "var(--blue-section)" }}>
        <Section className="max-w-xl mx-auto text-center">
          <p className="uppercase tracking-[0.3em] text-xs mb-6" style={{ color: "var(--blue-mid)" }}>
            Музыка вечера
          </p>
          <div
            className="rounded-2xl p-8 shadow-sm flex flex-col items-center gap-4"
            style={{ background: "#fff", border: "1px solid var(--blue-border)" }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "var(--blue-section)" }}
            >
              <Icon name="Music" size={28} style={{ color: "var(--blue-deep)" }} />
            </div>
            <p className="font-cormorant text-xl" style={{ color: "var(--blue-deep)" }}>
              Наша любимая мелодия
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Нажмите кнопку в правом верхнем углу, чтобы включить музыку приглашения
            </p>
            <button
              onClick={toggleMusic}
              className="px-8 py-3 rounded-full text-xs uppercase tracking-widest transition-all hover:opacity-80"
              style={{ background: "var(--blue-deep)", color: "#fff" }}
            >
              {playing ? "⏸ Пауза" : "▶ Слушать"}
            </button>
          </div>
        </Section>
      </section>

      <Divider />

      {/* ── ВСТУПЛЕНИЕ ── */}
      <section className="py-20 px-6">
        <Section className="max-w-3xl mx-auto">
          <p className="uppercase tracking-[0.3em] text-xs mb-6 text-center" style={{ color: "var(--pink-accent)" }}>
            Вступление
          </p>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2
                className="font-cormorant text-4xl mb-5 font-light"
                style={{ color: "var(--blue-deep)" }}
              >
                История нашей любви
              </h2>
              <p className="text-sm leading-7 mb-4" style={{ color: "var(--text-muted)" }}>
                Мы встретились тихим осенним вечером, когда мир, казалось, замедлился специально для нас. С тех
                пор каждый день наполнен теплом, смехом и безграничной любовью.
              </p>
              <p className="text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                Три года вместе — и впереди целая жизнь. Мы хотим отметить начало нашего общего пути в
                окружении самых близких людей.
              </p>
            </div>
            <div className="relative">
              <div
                className="rounded-2xl overflow-hidden shadow-lg"
                style={{ border: "4px solid var(--blue-light)" }}
              >
                <img src={FLORAL_IMAGE} alt="цветы" className="w-full h-64 object-cover" />
              </div>
              <div
                className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full flex items-center justify-center shadow-md"
                style={{ background: "var(--pink-soft)", border: "3px solid #fff" }}
              >
                <span style={{ color: "var(--pink-accent)", fontSize: "1.8rem" }}>♡</span>
              </div>
            </div>
          </div>
        </Section>
      </section>

      <Divider />

      {/* ── ТАЙМЕР ── */}
      <section className="py-20 px-6" style={{ background: "var(--blue-section)" }}>
        <Section className="max-w-xl mx-auto text-center">
          <p className="uppercase tracking-[0.3em] text-xs mb-10" style={{ color: "var(--blue-mid)" }}>
            До торжества осталось
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { label: "Дней", value: countdown.days },
              { label: "Часов", value: countdown.hours },
              { label: "Минут", value: countdown.minutes },
              { label: "Секунд", value: countdown.seconds },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm mb-2"
                  style={{ background: "#fff", border: "2px solid var(--blue-border)" }}
                >
                  <span
                    className="font-cormorant text-4xl font-light"
                    style={{ color: "var(--blue-deep)" }}
                  >
                    {String(value).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* ── КАЛЕНДАРЬ ── */}
      <section className="py-20 px-6">
        <Section className="max-w-sm mx-auto text-center">
          <p className="uppercase tracking-[0.3em] text-xs mb-8" style={{ color: "var(--pink-accent)" }}>
            Дата
          </p>
          <div
            className="rounded-3xl overflow-hidden shadow-md"
            style={{ border: "1px solid var(--blue-border)" }}
          >
            <div className="py-4" style={{ background: "var(--blue-deep)" }}>
              <p className="text-white uppercase tracking-widest text-sm font-light">Сентябрь 2026</p>
            </div>
            <div className="py-10 px-8" style={{ background: "#fff" }}>
              <div
                className="inline-flex items-center justify-center w-28 h-28 rounded-full mb-4"
                style={{ background: "var(--blue-section)", border: "2px solid var(--blue-border)" }}
              >
                <span
                  className="font-cormorant text-6xl font-light"
                  style={{ color: "var(--blue-deep)" }}
                >
                  12
                </span>
              </div>
              <p
                className="font-cormorant text-2xl mb-2 font-light"
                style={{ color: "var(--blue-deep)" }}
              >
                Суббота
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Регистрация в 14:30
                <br />
                Начало торжества в 15:00
              </p>
            </div>
          </div>
        </Section>
      </section>

      <Divider />

      {/* ── МЕСТО ── */}
      <section className="py-20 px-6" style={{ background: "var(--blue-section)" }}>
        <Section className="max-w-2xl mx-auto text-center">
          <p className="uppercase tracking-[0.3em] text-xs mb-6" style={{ color: "var(--blue-mid)" }}>
            Место проведения
          </p>
          <h2 className="font-cormorant text-4xl mb-3 font-light" style={{ color: "var(--blue-deep)" }}>
            Усадьба «Романтика»
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            Московская область, Одинцовский район, д. Лесные Поляны, 15
          </p>
          <div className="flex justify-center gap-8 flex-wrap">
            {[
              { icon: "Car", text: "Парковка" },
              { icon: "UtensilsCrossed", text: "Банкет" },
              { icon: "Trees", text: "Парк" },
              { icon: "Music", text: "Живая музыка" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: "#fff", border: "1px solid var(--blue-border)" }}
                >
                  <Icon name={icon} size={20} style={{ color: "var(--blue-deep)" }} />
                </div>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* ── КАРТА ── */}
      <section className="py-16 px-6">
        <Section className="max-w-2xl mx-auto">
          <p className="uppercase tracking-[0.3em] text-xs mb-6 text-center" style={{ color: "var(--pink-accent)" }}>
            Карта
          </p>
          <div
            className="rounded-2xl overflow-hidden shadow-md"
            style={{ border: "2px solid var(--blue-border)", height: 280 }}
          >
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=37.218810%2C55.697987&z=12&l=map"
              width="100%"
              height="280"
              frameBorder="0"
              title="Карта"
              style={{ border: 0, display: "block" }}
            />
          </div>
          <p className="text-center text-xs mt-3" style={{ color: "var(--text-muted)" }}>
            Точный адрес отправим после подтверждения участия
          </p>
        </Section>
      </section>

      <Divider />

      {/* ── ПРОГРАММА ── */}
      <section className="py-20 px-6" style={{ background: "var(--blue-section)" }}>
        <Section className="max-w-lg mx-auto">
          <p className="uppercase tracking-[0.3em] text-xs mb-10 text-center" style={{ color: "var(--blue-mid)" }}>
            Программа дня
          </p>
          <div className="relative">
            <div
              className="absolute left-5 top-0 bottom-0 w-px"
              style={{ background: "var(--blue-border)" }}
            />
            {[
              { time: "14:30", title: "Сбор гостей", desc: "Встреча и регистрация" },
              { time: "15:00", title: "Церемония", desc: "Торжественная роспись, обмен клятвами" },
              { time: "16:00", title: "Фотосессия", desc: "Прогулка по парку усадьбы" },
              { time: "17:00", title: "Банкет", desc: "Торжественный ужин с живой музыкой" },
              { time: "20:00", title: "Танцевальная программа", desc: "Первый танец, дискотека" },
              { time: "00:00", title: "Финальный фейерверк", desc: "Незабываемое завершение вечера" },
            ].map(({ time, title, desc }, i) => (
              <div key={i} className="flex gap-6 mb-8">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center z-10 shadow-sm flex-shrink-0"
                  style={{ background: "#fff", border: "2px solid var(--blue-deep)" }}
                >
                  <span
                    className="font-cormorant text-sm font-bold"
                    style={{ color: "var(--blue-deep)" }}
                  >
                    {i + 1}
                  </span>
                </div>
                <div className="pb-2">
                  <p
                    className="text-xs mb-1 font-medium tracking-wider"
                    style={{ color: "var(--blue-mid)" }}
                  >
                    {time}
                  </p>
                  <p className="font-cormorant text-xl mb-0.5" style={{ color: "var(--blue-deep)" }}>
                    {title}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* ── ДРЕСС-КОД ── */}
      <section className="py-20 px-6">
        <Section className="max-w-xl mx-auto text-center">
          <p className="uppercase tracking-[0.3em] text-xs mb-6" style={{ color: "var(--pink-accent)" }}>
            Дресс-код
          </p>
          <h2 className="font-cormorant text-4xl mb-5 font-light" style={{ color: "var(--blue-deep)" }}>
            Пастельные тона
          </h2>
          <p className="text-sm leading-7 mb-8 max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
            Мы будем рады, если вы поддержите нашу цветовую палитру — нежные голубые, лавандовые, пудровые и
            кремовые оттенки. Просьба воздержаться от белого и ярких цветов.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {[
              { color: "#B8D4E8", label: "Голубой" },
              { color: "#D4B8E8", label: "Лаванда" },
              { color: "#E8D4C0", label: "Пудровый" },
              { color: "#B8E8D4", label: "Мятный" },
              { color: "#E8C0CC", label: "Розовый" },
            ].map(({ color, label }) => (
              <div key={color} className="flex flex-col items-center gap-1">
                <div
                  className="w-12 h-12 rounded-full shadow-md"
                  style={{ background: color, border: "3px solid #fff" }}
                />
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </section>

      <Divider />

      {/* ── ВОПРОСЫ ── */}
      <section className="py-20 px-6" style={{ background: "var(--blue-section)" }}>
        <Section className="max-w-2xl mx-auto">
          <p className="uppercase tracking-[0.3em] text-xs mb-8 text-center" style={{ color: "var(--blue-mid)" }}>
            Вопросы для гостей
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { q: "Какое ваше любимое воспоминание с нами?", icon: "Heart" },
              { q: "Какую песню хотели бы услышать на вечере?", icon: "Music" },
              { q: "Ваше пожелание молодожёнам в одном слове", icon: "Star" },
              { q: "Что вы думаете о браке и любви?", icon: "MessageCircle" },
            ].map(({ q, icon }) => (
              <div
                key={q}
                className="rounded-2xl p-5 shadow-sm"
                style={{ background: "#fff", border: "1px solid var(--blue-border)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center mb-3"
                  style={{ background: "var(--pink-soft)" }}
                >
                  <Icon name={icon} size={16} style={{ color: "var(--pink-accent)" }} />
                </div>
                <p className="text-sm leading-6" style={{ color: "var(--text-muted)" }}>
                  {q}
                </p>
                <p className="text-xs mt-3 italic" style={{ color: "var(--blue-mid)" }}>
                  Ответьте в форме ниже ✦
                </p>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* ── RSVP ── */}
      <section id="rsvp" className="py-20 px-6">
        <Section className="max-w-lg mx-auto">
          <p className="uppercase tracking-[0.3em] text-xs mb-4 text-center" style={{ color: "var(--pink-accent)" }}>
            Подтверждение
          </p>
          <h2
            className="font-cormorant text-4xl mb-8 text-center font-light"
            style={{ color: "var(--blue-deep)" }}
          >
            Форма участия
          </h2>

          {submitted ? (
            <div
              className="text-center py-14 rounded-3xl"
              style={{ background: "var(--blue-section)", border: "1px solid var(--blue-border)" }}
            >
              <div className="text-5xl mb-4">💌</div>
              <p
                className="font-cormorant text-2xl mb-3"
                style={{ color: "var(--blue-deep)" }}
              >
                Спасибо!
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Мы получили ваш ответ и будем рады видеть вас на нашем торжестве.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Имя */}
              <div>
                <label
                  className="block text-xs uppercase tracking-widest mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Ваше имя
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Имя и фамилия"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                  style={{
                    background: "var(--blue-section)",
                    border: "1px solid var(--blue-border)",
                    color: "var(--blue-deep)",
                  }}
                />
              </div>

              {/* Придёте? */}
              <div>
                <label
                  className="block text-xs uppercase tracking-widest mb-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  Придёте на торжество?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: "yes", label: "Да, буду!" },
                    { val: "no", label: "Не смогу" },
                  ].map(({ val, label }) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setForm({ ...form, attend: val })}
                      className="py-3 rounded-xl text-sm transition-all hover:scale-[1.02]"
                      style={{
                        background:
                          form.attend === val ? "var(--blue-deep)" : "#fff",
                        color:
                          form.attend === val ? "#fff" : "var(--blue-deep)",
                        border: `1px solid ${form.attend === val ? "var(--blue-deep)" : "var(--blue-border)"}`,
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Гости */}
              <div>
                <label
                  className="block text-xs uppercase tracking-widest mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Количество гостей
                </label>
                <select
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: "var(--blue-section)",
                    border: "1px solid var(--blue-border)",
                    color: "var(--blue-deep)",
                  }}
                >
                  {["1", "2", "3", "4", "5+"].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === "1" ? "гость" : n === "5+" ? "гостей" : "гостя"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Меню */}
              <div>
                <label
                  className="block text-xs uppercase tracking-widest mb-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  Выбор меню
                </label>
                <div className="space-y-2">
                  {[
                    { val: "meat", emoji: "🥩", label: "Мясное меню", desc: "Говядина / курица" },
                    { val: "fish", emoji: "🐟", label: "Рыбное меню", desc: "Лосось / морепродукты" },
                    { val: "veg", emoji: "🥗", label: "Вегетарианское", desc: "Без мяса и рыбы" },
                  ].map(({ val, emoji, label, desc }) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setForm({ ...form, menu: val })}
                      className="w-full px-4 py-3 rounded-xl text-left transition-all hover:scale-[1.01] flex items-center gap-3"
                      style={{
                        background:
                          form.menu === val ? "var(--blue-deep)" : "#fff",
                        border: `1px solid ${form.menu === val ? "var(--blue-deep)" : "var(--blue-border)"}`,
                      }}
                    >
                      <span className="text-xl">{emoji}</span>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: form.menu === val ? "#fff" : "var(--blue-deep)" }}
                        >
                          {label}
                        </p>
                        <p
                          className="text-xs"
                          style={{
                            color:
                              form.menu === val
                                ? "rgba(255,255,255,0.65)"
                                : "var(--text-muted)",
                          }}
                        >
                          {desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Пожелания */}
              <div>
                <label
                  className="block text-xs uppercase tracking-widest mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Ваши пожелания
                </label>
                <textarea
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  placeholder="Пожелания, особые предпочтения, ответы на вопросы выше..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{
                    background: "var(--blue-section)",
                    border: "1px solid var(--blue-border)",
                    color: "var(--blue-deep)",
                  }}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl text-sm uppercase tracking-widest font-medium transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{ background: "var(--blue-deep)", color: "#fff" }}
              >
                Отправить ответ
              </button>
            </form>
          )}
        </Section>
      </section>

      {/* ── КОНТАКТЫ ── */}
      <section className="py-16 px-6" style={{ background: "var(--blue-section)" }}>
        <Section className="max-w-lg mx-auto text-center">
          <p className="uppercase tracking-[0.3em] text-xs mb-6" style={{ color: "var(--blue-mid)" }}>
            Контакты
          </p>
          <p
            className="font-cormorant text-2xl mb-6 font-light"
            style={{ color: "var(--blue-deep)" }}
          >
            Если есть вопросы — свяжитесь с нами
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+79001234567"
              className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl transition-all hover:opacity-80"
              style={{ background: "#fff", border: "1px solid var(--blue-border)", color: "var(--blue-deep)" }}
            >
              <Icon name="Phone" size={16} />
              <span className="text-sm">+7 (900) 123-45-67</span>
            </a>
            <a
              href="https://wa.me/79001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl transition-all hover:opacity-80"
              style={{ background: "#fff", border: "1px solid var(--blue-border)", color: "var(--blue-deep)" }}
            >
              <Icon name="MessageCircle" size={16} />
              <span className="text-sm">WhatsApp</span>
            </a>
          </div>
        </Section>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 text-center" style={{ background: "var(--blue-deep)" }}>
        <p className="font-cormorant text-3xl italic mb-1" style={{ color: "#fff" }}>
          Елизавета &amp; Сергей
        </p>
        <p className="text-xs tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>
          12 · 09 · 2026
        </p>
        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "1.5rem" }}>❀</div>
      </footer>
    </div>
  );
}