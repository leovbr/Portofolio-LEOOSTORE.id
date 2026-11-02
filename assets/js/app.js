const initialProjects = [
  {id:"leoostore",name:"LEOOSTORE.id",category:"ecommerce",categoryLabel:"E-commerce",description:"Platform toko digital untuk katalog produk game dan layanan top-up.",status:"In development",statusType:"progress",url:"",art:"LEO",featured:true},
  {id:"kyvora",name:"Kyvora.id",category:"web",categoryLabel:"Website",description:"Website katalog akun game dengan pengalaman visual bertema gaming.",status:"In development",statusType:"progress",url:"",art:"KYO",featured:true},
  {id:"owner-dashboard",name:"Owner Dashboard",category:"business",categoryLabel:"Business tools",description:"Dashboard pengelolaan penjualan, produk, pengeluaran, dan laporan usaha.",status:"In development",statusType:"progress",url:"",art:"DB",featured:false}
];

const grid = document.querySelector("#projectGrid");
const filters = document.querySelector("#projectFilters");
const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

function safeText(value="") {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}

function renderProjects(category="all") {
  if (!grid) return;
  const visible = initialProjects.filter(project => category === "all" || project.category === category);
  if (!visible.length) {
    grid.innerHTML = '<div class="empty-state">Belum ada project di kategori ini.</div>';
    return;
  }
  grid.innerHTML = visible.map(project => `
    <article class="project-card">
      <div class="project-art">
        <span class="art-label">${safeText(project.categoryLabel)}</span>
        <span class="art-monogram">${safeText(project.art)}</span>
      </div>
      <div class="project-info">
        <div class="project-meta"><span>${safeText(project.categoryLabel)}</span><span class="project-status">${safeText(project.status)}</span></div>
        <h3>${safeText(project.name)}</h3>
        <p>${safeText(project.description)}</p>
        <div class="project-links">${project.url ? `<a href="${safeText(project.url)}" target="_blank" rel="noopener">View project <span>↗</span></a>` : '<span class="project-status">Live link coming soon</span>'}</div>
      </div>
    </article>`).join("");
}

filters?.addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  filters.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("active", chip === button));
  renderProjects(button.dataset.filter);
});

menuToggle?.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
mainNav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
renderProjects();


/* TEMP MOBILE WIDTH DIAGNOSTIC */
(() => {
  const panel = document.createElement("pre");
  panel.id = "width-diagnostic";
  panel.style.cssText = "position:fixed;left:6px;bottom:6px;z-index:99999;margin:0;padding:8px 10px;max-width:calc(100vw - 12px);background:#111e;color:#9ff;font:10px/1.45 monospace;border:1px solid #7de;border-radius:6px;white-space:pre-wrap;pointer-events:none";
  document.body.appendChild(panel);
  const measure = () => {
    const get = selector => {
      const el = document.querySelector(selector);
      if (!el) return "n/a";
      const r = el.getBoundingClientRect();
      return Math.round(r.width) + "px @ " + Math.round(r.left);
    };
    panel.textContent = [
      "viewport: " + window.innerWidth + " | doc: " + document.documentElement.clientWidth,
      "body: " + document.body.clientWidth + " | scroll: " + document.documentElement.scrollWidth,
      "header: " + get(".site-header"),
      "main: " + get("main"),
      "hero: " + get(".hero"),
      "strip: " + get(".intro-strip")
    ].join("\\n");
  };
  measure();
  window.addEventListener("resize", measure);
  setTimeout(measure, 500);
})();
