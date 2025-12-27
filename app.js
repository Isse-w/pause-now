const $ = (s)=>document.querySelector(s);
const $$ = (s)=>Array.from(document.querySelectorAll(s));

const KEYS = {
  prefs: "pauseNow_prefs_v6",
  events: "pauseNow_events_v6",
  rewards: "pauseNow_rewards_v6"
};

const defaultPrefs = {
  lang: "sv",
  purpose: "scroll",
  seconds: 30,
  sound: false,   // ambient + coach audio
  voice: false,   // breathing cues + done/ready
  ambient: "off"
};

function loadJSON(key, fallback){
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function saveJSON(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

function todayKey(d=new Date()){
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,"0");
  const day=String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}
function formatMMSS(total){
  total = Math.max(0, Math.floor(total));
  const m = Math.floor(total/60);
  const s = total%60;
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}
function show(screenId){
  $("#screenStart").classList.add("hidden");
  $("#screenHome").classList.add("hidden");
  $("#screenPause").classList.add("hidden");
  $("#screenChoice").classList.add("hidden");
  $("#screenStats").classList.add("hidden");
  $(screenId).classList.remove("hidden");
}
function wait(ms){ return new Promise(r=>setTimeout(r, ms)); }

// ---------- TEXT ----------
const TEXT = {
  sv: {
    startPill:"Start",
    startTitle:"Välj innan du börjar",
    startSub:"Sätt syfte, språk och pauslängd. Sen räcker en knapp.",
    startPurposeTitle:"Varför vill du pausa?",
    startLangTitle:"Språk",
    startPauseTitle:"Pauslängd",
    startSound:"Ljud",
    startVoice:"Röst",
    startAmbient:"Lugnande ljud",
    startContinue:"Fortsätt",
    startHint:"Du kan ändra allt senare.",
    startChip30:"Mikropaus",
    startChip120:"Standard",
    startChip300:"Stark impuls",

    purposeName:{ scroll:"Scroll", stress:"Stress", adhd:"ADHD", school:"Skola" },
    purposeCopy:{
      scroll:"Skapa ett mellanrum innan du fortsätter.",
      stress:"Lugnare kropp med lång utandning.",
      adhd:"Få en tydlig riktning igen.",
      school:"Återställ fokus mjukt."
    },

    pill:"Paus mellan impuls och handling",
    title:"Pausa när du märker att du scrollar fast du inte vill",
    sub:"Välj längd. Tryck en gång. Följ guidningen. Sen väljer du själv.",
    purpose:"Syfte",
    pause:"Välj paus",
    sound:"Ljud",
    voice:"Röst",
    ambient:"Lugnande ljud",
    off:"Av", rain:"Regn", birds:"Fåglar", fire:"Eld",
    start:"Pausa nu",
    settings:"Ändra språk & syfte",
    week:"Visa vecka",
    pausesToday:(n)=>`${n} pauser idag`,
    streak:(n)=>`Streak: ${n} dagar`,
    offline:"Offline-stöd: på",

    coach: {
      scroll:"Du behöver inte vinna mot mobilen — bara skapa ett litet mellanrum innan du fortsätter.",
      stress:"Släpp axlarna. Lång utandning signalerar trygghet.",
      adhd:"Fokus är en riktning, inte ett tillstånd.",
      school:"En kort paus gör hjärnan redo igen."
    },

    chip30:"Mikropaus",
    chip120:"Standard",
    chip300:"Stark impuls",

    pausePill:"Paus",
    ready:"Gör dig redo…",
    inhale:"Andas in",
    hold:"Håll",
    exhale:"Andas ut",
    done:"Nu väljer du.",

    breathHint:"Följ in–håll–ut. Lång utandning hjälper kroppen att slappna av.",
    stop:"Stoppa",
    back:"Tillbaka",

    choicePill:"Klar",
    choiceTitle:"Du bestämmer nästa steg",
    choiceSub:"Välj ett standardval så hjälper appen dig att hålla riktningen.",
    close1:"Stäng appen 1 min",
    limit5:"Gå tillbaka med gräns (5 min)",
    other:"Gör något annat",
    home:"Tillbaka till start",

    statsPill:"Vecka",
    statsTitle:"Din vecka",
    statsSub:"Här kan du se dina pauser per dag (sparas lokalt).",
    statsBack:"Tillbaka",
    reset:"Nollställ data",
    resetConfirm:"Nollställa all data?",

    settingsPill:"Inställningar",
    settingsTitle:"Språk",
    settingsSub:"Välj språk. Syfte kan du byta när som helst.",
    save:"Spara",
    langTitle:"Språk",
    settingsPurposeTitle:"Syfte (snabbval)",

    otherPill:"Förslag",
    otherTitle:"Gör något annat",
    otherSub:"Välj en enkel aktivitet (30–60 sek).",
    otherClose:"Stäng",
    picked:"Valt:",

    microChosen:(p)=>`Bra val: ${p}.`,
    rewardDone:"✅ Du tog en paus.",
    reward3:"🎉 3 pauser idag! Bra jobbat.",
    reward7:"🔥 7 dagar i rad! Streak!",

    closeToast:"Lägg undan mobilen i 60 sek. (En webbapp kan inte stänga sig själv.)",
    limitToast:"Okej. Jag påminner dig om 5 min (om notiser tillåts).",
    limitNoPerm:"Tillåt notiser om du vill få en påminnelse.",
    limitRemind:"⏳ 5 minuter gick. Vill du pausa igen?"
  },

  en: {
    startPill:"Start",
    startTitle:"Choose before you begin",
    startSub:"Set purpose, language and pause length. Then one tap is enough.",
    startPurposeTitle:"Why do you want to pause?",
    startLangTitle:"Language",
    startPauseTitle:"Pause length",
    startSound:"Sound",
    startVoice:"Voice",
    startAmbient:"Calming sound",
    startContinue:"Continue",
    startHint:"You can change everything later.",
    startChip30:"Micro",
    startChip120:"Standard",
    startChip300:"Strong impulse",

    purposeName:{ scroll:"Scroll", stress:"Stress", adhd:"ADHD", school:"School" },
    purposeCopy:{
      scroll:"Create a gap before you keep scrolling.",
      stress:"Shift your body from stress to calm.",
      adhd:"Give your brain a clear starting point.",
      school:"Reset focus gently."
    },

    pill:"Pause between impulse and action",
    title:"Pause when you notice you keep scrolling",
    sub:"Pick a length. One tap. Follow the guide. Then choose.",
    purpose:"Purpose",
    pause:"Choose a pause",
    sound:"Sound",
    voice:"Voice",
    ambient:"Calming sound",
    off:"Off", rain:"Rain", birds:"Birds", fire:"Fire",
    start:"Pause now",
    settings:"Change language & purpose",
    week:"View week",
    pausesToday:(n)=>`${n} pauses today`,
    streak:(n)=>`Streak: ${n} days`,
    offline:"Offline support: on",

    coach: {
      scroll:"You don’t have to beat the phone — just create a small pause before you continue.",
      stress:"Drop your shoulders. A long exhale signals safety.",
      adhd:"Focus is a direction, not a state.",
      school:"A short break helps the brain reset."
    },

    chip30:"Micro",
    chip120:"Standard",
    chip300:"Strong impulse",

    pausePill:"Pause",
    ready:"Get ready…",
    inhale:"Breathe in",
    hold:"Hold",
    exhale:"Breathe out",
    done:"It’s up to you now.",

    breathHint:"Follow in–hold–out. A long exhale helps your body relax.",
    stop:"Stop",
    back:"Back",

    choicePill:"Done",
    choiceTitle:"Choose your next step",
    choiceSub:"Pick a default option so the app supports your decision.",
    close1:"Close the app for 1 min",
    limit5:"Go back with a limit (5 min)",
    other:"Do something else",
    home:"Back to start",

    statsPill:"Week",
    statsTitle:"Your week",
    statsSub:"Pauses per day (stored locally).",
    statsBack:"Back",
    reset:"Reset data",
    resetConfirm:"Reset all data?",

    settingsPill:"Settings",
    settingsTitle:"Language",
    settingsSub:"Choose language. You can change purpose anytime.",
    save:"Save",
    langTitle:"Language",
    settingsPurposeTitle:"Purpose (quick pick)",

    otherPill:"Ideas",
    otherTitle:"Do something else",
    otherSub:"Pick one simple thing (30–60 sec).",
    otherClose:"Close",
    picked:"Picked:",

    microChosen:(p)=>`Good choice: ${p}.`,
    rewardDone:"✅ You took a pause.",
    reward3:"🎉 3 pauses today! Nice.",
    reward7:"🔥 7-day streak!",

    closeToast:"Put the phone down for 60s. (A web app can’t close itself.)",
    limitToast:"Okay. I’ll remind you in 5 min (if notifications are allowed).",
    limitNoPerm:"Allow notifications if you want a reminder.",
    limitRemind:"⏳ 5 minutes passed. Want to pause again?"
  }
};

// Breath patterns [in, hold, out]
const PATTERN = {
  scroll: [4,2,6],
  stress: [4,2,8],
  adhd:  [4,2,6],
  school:[4,2,6]
};

const AUDIO = {
  ambient: {
    rain:  "sounds/rain.mp3",
    birds: "sounds/birds.mp3",
    fire:  "sounds/fire.mp3"
  },
  cues: {
    sv: { ready:"sounds/sv_ready.mp3", in:"sounds/sv_in.mp3", hold:"sounds/sv_hold.mp3", out:"sounds/sv_out.mp3", done:"sounds/sv_done.mp3" },
    en: { ready:"sounds/en_ready.mp3", in:"sounds/en_in.mp3", hold:"sounds/en_hold.mp3", out:"sounds/en_out.mp3", done:"sounds/en_done.mp3" }
  },
  coach: {
    scroll: { sv:"sounds/coach_scroll.mp3",  en:"sounds/coach_scroll_en.mp3" },
    stress: { sv:"sounds/coach_stress.mp3",  en:"sounds/coach_stress_en.mp3" },
    adhd:   { sv:"sounds/coach_adhd.mp3",    en:"sounds/coach_adhd_en.mp3" },
    school: { sv:"sounds/coach_school.mp3",  en:"sounds/coach_school_en.mp3" }
  }
};

const OTHER_ACTIVITIES = [
  { id:"water",   sv:"Drick vatten",      en:"Drink water",      sv2:"3 klunkar.",           en2:"3 sips." },
  { id:"stretch", sv:"Sträck på dig",     en:"Stretch",         sv2:"Axlar/nacke 30 sek.",   en2:"Shoulders/neck 30s." },
  { id:"steps",   sv:"Gå 20 steg",        en:"Walk 20 steps",   sv2:"Bara runt rummet.",     en2:"Just around the room." },
  { id:"note",    sv:"Skriv 1 rad",       en:"Write 1 line",    sv2:"Vad gör jag nu?",       en2:"What am I doing now?" },
  { id:"breathe", sv:"3 lugna andetag",   en:"3 calm breaths",  sv2:"In… ut…",               en2:"In… out…" },
  { id:"reset",   sv:"Rensa ytan 30 sek", en:"Clear space 30s", sv2:"Plocka 3 saker.",       en2:"Put away 3 things." }
];

// ---------- STATE ----------
let prefs = loadJSON(KEYS.prefs, defaultPrefs);
let rewards = loadJSON(KEYS.rewards, { last3Day:null, last7Day:null });

// Onboarding draft
let startDraft = { ...prefs };

// Settings draft
let pendingLang = prefs.lang;
let pendingPurpose = prefs.purpose;

// Timer/session
let timerInterval = null;
let remaining = 0;
let pauseSession = 0; // cancellation token
let pauseRunning = false;

// Reminder
let limitTimeout = null;

// Ambient
let ambientAudio = null;

// ---------- Audio queue (NO OVERLAP) ----------
let audioQueue = Promise.resolve();
let currentCue = null;

function stopCueHard(){
  // cancels future queued play by bumping session; also stops current
  try{
    if (currentCue){
      currentCue.pause();
      currentCue.currentTime = 0;
    }
  }catch{}
  currentCue = null;
}

function enqueueBlockingPlay(path, volume=1, sessionId){
  audioQueue = audioQueue.then(async () => {
    // If session changed, skip
    if (sessionId !== pauseSession) return;
    try{
      // stop any current cue
      stopCueHard();

      const a = new Audio(path);
      currentCue = a;
      a.volume = volume;

      await new Promise((resolve, reject) => {
        a.onended = resolve;
        a.onerror = reject;
        a.onabort = reject;
        a.play().catch(reject);
      });

      if (currentCue === a) currentCue = null;
    }catch{
      // ignore autoplay/404 without crashing
      currentCue = null;
    }
  });
  return audioQueue;
}

function playCueQueued(kind){
  if (!prefs.voice) return Promise.resolve();
  const file = AUDIO.cues?.[prefs.lang]?.[kind];
  if (!file) return Promise.resolve();
  const sid = pauseSession;
  return enqueueBlockingPlay(file, 1, sid);
}

function playCoachNow(){
  // Coach should speak when switching purpose (like before).
  // We gate it to prefs.voice so it matches "Röst" expectation.
  if (!prefs.voice) return;
  const file = AUDIO.coach?.[prefs.purpose]?.[prefs.lang];
  if (!file) return;
  // Coach is not queued with breathing. It should play immediately and stop any current cue.
  // But we DO NOT want it during pause start, so we call this only on purpose change.
  try{
    stopCueHard();
    const a = new Audio(file);
    a.volume = 1;
    a.play().catch(()=>{});
  }catch{}
}

function setOrbScale(scale){
  const orb = $("#breathOrb");
  if (!orb) return;
  orb.style.transform = `scale(${scale})`;
}

function stopAmbient(){
  if (ambientAudio){
    try{ ambientAudio.pause(); }catch{}
    ambientAudio = null;
  }
}

function showToast(msg){
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=> el.classList.remove("show"), 2800);
}

