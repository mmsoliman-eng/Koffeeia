import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════
//  KOFFEEIA COMPLETE — كل المميزات
// ═══════════════════════════════════════════════

// ── MOCK DATA ──
const PROVIDERS = [
  { id:1, name:"عيادة د. أحمد سالم", type:"طبيب", icon:"🏥", rating:4.8, reviews:234, avgTime:7, queue:12, open:true, peak:"10ص-12ظ", quiet:"2ع-4ع", premium:true, lat:24.68, lng:46.72, whatsapp:"+966501234567", desc:"متخصص في الباطنية والأمراض المزمنة" },
  { id:2, name:"صالون ستايل", type:"حلاق", icon:"💈", rating:4.5, reviews:189, avgTime:20, queue:4, open:true, peak:"5ع-9م", quiet:"10ص-12ظ", premium:false, lat:24.69, lng:46.73, whatsapp:"+966502345678", desc:"صالون رجالي متكامل" },
  { id:3, name:"بنك الرياض", type:"بنك", icon:"🏦", rating:3.9, reviews:412, avgTime:15, queue:23, open:true, peak:"9ص-11ص", quiet:"2ع-4ع", premium:true, lat:24.70, lng:46.71, whatsapp:"+966503456789", desc:"خدمات مصرفية شاملة" },
  { id:4, name:"مطعم الأصالة", type:"مطعم", icon:"🍽", rating:4.7, reviews:567, avgTime:45, queue:8, open:true, peak:"1ظ-3ع", quiet:"6م-8م", premium:false, lat:24.67, lng:46.74, whatsapp:"+966504567890", desc:"مأكولات عربية أصيلة" },
  { id:5, name:"مركز خدمة المواطن", type:"حكومي", icon:"🏛", rating:3.5, reviews:892, avgTime:30, queue:45, open:false, peak:"8ص-11ص", quiet:"12ظ-2ع", premium:false, lat:24.71, lng:46.70, whatsapp:"+966505678901", desc:"خدمات حكومية متنوعة" },
  { id:6, name:"صيدلية الشفاء", type:"صيدلية", icon:"💊", rating:4.6, reviews:145, avgTime:5, queue:3, open:true, peak:"6م-9م", quiet:"9ص-12ظ", premium:false, lat:24.69, lng:46.72, whatsapp:"+966506789012", desc:"أدوية وصرف وصفات" },
];

const REWARDS = [
  { id:1, title:"قهوة مجانية", pts:500, icon:"☕", partner:"ستاربكس" },
  { id:2, title:"خصم 20% على الوجبة", pts:800, icon:"🍔", partner:"مطعم الأصالة" },
  { id:3, title:"كشف طبي مجاني", pts:1200, icon:"🏥", partner:"عيادة د. أحمد" },
  { id:4, title:"قسيمة 50 ريال", pts:1500, icon:"🎁", partner:"أي متجر" },
  { id:5, title:"اشتراك مميز شهر", pts:2000, icon:"⭐", partner:"Koffeeia" },
  { id:6, title:"خصم 30% حلاقة", pts:600, icon:"💈", partner:"صالون ستايل" },
];

const BOOKINGS_SLOTS = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30"];

const ACHIEVEMENTS = [
  { id:"first", icon:"🎯", title:"أول دور", desc:"أخذت دورك لأول مرة", pts:50, unlocked:true },
  { id:"patient", icon:"🧘", title:"صابر", desc:"انتظرت أكثر من 30 دقيقة", pts:100, unlocked:true },
  { id:"reader", icon:"📚", title:"قارئ", desc:"قرأت 5 قصص", pts:150, unlocked:false },
  { id:"gamer", icon:"🎮", title:"لاعب", desc:"لعبت 10 ألعاب", pts:150, unlocked:false },
  { id:"loyal", icon:"❤️", title:"مخلص", desc:"زرت 10 مرات", pts:200, unlocked:false },
  { id:"reviewer", icon:"⭐", title:"ناقد", desc:"قيّمت 5 أماكن", pts:100, unlocked:false },
  { id:"premium", icon:"👑", title:"مميز", desc:"اشتركت بالخطة المميزة", pts:500, unlocked:false },
  { id:"early", icon:"🌅", title:"باكر", desc:"خذت دوراً قبل 8 صباحاً", pts:75, unlocked:true },
];

const ADS = [
  { id:1, brand:"ستاربكس", text:"اشرب قهوتك وأنت تنتظر — اطلب الآن واستلم في وقت دورك!", icon:"☕", color:"#00704A", bg:"rgba(0,112,74,.08)" },
  { id:2, brand:"أمازون", text:"تسوّق خلال الانتظار! توصيل سريع لباب بيتك", icon:"📦", color:"#FF9900", bg:"rgba(255,153,0,.08)" },
  { id:3, brand:"نتفليكس", text:"ابدأ مسلسلك الجديد وأنت تنتظر — جرّب مجاناً", icon:"🎬", color:"#E50914", bg:"rgba(229,9,20,.08)" },
];

