import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      navigate("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>CANTIO</div>
        <div style={s.logoSub}>PLATAFORMA DE COMPOSIÇÕES</div>
        <form onSubmit={handleLogin} style={s.form}>
          <div style={s.field}>
            <div style={s.label}>EMAIL</div>
            <input
              style={s.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          <div style={s.field}>
            <div style={s.label}>SENHA</div>
            <input
              style={s.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <div style={s.error}>{error}</div>}
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <div style={s.footer}>
          Não tem conta?{" "}
          <Link to="/register" style={s.link}>Cadastre-se</Link>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    background: "#0c0c0d",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Georgia, serif",
  },
  card: {
    background: "#131314",
    border: "0.5px solid rgba(255,255,255,0.07)",
    borderRadius: 12,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 400,
  },
  logo: {
    fontSize: 18,
    letterSpacing: "0.12em",
    color: "#c8935a",
    textAlign: "center",
  },
  logoSub: {
    fontSize: 10,
    letterSpacing: "0.2em",
    color: "#4a4845",
    textAlign: "center",
    marginBottom: 32,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 10,
    letterSpacing: "0.14em",
    color: "#4a4845",
  },
  input: {
    background: "#1a1a1c",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: 6,
    padding: "10px 12px",
    fontSize: 13,
    color: "#edeae4",
    fontFamily: "Georgia, serif",
    outline: "none",
  },
  error: {
    fontSize: 12,
    color: "#e24b4a",
    background: "rgba(226,75,74,0.1)",
    padding: "8px 12px",
    borderRadius: 6,
  },
  btn: {
    background: "#c8935a",
    color: "#1a0f05",
    border: "none",
    borderRadius: 8,
    padding: "12px",
    fontSize: 12,
    letterSpacing: "0.1em",
    cursor: "pointer",
    fontFamily: "Georgia, serif",
    marginTop: 8,
  },
  footer: {
    fontSize: 12,
    color: "#4a4845",
    textAlign: "center",
    marginTop: 24,
  },
  link: {
    color: "#c8935a",
    textDecoration: "none",
  },
};