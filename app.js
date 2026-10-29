/* NumCode app: Supabase login, quizzes, points, teacher tools. */
(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x !== undefined) e.textContent = x; return e; };
  const cfg = window.NUMCODE || {};
  const root = $("#auth-box") || $("#quiz-app") || $("#teacher-app");
  if (!root) return;
  if (!window.supabase || !cfg.url || !cfg.key) { root.textContent = "Setup problem: check config.js and your internet connection."; return; }
  const sb = window.supabase.createClient(cfg.url, cfg.key);
  let me = null;
  const say = (box, t, bad) => { box.textContent = t; box.className = "msg" + (bad ? " bad" : ""); };
  const field = (label, type, id) => { const w = el("div", "fld"); const l = el("label", "", label); l.htmlFor = id; const i = el("input", "field"); i.id = id; i.type = type; w.append(l, i); return [w, i]; };
  async function load() {
    const { data: { session } } = await sb.auth.getSession();
    me = null;
    if (session) { const { data } = await sb.from("profiles").select("*").eq("id", session.user.id).maybeSingle(); me = data; }
    document.querySelectorAll('.nav-links a[href="account.html"]').forEach((a) => { a.textContent = me ? me.name.split(" ")[0] : "Log in"; });
  }

  /* ---------- Account ---------- */
  async function account() {
    const box = $("#auth-box"); box.replaceChildren(); await load();
    const note = el("p", "msg"); note.setAttribute("aria-live", "polite");
    if (!me) {
      const [n, name] = field("Name (for new accounts)", "text", "nm"), [e, email] = field("Email", "email", "em"), [p, pw] = field("Password (6+ characters)", "password", "pw");
      const rw = el("div", "fld"), rl = el("label", "", "I am a"), role = el("select", "field"); rl.htmlFor = "rl"; role.id = "rl";
      [["student", "Student"], ["teacher", "Teacher"]].forEach(([v, t]) => { const o = el("option", "", t); o.value = v; role.appendChild(o); }); rw.append(rl, role);
      const row = el("div", "cta-row"), li = el("button", "btn", "Log in"), su = el("button", "btn btn-ghost", "Create account");
      li.onclick = async () => { const { error } = await sb.auth.signInWithPassword({ email: email.value, password: pw.value }); error ? say(note, error.message, 1) : account(); };
      su.onclick = async () => {
        if (!name.value.trim()) return say(note, "Enter your name first.", 1);
        const { data, error } = await sb.auth.signUp({ email: email.value, password: pw.value, options: { data: { name: name.value.trim(), role: role.value } } });
        if (error) return say(note, error.message, 1);
        data.session ? account() : say(note, "Account created. Check your email to confirm it, then log in.");
      };
      row.append(li, su); box.append(n, e, p, rw, row, note); return;
    }
    box.append(el("h2", "", "Hi, " + me.name), el("p", "", (me.role === "teacher" ? "Teacher account" : "Student account") + " · " + me.points + " points"));
    { const a = el("a", "btn", "Make a quiz and see results"); a.href = "teacher.html"; box.append(a); }
    const out = el("button", "btn btn-ghost sm", "Log out"); out.onclick = async () => { await sb.auth.signOut(); account(); };
    box.append(note, out, el("h3", "", "Learning history"));
    const { data: rs } = await sb.from("results").select("*").eq("student_id", me.id).order("created_at", { ascending: false }).limit(20);
    box.append(table(["Quiz", "Score", "Date"], (rs || []).map((r) => [r.quiz_title, r.score + " / " + r.total, new Date(r.created_at).toLocaleDateString()]), "No quizzes yet. Take one on the Quizzes page."));
  }
  function table(head, rows, empty) {
    if (!rows.length) return el("p", "", empty);
    const w = el("div", "table-wrap"), t = el("table"), tr = el("tr");
    head.forEach((h) => tr.appendChild(el("th", "", h)));
    t.appendChild(el("thead")).appendChild(tr); const tb = t.appendChild(el("tbody"));
    rows.forEach((r) => { const x = el("tr"); r.forEach((c) => x.appendChild(el("td", "", c))); tb.appendChild(x); });
    w.appendChild(t); return w;
  }

  /* ---------- Quizzes ---------- */
  const P = {
    html: ["HTML practice", [["Which tag creates the largest heading?", ["<h6>", "<h1>", "<head>", "<header>"], 1], ["Which tag makes a link?", ["<link>", "<a>", "<href>", "<url>"], 1], ["Which attribute gives an image its alternative text?", ["src", "alt", "title", "href"], 1], ["Which tag starts a bullet list?", ["<ol>", "<li>", "<ul>", "<list>"], 2], ["Which tag wraps form inputs?", ["<input>", "<form>", "<label>", "<fieldset>"], 1]]],
    css: ["CSS practice", [["Which property changes text color?", ["font-style", "text-color", "color", "background"], 2], ["Which selector targets class “card”?", ["#card", ".card", "card", "*card"], 1], ["Which property adds space inside an element's border?", ["margin", "padding", "gap", "spacing"], 1], ["Which declaration makes a flex container?", ["display: flex", "flex: on", "position: flex", "float: flex"], 0], ["Which unit is relative to the parent font size?", ["px", "em", "cm", "pt"], 1]]],
    java: ["Java practice", [["Which statement prints a line?", ["System.out.println()", "console.log()", "print.line()", "echo()"], 0], ["Which type stores whole numbers?", ["String", "double", "int", "boolean"], 2], ["Which keyword repeats code a set number of times?", ["if", "for", "else", "switch"], 1], ["What does void mean in a method?", ["Returns text", "Returns nothing", "Returns a number", "Runs forever"], 1], ["Which operator checks equality?", ["=", "==", "=>", "!="], 1]]]
  };
  async function quizHome() {
    const box = $("#quiz-app"); box.replaceChildren(); await load();
    box.append(el("p", "", me ? "Signed in as " + me.name + ". Results and points are saved." : "You are not logged in. You can practice, but results are only saved when you log in."));
    const g = el("div", "grid g3");
    Object.keys(P).forEach((k) => { const c = el("article", "card"), b = el("button", "btn", "Start"); c.append(el("h3", "", P[k][0]), el("p", "", P[k][1].length + " questions · 1 point each"), b); b.onclick = () => run({ code: "practice-" + k, title: P[k][0], questions: P[k][1].map((x) => ({ q: x[0], o: x[1], a: x[2] })) }); g.appendChild(c); });
    box.appendChild(g);
    const [f, code] = field("Teacher's quiz code", "text", "qc"), b = el("button", "btn btn-ghost", "Join quiz"), note = el("p", "msg"); note.setAttribute("aria-live", "polite");
    b.onclick = async () => { if (!me) return say(note, "Log in first to join a teacher's quiz.", 1); const { data } = await sb.rpc("get_quiz", { p_code: code.value.trim() }); data && data[0] ? run(data[0]) : say(note, "No quiz found with that code.", 1); };
    const mk = el("a", "btn btn-ghost", "Make your own quiz"); mk.href = "teacher.html";
    box.append(el("h3", "", "Have a quiz code?"), f, b, note, el("h3", "", "Want to write questions?"), mk);
  }
  function run(qz) {
    const box = $("#quiz-app"); let i = 0, score = 0;
    const step = () => {
      box.replaceChildren();
      if (i >= qz.questions.length) return finish();
      const cur = qz.questions[i], fb = el("p", "msg"), opts = el("div", "opts"); fb.setAttribute("aria-live", "polite");
      box.append(el("p", "kicker", qz.title + " · Question " + (i + 1) + " of " + qz.questions.length), el("h3", "", cur.q), opts, fb);
      cur.o.forEach((t, n) => { const b = el("button", "opt", t); b.onclick = () => {
        opts.querySelectorAll("button").forEach((x, m) => { x.disabled = true; if (m === cur.a) x.classList.add("ok"); });
        if (n === cur.a) { score++; say(fb, "Correct!"); } else { b.classList.add("bad"); say(fb, "Not quite. The correct answer is highlighted.", 1); }
        setTimeout(() => { i++; step(); }, 1400); }; opts.appendChild(b); });
    };
    async function finish() {
      const n = el("p", "msg"); n.setAttribute("aria-live", "polite");
      const again = el("button", "btn btn-ghost", "Back to quizzes"); again.onclick = quizHome;
      box.append(el("h3", "", "Quiz complete: " + score + " / " + qz.questions.length), n, again);
      if (!me) return say(n, "Log in next time to save your score.");
      const { error } = await sb.from("results").insert({ quiz_code: qz.code, quiz_title: qz.title, student_id: me.id, student_name: me.name, score, total: qz.questions.length });
      say(n, error ? "Could not save your score: " + error.message : "Score saved. +" + score + " points.", !!error);
    }
    step();
  }

  /* ---------- Teacher ---------- */
  async function teacher() {
    const box = $("#teacher-app"); box.replaceChildren(); await load();
    if (!me) { box.append(el("p", "", "Log in on the Account page to make quizzes.")); return; }
    const [t, title] = field("Quiz title", "text", "qt"), ta = el("textarea", "field"), note = el("p", "msg"), b = el("button", "btn", "Create quiz");
    ta.id = "qq"; ta.rows = 7; ta.placeholder = "One question per line:\nWhat does CSS stand for? | Cascading Style Sheets | Computer Style Sheets | Creative Style System | 1";
    const l = el("label", "", "Questions. Format: question | option | option | … | number of the correct option"); l.htmlFor = "qq";
    note.setAttribute("aria-live", "polite");
    b.onclick = async () => {
      const qs = ta.value.split("\n").map((x) => x.trim()).filter(Boolean).map((x) => { const p = x.split("|").map((y) => y.trim()); return { q: p[0], o: p.slice(1, -1), a: parseInt(p[p.length - 1], 10) - 1 }; });
      if (!title.value.trim() || !qs.length || qs.some((x) => x.o.length < 2 || !(x.a >= 0 && x.a < x.o.length))) return say(note, "Check each line: a question, at least two options, and a valid correct-option number.", 1);
      const code = Math.random().toString(36).slice(2, 8).toUpperCase();
      const { error } = await sb.from("quizzes").insert({ code, title: title.value.trim(), questions: qs, created_by: me.id });
      error ? say(note, error.message, 1) : teacher();
    };
    box.append(el("h2", "", "Create a quiz"), t, l, ta, b, note, el("h2", "", "Your quizzes and results"));
    const { data: qz } = await sb.from("quizzes").select("code,title,created_at").order("created_at", { ascending: false });
    const { data: rs } = await sb.from("results").select("*").in("quiz_code", (qz || []).map((q) => q.code)).order("created_at", { ascending: false });
    if (!qz || !qz.length) { box.append(el("p", "", "No quizzes yet.")); return; }
    qz.forEach((q) => {
      const mine = (rs || []).filter((r) => r.quiz_code === q.code), avg = mine.length ? Math.round(mine.reduce((s, r) => s + r.score / r.total, 0) / mine.length * 100) : 0;
      box.append(el("h3", "", q.title + " · code " + q.code), el("p", "", mine.length + " submissions · average " + avg + "%"),
        table(["Student", "Score", "Date"], mine.map((r) => [r.student_name, r.score + " / " + r.total, new Date(r.created_at).toLocaleDateString()]), "No results yet. Share the code with students."));
    });
  }
  if ($("#auth-box")) account(); else if ($("#quiz-app")) quizHome(); else teacher();
})();
