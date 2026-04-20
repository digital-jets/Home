/* =============================================
   Job Expo '36 (JETS) — Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  // --------------------------------------------------
  // 1. Responsive Navigation (hamburger toggle)
  // --------------------------------------------------
  const hamburger = document.querySelector('.navbar__hamburger');
  const navMenu   = document.querySelector('.navbar__nav');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', hamburger.classList.contains('open'));
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }

  // --------------------------------------------------
  // 2. Active Nav Link (current page highlight)
  // --------------------------------------------------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__nav a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --------------------------------------------------
  // 3. Tab Switching (Schedule page)
  // --------------------------------------------------
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (tabBtns.length > 0) {
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = btn.getAttribute('data-tab');
        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        tabPanels.forEach(function (p) { p.classList.remove('active'); });
        btn.classList.add('active');
        const panel = document.getElementById(target);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // --------------------------------------------------
  // 4. Zone Accordions (Exhibition page)
  // --------------------------------------------------
  const accordionTriggers = document.querySelectorAll('.zone-accordion__trigger');

  if (accordionTriggers.length > 0) {
    // Initialise all bodies to 0 height
    accordionTriggers.forEach(function (trigger) {
      const targetId = trigger.getAttribute('data-target');
      const body = document.getElementById(targetId);
      if (body) {
        body.style.maxHeight = '0px';
        body.style.overflow  = 'hidden';
      }
    });

    accordionTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        const targetId = trigger.getAttribute('data-target');
        const body     = document.getElementById(targetId);
        const isOpen   = trigger.classList.contains('open');

        // Close all
        accordionTriggers.forEach(function (t) {
          t.classList.remove('open');
          const b = document.getElementById(t.getAttribute('data-target'));
          if (b) b.style.maxHeight = '0px';
        });

        // Open the clicked one if it was closed
        if (!isOpen && body) {
          trigger.classList.add('open');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });

    // Open the first accordion by default (saves visitors an extra tap)
    if (accordionTriggers[0]) {
      accordionTriggers[0].click();
    }
  }

  // --------------------------------------------------
  // 5. Job Role Filtering & Search
  // --------------------------------------------------
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const roleCards   = document.querySelectorAll('.role-card');
  const searchInput = document.querySelector('.search-bar input');
  const noResults   = document.querySelector('.no-results');

  function applyFilters() {
    const activeFilter = document.querySelector('.filter-btn.active');
    const zone  = activeFilter ? activeFilter.getAttribute('data-zone') : 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let visible = 0;

    roleCards.forEach(function (card) {
      const cardZone  = card.getAttribute('data-zone');
      const cardTitle = (card.querySelector('.role-card__title') || {}).textContent || '';
      const cardDesc  = (card.querySelector('.role-card__desc')  || {}).textContent || '';
      const match =
        (zone === 'all' || (cardZone && cardZone.split(' ').includes(zone))) &&
        (!query || cardTitle.toLowerCase().includes(query) || cardDesc.toLowerCase().includes(query));

      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    if (noResults) noResults.classList.toggle('visible', visible === 0);
  }

  if (filterBtns.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        applyFilters();
      });
    });
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);

  // --------------------------------------------------
  // 6. Job Role Modal
  // --------------------------------------------------
  const modalOverlay = document.getElementById('roleModal');
  const modalClose   = modalOverlay && modalOverlay.querySelector('.modal__close');

  if (modalOverlay) {
    roleCards.forEach(function (card) {
      card.addEventListener('click', function () {
        const title      = (card.querySelector('.role-card__title') || {}).textContent || '';
        const desc       = card.getAttribute('data-fulldesc') ||
                           (card.querySelector('.role-card__desc') || {}).textContent || '';
        const icon       = (card.querySelector('.role-card__icon') || {}).textContent || '';
        const jr         = card.getAttribute('data-jr')          || '—';
        const originator = card.getAttribute('data-originator')  || '—';
        const setting    = card.getAttribute('data-setting')     || '—';
        const zones      = (card.getAttribute('data-zone') || '').split(' ').map(function (z) {
          if (z === 'neighbourhood') return 'Community';
          return z.charAt(0).toUpperCase() + z.slice(1);
        }).join(' / ');
        const quali    = card.getAttribute('data-qualification') || '—';
        const contract = card.getAttribute('data-contract')      || '—';

        const set = function (id, val) {
          const el = document.getElementById(id);
          if (el) el.textContent = val;
        };

        set('modalTitle',      icon + ' ' + title);
        set('modalDesc',       desc);
        set('modalJr',         jr);
        set('modalOriginator', originator);
        set('modalZone',       zones);
        set('modalSalary',     setting);
        set('modalQuali',      quali);
        set('modalContract',   contract);

        modalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeModal() {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function (e) { if (e.target === modalOverlay) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
  }

  // --------------------------------------------------
  // 7. Smooth scroll for anchor links
  // --------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        // If there's an accordion, open it first
        const accordion = target.closest ? target.closest('.zone-accordion') : null;
        if (accordion) {
          const trigger = accordion.querySelector('.zone-accordion__trigger');
          const body    = document.getElementById(trigger && trigger.getAttribute('data-target'));
          if (trigger && body && !trigger.classList.contains('open')) {
            trigger.classList.add('open');
            body.style.maxHeight = body.scrollHeight + 'px';
          }
        }
        setTimeout(function () {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    });
  });

  // --------------------------------------------------
  // 8. What's On — category + day tab switching (schedule page)
  //    Day selection is SHARED across all category tabs so the
  //    chosen date persists when the user switches categories.
  // --------------------------------------------------
  var woTabs = document.querySelectorAll('.wo-tab');

  if (woTabs.length > 0) {
    // Shared day index: 0 = Thu 2 Jul, 1 = Fri 3 Jul, 2 = Sat 4 Jul
    var activeDayIndex = 0;

    // Read initial day from the visible section's HTML state
    (function initDay() {
      var visibleSection = document.querySelector('.wo-section:not([hidden])');
      if (!visibleSection) return;
      var group = visibleSection.id.replace('wo-', '');
      document.querySelectorAll('.day-tab[data-group="' + group + '"]').forEach(function (b, i) {
        if (b.classList.contains('active')) activeDayIndex = i;
      });
    }());

    // Apply a day index to a specific category section
    function syncDay(group, dayIdx) {
      var dayBtns = document.querySelectorAll('.day-tab[data-group="' + group + '"]');
      var section  = document.getElementById('wo-' + group);
      if (!section) return;
      var panels = section.querySelectorAll('.tl-section');
      dayBtns.forEach(function (b, i) { b.classList.toggle('active', i === dayIdx); });
      panels.forEach(function (p, i)  { p.classList.toggle('active', i === dayIdx); });
    }

    // Category tab click — switch section and re-apply shared day
    woTabs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-wo');
        woTabs.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.wo-section').forEach(function (s) { s.hidden = true; });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        var section = document.getElementById('wo-' + target);
        if (section) { section.hidden = false; syncDay(target, activeDayIndex); }
      });
    });

    // Day tab click — update shared index and sync within section
    document.querySelectorAll('.day-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var group   = btn.getAttribute('data-group');
        var dayBtns = document.querySelectorAll('.day-tab[data-group="' + group + '"]');
        dayBtns.forEach(function (b, i) { if (b === btn) activeDayIndex = i; });
        syncDay(group, activeDayIndex);
      });
    });
  }

  // --------------------------------------------------
  // 9. Countdown timer (homepage only)
  //    Targets 2 July 2026 00:00:00 Singapore Time (UTC+8)
  // --------------------------------------------------
  var cdEl = document.getElementById('countdown');
  if (cdEl) {
    var cdTarget = new Date('2026-07-02T00:00:00+08:00').getTime();

    function updateCountdown() {
      var diff = cdTarget - Date.now();
      if (diff <= 0) {
        cdEl.remove();
        return;
      }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var pad = function (n) { return String(n).padStart(2, '0'); };
      var setVal = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = pad(v); };
      setVal('cd-days', d);
      setVal('cd-hours', h);
      setVal('cd-mins', m);
    }

    updateCountdown();
    setInterval(updateCountdown, 30000);
  }

});
