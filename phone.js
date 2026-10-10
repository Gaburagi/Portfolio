(() => {
  const room = document.querySelector('#room');
  const desktop = document.querySelector('#desktop');
  const compact = matchMedia('(max-width: 760px)');
  const phone = document.createElement('section'); phone.id = 'phone'; phone.hidden = true;
  phone.setAttribute('aria-label', "Gabriel's phone");
  phone.innerHTML = `<div class="phone-shell"><header class="phone-status"><span>GABRONI / POCKET EDITION</span><span aria-hidden="true">▮▮▮ ▰</span></header><div id="phone-home"><div class="phone-intro"><time id="phone-time"></time><p id="phone-date"></p><h1>A little world.<br>In your hands.</h1><p>Gabriel Diana / Developer & designer</p></div><nav class="phone-apps" aria-label="Phone apps"></nav><button id="explore-room">Explore the room ↗</button></div><section id="phone-app" hidden aria-labelledby="phone-app-title"><header class="phone-app-header"><button id="phone-back" aria-label="Back to phone home">← Back</button><h2 id="phone-app-title" tabindex="-1"></h2></header><div id="phone-app-body"></div></section><footer class="phone-dock"><button id="phone-home-button" aria-label="Phone home">Home <span aria-hidden="true">▱</span></button><span>YOUR PORTFOLIO, ON THE GO.</span></footer></div>`;
  document.body.append(phone);
  const home = phone.querySelector('#phone-home'), app = phone.querySelector('#phone-app');
  const items = [['projects','▣','Projects'],['bulletin','▧','Gallery'],['certificates','▤','Certificates'],['about','☺','About'],['skills','⌘','Skills'],['contact','✉','Contact']];
  let lastApp = 'projects', loading;
  items.forEach(([id,icon,label])=>{const button=document.createElement('button');button.dataset.app=id;const glyph=document.createElement('span');glyph.className='phone-app-icon';glyph.textContent=icon;glyph.setAttribute('aria-hidden','true');button.append(glyph,document.createTextNode(label));phone.querySelector('.phone-apps').append(button);});
  function homeScreen(focus=true) {app.hidden=true;home.hidden=false;if(focus)phone.querySelector(`[data-app="${lastApp}"]`)?.focus();}
  function show() {room.hidden=true;desktop.hidden=true;phone.hidden=false;document.body.classList.add('phone-mode');window.dispatchEvent(new Event('desktop-enter'));homeScreen(false);phone.querySelector('[data-app]').focus();}
  function loadRoom() {
    if(!loading) loading=import('./room.js').catch(()=>{document.querySelector('#scene-status').textContent='Room unavailable. The phone and desktop are still ready to explore.';});
    return loading;
  }
  function explore() {phone.hidden=true;room.hidden=false;desktop.hidden=true;room.classList.remove('entering');document.body.classList.remove('phone-mode');window.dispatchEvent(new Event('desktop-leave'));loadRoom();document.querySelector('[data-corner=desk]').focus();}
  phone.addEventListener('click',event=>{const button=event.target.closest('[data-app]');if(!button)return;const data=window.portfolioApps[button.dataset.app];if(!data)return;lastApp=button.dataset.app;home.hidden=true;app.hidden=false;phone.querySelector('#phone-app-title').textContent=items.find(item=>item[0]===lastApp)?.[2] || data.title;phone.querySelector('#phone-app-body').innerHTML=data.body;phone.querySelector('#phone-app-title').focus();app.scrollTop=0;});
  phone.querySelector('#phone-back').onclick=()=>homeScreen();phone.querySelector('#phone-home-button').onclick=()=>homeScreen();phone.querySelector('#explore-room').onclick=explore;
  document.querySelector('#use-phone').onclick=show;
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!phone.hidden&&!document.querySelector('#memory-dialog').open)homeScreen();});
  function tick(){const now=new Date();phone.querySelector('#phone-time').textContent=now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});phone.querySelector('#phone-time').dateTime=now.toISOString();phone.querySelector('#phone-date').textContent=now.toLocaleDateString([],{weekday:'long',month:'long',day:'numeric'});}
  tick();setInterval(()=>{if(!phone.hidden&&!document.hidden)tick();},30000);
  let entering=false;
  window.deviceMode={get phone(){return compact.matches;}};
  window.phoneExperience={async enter(skip=false){
    if(entering)return;entering=true;room.classList.add('entering');
    if(!skip && window.roomExperience)await window.roomExperience.approach();
    show();entering=false;
  }};
  function updateDeviceLabels(){
    const mobile=compact.matches;
    room.dataset.device=mobile?'phone':'computer';
    document.querySelector('#enter').textContent=mobile?'Use phone':'Use computer';
    document.querySelector('#skip').textContent=mobile?'Go straight to phone':'Go straight to desktop';
    document.querySelector('[data-corner=desk] span').textContent=mobile?'Phone':'Computer';
    document.querySelector('.room-caption p').innerHTML=mobile?"One room. One phone.<br>A few things I've made.":"One room. One computer.<br>A few things I've made.";
    room.setAttribute('aria-label',mobile?"A dark room with Gabriel's phone on a table":"A dark room with Gabriel's computer");
    document.querySelector('#use-phone').hidden=true;
    window.dispatchEvent(new Event('room-device-change'));
  }
  compact.addEventListener('change',updateDeviceLabels);updateDeviceLabels();loadRoom();
})();