// ---------- Stats ----------
function recordPauseCompleted(){
  const ev = loadJSON(KEYS.events, []);
  ev.push({ at: Date.now() });
  saveJSON(KEYS.events, ev);
}
function countToday(){
  const key = todayKey();
  const ev = loadJSON(KEYS.events, []);
  return ev.filter(x => todayKey(new Date(x.at)) === key).length;
}
function calcStreak(){
  const ev = loadJSON(KEYS.events, []);
  const days = new Set(ev.map(x => todayKey(new Date(x.at))));
  if (days.size === 0) return 0;

  let streak = 0;
  let d = new Date();
  while (true){
    const k = todayKey(d);
    if (days.has(k)) { streak++; d.setDate(d.getDate()-1); }
    else break;
  }
  return streak;
}
function updateStatsUI(){
  const t = TEXT[prefs.lang];
  $("#statsText").textContent = t.pausesToday(countToday());
  $("#streakText").textContent = t.streak(calcStreak());
}
function renderWeek(){
  const ev = loadJSON(KEYS.events, []);
  const map = {};
  for (const e of ev){
    const k = todayKey(new Date(e.at));
    map[k] = (map[k]||0) + 1;
  }
  const lines = [];
  const now = new Date();
  for (let i=6;i>=0;i--){
    const d = new Date(now);
    d.setDate(now.getDate()-i);
    const k = todayKey(d);
    lines.push(`${k}: ${map[k] || 0}`);
  }
  $("#weekBox").textContent = lines.join("\n");
}
function maybeRewards(){
  const t = TEXT[prefs.lang];
  const day = todayKey();
  const todayCount = countToday();
  const streak = calcStreak();

  if (todayCount >= 3 && rewards.last3Day !== day){
    rewards.last3Day = day;
    saveJSON(KEYS.rewards, rewards);
    showToast(t.reward3);
  }
  if (streak >= 7 && rewards.last7Day !== day){
    rewards.last7Day = day;
    saveJSON(KEYS.rewards, rewards);
    showToast(t.reward7);
  }
}

