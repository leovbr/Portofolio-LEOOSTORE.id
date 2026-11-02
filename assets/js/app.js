const SUPABASE_URL="https://bxsvpwgaeeocpefaukkq.supabase.co";
const SUPABASE_KEY="sb_publishable_7pAX9I2gbAGPNoHcboD-8w_v5vZbsKx";
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const initialProjects=[
{id:"leoostore",name:"LEOOSTORE.id",category:"ecommerce",categoryLabel:"E-commerce",description:"Platform toko digital untuk katalog produk game dan layanan top-up.",status:"In development",url:"",art:"LEO",featured:true},
{id:"kyvora",name:"Kyvora.id",category:"web",categoryLabel:"Website",description:"Website katalog akun game dengan pengalaman visual bertema gaming.",status:"In development",url:"",art:"KYO",featured:true},
{id:"owner-dashboard",name:"Owner Dashboard",category:"business",categoryLabel:"Business tools",description:"Dashboard pengelolaan penjualan, produk, pengeluaran, dan laporan usaha.",status:"In development",url:"",art:"DB",featured:false}
];
const grid=document.querySelector("#projectGrid"),filters=document.querySelector("#projectFilters"),menuToggle=document.querySelector("#menuToggle"),mainNav=document.querySelector("#mainNav");
let projects=initialProjects;
function safeText(value=""){return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]))}
function renderProjects(category="all"){
 if(!grid)return;const visible=projects.filter(p=>category==="all"||p.category===category);
 if(!visible.length){grid.innerHTML='<div class="empty-state">Belum ada project di kategori ini.</div>';return}
 grid.innerHTML=visible.map(p=>{const image=p.image_url?'<img src="'+safeText(p.image_url)+'" alt="'+safeText(p.name)+'" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">':'';return '<article class="project-card"><div class="project-art">'+image+(image?'':'<span class="art-label">'+safeText(p.categoryLabel)+'</span><span class="art-monogram">'+safeText(p.art||p.name.slice(0,3).toUpperCase())+'</span>')+'</div><div class="project-info"><div class="project-meta"><span>'+safeText(p.categoryLabel)+'</span><span class="project-status">'+safeText(p.status)+'</span></div><h3>'+safeText(p.name)+'</h3><p>'+safeText(p.description)+'</p><div class="project-links">'+(p.url?'<a href="'+safeText(p.url)+'" target="_blank" rel="noopener">View project <span>↗</span></a>':'<span class="project-status">Live link coming soon</span>')+'</div></div></article>'}).join("");
}
async function loadPublicProjects(){try{const {data,error}=await db.from("portfolio_projects").select("id,name,category,category_label,description,status,url,image_path,featured,sort_order").eq("is_published",true).order("sort_order").order("created_at",{ascending:false});if(error)throw error;if(data?.length){projects=data.map(p=>({...p,categoryLabel:p.category_label,art:p.name.slice(0,3).toUpperCase(),image_url:p.image_path?db.storage.from("portfolio-projects").getPublicUrl(p.image_path).data.publicUrl:null}));renderProjects(filters?.querySelector(".filter-chip.active")?.dataset.filter||"all")}}catch(error){console.warn("Portfolio database unavailable; showing starter projects.",error)}}
filters?.addEventListener("click",event=>{const button=event.target.closest("[data-filter]");if(!button)return;filters.querySelectorAll(".filter-chip").forEach(chip=>chip.classList.toggle("active",chip===button));renderProjects(button.dataset.filter)});
menuToggle?.addEventListener("click",()=>{const open=mainNav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open))});
mainNav?.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{mainNav.classList.remove("open");menuToggle?.setAttribute("aria-expanded","false")}));
const year=document.querySelector("#year");if(year)year.textContent=new Date().getFullYear();renderProjects();loadPublicProjects();
