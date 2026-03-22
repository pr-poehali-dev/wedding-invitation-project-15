import { useState, useEffect, useRef } from "react";

import Icon from "@/components/ui/icon";

const WEDDING_DATE = new Date("2026-06-21T14:00:00");
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
  const [form, setForm] = useState({ name: "", guests: "1", alcohol: [] as string[], music: "", attend: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen font-montserrat" style={{ background: "var(--bg-cream)" }}>

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
            className="my-2 py-[5px]"
            style={{
              fontSize: "clamp(3rem, 10vw, 6.5rem)",
              lineHeight: 1.05,
              color: "var(--blue-deep)",
              fontFamily: "'Kudry Weird Headline', serif",
              fontWeight: 400,
              fontStyle: "normal",
            }}
          >
            Елизавета
            <br />&amp;<br />
            Сергей
          </h1>

          <div className="flex items-center justify-center mb-8 mt-4">
            <svg width="110" height="56" viewBox="0 0 110 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gold1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f5e6c0"/>
                  <stop offset="30%" stopColor="#e8c97a"/>
                  <stop offset="60%" stopColor="#d4a843"/>
                  <stop offset="100%" stopColor="#f0d898"/>
                </linearGradient>
                <linearGradient id="gold2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f5e6c0"/>
                  <stop offset="30%" stopColor="#e8c97a"/>
                  <stop offset="60%" stopColor="#d4a843"/>
                  <stop offset="100%" stopColor="#f0d898"/>
                </linearGradient>
              </defs>
              {/* Левое кольцо */}
              <circle cx="37" cy="28" r="20" stroke="url(#gold1)" strokeWidth="5" fill="none"/>
              <circle cx="37" cy="28" r="20" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" strokeDasharray="4 8" strokeLinecap="round"/>
              {/* Правое кольцо */}
              <circle cx="73" cy="28" r="20" stroke="url(#gold2)" strokeWidth="5" fill="none"/>
              <circle cx="73" cy="28" r="20" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" strokeDasharray="4 8" strokeLinecap="round"/>
            </svg>
          </div>

          <p
            className="font-cormorant text-2xl mb-2"
            style={{ color: "var(--blue-mid)", fontStyle: "italic" }}
          >
            21 июня 2026
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
          <h2 className="text-4xl mb-6" style={{ color: "var(--blue-deep)", fontFamily: "'Kudry Weird Headline', serif" }}>
            Дорогие гости!
          </h2>
          <p className="text-sm leading-7 mb-4" style={{ color: "var(--text-muted)" }}>
            Вы получили это сообщение, а значит, мы спешим поделиться с вами радостной новостью — у нас скоро свадьба!
          </p>
          <p className="text-sm leading-7" style={{ color: "var(--text-muted)" }}>
            Мы приглашаем вас разделить с нами радость этого особенного события и стать частью нашей семейной истории. Ваше присутствие сделает наш день ещё более значимым и незабываемым.
          </p>
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
              <p className="text-white uppercase tracking-widest text-sm font-light">Июнь 2026</p>
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
                  21
                </span>
              </div>
              <p
                className="font-cormorant text-2xl mb-2 font-light"
                style={{ color: "var(--blue-deep)" }}
              >
                Воскресенье
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Начало торжества в 14:00
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
          <h2 className="text-4xl mb-3" style={{ color: "var(--blue-deep)", fontFamily: "'Kudry Weird Headline', serif" }}>
            Свадебный коттедж «Крылья»
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            Свердловская область, 15 км, Тюменский тракт, п. Прохладный, КП «Новый исток»
          </p>
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "#fff", border: "1px solid var(--blue-border)" }}
            >
              <Icon name="House" size={24} style={{ color: "var(--blue-deep)" }} />
            </div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              улица Ахматовой, д.6
            </p>
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
              src="https://yandex.ru/map-widget/v1/?text=%D1%83%D0%BB%D0%B8%D1%86%D0%B0+%D0%90%D1%85%D0%BC%D0%B0%D1%82%D0%BE%D0%B2%D0%BE%D0%B9+6+%D0%BF%D0%BE%D1%81%D1%91%D0%BB%D0%BE%D0%BA+%D0%9F%D1%80%D0%BE%D1%85%D0%BB%D0%B0%D0%B4%D0%BD%D1%8B%D0%B9+%D0%A1%D0%B2%D0%B5%D1%80%D0%B4%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F+%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C&z=15&l=map"
              width="100%"
              height="280"
              frameBorder="0"
              title="Карта"
              style={{ border: 0, display: "block" }}
            />
          </div>

        </Section>
      </section>

      {/* ── ДРЕСС-КОД ── */}
      <section className="py-20 px-6">
        <Section className="max-w-xl mx-auto text-center">
          <p className="uppercase tracking-[0.3em] text-xs mb-6" style={{ color: "var(--pink-accent)" }}>
            Дресс-код
          </p>
          <h2 className="text-4xl mb-5" style={{ color: "var(--blue-deep)", fontFamily: "'Kudry Weird Headline', serif" }}>
            Элегантная непринужденность
          </h2>
          <p className="text-sm leading-7 mb-8 max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
            Нам важнее ваш комфорт, чем строгие правила, поэтому мы выбираем свободный стиль, где вы будете чувствовать себя легко. Мы будем рады, если вы поддержите нашу цветовую гамму — пастельные тона: небесно-голубой, нежная лаванда, пудрово-розовый, мятный и сливочный крем.
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

      {/* ── RSVP ── */}
      <section id="rsvp" className="py-20 px-6">
        <Section className="max-w-lg mx-auto">
          <p className="uppercase tracking-[0.3em] text-xs mb-4 text-center" style={{ color: "var(--pink-accent)" }}>
            Подтверждение
          </p>
          <h2
            className="text-4xl mb-8 text-center"
            style={{ color: "var(--blue-deep)", fontFamily: "'Kudry Weird Headline', serif" }}
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
                        background: form.attend === val ? "var(--blue-deep)" : "#fff",
                        color: form.attend === val ? "#fff" : "var(--blue-deep)",
                        border: `1px solid ${form.attend === val ? "var(--blue-deep)" : "var(--blue-border)"}`,
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Доп. вопросы — только при "Да" */}
              {form.attend === "yes" && (
                <>
                  {/* Количество гостей */}
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

                  {/* Алкоголь */}
                  <div>
                    <label
                      className="block text-xs uppercase tracking-widest mb-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Мы хотим, чтобы свадьба прошла весело, поэтому просим Вас выбрать алкоголь, который Вы предпочитаете
                    </label>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        "Шампанское",
                        "Красное сухое вино",
                        "Красное полусладкое вино",
                        "Красное сладкое вино",
                        "Белое сухое вино",
                        "Белое полусладкое вино",
                        "Белое сладкое вино",
                        "Виски",
                        "Коньяк",
                        "Ром",
                        "Джин",
                        "Текила",
                        "Водка",
                      ].map((drink) => {
                        const selected = form.alcohol.includes(drink);
                        return (
                          <button
                            type="button"
                            key={drink}
                            onClick={() =>
                              setForm({
                                ...form,
                                alcohol: selected
                                  ? form.alcohol.filter((d) => d !== drink)
                                  : [...form.alcohol, drink],
                              })
                            }
                            className="px-3 py-2 rounded-full text-xs transition-all hover:scale-[1.03]"
                            style={{
                              background: selected ? "var(--blue-deep)" : "#fff",
                              color: selected ? "#fff" : "var(--blue-deep)",
                              border: `1px solid ${selected ? "var(--blue-deep)" : "var(--blue-border)"}`,
                            }}
                          >
                            {drink}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Музыкальные пожелания */}
                  <div>
                    <label
                      className="block text-xs uppercase tracking-widest mb-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Музыкальные композиции, которые хотели бы услышать на празднике
                    </label>
                    <textarea
                      value={form.music}
                      onChange={(e) => setForm({ ...form, music: e.target.value })}
                      placeholder="Ваши пожелания..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                      style={{
                        background: "var(--blue-section)",
                        border: "1px solid var(--blue-border)",
                        color: "var(--blue-deep)",
                      }}
                    />
                  </div>
                </>
              )}

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
              href="https://vk.com/sergreatin"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-8 py-3 rounded-xl transition-all hover:opacity-80"
              style={{ background: "#fff", border: "1px solid var(--blue-border)", color: "var(--blue-deep)" }}
            >
              <span className="text-sm">Сергей</span>
            </a>
            <a
              href="https://vk.com/li_sa15"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-8 py-3 rounded-xl transition-all hover:opacity-80"
              style={{ background: "#fff", border: "1px solid var(--blue-border)", color: "var(--blue-deep)" }}
            >
              <span className="text-sm">Елизавета</span>
            </a>
          </div>
        </Section>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 text-center" style={{ background: "var(--blue-deep)" }}>
        <p className="text-3xl mb-1" style={{ color: "#fff", fontFamily: "'Kudry Weird Headline', serif" }}>
          Елизавета &amp; Сергей
        </p>
        <p className="text-xs tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>
          21 · 06 · 2026
        </p>
        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "1.5rem" }}>♥</div>
      </footer>
    </div>
  );
}