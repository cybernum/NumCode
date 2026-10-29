/* NumCode — tiny vanilla JS: burger menu, hero code typing, scroll reveal, marquee, quiz demo. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Burger menu */
  const burger = $(".burger"), links = $(".nav-links");
  if (burger && links) {
    const set = (open) => {
      burger.setAttribute("aria-expanded", open);
      links.classList.toggle("open", open);
    };
    burger.addEventListener("click", () => set(burger.getAttribute("aria-expanded") !== "true"));
    links.addEventListener("click", (e) => e.target.closest("a") && set(false));
    document.addEventListener("keydown", (e) => e.key === "Escape" && set(false));
  }

  /* Footer year */
  const yr = $("#year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* Scroll reveal */
  const rev = $$(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    rev.forEach((el) => io.observe(el));
  } else rev.forEach((el) => el.classList.add("in"));

  /* Marquee: clone the images once so the loop is seamless */
  const track = $(".track");
  if (track && !reduce) {
    [...track.children].forEach((img) => {
      const c = img.cloneNode(true);
      c.alt = ""; c.setAttribute("aria-hidden", "true");
      track.appendChild(c);
    });
  }

  /* Hero code window */
  const pre = $("#code"), tabs = $$(".tab");
  if (pre && tabs.length) {
    const code = {
      html: [
        '<span class="c">&lt;!-- Your first page --&gt;</span>',
        '<span class="t">&lt;h1&gt;</span>Hello, NumCode!<span class="t">&lt;/h1&gt;</span>',
        '<span class="t">&lt;p</span> <span class="f">class</span>=<span class="s">"lead"</span><span class="t">&gt;</span>',
        '  I am learning to build the web.',
        '<span class="t">&lt;/p&gt;</span>',
        '<span class="t">&lt;button&gt;</span>Start<span class="t">&lt;/button&gt;</span>',
      ],
      css: [
        '<span class="c">/* Make it glow */</span>',
        '<span class="t">.btn</span> {',
        '  <span class="f">color</span>: <span class="s">white</span>;',
        '  <span class="f">background</span>: <span class="s">#8b5cf6</span>;',
        '  <span class="f">border-radius</span>: <span class="n">999px</span>;',
        '  <span class="f">box-shadow</span>: <span class="n">0 0 20px</span> <span class="s">#a78bfa</span>;',
        '}',
      ],
      java: [
        '<span class="k">public class</span> <span class="f">Main</span> {',
        '  <span class="k">public static void</span> <span class="f">main</span>(String[] args) {',
        '    <span class="k">for</span> (<span class="k">int</span> i = <span class="n">1</span>; i &lt;= <span class="n">3</span>; i++) {',
        '      System.out.<span class="f">println</span>(<span class="s">"Lesson "</span> + i);',
        '    }',
        '  }',
        '}',
      ],
    };
    let current = "html", timer;
    const show = (key) => {
      current = key;
      tabs.forEach((t) => t.setAttribute("aria-selected", t.dataset.lang === key));
      pre.innerHTML = code[key].map((l, i) => `<span class="ln" style="animation-delay:${reduce ? 0 : i * 0.18}s">${l}</span>`).join("");
      pre.lastElementChild.classList.add("caret");
    };
    const auto = () => {
      if (reduce) return;
      clearInterval(timer);
      timer = setInterval(() => {
        const keys = Object.keys(code);
        show(keys[(keys.indexOf(current) + 1) % keys.length]);
      }, 6500);
    };
    tabs.forEach((t) => t.addEventListener("click", () => { show(t.dataset.lang); auto(); }));
    show("html"); auto();
  }

  /* Quiz + progress tracker demo (modules page) */
  const quiz = $("#quiz");
  if (quiz) {
    const Q = [
      { lang: "html", q: "Which tag creates the largest heading?", o: ["<h6>", "<h1>", "<head>", "<header>"], a: 1 },
      { lang: "css", q: "Which CSS property changes the text color?", o: ["font-style", "text-color", "color", "background"], a: 2 },
      { lang: "java", q: "Which statement prints a line to the console?", o: ["System.out.println()", "console.log()", "print.line()", "echo()"], a: 0 },
    ];
    const KEY = "numcode-demo-progress";
    let i = 0, score = 0;
    const done = { html: 0, css: 0, java: 0 };
    try { Object.assign(done, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (_) {}
    const body = $("#quiz-body"), stepLbl = $("#quiz-step");
    const paintTracker = () => {
      let total = 0;
      for (const k in done) {
        total += done[k];
        const bar = $(`#bar-${k}`), pct = $(`#pct-${k}`);
        if (bar) bar.style.width = done[k] + "%";
        if (pct) pct.textContent = done[k] + "%";
      }
      const all = $("#bar-all"), allp = $("#pct-all");
      if (all) all.style.width = Math.round(total / 3) + "%";
      if (allp) allp.textContent = Math.round(total / 3) + "%";
    };
    const render = () => {
      if (i >= Q.length) {
        body.innerHTML = `<h3>Quiz complete 🎉</h3><p>You scored <b style="color:#fff">${score} / ${Q.length}</b>. Scores like this are saved to the tracker automatically.</p><button class="btn" id="again">Try again</button>`;
        stepLbl.textContent = "Done";
        $("#again").onclick = () => { i = 0; score = 0; render(); };
        return;
      }
      const cur = Q[i];
      stepLbl.textContent = `Question ${i + 1} of ${Q.length} · ${cur.lang.toUpperCase()}`;
      body.innerHTML = `<h3></h3><div class="opts"></div><p id="fb" aria-live="polite" style="min-height:1.5em"></p>`;
      $("h3", body).textContent = cur.q;
      const box = $(".opts", body);
      cur.o.forEach((txt, idx) => {
        const b = document.createElement("button");
        b.className = "opt"; b.textContent = txt;
        b.onclick = () => {
          const right = idx === cur.a;
          $$(".opt", box).forEach((x, n) => { x.disabled = true; if (n === cur.a) x.classList.add("ok"); });
          if (!right) b.classList.add("bad"); else score++;
          done[cur.lang] = right ? 100 : Math.max(done[cur.lang], 40);
          try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (_) {}
          paintTracker();
          $("#fb").textContent = right ? "Correct! +1 point" : "Not quite — the correct answer is highlighted.";
          setTimeout(() => { i++; render(); }, 1400);
        };
        box.appendChild(b);
      });
    };
    render(); paintTracker();
  }
})();
