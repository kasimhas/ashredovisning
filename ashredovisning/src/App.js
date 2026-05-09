import { useState, useEffect, useRef } from "react";

const BLUE = "#1437FF";
const BLUE_DARK = "#0f29cc";
const BLUE_LIGHT = "#e8ecff";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// --- NAVBAR ---
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Våra tjänster", href: "#tjanster" },
    { label: "Om oss", href: "#om-oss" },
    { label: "Kontakt", href: "#kontakt" },
  ];

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 48px",
        height: "68px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(248,248,250,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(20,55,255,0.08)" : "none",
        transition: "all 0.4s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src="/ash_logo.png" alt="ASH Redovisning" style={{ height: 70, width: "auto" }} />
      </div>

      <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
        {links.map(l => (
          <a
            key={l.href}
            href={l.href}
            style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              fontSize: 15, color: "#3a3a4a", textDecoration: "none",
              letterSpacing: "-0.1px", transition: "color 0.2s"
            }}
            onMouseEnter={e => e.target.style.color = BLUE}
            onMouseLeave={e => e.target.style.color = "#3a3a4a"}
          >
            {l.label}
          </a>
        ))}
        <a
          href="#kontakt"
          style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14,
            color: "white", background: BLUE, padding: "9px 22px",
            borderRadius: 100, textDecoration: "none", letterSpacing: "-0.1px",
            transition: "background 0.2s, transform 0.15s",
            boxShadow: "0 4px 16px rgba(20,55,255,0.28)"
          }}
          onMouseEnter={e => { e.target.style.background = BLUE_DARK; e.target.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.target.style.background = BLUE; e.target.style.transform = "translateY(0)"; }}
        >
          Kom igång
        </a>
      </div>
    </nav>
  );
}

