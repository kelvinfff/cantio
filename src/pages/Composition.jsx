import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";

export default function Composition() {
  const { id } = useParams();
  const [composition, setComposition] = useState(null);
  const [coauthors, setCoauthors] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Coautor");
  const [inviteError, setInviteError] = useState(null);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/login"); return; }
      setCurrentUser(user);

      const { data, error } = await supabase
        .from("compositions")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) { navigate("/dashboard"); return; }
      setComposition(data);

      const { data: coauthorData } = await supabase
        .from("coauthors")
        .select("*")
        .eq("composition_id", id);
      setCoauthors(coauthorData || []);

      setLoading(false);
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta composição?")) return;
    await supabase.from("compositions").delete().eq("id", id);
    navigate("/dashboard");
  };

  const handleInvite = async () => {
    setInviteError(null);
    setInviteSuccess(false);

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", inviteEmail)
      .single();

    if (profileError || !profileData) {
      setInviteError("Compositor não encontrado com esse email.");
      return;
    }

    if (profileData.id === currentUser.id) {
      setInviteError("Você não pode convidar a si mesmo.");
      return;
    }

    const { error } = await supabase.from("coauthors").insert({
      composition_id: id,
      user_id: profileData.id,
      role: inviteRole,
      accepted: false,
    });

    if (error) {
      setInviteError(error.message);
      return;
    }

    setInviteSuccess(true);
    setInviteEmail("");
    const { data: coauthorData } = await supabase
      .from("coauthors")
      .select("*")
      .eq("composition_id", id);
    setCoauthors(coauthorData || []);
  };

  const statusLabel = {
    draft: "Rascunho",
    review: "Em revisão",
    done: "Finalizada",
  };

  const statusColor = {
    draft: "#4a4845",
    review: "#c8935a",
    done: "#5a9e7a",
  };

  if (loading) return <div style={s.page}><div style={s.loading}>Carregando...</div></div>;

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.logo}>CANTIO</div>
        <button style={s.backBtn} onClick={() => navigate("/dashboard")}>
          ← Voltar
        </button>
      </nav>

      <div style={s.body}>
        <div style={s.header}>
          <div>
            <div style={s.genre}>{composition.genre}</div>
            <h1 style={s.title}>{composition.title}</h1>
            <div style={s.meta}>
              {composition.key && `Tom: ${composition.key}`}
              {composition.key && composition.bpm && " · "}
              {composition.bpm && `${composition.bpm} bpm`}
            </div>
          </div>
          <div style={s.actions}>
            <div style={{ ...s.status, background: `${statusColor[composition.status]}22`, color: statusColor[composition.status] }}>
              {statusLabel[composition.status]}
            </div>
            <button style={s.iconBtn} onClick={() => navigate(`/compose/${id}`)}>
              <Edit size={15} color="#8a877f" />
            </button>
            <button style={s.iconBtn} onClick={handleDelete}>
              <Trash2 size={15} color="#8a877f" />
            </button>
          </div>
        </div>

        <div style={s.divider} />

        {composition.lyrics && (
          <div style={s.section}>
            <div style={s.sectionLabel}>LETRA</div>
            <div style={s.lyrics}>{composition.lyrics}</div>
          </div>
        )}

        {composition.chords && (
          <div style={s.section}>
            <div style={s.sectionLabel}>CIFRA</div>
            <div style={s.chords}>{composition.chords}</div>
          </div>
        )}

        {!composition.lyrics && !composition.chords && (
          <div style={s.empty}>Nenhum conteúdo adicionado ainda.</div>
        )}

        <div style={s.divider} />

        {composition.owner_id === currentUser?.id && (
          <div style={s.section}>
            <div style={s.sectionLabel}>COAUTORES</div>

            {coauthors.length > 0 && (
              <div style={s.coauthorList}>
                {coauthors.map((c) => (
                  <div key={c.id} style={s.coauthorItem}>
                    <div style={s.coauthorRole}>{c.role}</div>
                    <div style={{ ...s.coauthorStatus, color: c.accepted ? "#5a9e7a" : "#c8935a" }}>
                      {c.accepted ? "Aceito" : "Pendente"}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={s.inviteForm}>
              <div style={s.field}>
                <div style={s.sectionLabel}>CONVIDAR COMPOSITOR</div>
                <input
                  style={s.input}
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email do compositor..."
                />
              </div>
              <div style={s.field}>
                <div style={s.sectionLabel}>PAPEL</div>
                <select
                  style={s.input}
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                >
                  <option>Coautor</option>
                  <option>Letrista</option>
                  <option>Arranjador</option>
                  <option>Melodista</option>
                </select>
              </div>
              {inviteError && <div style={s.error}>{inviteError}</div>}
              {inviteSuccess && <div style={s.success}>Convite enviado com sucesso!</div>}
              <button style={s.btnPrimary} onClick={handleInvite}>
                Enviar convite
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { background: "#0c0c0d", minHeight: "100vh", color: "#edeae4", fontFamily: "Georgia, serif" },
  loading: { display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#4a4845", fontSize: 13 },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: "0.5px solid rgba(255,255,255,0.07)" },
  logo: { fontSize: 16, letterSpacing: "0.12em", color: "#c8935a" },
  backBtn: { background: "none", border: "none", color: "#8a877f", fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif" },
  body: { padding: "32px", maxWidth: 700, margin: "0 auto", width: "100%" },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 },
  genre: { fontSize: 10, color: "#c8935a", letterSpacing: "0.1em", background: "rgba(200,147,90,0.12)", padding: "2px 8px", borderRadius: 8, display: "inline-block", marginBottom: 8 },
  title: { fontSize: 24, fontWeight: "normal", color: "#edeae4", marginBottom: 8 },
  meta: { fontSize: 12, color: "#4a4845" },
  actions: { display: "flex", alignItems: "center", gap: 8 },
  status: { fontSize: 11, padding: "4px 10px", borderRadius: 8 },
  iconBtn: { background: "none", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 6, padding: "6px 8px", cursor: "pointer", display: "flex", alignItems: "center" },
  divider: { height: "0.5px", background: "rgba(255,255,255,0.07)", margin: "24px 0" },
  section: { marginBottom: 32 },
  sectionLabel: { fontSize: 10, letterSpacing: "0.14em", color: "#4a4845", marginBottom: 12 },
  lyrics: { fontSize: 14, color: "#edeae4", lineHeight: 2, whiteSpace: "pre-wrap" },
  chords: { fontSize: 13, color: "#8a877f", fontFamily: "monospace", lineHeight: 2, whiteSpace: "pre-wrap" },
  empty: { fontSize: 13, color: "#4a4845", textAlign: "center", padding: "48px 0" },
  coauthorList: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 },
  coauthorItem: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#131314", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "10px 14px" },
  coauthorRole: { fontSize: 12, color: "#edeae4" },
  coauthorStatus: { fontSize: 11 },
  inviteForm: { display: "flex", flexDirection: "column", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  input: { background: "#1a1a1c", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "10px 12px", fontSize: 13, color: "#edeae4", fontFamily: "Georgia, serif", outline: "none" },
  error: { fontSize: 12, color: "#e24b4a", background: "rgba(226,75,74,0.1)", padding: "8px 12px", borderRadius: 6 },
  success: { fontSize: 12, color: "#5a9e7a", background: "rgba(90,158,122,0.1)", padding: "8px 12px", borderRadius: 6 },
  btnPrimary: { background: "#c8935a", color: "#1a0f05", border: "none", borderRadius: 8, padding: "11px 20px", fontSize: 12, letterSpacing: "0.08em", cursor: "pointer", fontFamily: "Georgia, serif", alignSelf: "flex-start" },
};