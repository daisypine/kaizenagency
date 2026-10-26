/* Renders the process map (body[data-page=map]) or one stage page (body[data-stage=N]).
   Data comes from stages.js. Progress is shared across pages through localStorage. */
(function(){
const BASE=document.body.dataset.base||"";
const STORE_KEY="kz_checklist_v18", OLD_KEY="kz_checklist_v17";
const TICK='<svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
const rel=u=>(/^(https?:|mailto:|#)/.test(u)?u:BASE+u);
const ext=u=>/^https?:/.test(u)?' target="_blank" rel="noopener"':'';

let store;
try{store=JSON.parse(localStorage.getItem(STORE_KEY))||{};}catch(e){store={};}
store.checks=store.checks||{};
store.routes=Object.assign({},DEFAULT_ROUTES,store.routes||{});
const save=()=>{try{localStorage.setItem(STORE_KEY,JSON.stringify(store));}catch(e){}};
const visible=w=>!w||w.every(t=>{const[g,v]=t.split(":");return store.routes[g]===v;});
const WORK=STAGES.filter(s=>!s.ref);

function stageStats(st){
  let t=0,d=0;
  st.sections.forEach(sec=>{ if(sec.donot)return;
    sec.items.forEach((it,i)=>{ if(!visible(it.when))return; t++; if(store.checks[sec.id+"-"+i])d++; });
  });
  return {t,d,pct:t?Math.round(d/t*100):0};
}
function ownersOf(st){
  const s=new Set(); st.sections.forEach(sec=>sec.items.forEach(it=>it.o&&s.add(it.o)));
  return ["daisy","basil","claude","claudedaisy"].filter(o=>s.has(o)).map(o=>o==="claudedaisy"?"claude":o).filter((v,i,a)=>a.indexOf(v)===i);
}
const WHO={daisy:["Daisy","who-daisy"],basil:["Basil","who-basil"],claude:["Claude + Basil","who-claude"],claudedaisy:["Claude + Daisy","who-claude"]};
function chip(o,short){return '<span class="who '+WHO[o][1]+'">'+(short&&o==="claude"?"Claude":WHO[o][0])+'</span>';}
const pageFor=st=>BASE+"process/"+st.id+".html";

/* settings toggles */
function renderSettings(el,onChange){
  if(!el)return;
  el.innerHTML=ROUTEDEF.map(g=>'<div><span class="lbl">'+g.label+'</span><span class="seg" role="group" aria-label="'+g.label+'">'+
    g.options.map(o=>'<button type="button" data-g="'+g.group+'" data-v="'+o.v+'" aria-pressed="'+(store.routes[g.group]===o.v)+'">'+o.t+'</button>').join("")+'</span></div>').join("");
  el.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
    store.routes[b.dataset.g]=b.dataset.v; save();
    el.querySelectorAll('button[data-g="'+b.dataset.g+'"]').forEach(x=>x.setAttribute("aria-pressed",x===b));
    onChange();
  }));
}
function overall(){
  let t=0,d=0; WORK.forEach(st=>{const s=stageStats(st);t+=s.t;d+=s.d;});
  const pct=t?Math.round(d/t*100):0;
  const f=document.getElementById("meterFill"),n=document.getElementById("meterNum");
  if(f)f.style.width=pct+"%"; if(n)n.textContent=d+" / "+t;
}

/* one-time note */
const note=document.getElementById("v2note");
try{ if(note&&localStorage.getItem(OLD_KEY)&&!store.v2seen)note.hidden=false; }catch(e){}
const nb=document.getElementById("v2close");
if(nb)nb.addEventListener("click",()=>{store.v2seen=true;save();note.hidden=true;});

/* ---------- map ---------- */
if(document.body.dataset.page==="map"){
  const map=document.getElementById("map");
  function drawMap(){
    map.innerHTML=WORK.map(st=>{
      const s=stageStats(st);
      const cls=s.t&&s.d===s.t?" done":(s.d?" started":"");
      return '<a class="stage-key'+cls+'" href="'+pageFor(st)+'"><span class="num">'+st.id+'</span><h3>'+st.title+'</h3><span class="what">'+(st.blurb||st.note)+'</span>'+
        '<span class="owners">'+ownersOf(st).map(o=>chip(o,1)).join("")+'</span>'+
        '<span class="meta"><span>'+(st.time||"")+'</span><span class="mini"><i style="width:'+s.pct+'%"></i></span><span>'+s.d+'/'+s.t+'</span></span></a>';
    }).join("");
    overall();
  }
  renderSettings(document.getElementById("settings"),drawMap);
  drawMap();
}

/* ---------- stage page ---------- */
const sid=document.body.dataset.stage;
if(sid!==undefined){
  const idx=STAGES.findIndex(s=>s.id===sid), st=STAGES[idx];
  document.title=st.id+" · "+st.title+" - Kaizen process";
  const rail=document.getElementById("rail"), main=document.getElementById("stage");
  function drawRail(){
    rail.innerHTML='<a class="back" href="'+BASE+'process/">All stages</a>'+STAGES.map(s=>{
      const p=s.ref?{t:0}:stageStats(s), done=p.t&&p.d===p.t;
      return '<a href="'+pageFor(s)+'"'+(s.id===sid?' aria-current="page"':'')+(done?' class="done"':'')+'><span class="n">'+s.id+'</span><span class="lbl">'+s.title+'</span>'+(s.ref?'':'<span class="p">'+p.pct+'%</span>')+'</a>';
    }).join("");
  }
  function head(){
    const s=st.ref?null:stageStats(st);
    return '<div class="stage-head"><span class="big" aria-hidden="true">'+st.id+'</span><h1>'+st.title+'</h1><div class="facts">'+
      (st.ref?'':ownersOf(st).map(o=>chip(o,1)).join(""))+(st.time&&!st.ref?'<span class="chip">'+st.time+'</span>':'')+
      (s?'<span class="chip" id="stageCount">'+s.d+' of '+s.t+' done</span>':'')+'</div></div>'+
      '<p class="stage-note">'+st.note+'</p>';
  }
  if(st.ref){
    main.innerHTML=head()+st.html;
    main.querySelectorAll("a[href]").forEach(a=>{const h=a.getAttribute("href"); if(!/^(https?:|#)/.test(h))a.setAttribute("href",rel(h)); if(/^https?:/.test(h)){a.target="_blank";a.rel="noopener";}});
  }else{
    main.innerHTML=head()+'<div class="settings" id="settings"></div>'+st.sections.map(sec=>{
      const items=sec.items.map((it,i)=>{
        const id=sec.id+"-"+i;
        const tags=(it.o?chip(it.o):"")+(it.when&&it.when.includes("type:seo")?'<span class="chip seo">SEO clients</span>':"")+
          (it.when&&it.when.includes("domain:live")?'<span class="chip">existing site</span>':"")+(it.when&&it.when.includes("domain:staging")?'<span class="chip">new build</span>':"")+(it.time?'<span class="chip">'+it.time+'</span>':"");
        const links=it.l?'<span class="links">'+it.l.map(x=>'<a href="'+rel(x[1])+'"'+ext(x[1])+'>'+x[0]+'</a>').join("")+'</span>':"";
        return '<div class="step" data-id="'+id+'"'+(it.when?" data-when='"+JSON.stringify(it.when)+"'":"")+'><input type="checkbox" id="c'+id+'"><label class="tick" for="c'+id+'" aria-label="Mark done">'+TICK+'</label>'+
          '<div class="body"><label for="c'+id+'"><span class="t">'+it.t+'</span></label><span class="tags">'+tags+'</span>'+(it.h?'<span class="h">'+it.h+'</span>':"")+links+'</div></div>';
      }).join("");
      return '<section class="group'+(sec.donot?" traps":"")+'" data-sec="'+sec.id+'"><h2>'+sec.title+'<span class="count" data-count="'+sec.id+'"></span></h2><div class="steps">'+items+'</div></section>';
    }).join("");
    main.querySelectorAll('input[type=checkbox]').forEach(cb=>{
      const id=cb.id.slice(1); cb.checked=!!store.checks[id];
      cb.addEventListener("change",()=>{ if(cb.checked)store.checks[id]=true; else delete store.checks[id]; save(); refresh(); });
    });
    renderSettings(document.getElementById("settings"),refresh);
  }
  const prev=STAGES[idx-1], next=STAGES[idx+1];
  main.insertAdjacentHTML("beforeend",'<nav class="pager" aria-label="Stages">'+
    (prev?'<a class="btn" href="'+pageFor(prev)+'"><small>Previous</small>'+prev.id+' · '+prev.title+'</a>':'')+
    (next?'<a class="btn blue next" href="'+pageFor(next)+'"><small>Next</small>'+next.id+' · '+next.title+'</a>':'<a class="btn blue next" href="'+BASE+'process/"><small>Done</small>Back to all stages</a>')+'</nav>');
  function refresh(){
    main.querySelectorAll(".step").forEach(el=>{
      el.classList.toggle("hide",!visible(el.dataset.when?JSON.parse(el.dataset.when):null));
      el.classList.toggle("checked",!!store.checks[el.dataset.id]);
    });
    main.querySelectorAll(".group").forEach(g=>{
      const vis=[...g.querySelectorAll(".step")].filter(x=>!x.classList.contains("hide"));
      g.hidden=!vis.length;
      const c=g.querySelector("[data-count]"); if(c&&!g.classList.contains("traps"))c.textContent=vis.filter(x=>x.classList.contains("checked")).length+" of "+vis.length;
    });
    if(!st.ref){const s=stageStats(st),c=document.getElementById("stageCount"); if(c)c.textContent=s.d+" of "+s.t+" done";}
    drawRail(); overall();
  }
  refresh();
}
})();
