const SUPABASE_URL="https://bxsvpwgaeeocpefaukkq.supabase.co";
const SUPABASE_KEY="sb_publishable_7pAX9I2gbAGPNoHcboD-8w_v5vZbsKx";
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const initialProjects=[
{id:"leoostore",name:"LEOOSTORE.id",category:"ecommerce",categoryLabel:"E-commerce",description:"Platform toko digital untuk katalog produk game dan layanan top-up.",status:"In development",url:"",art:"LEO",images:[]},
{id:"kyvora",name:"Kyvora.id",category:"web",categoryLabel:"Website",description:"Website katalog akun game dengan pengalaman visual bertema gaming.",status:"In development",url:"",art:"KYO",images:[]},
{id:"owner-dashboard",name:"Owner Dashboard",category:"business",categoryLabel:"Business tools",description:"Dashboard pengelolaan penjualan, produk, pengeluaran, dan laporan usaha.",status:"In development",url:"",art:"DB",images:[]}
];
const grid=document.querySelector("#projectGrid"),filters=document.querySelector("#projectFilters"),menuToggle=document.querySelector("#menuToggle"),mainNav=document.querySelector("#mainNav");
let projects=initialProjects,categories=[{slug:"ecommerce",label:"E-commerce"},{slug:"business",label:"Business tools"},{slug:"web",label:"Web design"}];
function safeText(value=""){return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]))}
function renderFilters(active="all"){if(!filters)return;filters.innerHTML='<button class="filter-chip '+(active==="all"?"active":"")+'" data-filter="all">All projects</button>'+categories.map(c=>'<button class="filter-chip '+(active===c.slug?"active":"")+'" data-filter="'+safeText(c.slug)+'">'+safeText(c.label)+'</button>').join("")}
function renderProjects(category="all"){
 if(!grid)return;const visible=projects.filter(p=>category==="all"||p.category===category);
 if(!visible.length){grid.innerHTML='<div class="empty-state">Belum ada project di kategori ini.</div>';return}
 grid.innerHTML=visible.map(p=>{
 const pics=p.images||[];const ratioClass=p.image_aspect_ratio==="9:16"?"ratio-9-16":p.image_aspect_ratio==="1:1"?"ratio-1-1":"ratio-16-9";let gallery="";
 if(pics.length===1)gallery='<div class="project-art '+ratioClass+'"><img src="'+safeText(pics[0])+'" alt="'+safeText(p.name)+'" loading="lazy"></div>';
 else if(pics.length>=2)gallery='<div class="project-gallery swipe '+ratioClass+'" aria-label="Galeri foto '+safeText(p.name)+'">'+pics.map((src,i)=>'<img src="'+safeText(src)+'" alt="'+safeText(p.name)+' — foto '+(i+1)+'" loading="lazy">').join("")+'</div>';
 else gallery='<div class="project-art"><span class="art-label">'+safeText(p.categoryLabel)+'</span><span class="art-monogram">'+safeText(p.art||p.name.slice(0,3).toUpperCase())+'</span></div>';
 const descriptionParts=String(p.description||"").split(/\r?\n/).map(line=>line.trim()).filter(Boolean);const cardParts=descriptionParts.filter(line=>line!=="Panduan Penggunaan DashboardOwner");const cardDescription=cardParts[0]||"";const hasMoreDescription=descriptionParts.length>1;
 return '<article class="project-card">'+gallery+'<div class="project-info"><div class="project-meta"><span>'+safeText(p.categoryLabel)+'</span><span class="project-status">'+safeText(p.status)+'</span></div>'+(p.show_price&&p.price_min!=null&&p.price_max!=null?'<div class="project-price"><span>Price</span><strong>'+new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(p.price_min)+' – '+new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(p.price_max)+'</strong></div>':'')+'<h3>'+safeText(p.name)+'</h3>'+(cardDescription?'<div class="project-description-preview"><p>'+safeText(cardDescription.length>190?cardDescription.slice(0,190).trimEnd()+"…":cardDescription)+'</p>'+(hasMoreDescription?'<button class="description-more" type="button" data-description-id="'+safeText(p.id)+'">Lihat seluruh deskripsi dan cara menggunakannya</button>':'')+'</div>':'')+'<div class="project-links">'+(p.url&&!p.is_private?'<a href="'+safeText(p.url)+'" target="_blank" rel="noopener">View project <span>↗</span></a>':(p.is_private?'<span class="project-status">Private project</span>':'<span class="project-status">View project segera tersedia</span>'))+'</div></div></article>'
 }).join("");
}
async function loadPublicProjects(){try{
 const [projectResult,categoryResult]=await Promise.all([
 db.from("portfolio_projects").select("id,name,category,category_label,description,status,url,image_path,image_paths,image_aspect_ratio,is_private,price_min,price_max,show_price,sort_order").eq("is_published",true).order("sort_order").order("created_at",{ascending:false}),
 db.from("portfolio_categories").select("slug,label,sort_order").eq("is_active",true).order("sort_order").order("label")
 ]);
 if(projectResult.error)throw projectResult.error;
 if(categoryResult.data?.length)categories=categoryResult.data;
 if(projectResult.data?.length){projects=projectResult.data.map(p=>{const paths=p.image_paths?.length?p.image_paths:(p.image_path?[p.image_path]:[]);return {...p,categoryLabel:p.category_label||categories.find(c=>c.slug===p.category)?.label||p.category,art:p.name.slice(0,3).toUpperCase(),images:paths.map(path=>db.storage.from("portfolio-projects").getPublicUrl(path).data.publicUrl)}})}
 renderFilters("all");renderProjects("all");
 }catch(error){console.warn("Portfolio database unavailable; showing starter projects.",error);renderFilters("all");renderProjects("all")}}
