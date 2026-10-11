const defaults = [
  {name:"YouTube",url:"https://www.youtube.com",icon:"▶",glow:"rgba(255,35,72,.23)",bg:"rgba(255,35,72,.14)"},
  {name:"Google",url:"https://www.google.com",icon:"G",glow:"rgba(255,255,255,.16)",bg:"rgba(255,255,255,.09)"},
  {name:"ChatGPT",url:"https://chatgpt.com",icon:"✳",glow:"rgba(255,35,72,.18)",bg:"rgba(255,35,72,.12)"},
  {name:"Instagram",url:"https://www.instagram.com",icon:"◎",glow:"rgba(255,70,100,.23)",bg:"rgba(255,70,100,.13)"},
  {name:"Wikipedia",url:"https://www.wikipedia.org",icon:"W",glow:"rgba(255,255,255,.14)",bg:"rgba(255,255,255,.08)"},
  {name:"GitHub",url:"https://github.com",icon:"⌘",glow:"rgba(255,35,72,.2)",bg:"rgba(255,35,72,.13)"},
  {name:"TikTok",url:"https://www.tiktok.com",icon:"♪",glow:"rgba(255,35,72,.2)",bg:"rgba(255,35,72,.13)"},
  {name:"Discord",url:"https://discord.com/app",icon:"◈",glow:"rgba(255,35,72,.22)",bg:"rgba(255,35,72,.14)"},
  {name:"Reddit",url:"https://www.reddit.com",icon:"●",glow:"rgba(255,80,40,.22)",bg:"rgba(255,80,40,.13)"},
  {name:"Spotify",url:"https://open.spotify.com",icon:"♫",glow:"rgba(255,35,72,.2)",bg:"rgba(255,35,72,.13)"}
];
const STORAGE_KEY = "lanzer-custom-sites-v1";
const grid = document.querySelector("#siteGrid");
const count = document.querySelector("#siteCount");
const empty = document.querySelector("#emptyState");
const dialog = document.querySelector("#siteDialog");
const form = document.querySelector("#siteForm");
let customSites = loadCustom();

function loadCustom(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]").filter(s=>s && s.name && s.url)}catch{return []}}
function saveCustom(){localStorage.setItem(STORAGE_KEY,JSON.stringify(customSites))}
function allSites(){return [...defaults,...customSites]}
function getDomain(url){try{return new URL(url).hostname.replace(/^www\./,"")}catch{return url}}
function render(){
  grid.innerHTML="";
  const sites=allSites();
  count.textContent=sites.length;
  empty.hidden=sites.length!==0;
  grid.hidden=sites.length===0;
  sites.forEach((site,index)=>{
    const a=document.createElement("a");
    a.className="site-card glass";
    a.href=site.url;a.target="_blank";a.rel="noopener noreferrer";
    a.style.setProperty("--glow",site.glow||"rgba(167,139,250,.17)");
    a.style.setProperty("--icon-bg",site.bg||"rgba(167,139,250,.14)");
    const icon=document.createElement("span");icon.className="site-icon";icon.textContent=site.icon||"✦";
    const name=document.createElement("span");name.className="site-name";name.textContent=site.name;
    const domain=document.createElement("span");domain.className="site-domain";domain.textContent=getDomain(site.url);
    const arrow=document.createElement("span");arrow.className="site-open";arrow.textContent="↗";
    a.append(icon,name,domain,arrow);
    if(index>=defaults.length){
      const remove=document.createElement("button");remove.type="button";remove.className="remove-site";remove.textContent="×";remove.title="Удалить сайт";remove.setAttribute("aria-label","Удалить "+site.name);
      remove.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();customSites.splice(index-defaults.length,1);saveCustom();render()});
      a.appendChild(remove);
    }
    grid.appendChild(a);
  });
}
function openDialog(){form.reset();dialog.showModal();setTimeout(()=>document.querySelector("#siteName").focus(),50)}
document.querySelector("#addButton").addEventListener("click",openDialog);
document.querySelector("#emptyAdd").addEventListener("click",openDialog);
document.querySelector("#closeDialog").addEventListener("click",()=>dialog.close());
document.querySelector("#cancelDialog").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
form.addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.querySelector("#siteName").value.trim();
  let url=document.querySelector("#siteUrl").value.trim();
  const icon=document.querySelector("#siteIcon").value.trim()||"✦";
  if(!name||!url)return;
  if(!/^https?:\/\//i.test(url))url="https://"+url;
  try{const parsed=new URL(url);if(!["http:","https:"].includes(parsed.protocol))throw new Error();url=parsed.href}catch{document.querySelector("#siteUrl").setCustomValidity("Введи корректный адрес сайта");document.querySelector("#siteUrl").reportValidity();return}
  document.querySelector("#siteUrl").setCustomValidity("");
  customSites.push({name,url,icon,glow:"rgba(255,35,72,.22)",bg:"rgba(255,35,72,.14)"});
  saveCustom();render();dialog.close();
});
document.querySelector("#searchForm").addEventListener("submit",e=>{
  e.preventDefault();const q=document.querySelector("#searchInput").value.trim();if(!q)return;
  const looksLikeUrl=/^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}([/?#].*)?$/i.test(q)||q.startsWith("localhost");
  if(looksLikeUrl){let url=/^https?:\/\//i.test(q)?q:"https://"+q;window.open(url,"_blank","noopener,noreferrer");return}
  const engine=document.querySelector("#engine").value;
  const urls={google:"https://www.google.com/search?q=",duck:"https://duckduckgo.com/?q=",bing:"https://www.bing.com/search?q="};
  window.open(urls[engine]+encodeURIComponent(q),"_blank","noopener,noreferrer");
});
const themeSelect=document.querySelector("#themeSelect");
themeSelect.addEventListener("change",()=>{
  document.body.classList.remove("theme-mono","theme-blue","theme-purple","theme-green","theme-pink","theme-orange");
  if(themeSelect.value!=="red")document.body.classList.add("theme-"+themeSelect.value);
  document.body.classList.remove("light");
  document.querySelector("#themeButton").textContent="☼";
  const colors={red:"#090607",mono:"#050505",blue:"#03080e",purple:"#08050d",green:"#030906",pink:"#0b0409",orange:"#0b0703"};
  document.querySelector('meta[name="theme-color"]').content=colors[themeSelect.value]||colors.red;
});
document.querySelector("#themeButton").addEventListener("click",()=>{
  document.body.classList.toggle("light");
  const light=document.body.classList.contains("light");
  document.querySelector("#themeButton").textContent=light?"☾":"☼";
  document.querySelector('meta[name="theme-color"]').content=light?"#e9ebf8":"#090607";
});
function updateClock(){const now=new Date();document.querySelector("#clock").textContent=now.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});document.querySelector("#dateText").textContent=now.toLocaleDateString("ru-RU",{weekday:"long",day:"numeric",month:"long"});}
render();updateClock();setInterval(updateClock,30000);
