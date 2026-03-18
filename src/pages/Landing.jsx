import { useEffect } from "react";
import { Music, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const scrollToForm = () => {
    document.getElementById("form-anchor").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={s.page}>

      {/* Nav */}
      <nav style={s.nav}>
        <div>
          <div style={s.logo}>CANTIO</div>
          <div style={s.logoSub}>PLATAFORMA DE COMPOSIÇÕES</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={s.loginBtn} onClick={() => navigate("/login")}>
            Entrar
          </button>
          <button style={s.navPill} onClick={scrollToForm}>Quero participar</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={s.hero}>
        <div style={s.eyebrow}>VALE DO SÃO FRANCISCO · NORDESTE</div>
        <h1 style={s.heroTitle}>
          A plataforma feita para quem{" "}
          <em style={{ color: "#c8935a" }}>vive</em> de música
        </h1>
        <p style={s.heroSub}>
          Cantio é um espaço para compositores cadastrarem suas obras,
          colaborarem com outros artistas e organizarem tudo em um só lugar.
        </p>
        <button style={s.ctaBtn} onClick={scrollToForm}>
          Manifeste seu interesse
        </button>
        <p style={s.ctaNote}>Gratuito · Sem compromisso · Leva 1 minuto</p>
      </div>

      <div style={s.divider} />

      {/* Features */}
      <div style={s.featuresGrid}>
        {[
          {
            icon: <Music size={16} color="#c8935a" />,
            title: "Suas composições organizadas",
            desc: "Letra, cifra e áudio em um único lugar. Acesse de qualquer dispositivo, a qualquer hora.",
          },
          {
            icon: <Users size={16} color="#c8935a" />,
            title: "Coautoria simplificada",
            desc: "Convide parceiros, divida créditos e acompanhe edições em tempo real sem confusão.",
          },
          {
            icon: <Shield size={16} color="#c8935a" />,
            title: "Controle dos seus direitos",
            desc: "Registre datas, coautores e versões. Seu histórico criativo documentado e seguro.",
          },
        ].map((f) => (
          <div key={f.title} style={s.featCard}>
            <div style={s.featIcon}>{f.icon}</div>
            <div style={s.featTitle}>{f.title}</div>
            <div style={s.featDesc}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Quote */}
      <div style={s.quoteSection}>
        <div style={s.quoteCard}>
          <p style={s.quoteText}>
            "A música do Vale tem história, tem raiz. Mas o compositor ainda
            gerencia tudo no caderno ou no WhatsApp. Está na hora de ter uma
            ferramenta à altura do nosso trabalho."
          </p>
          <p style={s.quoteAuthor}>— COMPOSITOR DO VALE DO SÃO FRANCISCO</p>
        </div>
      </div>

      <div style={s.divider} />

      {/* Form */}
      <div style={s.formSection} id="form-anchor">
        <div style={s.formLabel}>INTERESSE</div>
        <div style={s.formTitle}>Você quer fazer parte?</div>
        <p style={s.formSub}>
          Preencha o formulário abaixo. Quando lançarmos, você será o primeiro
          a saber.
        </p>
        <button
          style={s.tallyBtn}
          data-tally-open="kdZJDj"
          data-tally-layout="modal"
          data-tally-width="500"
          data-tally-emoji-text="🎵"
          data-tally-emoji-animation="wave"
        >
          Preencher formulário de interesse
        </button>
      </div>

      {/* Footer */}
      <footer style={s.footer}>
        <div style={{ ...s.logo, fontSize: 13 }}>CANTIO</div>
        <div style={s.footerNote}>Vale do São Francisco · 2026</div>
      </footer>
    </div>
  );
}

const s = {
  page: {
    background: "#0c0c0d",
    minHeight: "100vh",
    color: "#edeae4",
    fontFamily: "Georgia, serif",
    display: "flex",
    flexDirection: "column",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 40px",
    borderBottom: "0.5px solid rgba(255,255,255,0.07)",
  },
  logo: {
    fontSize: 18,
    letterSpacing: "0.12em",
    color: "#c8935a",
  },
  logoSub: {
    fontSize: 10,
    letterSpacing: "0.2em",
    color: "#4a4845",
    marginTop: -2,
  },
  navPill: {
    marginLeft: "auto",
    background: "rgba(200,147,90,0.15)",
    border: "0.5px solid rgba(200,147,90,0.3)",
    color: "#c8935a",
    fontSize: 11,
    letterSpacing: "0.1em",
    padding: "6px 14px",
    borderRadius: 20,
    cursor: "pointer",
    fontFamily: "Georgia, serif",
  },
  hero: {
    padding: "80px 40px 60px",
    maxWidth: 680,
    margin: "0 auto",
    textAlign: "center",
    width: "100%",
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: "0.2em",
    color: "#c8935a",
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: "normal",
    lineHeight: 1.25,
    color: "#edeae4",
    marginBottom: 20,
    letterSpacing: "-0.01em",
  },
  heroSub: {
    fontSize: 15,
    color: "#8a877f",
    lineHeight: 1.8,
    marginBottom: 36,
    maxWidth: 480,
    marginLeft: "auto",
    marginRight: "auto",
  },
  ctaBtn: {
    display: "inline-block",
    background: "#c8935a",
    color: "#1a0f05",
    fontSize: 12,
    letterSpacing: "0.1em",
    padding: "13px 28px",
    borderRadius: 8,
    cursor: "pointer",
    border: "none",
    fontFamily: "Georgia, serif",
  },
  ctaNote: {
    fontSize: 11,
    color: "#4a4845",
    marginTop: 12,
  },
  divider: {
    width: 40,
    height: 0.5,
    background: "rgba(255,255,255,0.13)",
    margin: "48px auto",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
    padding: "0 40px 60px",
    maxWidth: 860,
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  featCard: {
    background: "#131314",
    border: "0.5px solid rgba(255,255,255,0.07)",
    borderRadius: 10,
    padding: "20px",
  },
  featIcon: {
    width: 32,
    height: 32,
    background: "rgba(200,147,90,0.15)",
    borderRadius: 6,
    marginBottom: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  featTitle: {
    fontSize: 13,
    color: "#edeae4",
    marginBottom: 6,
  },
  featDesc: {
    fontSize: 11,
    color: "#8a877f",
    lineHeight: 1.7,
  },
  quoteSection: {
    padding: "0 40px 60px",
    maxWidth: 680,
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  quoteCard: {
    background: "#131314",
    border: "0.5px solid rgba(255,255,255,0.07)",
    borderLeft: "2px solid #c8935a",
    padding: "24px 28px",
  },
  quoteText: {
    fontSize: 15,
    color: "#8a877f",
    lineHeight: 1.8,
    fontStyle: "italic",
  },
  quoteAuthor: {
    fontSize: 11,
    color: "#4a4845",
    marginTop: 12,
    letterSpacing: "0.08em",
  },
  formSection: {
    padding: "0 40px 80px",
    maxWidth: 560,
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
    textAlign: "center",
  },
  formLabel: {
    fontSize: 10,
    letterSpacing: "0.16em",
    color: "#4a4845",
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "normal",
    color: "#edeae4",
    marginBottom: 8,
  },
  formSub: {
    fontSize: 13,
    color: "#8a877f",
    marginBottom: 28,
    lineHeight: 1.7,
  },
  tallyBtn: {
    display: "block",
    width: "100%",
    background: "#c8935a",
    color: "#1a0f05",
    fontSize: 13,
    letterSpacing: "0.08em",
    padding: 15,
    borderRadius: 8,
    cursor: "pointer",
    border: "none",
    fontFamily: "Georgia, serif",
    textAlign: "center",
  },
  footer: {
    borderTop: "0.5px solid rgba(255,255,255,0.07)",
    padding: "20px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  footerNote: {
    fontSize: 10,
    color: "#4a4845",
  },
    loginBtn: {
    background: "transparent",
    border: "0.5px solid rgba(255,255,255,0.13)",
    color: "#8a877f",
    fontSize: 11,
    letterSpacing: "0.1em",
    padding: "6px 14px",
    borderRadius: 20,
    cursor: "pointer",
    fontFamily: "Georgia, serif",
  },
};
