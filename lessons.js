/* NumCode lessons: data, search, preview, PDF (print), done-tracking. */
(() => {
  "use strict";
  const L = [
    {l:"html",t:"Page structure",m:6,s:"The skeleton every web page shares, plus headings.",
     p:["Every page starts with a doctype, then an html element holding a head (info about the page) and a body (what people see).","Headings run from h1 (most important) to h6. Use one h1 per page and keep the order logical."],
     c:'<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>My first page</title>\n</head>\n<body>\n  <h1>Hello, NumCode!</h1>\n  <p>I am learning to build the web.</p>\n</body>\n</html>'},
    {l:"html",t:"Links, images and lists",m:7,s:"Connect pages, show pictures and group items.",
     p:["The a tag makes a link with href. The img tag shows a picture and needs src and alt text.","Use ul for bullet lists and ol for numbered lists. Each item goes in an li."],
     c:'<a href="about.html">About us</a>\n<img src="logo.png" alt="NumCode logo">\n<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>Java</li>\n</ul>'},
    {l:"html",t:"Forms and inputs",m:8,s:"Collect text, choices and clicks from users.",
     p:["A form wraps inputs. Each input needs a label so people know what to type.","The name attribute identifies the value when the form is sent."],
     c:'<form>\n  <label for="nick">Nickname</label>\n  <input id="nick" name="nick" type="text" required>\n  <button type="submit">Send</button>\n</form>'},
    {l:"css",t:"Selectors, colors and fonts",m:6,s:"Pick elements and change how they look.",
     p:["A selector chooses what to style: a tag (p), a class (.card) or an id (#top).","Properties like color, background and font-family go inside curly braces."],
     c:'.card {\n  color: white;\n  background: #8b5cf6;\n  font-family: Georgia, serif;\n}'},
    {l:"css",t:"The box model and spacing",m:7,s:"Content, padding, border and margin explained.",
     p:["Every element is a box: content, then padding (inside space), border, then margin (outside space).","Set box-sizing: border-box so width includes padding and border."],
     c:'.box {\n  box-sizing: border-box;\n  width: 240px;\n  padding: 16px;\n  border: 2px solid #a78bfa;\n  margin: 24px auto;\n}'},
    {l:"css",t:"Flexbox layouts",m:8,s:"Line things up in a row or column with little code.",
     p:["Add display: flex to a parent and its children line up in a row.","justify-content spaces items along the row; align-items lines them up across it."],
     c:'.row {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n}'},
    {l:"java",t:"Variables and data types",m:7,s:"Store values and choose the right type.",
     p:["A variable has a type, a name and a value. Common types: int (whole numbers), double (decimals), String (text), boolean (true/false).","Print with System.out.println."],
     c:'public class Main {\n  public static void main(String[] args) {\n    int score = 15;\n    String name = "Ana";\n    System.out.println(name + " scored " + score);\n  }\n}'},
    {l:"java",t:"Conditions and loops",m:9,s:"Make decisions and repeat actions.",
     p:["if / else runs code only when a condition is true.","A for loop repeats code a set number of times: start, condition, step."],
     c:'for (int i = 1; i <= 3; i++) {\n  if (i % 2 == 0) {\n    System.out.println(i + " is even");\n  } else {\n    System.out.println(i + " is odd");\n  }\n}'},
    {l:"java",t:"Methods",m:8,s:"Package code you can reuse.",
     p:["A method has a return type, a name and parameters. void means it returns nothing.","Call a method by name and pass arguments."],
     c:'static int square(int n) {\n  return n * n;\n}\n// square(4) gives 16'}
  ];
L.push(
{l:"html",t:"Text and formatting",m:5,s:"Paragraphs, bold, italic and line breaks.",p:["Use p for paragraphs, strong for important text and em for emphasis. br adds a line break."],c:'<p>NumCode is <strong>free</strong> and <em>simple</em>.<br>Start today.</p>'},
{l:"html",t:"Tables",m:7,s:"Show data in rows and columns.",p:["A table has rows (tr). Header cells use th and data cells use td. Group rows with thead and tbody."],c:'<table>\n  <tr><th>Language</th><th>Use</th></tr>\n  <tr><td>HTML</td><td>Structure</td></tr>\n</table>'},
{l:"html",t:"Semantic layout",m:6,s:"header, nav, main and footer give a page meaning.",p:["Semantic tags tell browsers and screen readers what each part is, which helps accessibility and search."],c:'<header>Site name</header>\n<nav>Menu</nav>\n<main>Content</main>\n<footer>Credits</footer>'},
{l:"html",t:"Buttons and input types",m:6,s:"Email, number, checkbox and more.",p:["The type attribute changes what an input accepts. Browsers check email and number values for you."],c:'<input type="email" placeholder="you@mail.com">\n<input type="number" min="0" max="10">\n<input type="checkbox"> I agree'},
{l:"html",t:"Adding CSS to a page",m:5,s:"Link a stylesheet or use a style tag.",p:["Link an external file in the head. External files keep style separate from structure and are easier to reuse."],c:'<head>\n  <link rel="stylesheet" href="style.css">\n</head>'},
{l:"css",t:"Hover effects",m:5,s:"Change style when the pointer is over something.",p:["The :hover pseudo-class applies styles while the pointer is over an element."],c:'.btn:hover {\n  background: #7c3aed;\n  box-shadow: 0 0 18px #a78bfa;\n}'},
{l:"css",t:"Transitions",m:6,s:"Smooth changes instead of sudden jumps.",p:["transition names the property, how long it takes and the easing. Put it on the normal state, not on :hover."],c:'.btn {\n  transition: transform .2s ease;\n}\n.btn:hover { transform: translateY(-2px); }'},
{l:"css",t:"Backgrounds and borders",m:6,s:"Fill colors, gradients, rounded corners.",p:["background can hold a color or gradient. border-radius rounds corners; 999px makes a pill."],c:'.card {\n  background: linear-gradient(#8b5cf6, #4c1d95);\n  border: 1px solid #c4b5fd;\n  border-radius: 16px;\n}'},
{l:"css",t:"Positioning basics",m:7,s:"Place an element relative to its parent.",p:["position: relative on a parent lets an absolute child sit in a corner of it with top, right, bottom and left."],c:'.parent { position: relative; }\n.badge {\n  position: absolute;\n  top: 8px; right: 8px;\n}'},
{l:"css",t:"Responsive design",m:7,s:"Make layouts fit phones and laptops.",p:["A media query applies styles only when a condition is true, such as a narrow screen. Add the viewport meta tag in the HTML head."],c:'.row { display: flex; }\n@media (max-width: 600px) {\n  .row { flex-direction: column; }\n}'},
{l:"java",t:"Input with Scanner",m:7,s:"Read what the user types.",p:["Import java.util.Scanner, create a Scanner on System.in, then call nextLine() or nextInt()."],c:'import java.util.Scanner;\n\nScanner in = new Scanner(System.in);\nSystem.out.print("Name: ");\nString name = in.nextLine();'},
{l:"java",t:"Operators",m:6,s:"Math, comparison and logic.",p:["Arithmetic: + - * / %. Comparison: == != < >. Logic: && (and), || (or), ! (not). Integer division drops decimals."],c:'int a = 7, b = 2;\nSystem.out.println(a / b);   // 3\nSystem.out.println(a % b);   // 1\nSystem.out.println(a > b && b > 0); // true'},
{l:"java",t:"Arrays",m:8,s:"Store many values of one type.",p:["Indexes start at 0. Use length for the size and a loop to visit every item."],c:'int[] scores = {10, 8, 9};\nfor (int i = 0; i < scores.length; i++) {\n  System.out.println(scores[i]);\n}'},
{l:"java",t:"Switch statements",m:6,s:"Choose between many fixed options.",p:["switch compares one value to several cases. End each case with break so the next one does not run too."],c:'int day = 2;\nswitch (day) {\n  case 1: System.out.println("Mon"); break;\n  case 2: System.out.println("Tue"); break;\n  default: System.out.println("Other");\n}'},
{l:"java",t:"Simple classes and objects",m:9,s:"Bundle data and actions together.",p:["A class is a blueprint. new creates an object from it. A constructor sets the starting values."],c:'class Student {\n  String name;\n  Student(String n) { name = n; }\n  void hi() { System.out.println("Hi, " + name); }\n}\nnew Student("Ana").hi();'}
);
const ORDER = ["html", "css", "java"]; L.sort((a, b) => ORDER.indexOf(a.l) - ORDER.indexOf(b.l));
  const NAME = {html:"HTML",css:"CSS",java:"Java"};
  const $ = (s) => document.querySelector(s);
  const KEY = "numcode-lessons-done";
  let done = {}; try { done = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (_) {}
  const cfg = window.NUMCODE || {}; let sb = null, uid = null;
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (_) {} };
  if (window.supabase && cfg.url) {
    sb = window.supabase.createClient(cfg.url, cfg.key);
    sb.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return; uid = session.user.id;
      const { data } = await sb.from("lesson_progress").select("lesson_id").eq("student_id", uid);
      (data || []).forEach((r) => { done[r.lesson_id] = true; });
      const rows = Object.keys(done).filter((k) => done[k]).map((k) => ({ student_id: uid, lesson_id: k }));
      if (rows.length) await sb.from("lesson_progress").upsert(rows);
      save(); draw();
    });
  }
  let lang = "all", q = "";
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; };
  const id = (x) => x.l + "-" + x.t;
  const match = (x) => (lang === "all" || x.l === lang) && (x.t + " " + x.s + " " + x.p.join(" ") + " " + NAME[x.l]).toLowerCase().includes(q);

  function body(x) {
    const d = el("div", "lesson-body");
    x.p.forEach((t) => d.appendChild(el("p", "", t)));
    d.appendChild(el("pre", "snip", x.c));
    return d;
  }
  function pdf(x) {
    const a = $("#print-area"); a.replaceChildren(el("h1", "", x.t + " (" + NAME[x.l] + ")"), body(x), el("p", "", "NumCode · Unida Christian Colleges"));
    document.title = "NumCode - " + x.t; window.print(); document.title = "Lessons — NumCode";
  }
  function draw() {
    const list = $("#lesson-list"), vids = $("#video-list");
    const r = L.filter(match);
    list.replaceChildren(); vids.replaceChildren();
    r.forEach((x) => {
      const c = el("article", "card lesson"); c.dataset.id = id(x);
      const tag = el("span", "pill", NAME[x.l] + " · " + x.m + " min");
      c.append(tag, el("h3", "", x.t), el("p", "", x.s));
      const det = el("div", "lesson-open"); det.hidden = true; det.appendChild(body(x));
      const row = el("div", "cta-row");
      const prev = el("button", "btn btn-ghost sm", "Preview");
      prev.setAttribute("aria-expanded", "false");
      prev.onclick = () => { det.hidden = !det.hidden; prev.setAttribute("aria-expanded", !det.hidden); prev.textContent = det.hidden ? "Preview" : "Hide"; };
      const dl = el("button", "btn btn-ghost sm", "Download PDF"); dl.onclick = () => pdf(x);
      const dn = el("button", "btn sm", done[id(x)] ? "Done ✓" : "Mark done");
      dn.onclick = () => { const k = id(x); done[k] = !done[k]; save(); if (sb && uid) (done[k] ? sb.from("lesson_progress").upsert({ student_id: uid, lesson_id: k }) : sb.from("lesson_progress").delete().eq("student_id", uid).eq("lesson_id", k)).then(() => {}); draw(); };
      row.append(prev, dl, dn); c.append(row, det); list.appendChild(c);
      const v = el("a", "card vid"); v.target = "_blank"; v.rel = "noopener";
      v.href = "https://www.youtube.com/results?search_query=" + encodeURIComponent(NAME[x.l] + " " + x.t + " tutorial for beginners");
      v.append(el("span", "pill", NAME[x.l]), el("h3", "", x.t), el("p", "", "Find short videos on YouTube"));
      vids.appendChild(v);
    });
    $("#count").textContent = r.length ? r.length + " of " + L.length + " lessons" : "No lessons match. Try a shorter word like “loop” or “form”.";
    const n = L.filter((x) => done[id(x)]).length;
    $("#done-bar").style.width = Math.round(n / L.length * 100) + "%";
    const nxt = L.find((x) => !done[id(x)]), cb = $("#continue"); cb.replaceChildren();
    if (nxt) {
      const b = el("button", "btn", "Continue learning: " + nxt.t);
      b.onclick = () => { lang = "all"; q = ""; $("#q").value = ""; document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c.dataset.lang === "all")); draw(); const t = document.querySelector('[data-id="' + id(nxt) + '"]'); t.scrollIntoView({ behavior: "smooth" }); t.querySelector("button").click(); };
      cb.appendChild(b);
    } else cb.appendChild(el("p", "", "All lessons done. Try a quiz next."));
    $("#done-txt").textContent = n + " of " + L.length + " lessons done";
  }
  $("#q").addEventListener("input", (e) => { q = e.target.value.trim().toLowerCase(); draw(); });
  document.querySelectorAll(".chip").forEach((b) => b.addEventListener("click", () => {
    lang = b.dataset.lang; document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b)); draw();
  }));
  draw();
})();
