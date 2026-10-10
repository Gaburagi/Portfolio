import { createRoomBoards } from './room-boards-3d.js';
// Keep the desktop independent of WebGL and of the external renderer download.
const host = document.querySelector('#scene');
const status = document.querySelector('#scene-status');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function fallback() {
  document.querySelector('#room').classList.add('room-fallback');
  host.replaceChildren();
  const pc = document.createElement('div'); pc.className = 'fallback-pc'; pc.textContent = '> GABRONI OS_';
  host.append(pc);
  function syncFallback(){const mobile=window.deviceMode?.phone;pc.classList.toggle('fallback-phone',!!mobile);pc.textContent=mobile?'> POCKET OS_':'> GABRONI OS_';status.textContent=mobile?'Tap Use phone to enter.':'Click Use computer to enter.';}
  syncFallback();window.addEventListener('room-device-change',syncFallback);
}
try {
  const THREE = await Promise.race([
    import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js'),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Renderer download timed out')),12000))
  ]);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x050505); scene.fog = new THREE.FogExp2(0x050505,.045);
  const camera = new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,60);
  const renderer = new THREE.WebGLRenderer({antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,matchMedia('(pointer: coarse)').matches?1:1.5)); renderer.setSize(host.clientWidth,host.clientHeight);
  renderer.shadowMap.enabled=!matchMedia('(pointer: coarse)').matches; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
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
  const computerStart = new Set(scene.children);
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
  const keys=new THREE.InstancedMesh(new THREE.BoxGeometry(.086,.025,.075),dark,52);
  const keyMatrix=new THREE.Matrix4();
  for(let row=0;row<4;row++)for(let col=0;col<13;col++){keyMatrix.makeTranslation(-.12+col*.1,1.638,.49+row*.09);keys.setMatrixAt(row*13+col,keyMatrix);}
  keys.instanceMatrix.needsUpdate=true;keys.castShadow=true;keys.receiveShadow=true;scene.add(keys);
  box(.5,.025,.058,.48,1.641,.83,dark);
  box(.55,.015,.52,1.69,1.565,.64,black);
  const mouse=new THREE.Mesh(new THREE.SphereGeometry(.13,16,12),casing);mouse.scale.set(.8,.45,1.35);mouse.position.set(1.68,1.62,.67);scene.add(mouse);
  const cableCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(1.68,1.58,.54),new THREE.Vector3(1.8,1.59,.1),new THREE.Vector3(1.4,1.59,-.5)]);
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(cableCurve,20,.012,6,false),black));
  const computer = new THREE.Group();
  for(const item of [...scene.children])if(!computerStart.has(item))computer.add(item);
  scene.add(computer);
  const phone = new THREE.Group();phone.position.set(.55,2.37,.1);phone.rotation.x=-.12;scene.add(phone);
  const shape = new THREE.Shape();const w=.84,h=1.62,r=.1;
  shape.moveTo(-w/2+r,-h/2);shape.lineTo(w/2-r,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);shape.lineTo(w/2,h/2-r);shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);shape.lineTo(-w/2+r,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);shape.lineTo(-w/2,-h/2+r);shape.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
  const phoneBody=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.075,bevelEnabled:true,bevelSize:.018,bevelThickness:.015,bevelSegments:3,steps:1}),casing);phone.add(phoneBody);
  const phoneCanvas=document.createElement('canvas');phoneCanvas.width=400;phoneCanvas.height=800;
  const pc=phoneCanvas.getContext('2d');pc.fillStyle='#0c0c0c';pc.fillRect(0,0,400,800);
  pc.fillStyle='#aaa';pc.font='17px monospace';pc.fillText('GABRONI / POCKET EDITION',30,72);
  pc.fillStyle='#eee';pc.font='52px sans-serif';pc.fillText('hello_',30,175);
  pc.font='19px monospace';pc.fillText('GABRIEL DIANA',30,220);
  ['Projects','Gallery','Files','About','Skills','Contact'].forEach((label,i)=>{const x=35+(i%3)*120,y=340+Math.floor(i/3)*145;pc.fillStyle='#333';pc.fillRect(x,y,85,85);pc.strokeStyle='#888';pc.strokeRect(x,y,85,85);pc.fillStyle='#ddd';pc.font='28px monospace';pc.fillText(['>','+','=','@','#','~'][i],x+32,y+54);pc.font='14px monospace';pc.fillText(label,x+3,y+111);});
  pc.fillStyle='#aaa';pc.font='18px monospace';pc.fillText('TAP TO EXPLORE',115,727);pc.fillRect(155,768,90,4);
  const phoneTexture=new THREE.CanvasTexture(phoneCanvas);phoneTexture.colorSpace=THREE.SRGBColorSpace;
  const phoneScreen=new THREE.Mesh(new THREE.PlaneGeometry(.74,1.48),new THREE.MeshBasicMaterial({map:phoneTexture}));phoneScreen.position.z=.098;phone.add(phoneScreen);
  const speaker=new THREE.Mesh(new THREE.BoxGeometry(.18,.025,.014),black);speaker.position.set(0,.7,.11);phone.add(speaker);
  const stand = new THREE.Mesh(new THREE.BoxGeometry(.62,.09,.5),dark);stand.position.set(.55,1.6,-.04);phoneBody.castShadow=true;scene.add(stand);
  function syncDevice(){const mobile=window.deviceMode?.phone;phone.visible=!!mobile;stand.visible=!!mobile;computer.visible=!mobile;renderer.shadowMap.needsUpdate=true;host.dataset.model=mobile?'phone':'computer';}
  syncDevice();
  const boards = createRoomBoards(THREE, scene, window.portfolioBoards || []);
  scene.add(new THREE.AmbientLight(0xffffff,.18));
  const glow=new THREE.PointLight(0xffffff,9,6,2);glow.position.set(.55,2.5,.75);scene.add(glow);
  const overhead=new THREE.SpotLight(0xffffff,28,14,.62,.85,1.8);overhead.position.set(1.5,6,2);overhead.target.position.set(.5,1,0);overhead.castShadow=true;overhead.shadow.mapSize.set(1024,1024);scene.add(overhead,overhead.target);
  const rim=new THREE.PointLight(0xffffff,5,8,2);rim.position.set(-2,3,-1.3);scene.add(rim);
  renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
  const pointer=new THREE.Vector2(); const raycaster=new THREE.Raycaster();
  const hitPointer=new THREE.Vector2(), renderTarget=new THREE.Vector3(), approachPosition=new THREE.Vector3(), approachLook=new THREE.Vector3();
  const outline=new THREE.BoxHelper(undefined,0xaaaaaa);outline.material.transparent=true;outline.material.opacity=.5;outline.visible=false;scene.add(outline);
  function highlight(hit){outline.visible=!!hit;if(hit)outline.setFromObject(hit.object);}
  let lastHitTime=0;
  window.addEventListener('room-corner-change',()=>highlight(null));
  window.addEventListener('desktop-enter',()=>highlight(null));
  let progress=0,zooming=false,done=null,paused=!document.querySelector('#desktop').hidden;
  const startPosition=new THREE.Vector3();const startLook=new THREE.Vector3();const look=new THREE.Vector3();
  const viewPosition=new THREE.Vector3();const viewLook=new THREE.Vector3();
  let corner=window.roomBoards?.corner || 'desk';
  function frameRoom(){syncDevice();const mobile=window.deviceMode?.phone;startPosition.set(mobile?.95:4,mobile?3.05:3.45,mobile?6.5:8.7);startLook.set(mobile?.55:-.85,mobile?2.05:1.9,0);}
  frameRoom();camera.position.copy(startPosition);
  viewPosition.copy(startPosition);viewLook.copy(startLook);
  function updateView() {
    const view=boards.views.get(corner);
    if(!view){viewPosition.copy(startPosition);viewLook.copy(startLook);return;}
    const mobile=innerWidth<760;
    const aspect=host.clientWidth/host.clientHeight;
    const distance=Math.max(mobile?7.2:6.9, 2.8 / (Math.tan(THREE.MathUtils.degToRad(21))*aspect),view.height*1.25);
    viewPosition.copy(view.center).addScaledVector(view.normal,distance);
    viewLook.copy(view.center);
    if(mobile){viewLook.y+=.35;}else{viewLook.addScaledVector(view.tangent,-1.35);}
  }
  updateView();look.copy(startLook);
  window.addEventListener('room-corner-change',event=>{corner=event.detail;pointer.set(0,0);updateView();});
  window.roomExperience={approach:()=>new Promise(resolve=>{if(reducedMotion.matches){resolve();return;}progress=0;zooming=true;done=resolve;}),reset:()=>{zooming=false;progress=0;paused=false;corner='desk';updateView();camera.position.copy(startPosition);look.copy(startLook);}};
  function hitAt(event) {
    const rect=host.getBoundingClientRect();
    const coords=hitPointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
    raycaster.setFromCamera(coords,camera);
    return raycaster.intersectObjects(corner==='desk'?(phone.visible?[phoneScreen,phoneBody]:[screen]):boards.targets.filter(mesh=>mesh.userData.memory.boardId===corner))[0];
  }
  host.addEventListener('pointermove',e=>{const rect=host.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);if(performance.now()-lastHitTime>40){const hit=hitAt(e);highlight(hit);host.style.cursor=hit?'pointer':'default';lastHitTime=performance.now();}});
  host.addEventListener('pointerleave',()=>{pointer.set(0,0);highlight(null);});
  host.addEventListener('pointerdown',event=>{if(hitAt(event)){host.classList.add('object-pressed');}});
  for(const name of ['pointerup','pointercancel','pointerleave'])host.addEventListener(name,()=>host.classList.remove('object-pressed'));
  host.addEventListener('click',event=>{if(zooming)return;const hit=hitAt(event);if(!hit)return;const memory=hit.object.userData.memory;if(memory)window.roomBoards?.openMemory(memory.boardId,memory.index);else window.enterComputer?.();});
  const resize=()=>{frameRoom();updateView();camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();renderer.setSize(host.clientWidth,host.clientHeight);};
  window.addEventListener('resize',()=>{if(!paused)resize();});
  window.addEventListener('room-device-change',()=>{if(!paused)resize();});
  window.addEventListener('desktop-enter',()=>paused=true);
  // Both phone and computer exit through this event. Reset the approach state,
  // using the current viewport, before the shared render wake-up runs.
  window.addEventListener('desktop-leave',()=>{resize();window.roomExperience?.reset();});
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();renderer.setAnimationLoop(null);window.roomExperience=null;if(done)done();fallback();});
  let last=0, activeUntil=0;
  function wake() {
    if(document.hidden || document.querySelector('#room').hidden || document.querySelector('#memory-dialog').open)return;
    activeUntil=performance.now()+2200;
    renderer.setAnimationLoop(drawFrame);
  }
  for(const name of ['room-corner-change','desktop-leave','room-item-closed','room-scene-change','room-device-change','resize'])window.addEventListener(name,wake);
  host.addEventListener('pointermove',wake);host.addEventListener('pointerleave',wake);
  document.querySelector('#enter').addEventListener('click',wake);
  host.addEventListener('click',wake);
  document.addEventListener('keydown',wake);
  document.addEventListener('visibilitychange',wake);
  reducedMotion.addEventListener('change',wake);
  function drawFrame(time){
    const dt=Math.min((time-last)/1000,.05);last=time;if(paused||document.hidden||document.querySelector('#room').hidden||document.querySelector('#memory-dialog').open){renderer.setAnimationLoop(null);return;}
    boards.update(dt,reducedMotion.matches);
    if(zooming)progress=Math.min(1,progress+dt/1.35);
    const ease=progress*progress*(3-2*progress);
    if(zooming){
      camera.position.copy(startPosition).lerp(approachPosition.set(.55,phone.visible?2.37:2.57,phone.visible?1.9:1.8),ease);
      look.copy(startLook).lerp(approachLook.set(.55,phone.visible?2.37:2.57,0),ease);
    }else{
      const blend=reducedMotion.matches?1:1-Math.exp(-dt*4.5);
      const target=renderTarget.copy(viewPosition);
      if(!reducedMotion.matches&&!document.querySelector('#memory-dialog').open){target.x+=pointer.x*.12;target.y+=pointer.y*.055;}
      camera.position.lerp(target,blend);look.lerp(viewLook,blend);
    }
    camera.lookAt(look);
    renderer.render(scene,camera);
    if(progress===1&&done){const resolve=done;done=null;resolve();}
    if(time>activeUntil&&!done)renderer.setAnimationLoop(null);
  }
  wake();
  function updateHint(){status.textContent=window.deviceMode?.phone?'Tap the phone on the table to explore.':'Move your mouse to look around - click the screen to enter.';}
  updateHint();window.addEventListener('room-device-change',updateHint);
} catch(error) { console.warn('Using the accessible desktop fallback:',error);fallback(); }
