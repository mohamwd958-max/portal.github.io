(function(){
  var SB="https://vkfexceitwjmxncwceqb.supabase.co";
  var KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZmV4Y2VpdHdqbXhuY3djZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzY5MTEsImV4cCI6MjEwNTkxMjkxMX0.6ArXtykrZhdNInphpg_LQTIvULkpwnnlzHA3dKhrNoI";
  var SESSKEY="thabit_admin_session";
  var $=function(i){return document.getElementById(i)};
  function H(x){var h={apikey:KEY,Authorization:"Bearer "+KEY};for(var k in x)h[k]=x[k];return h}
  var defs={},order=[],over={},hooks=[];
  try{over=JSON.parse(localStorage.getItem("thabit_cms")||"{}")||{}}catch(e){over={}}
  function lang(){try{return localStorage.getItem("thabit_lang")||"en"}catch(e){return"en"}}
  function cache(){try{localStorage.setItem("thabit_cms",JSON.stringify(over))}catch(e){}}
  function R(key,label,type,page,def,hint){defs[key]={label:label,type:type,page:page,def:def,hint:hint||""};order.push(key)}
  function defOf(k){var d=defs[k];if(!d)return"";var v=d.def;if(typeof v==="function")v=v(lang());else if(v&&typeof v==="object")v=v[lang()]||v.en;return v==null?"":v}
  function hasOv(k){return over[k]!==undefined&&over[k]!==""}
  function get(k){return hasOv(k)?over[k]:defOf(k)}
  function sub(s){return String(s).replace(/\{fee\}/g,get("pl.lateFee")).replace(/\{price\}/g,get("pl.price"))}
  function apply(){
    document.querySelectorAll("[data-cms]").forEach(function(el){
      var k=el.getAttribute("data-cms"),d=defs[k];if(!d)return;
      if(el.hasAttribute("data-cms-ov")&&!hasOv(k))return;
      var v=get(k);
      if(d.type==="image"){if(v){el.src=v;el.style.display=""}else{el.removeAttribute("src");el.style.display="none"}}
      else if(d.type==="list"){el.innerHTML="";String(v).split("\n").forEach(function(s){if(!s.trim())return;var li=document.createElement("li");li.textContent=sub(s.trim());el.appendChild(li)})}
      else el.textContent=sub(v);
    });
    hooks.forEach(function(f){try{f()}catch(e){}});
  }
  function sess(){try{return JSON.parse(sessionStorage.getItem(SESSKEY)||"null")}catch(e){return null}}
  function setSess(x){try{if(x)sessionStorage.setItem(SESSKEY,JSON.stringify(x));else sessionStorage.removeItem(SESSKEY)}catch(e){}}
  function keep(j){setSess({access:j.access_token,refresh:j.refresh_token,exp:Date.now()+(j.expires_in||3600)*1000})}
  function ensure(){
    var x=sess();if(!x)return Promise.resolve(null);
    if(x.exp>Date.now()+30000)return Promise.resolve(x.access);
    return fetch(SB+"/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:{apikey:KEY,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:x.refresh})}).then(function(r){return r.ok?r.json():null}).then(function(j){if(!j||!j.access_token){setSess(null);return null}keep(j);return j.access_token}).catch(function(){return null});
  }
  function adminFetch(url,o){return ensure().then(function(t){if(!t)throw new Error("auth");o=o||{};o.headers=Object.assign({apikey:KEY,Authorization:"Bearer "+t},o.headers||{});return fetch(url,o)})}
  function login(email,pass){
    return fetch(SB+"/auth/v1/token?grant_type=password",{method:"POST",headers:{apikey:KEY,"Content-Type":"application/json"},body:JSON.stringify({email:email,password:pass})}).then(function(r){return r.json().then(function(j){return{ok:r.ok,j:j}})}).then(function(o){if(!o.ok||!o.j.access_token)throw new Error("bad");keep(o.j)});
  }
  function load(){
    return fetch(SB+"/rest/v1/site_content?select=key,value",{headers:H()}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(rows){var m={};rows.forEach(function(r){m[r.key]=r.value});over=m;cache();apply()}).catch(function(){})
  }
  function save(k,v){
    over[k]=v;cache();apply();
    return adminFetch(SB+"/rest/v1/site_content?on_conflict=key",{method:"POST",headers:{"Content-Type":"application/json",Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify({key:k,value:v,updated_at:new Date().toISOString()})}).then(function(r){return r.ok}).catch(function(){return false});
  }
  function reset(k){
    delete over[k];cache();apply();
    return adminFetch(SB+"/rest/v1/site_content?key=eq."+encodeURIComponent(k),{method:"DELETE"}).then(function(r){return r.ok}).catch(function(){return false});
  }
  function upload(file,folder,bucket,asAdmin){
    bucket=bucket||"placement-files";
    var name=folder+"/"+Date.now()+"_"+Math.random().toString(36).slice(2,10)+"_"+file.name.replace(/[^\w.\-]+/g,"_");
    var o={method:"POST",headers:{"Content-Type":file.type||"application/octet-stream"},body:file},url=SB+"/storage/v1/object/"+bucket+"/"+name;
    var p=asAdmin?adminFetch(url,o):fetch(url,{method:"POST",headers:H(o.headers),body:file});
    return p.then(function(r){if(!r.ok)throw new Error("upload");return SB+"/storage/v1/object/public/"+bucket+"/"+name});
  }
  function post(table,obj){
    return fetch(SB+"/rest/v1/"+table,{method:"POST",headers:H({"Content-Type":"application/json",Prefer:"return=minimal"}),body:JSON.stringify(obj)}).then(function(r){return r.ok}).catch(function(){return false});
  }

  R("portal.servicesDesc","Booking card text","textarea","Portal",{en:"Pick your time slot, upload the required files, and confirm your payment with ease.",ar:"قم باختيار ميعادك، ورفع الملفات المطلوبة، وإثبات الدفع بكل سهولة ويسر.",eg:"اختار ميعادك، وارفع الملفات المطلوبة، وأثبت الدفع بكل سهولة."});
  R("portal.aboutDesc","About Us text","textarea","Portal",{en:"THABIT is a state-of-the-art educational ecosystem built to bridge the gap between mentors and trainees.",ar:"ثابت منظومة تعليمية متطورة صُممت لسد الفجوة بين المدربين والمتدربين.",eg:"ثابت منظومة تعليمية متطورة اتعملت عشان تقرّب بين المدرب والمتدرب."});
  R("dash.subtitle","Dashboard subtitle","text","Dashboard",{en:"Your personal trainee dashboard in the Thabit system",ar:"لوحة قيادة المتدرب الخاصة بك في نظام Thabit",eg:"لوحة التحكم بتاعتك كمتدرب في نظام Thabit"});
  R("assist.headerSub","Assistant header subtitle","text","Assistant",{en:"pronounce on the go",ar:"انطق وأنت في طريقك",eg:"انطق وانت ماشي"});

  R("pl.price","Placement session price","text","Placement",{en:"XXX EGP",ar:"XXX جنيه",eg:"XXX جنيه"},"Shown in the payment step and the receipt");
  R("pl.lateFee","Late fee per minute (number)","text","Placement","25","Used in the rules as {fee}");
  R("pl.slots","Daily time slots","textarea","Placement","10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00, 19:00, 20:00, 21:00","24h format HH:MM, separated by commas or new lines");
  R("pl.blocked","Unavailable dates","textarea","Placement","","YYYY-MM-DD separated by commas/new lines. Thursday & Friday are always closed automatically.");
  R("pl.booked","Booked slots","textarea","Placement","","One per line: YYYY-MM-DD HH:MM (e.g. 2026-10-14 16:00)");
  R("pl.englishHint","English test: hint","text","Placement",{en:"Upload a PDF / screenshot of your external English test result, or paste its link.",ar:"ارفع ملف PDF أو لقطة شاشة لنتيجة اختبار الإنجليزي الخارجي، أو ضع رابطه.",eg:"ارفع PDF أو سكرين شوت لنتيجة اختبار الإنجليزي الخارجي، أو حط اللينك بتاعه."});
  R("pl.psychHint","Psychological test: hint","text","Placement",{en:"Upload an image / PDF of your psychological test result, or paste its link.",ar:"ارفع صورة أو ملف PDF لنتيجة الاختبار السيكولوجي، أو ضع رابطه.",eg:"ارفع صورة أو PDF لنتيجة الاختبار السيكولوجي، أو حط اللينك بتاعه."});
  R("pl.secretHint","Secret file: hint","text","Placement",{en:"Got something special to share? Drop it here. Totally optional.",ar:"عندك شيء مميز تريد مشاركته؟ ضعه هنا. اختياري تمامًا.",eg:"عندك حاجة مميزة؟ حطها هنا. اختياري خالص."});
  R("pl.payNote","Payment note","text","Placement",{en:"Pay with one of the methods below, then come back and add your proof.",ar:"ادفع بإحدى الطرق التالية ثم عد وأضف إثبات الدفع.",eg:"ادفع بأي طريقة من دول وبعدين ارجع وحط إثبات الدفع."});
  R("pl.instapayLink","InstaPay link","text","Placement","https://ipn.eg/S/thabit");
  R("pl.vodafone","Vodafone Cash number","text","Placement","01000000000");
  R("pl.qr","Payment QR / image (optional)","image","Placement","");
  R("pl.rules","Placement session instructions","list","Placement",{
    en:"Be on time: if you are more than 20 minutes late after the agreed time, your payment is non-refundable.\nIf you are late by less than 20 minutes, a late fee of {fee} EGP per minute applies.\nBring a pen and paper to take notes — this is very important.\nMake sure your internet connection is stable.\nUse good headphones — or at least make sure the audio is crystal clear: no crackling, no background noise, no side conversations.",
    ar:"الالتزام بالموعد: إذا تأخرت أكثر من 20 دقيقة عن الموعد المتفق عليه فلن يتم استرداد المبلغ المدفوع.\nإذا كان التأخير أقل من 20 دقيقة تُحتسب غرامة {fee} جنيهًا عن كل دقيقة تأخير.\nأحضر ورقة وقلمًا لتدوين الملاحظات، وهذا مهم جدًا.\nتأكد من ثبات اتصال الإنترنت.\nاستخدم سماعة جيدة، أو على الأقل تأكد من وضوح الصوت تمامًا: بدون تقطيع أو ضوضاء أو أحاديث جانبية.",
    eg:"الالتزام بالميعاد: لو اتأخرت أكتر من 20 دقيقة عن الميعاد المتفق عليه فلوسك مش هتترجع.\nلو التأخير أقل من 20 دقيقة بتتحسب غرامة {fee} جنيه على كل دقيقة.\nهات ورقة وقلم تدوّن عليهم ملاحظات، ودي مهمة جدًا.\nتأكد إن النت ثابت.\nاستخدم سماعة كويسة، أو على الأقل الصوت يكون واضح: من غير خرفشة ولا دوشة ولا كلام جانبي."
  },"One rule per line");
  R("pl.termsTitle","Terms heading","text","Placement",{en:"Thabit's strict terms are as follows:",ar:"بنود ثابت الصارمة كالتالي:",eg:"بنود ثابت الصارمة هي كالتالي:"});
  R("pl.terms","Terms & policies","list","Placement",{
    en:"Term number one — edit me from the admin panel\nTerm number two — edit me from the admin panel\nTerm number three — edit me from the admin panel",
    ar:"البند الأول — عدّلني من لوحة الأدمن\nالبند الثاني — عدّلني من لوحة الأدمن\nالبند الثالث — عدّلني من لوحة الأدمن",
    eg:"البند الأول — عدّلني من لوحة الأدمن\nالبند الثاني — عدّلني من لوحة الأدمن\nالبند الثالث — عدّلني من لوحة الأدمن"
  },"One term per line (numbered automatically)");
  R("pl.wa","WhatsApp number (digits, with country code)","text","Placement","201000000000");
  R("pl.tg","Telegram username (without @)","text","Placement","thabit");

  var curPage="";
  var p=location.pathname.toLowerCase();
  if(p.indexOf("placement")>-1)curPage="Placement";else if(p.indexOf("assistant")>-1)curPage="Assistant";else if(p.indexOf("dashboard")>-1)curPage="Dashboard";else curPage="Portal";
  function msg(t,bad){var m=$("thaMsg");m.textContent=t;m.style.color=bad?"#f43f5e":"#10b981";clearTimeout(msg._t);msg._t=setTimeout(function(){m.textContent=""},4500)}
  function renderPages(){
    var pages=["All"];order.forEach(function(k){if(pages.indexOf(defs[k].page)<0)pages.push(defs[k].page)});
    var box=$("thaPages");box.innerHTML="";
    pages.forEach(function(pg){var b=document.createElement("button");b.type="button";b.className="tha-tab"+((curPage===pg||(!curPage&&pg==="All"))?" on":"");b.textContent=pg;b.onclick=function(){curPage=pg==="All"?"":pg;renderPages();renderList()};box.appendChild(b)});
  }
  function renderList(){
    var q=($("thaSearch").value||"").toLowerCase(),box=$("thaList");box.innerHTML="";
    order.forEach(function(k){
      var d=defs[k];if(curPage&&d.page!==curPage)return;
      if(q&&(k+" "+d.label).toLowerCase().indexOf(q)<0)return;
      var row=document.createElement("div");row.className="tha-row";
      var lab=document.createElement("div");lab.className="tha-lab";
      var s1=document.createElement("span");s1.textContent=d.label;var s2=document.createElement("span");s2.className="tha-tag";s2.textContent=d.page;
      lab.appendChild(s1);lab.appendChild(s2);row.appendChild(lab);
      var val=hasOv(k)?over[k]:defOf(k);
      var inp=document.createElement(d.type==="text"||d.type==="image"?"input":"textarea");inp.className="tha-in";inp.value=val;
      if(d.type==="image")inp.placeholder="https://... image URL";
      row.appendChild(inp);
      if(d.hint){var h=document.createElement("div");h.className="tha-note";h.textContent=d.hint;row.appendChild(h)}
      var img=null;
      if(d.type==="image"){img=document.createElement("img");img.className="tha-img";if(val)img.src=val;else img.style.display="none";row.appendChild(img);inp.oninput=function(){if(inp.value){img.src=inp.value;img.style.display=""}else img.style.display="none"}}
      var bt=document.createElement("div");bt.className="tha-btns";
      if(d.type==="image"){
        var fi=document.createElement("input");fi.type="file";fi.accept="image/*";fi.style.display="none";
        var ub=document.createElement("button");ub.type="button";ub.className="tha-b blue";ub.innerHTML='<i class="fa-solid fa-upload"></i> Upload image';
        ub.onclick=function(){fi.click()};
        fi.onchange=function(){if(!fi.files[0])return;ub.disabled=true;upload(fi.files[0],"site",null,true).then(function(u){inp.value=u;img.src=u;img.style.display="";msg("Uploaded ✓ — press Save")}).catch(function(){msg("Upload failed (create the placement-files bucket)",1)}).then(function(){ub.disabled=false})};
        bt.appendChild(ub);bt.appendChild(fi);
      }
      var sb=document.createElement("button");sb.type="button";sb.className="tha-b";sb.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Save';
      sb.onclick=function(){sb.disabled=true;save(k,inp.value).then(function(ok){msg(ok?"Saved ✓":"Saved on this device only — create the site_content table (see SQL)",!ok)}).then(function(){sb.disabled=false})};
      var rb=document.createElement("button");rb.type="button";rb.className="tha-b gray";rb.innerHTML='<i class="fa-solid fa-rotate-left"></i> Reset';
      rb.onclick=function(){reset(k).then(function(){inp.value=defOf(k);if(img){if(inp.value){img.src=inp.value}else img.style.display="none"}msg("Back to default ✓")})};
      bt.appendChild(sb);bt.appendChild(rb);row.appendChild(bt);box.appendChild(row);
    });
    if(!box.children.length){box.innerHTML='<p class="tha-note" style="margin-top:12px">Nothing here.</p>'}
  }
  var pending=null;
  function showPanel(){$("thaPanel").classList.add("open");renderPages();renderList()}
  function open(cb){
    pending=typeof cb==="function"?cb:showPanel;
    ensure().then(function(t){if(t){var f=pending;pending=null;f()}else{$("thaAuthErr").textContent="";$("thaAuth").classList.add("open");setTimeout(function(){$("thaEmail").focus()},50)}});
  }
  function auth(){
    var b=$("thaAuthOk");b.disabled=true;
    login($("thaEmail").value.trim(),$("thaPass").value).then(function(){$("thaPass").value="";$("thaAuth").classList.remove("open");var f=pending||showPanel;pending=null;f()}).catch(function(){$("thaAuthErr").textContent="الإيميل أو الباسورد غلط · Wrong email or password"}).then(function(){b.disabled=false});
  }
  $("thaAuthOk").onclick=auth;$("thaPass").onkeydown=function(e){if(e.key==="Enter")auth()};
  $("thaAuthCancel").onclick=function(){pending=null;$("thaAuth").classList.remove("open")};
  $("thaOut").onclick=function(){setSess(null);$("thaPanel").classList.remove("open");msg("")};
  $("thaClose").onclick=function(){$("thaPanel").classList.remove("open")};
  $("thaSearch").oninput=renderList;
  function tab(n){["C","A","B"].forEach(function(x){$("thaPane"+x).style.display=x===n?"":"none";$("thaTab"+x).classList.toggle("on",x===n)});if(n==="B")loadBookings()}
  $("thaTabC").onclick=function(){tab("C")};$("thaTabA").onclick=function(){tab("A")};$("thaTabB").onclick=function(){tab("B")};
  function loadBookings(){
    var box=$("thaBook");box.textContent="...";
    adminFetch(SB+"/rest/v1/placement_bookings?select=*&order=created_at.desc&limit=50").then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(rows){
      box.innerHTML="";if(!rows.length){box.textContent="No bookings yet.";return}
      rows.forEach(function(b){
        var d=document.createElement("div");d.className="tha-row";
        var l=document.createElement("div");l.className="tha-lab";var a=document.createElement("span");a.textContent=b.name+" · "+b.date+" "+b.time;var g=document.createElement("span");g.className="tha-tag";g.textContent=b.pay_method;l.appendChild(a);l.appendChild(g);d.appendChild(l);
        [["English",b.english],["Psych",b.psych],["Secret",b.secret],["Proof",b.proof]].forEach(function(x){if(!x[1])return;var an=document.createElement("a");an.href=x[1];an.target="_blank";an.rel="noopener";an.textContent=x[0]+" ↗";an.style.cssText="color:#60a5fa;font-weight:800;font-size:.8rem";d.appendChild(an)});
        box.appendChild(d);
      });
    }).catch(function(){box.textContent="Could not load bookings (sign in again / check the table policies)."});
  }

  var rec=null,chunks=[],blob=null,on=false,tmr=null,sec=0;
  $("thaRec").onclick=function(){
    var btn=$("thaRec");
    if(!on){
      navigator.mediaDevices.getUserMedia({audio:true}).then(function(st){
        rec=new MediaRecorder(st);chunks=[];
        rec.ondataavailable=function(e){if(e.data.size>0)chunks.push(e.data)};
        rec.onstop=function(){st.getTracks().forEach(function(t){t.stop()});blob=new Blob(chunks,{type:"audio/mp3"});var a=$("thaPlay");a.src=URL.createObjectURL(blob);a.style.display="";$("thaUp").disabled=false};
        rec.start();on=true;btn.innerHTML='<i class="fa-solid fa-stop"></i> Stop';sec=0;
        tmr=setInterval(function(){sec++;$("thaTimer").textContent="00:"+(sec<10?"0":"")+sec},1000);
      }).catch(function(){msg("Microphone not allowed",1)});
    }else{rec.stop();on=false;clearInterval(tmr);btn.innerHTML='<i class="fa-solid fa-microphone"></i> Record'}
  };
  $("thaUp").onclick=function(){
    var w=$("thaWord").value.trim();if(!w||!blob){msg("Type a word and record first",1);return}
    var b=this;b.disabled=true;var fn=w.replace(/\s+/g,"_")+"_"+Date.now()+".mp3";
    adminFetch(SB+"/storage/v1/object/audio-files/"+fn,{method:"POST",headers:{"Content-Type":"audio/mp3"},body:blob}).then(function(r){if(!r.ok)throw 0;
      return adminFetch(SB+"/rest/v1/words_table",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({word:w,audio_url:SB+"/storage/v1/object/public/audio-files/"+fn})})}).then(function(r){if(!r.ok)throw 0;msg("Saved ✓");$("thaWord").value="";$("thaPlay").style.display="none";blob=null}).catch(function(){msg("Upload failed",1);b.disabled=false});
  };
  document.addEventListener("keydown",function(e){if(e.key==="Escape"){$("thaPanel").classList.remove("open");$("thaAuth").classList.remove("open")}});

  function mount(){
    var bar=$("mobileFloatingBar");if(!bar||$("floatBtnAdmin"))return;
    var d=document.createElement("div");d.className="bar-divider";
    var b=document.createElement("button");b.type="button";b.id="floatBtnAdmin";b.title="Fedawy Admin Panel";b.className="circle-badge-btn admin-btn";b.innerHTML='<i class="fa-solid fa-plus"></i>';b.onclick=open;
    bar.appendChild(d);bar.appendChild(b);
  }
  mount();
  var o=window.setLanguage;
  if(typeof o==="function"&&!o._tha){var w=function(){var r=o.apply(this,arguments);apply();return r};w._tha=1;window.setLanguage=w}

  window.ThabitCMS={get:get,apply:apply,load:load,save:save,upload:upload,post:post,onApply:function(f){hooks.push(f)},sub:sub};
  window.ThabitAdmin={open:open,hdr:hdr};
  apply();load();
})();

