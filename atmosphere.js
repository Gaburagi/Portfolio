(() => {
  let enabled = false, context, lastTone = -1;
  const buttons = [];
  function update() { buttons.forEach(button => { button.textContent = enabled ? 'Sound: on' : 'Sound: off'; button.setAttribute('aria-pressed', String(enabled)); }); }
  async function play(kind = 'click') {
    if (!enabled || document.hidden) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) { enabled = false; update(); return; }
      context ||= new Audio();
      if (context.state === 'suspended') await context.resume();
      if (!enabled) return;
      const now = context.currentTime;
      if (now - lastTone < .07) return;
      lastTone = now;
      const notes = kind === 'enter' ? [330, 495] : kind === 'corner' ? [220] : [440];
      notes.forEach((frequency, index) => {
        const oscillator = context.createOscillator(), gain = context.createGain();
        const start = now + index * .09;
        oscillator.type = 'sine'; oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(.025, start + .008);
        gain.gain.exponentialRampToValueAtTime(.0001, start + .11);
        oscillator.connect(gain); gain.connect(context.destination);
        oscillator.start(start); oscillator.stop(start + .12);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      });
    } catch { enabled = false; update(); }
  }
  for (const selector of ['.room-number', '.desktop-top', '.phone-dock']) {
    const parent = document.querySelector(selector); if (!parent) continue;
    const button = document.createElement('button'); button.className = 'sound-toggle'; button.setAttribute('aria-label', 'Enable interface sounds');
    button.onclick = async () => { enabled = !enabled; buttons.forEach(item=>item.setAttribute('aria-label',enabled?'Mute interface sounds':'Enable interface sounds')); update(); if (enabled) await play('enter'); else await context?.suspend(); };
    parent.append(button); buttons.push(button);
  }
  update();
  document.addEventListener('click', event => { if (event.target.closest('button,a') && !event.target.closest('.sound-toggle')) play(); });
  window.addEventListener('room-corner-change', () => play('corner'));
  window.addEventListener('room-item-selected', () => play());
  window.addEventListener('desktop-enter', () => play('enter'));
  document.addEventListener('visibilitychange', () => { if (document.hidden) context?.suspend().catch(()=>{}); });
})();