// --- PRISRÄKNARE ---
function PrisRaknare() {
  const [verifikationer, setVerifikationer] = useState(15);
  const [loner, setLoner] = useState(1);
  const [inkluderaBokslut, setInkluderaBokslut] = useState(true);

  const BOKSLUT_AR = 1495;
  const basKostnad = 295;
  const perVerif = 12;
  const perLon = 65;

  const hosOss = basKostnad + verifikationer * perVerif + loner * perLon;
  const hosOssAr = hosOss * 12 + (inkluderaBokslut ? BOKSLUT_AR : 0);
  const andraByraar = hosOss * 2;
  const andraByraarAr = hosOssAr * 2;
  const besparing = andraByraar - hosOss;
  const besparingAr = andraByraarAr - hosOssAr;

  const sliderStyle = (val, max) => ({
    width: "100%", height: 5, borderRadius: 9999,
    appearance: "none", outline: "none", cursor: "pointer",
    background: `linear-gradient(to right, #1437FF ${(val/max)*100}%, #e0e4ff ${(val/max)*100}%)`,
  });

  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        background: "white",
        borderRadius: 24,
        padding: "28px 28px",
        boxShadow: "0 20px 60px rgba(20,55,255,0.13)",
        border: "1.5px solid rgba(20,55,255,0.10)",
        width: "100%", maxWidth: 420,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: BLUE_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🧮</div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 17, color: "#0d0d1a", letterSpacing: "-0.3px" }}>Räkneexempel per månad</span>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6b6b80" }}>Antal verifikationer</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: BLUE }}>{verifikationer}</span>
          </div>
          <style>{`
            input[type=range]::-webkit-slider-thumb { appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #1437FF; cursor: pointer; box-shadow: 0 2px 8px rgba(20,55,255,0.35); }
            input[type=range]::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #1437FF; cursor: pointer; border: none; }
          `}</style>
          <input type="range" min={1} max={100} value={verifikationer}
            onChange={e => setVerifikationer(Number(e.target.value))}
            style={sliderStyle(verifikationer, 100)}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6b6b80" }}>Antal löner</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: BLUE }}>{loner}</span>
          </div>
          <input type="range" min={1} max={50} value={loner}
            onChange={e => setLoner(Number(e.target.value))}
            style={sliderStyle(loner, 50)}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, cursor: "pointer" }}
          onClick={() => setInkluderaBokslut(p => !p)}>
          <div style={{
            width: 20, height: 20, borderRadius: 6,
            background: inkluderaBokslut ? BLUE : "white",
            border: `2px solid ${inkluderaBokslut ? BLUE : "#d0d0e0"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "all 0.2s"
          }}>
            {inkluderaBokslut && <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>✓</span>}
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6b6b80" }}>
            Bokslut & årsredovisning (1 495 kr per år – separat avgift)
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div style={{ background: "#f0fdf4", borderRadius: 16, padding: "16px 18px", border: "1.5px solid #bbf7d0" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#16a34a", fontWeight: 600, marginBottom: 6 }}>Hos oss</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 800, color: "#0d0d1a", letterSpacing: "-1px" }}>{hosOss.toLocaleString("sv-SE")} kr</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#6b6b80", marginTop: 4 }}>{hosOssAr.toLocaleString("sv-SE")} kr per år</div>
          </div>
          <div style={{ background: "#fff7ed", borderRadius: 16, padding: "16px 18px", border: "1.5px solid #fed7aa" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#ea580c", fontWeight: 600, marginBottom: 6 }}>Andra byråer*</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 800, color: "#0d0d1a", letterSpacing: "-1px" }}>{andraByraar.toLocaleString("sv-SE")} kr</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#6b6b80", marginTop: 4 }}>{andraByraarAr.toLocaleString("sv-SE")} kr per år</div>
          </div>
        </div>

        <div style={{ background: BLUE_LIGHT, borderRadius: 16, padding: "16px 18px", border: `1.5px solid rgba(20,55,255,0.15)`, marginBottom: 14 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: BLUE, fontWeight: 600, marginBottom: 4 }}>Din besparing</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 800, color: "#0d0d1a", letterSpacing: "-1px" }}>{besparing.toLocaleString("sv-SE")} kr/mån</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#6b6b80", marginTop: 4 }}>{besparingAr.toLocaleString("sv-SE")} kr per år</div>
        </div>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#aaaabc", lineHeight: 1.5 }}>
          *Baserat på enkla antaganden. Be om en exakt offert — vi matchar och slår ofta priset.
        </p>
      </div>
    </div>
  );
}

// --- HERO ---
function Hero() {
  return (
    <section style={{
      minHeight: "100vh", background: "#f7f7fa",
      display: "flex", alignItems: "center",
      padding: "120px 48px 80px",
      position: "relative", overflow: "hidden"
    }}>
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(rgba(20,55,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(20,55,255,0.04) 1px, transparent 1px)`,
        backgroundSize: "60px 60px"
      }}/>

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 1, display: "flex", gap: 80, alignItems: "center" }}>
        <div style={{ flex: 1, maxWidth: 580 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(20,55,255,0.07)", border: "1px solid rgba(20,55,255,0.15)",
            borderRadius: 100, padding: "6px 16px", marginBottom: 32
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: BLUE }}/>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: BLUE, letterSpacing: "0.3px" }}>
              Redovisning & ekonomirådgivning
            </span>
          </div>

          <h1 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(40px, 5vw, 66px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-2.5px",
            color: "#0d0d1a",
            margin: "0 0 24px"
          }}>
            Smidig redovisning<br />
            <span style={{ color: BLUE }}>för företagare</span><br />
            som vill växa
          </h1>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: "#6b6b80",
            lineHeight: 1.65, maxWidth: 440, margin: "0 0 40px", fontWeight: 400
          }}>
            Vi tar hand om siffrorna så att du kan fokusera på det du gör bäst — att bygga ditt företag.
          </p>

          <div style={{ display: "flex", gap: 16, marginBottom: 44 }}>
            {[
              { icon: "⚡", title: "Snabb onboarding", desc: "Kom igång på 24 timmar" },
              { icon: "🔒", title: "Säkert & pålitligt", desc: "Alltid uppdaterat & korrekt" }
            ].map((c, i) => (
              <div key={i} style={{
                flex: 1, padding: "18px 20px",
                border: `1.5px solid rgba(20,55,255,0.15)`,
                borderRadius: 16, background: "white",
                boxShadow: "0 2px 12px rgba(20,55,255,0.06)"
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{c.icon}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: "#0d0d1a", marginBottom: 3 }}>{c.title}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#8888a0" }}>{c.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 14 }}>
            <a href="#kontakt" style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15,
              color: "white", background: BLUE, padding: "14px 28px",
              borderRadius: 100, textDecoration: "none",
              boxShadow: "0 8px 24px rgba(20,55,255,0.32)",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(20,55,255,0.42)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(20,55,255,0.32)"; }}
            >
              Kontakta oss →
            </a>
            <a href="#tjanster" style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15,
              color: "#0d0d1a", background: "white", padding: "14px 28px",
              borderRadius: 100, textDecoration: "none",
              border: "1.5px solid rgba(0,0,0,0.1)",
              transition: "border-color 0.2s, transform 0.2s"
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Läs mer
            </a>
          </div>
        </div>

        <PrisRaknare />
      </div>
    </section>
  );
}

// --- TJÄNSTER ---
const services = [
  { image: "/radgivning.png", title: "Rådgivning", desc: "Strategisk vägledning för tillväxt, struktur och finansiella beslut som tar dig framåt." },
  { image: "/lopande_bokforing.png", title: "Löpande bokföring", desc: "Vi sköter din löpande bokföring noggrant och effektivt, alltid i tid och med full koll." },
  { image: "/bokslut.png", title: "Bokslut & årsredovisning", desc: "Professionell upprättning av bokslut och årsredovisning som uppfyller alla krav." },
  { image: "/lonehantering.png", title: "Lönehantering", desc: "Komplett löneadministration — löner, semester, arbetsgivaravgifter och rapportering." },
];

function ServiceCard({ image, title, desc, delay }) {
  const [hover, setHover] = useState(false);
  return (
    <FadeIn delay={delay}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: "white",
          border: `1.5px solid rgba(20,55,255,0.1)`,
          borderRadius: 20, overflow: "hidden",
          cursor: "default",
          transform: hover ? "translateY(-4px)" : "translateY(0)",
          transition: "all 0.3s ease",
          boxShadow: hover ? "0 16px 40px rgba(20,55,255,0.12)" : "0 4px 12px rgba(20,55,255,0.05)"
        }}
      >
        <div style={{
          width: "100%", height: 180, background: BLUE_LIGHT,
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden"
        }}>
          <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ padding: "24px" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 17, color: "#0d0d1a", marginBottom: 10, letterSpacing: "-0.3px" }}>{title}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6b6b80", lineHeight: 1.6 }}>{desc}</div>
        </div>
      </div>
    </FadeIn>
  );
}

