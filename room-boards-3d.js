// Procedural boards: no external models; photos and popup copy share memories.js.
export function createRoomBoards(THREE, scene, boards) {
  const targets = [], views = new Map();
  const drawers = []; let openDrawer = -1;
  const placements = [
    { position: [-6, 3.1, -3.02], rotation: 0 },
    { position: [6, 3.1, -3.02], rotation: 0 },
    { position: [-8.5, 3.1, 3.5], rotation: Math.PI / 2 }
  ];
  const loader = new THREE.TextureLoader();
  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x494949, roughness: .85 });
  const paperMaterial = new THREE.MeshStandardMaterial({ color: 0xd0ccc6, roughness: 1 });
  const pinMaterial = new THREE.MeshStandardMaterial({ color: 0xababab, metalness: .6, roughness: .35 });
  const boardCanvas = document.createElement('canvas'); boardCanvas.width = boardCanvas.height = 256;
  const grain = boardCanvas.getContext('2d'); grain.fillStyle = '#30302e'; grain.fillRect(0, 0, 256, 256);
  // A deterministic fabric-like grain keeps the boards in the room's dark palette.
  for (let i = 0; i < 7000; i++) { grain.fillStyle = i % 2 ? '#3a3a37' : '#252524'; grain.fillRect((i * 73) % 256, (i * 151 + Math.floor(i / 256) * 13) % 256, 1, 2); }
  const grainTexture = new THREE.CanvasTexture(boardCanvas); grainTexture.wrapS = grainTexture.wrapT = THREE.RepeatWrapping; grainTexture.repeat.set(4, 3); grainTexture.colorSpace = THREE.SRGBColorSpace;
  const backing = new THREE.MeshStandardMaterial({ map: grainTexture, roughness: 1 });

  function meshBox(parent, width, height, depth, x, y, z, material) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  function textTexture(lines, background = '#d0ccc6', foreground = '#292929') {
    const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = lines.length > 1 ? 530 : 110;
    const ctx = canvas.getContext('2d'); ctx.fillStyle = background; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = foreground; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '34px monospace';
    lines.forEach((line, i) => ctx.fillText(line, 320, canvas.height * (i + 1) / (lines.length + 1), 600));
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
  }
  boards.forEach((board, boardIndex) => {
    const placement = placements[boardIndex]; if (!placement) return;
    const group = new THREE.Group(); group.position.fromArray(placement.position); group.rotation.y = placement.rotation; scene.add(group);
    if (board.kind === 'cabinet' || board.kind === 'tv') {
      buildObject(board, group, placement);
      return;
    }
    const rows = Math.max(1, Math.ceil(board.cards.length / 3));
    const height = Math.max(2.65, rows * 1.45 + .7);
    meshBox(group, 4.65, height, .12, 0, 0, 0, backing);
    for (const x of [-2.36, 2.36]) meshBox(group, .12, height + .2, .19, x, 0, .025, frameMaterial);
    for (const y of [-height / 2 - .04, height / 2 + .04]) meshBox(group, 4.84, .12, .19, 0, y, .025, frameMaterial);
    const label = new THREE.Mesh(new THREE.PlaneGeometry(2.6, .36), new THREE.MeshBasicMaterial({ map: textTexture([board.title.toUpperCase()], '#202020', '#cccccc') }));
    label.position.set(0, height / 2 - .26, .08); group.add(label);

    board.cards.forEach((card, index) => {
      const rowCount = Math.min(3, board.cards.length - Math.floor(index / 3) * 3);
      const x = ((index % 3) - (rowCount - 1) / 2) * 1.42;
      const y = height / 2 - 1.17 - Math.floor(index / 3) * 1.45;
      const photo = new THREE.Group(); photo.position.set(x, y, .12); photo.rotation.z = [ .065, -.055, .025 ][index % 3]; group.add(photo);
      const paper = meshBox(photo, 1.22, 1.32, .025, 0, 0, 0, paperMaterial);
      const initialTexture = textTexture([`PHOTO ${String(index + 1).padStart(2, '0')}`, 'PLACEHOLDER'], '#292929', '#aaaaaa');
      const pictureMaterial = new THREE.MeshBasicMaterial({ map: initialTexture });
      const picture = new THREE.Mesh(new THREE.PlaneGeometry(1.08, .9), pictureMaterial); picture.position.set(0, .12, .02); photo.add(picture);
      if (card.image) loader.load(card.image, texture => {
        texture.colorSpace = THREE.SRGBColorSpace;
        const aspect = texture.image.width / texture.image.height, targetAspect = 1.08 / .9;
        if (aspect > targetAspect) { texture.repeat.x = targetAspect / aspect; texture.offset.x = (1 - texture.repeat.x) / 2; }
        else { texture.repeat.y = aspect / targetAspect; texture.offset.y = (1 - texture.repeat.y) / 2; }
        pictureMaterial.map = texture; pictureMaterial.needsUpdate = true; initialTexture.dispose();
      }, undefined, () => { /* Keep the labeled card clickable when a photo is missing. */ });
      const caption = new THREE.Mesh(new THREE.PlaneGeometry(1.08, .22), new THREE.MeshBasicMaterial({ map: textTexture([card.title]) }));
      caption.position.set(0, -.48, .02); photo.add(caption);
      if (card.style === 'taped') {
        const tape = meshBox(photo, .53, .15, .013, 0, .63, .035, new THREE.MeshStandardMaterial({ color: 0xa4a39a, transparent: true, opacity: .8, roughness: 1 })); tape.rotation.z = -.14;
      } else {
        const pin = new THREE.Mesh(new THREE.SphereGeometry(.043, 12, 8), pinMaterial); pin.position.set(0, .59, .065); photo.add(pin);
      }
      for (const mesh of [paper, picture, caption]) { mesh.userData.memory = { boardId: board.id, index }; targets.push(mesh); }
    });
    const light = new THREE.SpotLight(0xffffff, 38, 12, .85, .65, 1.4);
    const normal = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), placement.rotation);
    const tangent = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), placement.rotation);
    light.position.copy(group.position).addScaledVector(normal, 2.2); light.position.y += 2.7;
    light.target.position.copy(group.position); scene.add(light, light.target);
    views.set(board.id, { center: group.position.clone(), normal, tangent, height });
  });
  // The third board hangs on the side wall, visibly turning the camera around the room.
  const wall = new THREE.Mesh(new THREE.BoxGeometry(.15, 10, 16), new THREE.MeshStandardMaterial({ color: 0x161616 }));
  wall.position.set(-8.65, 4, 3); scene.add(wall);
  function buildObject(board, group, placement) {
    const dark = new THREE.MeshStandardMaterial({color:0x161616,roughness:.7});
    function target(mesh, index) {mesh.userData.memory={boardId:board.id,index};targets.push(mesh);return mesh;}
    function label(text,w,h,x,y,z) {
      const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:textTexture([text],'#242424','#cccccc')}));
      mesh.position.set(x,y,z);group.add(mesh);return mesh;
    }
    if(board.kind==='cabinet') {
      group.position.y=1.9;
      meshBox(group,2.05,3.6,1.25,0,0,-.2,frameMaterial);
      meshBox(group,2.12,.12,1.32,0,1.85,-.2,frameMaterial);
      board.cards.forEach((card,index)=>{
        const drawer=new THREE.Group(); drawer.position.set(0,1.17-index*1.13,.48);group.add(drawer);drawers.push(drawer);
        const front=meshBox(drawer,1.87,1.04,.09,0,0,0,dark);target(front,index);
        target(meshBox(drawer,.6,.08,.12,0,-.16,.12,frameMaterial),index);
        const tag=new THREE.Mesh(new THREE.PlaneGeometry(1.35,.23),new THREE.MeshBasicMaterial({map:textTexture([card.title],'#b4b1aa','#222222')}));
        tag.position.set(0,.23,.06);drawer.add(tag);target(tag,index);
        meshBox(drawer,1.7,.04,.8,0,-.43,-.44,dark);
        for(let i=0;i<4;i++)meshBox(drawer,1.55,.63,.035,0,-.1,-.16-i*.13,paperMaterial);
      });
      label('CERTIFICATES / ARCHIVE',2,.22,0,2.15,.45);
      window.addEventListener('room-item-selected',e=>{openDrawer=e.detail.id===board.id?e.detail.index:-1;});
      window.addEventListener('room-item-closed',()=>openDrawer=-1);
      window.addEventListener('room-corner-change',()=>openDrawer=-1);
    }else{
      group.position.y=2.55;
      meshBox(group,4.2,2.7,1.25,0,0,0,frameMaterial);
      meshBox(group,3.43,2.25,.06,-.23,.06,.65,dark);
      meshBox(group,4.6,.15,1.8,0,-1.65,0,dark);
      for(const x of [-1.8,1.8])meshBox(group,.16,.8,.16,x,-2.1,.4,frameMaterial);
      for(let i=0;i<10;i++)meshBox(group,.35,.025,.03,1.72,-.5+i*.08,.65,dark);
      const screenCanvas=document.createElement('canvas');screenCanvas.width=960;screenCanvas.height=640;
      const ctx=screenCanvas.getContext('2d');const texture=new THREE.CanvasTexture(screenCanvas);texture.colorSpace=THREE.SRGBColorSpace;
      const screen=new THREE.Mesh(new THREE.PlaneGeometry(3.23,2.04),new THREE.MeshBasicMaterial({map:texture}));
      screen.position.set(-.23,.06,.69);group.add(screen);target(screen,0);
      let selected=0,request=0;
      function tune(index) {
        selected=index;screen.userData.memory.index=index;
        const card=board.cards[index];if(!card)return;const version=++request;
        function paint(img) {
          ctx.fillStyle='#080808';ctx.fillRect(0,0,960,640);
          if(img){const scale=Math.min(900/img.width,470/img.height);ctx.drawImage(img,(960-img.width*scale)/2,62+(470-img.height*scale)/2,img.width*scale,img.height*scale);}
          ctx.fillStyle='#e0e0e0';ctx.font='24px monospace';ctx.fillText(`CH ${String(index+1).padStart(2,'0')} / PROJECT CHANNEL`,30,40);
          ctx.font='30px monospace';ctx.fillText(card.title,30,575,880);ctx.font='17px monospace';ctx.fillStyle='#aaaaaa';ctx.fillText('CLICK SCREEN FOR DETAILS & LINKS',30,612);
          for(let y=0;y<640;y+=4){ctx.fillStyle='#00000020';ctx.fillRect(0,y,960,1);}texture.needsUpdate=true;
        }
        paint();if(card.image){const image=new Image();image.onload=()=>{if(version===request)paint(image);};image.src=card.image;}
      }
      board.cards.forEach((card,index)=>{
        const knob=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.09,20),pinMaterial);knob.rotation.x=Math.PI/2;knob.position.set(1.72,.96-index*.3,.7);group.add(knob);target(knob,index);
      });
      label('PROJECT TV',2,.22,-.2,1.65,.6);tune(0);
      window.addEventListener('room-item-selected',e=>{if(e.detail.id===board.id)tune(e.detail.index);});
    }
    const normal=new THREE.Vector3(0,0,1).applyAxisAngle(new THREE.Vector3(0,1,0),placement.rotation);
    const tangent=new THREE.Vector3(1,0,0).applyAxisAngle(new THREE.Vector3(0,1,0),placement.rotation);
    const light=new THREE.SpotLight(0xffffff,48,14,.85,.65,1.4);light.position.copy(group.position).addScaledVector(normal,3);light.position.y+=3;
    light.target.position.copy(group.position);scene.add(light,light.target);
    views.set(board.id,{center:group.position.clone(),normal,tangent,height:4.3});
  }
  return { targets, views, update(dt, reduced) { drawers.forEach((drawer,index)=>{const z=index===openDrawer?1.05:.48;drawer.position.z=THREE.MathUtils.lerp(drawer.position.z,z,reduced?1:1-Math.exp(-dt*9));}); } };
}
