(() => {
  const boards = window.portfolioBoards;
  const room = document.querySelector('#room');
  const panel = document.querySelector('#board-panel');
  const links = document.querySelector('#board-photo-links');
  const dialog = document.querySelector('#memory-dialog');
  const image = document.querySelector('#memory-image');
  const placeholder = document.querySelector('#memory-placeholder');
  let corner = 'desk', currentBoard, currentIndex = 0, returnFocus;

  function selectCorner(id) {
    if (room.classList.contains('entering') || dialog.open) return;
    const board = boards.find(item => item.id === id);
    if (id !== 'desk' && !board) return;
    corner = id; room.dataset.currentCorner = id;
    document.querySelectorAll('[data-corner]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.corner === id)));
    panel.hidden = !board;
    room.classList.toggle('viewing-board', Boolean(board));
    if (board) {
      links.setAttribute('aria-label', board.kind === 'cabinet' ? 'Certificate drawers' : board.kind === 'tv' ? 'Project channels' : 'Bulletin board photos');
      document.querySelector('#board-kicker').textContent = board.kicker;
      document.querySelector('#board-heading').textContent = board.title;
      document.querySelector('#board-intro').textContent = board.intro;
      links.replaceChildren();
      board.cards.forEach((card, index) => {
        const button = document.createElement('button');
        button.className = 'board-photo-link ' + (card.style === 'taped' ? 'taped' : 'pinned');
        const preview = document.createElement('span'); preview.className = 'photo-preview';
        if (card.image) {
          const thumbnail = document.createElement('img'); thumbnail.src = card.image; thumbnail.alt = ''; thumbnail.loading = 'lazy';
          thumbnail.onerror = () => { preview.textContent = 'PHOTO UNAVAILABLE'; };
          preview.append(thumbnail);
        } else preview.textContent = board.kind === 'cabinet' ? `FILE ${index + 1}` : `PHOTO ${String(index + 1).padStart(2, '0')} / PLACEHOLDER`;
        const title = document.createElement('span'); title.textContent = (board.kind === 'tv' ? `CH ${index + 1} / ` : '') + card.title;
        button.append(preview, title);
        button.onclick = () => openMemory(id, index, button);
        links.append(button);
      });
    }
    window.dispatchEvent(new CustomEvent('room-corner-change', { detail: id }));
  }

  function renderMemory() {
    const card = currentBoard.cards[currentIndex];
    document.querySelector('#memory-category').textContent = card.category || currentBoard.title;
    document.querySelector('#memory-title').textContent = card.title;
    document.querySelector('#memory-meta').textContent = [card.date, card.location, card.role].filter(Boolean).join(' · ');
    document.querySelector('#memory-description').textContent = card.description;
    image.hidden = !card.image; placeholder.hidden = Boolean(card.image);
    placeholder.textContent = currentBoard.kind === 'cabinet' ? 'CERTIFICATE PLACEHOLDER' : 'YOUR PHOTO HERE';
    image.alt = card.alt || card.title;
    image.onerror = () => { image.hidden = true; placeholder.hidden = false; placeholder.textContent = 'PHOTO UNAVAILABLE'; };
    if (card.image) image.src = card.image; else image.removeAttribute('src');
    const link = document.querySelector('#memory-link');
    link.hidden = true; link.removeAttribute('href');
    link.textContent = card.linkLabel || 'More about this ↗';
    const extras = document.querySelector('#memory-extra-links'); extras.replaceChildren();
    for (const [label, path] of [['Project details', card.detailUrl], ['Open project', card.demoUrl]]) {
      if (!path) continue;
      try {
        const url = new URL(path, location.href);
        if (!['http:', 'https:'].includes(url.protocol)) continue;
        const anchor = document.createElement('a'); anchor.className = 'retro-button'; anchor.textContent = label + ' ↗';
        anchor.href = url.href; anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; extras.append(anchor);
      } catch { /* Ignore malformed optional links. */ }
    }
    if (card.url) {
      try { const url = new URL(card.url, location.href); if (['http:', 'https:'].includes(url.protocol)) { link.href = url.href; link.hidden = false; } } catch { /* A missing or invalid optional link stays hidden. */ }
    }
    document.querySelector('#memory-count').textContent = `${currentIndex + 1} / ${currentBoard.cards.length}`;
    window.dispatchEvent(new CustomEvent('room-item-selected', {detail: {id: currentBoard.id, index: currentIndex}}));
  }

  function openMemory(boardId, index, trigger) {
    const board = boards.find(item => item.id === boardId);
    if (!board?.cards[index]) return;
    currentBoard = board; currentIndex = index;
    returnFocus = trigger || (!document.querySelector('#desktop').hidden ? document.activeElement : document.querySelector(`[data-corner="${boardId}"]`));
    renderMemory(); if (!dialog.open) dialog.showModal();
    document.querySelector('#memory-close').focus();
  }
  document.querySelector('#memory-close').onclick = () => dialog.close();
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { returnFocus?.focus(); window.dispatchEvent(new Event('room-item-closed')); });
  function step(direction) { currentIndex = (currentIndex + direction + currentBoard.cards.length) % currentBoard.cards.length; renderMemory(); }
  document.querySelector('#memory-prev').onclick = () => step(-1);
  document.querySelector('#memory-next').onclick = () => step(1);
  dialog.addEventListener('keydown', event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); event.stopPropagation(); step(event.key === 'ArrowLeft' ? -1 : 1); } });
  document.querySelectorAll('[data-corner]').forEach(button => button.onclick = () => selectCorner(button.dataset.corner));
  document.addEventListener('keydown', event => {
    if (room.hidden || dialog.open || event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input,textarea,select')) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const ids = ['desk', ...boards.map(board => board.id)];
    selectCorner(ids[(ids.indexOf(corner) + (event.key === 'ArrowRight' ? 1 : -1) + ids.length) % ids.length]);
    document.querySelector(`[data-corner="${corner}"]`).focus();
  });
  window.addEventListener('desktop-leave', () => selectCorner('desk'));
  window.roomBoards = { openMemory, selectCorner, get corner() { return corner; } };
})();
