const WHATSAPP = "923259309271";
const STORAGE_KEY = "alpha_mobile_products_v2";
const products = loadProducts();

function loadProducts(){
  try{
    const saved=localStorage.getItem(STORAGE_KEY);
    if(saved){ const parsed=JSON.parse(saved); if(Array.isArray(parsed)) return parsed; }
  }catch(e){}
  return PRODUCTS.map(p=>({...p}));
}
function saveProducts(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(products)); }
function esc(v){ return String(v ?? "").replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m])); }
function phoneVisual(p){
  return p.image ? `<img class="phone-photo" src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"> <div class="mini-phone fallback-phone"></div>` : `<div class="mini-phone fallback-phone"></div>`;
}

const grid=document.getElementById("productGrid"), search=document.getElementById("searchInput"), filter=document.getElementById("brandFilter"), empty=document.getElementById("emptyState"), modal=document.getElementById("productModal"), modalContent=document.getElementById("modalContent");
const managerModal=document.getElementById("managerModal"), managerList=document.getElementById("managerList"), importFile=document.getElementById("importFile");

function refreshBrandFilter(){
  const current=filter.value;
  filter.innerHTML='<option value="All">All brands</option>' + [...new Set(products.map(p=>p.brand).filter(Boolean))].sort().map(b=>`<option value="${esc(b)}">${esc(b)}</option>`).join("");
  filter.value=[...filter.options].some(o=>o.value===current)?current:"All";
}
function render(){
  const q=search.value.trim().toLowerCase(), brand=filter.value;
  const list=products.filter(p=>(brand==="All"||p.brand===brand)&&(`${p.brand} ${p.name} ${p.specs}`.toLowerCase().includes(q)));
  grid.innerHTML=list.map(p=>`<article class="product-card"><div class="product-image">${phoneVisual(p)}<span class="badge">${esc(p.tag||"Available")}</span></div><div class="product-info"><div class="product-brand">${esc(p.brand)}</div><h3>${esc(p.name)}</h3><div class="specs">${esc(p.specs)}</div><div class="price-row"><span class="price">${esc(p.price)}</span><button class="view-btn" onclick="showProduct('${esc(p.id)}')">VIEW</button></div></div></article>`).join("");
  empty.hidden=list.length>0;
}
function showProduct(id){
  const p=products.find(x=>x.id===id); if(!p)return;
  const msg=encodeURIComponent(`Hello Alpha Mobile Shop, I am interested in ${p.name} (${p.brand}). Please share availability and price.`);
  modalContent.innerHTML=`<div class="modal-product"><div class="product-image">${phoneVisual(p)}</div><div><div class="product-brand">${esc(p.brand)}</div><h2>${esc(p.name)}</h2><p>${esc(p.specs)}</p><div class="modal-price">${esc(p.price)}</div><a class="btn primary" href="https://wa.me/${WHATSAPP}?text=${msg}" target="_blank" rel="noopener">Ask on WhatsApp →</a></div></div>`;
  modal.classList.add("show"); modal.setAttribute("aria-hidden","false");
}
window.showProduct=showProduct;
search.addEventListener("input",render); filter.addEventListener("change",render);
document.querySelectorAll(".brand-chip").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".brand-chip").forEach(b=>b.classList.remove("active"));btn.classList.add("active");filter.value=btn.dataset.brand;render();document.getElementById("phones").scrollIntoView({behavior:"smooth",block:"start"})}));
document.querySelector('[data-brand="All"]').classList.add("active");
document.querySelectorAll("[data-close]").forEach(el=>el.addEventListener("click",()=>{modal.classList.remove("show");modal.setAttribute("aria-hidden","true")}));

function openManager(){ managerModal.classList.add("show"); managerModal.setAttribute("aria-hidden","false"); renderManager(); }
function closeManager(){ managerModal.classList.remove("show"); managerModal.setAttribute("aria-hidden","true"); }
document.getElementById("openManager").addEventListener("click",openManager);
document.querySelectorAll("[data-manager-close]").forEach(el=>el.addEventListener("click",closeManager));

