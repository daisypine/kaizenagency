/* Kaizen team checklist data - edit steps here. IDs (section id + position) are what saves progress. */
/* ---------------- ROUTES ---------------- */
const ROUTEDEF=[
  {group:"type",label:"Project",options:[{v:"static",t:"Website only"},{v:"seo",t:"Website + monthly SEO"}]},
  {group:"domain",label:"Site",options:[{v:"staging",t:"New build (staging)"},{v:"live",t:"Existing live site"}]},
];
const DEFAULT_ROUTES={type:"seo",domain:"staging"};

/* ---------------- LINKS ---------------- */
const PB="hub/playbooks/";
const L={
  audit:["kaizen-site-audit",PB+"kaizen-site-audit.html"],
  sitemap:["kaizen-sitemap-builder",PB+"kaizen-sitemap-builder.html"],
  copy:["kaizen-copy-doc",PB+"kaizen-copy-doc.html"],
  base:["kaizen-build-base",PB+"kaizen-build-base.html"],
  leads:["kaizen-lead-routing",PB+"kaizen-lead-routing.html"],
  update:["kaizen-client-update",PB+"kaizen-client-update.html"],
  prompts:["Prompt",'hub/prompts.html'],
  sop:["Buildout SOP","https://docs.google.com/document/d/1GPHDPD7sNF_uLWpwQRn2OAIwIvg_PIxBv9n6cFgvXb8/edit"],
  hub:["Sunwest hub (example)","https://docs.google.com/spreadsheets/d/1tR1z6zMymRx3_6F97EFxkytSw__yvIaSabP21qtLimI/edit"],
  deck:["Brand deck example","sunwest-painting/brand-deck.html"],
  plan:["Gameplan example","sunwest-painting/gameplan.html"],
  report:["Report example","AHC-ACW/september-october.html"],
  ws:["Workspace","https://workspace.kaizenagency.org/"],
  cc:["Command Center","https://workspace.kaizenagency.org/boards/tskb_9b7ee495c37aec1cf31aba1d"],
};
const D="daisy",B="basil",CB="claude",CD="claudedaisy";
const OWN={daisy:["Daisy","own-daisy"],basil:["Basil","own-basil"],claude:["Claude + Basil","own-claude"],claudedaisy:["Claude + Daisy","own-claude"]};

