(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    console.log('QuestFitness script loaded');

    initGate();
    initRepCounter();
    initPaywall();
    initChips();
    initModalButtons();
    makeRoleButtonsKeyboardAccessible();
    // Generic delegated handler for elements with data-action (optional extension)
    document.body.addEventListener('click', (e) => {
      const a = e.target.closest('[data-action]');
      if (!a) return;
      const action = a.dataset.action;
      console.log('data-action:', action, a);
      // handle custom actions here if you add them to your HTML
    });
  });

  // ---------------- Gate (Get Started)
  function initGate() {
    const gate = document.getElementById('gateScreen');
    const startBtn = document.getElementById('gateStartBtn');
    if (!gate || !startBtn) return;
    startBtn.addEventListener('click', () => {
      gate.classList.add('hide');
      // optionally persist that user dismissed gate
      try { localStorage.setItem('qf_gate_seen', '1'); } catch (e) {}
    });

    // If gate already dismissed earlier, hide it
    try {
      if (localStorage.getItem('qf_gate_seen') === '1') gate.classList.add('hide');
    } catch (e) { /* ignore */ }
  }

  // ---------------- Rep counter
  function initRepCounter() {
    const repBtn = document.getElementById('repBtn');
    const repCountEl = document.getElementById('repCount');
    const repReset = document.getElementById('repReset');
    const repStreak = document.getElementById('repStreak');

    if (!repCountEl) return;

    let count = 0;
    try { count = Number(localStorage.getItem('qf_rep_count') || 0); } catch (e) { count = 0; }
    renderCount();

    if (repBtn) {
      repBtn.addEventListener('click', () => {
        count += 1;
        renderCount(true);
        try { localStorage.setItem('qf_rep_count', String(count)); } catch (e) {}
      });
    }

    if (repReset) {
      repReset.addEventListener('click', () => {
        count = 0;
        renderCount();
        try { localStorage.setItem('qf_rep_count', '0'); } catch (e) {}
      });
    }

    function renderCount(pulse) {
      repCountEl.textContent = String(count);
      if (pulse) {
        repCountEl.classList.add('pulse');
        setTimeout(() => repCountEl.classList.remove('pulse'), 140);
      }
      if (repStreak) {
        const text = count === 0 ? '' : `Streak: ${count}`;
        repStreak.textContent = text;
      }
    }
  }

  // ---------------- Paywall (show/hide/subscribe)
  function initPaywall() {
    const payback = document.getElementById('paywallBackdrop');
    const closeBtn = document.getElementById('paywallClose');
    const subscribeBtn = document.getElementById('paywallSubscribe');

    // any element with .paywall-trigger opens the paywall
    document.querySelectorAll('.paywall-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        if (payback) payback.classList.add('show');
      });
    });

    if (closeBtn && payback) {
      closeBtn.addEventListener('click', () => payback.classList.remove('show'));
    }

    if (subscribeBtn) {
      subscribeBtn.addEventListener('click', () => {
        subscribeBtn.classList.add('processing');
        // Demo behaviour: fake delay then close and show note
        setTimeout(() => {
          try {
            const note = document.getElementById('paywallNote');
            if (note) note.textContent = 'Thanks — demo subscription activated.';
            if (payback) payback.classList.remove('show');
          } finally {
            subscribeBtn.classList.remove('processing');
          }
        }, 900);
      });
    }

    // clicking backdrop should close if user clicks outside the card
    if (payback) {
      payback.addEventListener('click', (e) => {
        if (e.target === payback) payback.classList.remove('show');
      });
    }
  }

  // ---------------- Chips (filters)
  function initChips() {
    const filterRow = document.getElementById('filterRow');
    if (!filterRow) return;
    filterRow.addEventListener('click', (e) => {
      const btn = e.target.closest('.chip');
      if (!btn) return;
      // toggle active only on single select: remove others
      filterRow.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      // If you have real exercise items with data-muscle, implement filtering here.
      // Example (if ex cards have data-muscle):
      try {
        document.querySelectorAll('#exGrid .ex-card').forEach(card => {
          const muscle = card.dataset.muscle || 'all';
          if (!filter || filter === 'all' || filter.toLowerCase() === muscle.toLowerCase()) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      } catch (err) {
        // no-op
      }
    });
  }

  // ---------------- Modal buttons (basic timer modal controls)
  function initModalButtons() {
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalClose = document.getElementById('modalClose');
    const modalPause = document.getElementById('modalPause');

    // close/hide modal
    if (modalClose && modalBackdrop) {
      modalClose.addEventListener('click', () => modalBackdrop.classList.remove('show'));
    }

    if (modalPause) {
      modalPause.addEventListener('click', () => {
        // simple toggle text for demo
        const isPaused = modalPause.dataset.paused === '1';
        modalPause.dataset.paused = isPaused ? '0' : '1';
        modalPause.textContent = isPaused ? 'Pause' : 'Resume';
      });
    }

    // clicking backdrop hides modal
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) modalBackdrop.classList.remove('show');
      });
    }
  }

  // Make items with role="button" keyboard-accessible
  function makeRoleButtonsKeyboardAccessible() {
    document.querySelectorAll('[role="button"]').forEach(el => {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      el.addEventListener('keypress', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          el.click();
        }
      });
    });
  }

})();
