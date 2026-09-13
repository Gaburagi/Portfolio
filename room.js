// Keep the desktop independent of WebGL and of the external renderer download.
const host = document.querySelector('#scene');
const status = document.querySelector('#scene-status');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function fallback() {
  host.replaceChildren();
  const pc = document.createElement('div'); pc.className = 'fallback-pc'; pc.textContent = '> GABRONI OS_';
  host.append(pc); status.textContent = 'The desktop is ready. Click Use computer to enter.';
}
try {
  const THREE = await Promise.race([
    import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js'),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Renderer download timed out')),12000))
  ]);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x050505); scene.fog = new THREE.FogExp2(0x050505,.045);
  const camera = new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,60);
  const renderer = new THREE.WebGLRenderer({antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)); renderer.setSize(host.clientWidth,host.clientHeight);
  renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.25;
  host.append(renderer.domElement);
  const dark=new THREE.MeshStandardMaterial({color:0x292929,roughness:.85});
  const casing=new THREE.MeshStandardMaterial({color:0x666666,roughness:.7});
  const black=new THREE.MeshStandardMaterial({color:0x090909,roughness:.8});
  function box(w,h,d,x,y,z,mat=dark) { const obj=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);obj.position.set(x,y,z);obj.castShadow=true;obj.receiveShadow=true;scene.add(obj);return obj; }
  box(22,.15,20,0,-.1,0,new THREE.MeshStandardMaterial({color:0x191919,roughness:.7}));
  box(22,10,.2,0,4,-3.2,new THREE.MeshStandardMaterial({color:0x161616}));
  // A quiet room, desk, CRT, tower, keyboard and wired mouse; no model downloads.
  box(4.8,.16,2.05,.6,1.47,0);
  for(const x of [-1.5,2.7]) for(const z of [-.72,.72]) box(.12,1.42,.12,x,.69,z);
  box(1.95,1.48,.92,.55,2.52,-.27,casing);
  box(1.69,1.19,.025,.55,2.57,.205,black);
  box(.42,.27,.38,.55,1.75,-.25,casing);box(1.1,.09,.64,.55,1.58,-.17,casing);
  const screenCanvas=document.createElement('canvas');screenCanvas.width=768;screenCanvas.height=540;
  const ctx=screenCanvas.getContext('2d');
  ctx.fillStyle='#111111';ctx.fillRect(0,0,768,540);
  ctx.strokeStyle='#555';ctx.lineWidth=2;ctx.strokeRect(24,22,720,496);
  ctx.fillStyle='#aaa';ctx.font='16px monospace';ctx.fillText('GABRONI OS / PERSONAL COMPUTER',47,57);
  ctx.fillStyle='#e5e5e5';ctx.font='bold 88px monospace';ctx.fillText('hello_',185,268);
  ctx.fillStyle='#999';ctx.font='18px monospace';ctx.fillText('A FEW THINGS I HAVE MADE.',177,313);
  ctx.fillStyle='#292929';ctx.fillRect(0,495,768,45);ctx.fillStyle='#bbb';ctx.font='16px monospace';ctx.fillText('▦ START',24,524);ctx.fillText('GABRIEL DIANA',598,524);
  for(let y=0;y<540;y+=4){ctx.fillStyle='#00000022';ctx.fillRect(0,y,768,1);}
  const texture=new THREE.CanvasTexture(screenCanvas);texture.colorSpace=THREE.SRGBColorSpace;
  const screen=new THREE.Mesh(new THREE.PlaneGeometry(1.56,1.08),new THREE.MeshBasicMaterial({map:texture}));screen.position.set(.55,2.57,.223);scene.add(screen);
  box(.06,.025,.03,1.23,1.89,.2,new THREE.MeshBasicMaterial({color:0xbbbbbb}));
  box(.62,1.25,1.1,2.05,2.17,-.1,casing);box(.47,.12,.025,2.05,2.52,.46,black);box(.4,.035,.03,2.05,2.33,.46,black);
  for(let i=0;i<6;i++)box(.33,.012,.02,2.05,1.76+i*.045,.46,black);
  box(.035,.035,.02,2.23,2.12,.46,new THREE.MeshBasicMaterial({color:0xdddddd}));
  box(1.45,.065,.47,.48,1.59,.64,casing);
  for(let row=0;row<4;row++)for(let col=0;col<13;col++)box(.086,.025,.075,-.12+col*.1,1.638,.49+row*.09,dark);
  box(.5,.025,.058,.48,1.641,.83,dark);
  box(.55,.015,.52,1.69,1.565,.64,black);
  const mouse=new THREE.Mesh(new THREE.SphereGeometry(.13,16,12),casing);mouse.scale.set(.8,.45,1.35);mouse.position.set(1.68,1.62,.67);scene.add(mouse);
  const cableCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(1.68,1.58,.54),new THREE.Vector3(1.8,1.59,.1),new THREE.Vector3(1.4,1.59,-.5)]);
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(cableCurve,20,.012,6,false),black));
  scene.add(new THREE.AmbientLight(0xffffff,.18));
  const glow=new THREE.PointLight(0xffffff,9,6,2);glow.position.set(.55,2.5,.75);scene.add(glow);
  const overhead=new THREE.SpotLight(0xffffff,28,14,.62,.85,1.8);overhead.position.set(1.5,6,2);overhead.target.position.set(.5,1,0);overhead.castShadow=true;overhead.shadow.mapSize.set(1024,1024);scene.add(overhead,overhead.target);
  const rim=new THREE.PointLight(0xffffff,5,8,2);rim.position.set(-2,3,-1.3);scene.add(rim);
  const pointer=new THREE.Vector2(); const raycaster=new THREE.Raycaster();
  let progress=0,zooming=false,done=null,paused=!document.querySelector('#desktop').hidden;
  const startPosition=new THREE.Vector3();const startLook=new THREE.Vector3();const look=new THREE.Vector3();
  function frameRoom(){const mobile=innerWidth<760;startPosition.set(mobile?2.7:4, mobile?3.3:3.45, mobile?10:8.7);startLook.set(mobile?.5:-.85,1.9,0);}
  frameRoom();camera.position.copy(startPosition);
  window.roomExperience={approach:()=>new Promise(resolve=>{if(reducedMotion.matches){resolve();return;}zooming=true;done=resolve;}),reset:()=>{zooming=false;progress=0;paused=false;camera.position.copy(startPosition);}};
  host.addEventListener('pointermove',e=>{const rect=host.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);host.style.cursor=raycaster.intersectObjects([screen]).length?'pointer':'default';});
  host.addEventListener('pointerleave',()=>pointer.set(0,0));
  host.addEventListener('click',()=>{raycaster.setFromCamera(pointer,camera);if(raycaster.intersectObjects([screen]).length)window.enterComputer?.();});
  const resize=()=>{frameRoom();camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();renderer.setSize(host.clientWidth,host.clientHeight);};
  window.addEventListener('resize',()=>{if(!paused)resize();});
  window.addEventListener('desktop-enter',()=>paused=true);window.addEventListener('desktop-leave',()=>{paused=false;resize();});
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();renderer.setAnimationLoop(null);window.roomExperience=null;if(done)done();fallback();});
  let last=0;
  renderer.setAnimationLoop(time=>{
    const dt=Math.min((time-last)/1000,.05);last=time;if(paused||document.hidden)return;
    if(zooming)progress=Math.min(1,progress+dt/1.35);
    const ease=progress*progress*(3-2*progress);
    camera.position.copy(startPosition).lerp(new THREE.Vector3(.55,2.57,1.8),ease);
    if(!reducedMotion.matches&&!zooming){camera.position.x+=pointer.x*.2;camera.position.y+=pointer.y*.08;}
    look.copy(startLook).lerp(new THREE.Vector3(.55,2.57,0),ease);camera.lookAt(look);
    renderer.render(scene,camera);
    if(progress===1&&done){const resolve=done;done=null;resolve();}
  });
  status.textContent='Move your mouse to look around · Click the screen to enter';
} catch(error) { console.warn('Using the accessible desktop fallback:',error);fallback(); }
