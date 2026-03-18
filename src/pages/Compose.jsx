import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function Compose() {
  const { id } = useParams();
  const isEditing = !!id;

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("Forró");
  const [key, setKey] = useState("");
  const [bpm, setBpm] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [chords, setChords] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEditing) return;
    const load = async () => {
      const { data } = await supabase
        .from("compositions")
        .select("*")
        .eq("id", id)
        .single();
      if (data) {
        setTitle(data.title || "");
        setGenre(data.genre || "Forró");
        setKey(data.key || "");
        setBpm(data.bpm || "");
        setLyrics(data.lyrics || "");
        setChords(data.chords || "");
      }
    };
    load();
  }, [id]);

  const handleSave = async (status) => {
  setLoading(true);
  setError(null);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { navigate("/login"); return; }

  let error;

  if (isEditing) {
    const { error: updateError } = await supabase
      .from("compositions")
      .update({ title, genre, key, bpm: bpm ? parseInt(bpm) : null, lyrics, chords, status })
      .eq("id", id);
    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from("compositions")
      .insert({ title, genre, key, bpm: bpm ? parseInt(bpm) : null, lyrics, chords, status, owner_id: user.id });
    error = insertError;
  }

  if (error) {
    setError(error.message);
  } else {
    navigate(isEditing ? `/composition/${id}` : "/dashboard");
  }

  setLoading(false);
};

  return (
  <div style={s.page}>
    <nav style={s.nav}>
      <div style={s.logo}>CANTIO</div>
      <button style={s.backBtn} onClick={() => navigate(isEditing ? `/composition/${id}` : "/dashboard")}>
        ← Voltar
      </button>
    </nav>

    <div style={s.body}>
      <div style={s.title}>{isEditing ? "Editar composição" : "Nova composição"}</div>

      <div style={s.form}>
        <div style={s.row}>
          <div style={s.field}>
            <div style={s.label}>TÍTULO</div>
            <input
              style={s.input}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome da música..."
            />
            </div>
            <div style={s.field}>
              <div style={s.label}>GÊNERO</div>
              <select
                style={s.input}
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                <option>Forró</option>
                <option>Baião</option>
                <option>Xote</option>
                <option>Toada</option>
                <option>Outro</option>
              </select>
            </div>
          </div>

          <div style={s.row}>
            <div style={s.field}>
              <div style={s.label}>TOM</div>
              <input
                style={s.input}
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Ex: Lá menor"
              />
            </div>
            <div style={s.field}>
              <div style={s.label}>BPM</div>
              <input
                style={s.input}
                type="number"
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
                placeholder="120"
              />
            </div>
          </div>

          <div style={s.field}>
            <div style={s.label}>LETRA</div>
            <textarea
              style={{ ...s.input, height: 140, resize: "none", lineHeight: 1.7 }}
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Escreva a letra aqui..."
            />
          </div>

          <div style={s.field}>
            <div style={s.label}>CIFRA</div>
            <textarea
              style={{ ...s.input, height: 80, resize: "none", fontFamily: "monospace", fontSize: 12 }}
              value={chords}
              onChange={(e) => setChords(e.target.value)}
              placeholder="Am  G  F  E7..."
            />
          </div>

          {error && <div style={s.error}>{error}</div>}

          <div style={s.actions}>
            <button style={s.btnPrimary} onClick={() => handleSave("draft")} disabled={loading}>
              Salvar rascunho
            </button>
            <button style={s.btnSecondary} onClick={() => handleSave("review")} disabled={loading}>
              Enviar para revisão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { background: "#0c0c0d", minHeight: "100vh", color: "#edeae4", fontFamily: "Georgia, serif" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: "0.5px solid rgba(255,255,255,0.07)" },
  logo: { fontSize: 16, letterSpacing: "0.12em", color: "#c8935a" },
  backBtn: { background: "none", border: "none", color: "#8a877f", fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif" },
  body: { padding: "32px", maxWidth: 700, margin: "0 auto", width: "100%" },
  title: { fontSize: 18, fontWeight: "normal", marginBottom: 24 },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 10, letterSpacing: "0.14em", color: "#4a4845" },
  input: { background: "#131314", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "10px 12px", fontSize: 13, color: "#edeae4", fontFamily: "Georgia, serif", outline: "none" },
  error: { fontSize: 12, color: "#e24b4a", background: "rgba(226,75,74,0.1)", padding: "8px 12px", borderRadius: 6 },
  actions: { display: "flex", gap: 12, marginTop: 8 },
  btnPrimary: { background: "#c8935a", color: "#1a0f05", border: "none", borderRadius: 8, padding: "11px 20px", fontSize: 12, letterSpacing: "0.08em", cursor: "pointer", fontFamily: "Georgia, serif" },
  btnSecondary: { background: "transparent", color: "#8a877f", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "11px 20px", fontSize: 12, letterSpacing: "0.08em", cursor: "pointer", fontFamily: "Georgia, serif" },
};