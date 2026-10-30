/* Mhlongo Dzonga Fresh Bakery - front-end demonstration features */
const bakeryProducts = [
 {name:"Farmhouse Bread",price:18,category:"Bread",description:"Golden crust, fluffy inside. Fresh 700g loaf.",image:"images/farmhouse-bread.jpg",badge:"HOT & FRESH"},
 {name:"Fresh Biscuits",price:25,category:"Treats",description:"Buttery, crunchy biscuits. 12 in a pack.",image:"images/fresh-biscuits.jpg",badge:"KIDS' FAVOURITE"},
 {name:"Chocolate Drip Cake",price:45,category:"Cakes",description:"Moist chocolate cake with a mango twist.",image:"images/chocolate-drip-cake.jpg",badge:"CUSTOM ORDERS"},
 {name:"Brown Bread",price:20,category:"Bread",description:"Wholesome brown loaf, ideal for breakfast.",image:"images/brown-bread.jpg",badge:"FIBRE-RICH"},
 {name:"Butter Scones",price:15,category:"Treats",description:"Soft, buttery scones. Six per pack.",image:"images/butter-scones.jpg",badge:"FRESH DAILY"},
 {name:"Mango Cake",price:120,category:"Cakes",description:"Whole cake made with Tzaneen mangoes.",image:"images/mango-cake.jpg",badge:"LOCAL MANGOES"}
];
let bakeryCart = [];
function formatRand(n){return "R"+Number(n).toFixed(2)}
function updateCart(){
 const count=bakeryCart.reduce((sum,item)=>sum+item.qty,0);
 const total=bakeryCart.reduce((sum,item)=>sum+item.price*item.qty,0);
 document.querySelectorAll("[data-cart-count]").forEach(el=>el.textContent=count);
 document.querySelectorAll("[data-cart-total]").forEach(el=>el.textContent=formatRand(total));
 const list=document.getElementById("cart-items");
 if(list){list.innerHTML="";if(!bakeryCart.length)list.innerHTML="<p>Your cart is empty.</p>";bakeryCart.forEach(item=>{const row=document.createElement("p");row.textContent=`${item.name} × ${item.qty} — ${formatRand(item.price*item.qty)}`;list.appendChild(row)})}
}
function addToCart(name){
 const product=bakeryProducts.find(p=>p.name===name);
 if(!product){alert("This item could not be found.");return}
 const existing=bakeryCart.find(p=>p.name===name);
 if(existing)existing.qty++;else bakeryCart.push({...product,qty:1});
 updateCart();
 const notice=document.getElementById("cart-notice");
 if(notice){notice.textContent=`${name} added to your cart.`;notice.classList.add("success");notice.style.display="block"}
}
function renderProducts(){
 const grid=document.getElementById("product-grid");if(!grid)return;
 const search=(document.getElementById("product-search")?.value||"").toLowerCase().trim();
 const category=document.getElementById("product-category")?.value||"All";
 const sort=document.getElementById("product-sort")?.value||"featured";
 let items=bakeryProducts.filter(p=>(category==="All"||p.category===category)&&(`${p.name} ${p.description} ${p.category}`).toLowerCase().includes(search));
 if(sort==="price-low")items.sort((a,b)=>a.price-b.price);
 if(sort==="price-high")items.sort((a,b)=>b.price-a.price);
 if(sort==="name")items.sort((a,b)=>a.name.localeCompare(b.name));
 grid.innerHTML="";
 if(!items.length){grid.innerHTML='<p class="empty-state">No products match your search. Try another word or category.</p>';return}
 items.forEach((p,i)=>{
  const card=document.createElement("article");card.className="card fade-in";card.style.animationDelay=`${i*45}ms`;
  const img=document.createElement("img");img.src=p.image;img.alt=p.name;img.loading="lazy";
  const content=document.createElement("div");content.className="card-content";
  content.innerHTML=`<span class="badge">${p.badge}</span><h3>${p.name}</h3><p>${p.description}</p><p class="price">${formatRand(p.price)}${p.name==="Fresh Biscuits"?" / pack":p.name==="Butter Scones"?" / 6 pack":p.name==="Mango Cake"?" / whole":""}</p>`;
  const btn=document.createElement("button");btn.className="btn-cart";btn.textContent="🛒 Add to Cart";btn.addEventListener("click",()=>addToCart(p.name));
  content.appendChild(btn);card.append(img,content);grid.appendChild(card);
 });
}
document.addEventListener("DOMContentLoaded",()=>{
 renderProducts();
 ["product-search","product-category","product-sort"].forEach(id=>document.getElementById(id)?.addEventListener(id==="product-search"?"input":"change",renderProducts));
 updateCart();
 document.querySelectorAll("[data-current-year]").forEach(el=>el.textContent=new Date().getFullYear());
 // Tab interaction
 document.querySelectorAll("[role=tab]").forEach(tab=>tab.addEventListener("click",()=>{
  const group=tab.closest("[data-tabs]");if(!group)return;
  group.querySelectorAll("[role=tab]").forEach(t=>t.setAttribute("aria-selected",String(t===tab)));
  group.querySelectorAll("[role=tabpanel]").forEach(panel=>panel.hidden=panel.id!==tab.getAttribute("aria-controls"));
 }));
 // Lightbox gallery
 const lightbox=document.getElementById("lightbox");
 if(lightbox){
  document.querySelectorAll("[data-gallery-image]").forEach(btn=>btn.addEventListener("click",()=>{
   const img=btn.querySelector("img");const large=lightbox.querySelector("img");large.src=img.dataset.large||img.src;large.alt=img.alt;lightbox.classList.add("open");lightbox.setAttribute("aria-hidden","false");
  }));
  const close=()=>{lightbox.classList.remove("open");lightbox.setAttribute("aria-hidden","true")};
  lightbox.querySelector(".lightbox-close")?.addEventListener("click",close);
  lightbox.addEventListener("click",e=>{if(e.target===lightbox)close()});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
 }
 // Client-side validation and AJAX-style demo submission (no backend configured)
 document.querySelectorAll("form[data-demo-form]").forEach(form=>form.addEventListener("submit",async e=>{
  e.preventDefault();const message=form.querySelector(".form-message");message.className="form-message";message.textContent="";
  if(!form.checkValidity()){form.reportValidity();message.textContent="Please check the highlighted fields and try again.";message.classList.add("error");return}
  const data=Object.fromEntries(new FormData(form).entries());
  if(data.phone && !/^[+()0-9\\s-]{7,20}$/.test(data.phone)){message.textContent="Please enter a valid phone number.";message.classList.add("error");return}
  const submit=form.querySelector('[type="submit"]');const original=submit.textContent;submit.disabled=true;submit.textContent="Processing…";
  await new Promise(resolve=>setTimeout(resolve,450));
  message.textContent=form.dataset.formType==="enquiry"
   ? `Thank you, ${data.name}! Your enquiry about ${data.topic||"our bakery"} has been checked. Estimated product prices are listed on our Menu page. This demo has not sent your details to the bakery.`
   : `Thank you, ${data.name}. Your message has been prepared. Choose “Open email app” below to send it to the bakery.`;
  message.classList.add("success");
  if(form.dataset.formType==="contact"){
   const emailBody=`Name: ${data.name}\\nEmail: ${data.email}\\nPhone: ${data.phone||"Not supplied"}\\nMessage type: ${data.messageType}\\n\\nMessage:\\n${data.message}`;
   const link=document.createElement("a");link.className="btn";link.style.marginTop="12px";link.href=`mailto:makungujunior72@gmail.com?subject=${encodeURIComponent("Website message: "+data.messageType)}&body=${encodeURIComponent(emailBody)}`;link.textContent="Open email app";link.target="_blank";message.appendChild(document.createElement("br"));message.appendChild(link);
  }
  form.reset();submit.disabled=false;submit.textContent=original;
 }));
});