// ── COLORS ──
const GOLD = "#C8963E";
const GREEN = "#2ECC9A";
const BLUE = "#5B8DEF";
const RED = "#FF5252";
const PURPLE = "#A855F7";
const CYAN = "#00E5FF";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  ::-webkit-scrollbar{width:3px;height:3px;}
  ::-webkit-scrollbar-thumb{background:rgba(200,150,62,.3);border-radius:4px;}
  button:active{opacity:.8;}
  input:focus,textarea:focus,select:focus{outline:none;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes wave{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
  @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(200,150,62,.3)}50%{box-shadow:0 0 44px rgba(200,150,62,.7)}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @keyframes slideLeft{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
  @keyframes popIn{0%{transform:scale(.8);opacity:0}100%{transform:scale(1);opacity:1}}
  @keyframes countUp{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}
`;

// ── MINI COMPONENTS ──
const Logo = ({ size = 34, dark = true }) => (
  <div style={{ display:"flex", alignItems:"center", gap:9 }}>
    <div style={{ width:size, height:size, borderRadius:"50%", background:"#C8963E", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 18px rgba(200,150,62,.45)", flexShrink:0, animation:"glow 3s ease-in-out infinite" }}>
      <svg width={size*.58} height={size*.58} viewBox="0 0 24 24" fill="none">
        <path d="M18 4C18 4 20 8 20 12C20 16 18 20 12 20C6 20 4 16 4 12C4 8 6 4 8 4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="3" fill="#fff" opacity=".85"/>
      </svg>
    </div>
    <span style={{ fontSize:size*.56, fontWeight:900, color: dark ? "#FFFFFF" : "#1A1730", letterSpacing:.3 }}>Koffeeia</span>
  </div>
);

const Badge = ({ color, bg, children, small }) => (
  <span style={{ padding: small?"2px 8px":"4px 12px", borderRadius:20, fontSize:small?9:11, fontWeight:700, background:bg||`rgba(200,150,62,.12)`, color:color||GOLD, border:`1px solid ${(color||GOLD)}33`, display:"inline-flex", alignItems:"center", gap:4 }}>
    {children}
  </span>
);

const Stars = ({ rating, size=14 }) => (
  <div style={{ display:"flex", alignItems:"center", gap:3 }}>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ fontSize:size, color: i<=Math.floor(rating)?"#F0A500":i-rating<1?"#F0A500":"rgba(255,255,255,.2)" }}>
        {i-rating<1&&i-rating>0 ? "⭐" : i<=rating ? "⭐" : "☆"}
      </span>
    ))}
    <span style={{ fontSize:size-2, color:"rgba(255,255,255,.5)", marginRight:3, fontFamily:"monospace" }}>{rating}</span>
  </div>
);

const ProgressBar = ({ value, max, color=GOLD, height=6 }) => (
  <div style={{ height, background:"rgba(255,255,255,.07)", borderRadius:height, overflow:"hidden" }}>
    <div style={{ height:"100%", width:`${Math.min(100,(value/max)*100)}%`, background:`linear-gradient(90deg,${color},${color}99)`, borderRadius:height, transition:"width .6s ease", boxShadow:`0 0 8px ${color}44` }}/>
  </div>
);

const Toggle = ({ on, onChange }) => (
  <button onClick={onChange} style={{ width:42, height:22, borderRadius:11, border:"none", cursor:"pointer", background:on?GREEN:"rgba(255,255,255,.12)", position:"relative", transition:".3s", flexShrink:0 }}>
    <div style={{ position:"absolute", width:16, height:16, borderRadius:"50%", background:"#fff", top:3, right:on?3:"calc(100% - 19px)", transition:".3s", boxShadow:"0 1px 4px rgba(0,0,0,.3)" }}/>
  </button>
);

const WaveLoader = ({ color=GOLD }) => (
  <div style={{ display:"flex", gap:3, alignItems:"center" }}>
    {[0,1,2,3,4].map(i => (
      <div key={i} style={{ width:3, height:18, background:color, borderRadius:4, animation:`wave 1.1s ease-in-out infinite`, animationDelay:`${i*.13}s` }}/>
    ))}
  </div>
);

// ── TOAST SYSTEM ──
const ToastContainer = ({ toasts, remove }) => (
  <div style={{ position:"fixed", top:16, left:"50%", transform:"translateX(-50%)", zIndex:9999, display:"flex", flexDirection:"column", gap:8, alignItems:"center", pointerEvents:"none" }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        padding:"11px 20px", borderRadius:14, fontWeight:700, fontSize:14,
        background: t.type==="success"?"#0a2a1a":t.type==="error"?"#2a0a0a":t.type==="pts"?"rgba(200,150,62,.95)":"#0a1a2a",
        border:`1px solid ${t.type==="success"?"rgba(46,204,154,.4)":t.type==="error"?"rgba(255,82,82,.4)":t.type==="pts"?"rgba(200,150,62,.6)":"rgba(91,141,239,.4)"}`,
        color: t.type==="success"?GREEN:t.type==="error"?RED:t.type==="pts"?"#000":BLUE,
        boxShadow:"0 8px 32px rgba(0,0,0,.5)", animation:"fadeUp .3s ease", whiteSpace:"nowrap",
        display:"flex", alignItems:"center", gap:8, pointerEvents:"auto", maxWidth:"88vw",
      }}>
        <span style={{ flex:1 }}>{t.msg}</span>
        <button onClick={()=>remove(t.id)} style={{ background:"none",border:"none",color:"inherit",cursor:"pointer",fontSize:16,opacity:.7 }}>×</button>
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════
export default function KoffeiComplete() {
  // ── STATE ──
  const [screen, setScreen] = useState("splash");
  const [role, setRole] = useState(null);
  const [dark, setDark] = useState(true);
  const [tab, setTab] = useState("home");
  const [toasts, setToasts] = useState([]);
  const [points, setPoints] = useState(1250);
  const [isPremium, setIsPremium] = useState(false);
  const [myQueue, setMyQueue] = useState(null);
  const [queueServing, setQueueServing] = useState(3);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showRating, setShowRating] = useState(null);
  const [showBooking, setShowBooking] = useState(null);
  const [showRewards, setShowRewards] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDisplay, setShowDisplay] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [notifications, setNotifications] = useState({ push:true, whatsapp:true, sound:true, voice:false });
  const [adIndex, setAdIndex] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [bookingSlot, setBookingSlot] = useState(null);
  const [providerQueue, setProviderQueue] = useState([
    {id:1,name:"أحمد م.",n:1,st:"current"},{id:2,name:"فاطمة ع.",n:2,st:"waiting"},
    {id:3,name:"خالد س.",n:3,st:"waiting"},{id:4,name:"نورة ك.",n:4,st:"waiting"},{id:5,name:"يوسف م.",n:5,st:"waiting"},
  ]);
  const [providerMode, setProviderMode] = useState("manual");
  const [ratingVal, setRatingVal] = useState(0);
  const [ratingText, setRatingText] = useState("");
  const [ratings, setRatings] = useState({1:4.8,2:4.5,3:3.9,4:4.7,5:3.5,6:4.6});
  const [achievements, setAchievements] = useState(ACHIEVEMENTS);
  const [visitHistory] = useState([
    {id:1,place:"عيادة د. أحمد",date:"أمس",wait:12,pts:120},{id:2,place:"صالون ستايل",date:"3 أيام",wait:8,pts:80},{id:3,place:"بنك الرياض",date:"أسبوع",wait:25,pts:250},
  ]);

  const toastId = useRef(0);
  const autoAdRef = useRef(null);

  const C = {
    bg:    dark?"#07070F":"#F4F1EC",
    s1:    dark?"#0D0D1E":"#FFFFFF",
    s2:    dark?"#131328":"#F0EDE8",
    s3:    dark?"#1A1A35":"#E5E0D8",
    txt:   dark?"#EDE8FF":"#1A1730",
    muted: dark?"rgba(237,232,255,.42)":"rgba(26,23,48,.42)",
    bdr:   dark?"rgba(255,255,255,.07)":"rgba(0,0,0,.08)",
  };

  const W = { minHeight:"100vh", maxWidth:440, margin:"0 auto", background:C.bg, color:C.txt, fontFamily:"'Tajawal',sans-serif", direction:"rtl", display:"flex", flexDirection:"column", position:"relative" };

  // ── TOAST ──
  const toast = useCallback((msg, type="success") => {
    const id = ++toastId.current;
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
  }, []);

  const addPoints = (p, reason) => {
    setPoints(prev => prev + p);
    toast(`+${p} نقطة — ${reason} 🎉`, "pts");
  };

  // ── SPLASH ──
  useEffect(() => {
    if (screen === "splash") { const t = setTimeout(() => setScreen("onboard"), 2200); return () => clearTimeout(t); }
  }, [screen]);

  // ── ADS DISABLED (مبدئياً — معطّلة بالكامل) ──
  // تم تعطيل الإعلانات حسب الطلب. لإعادة تفعيلها لاحقاً، استبدل هذا التعليق
  // بالكود الأصلي: setInterval لعرض إعلان كل 30 ثانية.

  // ── AUTO QUEUE (for provider) ──
  useEffect(() => {
    if (role === "provider" && providerMode === "auto") {
      const id = setInterval(() => callNext(), 10000);
      return () => clearInterval(id);
    }
  }, [role, providerMode]);

  // ── NEAR TURN ALERT ──
  useEffect(() => {
    if (myQueue && queueServing === myQueue.n - 2) {
      toast(`⚠️ دورك بعد شخصين — استعد!`, "info");
      if (notifications.whatsapp) toast(`📱 تم إرسال تنبيه واتساب: "دورك قريب!"`, "info");
    }
    if (myQueue && queueServing === myQueue.n - 1) {
      toast(`🔔 دورك القادم مباشرة! توجّه الآن`, "success");
      addPoints(5, "قربت من الدور");
    }
    if (myQueue && queueServing === myQueue.n) {
      toast(`🎉 ${myQueue.provider} — حان دورك الآن!`, "success");
      addPoints(10, "انتهيت من الانتظار");
    }
  }, [queueServing]);

  const callNext = () => {
    setProviderQueue(prev => prev.map(p => p.n === queueServing ? {...p,st:"done"} : p.n === queueServing+1 ? {...p,st:"current"} : p));
    setQueueServing(s => s + 1);
    toast(`📣 استدعاء رقم ${queueServing + 1}`, "info");
  };

  const joinQueue = (provider) => {
    const n = provider.queue + 1;
    const wait = n * provider.avgTime;
    setMyQueue({ n, provider:provider.name, providerId:provider.id, wait, joinTime: new Date().toLocaleTimeString("ar",{hour:"2-digit",minute:"2-digit"}) });
    toast(`✅ انضممت لطابور ${provider.name} — رقمك: ${n}`, "success");
    addPoints(15, "انضمام للطابور");
    setSelectedProvider(null);
    setTab("queue");
  };

  const bookSlot = () => {
    if (!bookingSlot) return toast("اختر موعداً أولاً", "error");
    toast(`✅ تم حجز موعد ${bookingSlot} في ${showBooking?.name}`, "success");
    addPoints(20, "حجز موعد مسبق");
    setShowBooking(null);
    setBookingSlot(null);
  };

  const submitRating = () => {
    if (ratingVal === 0) return toast("اختر عدد النجوم", "error");
    setRatings(prev => ({ ...prev, [showRating.id]: ((prev[showRating.id]*100)+ratingVal*10)/110 }));
    toast(`⭐ تم إرسال تقييمك لـ ${showRating.name}`, "success");
    addPoints(25, "تقييم مقدم الخدمة");
    setShowRating(null); setRatingVal(0); setRatingText("");
  };

  const sendWhatsApp = (provider) => {
    toast(`📱 تم إرسال رسالة واتساب لـ ${provider.name}: "أريد حجز دور"`, "success");
    addPoints(5, "تواصل واتساب");
  };

  const redeemReward = (reward) => {
    if (points < reward.pts) return toast(`تحتاج ${reward.pts - points} نقطة إضافية`, "error");
    setPoints(p => p - reward.pts);
    toast(`🎁 تم استبدال: ${reward.title} من ${reward.partner}`, "success");
  };

  const upgradePremium = () => {
    setIsPremium(true);
    setShowPremium(false);
    setShowAd(false);
    clearInterval(autoAdRef.current);
    toast(`👑 مرحباً بك في Koffeeia Premium!`, "success");
    addPoints(500, "الاشتراك المميز");
    const ach = achievements.map(a => a.id==="premium" ? {...a, unlocked:true} : a);
    setAchievements(ach);
  };

  // ── HEADER ──
  const Header = ({ title, onBack, extra }) => (
    <div style={{ padding:"13px 18px 11px", background:dark?"rgba(7,7,15,.94)":"rgba(244,241,236,.94)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${C.bdr}`, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:60, flexShrink:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        {onBack && <button onClick={onBack} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:22,padding:4 }}>→</button>}
        {!onBack && <Logo size={28} dark={dark}/>}
        {title && <span style={{ fontSize:16, fontWeight:800 }}>{title}</span>}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        {extra}
        {!onBack && (
          <>
            {isPremium && <Badge color={GOLD} bg="rgba(200,150,62,.15)">👑 مميز</Badge>}
            <button onClick={() => setShowProfile(true)} style={{ display:"flex",alignItems:"center",gap:6,background:`rgba(200,150,62,.1)`,border:`1px solid rgba(200,150,62,.25)`,color:GOLD,padding:"5px 12px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit" }}>
              ⭐ {points.toLocaleString("ar")}
            </button>
            <button onClick={() => setDark(!dark)} style={{ background:"rgba(255,255,255,.06)",border:`1px solid ${C.bdr}`,color:C.muted,width:30,height:30,borderRadius:9,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center" }}>{dark?"☀️":"🌙"}</button>
          </>
        )}
      </div>
    </div>
  );

  // ── CARD ──
  const Card = ({ children, style={}, glow }) => (
    <div style={{ background:C.s1, border:`1px solid ${C.bdr}`, borderRadius:20, overflow:"hidden", boxShadow:glow?`0 8px 32px ${glow}22`:"none", ...style }}>{children}</div>
  );

  // ─────────────────────────────────────────
  //  SCREENS
  // ─────────────────────────────────────────

  // ── SPLASH ──
  if (screen === "splash") return (
    <div style={{...W, alignItems:"center", justifyContent:"center", background:"#07070F"}}>
      <style>{CSS}</style>
      <div style={{ animation:"bounce 2s ease-in-out infinite" }}><Logo size={80}/></div>
      <p style={{ color:"rgba(200,150,62,.6)", marginTop:18, fontSize:15 }}>وقتك أثمن من أن ينتظر</p>
      <div style={{ marginTop:36 }}><WaveLoader/></div>
    </div>
  );

  // ── ONBOARD ──
  if (screen === "onboard") return (
    <div style={W}>
      <style>{CSS}</style>
      <div style={{ background:"linear-gradient(170deg,#0D0D22,#130D30)", padding:"52px 22px 36px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute",width:300,height:300,borderRadius:"50%",background:"rgba(200,150,62,.07)",filter:"blur(80px)",top:-100,right:-80,pointerEvents:"none" }}/>
        <Logo size={52}/>
        <h1 style={{ fontSize:28, fontWeight:900, marginTop:14, marginBottom:6, lineHeight:1.3 }}>حوّل انتظارك<br/><span style={{ color:GOLD }}>إلى تجربة ممتعة</span></h1>
        <p style={{ color:C.muted, fontSize:14, marginBottom:28, lineHeight:1.8 }}>طوابير ذكية · نقاط مكافآت · حجز مسبق · ألعاب وقصص</p>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {["⏰ طابور ذكي","⭐ نقاط","📅 حجز","📱 واتساب","🎮 ألعاب","🔒 آمن"].map(f => (
            <Badge key={f} color="rgba(200,150,62,.8)" bg="rgba(200,150,62,.1)">{f}</Badge>
          ))}
        </div>
      </div>
      <div style={{ padding:"24px 22px", display:"flex", flexDirection:"column", gap:12, flex:1 }}>
        <button onClick={()=>{setRole("user");setScreen("app");setTab("home");}} style={{ width:"100%",padding:"15px",borderRadius:16,background:`linear-gradient(135deg,${GOLD},#E8B055)`,border:"none",color:"#fff",fontWeight:800,fontSize:16,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 6px 24px rgba(200,150,62,.35)`,display:"flex",alignItems:"center",justifyContent:"center",gap:10 }}>
          <span style={{ fontSize:20 }}>👤</span> دخول كمستخدم
        </button>
        <button onClick={()=>{setRole("provider");setScreen("app");setTab("dashboard");}} style={{ width:"100%",padding:"14px",borderRadius:16,background:"transparent",border:`1.5px solid rgba(200,150,62,.35)`,color:GOLD,fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:10 }}>
          <span style={{ fontSize:20 }}>🏥</span> دخول كمقدم خدمة
        </button>
        <div style={{ background:"rgba(200,150,62,.06)",border:`1px solid rgba(200,150,62,.18)`,borderRadius:14,padding:"12px 16px",textAlign:"center" }}>
          <p style={{ fontSize:11,color:C.muted,fontFamily:"'JetBrains Mono',monospace" }}>🔑 demo@test.com / 1234</p>
        </div>
      </div>
    </div>
  );

  // ── PREMIUM MODAL ──
  const PremiumModal = () => (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:200,display:"flex",alignItems:"flex-end",backdropFilter:"blur(8px)" }} onClick={()=>setShowPremium(false)}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"100%",maxWidth:440,margin:"0 auto",background:C.s1,borderRadius:"24px 24px 0 0",padding:"28px 22px 40px",border:`1px solid rgba(200,150,62,.3)` }}>
        <div style={{ textAlign:"center",marginBottom:24 }}>
          <div style={{ fontSize:52,marginBottom:10,animation:"bounce 2s infinite" }}>👑</div>
          <h2 style={{ fontSize:24,fontWeight:900,color:GOLD,marginBottom:6 }}>Koffeeia Premium</h2>
          <p style={{ color:C.muted,fontSize:14,lineHeight:1.8 }}>استمتع بمزايا حصرية وأولوية في كل مكان</p>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:24 }}>
          {[
            { ic:"🏆", title:"شارة مميزة", desc:"شارة ذهبية في ملفك الشخصي" },
            { ic:"📱", title:"واتساب غير محدود", desc:"إشعارات فورية لكل دور" },
            { ic:"📅", title:"حجز مسبق أولوية", desc:"اختر وقتك قبل الجميع" },
            { ic:"📊", title:"إحصائيات متقدمة", desc:"تقارير تفصيلية لمقدمي الخدمة" },
            { ic:"⭐", title:"نقاط مضاعفة", desc:"2× نقاط على كل دور" },
          ].map((f,i) => (
            <div key={i} style={{ display:"flex",gap:12,alignItems:"center",padding:"10px 14px",background:C.s2,borderRadius:12,border:`1px solid ${C.bdr}` }}>
              <span style={{ fontSize:22 }}>{f.ic}</span>
              <div><p style={{ fontWeight:700,fontSize:14 }}>{f.title}</p><p style={{ fontSize:12,color:C.muted }}>{f.desc}</p></div>
            </div>
          ))}
        </div>
        <button onClick={upgradePremium} style={{ width:"100%",padding:"16px",borderRadius:16,background:`linear-gradient(135deg,${GOLD},#E8B055)`,border:"none",color:"#fff",fontWeight:900,fontSize:18,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 8px 28px rgba(200,150,62,.4)` }}>
          اشترك الآن — 9 ريال/شهر
        </button>
        <p style={{ textAlign:"center",fontSize:11,color:C.muted,marginTop:12 }}>إلغاء في أي وقت · بدون التزام</p>
      </div>
    </div>
  );

  // ── AD BANNER ──
  const AdBanner = () => {
    const ad = ADS[adIndex];
    return (
      <div style={{ margin:"12px 0",padding:"14px 16px",borderRadius:16,background:dark?ad.bg:"rgba(0,0,0,.04)",border:`1px solid ${ad.color}22`,display:"flex",gap:12,alignItems:"center",animation:"fadeUp .4s ease",position:"relative" }}>
        <span style={{ fontSize:28 }}>{ad.icon}</span>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:3 }}>
            <span style={{ fontSize:9,background:C.s2,padding:"1px 6px",borderRadius:6,color:C.muted,fontWeight:700 }}>إعلان</span>
            <span style={{ fontSize:11,fontWeight:800,color:ad.color }}>{ad.brand}</span>
          </div>
          <p style={{ fontSize:12,color:C.txt,lineHeight:1.5 }}>{ad.text}</p>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:5 }}>
          <button onClick={()=>setShowAd(false)} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16 }}>×</button>
          {!isPremium && <button onClick={()=>setShowPremium(true)} style={{ fontSize:9,padding:"2px 7px",borderRadius:8,background:`rgba(200,150,62,.15)`,border:`1px solid rgba(200,150,62,.3)`,color:GOLD,cursor:"pointer",fontWeight:700,fontFamily:"inherit" }}>أزل</button>}
        </div>
      </div>
    );
  };

  // ── PROVIDER CARD ──
  const ProviderCard = ({ p, compact }) => {
    const congestionColor = p.queue > 20 ? RED : p.queue > 10 ? "#F0A500" : GREEN;
    const congestionLevel = p.queue > 20 ? "ازدحام شديد" : p.queue > 10 ? "مزدحم" : "هادئ";
    return (
      <div onClick={()=>setSelectedProvider(p)} style={{ background:C.s1, border:`1px solid ${C.bdr}`, borderRadius:18, padding:compact?"14px":"18px", cursor:"pointer", transition:"border-color .2s", marginBottom:compact?8:12, animation:"fadeUp .3s ease" }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
          <div style={{ width:46,height:46,borderRadius:14,background:`rgba(200,150,62,.1)`,border:`1px solid rgba(200,150,62,.2)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{p.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4 }}>
              <p style={{ fontWeight:800,fontSize:15 }}>{p.name}</p>
              <div style={{ display:"flex",flexDirection:"column",gap:3,alignItems:"flex-end" }}>
                <Badge color={p.open?GREEN:RED} bg={p.open?"rgba(46,204,154,.1)":"rgba(255,82,82,.1)"} small>{p.open?"مفتوح":"مغلق"}</Badge>
                {p.premium && <Badge color={GOLD} small>👑</Badge>}
              </div>
            </div>
            <Stars rating={ratings[p.id]||p.rating} size={12}/>
            <div style={{ display:"flex",gap:12,marginTop:8,flexWrap:"wrap" }}>
              <span style={{ fontSize:12,color:C.muted,display:"flex",alignItems:"center",gap:4 }}>
                <span style={{ width:8,height:8,borderRadius:"50%",background:congestionColor,display:"inline-block",animation:p.queue>10?"pulse 1.5s infinite":"none" }}/>
                {p.queue} في الطابور · {congestionLevel}
              </span>
              <span style={{ fontSize:12,color:C.muted }}>⏱ ~{p.avgTime * Math.max(1,p.queue-2)} دقيقة</span>
            </div>
            {!compact && (
              <div style={{ marginTop:10,background:C.s2,borderRadius:10,padding:"8px 12px" }}>
                <p style={{ fontSize:11,color:C.muted }}>🕐 أهدأ وقت: <span style={{ color:GREEN,fontWeight:700 }}>{p.quiet}</span> · ذروة: <span style={{ color:RED,fontWeight:700 }}>{p.peak}</span></p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── PROVIDER DETAIL MODAL ──
  const ProviderDetail = () => {
    const p = selectedProvider;
    if (!p) return null;
    const waitTime = p.queue * p.avgTime;
    return (
      <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:150,display:"flex",alignItems:"flex-end",backdropFilter:"blur(6px)" }} onClick={()=>setSelectedProvider(null)}>
        <div onClick={e=>e.stopPropagation()} style={{ width:"100%",maxWidth:440,margin:"0 auto",background:C.s1,borderRadius:"24px 24px 0 0",padding:"24px 20px 40px",maxHeight:"85vh",overflowY:"auto" }}>
          {/* Header */}
          <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:20,paddingBottom:18,borderBottom:`1px solid ${C.bdr}` }}>
            <div style={{ width:56,height:56,borderRadius:16,background:"rgba(200,150,62,.1)",border:"1px solid rgba(200,150,62,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26 }}>{p.icon}</div>
            <div style={{ flex:1 }}>
              <h2 style={{ fontSize:18,fontWeight:900,marginBottom:4 }}>{p.name}</h2>
              <Stars rating={ratings[p.id]||p.rating} size={13}/>
              <p style={{ fontSize:12,color:C.muted,marginTop:3 }}>{p.desc}</p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18 }}>
            {[
              {label:"في الطابور",val:p.queue,icon:"👥",color:p.queue>15?RED:p.queue>8?"#F0A500":GREEN},
              {label:"وقت الانتظار",val:`~${waitTime}د`,icon:"⏱",color:GOLD},
              {label:"التقييم",val:(ratings[p.id]||p.rating).toFixed(1),icon:"⭐",color:"#F0A500"},
            ].map((s,i) => (
              <div key={i} style={{ background:C.s2,borderRadius:14,padding:"12px 10px",textAlign:"center",border:`1px solid ${C.bdr}` }}>
                <div style={{ fontSize:20,marginBottom:4 }}>{s.icon}</div>
                <div style={{ fontSize:18,fontWeight:900,color:s.color,fontFamily:"'JetBrains Mono',monospace" }}>{s.val}</div>
                <div style={{ fontSize:10,color:C.muted,marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Congestion Graph */}
          <div style={{ background:C.s2,borderRadius:14,padding:14,marginBottom:16,border:`1px solid ${C.bdr}` }}>
            <p style={{ fontSize:12,fontWeight:700,marginBottom:10 }}>📊 توقعات الازدحام اليوم</p>
            <div style={{ display:"flex",gap:4,alignItems:"flex-end",height:50 }}>
              {[20,45,80,95,60,30,70,85,50,25,40,60].map((h,i) => (
                <div key={i} style={{ flex:1,background:h>70?RED:h>50?"#F0A500":GREEN,borderRadius:"3px 3px 0 0",height:`${h}%`,opacity:.7,transition:".3s" }}/>
              ))}
            </div>
            <div style={{ display:"flex",justifyContent:"space-between",marginTop:6,fontSize:10,color:C.muted }}>
              <span>8ص</span><span>12ظ</span><span>4ع</span><span>8م</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {p.open && (
              <button onClick={()=>joinQueue(p)} style={{ padding:"14px",borderRadius:16,background:`linear-gradient(135deg,${GOLD},#E8B055)`,border:"none",color:"#fff",fontWeight:800,fontSize:16,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 6px 20px rgba(200,150,62,.3)`,display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
                🎫 خذ دورك الآن — رقم {p.queue+1}
              </button>
            )}
            <button onClick={()=>{setShowBooking(p);setSelectedProvider(null);}} style={{ padding:"13px",borderRadius:16,background:"rgba(91,141,239,.1)",border:`1.5px solid rgba(91,141,239,.3)`,color:BLUE,fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
              📅 احجز موعداً مسبقاً
            </button>
            <div style={{ display:"flex",gap:10 }}>
              <button onClick={()=>sendWhatsApp(p)} style={{ flex:1,padding:"12px",borderRadius:14,background:"rgba(37,211,102,.1)",border:"1px solid rgba(37,211,102,.3)",color:"#25D366",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
                💬 واتساب
              </button>
              <button onClick={()=>{setShowRating(p);setSelectedProvider(null);}} style={{ flex:1,padding:"12px",borderRadius:14,background:"rgba(240,165,0,.08)",border:"1px solid rgba(240,165,0,.25)",color:"#F0A500",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
                ⭐ قيّم
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── BOOKING MODAL ──
  const BookingModal = () => {
    const p = showBooking;
    if (!p) return null;
    const today = new Date().toLocaleDateString("ar-SA",{weekday:"long",day:"numeric",month:"long"});
    return (
      <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:150,display:"flex",alignItems:"flex-end",backdropFilter:"blur(6px)" }} onClick={()=>setShowBooking(null)}>
        <div onClick={e=>e.stopPropagation()} style={{ width:"100%",maxWidth:440,margin:"0 auto",background:C.s1,borderRadius:"24px 24px 0 0",padding:"24px 20px 40px" }}>
          <h2 style={{ fontSize:18,fontWeight:900,marginBottom:4 }}>📅 حجز موعد مسبق</h2>
          <p style={{ color:C.muted,fontSize:13,marginBottom:6 }}>{p.name}</p>
          <p style={{ fontSize:12,color:GOLD,marginBottom:18,fontWeight:700 }}>{today}</p>
          <p style={{ fontSize:13,fontWeight:700,marginBottom:12 }}>اختر الوقت المناسب:</p>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:20 }}>
            {BOOKINGS_SLOTS.map(slot => {
              const taken = ["09:00","10:00","14:00"].includes(slot);
              return (
                <button key={slot} onClick={()=>!taken&&setBookingSlot(slot)} style={{
                  padding:"10px 6px",borderRadius:12,border:"none",cursor:taken?"not-allowed":"pointer",
                  background:taken?"rgba(255,255,255,.04)":bookingSlot===slot?`linear-gradient(135deg,${GOLD},#E8B055)`:"rgba(255,255,255,.06)",
                  color:taken?C.muted:bookingSlot===slot?"#fff":C.txt,
                  fontWeight:700,fontSize:13,fontFamily:"inherit",
                  opacity:taken?.4:1,
                  textDecoration:taken?"line-through":"none",
                }}>{slot}</button>
              );
            })}
          </div>
          {bookingSlot && (
            <div style={{ background:"rgba(91,141,239,.08)",border:"1px solid rgba(91,141,239,.2)",borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",gap:10,alignItems:"center" }}>
              <span style={{ fontSize:20 }}>📅</span>
              <div>
                <p style={{ fontWeight:700,fontSize:14,color:BLUE }}>موعدك: {bookingSlot}</p>
                <p style={{ fontSize:12,color:C.muted }}>ستصلك تنبيهات قبل 30 و15 دقيقة</p>
              </div>
            </div>
          )}
          <button onClick={bookSlot} style={{ width:"100%",padding:"14px",borderRadius:16,background:bookingSlot?`linear-gradient(135deg,${BLUE},#3b82f6)`:"rgba(255,255,255,.06)",border:"none",color:bookingSlot?"#fff":C.muted,fontWeight:800,fontSize:16,cursor:bookingSlot?"pointer":"not-allowed",fontFamily:"inherit" }}>
            ✅ تأكيد الحجز
          </button>
        </div>
      </div>
    );
  };

  // ── RATING MODAL ──
  const RatingModal = () => {
    const p = showRating;
    if (!p) return null;
    return (
      <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:150,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(6px)" }} onClick={()=>setShowRating(null)}>
        <div onClick={e=>e.stopPropagation()} style={{ width:"100%",maxWidth:380,background:C.s1,borderRadius:24,padding:"28px 22px",border:`1px solid ${C.bdr}` }}>
          <h2 style={{ fontSize:18,fontWeight:900,marginBottom:4,textAlign:"center" }}>⭐ قيّم الخدمة</h2>
          <p style={{ color:C.muted,fontSize:13,marginBottom:20,textAlign:"center" }}>{p.name}</p>
          <div style={{ display:"flex",justifyContent:"center",gap:12,marginBottom:20 }}>
            {[1,2,3,4,5].map(i => (
              <button key={i} onClick={()=>setRatingVal(i)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:36,transform:i<=ratingVal?"scale(1.2)":"scale(1)",transition:"transform .2s",filter:i<=ratingVal?"none":"grayscale(1) opacity(.3)" }}>⭐</button>
            ))}
          </div>
          {ratingVal>0 && <p style={{ textAlign:"center",fontSize:13,color:GOLD,fontWeight:700,marginBottom:16 }}>{["","مقبول","جيد","جيد جداً","ممتاز","رائع!"][ratingVal]}</p>}
          <textarea value={ratingText} onChange={e=>setRatingText(e.target.value)} placeholder="أضف تعليقك (اختياري)..." style={{ width:"100%",padding:"11px 14px",borderRadius:12,background:C.s2,border:`1px solid ${C.bdr}`,color:C.txt,fontFamily:"inherit",fontSize:14,resize:"none",height:80,outline:"none",direction:"rtl",marginBottom:16 }}/>
          <button onClick={submitRating} style={{ width:"100%",padding:"13px",borderRadius:16,background:`linear-gradient(135deg,#F0A500,#ffc947)`,border:"none",color:"#000",fontWeight:800,fontSize:16,cursor:"pointer",fontFamily:"inherit" }}>
            إرسال التقييم — +25 نقطة
          </button>
        </div>
      </div>
    );
  };

  // ── DISPLAY SCREEN ──
  const DisplayScreen = () => (
    <div style={{ position:"fixed",inset:0,background:"#07070F",zIndex:300,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
      <div style={{ position:"absolute",top:16,right:16 }}>
        <button onClick={()=>setShowDisplay(false)} style={{ background:"rgba(255,255,255,.1)",border:`1px solid rgba(255,255,255,.2)`,color:"#fff",padding:"8px 16px",borderRadius:20,cursor:"pointer",fontWeight:700,fontSize:13 }}>✕ إغلاق</button>
      </div>
      <p style={{ color:"rgba(255,255,255,.3)",fontSize:16,marginBottom:20,letterSpacing:2,textTransform:"uppercase" }}>يُخدم الآن</p>
      <div style={{ fontSize:"min(25vw,160px)",fontWeight:900,color:GOLD,fontFamily:"'JetBrains Mono',monospace",lineHeight:1,animation:"glow 2s ease-in-out infinite",textShadow:`0 0 60px rgba(200,150,62,.5)` }}>
        {String(queueServing).padStart(2,"0")}
      </div>
      <div style={{ display:"flex",gap:20,marginTop:40 }}>
        {[queueServing-1,queueServing,queueServing+1,queueServing+2,queueServing+3].filter(n=>n>0).map(n => (
          <div key={n} style={{ width:70,height:70,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontWeight:900,fontSize:24,background:n===queueServing?`linear-gradient(135deg,${GOLD},#E8B055)`:"rgba(255,255,255,.06)",border:`2px solid ${n===queueServing?GOLD:"rgba(255,255,255,.1)"}`,color:n===queueServing?"#fff":"rgba(255,255,255,.3)" }}>{n}</div>
        ))}
      </div>
      {role==="provider" && (
        <button onClick={callNext} style={{ marginTop:50,padding:"18px 50px",borderRadius:20,background:`linear-gradient(135deg,${GREEN},#00ff87)`,border:"none",color:"#000",fontWeight:900,fontSize:22,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 8px 32px rgba(46,204,154,.4)` }}>
          ⏭ التالي
        </button>
      )}
      <p style={{ color:"rgba(255,255,255,.2)",fontSize:14,marginTop:30 }}>Koffeeia — شاشة الانتظار</p>
    </div>
  );

  // ── PROFILE MODAL ──
  const ProfileModal = () => (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:150,display:"flex",alignItems:"flex-end",backdropFilter:"blur(6px)" }} onClick={()=>setShowProfile(false)}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"100%",maxWidth:440,margin:"0 auto",background:C.s1,borderRadius:"24px 24px 0 0",padding:"24px 20px 40px",maxHeight:"85vh",overflowY:"auto" }}>
        {/* Profile Hero */}
        <div style={{ background:`linear-gradient(135deg,rgba(200,150,62,.12),rgba(200,150,62,.04))`,borderRadius:18,padding:20,marginBottom:20,border:"1px solid rgba(200,150,62,.2)" }}>
          <div style={{ display:"flex",gap:14,alignItems:"center",marginBottom:16 }}>
            <div style={{ width:60,height:60,borderRadius:18,background:`linear-gradient(135deg,${GOLD},#E8B055)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26 }}>
              {role==="provider"?"🏥":"👤"}
            </div>
            <div>
              <p style={{ fontWeight:900,fontSize:18 }}>محمد أحمد</p>
              <p style={{ color:C.muted,fontSize:13 }}>demo@test.com</p>
              {isPremium && <Badge color={GOLD} bg="rgba(200,150,62,.15)">👑 مشترك مميز</Badge>}
            </div>
          </div>
          {/* Points display */}
          <div style={{ background:C.s1,borderRadius:14,padding:"14px 16px",marginBottom:12 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
              <span style={{ fontSize:13,fontWeight:700 }}>نقاطي</span>
              <span style={{ fontSize:13,color:GOLD,fontWeight:800,fontFamily:"'JetBrains Mono',monospace" }}>{points.toLocaleString("ar")}</span>
            </div>
            <ProgressBar value={points} max={2000} color={GOLD}/>
            <p style={{ fontSize:11,color:C.muted,marginTop:6 }}>{2000-points} نقطة للمكافأة التالية</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10 }}>
            {[{label:"زيارة",val:visitHistory.length},{label:"تقييم",val:"4.8⭐"},{label:"دور مكتمل",val:12}].map((s,i) => (
              <div key={i} style={{ textAlign:"center" }}>
                <p style={{ fontSize:20,fontWeight:900,color:GOLD }}>{s.val}</p>
                <p style={{ fontSize:10,color:C.muted }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visit History */}
        <p style={{ fontWeight:800,fontSize:15,marginBottom:12 }}>📋 سجل الزيارات</p>
        {visitHistory.map(v => (
          <div key={v.id} style={{ display:"flex",gap:12,padding:"12px 14px",background:C.s2,borderRadius:14,marginBottom:8,border:`1px solid ${C.bdr}` }}>
            <div style={{ width:40,height:40,borderRadius:12,background:"rgba(200,150,62,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>🏥</div>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:700,fontSize:14 }}>{v.place}</p>
              <p style={{ fontSize:12,color:C.muted }}>{v.date} · انتظرت {v.wait} دقيقة</p>
            </div>
            <Badge color={GREEN} bg="rgba(46,204,154,.1)">+{v.pts}⭐</Badge>
          </div>
        ))}

        {/* Achievements */}
        <p style={{ fontWeight:800,fontSize:15,marginBottom:12,marginTop:16 }}>🏆 الإنجازات</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:16 }}>
          {achievements.map(a => (
            <div key={a.id} style={{ padding:"12px 14px",borderRadius:14,background:a.unlocked?"rgba(200,150,62,.08)":C.s2,border:`1px solid ${a.unlocked?"rgba(200,150,62,.25)":C.bdr}`,opacity:a.unlocked?1:.5 }}>
              <div style={{ fontSize:24,marginBottom:6 }}>{a.icon}</div>
              <p style={{ fontWeight:800,fontSize:13,color:a.unlocked?GOLD:C.muted }}>{a.title}</p>
              <p style={{ fontSize:11,color:C.muted,marginTop:2 }}>{a.desc}</p>
              {a.unlocked && <Badge color={GREEN} small>+{a.pts} نقطة ✅</Badge>}
            </div>
          ))}
        </div>

        {!isPremium && (
          <button onClick={()=>{setShowProfile(false);setShowPremium(true);}} style={{ width:"100%",padding:"14px",borderRadius:16,background:`linear-gradient(135deg,${GOLD},#E8B055)`,border:"none",color:"#fff",fontWeight:800,fontSize:16,cursor:"pointer",fontFamily:"inherit" }}>
            👑 ترقّ للحساب المميز
          </button>
        )}
        <button onClick={()=>{setScreen("onboard");setRole(null);}} style={{ width:"100%",padding:"12px",borderRadius:16,background:"transparent",border:`1px solid rgba(255,82,82,.3)`,color:RED,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",marginTop:10 }}>
          🚪 تسجيل الخروج
        </button>
      </div>
    </div>
  );

  // ── REWARDS MODAL ──
  const RewardsModal = () => (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:150,display:"flex",alignItems:"flex-end",backdropFilter:"blur(6px)" }} onClick={()=>setShowRewards(false)}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"100%",maxWidth:440,margin:"0 auto",background:C.s1,borderRadius:"24px 24px 0 0",padding:"24px 20px 40px",maxHeight:"80vh",overflowY:"auto" }}>
        <h2 style={{ fontSize:20,fontWeight:900,marginBottom:4 }}>🎁 مكافآتي</h2>
        <p style={{ color:C.muted,fontSize:13,marginBottom:20 }}>رصيدك: <span style={{ color:GOLD,fontWeight:800 }}>{points.toLocaleString("ar")} نقطة</span></p>
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {REWARDS.map(r => {
            const canRedeem = points >= r.pts;
            return (
              <div key={r.id} style={{ display:"flex",gap:14,padding:"16px",background:C.s2,borderRadius:18,border:`1px solid ${canRedeem?"rgba(200,150,62,.2)":C.bdr}`,alignItems:"center" }}>
                <span style={{ fontSize:32 }}>{r.icon}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:800,fontSize:15 }}>{r.title}</p>
                  <p style={{ fontSize:12,color:C.muted,marginTop:2 }}>{r.partner}</p>
                  <div style={{ marginTop:8 }}>
                    <ProgressBar value={Math.min(points,r.pts)} max={r.pts} color={canRedeem?GREEN:GOLD}/>
                    <p style={{ fontSize:11,color:C.muted,marginTop:4 }}>{r.pts.toLocaleString("ar")} نقطة</p>
                  </div>
                </div>
                <button onClick={()=>redeemReward(r)} style={{ padding:"8px 16px",borderRadius:14,background:canRedeem?`linear-gradient(135deg,${GREEN},#00ff87)`:"rgba(255,255,255,.06)",border:"none",color:canRedeem?"#000":C.muted,fontWeight:800,fontSize:12,cursor:canRedeem?"pointer":"not-allowed",fontFamily:"inherit",flexShrink:0 }}>
                  {canRedeem?"استبدل":"قريباً"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════
  //  APP SCREENS
  // ══════════════════════════════════════
  const TABS = role==="provider"
    ? [{id:"dashboard",ic:"📋",l:"لوحة"},{id:"display",ic:"🖥",l:"شاشة"},{id:"rewards",ic:"⭐",l:"نقاطي"},{id:"settings",ic:"⚙️",l:"الإعدادات"}]
    : [{id:"home",ic:"🏠",l:"الرئيسية"},{id:"queue",ic:"⏰",l:"دوري"},{id:"rewards",ic:"⭐",l:"المكافآت"},{id:"settings",ic:"⚙️",l:"الإعدادات"}];

  return (
    <div style={W}>
      <style>{CSS}</style>
      <ToastContainer toasts={toasts} remove={id=>setToasts(p=>p.filter(t=>t.id!==id))}/>
      {selectedProvider && <ProviderDetail/>}
      {showBooking && <BookingModal/>}
      {showRating && <RatingModal/>}
      {showProfile && <ProfileModal/>}
      {showRewards && <RewardsModal/>}
      {showPremium && <PremiumModal/>}
      {showDisplay && <DisplayScreen/>}

      <Header/>

      <div style={{ flex:1, overflowY:"auto", padding:"16px 14px 90px" }}>

        {/* ══ HOME TAB ══ */}
        {tab==="home" && (
          <div style={{ animation:"fadeUp .4s ease" }}>
            {/* Points Banner */}
            <div style={{ background:`linear-gradient(135deg,rgba(200,150,62,.12),rgba(200,150,62,.04))`,border:"1.5px solid rgba(200,150,62,.22)",borderRadius:20,padding:18,marginBottom:16,position:"relative",overflow:"hidden" }} onClick={()=>setShowRewards(true)}>
              <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${GOLD},#E8B055,transparent)` }}/>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
                <p style={{ fontWeight:800,fontSize:16,color:GOLD }}>⭐ نقاط المكافآت</p>
                <span style={{ fontSize:12,color:C.muted }}>اضغط للاستبدال ›</span>
              </div>
              <p style={{ fontSize:36,fontWeight:900,color:GOLD,fontFamily:"'JetBrains Mono',monospace",marginBottom:6 }}>{points.toLocaleString("ar")}</p>
              <ProgressBar value={points} max={2000} color={GOLD}/>
              <p style={{ fontSize:11,color:C.muted,marginTop:6 }}>{2000-points} نقطة للمكافأة التالية</p>
            </div>

            {/* Active Queue */}
            {myQueue && (
              <div style={{ background:`linear-gradient(135deg,rgba(46,204,154,.1),rgba(46,204,154,.04))`,border:"1.5px solid rgba(46,204,154,.28)",borderRadius:20,padding:18,marginBottom:16,position:"relative",overflow:"hidden" }} onClick={()=>setTab("queue")}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${GREEN},transparent)` }}/>
                <p style={{ fontSize:12,color:GREEN,fontWeight:700,marginBottom:6 }}>● طابورك النشط</p>
                <p style={{ fontSize:15,fontWeight:800,marginBottom:2 }}>{myQueue.provider}</p>
                <div style={{ display:"flex",gap:16,alignItems:"center" }}>
                  <div><p style={{ fontSize:36,fontWeight:900,color:"#fff",fontFamily:"'JetBrains Mono',monospace" }}>#{myQueue.n}</p></div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13,color:C.muted }}>تُخدم الآن: <span style={{ color:GOLD,fontWeight:800 }}>#{queueServing}</span></p>
                    <p style={{ fontSize:13,color:C.muted }}>انتظار: <span style={{ color:GREEN,fontWeight:700 }}>{Math.max(0,(myQueue.n-queueServing)*7)} دقيقة</span></p>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <p style={{ fontSize:28,fontWeight:900,color:myQueue.n-queueServing<=0?GREEN:"#fff" }}>{Math.max(0,myQueue.n-queueServing)}</p>
                    <p style={{ fontSize:10,color:C.muted }}>قبلك</p>
                  </div>
                </div>
              </div>
            )}

            {/* Ad */}
            {/* الإعلانات معطّلة مبدئياً */}

            {/* Quick Actions */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18 }}>
              {[
                {ic:"🏥",l:"قريب منك",action:()=>{}},
                {ic:"📅",l:"حجز",action:()=>setShowBooking(PROVIDERS[0])},
                {ic:"🎁",l:"مكافآت",action:()=>setShowRewards(true)},
                {ic:"🖥",l:"شاشة",action:()=>setShowDisplay(true)},
              ].map((q,i) => (
                <button key={i} onClick={q.action} style={{ background:C.s1,border:`1px solid ${C.bdr}`,borderRadius:16,padding:"14px 8px",cursor:"pointer",fontFamily:"inherit",textAlign:"center" }}>
                  <div style={{ fontSize:24,marginBottom:6 }}>{q.ic}</div>
                  <p style={{ fontSize:11,fontWeight:700,color:C.muted }}>{q.l}</p>
                </button>
              ))}
            </div>

            {/* Providers */}
            <p style={{ fontWeight:800,fontSize:16,marginBottom:12 }}>🏥 الأماكن المتاحة</p>
            {!isPremium && (
              <div style={{ background:"rgba(168,85,247,.07)",border:"1px solid rgba(168,85,247,.2)",borderRadius:14,padding:"12px 16px",marginBottom:14,display:"flex",gap:10,alignItems:"center" }} onClick={()=>setShowPremium(true)}>
                <span style={{ fontSize:22 }}>👑</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:700,fontSize:13,color:PURPLE }}>جرّب Koffeeia Premium</p>
                  <p style={{ fontSize:12,color:C.muted }}>واتساب غير محدود + حجز أولوية + نقاط مضاعفة</p>
                </div>
                <span style={{ color:PURPLE,fontWeight:700,fontSize:12 }}>9 ريال ›</span>
              </div>
            )}
            {PROVIDERS.map(p => <ProviderCard key={p.id} p={p}/>)}
          </div>
        )}

        {/* ══ QUEUE TAB (USER) ══ */}
        {tab==="queue" && role==="user" && (
          <div style={{ animation:"fadeUp .4s ease" }}>
            {!myQueue ? (
              <div style={{ textAlign:"center",padding:"60px 20px" }}>
                <div style={{ fontSize:64,marginBottom:16 }}>⏰</div>
                <p style={{ fontSize:18,fontWeight:800,marginBottom:8 }}>لا يوجد دور نشط</p>
                <p style={{ color:C.muted,fontSize:14,marginBottom:24 }}>اختر مكاناً وخذ دورك الآن</p>
                <button onClick={()=>setTab("home")} style={{ padding:"13px 28px",borderRadius:16,background:`linear-gradient(135deg,${GOLD},#E8B055)`,border:"none",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"inherit" }}>
                  استعرض الأماكن
                </button>
              </div>
            ) : (
              <>
                {/* Big Turn Card */}
                <div style={{ borderRadius:26,padding:"28px 22px",textAlign:"center",marginBottom:16,background:myQueue.n<=queueServing?"linear-gradient(145deg,#0D2A1E,#0A2016)":"linear-gradient(145deg,#0F0F24,#141430)",border:`1.5px solid ${myQueue.n<=queueServing?"rgba(46,204,154,.4)":"rgba(200,150,62,.2)"}`,boxShadow:myQueue.n<=queueServing?"0 16px 60px rgba(46,204,154,.2)":"0 16px 50px rgba(0,0,0,.3)",position:"relative",overflow:"hidden" }}>
                  <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:myQueue.n<=queueServing?`linear-gradient(90deg,${GREEN},#00ff87)`:`linear-gradient(90deg,${GOLD},#E8B055)` }}/>
                  {myQueue.n<=queueServing && <div style={{ fontSize:36,marginBottom:10,animation:"bounce 1.5s infinite" }}>🎉</div>}
                  <p style={{ fontSize:11,color:"rgba(255,255,255,.35)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:10 }}>رقم دورك</p>
                  <div style={{ fontSize:90,fontWeight:900,color:"#fff",fontFamily:"'JetBrains Mono',monospace",lineHeight:1,textShadow:myQueue.n<=queueServing?"0 0 40px rgba(46,204,154,.5)":"0 0 30px rgba(200,150,62,.4)" }}>
                    {String(myQueue.n).padStart(2,"0")}
                  </div>
                  <div style={{ display:"flex",justifyContent:"center",gap:36,marginTop:22 }}>
                    <div><p style={{ fontSize:11,color:"rgba(255,255,255,.3)",marginBottom:4 }}>قبلك</p><p style={{ fontSize:34,fontWeight:900,color:"#fff",fontFamily:"'JetBrains Mono',monospace" }}>{Math.max(0,myQueue.n-queueServing)}</p></div>
                    <div style={{ width:1,background:"rgba(255,255,255,.1)" }}/>
                    <div><p style={{ fontSize:11,color:"rgba(255,255,255,.3)",marginBottom:4 }}>الانتظار</p><p style={{ fontSize:34,fontWeight:900,color:myQueue.n<=queueServing?GREEN:GOLD,fontFamily:"'JetBrains Mono',monospace" }}>{Math.max(0,(myQueue.n-queueServing)*7)}<small style={{ fontSize:14 }}>د</small></p></div>
                  </div>
                  {myQueue.n<=queueServing && <div style={{ marginTop:16,background:"rgba(46,204,154,.15)",border:"1px solid rgba(46,204,154,.35)",borderRadius:12,padding:"10px 20px" }}><p style={{ color:GREEN,fontWeight:900,fontSize:17 }}>حان دورك! توجّه الآن 🎉</p></div>}
                </div>

                {/* Now Serving */}
                <div style={{ background:C.s1,border:`1px solid ${C.bdr}`,borderRadius:16,padding:"13px 18px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <p style={{ fontSize:13,color:C.muted }}>يُخدم الآن</p>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <div style={{ width:8,height:8,borderRadius:"50%",background:GREEN,animation:"pulse 1.5s infinite" }}/>
                    <p style={{ fontSize:26,fontWeight:900,color:GOLD,fontFamily:"'JetBrains Mono',monospace" }}>#{queueServing}</p>
                  </div>
                </div>

                {/* Queue Progress */}
                <div style={{ background:C.s1,border:`1px solid ${C.bdr}`,borderRadius:16,padding:16,marginBottom:14 }}>
                  <p style={{ fontSize:12,fontWeight:700,color:C.muted,marginBottom:12 }}>تقدم الطابور</p>
                  <div style={{ display:"flex",gap:5 }}>
                    {[1,2,3,4,5,6,7,8].map(n => {
                      const done=n<queueServing,cur=n===queueServing,me=n===myQueue.n;
                      return <div key={n} style={{ flex:1,height:38,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontWeight:800,fontSize:13,background:cur?`linear-gradient(135deg,${GOLD},#E8B055)`:me?"rgba(46,204,154,.18)":done?"rgba(255,255,255,.04)":"rgba(255,255,255,.03)",border:`1.5px solid ${cur?GOLD:me?"rgba(46,204,154,.5)":done?"rgba(255,255,255,.07)":C.bdr}`,color:cur?"#fff":me?GREEN:done?"rgba(255,255,255,.2)":"rgba(255,255,255,.2)" }}>{done?"✓":n}</div>;
                    })}
                  </div>
                </div>

                {/* Notify Settings */}
                <div style={{ background:C.s1,border:`1px solid ${C.bdr}`,borderRadius:16,padding:16,marginBottom:14 }}>
                  <p style={{ fontSize:13,fontWeight:800,marginBottom:12 }}>🔔 التنبيهات</p>
                  {[
                    {k:"push",ic:"📳",l:"إشعار نصي"},
                    {k:"whatsapp",ic:"💬",l:"واتساب"},
                    {k:"sound",ic:"🔊",l:"صوت تنبيه"},
                    {k:"voice",ic:"🗣️",l:"رسالة صوتية"},
                  ].map(n => (
                    <div key={n.k} style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${C.bdr}` }}>
                      <span style={{ fontSize:18 }}>{n.ic}</span>
                      <span style={{ flex:1,fontSize:13,fontWeight:600 }}>{n.l}</span>
                      <Toggle on={notifications[n.k]} onChange={()=>setNotifications(prev=>({...prev,[n.k]:!prev[n.k]}))}/>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display:"flex",gap:10 }}>
                  <button onClick={()=>{toast(notifications.whatsapp?"📱 تم إرسال موقعك على واتساب ✅":"✅ تم إرسال موقعك","success");addPoints(5,"إرسال الموقع");}} style={{ flex:1,padding:"13px",borderRadius:14,background:"rgba(46,204,154,.1)",border:"1.5px solid rgba(46,204,154,.3)",color:GREEN,cursor:"pointer",fontWeight:700,fontFamily:"inherit",fontSize:14 }}>🚗 في الطريق</button>
                  <button onClick={()=>{setMyQueue(null);toast("تم إلغاء دورك","error");}} style={{ flex:1,padding:"13px",borderRadius:14,background:"rgba(255,82,82,.07)",border:"1.5px solid rgba(255,82,82,.25)",color:RED,cursor:"pointer",fontWeight:700,fontFamily:"inherit",fontSize:14 }}>✕ إلغاء الدور</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ══ DASHBOARD TAB (PROVIDER) ══ */}
        {tab==="dashboard" && role==="provider" && (
          <div style={{ animation:"fadeUp .4s ease" }}>
            {/* Stats */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18 }}>
              {[
                {l:"خُدموا",v:queueServing-1,ic:"✅",c:GREEN},
                {l:"ينتظرون",v:providerQueue.filter(q=>q.st==="waiting").length,ic:"⏳",c:GOLD},
                {l:"متوسط الانتظار",v:"7د",ic:"⏱",c:BLUE},
              ].map((s,i) => (
                <div key={i} style={{ background:C.s1,border:`1px solid ${C.bdr}`,borderRadius:16,padding:"14px 10px",textAlign:"center" }}>
                  <div style={{ fontSize:22,marginBottom:4 }}>{s.ic}</div>
                  <div style={{ fontSize:22,fontWeight:900,color:s.c,fontFamily:"'JetBrains Mono',monospace" }}>{s.v}</div>
                  <div style={{ fontSize:10,color:C.muted,marginTop:2 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Now Serving */}
            <div style={{ background:`linear-gradient(145deg,rgba(200,150,62,.1),rgba(200,150,62,.04))`,border:"1.5px solid rgba(200,150,62,.22)",borderRadius:20,padding:"20px 24px",marginBottom:14,textAlign:"center",position:"relative",overflow:"hidden" }}>
              <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${GOLD},transparent)` }}/>
              <p style={{ fontSize:11,color:C.muted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6 }}>يُخدم الآن</p>
              <p style={{ fontSize:66,fontWeight:900,color:GOLD,fontFamily:"'JetBrains Mono',monospace",lineHeight:1 }}>#{queueServing}</p>
              <p style={{ fontSize:15,color:C.txt,marginTop:6 }}>{providerQueue.find(p=>p.n===queueServing)?.name||"—"}</p>
            </div>

            {/* Controls */}
            <div style={{ display:"flex",gap:10,marginBottom:14 }}>
              <div style={{ flex:1,background:C.s1,border:`1px solid ${C.bdr}`,borderRadius:14,padding:"10px 14px",display:"flex",gap:8,alignItems:"center" }}>
                <span style={{ fontSize:12,color:C.muted,fontWeight:700 }}>الوضع:</span>
                {["manual","auto"].map(m => (
                  <button key={m} onClick={()=>setProviderMode(m)} style={{ padding:"5px 14px",borderRadius:20,border:"none",cursor:"pointer",fontFamily:"inherit",background:providerMode===m?`linear-gradient(135deg,${GOLD},#E8B055)`:"rgba(255,255,255,.05)",color:providerMode===m?"#fff":C.muted,fontWeight:800,fontSize:12 }}>{m==="manual"?"يدوي":"تلقائي"}</button>
                ))}
              </div>
              <button onClick={()=>setShowDisplay(true)} style={{ width:48,height:48,borderRadius:14,background:"rgba(91,141,239,.1)",border:`1px solid rgba(91,141,239,.25)`,color:BLUE,fontSize:20,cursor:"pointer" }}>🖥</button>
            </div>

            {/* Call Next */}
            <button onClick={callNext} style={{ width:"100%",padding:"15px",borderRadius:16,background:`linear-gradient(135deg,${GOLD},#E8B055)`,border:"none",color:"#fff",fontWeight:900,fontSize:17,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 6px 24px rgba(200,150,62,.35)`,marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
              ⏭ استدعاء التالي
            </button>

            {/* WhatsApp Button */}
            <button onClick={()=>toast("📱 تم إرسال تنبيه واتساب لجميع المنتظرين","success")} style={{ width:"100%",padding:"12px",borderRadius:14,background:"rgba(37,211,102,.1)",border:"1px solid rgba(37,211,102,.3)",color:"#25D366",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
              💬 إشعار واتساب للجميع
            </button>

            {/* Queue List */}
            <div style={{ background:C.s1,border:`1px solid ${C.bdr}`,borderRadius:18,overflow:"hidden" }}>
              <div style={{ padding:"13px 18px 10px",borderBottom:`1px solid ${C.bdr}`,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <p style={{ fontWeight:800,fontSize:14 }}>الطابور</p>
                <button onClick={()=>{const p={id:Date.now(),name:"مستخدم جديد",n:providerQueue.length+1,st:"waiting"};setProviderQueue(prev=>[...prev,p]);toast("✅ تمت الإضافة","success");}} style={{ background:"rgba(200,150,62,.1)",border:"1px solid rgba(200,150,62,.25)",color:GOLD,padding:"5px 14px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:800,fontFamily:"inherit" }}>+ إضافة</button>
              </div>
              {providerQueue.filter(p=>p.st!=="done").map((p,i,arr) => (
                <div key={p.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"13px 18px",background:p.st==="current"?"rgba(200,150,62,.06)":"transparent",borderBottom:i<arr.length-1?`1px solid ${C.bdr}`:"none" }}>
                  <div style={{ width:38,height:38,borderRadius:12,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontWeight:900,fontSize:16,background:p.st==="current"?`linear-gradient(135deg,${GOLD},#E8B055)`:C.s2,color:p.st==="current"?"#fff":C.muted }}>{p.n}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:700,fontSize:14 }}>{p.name}</p>
                    {p.st==="current" && <p style={{ fontSize:11,color:GOLD,fontWeight:700,display:"flex",alignItems:"center",gap:4 }}><span style={{ width:5,height:5,borderRadius:"50%",background:GOLD,display:"inline-block",animation:"pulse 1.5s infinite" }}/>يُخدم الآن</p>}
                  </div>
                  {p.st!=="current" && (
                    <div style={{ display:"flex",gap:6 }}>
                      <button onClick={()=>toast("تم التأجيل","info")} style={{ padding:"5px 9px",borderRadius:9,background:C.s2,border:`1px solid ${C.bdr}`,color:C.muted,cursor:"pointer",fontSize:11 }}>⏱</button>
                      <button onClick={()=>{setProviderQueue(prev=>prev.filter(q=>q.id!==p.id));toast("تم الحذف","error");}} style={{ padding:"5px 9px",borderRadius:9,background:"rgba(255,82,82,.08)",border:"1px solid rgba(255,82,82,.2)",color:RED,cursor:"pointer",fontSize:11 }}>✕</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Today Stats */}
            <div style={{ background:C.s1,border:`1px solid ${C.bdr}`,borderRadius:18,padding:18,marginTop:14 }}>
              <p style={{ fontWeight:800,fontSize:14,marginBottom:14 }}>📊 إحصائيات اليوم</p>
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                {[
                  {l:"إجمالي الخدمة",v:queueServing-1,max:50,c:GREEN},
                  {l:"رضا العملاء",v:88,max:100,c:GOLD,suf:"%"},
                  {l:"متوسط الانتظار",v:7,max:30,c:BLUE,suf:"د"},
                ].map((s,i) => (
                  <div key={i}>
                    <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6 }}>
                      <span style={{ color:C.muted }}>{s.l}</span>
                      <span style={{ color:s.c,fontWeight:700 }}>{s.v}{s.suf||""}</span>
                    </div>
                    <ProgressBar value={s.v} max={s.max} color={s.c}/>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ DISPLAY TAB ══ */}
        {tab==="display" && role==="provider" && (
          <div style={{ animation:"fadeUp .4s ease" }}>
            <button onClick={()=>setShowDisplay(true)} style={{ width:"100%",padding:"20px",borderRadius:20,background:`linear-gradient(135deg,rgba(91,141,239,.15),rgba(91,141,239,.05))`,border:`2px dashed rgba(91,141,239,.4)`,color:BLUE,fontWeight:800,fontSize:17,cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:10,marginBottom:16 }}>
              <span style={{ fontSize:48 }}>🖥</span>
              <span>فتح شاشة العرض الكاملة</span>
              <span style={{ fontSize:12,color:C.muted,fontWeight:400 }}>اعرضها على شاشة كبيرة في مكانك</span>
            </button>
            <div style={{ background:C.s1,border:`1px solid ${C.bdr}`,borderRadius:18,overflow:"hidden" }}>
              <div style={{ padding:"14px 18px",background:C.s2,borderBottom:`1px solid ${C.bdr}`,fontSize:13,fontWeight:800 }}>معاينة الشاشة</div>
              <div style={{ padding:24,background:"#07070F",textAlign:"center" }}>
                <p style={{ color:"rgba(255,255,255,.3)",fontSize:12,marginBottom:10,letterSpacing:2 }}>يُخدم الآن</p>
                <p style={{ fontSize:80,fontWeight:900,color:GOLD,fontFamily:"'JetBrains Mono',monospace",lineHeight:1,textShadow:`0 0 30px rgba(200,150,62,.5)` }}>{String(queueServing).padStart(2,"0")}</p>
                <div style={{ display:"flex",gap:8,justifyContent:"center",marginTop:16 }}>
                  {[queueServing,queueServing+1,queueServing+2].map(n => <div key={n} style={{ width:40,height:40,borderRadius:10,background:n===queueServing?`linear-gradient(135deg,${GOLD},#E8B055)`:"rgba(255,255,255,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontWeight:800,fontSize:16,color:n===queueServing?"#fff":"rgba(255,255,255,.3)" }}>{n}</div>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ REWARDS TAB ══ */}
        {tab==="rewards" && (
          <div style={{ animation:"fadeUp .4s ease" }}>
            <div style={{ background:`linear-gradient(135deg,rgba(200,150,62,.12),rgba(200,150,62,.04))`,border:"1.5px solid rgba(200,150,62,.25)",borderRadius:20,padding:20,marginBottom:18,textAlign:"center" }}>
              <p style={{ fontSize:13,color:C.muted,marginBottom:6 }}>رصيد النقاط</p>
              <p style={{ fontSize:48,fontWeight:900,color:GOLD,fontFamily:"'JetBrains Mono',monospace" }}>{points.toLocaleString("ar")}</p>
              <ProgressBar value={points} max={2000} color={GOLD}/>
              <p style={{ fontSize:11,color:C.muted,marginTop:8 }}>اكسب نقاطاً بكل دور وزيارة وتقييم</p>
            </div>

            {/* How to earn */}
            <div style={{ background:C.s1,border:`1px solid ${C.bdr}`,borderRadius:16,padding:16,marginBottom:16 }}>
              <p style={{ fontWeight:800,fontSize:14,marginBottom:12 }}>💡 كيف تكسب النقاط؟</p>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {[
                  {ic:"🎫",l:"أخذ دور",p:15},{ic:"📅",l:"حجز مسبق",p:20},{ic:"⭐",l:"تقييم مكان",p:25},
                  {ic:"📖",l:"قراءة قصة",p:10},{ic:"🎮",l:"لعب لعبة",p:8},{ic:"📱",l:"دعوة صديق",p:100},
                ].map((e,i) => (
                  <div key={i} style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:C.s2,borderRadius:10,border:`1px solid ${C.bdr}` }}>
                    <span style={{ fontSize:18 }}>{e.ic}</span>
                    <span style={{ flex:1,fontSize:13,fontWeight:600 }}>{e.l}</span>
                    <Badge color={GOLD}>+{e.p} نقطة</Badge>
                  </div>
                ))}
              </div>
            </div>

            <p style={{ fontWeight:800,fontSize:15,marginBottom:12 }}>🎁 المكافآت المتاحة</p>
            {REWARDS.map(r => {
              const can = points >= r.pts;
              return (
                <div key={r.id} style={{ display:"flex",gap:14,padding:16,background:C.s1,borderRadius:18,border:`1px solid ${can?"rgba(200,150,62,.2)":C.bdr}`,marginBottom:10,alignItems:"center" }}>
                  <span style={{ fontSize:30 }}>{r.icon}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:800,fontSize:14 }}>{r.title}</p>
                    <p style={{ fontSize:12,color:C.muted,marginTop:1 }}>{r.partner}</p>
                    <div style={{ marginTop:8 }}>
                      <ProgressBar value={Math.min(points,r.pts)} max={r.pts} color={can?GREEN:GOLD}/>
                      <p style={{ fontSize:11,color:C.muted,marginTop:4 }}>{can?"جاهز للاستبدال!": `${(r.pts-points).toLocaleString("ar")} نقطة متبقية`}</p>
                    </div>
                  </div>
                  <button onClick={()=>redeemReward(r)} style={{ padding:"9px 16px",borderRadius:14,background:can?`linear-gradient(135deg,${GREEN},#00ff87)`:"rgba(255,255,255,.05)",border:"none",color:can?"#000":C.muted,fontWeight:800,fontSize:12,cursor:can?"pointer":"not-allowed",fontFamily:"inherit",flexShrink:0 }}>
                    {can?"استبدل":"🔒"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ SETTINGS TAB ══ */}
        {tab==="settings" && (
          <div style={{ animation:"fadeUp .4s ease" }}>
            {/* Profile Mini */}
            <div style={{ display:"flex",gap:14,padding:18,background:C.s1,border:`1px solid ${C.bdr}`,borderRadius:18,marginBottom:16,cursor:"pointer" }} onClick={()=>setShowProfile(true)}>
              <div style={{ width:52,height:52,borderRadius:16,background:`linear-gradient(135deg,${GOLD},#E8B055)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24 }}>{role==="provider"?"🏥":"👤"}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:800,fontSize:16 }}>محمد أحمد</p>
                <p style={{ color:C.muted,fontSize:13 }}>demo@test.com</p>
                {isPremium && <Badge color={GOLD}>👑 مميز</Badge>}
              </div>
              <span style={{ color:C.muted,fontSize:18 }}>›</span>
            </div>

            {/* Settings Groups */}
            {[
              { title:"التفضيلات", items:[
                {ic:dark?"☀️":"🌙",l:"الوضع الليلي",v:dark?"مفعّل":"معطّل",action:()=>setDark(!dark)},
                {ic:"🌐",l:"اللغة",v:"العربية",action:()=>toast("قريباً — اختيار اللغة","info")},
              ]},
              { title:"التنبيهات", items:[
                {ic:"📳",l:"إشعارات نصية",toggle:true,k:"push"},
                {ic:"💬",l:"واتساب",toggle:true,k:"whatsapp"},
                {ic:"🔊",l:"صوت",toggle:true,k:"sound"},
                {ic:"🗣️",l:"رسائل صوتية",toggle:true,k:"voice"},
              ]},
              { title:"الحساب", items:[
                {ic:"⭐",l:"نقاطي",v:`${points.toLocaleString("ar")} نقطة`,action:()=>setShowRewards(true)},
                {ic:"🏆",l:"الإنجازات",v:`${achievements.filter(a=>a.unlocked).length}/${achievements.length}`,action:()=>setShowProfile(true)},
                {ic:"👑",l:"الحساب المميز",v:isPremium?"نشط":"9 ريال/شهر",action:()=>!isPremium&&setShowPremium(true)},
              ]},
            ].map((group,gi) => (
              <div key={gi} style={{ background:C.s1,border:`1px solid ${C.bdr}`,borderRadius:18,overflow:"hidden",marginBottom:12 }}>
                <p style={{ fontSize:11,color:C.muted,padding:"12px 18px 6px",fontWeight:700,letterSpacing:1,textTransform:"uppercase" }}>{group.title}</p>
                {group.items.map((item,ii) => (
                  <div key={ii} style={{ display:"flex",alignItems:"center",gap:12,padding:"14px 18px",borderBottom:ii<group.items.length-1?`1px solid ${C.bdr}`:"none",cursor:item.toggle||!item.action?"default":"pointer" }} onClick={item.action}>
                    <span style={{ fontSize:20,width:28,textAlign:"center" }}>{item.ic}</span>
                    <span style={{ flex:1,fontSize:14,fontWeight:600 }}>{item.l}</span>
                    {item.toggle ? <Toggle on={notifications[item.k]} onChange={()=>setNotifications(prev=>({...prev,[item.k]:!prev[item.k]}))}/>
                     : <><span style={{ fontSize:13,color:C.muted }}>{item.v}</span><span style={{ color:C.muted,fontSize:16 }}>›</span></>}
                  </div>
                ))}
              </div>
            ))}

            {!isPremium && (
              <button onClick={()=>setShowPremium(true)} style={{ width:"100%",padding:"15px",borderRadius:16,background:`linear-gradient(135deg,${GOLD},#E8B055)`,border:"none",color:"#fff",fontWeight:900,fontSize:16,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 6px 24px rgba(200,150,62,.35)`,marginBottom:12 }}>
                👑 ترقّ للحساب المميز — 9 ريال/شهر
              </button>
            )}

            <button onClick={()=>{setScreen("onboard");setRole(null);}} style={{ width:"100%",padding:"13px",borderRadius:16,background:"transparent",border:`1.5px solid rgba(255,82,82,.3)`,color:RED,fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit" }}>
              🚪 تسجيل الخروج
            </button>
            <p style={{ textAlign:"center",fontSize:11,color:C.muted,marginTop:16 }}>Koffeeia v2.0 — جميع الحقوق محفوظة</p>
          </div>
        )}

      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{ position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:440,background:dark?"rgba(7,7,15,.96)":"rgba(244,241,236,.96)",backdropFilter:"blur(24px)",borderTop:`1px solid ${C.bdr}`,padding:"10px 4px 20px",display:"flex",justifyContent:"space-around",zIndex:60 }}>
        {TABS.map(tb => (
          <button key={tb.id} onClick={()=>{ if(tb.id==="display"){setShowDisplay(true);return;} setTab(tb.id); }} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"8px 14px",borderRadius:16,border:"none",cursor:"pointer",fontFamily:"inherit",background:tab===tb.id?"rgba(200,150,62,.12)":"transparent",transition:"all .2s" }}>
            <span style={{ fontSize:22,filter:tab===tb.id?"none":"grayscale(.4) opacity(.55)" }}>{tb.ic}</span>
            <span style={{ fontSize:10,fontWeight:tab===tb.id?800:500,color:tab===tb.id?GOLD:C.muted,whiteSpace:"nowrap" }}>{tb.l}</span>
            {tb.id==="rewards" && points>0 && <div style={{ position:"absolute",width:8,height:8,borderRadius:"50%",background:RED,top:6,border:"2px solid "+C.bg }}/>}
          </button>
        ))}
      </div>
    </div>
  );
}