// ---------- Render ----------
function renderStart(){
  const t = TEXT[startDraft.lang];
  document.documentElement.lang = startDraft.lang;

  $("#startPill").textContent = t.startPill;
  $("#startTitle").textContent = t.startTitle;
  $("#startSub").textContent = t.startSub;
  $("#startPurposeTitle").textContent = t.startPurposeTitle;
  $("#startLangTitle").textContent = t.startLangTitle;
  $("#startPauseTitle").textContent = t.startPauseTitle;
  $("#startSoundLbl").textContent = t.startSound;
  $("#startVoiceLbl").textContent = t.startVoice;
  $("#startAmbientTitle").textContent = t.startAmbient;
  $("#startContinueBtn").textContent = t.startContinue;
  $("#startHint").textContent = t.startHint;
  $("#startChip30").textContent = t.startChip30;
  $("#startChip120").textContent = t.startChip120;
  $("#startChip300").textContent = t.startChip300;

  $("#p_scroll").textContent = t.purposeName.scroll;
  $("#p_stress").textContent = t.purposeName.stress;
  $("#p_adhd").textContent = t.purposeName.adhd;
  $("#p_school").textContent = t.purposeName.school;

  $("#pc_scroll").textContent = t.purposeCopy.scroll;
  $("#pc_stress").textContent = t.purposeCopy.stress;
  $("#pc_adhd").textContent = t.purposeCopy.adhd;
  $("#pc_school").textContent = t.purposeCopy.school;

  const sel = $("#startAmbientSelect");
  sel.options[0].text = t.off;
  sel.options[1].text = t.rain;
  sel.options[2].text = t.birds;
  sel.options[3].text = t.fire;

  $$("#screenStart .purposeCard").forEach(b => b.classList.toggle("active", b.dataset.purpose === startDraft.purpose));
  $$("#screenStart .langBtn").forEach(b => b.classList.toggle("active", b.dataset.lang === startDraft.lang));
  $$("#startChips .chip").forEach(b => b.classList.toggle("active", Number(b.dataset.seconds) === Number(startDraft.seconds)));
  $("#startSoundToggle").checked = !!startDraft.sound;
  $("#startVoiceToggle").checked = !!startDraft.voice;
  $("#startAmbientSelect").value = startDraft.ambient || "off";
}

