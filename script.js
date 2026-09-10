const WHATSAPP = "923259309271";

const products = [
  {brand:"iPhone",name:"iPhone 15 Pro",specs:"128GB • Pro • 5G",price:"Ask for price",tag:"Popular"},
  {brand:"Samsung",name:"Galaxy S24 Ultra",specs:"256GB • 12GB RAM • 5G",price:"Ask for price",tag:"Flagship"},
  {brand:"Google Pixel",name:"Pixel 9 Pro",specs:"256GB • 16GB RAM • 5G",price:"Ask for price",tag:"Premium"},
  {brand:"OnePlus",name:"OnePlus 13",specs:"256GB • 12GB RAM • 5G",price:"Ask for price",tag:"New"},
  {brand:"Infinix",name:"NOTE Series",specs:"AMOLED • Fast charging",price:"Ask for price",tag:"Value"},
  {brand:"Tecno",name:"CAMON Series",specs:"Camera focused • 5G",price:"Ask for price",tag:"Camera"},
  {brand:"itel",name:"A Series",specs:"Long battery • Dual SIM",price:"Ask for price",tag:"Everyday"},
  {brand:"Samsung",name:"Galaxy A Series",specs:"AMOLED • Long battery",price:"Ask for price",tag:"Popular"}
];

const grid = document.getElementById("productGrid");
const search = document.getElementById("searchInput");
const filter = document.getElementById("brandFilter");
const empty = document.getElementById("emptyState");
const modal = document.getElementById("productModal");
const modalContent = document.getElementById("modalContent");

[...new Set(products.map(p=>p.brand))].forEach(brand=>{
  const opt=document.createElement("option"); opt.value=brand; opt.textContent=brand; filter.appendChild(opt);
});

function phoneVisual(){
  return `<div class="mini-phone"></div>`;
}

function render(){
  const q=search.value.trim().toLowerCase();
  const brand=filter.value;
  const list=products.filter(p=>
    (brand==="All" || p.brand===brand) &&
    (`${p.brand} ${p.name} ${p.specs}`.toLowerCase().includes(q))
  );
  grid.innerHTML=list.map((p,i)=>`
    <article class="product-card">
      <div class="product-image">${phoneVisual()}<span class="badge">${p.tag}</span></div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <h3>${p.name}</h3>
        <div class="specs">${p.specs}</div>
        <div class="price-row"><span class="price">${p.price}</span><button class="view-btn" onclick="showProduct(${products.indexOf(p)})">VIEW</button></div>
      </div>
    </article>`).join("");
  empty.hidden=list.length>0;
}

function showProduct(index){
  const p=products[index];
  const msg=encodeURIComponent(`Hello Alpha Mobile Shop, I am interested in ${p.name} (${p.brand}). Please share availability and price.`);
  modalContent.innerHTML=`
    <div class="modal-product">
      <div class="product-image">${phoneVisual()}</div>
      <div>
        <div class="product-brand">${p.brand}</div>
        <h2>${p.name}</h2>
        <p>${p.specs}</p>
        <div class="modal-price">${p.price}</div>
        <a class="btn primary" href="https://wa.me/${WHATSAPP}?text=${msg}" target="_blank" rel="noopener">Ask on WhatsApp →</a>
      </div>
    </div>`;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden","false");
}
window.showProduct=showProduct;

search.addEventListener("input",render);
filter.addEventListener("change",render);
document.querySelectorAll(".brand-chip").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".brand-chip").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    filter.value=btn.dataset.brand;
    render();
    document.getElementById("phones").scrollIntoView({behavior:"smooth",block:"start"});
  });
});
document.querySelector('[data-brand="All"]').classList.add("active");

document.querySelectorAll("[data-close]").forEach(el=>el.addEventListener("click",()=>{
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden","true");
}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")modal.classList.remove("show")});

const menuBtn=document.getElementById("menuBtn");
menuBtn.addEventListener("click",()=>{
  const nav=document.getElementById("nav");
  const open=nav.style.display==="flex";
  nav.style.display=open?"none":"flex";
  if(!open){nav.style.position="absolute";nav.style.top="68px";nav.style.left="0";nav.style.right="0";nav.style.padding="18px 7%";nav.style.background="#fff";nav.style.flexDirection="column";nav.style.borderBottom="1px solid #ddd";nav.style.gap="16px";}
});
document.getElementById("year").textContent=new Date().getFullYear();
render();
