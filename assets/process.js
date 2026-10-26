/* Renders Home (body[data-page=home]) and one stage page (body[data-stage=N]).
   Data comes from stages.js. Progress + "where you left off" are saved in this browser (localStorage). */
(function(){
const BASE=document.body.dataset.base||"";
const STORE_KEY="kz_checklist_v18", OLD_KEY="kz_checklist_v17";
const TICK='<svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
const rel=u=>(/^(https?:|mailto:|#)/.test(u)?u:BASE+u);
const NEWTAB=' target="_blank" rel="noopener"';

let store;
try{store=JSON.parse(localStorage.getItem(STORE_KEY))||{};}catch(e){store={};}
store.checks=store.checks||{};
store.routes=Object.assign({},DEFAULT_ROUTES,store.routes||{});
const save=()=>{try{localStorage.setItem(STORE_KEY,JSON.stringify(store));}catch(e){}};
const visible=w=>!w||w.every(t=>{const[g,v]=t.split(":");return store.routes[g]===v;});
const WORK=STAGES.filter(s=>!s.ref);
const strip=h=>h.replace(/<[^>]+>/g,"");

function stageStats(st){
  let t=0,d=0;
  st.sections.forEach(sec=>{ if(sec.donot)return;
    sec.items.forEach((it,i)=>{ if(!visible(it.when))return; t++; if(store.checks[sec.id+"-"+i])d++; });
  });
  return {t,d,pct:t?Math.round(d/t*100):0};
}
/* first visible, unchecked step in a stage (skips the traps box) */
function nextStep(st){
  for(const sec of st.sections){ if(sec.donot)continue;
    for(let i=0;i<sec.items.length;i++){ const it=sec.items[i];
      if(visible(it.when)&&!store.checks[sec.id+"-"+i])return {id:sec.id+"-"+i,t:strip(it.t),sec:sec.title}; } }
  return null;
}
function ownersOf(st){
  const s=new Set(); st.sections.forEach(sec=>sec.items.forEach(it=>it.o&&s.add(it.o==="claudedaisy"?"claude":it.o)));
  return ["daisy","basil","claude"].filter(o=>s.has(o));
}
const WHO={daisy:["Daisy","who-daisy"],basil:["Basil","who-basil"],claude:["Claude + Basil","who-claude"],claudedaisy:["Claude + Daisy","who-claude"]};
function chip(o,short){return '<span class="who '+WHO[o][1]+'">'+(short&&o==="claude"?"Claude":WHO[o][0])+'</span>';}
const pageFor=st=>BASE+"process/"+st.id+".html";
const settingsText=()=>ROUTEDEF.map(g=>g.options.find(o=>o.v===store.routes[g.group]).t).join(" · ");

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
  if(f)f.style.width=pct+"%"; if(n)n.textContent=d+" of "+t+" steps";
}

/* one-time note */
const note=document.getElementById("v2note");
try{ if(note&&localStorage.getItem(OLD_KEY)&&!store.v2seen)note.hidden=false; }catch(e){}
const nb=document.getElementById("v2close");
if(nb)nb.addEventListener("click",()=>{store.v2seen=true;save();note.hidden=true;});

/* ---------- home ---------- */
if(document.body.dataset.page==="home"){
  const map=document.getElementById("map"), resume=document.getElementById("resume");
  function drawResume(){
    const last=store.last&&STAGES.find(s=>s.id===store.last.stage&&!s.ref);
    let st=last, nx=last&&nextStep(last);
    if(!nx){ st=WORK.find(s=>nextStep(s)); nx=st&&nextStep(st); }
    if(!st){ resume.innerHTML='<div class="resume done"><div><span class="resume-k">All caught up</span><h2>Every step is checked.</h2></div></div>'; return; }
    const started=!!store.last;
    resume.innerHTML='<a class="resume" href="'+pageFor(st)+'#s'+nx.id+'"><div><span class="resume-k">'+(started?'Pick up where you left off':'Start here')+'</span>'+
      '<h2><span class="resume-n">'+st.id+'</span> '+st.title+'</h2><p>Next step: <b>'+nx.t+'</b></p></div><span class="btn blue">'+(started?'Continue':'Start')+'</span></a>';
  }
  function drawMap(){
    const here=store.last&&store.last.stage;
    map.innerHTML=WORK.map(st=>{
      const s=stageStats(st);
      const cls=s.t&&s.d===s.t?" done":(s.d?" started":"");
      return '<a class="stage-key'+cls+'" href="'+pageFor(st)+'">'+(st.id===here?'<span class="here">You were here</span>':'')+'<span class="num">'+st.id+'</span><h3>'+st.title+'</h3><span class="what">'+(st.blurb||st.note)+'</span>'+
        '<span class="owners">'+ownersOf(st).map(o=>chip(o,1)).join("")+'</span>'+
        '<span class="meta"><span>'+(st.time||"")+'</span><span class="mini"><i style="width:'+s.pct+'%"></i></span><span>'+s.d+'/'+s.t+'</span></span></a>';
    }).join("");
    overall(); drawResume();
  }
  renderSettings(document.getElementById("settings"),drawMap);
  drawMap();
}

/* ---------- stage page ---------- */
const sid=document.body.dataset.stage;
if(sid!==undefined){
  const idx=STAGES.findIndex(s=>s.id===sid), st=STAGES[idx];
  document.title=st.id+" · "+st.title+" - Kaizen";
  const rail=document.getElementById("rail"), main=document.getElementById("stage"), crumb=document.getElementById("crumb");
  if(!st.ref){ store.last=Object.assign({},store.last,{stage:sid,at:Date.now()}); save(); }

  function drawRail(){
    rail.innerHTML='<a class="back" href="'+BASE+'index.html">Home</a>'+STAGES.map(s=>{
      const p=s.ref?{t:0}:stageStats(s), done=p.t&&p.d===p.t;
      return '<a href="'+pageFor(s)+'"'+(s.id===sid?' aria-current="page"':'')+(done?' class="done"':'')+'><span class="n">'+s.id+'</span><span class="lbl">'+s.title+'</span>'+(s.ref?'':'<span class="p">'+p.pct+'%</span>')+'</a>';
    }).join("");
  }
  const head='<div class="stage-head"><span class="big" aria-hidden="true">'+st.id+'</span><h1>'+st.title+'</h1><div class="facts">'+
      (st.ref?'':ownersOf(st).map(o=>chip(o,1)).join(""))+(st.time&&!st.ref?'<span class="chip">'+st.time+'</span>':'')+'</div></div>'+
      '<p class="stage-note">'+st.note+'</p>';

  if(st.ref){
    main.innerHTML=head+st.html;
    main.querySelectorAll("a[href]").forEach(a=>{const h=a.getAttribute("href"); if(!/^(https?:|#)/.test(h))a.setAttribute("href",rel(h)); a.target="_blank"; a.rel="noopener";});
  }else{
    main.innerHTML=head+'<p class="showing">Showing steps for <b>'+settingsText()+'</b>. <a href="'+BASE+'index.html#settings">Change on Home</a></p>'+
      st.sections.map(sec=>{
      const items=sec.items.map((it,i)=>{
        const id=sec.id+"-"+i;
        const tags=(it.o?chip(it.o):"")+(it.when&&it.when.includes("type:seo")?'<span class="chip seo">SEO clients</span>':"")+
          (it.when&&it.when.includes("domain:live")?'<span class="chip">existing site</span>':"")+(it.when&&it.when.includes("domain:staging")?'<span class="chip">new build</span>':"")+(it.time?'<span class="chip">'+it.time+'</span>':"");
        const links=it.l?'<span class="links">'+it.l.map(x=>'<a href="'+rel(x[1])+'"'+NEWTAB+'>'+x[0]+'<span class="sr"> (opens in a new tab)</span></a>').join("")+'</span>':"";
        return '<div class="step" id="s'+id+'" data-id="'+id+'"'+(it.when?" data-when='"+JSON.stringify(it.when)+"'":"")+'><input type="checkbox" id="c'+id+'"><label class="tick" for="c'+id+'" aria-label="Mark done">'+TICK+'</label>'+
          '<div class="body"><span class="here-tag">You left off here</span><label for="c'+id+'"><span class="t">'+it.t+'</span></label><span class="tags">'+tags+'</span>'+(it.h?'<span class="h">'+it.h+'</span>':"")+links+'</div></div>';
      }).join("");
      return '<section class="group'+(sec.donot?" traps":"")+'" data-sec="'+sec.id+'" data-title="'+sec.title+'"><h2>'+sec.title+'<span class="count" data-count="'+sec.id+'"></span></h2><div class="steps">'+items+'</div></section>';
    }).join("");
    main.querySelectorAll('input[type=checkbox]').forEach(cb=>{
      const id=cb.id.slice(1); cb.checked=!!store.checks[id];
      cb.addEventListener("change",()=>{ if(cb.checked)store.checks[id]=true; else delete store.checks[id];
        store.last={stage:sid,step:id,at:Date.now()}; save(); refresh(false); });
    });
  }
  const prev=STAGES[idx-1], next=STAGES[idx+1];
  main.insertAdjacentHTML("beforeend",'<nav class="pager" aria-label="Stages">'+
    (prev?'<a class="btn" href="'+pageFor(prev)+'"><small>Previous</small>'+prev.id+' · '+prev.title+'</a>':'<a class="btn" href="'+BASE+'index.html"><small>Back</small>Home</a>')+
    (next?'<a class="btn blue next" href="'+pageFor(next)+'"><small>Next</small>'+next.id+' · '+next.title+'</a>':'<a class="btn blue next" href="'+BASE+'index.html"><small>Done</small>Back to Home</a>')+'</nav>');

  /* sticky "you are here" bar */
  let curSec="";
  function drawCrumb(){
    if(!crumb)return;
    const s=st.ref?null:stageStats(st);
    crumb.innerHTML='<div class="crumb-in"><a href="'+BASE+'index.html">Home</a><span class="sep">/</span><b>'+st.id+' · '+st.title+'</b>'+(curSec?'<span class="sep">/</span><span class="cur">'+curSec+'</span>':'')+
      (s?'<span class="crumb-p"><span class="mini"><i style="width:'+s.pct+'%"></i></span>'+s.d+' of '+s.t+'</span>':'')+'</div>';
  }
  if(!st.ref&&"IntersectionObserver" in window){
    const io=new IntersectionObserver(es=>{es.forEach(e=>{ if(e.isIntersecting){curSec=e.target.dataset.title;drawCrumb();} });},{rootMargin:"-130px 0px -65% 0px"});
    main.querySelectorAll(".group").forEach(g=>io.observe(g));
  }

  function markHere(){
    main.querySelectorAll(".step.here").forEach(x=>x.classList.remove("here"));
    const nx=st.ref?null:nextStep(st);
    if(nx){const el=document.getElementById("s"+nx.id); if(el)el.classList.add("here");}
    return nx;
  }
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
    markHere(); drawRail(); drawCrumb();
  }
  refresh();
  /* coming back: jump to the next unchecked step (unless a link already points somewhere) */
  const nx=st.ref?null:nextStep(st);
  const target=location.hash?document.getElementById(location.hash.slice(1)):null;
  const go=target||(nx&&stageStats(st).d>0?document.getElementById("s"+nx.id):null);
  if(go)setTimeout(()=>go.scrollIntoView({block:"center"}),60);
}
})();
