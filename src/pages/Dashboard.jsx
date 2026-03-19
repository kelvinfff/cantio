import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Music, Users, Shield, LogOut, Plus } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [compositions, setCompositions] = useState([]);
  const [pendingInvites, setPendingInvites] = useState(0);
  const [coauthorIds, setCoauthorIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/login"); return; }
      setUser(user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      const { data: ownComps } = await supabase
        .from("compositions")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      const { data: coauthorData } = await supabase
        .from("coauthors")
        .select("composition_id")
        .eq("user_id", user.id)
        .eq("accepted", true);

      const { data: pendingData } = await supabase
        .from("coauthors")
        .select("id")
        .eq("user_id", user.id)
        .eq("accepted", false);

      setPendingInvites(pendingData?.length || 0);

      let coauthorComps = [];
      let coauthorCompIds = [];
      if (coauthorData && coauthorData.length > 0) {
        coauthorCompIds = coauthorData.map((c) => c.composition_id);
        setCoauthorIds(coauthorCompIds);
        const { data: colabComps } = await supabase
          .from("compositions")
          .select("*")
          .in("id", coauthorCompIds)
          .order("created_at", { ascending: false });
        coauthorComps = colabComps || [];
      }

      const allComps = [...(ownComps || []), ...coauthorComps];
      const unique = allComps.filter((c, i, arr) => arr.findIndex((x) => x.id === c.id) === i);
      setCompositions(unique);
      setLoading(false);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) return <div style={s.page}><div style={s.loading}>Carregando...</div></div>;

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.logo}>CANTIO</div>
        <div style={s.navRight}>
          {profile && <div style={s.userName}>{profile.full_name}</div>}
          <button style={s.invitesBtn} onClick={() => navigate("/invites")}>
            Convites
            {pendingInvites > 0 && (
              <span style={s.badge}>{pendingInvites}</span>
            )}
          </button>
          <button style={s.logoutBtn} onClick={handleLogout}>
            <LogOut size={14} color="#4a4845" />
          </button>
        </div>
      </nav>

      <div style={s.body}>
        <div style={s.header}>
          <div style={s.title}>Minhas composições</div>
          <button style={s.newBtn} onClick={() => navigate("/compose")}>
            <Plus size={14} color="#1a0f05" /> Nova composição
          </button>
        </div>

        {compositions.length === 0 ? (
          <div style={s.empty}>
            <Music size={32} color="#4a4845" />
            <div style={s.emptyText}>Nenhuma composição ainda</div>
            <div style={s.emptySub}>Clique em "Nova composição" para começar</div>
          </div>
        ) : (
          <div style={s.grid}>
            {compositions.map((c) => {
              const isCoauthor = coauthorIds.includes(c.id);
              return (
                <div key={c.id} style={s.card} onClick={() => navigate(`/composition/${c.id}`)}>
                  <div style={s.cardTop}>
                    <div style={s.cardGenre}>{c.genre || "—"}</div>
                    {isCoauthor && <div style={s.coauthorTag}>coautor</div>}
                  </div>
                  <div style={s.cardTitle}>{c.title}</div>
                  <div style={s.cardMeta}>
                    {c.key && `Tom: ${c.key}`}{c.key && c.bpm && " · "}{c.bpm && `${c.bpm} bpm`}
                  </div>
                  <div style={{
                    ...s.statusDot,
                    background: c.status === "done" ? "#5a9e7a" : c.status === "review" ? "#c8935a" : "#4a4845"
                  }} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
  }

const s = {
  page: { background: "#0c0c0d", minHeight: "100vh", color: "#edeae4", fontFamily: "Georgia, serif" },
  loading: { display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#4a4845", fontSize: 13 },
  nav: { display: "flex", alignItems: "center", padding: "16px 32px", borderBottom: "0.5px solid rgba(255,255,255,0.07)" },
  logo: { fontSize: 16, letterSpacing: "0.12em", color: "#c8935a" },
  navRight: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 },
  userName: { fontSize: 12, color: "#8a877f" },
  logoutBtn: { background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" },
  body: { padding: "32px", maxWidth: 900, margin: "0 auto", width: "100%" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  title: { fontSize: 18, fontWeight: "normal", color: "#edeae4" },
  newBtn: { display: "flex", alignItems: "center", gap: 6, background: "#c8935a", color: "#1a0f05", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, letterSpacing: "0.08em", cursor: "pointer", fontFamily: "Georgia, serif" },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: 12 },
  emptyText: { fontSize: 14, color: "#4a4845" },
  emptySub: { fontSize: 12, color: "#2a2826" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 },
  card: { background: "#131314", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "16px", cursor: "pointer" },
  cardGenre: { fontSize: 10, color: "#c8935a", letterSpacing: "0.1em", background: "rgba(200,147,90,0.12)", padding: "2px 8px", borderRadius: 8, display: "inline-block", marginBottom: 8 },
  cardTitle: { fontSize: 13, color: "#edeae4", marginBottom: 6 },
  cardMeta: { fontSize: 11, color: "#4a4845" },
  statusDot: { width: 6, height: 6, borderRadius: "50%", marginTop: 10 },
  invitesBtn: { background: "transparent", border: "0.5px solid rgba(255,255,255,0.1)", color: "#8a877f", fontSize: 11, letterSpacing: "0.08em", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: "Georgia, serif" },
  invitesBtn: { background: "transparent", border: "0.5px solid rgba(255,255,255,0.1)", color: "#8a877f", fontSize: 11, letterSpacing: "0.08em", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", gap: 6 },
  badge: { background: "#c8935a", color: "#1a0f05", fontSize: 10, fontWeight: "500", padding: "1px 6px", borderRadius: 8 },
  cardTop: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  coauthorTag: { fontSize: 9, color: "#5a82c8", background: "rgba(90,130,200,0.12)", padding: "2px 7px", borderRadius: 8, letterSpacing: "0.08em" },
};