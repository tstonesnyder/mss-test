(function(){
  function ready(fn){
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  ready(() => {
    // These are the page sections:
    const routes = Array.from(document.querySelectorAll('.route'));
    // These are the navigation buttons in the header (to take you to those page sections):
    const tabs = Array.from(document.querySelectorAll('.tab'));

    function show(id){
      // Hide all but the specified section:
      routes.forEach(s => s.hidden = (s.id !== id));
      // Set attribute on the nav btn for the specified section:
      tabs.forEach(t => {
        const isCurrent = t.dataset.target === id;
        // t.setAttribute('aria-current', isCurrent ? 'page' : 'false');
        if (isCurrent) {
          t.setAttribute('aria-current', 'page');
        } else {
          t.removeAttribute('aria-current');
        }
      });
    }

    function normalizeHash(){
      const h = (location.hash || '#home').replace('#','').trim();
      return routes.some(s => s.id === h) ? h : 'home';
    }

    // CONTACT ME BUTTON:
    {
      const a = document.getElementById('contact-link');
      if (!a) return;
      let user = a.getAttribute('data-enc');
      user = `to:${user.replaceAll('obble-b', '').replaceAll('-', '')}`;
      // Remove the first subdomain only (www., test., etc.)
      let domain = location.hostname.split('.').slice(-2).join('.');
      a.setAttribute('href', `mail${user}@${domain}`);
    }

    // Add handler for each nav btn in header:
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.target;
        // Add this tab to history (so these nav btns in header work same as Quick Links):
        history.pushState(null, '', `#${id}`);
        show(id);
        // Ensure consistent positioning when switching "tabs"
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        // Move focus for accessibility
        const main = document.getElementById('main');
        if (main && main.focus) {
          // Keep the accessibility focus behavior without triggering scroll on pages longer than 1 screen in length
          try { main.focus({ preventScroll: true }); }
          catch { main.focus(); } // older browsers ignore preventScroll
        }
      });
    });

    window.addEventListener('hashchange', () => show(normalizeHash()));

    // Init
    show(normalizeHash());

    // SET INFO IN FOOTER:
    // Set the copyright year to CURRENT year:
    const y = document.getElementById('y');
    if (y) {
      y.textContent = String(new Date().getFullYear());
    }
    // Set the last updated date to the file's last saved date on the server (may not be correct, but better than manually setting a date).
    const d = document.getElementById('d');
    if (d) {
      const date = new Date(document.lastModified);
      d.textContent = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      });
    }
  });
})();