function renderHome(){
  const t = TEXT[prefs.lang];
  document.documentElement.lang = prefs.lang;

  $("#pillText").textContent = t.pill;
  $("#titleText").textContent = t.title;
  $("#subtitleText").textContent = t.sub;

  $("#purposeTitle").textContent = t.purpose;
  $("#pauseTitle").textContent = t.pause;

  $("#homeP_scroll").textContent = t.purposeName.scroll;
  $("#homeP_stress").textContent = t.purposeName.stress;
  $("#homeP_adhd").textContent = t.purposeName.adhd;
  $("#homeP_school").textContent = t.purposeName.school;

  $("#coachText").textContent = t.coach[prefs.purpose] || "";

  $("#chip30Sub").textContent = t.chip30;
  $("#chip120Sub").textContent = t.chip120;
  $("#chip300Sub").textContent = t.chip300;

  $("#soundLbl").textContent = t.sound;
  $("#voiceLbl").textContent = t.voice;
  $("#soundToggle").checked = !!prefs.sound;
  $("#voiceToggle").checked = !!prefs.voice;

  $("#ambientTitle").textContent = t.ambient;
  const sel = $("#ambientSelect");
  sel.options[0].text = t.off;
  sel.options[1].text = t.rain;
  sel.options[2].text = t.birds;
  sel.options[3].text = t.fire;
  $("#ambientSelect").value = prefs.ambient || "off";

  $("#startBtn").textContent = t.start;
  $("#settingsBtn").textContent = t.settings;
  $("#statsBtn").textContent = t.week;
  $("#openSettingsLink").textContent = t.settings;
  $("#offlineText").textContent = t.offline;

  updateStatsUI();

  $$("#screenHome [data-action='setPurpose']").forEach(b=>{
    b.style.opacity = (b.dataset.purpose === prefs.purpose) ? "1" : "0.86";
    b.style.borderColor = (b.dataset.purpose === prefs.purpose) ? "rgba(255,255,255,.22)" : "rgba(255,255,255,.10)";
    b.style.background = (b.dataset.purpose === prefs.purpose) ? "rgba(255,255,255,.08)" : "rgba(255,255,255,.03)";
  });

  $$("#pauseChips .chip").forEach(b => b.classList.toggle("active", Number(b.dataset.seconds) === Number(prefs.seconds)));
}

