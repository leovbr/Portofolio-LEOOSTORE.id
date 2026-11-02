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