function Tjanster() {
  return (
    <section id="tjanster" style={{ background: BLUE, padding: "100px 48px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 64 }}>
          <FadeIn>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)", letterSpacing: "1px", textTransform: "uppercase" }}>
                Vad vi erbjuder
              </span>
            </div>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(36px,4vw,58px)", color: "white", margin: "0 0 16px", letterSpacing: "-2px", lineHeight: 1.05 }}>
              Våra tjänster
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, maxWidth: 420 }}>
              Från löpande bokföring till strategisk rådgivning — vi är din kompletta ekonomipartner.
            </p>
          </FadeIn>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {services.map((s, i) => (
            <ServiceCard key={s.title} {...s} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

// --- OM OSS ---
function OmOss() {
  const stats = [
    { num: "flera", label: "års erfarenhet" },
    { num: "100+", label: "nöjda kunder" },
    { num: "24h", label: "svarstid" },
  ];

  return (
    <section id="om-oss" style={{ background: "#f7f7fa", padding: "100px 48px", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", right: -120, top: -120,
        width: 400, height: 400, borderRadius: "50%",
        border: "2px solid rgba(20,55,255,0.06)"
      }}/>
      <div style={{
        position: "absolute", right: -60, top: -60,
        width: 250, height: 250, borderRadius: "50%",
        border: "2px solid rgba(20,55,255,0.08)"
      }}/>

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", gap: 80, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <FadeIn>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(20,55,255,0.07)", border: "1px solid rgba(20,55,255,0.15)", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: BLUE, letterSpacing: "1px", textTransform: "uppercase" }}>
                  Vår historia
                </span>
              </div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(36px,4vw,58px)", color: "#0d0d1a", margin: "0 0 24px", letterSpacing: "-2px", lineHeight: 1.05 }}>
                Om oss
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#6b6b80", lineHeight: 1.7, marginBottom: 20 }}>
                ASH Redovisning grundades med en enkel idé: att ge startups och växande företag tillgång till samma ekonomiska precision som stora bolag — utan byråkratin.
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#6b6b80", lineHeight: 1.7, marginBottom: 40 }}>
                Vi kombinerar djup redovisningskompetens med ett genuint engagemang för ditt företags framgång. Vi är inte bara din revisor — vi är din finansiella partner.
              </p>
              <a href="#kontakt" style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15,
                color: "white", background: BLUE, padding: "14px 28px",
                borderRadius: 100, textDecoration: "none",
                boxShadow: "0 8px 24px rgba(20,55,255,0.28)", display: "inline-block",
                transition: "transform 0.2s"
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                Träffa oss →
              </a>
            </FadeIn>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.15}>
                <div style={{
                  background: "white", borderRadius: 20, padding: "28px 32px",
                  border: "1.5px solid rgba(20,55,255,0.08)",
                  display: "flex", alignItems: "center", gap: 24,
                  boxShadow: "0 4px 16px rgba(20,55,255,0.05)"
                }}>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 800,
                    fontSize: 48, color: BLUE, letterSpacing: "-2px", lineHeight: 1
                  }}>{s.num}</div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 17,
                    color: "#3a3a4a", fontWeight: 500
                  }}>{s.label}</div>
                  <div style={{ marginLeft: "auto" }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: BLUE_LIGHT, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18
                    }}>
                      {i === 0 ? "⭐" : i === 1 ? "🤝" : "💬"}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- KONTAKT ---
