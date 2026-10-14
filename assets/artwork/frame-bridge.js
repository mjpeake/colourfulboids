/* Display-only adapter. Imported artwork bundles remain unchanged. */
(function () {
  const params = new URLSearchParams(location.hash.slice(1));
  const token = params.get('displayToken');
  const nativeRequest = window.requestAnimationFrame.bind(window);
  const nativeCancel = window.cancelAnimationFrame.bind(window);
  const pending = new Map(); let nextId = 0, requestedPause = params.get('paused') === '1';
  // Two startup frames form the renderer's first visible trail, then stay still.
  let initialFrames = 2;
  let paused = requestedPause || document.hidden;
  function send(type) { parent.postMessage({ channel: 'project-display', token, type }, '*'); }
  function schedule(entry) {
    entry.nativeId = nativeRequest(time => {
      entry.nativeId = null;
      if (paused && !entry.firstFrame) return;
      // p5 can skip a callback that arrives before its first frame interval.
      // Wait two display intervals, then allow one painted still before gating.
      if (paused && entry.firstFrame && performance.now() - entry.createdAt < 32) { schedule(entry); return; }
      pending.delete(entry.id); entry.callback(time);
    });
  }
  window.requestAnimationFrame = callback => {
    const entry = { id: ++nextId, callback, nativeId: null, firstFrame: initialFrames-- > 0, createdAt: performance.now() }; pending.set(entry.id, entry);
    if (!paused || entry.firstFrame) schedule(entry); return entry.id;
  };
  window.cancelAnimationFrame = id => {
    const entry = pending.get(id);
    if (entry && entry.nativeId !== null) nativeCancel(entry.nativeId);
    pending.delete(id);
  };
  function updatePause() {
    paused = requestedPause || document.hidden;
    for (const entry of pending.values()) {
      if (paused && !entry.firstFrame && entry.nativeId !== null) { nativeCancel(entry.nativeId); entry.nativeId = null; }
      else if ((!paused || entry.firstFrame) && entry.nativeId === null) schedule(entry);
    }
  }
  window.addEventListener('message', event => {
    if (event.source !== parent || !event.data || event.data.channel !== 'project-display' || event.data.token !== token) return;
    if (event.data.type === 'pause') requestedPause = true;
    else if (event.data.type === 'resume') requestedPause = false;
    else return;
    updatePause();
  });
  document.addEventListener('visibilitychange', updatePause);
  window.addEventListener('resize', () => {
    if (!paused) return;
    // The native debounced resize clears the canvas. Repaint one still after it.
    const entry = pending.values().next().value;
    if (!entry) return;
    initialFrames = 1;
    entry.firstFrame = true; entry.createdAt = performance.now() + 120;
    if (entry.nativeId === null) schedule(entry);
  });
  window.addEventListener('error', () => send('error'));
  window.addEventListener('load', () => queueMicrotask(() => send('ready')));
})();