(function(){
var CMS=window.ThabitCMS;
var $=function(i){return document.getElementById(i)};
var PAGE_I18N={
en:{pageTitle:"Placement",pageSub:"Book your level-assessment session in four quick steps",s1:"Pick your time",s2:"Your files",s3:"Payment",s4:"Rules & policies",
yourName:"Your name",yourNamePh:"Enter your full name...",legAvail:"Available",legOff:"Closed",legToday:"Today",legPast:"Past",
morning:"Morning",afternoon:"Afternoon",evening:"Evening",booked:"Booked",passed:"Passed",free:"Free",noSlots:"No slots left on this day",
cont:"Continue",back:"Back",fEnglish:"External English Test",fPsych:"The Psychological Test",fSecret:"The Secret File",optional:"Optional",
upload:"Upload PDF / image",pasteLink:"Paste link here...",uploading:"Uploading...",uploaded:"Uploaded",upFail:"Upload failed — paste a link instead",linkSaved:"Link added",
needFile:"Provide at least the English test or the psychological test — one is enough.",
amount:"Amount",instapay:"InstaPay",vodafone:"Vodafone Cash",copy:"Copy",copied:"Copied!",paidVia:"Paid via",inPerson:"In person / cash",
proofTitle:"Payment proof",proofUpload:"Upload screenshot",proofLink:"Or paste a link to the proof...",needProof:"Add your payment proof (image or link), or choose In person.",
rulesTitle:"Placement session instructions",agreeRules:"I agree to all of the above",termsHeading:"Terms & policies",agreeTerms:"I accept the terms & policies",
details:"Booking details",rTitle:"Booking summary",rName:"Name",rDate:"Date",rTime:"Time",rEnglish:"English test",rPsych:"Psychological test",rSecret:"Secret file",rPay:"Payment",rAmount:"Amount",rAgree:"Rules & terms",agreed:"Agreed",none:"—",
sendTg:"Telegram",sendWa:"WhatsApp",copySummary:"Copy summary",edit:"Edit booking",tgCopied:"Summary copied — paste it in the Telegram chat",
done:"All set! 🎉",doneSub:"Your booking is ready — send the details to confirm.",needName:"Please enter your name first",home:"Home",themeTitle:"Light / Dark",
fileWord:"File",linkWord:"Link",locked:"Finish the previous steps first",hdr:"Thabit — Placement booking"},
ar:{pageTitle:"تحديد المستوى",pageSub:"احجز جلسة تحديد مستواك في أربع خطوات سريعة",s1:"اختر موعدك",s2:"ملفاتك",s3:"الدفع",s4:"التعليمات والسياسات",
yourName:"اسمك",yourNamePh:"اكتب اسمك الكامل...",legAvail:"متاح",legOff:"مغلق",legToday:"اليوم",legPast:"مضى",
morning:"الصباح",afternoon:"بعد الظهر",evening:"المساء",booked:"محجوز",passed:"انتهى",free:"متاح",noSlots:"لا توجد مواعيد متاحة في هذا اليوم",
cont:"متابعة",back:"رجوع",fEnglish:"اختبار الإنجليزية الخارجي",fPsych:"الاختبار السيكولوجي",fSecret:"الملف السري",optional:"اختياري",
upload:"رفع PDF / صورة",pasteLink:"ضع الرابط هنا...",uploading:"جارٍ الرفع...",uploaded:"تم الرفع",upFail:"فشل الرفع — ضع رابطًا بدلًا من ذلك",linkSaved:"تمت إضافة الرابط",
needFile:"قدّم على الأقل اختبار الإنجليزية أو الاختبار السيكولوجي — يكفي أحدهما.",
amount:"المبلغ",instapay:"إنستا باي",vodafone:"فودافون كاش",copy:"نسخ",copied:"تم النسخ!",paidVia:"طريقة الدفع",inPerson:"يدًا بيد / كاش",
proofTitle:"إثبات الدفع",proofUpload:"رفع لقطة شاشة",proofLink:"أو ضع رابط الإثبات...",needProof:"أضف إثبات الدفع (صورة أو رابط)، أو اختر يدًا بيد.",
rulesTitle:"تعليمات جلسة تحديد المستوى",agreeRules:"أوافق على كل ما سبق",termsHeading:"الشروط والسياسات",agreeTerms:"أوافق على الشروط والسياسات",
details:"تفاصيل الحجز",rTitle:"ملخص الحجز",rName:"الاسم",rDate:"اليوم",rTime:"الوقت",rEnglish:"اختبار الإنجليزية",rPsych:"الاختبار السيكولوجي",rSecret:"الملف السري",rPay:"الدفع",rAmount:"المبلغ",rAgree:"التعليمات والشروط",agreed:"تمت الموافقة",none:"—",
sendTg:"تيليجرام",sendWa:"واتساب",copySummary:"نسخ الملخص",edit:"تعديل الحجز",tgCopied:"تم نسخ الملخص — الصقه في محادثة تيليجرام",
done:"تم! 🎉",doneSub:"حجزك جاهز — أرسل التفاصيل للتأكيد.",needName:"من فضلك اكتب اسمك أولًا",home:"الرئيسية",themeTitle:"فاتح / داكن",
fileWord:"ملف",linkWord:"رابط",locked:"أكمل الخطوات السابقة أولًا",hdr:"ثابت — حجز تحديد المستوى"},
eg:{pageTitle:"تحديد المستوى",pageSub:"احجز جلسة تحديد مستواك في أربع خطوات سريعة",s1:"اختار ميعادك",s2:"ملفاتك",s3:"الدفع",s4:"التعليمات والسياسات",
yourName:"اسمك",yourNamePh:"اكتب اسمك بالكامل...",legAvail:"متاح",legOff:"مقفول",legToday:"النهارده",legPast:"فات",
morning:"الصبح",afternoon:"بعد الضهر",evening:"المسا",booked:"محجوز",passed:"فات",free:"متاح",noSlots:"مفيش مواعيد فاضية في اليوم ده",
cont:"كمّل",back:"رجوع",fEnglish:"اختبار الإنجليزي الخارجي",fPsych:"الاختبار السيكولوجي",fSecret:"الملف السري",optional:"اختياري",
upload:"ارفع PDF / صورة",pasteLink:"حط اللينك هنا...",uploading:"بيترفع...",uploaded:"اترفع",upFail:"الرفع فشل — حط لينك بدله",linkSaved:"اللينك اتضاف",
needFile:"لازم على الأقل اختبار الإنجليزي أو الاختبار السيكولوجي — واحد يكفي.",
amount:"المبلغ",instapay:"إنستا باي",vodafone:"فودافون كاش",copy:"انسخ",copied:"اتنسخ!",paidVia:"دفعت إزاي",inPerson:"بالإيد / كاش",
proofTitle:"إثبات الدفع",proofUpload:"ارفع سكرين شوت",proofLink:"أو حط لينك الإثبات...",needProof:"حط إثبات الدفع (صورة أو لينك)، أو اختار بالإيد.",
rulesTitle:"تعليمات جلسة تحديد المستوى",agreeRules:"موافق على كل اللي فوق",termsHeading:"الشروط والسياسات",agreeTerms:"موافق على الشروط والسياسات",
details:"تفاصيل الحجز",rTitle:"ملخص الحجز",rName:"الاسم",rDate:"اليوم",rTime:"الوقت",rEnglish:"اختبار الإنجليزي",rPsych:"الاختبار السيكولوجي",rSecret:"الملف السري",rPay:"الدفع",rAmount:"المبلغ",rAgree:"التعليمات والشروط",agreed:"وافقت",none:"—",
sendTg:"تيليجرام",sendWa:"واتساب",copySummary:"انسخ الملخص",edit:"عدّل الحجز",tgCopied:"الملخص اتنسخ — الصقه في شات تيليجرام",
done:"خلصنا! 🎉",doneSub:"حجزك جاهز — ابعت التفاصيل للتأكيد.",needName:"اكتب اسمك الأول",home:"الرئيسية",themeTitle:"فاتح / داكن",
fileWord:"ملف",linkWord:"لينك",locked:"خلّص الخطوات اللي قبلها الأول",hdr:"ثابت — حجز تحديد المستوى"}
};
var cur="en",light=false;
function sv(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function ld(k){try{return localStorage.getItem(k)}catch(e){return null}}
function t(k){return (PAGE_I18N[cur]&&PAGE_I18N[cur][k])||PAGE_I18N.en[k]||k}
var LOC={en:"en-US",ar:"ar-EG",eg:"ar-EG"};

window.toggleTheme=function(){light=!light;document.body.classList.toggle("light-theme",light);$("themeIcon").className=light?"fa-solid fa-sun":"fa-solid fa-moon";sv("thabit_theme",light?"light":"dark")};
window.setLanguage=function(lang){
  if(!PAGE_I18N[lang])lang="en";cur=lang;sv("thabit_lang",lang);
  var ids={ar:"floatBtnAr",en:"floatBtnEn",eg:"floatBtnEg"};
  Object.keys(ids).forEach(function(k){$(ids[k]).classList.toggle("active",k===lang)});
  var r=document.documentElement;r.setAttribute("dir",lang==="en"?"ltr":"rtl");r.setAttribute("lang",lang==="ar"?"ar":(lang==="eg"?"arz":"en"));
  var T=PAGE_I18N[lang];
  document.querySelectorAll("[data-i18n]").forEach(function(el){var v=T[el.dataset.i18n];if(v!==undefined)el.textContent=v});
  document.querySelectorAll("[data-i18n-ph]").forEach(function(el){var v=T[el.dataset.i18nPh];if(v!==undefined)el.placeholder=v});
  document.querySelectorAll("[data-i18n-title]").forEach(function(el){var v=T[el.dataset.i18nTitle];if(v!==undefined)el.title=v});
  CMS.apply();
};

var today=new Date();
var view={y:today.getFullYear(),m:today.getMonth()};
var S={name:"",date:null,time:null,files:{english:{},psych:{},secret:{},proof:{}},method:"instapay",rules:false,terms:false,step:1,complete:false,editing:false,saved:false};
function pad(n){return n<10?"0"+n:""+n}
function key(y,m,d){return y+"-"+pad(m+1)+"-"+pad(d)}
function num(n){return new Intl.NumberFormat(LOC[cur]).format(n)}
function validLink(s){return /^(https?:\/\/|www\.)\S+\.\S+/i.test((s||"").trim())}
function fileDone(id){var f=S.files[id];return !!(f&&(f.url||validLink(f.link)))}
function focusCenter(el){setTimeout(function(){el.scrollIntoView({behavior:"smooth",block:"center"})},80)}
var toastT;
function toast(m,bad){var e=$("toast");e.textContent=m;e.className="show"+(bad?" bad":"");clearTimeout(toastT);toastT=setTimeout(function(){e.className=""},2800)}

function parseList(s){return String(s||"").split(/[\s,;]+/).filter(Boolean)}
function blocked(){return new Set(parseList(CMS.get("pl.blocked")).filter(function(x){return /^\d{4}-\d{2}-\d{2}$/.test(x)}))}
function booked(){var set=new Set();String(CMS.get("pl.booked")||"").split("\n").forEach(function(l){var m=l.trim().match(/^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}):(\d{2})$/);if(m)set.add(m[1]+" "+pad(+m[2])+":"+m[3])});return set}
function slots(){var a=String(CMS.get("pl.slots")||"").split(/[,;\n]+/).map(function(x){return x.trim()}).filter(function(x){return /^\d{1,2}:\d{2}$/.test(x)}).map(function(x){var p=x.split(":");return pad(+p[0])+":"+p[1]});return a.sort()}
function fmtTime(tm){var p=tm.split(":");return new Date(2000,0,1,+p[0],+p[1]).toLocaleTimeString(LOC[cur],{hour:"numeric",minute:"2-digit"})}
function fmtDate(k,long){var p=k.split("-");return new Date(+p[0],+p[1]-1,+p[2]).toLocaleDateString(LOC[cur],long?{weekday:"long",day:"numeric",month:"long",year:"numeric"}:{weekday:"short",day:"numeric",month:"short"})}

function dayState(y,m,d,bl){
  var dt=new Date(y,m,d),t0=new Date(today.getFullYear(),today.getMonth(),today.getDate());
  var isT=dt.getTime()===t0.getTime();
  if(dt<t0)return{cls:"past",today:false};
  var dow=dt.getDay();
  if(dow===4||dow===5||bl.has(key(y,m,d)))return{cls:"off",today:isT};
  return{cls:"open",today:isT};
}
function renderCal(){
  var y=view.y,m=view.m,loc=LOC[cur],bl=blocked();
  $("calTitle").textContent=new Intl.DateTimeFormat(loc,{month:"long",year:"numeric"}).format(new Date(y,m,1));
  var h="";for(var i=0;i<7;i++)h+='<div class="cal-dow">'+new Intl.DateTimeFormat(loc,{weekday:"short"}).format(new Date(2026,9,10+i))+"</div>";
  var first=(new Date(y,m,1).getDay()+1)%7,n=new Date(y,m+1,0).getDate();
  for(i=0;i<first;i++)h+='<div class="day empty"></div>';
  for(var d=1;d<=n;d++){var st=dayState(y,m,d,bl),k=key(y,m,d);
    h+='<button type="button" class="day '+st.cls+(st.today?" is-today":"")+(S.date===k?" sel":"")+'" data-k="'+k+'"'+(st.cls==="open"?"":" disabled")+">"+num(d)+"</button>"}
  $("calGrid").innerHTML=h;
  var ahead=(y-today.getFullYear())*12+m-today.getMonth();
  $("prevM").disabled=ahead<=0;$("nextM").disabled=ahead>=3;
}
$("calGrid").addEventListener("click",function(e){var b=e.target.closest(".day.open");if(!b)return;S.date=b.dataset.k;S.time=null;renderCal();renderTimeline();update();setTimeout(function(){$("timeline").scrollIntoView({behavior:"smooth",block:"start"})},80)});
$("prevM").onclick=function(){view.m--;if(view.m<0){view.m=11;view.y--}renderCal()};
$("nextM").onclick=function(){view.m++;if(view.m>11){view.m=0;view.y++}renderCal()};

function renderTimeline(){
  var w=$("timeline");
  if(!S.date){w.classList.add("hidden");return}
  w.classList.remove("hidden");
  $("tlDate").textContent=fmtDate(S.date,true);
  var sl=slots(),bk=booked(),now=new Date(),isT=S.date===key(now.getFullYear(),now.getMonth(),now.getDate());
  var groups=[["morning",0,12],["afternoon",12,17],["evening",17,24]],html="",idx=0,any=false;
  groups.forEach(function(g){
    var items=sl.filter(function(x){var h=+x.split(":")[0];return h>=g[1]&&h<g[2]});if(!items.length)return;
    html+='<div class="tl-group"><i class="fa-solid fa-'+(g[0]==="morning"?"sun":g[0]==="afternoon"?"cloud-sun":"moon")+'"></i>'+t(g[0])+"</div>";
    items.forEach(function(x){
      var p=x.split(":"),isPast=isT&&(+p[0]*60+ +p[1])<=(now.getHours()*60+now.getMinutes());
      var isBk=bk.has(S.date+" "+x),off=isPast||isBk;if(!off)any=true;
      html+='<button type="button" class="slot'+(off?" off":"")+(S.time===x?" sel":"")+'" data-t="'+x+'" style="animation-delay:'+(idx++*40)+'ms"'+(off?" disabled":"")+'><span class="tm">'+fmtTime(x)+'</span><span class="st">'+(isBk?t("booked"):isPast?t("passed"):(S.time===x?'<i class="fa-solid fa-check"></i>':t("free")))+"</span></button>";
    });
  });
  if(!any)html+='<div class="nodata">'+t("noSlots")+"</div>";
  $("tlList").innerHTML=html;
}
$("tlList").addEventListener("click",function(e){var b=e.target.closest(".slot");if(!b||b.disabled)return;S.time=b.dataset.t;renderTimeline();update();focusCenter($("pick"))});

function setStatus(card,id){
  var st=card.querySelector(".fstatus"),f=S.files[id]||{};
  st.className="fstatus";
  if(f.busy){st.innerHTML='<span class="spin"></span>'+t("uploading")}
  else if(f.err){st.className="fstatus bad";st.innerHTML='<i class="fa-solid fa-triangle-exclamation"></i>'+t("upFail")}
  else if(f.url){st.className="fstatus ok";st.innerHTML='<i class="fa-solid fa-circle-check"></i>';st.appendChild(document.createTextNode(t("uploaded")+" · "+f.name))}
  else if(validLink(f.link)){st.className="fstatus ok";st.innerHTML='<i class="fa-solid fa-circle-check"></i>'+t("linkSaved")}
  else st.textContent="";
  card.classList.toggle("done",fileDone(id));
}
function renderFiles(){document.querySelectorAll(".fcard[data-file]").forEach(function(c){setStatus(c,c.dataset.file)})}
document.querySelectorAll(".fcard[data-file]").forEach(function(card){
  var id=card.dataset.file,fi=card.querySelector("input[type=file]"),li=card.querySelector("input[type=url]");
  fi.addEventListener("change",function(){
    var f=fi.files[0];if(!f)return;var o=S.files[id];o.name=f.name;o.url="";o.err=false;o.busy=true;setStatus(card,id);focusCenter(card);
    CMS.upload(f,"placement/"+id).then(function(u){o.url=u}).catch(function(){o.err=true}).then(function(){o.busy=false;setStatus(card,id);update();focusCenter(card)});
  });
  li.addEventListener("input",function(){S.files[id].link=li.value.trim();setStatus(card,id);update()});
  li.addEventListener("focus",function(){focusCenter(card)});
  card.querySelector(".paste").addEventListener("click",function(){
    if(navigator.clipboard&&navigator.clipboard.readText)navigator.clipboard.readText().then(function(v){li.value=v.trim();li.dispatchEvent(new Event("input"))}).catch(function(){li.focus()});else li.focus();
  });
});

function copyText(s){
  var ok=function(){toast(t("copied"))};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(s).then(ok).catch(function(){fb()});else fb();
  function fb(){var a=document.createElement("textarea");a.value=s;document.body.appendChild(a);a.select();try{document.execCommand("copy");ok()}catch(e){}a.remove()}
}
function renderPay(){
  var ip=CMS.get("pl.instapayLink"),vf=CMS.get("pl.vodafone");
  $("ipLink").textContent=ip;$("vfNum").textContent=vf;
  $("ipOpen").href=/^https?:/i.test(ip)?ip:"#";$("ipOpen").style.display=/^https?:/i.test(ip)?"":"none";
  document.querySelectorAll("#chips .chip").forEach(function(c){c.classList.toggle("sel",c.dataset.m===S.method)});
  $("proofBox").classList.toggle("hide",S.method==="cash");
}
document.querySelectorAll("[data-copy]").forEach(function(b){b.addEventListener("click",function(){copyText(b.dataset.copy==="ip"?CMS.get("pl.instapayLink"):CMS.get("pl.vodafone"));if(S.method==="cash"){S.method=b.dataset.copy==="ip"?"instapay":"vodafone";renderPay();update()}focusCenter($("proofBox"))})});
$("chips").addEventListener("click",function(e){var c=e.target.closest(".chip");if(!c)return;S.method=c.dataset.m;renderPay();update();if(S.method!=="cash")focusCenter($("proofBox"))});

$("agreeRules").onchange=function(){S.rules=this.checked;update()};
$("agreeTerms").onchange=function(){S.terms=this.checked;update()};
$("nameInput").addEventListener("input",function(){S.name=this.value;update()});

function comp(){return[S.name.trim().length>1&&!!S.date&&!!S.time,fileDone("english")||fileDone("psych"),S.method==="cash"||fileDone("proof"),S.rules&&S.terms]}
function canGo(n){var c=comp();for(var i=0;i<n-1;i++)if(!c[i])return false;return true}
function go(n){
  if(!canGo(n)){toast(t("locked"),1);return}
  S.step=n;document.querySelectorAll(".pcard").forEach(function(s,i){s.classList.toggle("active",i+1===n)});
  window.scrollTo({top:0,behavior:"smooth"});renderPill();
}
document.querySelectorAll(".pdot[data-s]").forEach(function(d){d.addEventListener("click",function(){go(+d.dataset.s)})});
document.querySelectorAll("[data-back]").forEach(function(b){b.addEventListener("click",function(){go(+b.dataset.back)})});
$("c1").onclick=function(){if(S.name.trim().length<2){toast(t("needName"),1);$("nameInput").focus();return}go(2)};
$("c2").onclick=function(){go(3)};$("c3").onclick=function(){go(4)};

var ICONS=["fa-regular fa-calendar-check","fa-regular fa-folder-open","fa-solid fa-wallet","fa-solid fa-scroll"];
function renderPill(){
  var c=comp(),all=c.every(Boolean);
  document.querySelectorAll(".pdot[data-s]").forEach(function(d,i){
    d.className="pdot"+(c[i]?" done":(S.step===i+1?" cur":""));
    d.innerHTML=c[i]?'<i class="fa-solid fa-check"></i>':'<i class="'+ICONS[i]+'"></i>';
  });
  document.querySelectorAll(".pline").forEach(function(l,i){l.classList.toggle("done",c[i])});
  var p=$("pill");p.classList.toggle("alldone",all);p.classList.toggle("complete",all&&S.complete&&!S.editing);
}
function update(){
  var c=comp();
  $("c1").disabled=!c[0];$("c2").disabled=!c[1];$("c3").disabled=!c[2];
  $("warn2").classList.toggle("show",!c[1]&&(fileDone("secret")||S.files.english.err||S.files.psych.err));
  $("warn3").classList.toggle("show",!c[2]&&(S.files.proof.err));
  var pk=$("pick");
  if(S.date&&S.time){pk.classList.add("show");$("pickTxt").textContent=fmtDate(S.date,true)+" · "+fmtTime(S.time)}else pk.classList.remove("show");
  var all=c.every(Boolean);
  if(all&&!S.complete){S.complete=true;S.editing=false;celebrate();saveBooking()}
  else if(!all&&S.complete){S.complete=false;S.editing=false}
  renderPill();
}

function celebrate(){
  toast(t("done"));
  var cols=["#d4af37","#10b981","#ef4444","#ffffff","#2563eb"];
  for(var i=0;i<26;i++){var s=document.createElement("span");s.className="confetti";s.style.background=cols[i%cols.length];
    s.style.setProperty("--x",(Math.random()*360-180)+"px");s.style.setProperty("--y",(-(Math.random()*260+80))+"px");s.style.setProperty("--r",(Math.random()*720-360)+"deg");
    s.style.animationDelay=(Math.random()*.15)+"s";document.body.appendChild(s);setTimeout(function(x){x.remove()},2000,s)}
}
function fileLine(id){var f=S.files[id];if(f.url)return t("fileWord")+": "+f.name+"\n"+f.url;if(validLink(f.link))return t("linkWord")+": "+f.link;return t("none")}
function payLine(){return S.method==="cash"?t("inPerson"):(S.method==="instapay"?t("instapay"):t("vodafone"))}
function summary(){
  var L=[t("hdr"),"",t("rName")+": "+S.name.trim(),t("rDate")+": "+fmtDate(S.date,true),t("rTime")+": "+fmtTime(S.time),"",
   t("rEnglish")+": "+fileLine("english"),t("rPsych")+": "+fileLine("psych")];
  if(fileDone("secret"))L.push(t("rSecret")+": "+fileLine("secret"));
  L.push("",t("rPay")+": "+payLine()+" ("+CMS.get("pl.price")+")");
  if(S.method!=="cash")L.push(fileLine("proof"));
  L.push(t("rAgree")+": "+t("agreed"));return L.join("\n");
}
function rrow(a,b){var d=document.createElement("div");d.className="rrow";var x=document.createElement("span"),y=document.createElement("span");x.textContent=a;y.textContent=b;d.appendChild(x);d.appendChild(y);return d}
function shortFile(id){var f=S.files[id];return f.url?f.name:(validLink(f.link)?f.link:t("none"))}
function openReceipt(){
  var b=$("rBody");b.innerHTML="";
  b.appendChild(rrow(t("rName"),S.name.trim()));b.appendChild(rrow(t("rDate"),fmtDate(S.date,true)));b.appendChild(rrow(t("rTime"),fmtTime(S.time)));
  b.appendChild(rrow(t("rEnglish"),shortFile("english")));b.appendChild(rrow(t("rPsych"),shortFile("psych")));
  if(fileDone("secret"))b.appendChild(rrow(t("rSecret"),shortFile("secret")));
  b.appendChild(rrow(t("rPay"),payLine()+(S.method!=="cash"?" · "+shortFile("proof"):"")));
  b.appendChild(rrow(t("rAmount"),CMS.get("pl.price")));b.appendChild(rrow(t("rAgree"),"✓ "+t("agreed")));
  var txt=summary();
  $("shWa").href="https://wa.me/"+String(CMS.get("pl.wa")).replace(/\D/g,"")+"?text="+encodeURIComponent(txt);
  $("shTg").href="https://t.me/"+String(CMS.get("pl.tg")).replace(/^@/,"");
  $("receipt").classList.add("open");
}
$("pillDone").onclick=openReceipt;
$("finDot").onclick=function(){S.editing=false;renderPill();openReceipt()};
$("rClose").onclick=function(){$("receipt").classList.remove("open")};
$("receipt").addEventListener("click",function(e){if(e.target===this)this.classList.remove("open")});
$("shTg").addEventListener("click",function(){copyText(summary());toast(t("tgCopied"))});
$("shCp").onclick=function(){copyText(summary())};
$("shEdit").onclick=function(){S.editing=true;$("receipt").classList.remove("open");renderPill();go(1)};
function saveBooking(){
  if(S.saved)return;S.saved=true;
  function fv(id){var f=S.files[id];return f.url||(validLink(f.link)?f.link:"")}
  CMS.post("placement_bookings",{name:S.name.trim(),date:S.date,time:S.time,english:fv("english"),psych:fv("psych"),secret:fv("secret"),pay_method:S.method,proof:fv("proof"),price:CMS.get("pl.price"),created_at:new Date().toISOString()});
}

function renderAll(){
  renderCal();renderTimeline();renderFiles();renderPay();update();
}
CMS.onApply(renderAll);

light=ld("thabit_theme")==="light";
document.body.classList.toggle("light-theme",light);$("themeIcon").className=light?"fa-solid fa-sun":"fa-solid fa-moon";
var sl=ld("thabit_lang");window.setLanguage(sl&&PAGE_I18N[sl]?sl:"en");
})();