/* ---------------- DATA ---------------- */
const STAGES=[
 {id:"0",owner:"Daisy · Basil",title:"Quick start",blurb:"Folders, hub sheet, board and Figma set up before anyone builds.",time:"30 min",
  note:"New client in 30 minutes. Nobody touches a site until this tab is done.",
  sections:[
   {id:"0A",title:"Before anything",items:[
     {t:"Agreement signed + deposit cleared",o:D,h:"no build work before both"},
     {t:"Copy, photos and Google Business Profile access confirmed",o:D,h:"these stall more projects than anything else - ask before the kickoff, not after"},
   ]},
   {id:"0B",title:"Set up the client's places",items:[
     {t:"Create the client's Google Drive folder",o:B},
     {t:"Copy the project hub sheet into it - one per client, never a duplicate",o:CB,l:[L.sitemap,L.hub],h:"tabs: Overview, Sitemap, Cleanup Log, Competitor Gap, Project Inventory, Visual Sitemap, Templates, Design Next, Content Calendar"},
     {t:"Create the client's workspace folder: Tasks board + Discussion",o:B,l:[L.ws]},
     {t:"Add a \"🔗LINKS 🔗\" list on the board",o:B,h:"hub, Drive, photos, Figma, copy doc, gameplan page, brand deck, print files, email docs, WP admin"},
     {t:"Add a card to Command Center: phase, next action, owner, due date, blocker",o:B,l:[L.cc],h:"no next action + due date = not being managed"},
     {t:"Create the client's folder in this GitHub repo",o:CB},
     {t:"Create the Figma file (one per client)",o:B},
     {t:"Open a Claude Project for the client; add the hub link and the brief",o:D},
   ]},
 ]},

 {id:"1",owner:"Daisy · Claude",title:"Discovery + audit",blurb:"Kickoff call, then audit what's there now.",time:"1-2 hrs",
  note:"Find out what's real before planning anything. Every finding goes in the hub's Cleanup Log.",
  sections:[
   {id:"1A",title:"Kickoff call",items:[
     {t:"Kickoff on Zoom, recorded",o:D,h:"services they do and DON'T do · service area · best jobs · why they lose bids · license number · which phone number to use"},
     {t:"Turn the transcript into a one-page brief",o:CB,l:[L.prompts]},
     {t:"Domain: registrar, who owns it, where email lives - export DNS before any change",o:D},
   ]},
   {id:"1B",title:"Audit the current site",items:[
     {t:"Plugins, themes, users, code snippets",o:CB,l:[L.audit],when:["domain:live"],time:"30 min"},
     {t:"SEO titles, schema, Search Console",o:CB,l:[L.audit],when:["domain:live"]},
     {t:"Security audit - any site Kaizen didn't build alone",o:CB,l:[L.base],when:["domain:live"],time:"15 min"},
     {t:"Log every finding in the Cleanup Log (Critical / High / Medium)",o:CB},
     {t:"Daisy reviews the log; fixes that touch the live site need her OK",o:D},
   ]},
 ]},

 {id:"2",owner:"Claude · Basil · Daisy",title:"Sitemap + hub",blurb:"Plan every page in the client's hub. Client signs off.",time:"2-3 hrs",
  note:"Only build pages that are listed in the hub. A page earns a row only if something real is behind it.",
  sections:[
   {id:"2A",title:"Research",items:[
     {t:"Answer the sitemap-builder questions before running it",o:D,l:[L.sitemap]},
     {t:"Crawl the site, read transcripts + emails, check Search Console + GA4",o:CB},
     {t:"Pull a competitor's sitemap.xml (or one the client admires)",o:CB,h:"keep only ideas the client can back with real work"},
   ]},
   {id:"2B",title:"Plan the pages",items:[
     {t:"Every service gets its own page",o:CB},
     {t:"Top 3 services get service + city pages for the top 5 cities",o:CB,when:["type:seo"],h:"a city page needs something real to that city, or it waits in Backlog"},
     {t:"Hubs with child URLs: /services/ /industries/ /projects/ /locations/ /blog/",o:CB,h:"location hub links to every city page"},
     {t:"Project pages from real jobs: city, job type, scope, before/after photos",o:CB,h:"the client's quote only if they wrote a real review. These rank and close deals."},
     {t:"Status + Phase set on every row",o:B,h:"Status: Live, Draft - In Review, Copy Ready, In Design, Waiting on Client, Needs Update, Not Started, Backlog. Phase: Phase 1 - Live, then one phase per month, then Backlog."},
     {t:"Client signs off the sitemap in writing",o:D},
   ]},
 ]},

 {id:"3",owner:"Basil · Daisy",title:"Brand + design",blurb:"Brand deck and Figma templates, desktop and mobile.",time:"1-2 wks",
  note:"Mobile first. Contractors' customers call from a phone on the side of the road.",
  sections:[
   {id:"3A",title:"Brand",items:[
     {t:"Brand deck page on GitHub - copy sunwest-painting/brand-deck.html",o:CB,l:[L.deck],h:"logo, colors, gradient, type, buttons, photo direction, voice and tone, the funnel"},
   ]},
   {id:"3B",title:"Figma",items:[
     {t:"Templates, desktop AND mobile",o:B,h:"Home, Service, Industry, Project, Location, hub page, quote page, thank-you page, blog post, 404"},
     {t:"Trust above the fold: license number, years in business, insured, review stars, real crew photos",o:B,h:"stock photos are a last resort"},
     {t:"Sticky click-to-call in the mobile header",o:B},
     {t:"Separate homeowner quote form and commercial bid form - if they do both",o:B},
     {t:"Homepage sleek pass: ~7 sections, one full-width real photo hero, brand color on buttons + accents only, stats band with correct numbers, client/partner logos",o:D},
     {t:"Track gaps on the hub's Design Next tab",o:B},
     {t:"Daisy approves the design",o:D},
   ]},
 ]},

 {id:"4",owner:"Claude · Daisy",title:"Copy",blurb:"The master copy doc. Real facts only.",time:"2-4 hrs",
  note:"Write how the client's customer talks. Real facts only.",
  sections:[
   {id:"4A",title:"Master copy doc",items:[
     {t:"Master copy doc per client",o:CD,l:[L.copy]},
     {t:"Real facts only: license, years, cities, numbers - [CONFIRM: ...] where we don't know",o:CD},
     {t:"Short hyphens only, no long dashes",o:CB},
     {t:"No made-up testimonials, no private homeowner names",o:CB},
     {t:"One phone number everywhere: site, GBP, Yelp, Facebook",o:B},
     {t:"Client signs off the copy in writing",o:D},
   ]},
 ]},

 {id:"5",owner:"Basil · Claude · Daisy",title:"Build + launch",blurb:"Clone, build, launch, then check it again 3 days later.",time:"1-3 wks",
  note:"Everything technical lives in kaizen-build-base. Basil runs it or hands it to the developer; Daisy approves anything that goes live.",
  sections:[
   {id:"5W",title:"Traps - read first",donot:true,items:[
     {t:"Edited Elementor data outside the editor? Elementor > Tools > Clear Files & Data, purge SG cache, check the live page logged out"},
     {t:"WordPress turns \" - \" into a long dash in text, titles and menus - store standalone hyphens as &amp;#45; where it matters"},
     {t:"Confirm the SEO plugin actually installed (AIOSEO on our sites) before writing docs that name one"},
     {t:"Client GBP access can drop - check monthly; ask the client to re-add Kaizen as Manager"},
     {t:"Never install: WP Rocket, Yoast, Rank Math, Smush, MonsterInsights, Site Kit, AI Agent by SiteGround"},
   ]},
   {id:"5A",title:"Clone + reset",items:[
     {t:"Clone the Kaizen Base site",o:B,l:[L.base],when:["domain:staging"]},
     {t:"Run the clone-reset checklist",o:CB,l:[L.base],when:["domain:staging"],time:"30-45 min"},
     {t:"Named account per person, base admin deleted, no shared logins",o:B},
     {t:"Delete AI Agent by SiteGround; confirm Complianz is active",o:B},
     {t:"Staging password ON + Discourage search engines ON",o:B,when:["domain:staging"]},
   ]},
   {id:"5B",title:"Build the pages",items:[
     {t:"Hub pages with child URLs; header dropdowns with children underneath",o:B},
     {t:"Clone a page that already looks right; check cloned sections aren't hidden on any device",o:B,l:[L.sop]},
     {t:"Internal links on every page: up to the hub, across to 2-3 siblings, to a project, to the quote page",o:CB},
     {t:"Alt text + description + clean title on every image, at upload",o:B,h:"what's in it + service + city, under ~125 characters. Decorative images get empty alt."},
     {t:"Phone links are tel:+1XXXXXXXXXX",o:CB},
     {t:"AIOSEO title + meta description on every page",o:CB,when:["type:seo"]},
     {t:"LocalBusiness schema: name, phone, address, hours, service area",o:CB},
     {t:"Complianz wizard",o:B,time:"15 min"},
     {t:"GA4 + Search Console set up and shared with the team",o:D,time:"30 min"},
   ]},
   {id:"5C",title:"Pre-launch",items:[
     {t:"Pre-launch content + form audit: no lorem, no \"#\" links, no [CONFIRM], phones right",o:CB,l:[L.base],time:"15 min"},
     {t:"DNS zone built BEFORE nameservers change",o:D,when:["domain:staging"],time:"30 min"},
     {t:"Daisy approves in writing what goes live",o:D},
   ]},
   {id:"5D",title:"Launch day",items:[
     {t:"Change only the A + www records; check for an AAAA record pointing at the old host",o:D,when:["domain:staging"],h:"leave MX, SPF, DKIM, DMARC exactly as they are"},
     {t:"SSL for apex + www, then force HTTPS",o:D,when:["domain:staging"]},
     {t:"Remove the staging password",o:D,when:["domain:staging"]},
     {t:"<b>Turn OFF Discourage search engines</b>",o:D,h:"a site that launches noindexed ranks for nothing and nobody notices for weeks"},
     {t:"Check apex, www and both http versions from outside your browser",o:CB,h:"a phone on cellular or an external checker"},
     {t:"Submit /sitemap.xml in Search Console",o:D},
   ]},
   {id:"5E",title:"After launch",items:[
     {t:"Post-launch audit, 2-3 days later",o:CB,l:[L.base],time:"20 min"},
     {t:"Developer account downgraded; old staging domain removed from the Elementor licence",o:B,h:"25 Elementor seats - unreleased seats block new builds"},
     {t:"Hub statuses updated; Command Center card moved",o:B},
   ]},
 ]},

 {id:"6",owner:"Claude · Basil",title:"Forms + leads",blurb:"Real leads reach the client. Junk doesn't.",time:"1 hr",
  note:"So real leads reach the client and junk doesn't.",
  sections:[
   {id:"6A",title:"Routing + protection",items:[
     {t:"Leads go to the client; BCC Kaizen for 30 days, then remove",o:B,l:[L.leads]},
     {t:"Reply-To = the visitor; a real subject line",o:B,h:"\"New quote request - [Client] website\", never \"New message from WordPress\""},
     {t:"From an address on the client's domain, via FluentSMTP",o:B},
     {t:"One SPF record (merge includes), DKIM on, DMARC at least p=none",o:D},
     {t:"Honeypot + Cloudflare Turnstile on every form",o:B},
     {t:"Only name, phone and email required",o:B},
     {t:"/thank-you/ page (noindex) with the GA4 conversion",o:CB},
     {t:"One real test per form from a phone - checked in the client's inbox AND spam",o:B},
   ]},
 ]},

 {id:"7",owner:"Basil · Claude · Daisy",title:"Monthly cycle",blurb:"Posts, reviews, blogs, email and the monthly report.",time:"monthly",
  note:"This is the work that keeps clients. Plan from the hub's Content Calendar.",
  sections:[
   {id:"7A",title:"Every week",items:[
     {t:"Google Business Profile post with real photos",o:CB,l:[L.prompts],h:"GBP rules: no phone number in the post text · real photos, no text overlays · no third-party bulk schedulers · link only to the client's domain · offers need start + end dates"},
     {t:"Reply to every new review",o:CB,l:[L.prompts]},
     {t:"1 blog post",o:CB,when:["type:seo"],h:"answers one question buyers ask; links to 1 service, 1 project and the quote page"},
   ]},
   {id:"7B",title:"Every month",items:[
     {t:"1-hour content session with the client",o:D},
     {t:"1 email to their list",o:CD},
     {t:"3-6 new pages from the hub, money pages first",o:B,when:["type:seo"],l:[L.sop]},
     {t:"Check GBP access is still there",o:B},
     {t:"Report + gameplan page on GitHub, first business day",o:CB,l:[L.update,L.report]},
     {t:"Send the report email",o:D},
   ]},
   {id:"7C",title:"Seasonal",items:[
     {t:"In Q4, plan Q1 (slow season): email past customers, review push, door hangers",o:D},
     {t:"Quarterly: NAP/citation cleanup, review push, competitor sitemap check",o:CB,when:["type:seo"]},
   ]},
 ]},

 {id:"8",owner:"Reference",title:"Where things live",blurb:"Drive, Figma, this repo, the workspace and Claude.",ref:true,html:`
  <div class="panel"><h3>The places</h3><ul>
   <li><b>Client Drive folder</b> - hub sheet, copy doc, photos, print files. One folder per client.</li>
   <li><b>Basil's "Projects" design drive</b> - design source files.</li>
   <li><b>Figma</b> - one file per client.</li>
   <li><b>This GitHub repo</b> - this checklist, the <a href="hub/">Basil hub</a>, brand decks, gameplans and monthly reports.</li>
   <li><b>Workspace</b> - <a href="https://workspace.kaizenagency.org/">workspace.kaizenagency.org</a>: tasks, discussions, Command Center.</li>
   <li><b>Claude Project per client</b> - the brief, transcripts and hub link so Claude has context.</li>
  </ul></div>
  <div class="panel"><h3>Playbooks (the skills, readable by anyone on the team)</h3><ul>
   <li><a href="hub/playbooks/kaizen-site-audit.html">Site audit</a> · <a href="hub/playbooks/kaizen-sitemap-builder.html">Sitemap + hub</a> · <a href="hub/playbooks/kaizen-copy-doc.html">Copy doc</a> · <a href="hub/playbooks/kaizen-build-base.html">Build base</a> · <a href="hub/playbooks/kaizen-lead-routing.html">Lead routing</a> · <a href="hub/playbooks/kaizen-client-update.html">Client update</a></li>
   <li><a href="hub/prompts.html">Prompt library</a> - copy a prompt into Claude for any step marked Claude.</li>
  </ul></div>`},
];