document.getElementById("addProductBtn").addEventListener("click",()=>{
  const id="p"+Date.now(); products.unshift({id,brand:"Samsung",name:"New Phone",specs:"Storage • RAM • 5G",price:"Rs. 0",tag:"New",image:""}); saveProducts(); refreshBrandFilter(); render(); renderManager();
  setTimeout(()=>{const input=document.querySelector(`[data-edit-id="${id}"] [name="name"]`); input?.focus(); input?.select();},50);
});
function renderManager(){
  managerList.innerHTML=products.map(p=>`<div class="manager-card" data-edit-id="${esc(p.id)}"><div class="manager-fields"><label>Brand<input name="brand" value="${esc(p.brand)}"></label><label>Model<input name="name" value="${esc(p.name)}"></label><label>Specs<input name="specs" value="${esc(p.specs)}" placeholder="256GB • 12GB RAM • 5G"></label><label>Price<input name="price" value="${esc(p.price)}" placeholder="Rs. 299,999"></label><label>Tag<input name="tag" value="${esc(p.tag)}" placeholder="New / Popular / Flagship"></label><label>Image URL<input name="image" value="${esc(p.image)}" placeholder="https://.../phone.jpg"></label></div><div class="manager-card-actions"><button class="btn primary save-one">Save</button><button class="btn danger delete-one">Delete</button></div></div>`).join("");
  managerList.querySelectorAll(".save-one").forEach(btn=>btn.addEventListener("click",()=>{
    const card=btn.closest(".manager-card"), p=products.find(x=>x.id===card.dataset.editId); if(!p)return;
    ["brand","name","specs","price","tag","image"].forEach(k=>p[k]=card.querySelector(`[name="${k}"]`).value.trim()); saveProducts(); refreshBrandFilter(); render(); renderManager(); alert("Phone saved on this device. Tap Export for GitHub when you want to publish it.");
  }));
  managerList.querySelectorAll(".delete-one").forEach(btn=>btn.addEventListener("click",()=>{const card=btn.closest(".manager-card"); if(confirm("Delete this phone?")){const i=products.findIndex(x=>x.id===card.dataset.editId);if(i>=0)products.splice(i,1);saveProducts();refreshBrandFilter();render();renderManager();}}));
}
function exportProducts(){
  const clean=products.map(({id,brand,name,specs,price,tag,image})=>({id,brand,name,specs,price,tag,image}));
  const text=`const PRODUCTS = ${JSON.stringify(clean,null,2)};\n`;
  const blob=new Blob([text],{type:"text/javascript"}), a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="products.js"; a.click(); URL.revokeObjectURL(a.href);
}
document.getElementById("exportBtn").addEventListener("click",exportProducts);
document.getElementById("importBtn").addEventListener("click",()=>importFile.click());
importFile.addEventListener("change",async e=>{const f=e.target.files[0];if(!f)return;try{const data=JSON.parse(await f.text());if(!Array.isArray(data))throw Error();products.splice(0,products.length,...data.map(p=>({...p,id:p.id||("p"+Date.now()+Math.random())})));saveProducts();refreshBrandFilter();render();renderManager();alert("Products imported successfully.");}catch(err){alert("That JSON file is not valid.");}e.target.value="";});
document.getElementById("resetBtn").addEventListener("click",()=>{if(confirm("Reset all products to the original demo list?")){products.splice(0,products.length,...PRODUCTS.map(p=>({...p})));saveProducts();refreshBrandFilter();render();renderManager();}});

document.addEventListener("keydown",e=>{if(e.key==="Escape"){modal.classList.remove("show");managerModal.classList.remove("show");}});
const menuBtn=document.getElementById("menuBtn"); menuBtn.addEventListener("click",()=>{const nav=document.getElementById("nav"),open=nav.style.display==="flex";nav.style.display=open?"none":"flex";if(!open){nav.style.position="absolute";nav.style.top="68px";nav.style.left="0";nav.style.right="0";nav.style.padding="18px 7%";nav.style.background="#fff";nav.style.flexDirection="column";nav.style.borderBottom="1px solid #ddd";nav.style.gap="16px";}});
document.getElementById("year").textContent=new Date().getFullYear(); refreshBrandFilter(); render();
