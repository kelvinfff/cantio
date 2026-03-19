import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Invites() {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate("/login"); return; }

        const { data: coauthorData } = await supabase
        .from("coauthors")
        .select("*")
        .eq("user_id", user.id)
        .eq("accepted", false);

        if (!coauthorData || coauthorData.length === 0) {
        setInvites([]);
        setLoading(false);
        return;
        }

        const compositionIds = coauthorData.map((c) => c.composition_id);

        const { data: compositionsData } = await supabase
        .from("compositions")
        .select("id, title, genre")
        .in("id", compositionIds);

        const merged = coauthorData.map((c) => ({
        ...c,
        compositions: compositionsData?.find((comp) => comp.id === c.composition_id) || null,
        }));

        setInvites(merged);
        setLoading(false);
    };
    load();
    }, []);

  const handleAccept = async (inviteId) => {
    await supabase
      .from("coauthors")
      .update({ accepted: true })
      .eq("id", inviteId);
    setInvites(invites.filter((i) => i.id !== inviteId));
  };

  const handleDecline = async (inviteId) => {
    await supabase
      .from("coauthors")
      .delete()
      .eq("id", inviteId);
    setInvites(invites.filter((i) => i.id !== inviteId));
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
        <div style={s.title}>Convites pendentes</div>

        {invites.length === 0 ? (
          <div style={s.empty}>Nenhum convite pendente.</div>
        ) : (
          <div style={s.list}>
            {invites.map((invite) => (
              <div key={invite.id} style={s.card}>
                <div>
                  <div style={s.genre}>{invite.compositions?.genre}</div>
                  <div style={s.compTitle}>{invite.compositions?.title}</div>
                  <div style={s.role}>Papel: {invite.role}</div>
                </div>
                <div style={s.actions}>
                  <button style={s.btnAccept} onClick={() => handleAccept(invite.id)}>
                    Aceitar
                  </button>
                  <button style={s.btnDecline} onClick={() => handleDecline(invite.id)}>
                    Recusar
                  </button>
                </div>
              </div>
            ))}
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
  title: { fontSize: 18, fontWeight: "normal", marginBottom: 24 },
  empty: { fontSize: 13, color: "#4a4845", textAlign: "center", padding: "48px 0" },
  list: { display: "flex", flexDirection: "column", gap: 12 },
  card: { background: "#131314", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  genre: { fontSize: 10, color: "#c8935a", letterSpacing: "0.1em", background: "rgba(200,147,90,0.12)", padding: "2px 8px", borderRadius: 8, display: "inline-block", marginBottom: 6 },
  compTitle: { fontSize: 14, color: "#edeae4", marginBottom: 4 },
  role: { fontSize: 11, color: "#4a4845" },
  actions: { display: "flex", gap: 8 },
  btnAccept: { background: "#5a9e7a", color: "#0a1f14", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 11, cursor: "pointer", fontFamily: "Georgia, serif" },
  btnDecline: { background: "transparent", color: "#8a877f", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 16px", fontSize: 11, cursor: "pointer", fontFamily: "Georgia, serif" },
};