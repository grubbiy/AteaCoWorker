export const STORAGE_KEY = 'coworker-concept-v1';
export const SOURCES = [
  {id:'brief',title:'Workshop brief.docx',kind:'W',size:84,version:'1.0',required:true,location:'Northstar / Workshop / Approved',reason:'Defines the audience, objective, and workshop date.',locator:'Objectives · paragraph 2',text:'Northstar is a fictional customer used only for this demonstration. The workshop is scheduled for 14 October 2026. The audience is the IT operations team. The objective is to agree on a practical device onboarding process and assign an owner to every handover step.'},
  {id:'runbook',title:'Device onboarding runbook.pdf',kind:'PDF',size:216,version:'2.1',required:true,location:'Northstar / Workshop / Approved',reason:'Provides the workflow and its operational checks.',locator:'Page 3 · Handover checklist',text:'The proposed handover has three checks: confirm device enrolment, validate the required applications, and record the support owner. The support owner must accept the handover before the device is marked ready. This fixture makes no statement about a real customer environment.'},
  {id:'notes',title:'Discovery notes.md',kind:'MD',size:12,version:'1.0',required:false,location:'Local files / Northstar',reason:'Captures open questions and the requested workshop outcomes.',locator:'Lines 4–7 · Open questions',text:'The workshop should produce an agreed onboarding checklist and named owners. Ask the team who signs off each stage. The budget has not been provided. The customer pricing appendix is referenced but is missing from the approved source pack.'},
  {id:'deck',title:'Workshop structure.pptx',kind:'P',size:640,version:'1.2',required:false,location:'Northstar / Workshop / Approved',reason:'Offers an outline for a five-slide workshop presentation.',locator:'Slide 2 · Agenda',text:'Suggested agenda: objective, current challenges, proposed onboarding workflow, ownership, and next steps. This is a synthetic structure template. Timings and commercial figures are deliberately not specified.'}
];
export const PROFILES = {
  light:{name:'Light',symbol:'◔',description:'For modest hardware. Shorter context, smaller local model.',context:2048,threads:2,caption:'Efficiency first'},
  balanced:{name:'Balanced',symbol:'◑',description:'For everyday project work. Balance resources and context.',context:4096,threads:4,caption:'Everyday starting point'},
  performance:{name:'Performance',symbol:'●',description:'For capable hardware. More context and richer drafts.',context:8192,threads:8,caption:'More room to work'}
};
export function initialState(){return {version:1,tab:'overview',selected:SOURCES.map(s=>s.id),prepared:false,offline:false,preparedAt:null,refreshed:false,profile:'balanced',context:4096,threads:4,battery:true,note:'Workshop ideas\n\nAsk the team who signs off each onboarding stage.\nKeep the handover checklist simple enough to use every day.',doc:null,slides:null,slide:0,question:'',answer:null,codeApplied:false,network:false,audit:[]};}
export function restoreState(raw){
  const fresh=initialState();
  try{
    const s=JSON.parse(raw);
    if(!s||s.version!==1)return fresh;
    const tabs=['overview','sources','assistant','notes','document','slides','code','settings'];
    if(tabs.includes(s.tab))fresh.tab=s.tab;
    if(Array.isArray(s.selected))fresh.selected=SOURCES.filter(x=>x.required||s.selected.includes(x.id)).map(x=>x.id);
    for(const key of ['prepared','refreshed','offline','battery','codeApplied'])if(typeof s[key]==='boolean')fresh[key]=s[key];
    if(!fresh.prepared)fresh.offline=false;
    if(typeof s.preparedAt==='string'&&!isNaN(Date.parse(s.preparedAt)))fresh.preparedAt=s.preparedAt;
    if(s.profile in PROFILES)fresh.profile=s.profile;
    if([2048,4096,8192].includes(s.context))fresh.context=s.context;
    if(Number.isInteger(s.threads)&&s.threads>=1&&s.threads<=12)fresh.threads=s.threads;
    if(typeof s.note==='string')fresh.note=s.note.slice(0,20000);
    if(s.doc&&typeof s.doc.title==='string'&&typeof s.doc.body==='string')fresh.doc={title:s.doc.title.slice(0,120),body:s.doc.body.slice(0,20000),revision:Number.isInteger(s.doc.revision)&&s.doc.revision>0?s.doc.revision:1,refreshed:s.doc.refreshed===true};
    if(Array.isArray(s.slides)&&s.slides.length===5&&s.slides.every(x=>typeof x.title==='string'&&typeof x.body==='string'))fresh.slides=s.slides.map(x=>({title:x.title.slice(0,90),body:x.body.slice(0,280)}));
    if(Number.isInteger(s.slide)&&s.slide>=0&&s.slide<5)fresh.slide=s.slide;
    // Never restore a one-time network grant. Scripted answers are recomputed on request.
    return fresh;
  }catch{return fresh;}
}
export function sourceVersion(id,refreshed=false){const src=SOURCES.find(s=>s.id===id);if(!src)return null;if(id==='brief'&&refreshed)return {...src,version:'1.1',text:src.text.replace('14 October','21 October')};return {...src};}
export function packSize(selected){return SOURCES.filter(x=>selected.includes(x.id)).reduce((sum,x)=>sum+x.size,0);}
export function savings(seats,percentage,monthly,support){const clean=(v,max)=>Math.min(max,Math.max(0,Number(v)||0));const count=Math.floor(clean(seats,1000)*clean(percentage,100)/100);const cost=clean(monthly,100000);const annual=clean(support,100000000);return {count,monthly:cost,support:annual,gross:count*cost*12,net:count*cost*12-annual};}
export function answerFor(question,state){
  if(!state.prepared)return {kind:'missing',text:'Prepare the sample project pack before asking a question.',citations:[]};
  const q=question.toLowerCase();
  const date=state.refreshed?'21 October 2026':'14 October 2026';
  if(/budget|price|cost|pris|budsjett|profit|margin/.test(q))return {kind:'gap',text:'The approved sample pack does not contain the workshop budget or a pricing appendix. I cannot give a supported amount. Add an approved commercial source when you are online.',citations:state.selected.includes('notes')?['notes']:[]};
  if(/date|when|dato|når/.test(q))return {kind:'answer',text:`The captured workshop brief schedules the workshop for ${date}. This is a fictional scenario date from the sample source, not a live calendar entry.`,citations:['brief']};
  if(/owner|handover|check|onboard|eier|sjekk/.test(q))return {kind:'answer',text:'The runbook lists three handover checks: confirm device enrolment, validate required applications, and record the support owner. The support owner must accept the handover before the device is marked ready.',citations:['runbook']};
  if(/prepare|workshop|goal|objective|summary|summar|plan|mål|oppsummer/.test(q))return {kind:'answer',text:`Prepare an onboarding workshop for Northstar’s IT operations team on ${date}. The documented objective is to agree on a practical device onboarding process and assign an owner to every handover step. Bring the three runbook checks: enrolment, required applications, and support ownership.`,citations:['brief','runbook']};
  return {kind:'unsupported',text:'This small demo has scripted responses for workshop preparation, handover checks, the workshop date, and the missing budget. Try one of those questions. A real local model is not running here.',citations:[]};
}
export function createDocument(state){return {title:'Northstar workshop plan',body:`Purpose\nAgree on a practical device onboarding process and assign an owner to every handover step.\n\nAudience & date\nIT operations team · ${state.refreshed?'21':'14'} October 2026.\n\nHandover checklist\n• Confirm device enrolment.\n• Validate required applications.\n• Record the support owner and obtain their acceptance.\n\nSuggested next step\nReview the checklist with the team and record owners. This is a recommendation, not a source fact.\n\nEvidence gap\nNo budget or pricing appendix is included. Do not insert a commercial estimate.\n\nSources\nWorkshop brief.docx v${state.refreshed?'1.1':'1.0'} — Objectives, paragraph 2.\nDevice onboarding runbook.pdf v2.1 — page 3, Handover checklist.\n\nSynthetic fixture · scripted draft · not AI-generated`,revision:1,refreshed:state.refreshed};}
export function createSlides(state){return [
  {title:'Make the handover work.',body:`Northstar · Device onboarding workshop\nIT operations team · ${state.refreshed?'21':'14'} October 2026`},
  {title:'One clear objective.',body:'Agree on a practical onboarding process.\nAssign an owner to every handover step.'},
  {title:'Three checks. No loose ends.',body:'01  Confirm device enrolment\n02  Validate required applications\n03  Record the support owner'},
  {title:'Ownership makes it complete.',body:'The support owner accepts the handover\nbefore the device is marked ready.'},
  {title:'Leave with a next step.',body:'Suggested: review the checklist and record owners.\nSources: brief v'+(state.refreshed?'1.1':'1.0')+'; runbook v2.1.\nBudget missing. Synthetic, scripted storyboard.'}
];}