function Kontakt() {
  const [form, setForm] = useState({ namn: "", epost: "", foretag: "", meddelande: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (form.namn && form.epost) setSent(true);
  };

  return (
    <section id="kontakt" style={{ background: "#0d0d1a", padding: "100px 48px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(20,55,255,0.2)", border: "1px solid rgba(20,55,255,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#8898ff", letterSpacing: "1px", textTransform: "uppercase" }}>
                Redo att börja?
              </span>
            </div>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(36px,4vw,58px)", color: "white", margin: "0 0 16px", letterSpacing: "-2px" }}>
              Kontakta oss
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.5)", maxWidth: 400, margin: "0 auto" }}>
              Låt oss ta ett samtal om hur vi kan hjälpa ditt företag.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: "flex", gap: 60, alignItems: "flex-start" }}>
          <FadeIn delay={0.1}>
            <div style={{ flex: "1.2" }}>
              {sent ? (
                <div style={{
                  background: "rgba(20,55,255,0.15)", border: "1.5px solid rgba(20,55,255,0.3)",
                  borderRadius: 24, padding: "60px 40px", textAlign: "center"
                }}>
                  <div style={{ fontSize: 48, marginBottom: 20 }}>✅</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 22, color: "white", marginBottom: 12 }}>Tack för ditt meddelande!</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.6)" }}>Vi återkommer inom 24 timmar.</div>
                </div>
              ) : (
                <div style={{
                  background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)",
                  borderRadius: 24, padding: "40px"
                }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    {[
                      { key: "namn", label: "Namn", placeholder: "Erik Johansson" },
                      { key: "epost", label: "E-post", placeholder: "erik@foretag.se" },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 8, letterSpacing: "0.3px" }}>{f.label}</label>
                        <input
                          type={f.key === "epost" ? "email" : "text"}
                          placeholder={f.placeholder}
                          value={form[f.key]}
                          onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                          style={{
                            width: "100%", padding: "12px 16px",
                            background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)",
                            borderRadius: 12, color: "white", fontSize: 15,
                            fontFamily: "'DM Sans', sans-serif", outline: "none",
                            boxSizing: "border-box", transition: "border-color 0.2s"
                          }}
                          onFocus={e => e.target.style.borderColor = BLUE}
                          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 8 }}>Företag</label>
                    <input
                      type="text" placeholder="Ditt Företag AB"
                      value={form.foretag}
                      onChange={e => setForm(p => ({ ...p, foretag: e.target.value }))}
                      style={{
                        width: "100%", padding: "12px 16px",
                        background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)",
                        borderRadius: 12, color: "white", fontSize: 15,
                        fontFamily: "'DM Sans', sans-serif", outline: "none",
                        boxSizing: "border-box", transition: "border-color 0.2s"
                      }}
                      onFocus={e => e.target.style.borderColor = BLUE}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                    />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 8 }}>Meddelande</label>
                    <textarea
                      placeholder="Berätta om ditt företag och hur vi kan hjälpa dig..."
                      rows={4}
                      value={form.meddelande}
                      onChange={e => setForm(p => ({ ...p, meddelande: e.target.value }))}
                      style={{
                        width: "100%", padding: "12px 16px",
                        background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)",
                        borderRadius: 12, color: "white", fontSize: 15,
                        fontFamily: "'DM Sans', sans-serif", outline: "none",
                        boxSizing: "border-box", resize: "vertical", transition: "border-color 0.2s"
                      }}
                      onFocus={e => e.target.style.borderColor = BLUE}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    style={{
                      width: "100%", padding: "15px",
                      background: BLUE, border: "none", borderRadius: 12,
                      color: "white", fontSize: 16, fontWeight: 700,
                      fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                      letterSpacing: "-0.2px",
                      boxShadow: "0 8px 24px rgba(20,55,255,0.35)",
                      transition: "transform 0.2s, box-shadow 0.2s"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(20,55,255,0.45)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(20,55,255,0.35)"; }}
                  >
                    Skicka meddelande →
                  </button>
                </div>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: "📧", label: "E-post", value: "info@ashredovisning.com" },
                { icon: "📞", label: "Telefon", value: "+46 72-840 26 35" },
              ].map((c, i) => (
                <div key={i} style={{
                  display: "flex", gap: 16, alignItems: "flex-start",
                  padding: "20px 24px", borderRadius: 16,
                  background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.07)"
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(20,55,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                    {c.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 4, letterSpacing: "0.5px", textTransform: "uppercase", fontWeight: 600 }}>{c.label}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "white", fontWeight: 500 }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// --- FAQ ---
const faqs = [
  { q: "Hur snabbt kan jag komma igång?", a: "Vanligtvis inom 24–48 timmar. Vi hjälper dig med allt från uppstart till överföring av bokföring." },
  { q: "Arbetar ni helt digitalt?", a: "Ja. Allt sköts online för att göra processen snabb, enkel och smidig för dig som företagare." },
  { q: "Passar era tjänster småföretag?", a: "Ja, vi fokuserar främst på små och växande företag som vill ha enkel och prisvärd redovisning." },
  { q: "Kan ni hjälpa till om jag redan har en redovisningsbyrå?", a: "Absolut. Vi hjälper dig att byta enkelt och sköter övergången åt dig." },
  { q: "Vad ingår i löpande bokföring?", a: "Bokföring, avstämningar, momsrapportering och ekonomisk översikt så att du alltid har kontroll." },
  { q: "Hur skickar jag in mina underlag?", a: "Du kan ladda upp kvitton och fakturor direkt digitalt via mobil eller dator." },
  { q: "Har ni fasta priser?", a: "Ja. Vi erbjuder tydliga paket utan dolda avgifter så att du vet exakt vad du betalar för." },
  { q: "Kan jag få hjälp med deklaration och bokslut?", a: "Ja, vi hjälper till med bokslut, årsredovisning och deklaration för både företag och privatpersoner." },
  { q: "Måste jag skriva långt avtal?", a: "Nej. Vi har 1 månad bindningstid och inga krångliga villkor." },
  { q: "Varför ska jag välja er?", a: "Vi kombinerar personlig service med modern teknik för att ge snabb, prisvärd och smidig redovisning." },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: `1.5px solid ${open ? "rgba(20,55,255,0.25)" : "rgba(0,0,0,0.07)"}`,
        borderRadius: 16, overflow: "hidden",
        background: open ? "rgba(20,55,255,0.03)" : "white",
        transition: "all 0.2s ease",
        boxShadow: open ? "0 4px 20px rgba(20,55,255,0.08)" : "none"
      }}
    >
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          width: "100%", padding: "20px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "transparent", border: "none", cursor: "pointer", textAlign: "left"
        }}
      >
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, color: "#0d0d1a", letterSpacing: "-0.2px" }}>{q}</span>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: open ? BLUE : BLUE_LIGHT,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, marginLeft: 16, transition: "all 0.2s"
        }}>
          <span style={{ color: open ? "white" : BLUE, fontSize: 18, fontWeight: 700, lineHeight: 1, transform: open ? "rotate(45deg)" : "rotate(0)", display: "block", transition: "transform 0.2s" }}>+</span>
        </div>
      </button>
      {open && (
        <div style={{ padding: "0 24px 20px" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#6b6b80", lineHeight: 1.65 }}>{a}</p>
        </div>
      )}
    </div>
  );
}