function renderPauseTexts(){
  const t = TEXT[prefs.lang];
  $("#pausePill").textContent = t.pausePill;
  $("#breathHint").textContent = t.breathHint;
  $("#stopBtn").textContent = t.stop;
  $("#backBtn").textContent = t.back;
}

function renderChoice(){
  const t = TEXT[prefs.lang];
  $("#choicePill").textContent = t.choicePill;
  $("#choiceTitle").textContent = t.choiceTitle;
  $("#choiceSub").textContent = t.choiceSub;
  $("#close1minBtn").textContent = t.close1;
  $("#limit5minBtn").textContent = t.limit5;
  $("#otherBtn").textContent = t.other;
  $("#homeBtn").textContent = t.home;
}

function renderStats(){
  const t = TEXT[prefs.lang];
  $("#statsPill").textContent = t.statsPill;
  $("#statsTitle").textContent = t.statsTitle;
  $("#statsSub").textContent = t.statsSub;
  $("#statsBackBtn").textContent = t.statsBack;
  $("#resetDataBtn").textContent = t.reset;
}

function renderSettingsModal(){
  const t = TEXT[prefs.lang];
  $("#settingsPill").textContent = t.settingsPill;
  $("#settingsTitle").textContent = t.settingsTitle;
  $("#settingsSub").textContent = t.settingsSub;
  $("#langTitle").textContent = t.langTitle;
  $("#settingsPurposeTitle").textContent = t.settingsPurposeTitle;
  $("#saveSettingsBtn").textContent = t.save;

  $$("#settingsOverlay .langBtn").forEach(b => b.classList.toggle("active", b.dataset.lang === pendingLang));
  $$("#settingsOverlay .purposeCard").forEach(b => b.classList.toggle("active", b.dataset.purpose === pendingPurpose));

  $("#sp_scroll").textContent = t.purposeName.scroll;
  $("#sp_stress").textContent = t.purposeName.stress;
  $("#sp_adhd").textContent = t.purposeName.adhd;
  $("#sp_school").textContent = t.purposeName.school;
}

