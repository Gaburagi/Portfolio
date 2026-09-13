(() => {
  const room = document.querySelector('#room');
  const desktop = document.querySelector('#desktop');
  const windows = document.querySelector('#windows');
  const tasks = document.querySelector('#tasks');
  const menu = document.querySelector('#start-menu');
  const start = document.querySelector('#start');
  const opened = new Map();
  let layer = 10, entering = false, visited = false;
  const apps = {
    welcome: { title: 'Welcome.txt — Notepad', status: 'Your own little corner of the internet.', body: `<span class="eyebrow">HELLO, WORLD.</span><h3>Welcome to my computer.</h3><p>I'm Gabriel Diana, a student developer from the Philippines making games and designing digital experiences.</p><p>Make yourself at home. Open a folder, look through my work, or find out a little about the person behind the screen.</p><button class="retro-button" data-app="projects">Open My Projects →</button><button class="retro-button" data-app="about">Meet Gabriel</button><p><small>Click folders to open them. Drag title bars to move windows. Your open windows live in the taskbar.</small></p>` },
    projects: { title: 'My Projects — Explorer', status: '4 objects · Select a project to open its folder', body: `<span class="eyebrow">C:\\GABRIEL\\PROJECTS</span><div class="project-grid">${[
      ['kalye','Kalye Corazon','A pixel-art game set in Iloilo','assets/kalye/logo.png'],
      ['rhythm','AlgoRHYTHM','A rhythm game built with Python','assets/iseet/logo.png'],
      ['laundry','F1 + X','A laundromat application','assets/f1x/logo.png'],
      ['campus','WVSolutions','A campus marketplace','assets/wvsu/WVSOLUTIONS.png']
    ].map(([id,name,desc,img]) => `<button class="project-item" data-app="${id}"><img src="${img}" alt="${name}" loading="lazy"><strong>▱ ${name}</strong><small>${desc}</small></button>`).join('')}</div>` },
    about: { title: 'About Me.txt — Notepad', status: 'Based in the Philippines', body: `<img class="profile" src="assets/poopoowow.jpg" alt="Gabriel Diana"><span class="eyebrow">THE PERSON BEHIND THE SCREEN</span><h3>Hey, I'm Gabriel.</h3><p>I'm a student developer based in the Philippines. I enjoy creating digital experiences that combine creativity with functionality.</p><p>I started coding in my first year of college. Studying Computer Science has given me a new way to approach problem-solving and design, and I'm still learning as I go.</p><p>Outside of coding, you'll find me playing video games or at the gym.</p><button class="retro-button" data-app="skills">View my skills</button><button class="retro-button" data-app="contact">Say hello</button>` },
    skills: { title: 'My Skills — System Properties', status: 'Status: always learning', body: `<span class="eyebrow">SYSTEM INFORMATION</span><h3>Built with curiosity.</h3><dl class="skill-list"><dt>Frontend</dt><dd>HTML & CSS<br>JavaScript<br>Responsive design</dd><dt>Programming</dt><dd>Python · SQL · GDScript</dd><dt>Design</dt><dd>Figma · Canva<br>Aseprite · Ibispaint<br>UI/UX design</dd></dl>` },
    contact: { title: 'Contact — Address Book', status: 'Email opens in your mail application', body: `<span class="eyebrow">LET'S MAKE SOMETHING</span><h3>My inbox is open.</h3><p>For collaborations, project ideas, or just a friendly hello.</p><a class="retro-button" href="mailto:gabmdiana@gmail.com">✉ gabmdiana@gmail.com</a><div class="contact-links"><a class="retro-button" href="https://github.com/Gaburagi" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a class="retro-button" href="https://www.linkedin.com/in/gabriel-diana-3a34772b6" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a class="retro-button" href="https://www.facebook.com/gaburagi.gg" target="_blank" rel="noopener noreferrer">Facebook ↗</a></div><p>Philippines / UTC+8</p>` },
    extras: { title: 'You opened it.exe', status: 'Secret found: the resident desktop monkey', body: `<h3>Well, you found me.</h3><img class="easter-egg" src="assets/monkey-dance-gif-956287.gif" alt="A dancing monkey"><p style="text-align:center">Every computer needs a little nonsense.<br>Thanks for exploring mine.</p>` }
  };
  [
    ['kalye','Kalye Corazon','A pixel-art game set in the streets of Iloilo, bringing local culture and places into a playable world.','assets/kalye/kalyeSc.png','projects/kalye-corazon.html'],
    ['rhythm','AlgoRHYTHM','A rhythm game that challenges players to time their actions to music, built with Python and Pygame.','assets/iseet/algorhythm1.png','projects/iseet.html'],
    ['laundry','F1 + X','A laundromat application for managing laundry needs, tracking orders, and scheduling pickups and deliveries.','assets/f1x/pic1.png','projects/f1x.html'],
    ['campus','WVSolutions','A university marketplace connecting students and staff to buy, sell, and trade goods and services.','assets/wvsu/image.png','projects/wvsolutions.html']
  ].forEach(([id,title,desc,img,url]) => { apps[id] = {title: title + ' — Project', status:'Project preview · Full case study opens in a new tab', body:`<h3>${title}</h3><img src="${img}" alt="${title} screenshot" style="width:100%;max-height:240px;object-fit:contain;background:#080808"><p>${desc}</p><a class="retro-button" href="${url}" target="_blank" rel="noopener">Full project ↗</a><button class="retro-button" data-app="projects">All projects</button>`}; });
  function setMenu(show) { menu.hidden = !show; start.setAttribute('aria-expanded', String(show)); }
  function focusWindow(id, moveFocus = true) {
    const item = opened.get(id); if (!item) return;
    opened.forEach(({el,task}) => { el.classList.remove('active'); task.setAttribute('aria-pressed','false'); });
    item.el.hidden = false; item.el.classList.add('active'); item.el.style.zIndex = ++layer;
    item.task.setAttribute('aria-pressed','true');
    if (moveFocus) item.el.focus({preventScroll:true});
  }
  function openApp(id) {
    if (!apps[id]) return;
    setMenu(false);
    if (opened.has(id)) { focusWindow(id); return; }
    const app = apps[id];
    const el = document.createElement('section'); el.className = 'window'; el.tabIndex = -1;
    el.setAttribute('role','region'); el.setAttribute('aria-label',app.title);
    const offset = (opened.size % 5) * 22;
    el.style.left = Math.min(180 + offset, Math.max(5, innerWidth - 640)) + 'px'; el.style.top = 90 + offset + 'px';
    el.innerHTML = `<header class="titlebar"><h2>${app.title}</h2><div class="window-controls"><button data-control="minimize" aria-label="Minimize ${app.title}">_</button><button data-control="maximize" aria-label="Maximize window">□</button><button data-control="close" aria-label="Close ${app.title}">×</button></div></header><div class="window-body">${app.body}</div><footer class="window-status">${app.status}</footer>`;
    const task = document.createElement('button'); task.textContent = app.title.split(' — ')[0];
    task.addEventListener('click', () => { if (!el.hidden && el.classList.contains('active')) minimize(); else focusWindow(id); });
    const minimize = () => { el.hidden = true; el.classList.remove('active'); task.setAttribute('aria-pressed','false'); task.focus(); };
    el.addEventListener('pointerdown', () => focusWindow(id,false));
    el.addEventListener('focusin', () => { if (!el.classList.contains('active')) focusWindow(id,false); });
    el.querySelector('[data-control=minimize]').onclick = minimize;
    el.querySelector('[data-control=close]').onclick = () => { el.remove(); task.remove(); opened.delete(id); const other = [...opened.keys()].reverse().find(key => !opened.get(key).el.hidden); if(other) focusWindow(other); else document.querySelector('.desktop-icons button').focus(); };
    const maximize = () => { el.classList.toggle('maximized'); el.querySelector('[data-control=maximize]').setAttribute('aria-label',el.classList.contains('maximized')?'Restore window':'Maximize window'); };
    el.querySelector('[data-control=maximize]').onclick = maximize;
    const bar = el.querySelector('.titlebar'); let drag = null;
    bar.addEventListener('dblclick', e => { if (!e.target.closest('button')) maximize(); });
    bar.addEventListener('pointerdown', e => {
      if (e.target.closest('button') || el.classList.contains('maximized') || innerWidth <= 760) return;
      const rect = el.getBoundingClientRect(); drag = {x:e.clientX-rect.left,y:e.clientY-rect.top}; bar.setPointerCapture(e.pointerId);
    });
    bar.addEventListener('pointermove', e => { if(!drag)return; el.style.left=Math.max(0,Math.min(innerWidth-el.offsetWidth,e.clientX-drag.x))+'px'; el.style.top=Math.max(54,Math.min(innerHeight-90,e.clientY-drag.y))+'px'; });
    bar.addEventListener('pointerup', () => drag=null); bar.addEventListener('pointercancel', () => drag=null);
    windows.append(el); tasks.append(task); opened.set(id,{el,task}); focusWindow(id);
  }
  async function enter(skip = false) {
    if (entering || !desktop.hidden) return; entering = true;
    room.classList.add('entering');
    if (!skip && window.roomExperience) await window.roomExperience.approach();
    room.hidden = true; desktop.hidden = false; entering = false;
    if (!visited) { openApp('welcome'); visited = true; } else document.querySelector('.desktop-icons button').focus();
    window.dispatchEvent(new Event('desktop-enter'));
  }
  function leave() { desktop.hidden = true; room.hidden = false; room.classList.remove('entering'); setMenu(false); window.roomExperience?.reset(); document.querySelector('#enter').focus(); window.dispatchEvent(new Event('desktop-leave')); }
  document.addEventListener('click', e => { const button=e.target.closest('[data-app]'); if(button)openApp(button.dataset.app); if(!e.target.closest('#start-menu,#start'))setMenu(false); });
  document.querySelector('#enter').onclick=()=>enter(); document.querySelector('#skip').onclick=()=>enter(true);
  document.querySelector('#leave').onclick=leave; document.querySelector('#start-leave').onclick=leave;
  start.onclick=()=>setMenu(menu.hidden);
  document.addEventListener('keydown', e => {
    if(e.key==='Escape' && !desktop.hidden) { if(!menu.hidden){setMenu(false);start.focus();} else leave(); }
    if(e.key==='Enter' && desktop.hidden && !e.target.closest('button,a,input')) enter();
  });
  window.addEventListener('resize',()=>opened.forEach(({el})=>{if(innerWidth>760){el.style.left=Math.max(5,Math.min(parseFloat(el.style.left),innerWidth-el.offsetWidth-5))+'px';el.style.top=Math.max(57,Math.min(parseFloat(el.style.top),innerHeight-130))+'px';}}));
  const tick=()=>{const now=new Date();const clock=document.querySelector('#clock');clock.textContent=now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});clock.dateTime=now.toISOString();};tick();setInterval(tick,30000);
  window.enterComputer=()=>enter();
})();