function FAQ() {
  return (
    <section id="faq" style={{ background: "#f7f7fa", padding: "100px 48px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(20,55,255,0.07)", border: "1px solid rgba(20,55,255,0.15)", borderRadius: 100, padding: "6px 16px", marginBottom: 20 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: BLUE, letterSpacing: "1px", textTransform: "uppercase" }}>FAQ</span>
            </div>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(32px,4vw,52px)", color: "#0d0d1a", margin: "0 0 14px", letterSpacing: "-2px" }}>
              Vanliga frågor
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#6b6b80" }}>
              Kort och rakt — allt du behöver veta för att komma igång.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((f, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <FaqItem {...f} />
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <a href="#kontakt" style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16,
              color: "white", background: BLUE, padding: "16px 36px",
              borderRadius: 100, textDecoration: "none",
              boxShadow: "0 8px 24px rgba(20,55,255,0.28)", display: "inline-block",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(20,55,255,0.40)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(20,55,255,0.28)"; }}
            >
              Få din offert nu →
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// --- FOOTER ---
function Footer() {
  return (
    <footer style={{ background: "#080810", padding: "40px 48px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="/ash_logo.png" alt="ASH Redovisning" style={{ height: 60, width: "auto", filter: "brightness(0) invert(1)" }} />
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
          © 2026 ASH Redovisning AB. Alla rättigheter förbehållna.
        </div>
      </div>
    </footer>
  );
}

// --- APP ---
export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #f7f7fa; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d0d1a; }
        ::-webkit-scrollbar-thumb { background: ${BLUE}; border-radius: 3px; }
      `}</style>
      <Navbar />
      <Hero />
      <Tjanster />
      <OmOss />
      <FAQ />
      <Kontakt />
      <Footer />
    </>
  );
}