function renderOtherModal(){
  const t = TEXT[prefs.lang];
  $("#otherPill").textContent = t.otherPill;
  $("#otherTitle").textContent = t.otherTitle;
  $("#otherSub").textContent = t.otherSub;
  $("#otherCloseBtn").textContent = t.otherClose;

  const list = $("#otherList");
  list.innerHTML = OTHER_ACTIVITIES.map(a=>{
    const title = (prefs.lang==="sv") ? a.sv : a.en;
    const sub = (prefs.lang==="sv") ? a.sv2 : a.en2;
    return `<button class="item" data-action="pickOther" data-id="${a.id}" type="button">${escapeHtml(title)}<small>${escapeHtml(sub)}</small></button>`;
  }).join("");
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

// ---------- Modals ----------
function openSettings(){
  pendingLang = prefs.lang;
  pendingPurpose = prefs.purpose;
  renderSettingsModal();
  $("#settingsOverlay").style.display = "flex";
  $("#settingsOverlay").setAttribute("aria-hidden","false");
}
function closeSettings(){
  $("#settingsOverlay").style.display = "none";
  $("#settingsOverlay").setAttribute("aria-hidden","true");
}
function openOther(){
  renderOtherModal();
  $("#otherOverlay").style.display = "flex";
  $("#otherOverlay").setAttribute("aria-hidden","false");
}
function closeOther(){
  $("#otherOverlay").style.display = "none";
  $("#otherOverlay").setAttribute("aria-hidden","true");
}

// ---------- Notifications (best effort) ----------
async function ensureNotificationPermission(){
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  try { return await Notification.requestPermission(); }
  catch { return "denied"; }
}
async function showReminderNotification(body){
  if (!("serviceWorker" in navigator)) return false;
  try{
    const reg = await navigator.serviceWorker.ready;
    if (!reg?.showNotification) return false;
    await reg.showNotification("Pause Now", {
      body,
      icon: "icons/icon-192.png",
      badge: "icons/icon-192.png",
      data: { url: "./" }
    });
    return true;
  }catch{
    return false;
  }
}

// ---------- Pause logic (NO overlaps) ----------
function stopTimer(goHome=true){
  if (timerInterval){
    clearInterval(timerInterval);
    timerInterval = null;
  }
  clearTimeout(limitTimeout);
  stopAmbient();
  stopCueHard();
  setOrbScale(1.0);

  pauseRunning = false;
  pauseSession++; // cancels queued cues

  if (goHome){
    renderHome();
    show("#screenHome");
  }
}

async function runBreathingLoop(sessionId){
  const t = TEXT[prefs.lang];
  const [iin, ihold, iout] = PATTERN[prefs.purpose] || PATTERN.scroll;

  // READY: exactly once at the start of pause
  $("#breathText").textContent = t.ready;
  setOrbScale(1.0);

  if (prefs.voice && sessionId === pauseSession){
    await playCueQueued("ready"); // queued, blocking
    // extra buffer so it never touches the next cue
    await wait(220);
  }

  while (pauseRunning && sessionId === pauseSession && timerInterval){
    // IN
    $("#breathText").textContent = t.inhale;
    setOrbScale(1.25);
    if (prefs.voice) await playCueQueued("in");
    await wait(iin * 1000);
    if (!pauseRunning || sessionId !== pauseSession || !timerInterval) break;

    // HOLD
    $("#breathText").textContent = t.hold;
    setOrbScale(1.25);
    if (prefs.voice) await playCueQueued("hold");
    await wait(ihold * 1000);
    if (!pauseRunning || sessionId !== pauseSession || !timerInterval) break;

    // OUT
    $("#breathText").textContent = t.exhale;
    setOrbScale(0.86);
    if (prefs.voice) await playCueQueued("out");
    await wait(iout * 1000);
  }
}

function startPause(){
  stopTimer(false);

  pauseRunning = true;
  pauseSession++; // new session id
  const sessionId = pauseSession;

  stopCueHard();
  stopAmbient();
  setOrbScale(1.0);

  remaining = Number(prefs.seconds || 30);
  $("#timerText").textContent = formatMMSS(remaining);

  renderPauseTexts();
  $("#breathText").textContent = TEXT[prefs.lang].ready;
  show("#screenPause");

  // IMPORTANT: NO coach voice at pause start (your requirement)
  // (Coach plays only when changing purpose)

  // Ambient ONLY during pause
  if (prefs.sound && prefs.ambient !== "off"){
    const file = AUDIO.ambient[prefs.ambient];
    if (file){
      ambientAudio = new Audio(file);
      ambientAudio.loop = true;
      ambientAudio.volume = 0.6;
      ambientAudio.play().catch(()=>{});
    }
  }

  // breathing loop (async)
  runBreathingLoop(sessionId);

  // countdown
  timerInterval = setInterval(async () => {
    remaining--;
    $("#timerText").textContent = formatMMSS(remaining);

    if (remaining <= 0){
      clearInterval(timerInterval);
      timerInterval = null;

      // stop phase/ambient first
      stopAmbient();
      setOrbScale(1.0);

      // stop breathing loop
      pauseRunning = false;

      // play DONE (only here) — queued so it never overlaps
      if (prefs.voice){
        await playCueQueued("done");
      }

      recordPauseCompleted();
      updateStatsUI();
      showToast(TEXT[prefs.lang].rewardDone);
      maybeRewards();

      renderChoice();
      show("#screenChoice");
    }
  }, 1000);
}

// ---------- Events ----------
function onClick(e){
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action;

  // START
  if (action === "startPickPurpose"){
    startDraft.purpose = el.dataset.purpose;
    $$("#screenStart .purposeCard").forEach(b => b.classList.toggle("active", b.dataset.purpose === startDraft.purpose));
    return;
  }
  if (action === "startPickLang"){
    startDraft.lang = el.dataset.lang;
    renderStart();
    return;
  }
  if (action === "startPickSeconds"){
    startDraft.seconds = Number(el.dataset.seconds);
    $$("#startChips .chip").forEach(b => b.classList.toggle("active", Number(b.dataset.seconds) === Number(startDraft.seconds)));
    return;
  }
  if (action === "finishStart"){
    prefs = { ...prefs, ...startDraft };
    saveJSON(KEYS.prefs, prefs);

    renderHome();
    renderChoice();
    renderStats();
    renderSettingsModal();

    showToast(TEXT[prefs.lang].microChosen(TEXT[prefs.lang].purposeName[prefs.purpose]));
    show("#screenHome");
    return;
  }

  // HOME
  if (action === "setPurpose"){
    prefs.purpose = el.dataset.purpose;
    saveJSON(KEYS.prefs, prefs);
    renderHome();
    showToast(TEXT[prefs.lang].microChosen(TEXT[prefs.lang].purposeName[prefs.purpose]));

    // Coach voice when changing purpose (as before)
    playCoachNow();
    return;
  }
  if (action === "setSeconds"){
    prefs.seconds = Number(el.dataset.seconds);
    saveJSON(KEYS.prefs, prefs);
    renderHome();
    return;
  }
  if (action === "startPause"){
    startPause();
    return;
  }
  if (action === "openStats"){
    renderWeek();
    renderStats();
    show("#screenStats");
    return;
  }
  if (action === "openSettings"){
    e.preventDefault();
    openSettings();
    return;
  }

  // PAUSE
  if (action === "stopPause"){
    stopTimer(true);
    return;
  }
  if (action === "backHome"){
    stopTimer(false);
    renderHome();
    show("#screenHome");
    return;
  }

  // CHOICE
  if (action === "choiceClose1m"){
    showToast(TEXT[prefs.lang].closeToast);
    renderHome();
    show("#screenHome");
    return;
  }
  if (action === "choiceLimit5m"){
    const t = TEXT[prefs.lang];
    showToast(t.limitToast);

    clearTimeout(limitTimeout);
    limitTimeout = setTimeout(async () => {
      const perm = await ensureNotificationPermission();
      if (perm === "granted"){
        const ok = await showReminderNotification(t.limitRemind);
        if (!ok) showToast(t.limitRemind);
      } else {
        showToast(t.limitRemind);
      }
    }, 5 * 60 * 1000);

    ensureNotificationPermission().then((perm)=>{
      if (perm !== "granted" && perm !== "unsupported"){
        showToast(t.limitNoPerm);
      }
    });

    renderHome();
    show("#screenHome");
    return;
  }
  if (action === "choiceOther"){
    openOther();
    return;
  }

  // OTHER
  if (action === "closeOther"){
    closeOther();
    renderHome();
    show("#screenHome");
    return;
  }
  if (action === "pickOther"){
    const picked = OTHER_ACTIVITIES.find(x => x.id === el.dataset.id);
    if (picked){
      const name = (prefs.lang==="sv") ? picked.sv : picked.en;
      showToast(`${TEXT[prefs.lang].picked} ${name}`);
    }
    closeOther();
    renderHome();
    show("#screenHome");
    return;
  }

  // STATS
  if (action === "resetData"){
    const ok = confirm(TEXT[prefs.lang].resetConfirm);
    if (!ok) return;
    localStorage.removeItem(KEYS.events);
    updateStatsUI();
    renderWeek();
    return;
  }

  // SETTINGS
  if (action === "closeSettings"){
    closeSettings();
    return;
  }
  if (action === "pickLang"){
    pendingLang = el.dataset.lang;
    renderSettingsModal();
    return;
  }
  if (action === "pickPurpose"){
    pendingPurpose = el.dataset.purpose;
    renderSettingsModal();
    return;
  }
  if (action === "saveSettings"){
    prefs.lang = pendingLang;
    prefs.purpose = pendingPurpose;
    saveJSON(KEYS.prefs, prefs);

    closeSettings();
    renderHome();
    renderChoice();
    renderStats();
    showToast(TEXT[prefs.lang].microChosen(TEXT[prefs.lang].purposeName[prefs.purpose]));

    // Coach voice when changing purpose via settings too
    playCoachNow();
    return;
  }
}

function onChange(e){
  const el = e.target;
  const action = el.dataset.action;

  // START
  if (action === "startToggleSound"){ startDraft.sound = el.checked; return; }
  if (action === "startToggleVoice"){ startDraft.voice = el.checked; return; }
  if (action === "startSetAmbient"){ startDraft.ambient = el.value; return; }

  // HOME
  if (action === "toggleSound"){
    prefs.sound = el.checked;
    saveJSON(KEYS.prefs, prefs);
    // Ambient should NOT play here, only during pause
    return;
  }
  if (action === "toggleVoice"){
    prefs.voice = el.checked;
    saveJSON(KEYS.prefs, prefs);
    return;
  }
  if (action === "setAmbient"){
    prefs.ambient = el.value;
    saveJSON(KEYS.prefs, prefs);
    // Ambient should NOT play here, only during pause
    return;
  }
}

// ---------- INIT ----------
function init(){
  // Always show onboarding first
  startDraft = { ...prefs };
  renderStart();
  show("#screenStart");

  // Pre-render other screens for consistent text
  renderHome();
  renderChoice();
  renderStats();
  renderPauseTexts();
  updateStatsUI();

  document.addEventListener("click", onClick);
  document.addEventListener("change", onChange);

  $("#settingsOverlay").addEventListener("click", (e)=>{ if (e.target === $("#settingsOverlay")) closeSettings(); });
  $("#otherOverlay").addEventListener("click", (e)=>{ if (e.target === $("#otherOverlay")) { closeOther(); renderHome(); show("#screenHome"); } });
}

init();

// PWA service worker
if ("serviceWorker" in navigator){
  window.addEventListener("load", ()=> {
    navigator.serviceWorker.register("./sw.js").catch(()=>{});
  });
}