filters?.addEventListener("click",event=>{const button=event.target.closest("[data-filter]");if(!button)return;filters.querySelectorAll(".filter-chip").forEach(chip=>chip.classList.toggle("active",chip===button));renderProjects(button.dataset.filter)});
menuToggle?.addEventListener("click",()=>{const open=mainNav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open))});
mainNav?.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{mainNav.classList.remove("open");menuToggle?.setAttribute("aria-expanded","false")}));

const descriptionModal=document.querySelector("#descriptionModal"),descriptionModalTitle=document.querySelector("#descriptionModalTitle"),descriptionModalBody=document.querySelector("#descriptionModalBody");
grid?.addEventListener("click",event=>{const button=event.target.closest("[data-description-id]");if(!button)return;const project=projects.find(p=>String(p.id)===button.dataset.descriptionId);if(!project)return;descriptionModalTitle.textContent=project.name;descriptionModalBody.textContent=project.description||"";descriptionModal.hidden=false;document.body.classList.add("modal-open")});
function closeDescriptionModal(){if(descriptionModal){descriptionModal.hidden=true;document.body.classList.remove("modal-open")}}
document.querySelector("#descriptionModalClose")?.addEventListener("click",closeDescriptionModal);
descriptionModal?.addEventListener("click",event=>{if(event.target===descriptionModal)closeDescriptionModal()});
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeDescriptionModal()});
const testimonialPublicList=document.querySelector("#testimonialPublicList");
if(testimonialPublicList&&window.supabase){const publicDb=window.supabase.createClient("https://bxsvpwgaeeocpefaukkq.supabase.co","sb_publishable_7pAX9I2gbAGPNoHcboD-8w_v5vZbsKx");publicDb.from("portfolio_testimonials").select("client_name,client_role,company,content,rating").eq("is_published",true).order("sort_order").order("created_at",{ascending:false}).then(({data,error})=>{if(error||!data?.length){testimonialPublicList.innerHTML='<div class="testimonial-page-card"><span class="quote-mark">“</span><p>Testimonials from real project collaborations will appear here.</p><small>We only publish feedback with client permission.</small></div>';return}testimonialPublicList.innerHTML=data.map(t=>'<article class="testimonial-page-card"><span class="quote-mark">“</span><div class="testimonial-stars">'+("★".repeat(t.rating))+'</div><p>'+safeText(t.content)+'</p><small>'+safeText(t.client_name)+(t.client_role?" · "+safeText(t.client_role):"")+(t.company?" · "+safeText(t.company):"")+'</small></article>').join("")})}
const year=document.querySelector("#year");if(year)year.textContent=new Date().getFullYear();renderFilters();renderProjects();loadPublicProjects();