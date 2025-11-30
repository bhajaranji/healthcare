// DOM helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

const hamburger = $('#hamburger');
const mobileMenu = $('#mobile-menu');
const mobileClose = $('#mobile-close');
const mobileSubToggles = $$('.mobile-sub-toggle');
const dropdownLinks = $$('.dropdown-link');
const yearEl = document.getElementById('year');

/* Helper - safe addEventListener */
const safe = (el, ev, fn) => { if (el) el.addEventListener(ev, fn); };

// Open/close mobile modal
function openMobileMenu(){
  if (!mobileMenu) return;
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden','false');
  // hide the header hamburger (so close button is primary)
  if (hamburger) hamburger.classList.add('hidden');
  if (hamburger) hamburger.setAttribute('aria-expanded','true');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu(){
  if (!mobileMenu) return;
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden','true');
  // show the header hamburger back
  if (hamburger) hamburger.classList.remove('hidden');
  if (hamburger) hamburger.setAttribute('aria-expanded','false');
  document.body.style.overflow = '';
}

// Toggle via hamburger in header
safe(hamburger, 'click', () => {
  if (!mobileMenu) return;
  if (mobileMenu.classList.contains('open')) closeMobileMenu();
  else openMobileMenu();
});

// Close button inside modal
safe(mobileClose, 'click', () => {
  closeMobileMenu();
});

// Close when clicking exact modal background (not inner content)
if (mobileMenu) {
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMobileMenu();
  });
}

// mobile submenu toggles (Pages)
mobileSubToggles.forEach(btn => {
  btn.addEventListener('click', () => {
    const parent = btn.closest('.mobile-with-sub');
    if (!parent) return;
    parent.classList.toggle('open');
  });
});

// dropdown links: allow click toggle for touch devices, keep hover for desktop
dropdownLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const parent = link.closest('.dropdown');
    const menu = parent && parent.querySelector('.dropdown-menu');
    if (!menu) return;
    const open = link.getAttribute('aria-expanded') === 'true';
    // close others
    dropdownLinks.forEach(l => {
      if (l !== link) {
        l.setAttribute('aria-expanded','false');
        const m = l.closest('.dropdown')?.querySelector('.dropdown-menu');
        if (m) { m.style.opacity=''; m.style.visibility=''; m.style.transform=''; }
      }
    });
    if (open){
      link.setAttribute('aria-expanded','false');
      menu.style.opacity=''; menu.style.visibility=''; menu.style.transform='';
    } else {
      link.setAttribute('aria-expanded','true');
      menu.style.opacity='1'; menu.style.visibility='visible'; menu.style.transform='translateY(0)';
    }
  });
});

// close dropdowns when click outside
document.addEventListener('click', (e) => {
  const inside = !!e.target.closest('.dropdown');
  if (!inside){
    dropdownLinks.forEach(l => {
      l.setAttribute('aria-expanded','false');
      const m = l.closest('.dropdown')?.querySelector('.dropdown-menu');
      if (m) { m.style.opacity=''; m.style.visibility=''; m.style.transform=''; }
    });
  }
});

// ESC to close modal + dropdowns
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape'){
    if (mobileMenu && mobileMenu.classList.contains('open')) closeMobileMenu();
    dropdownLinks.forEach(l => {
      l.setAttribute('aria-expanded','false');
      const m = l.closest('.dropdown')?.querySelector('.dropdown-menu');
      if (m) { m.style.opacity=''; m.style.visibility=''; m.style.transform=''; }
    });
  }
});

// footer year
if (yearEl) yearEl.textContent = new Date().getFullYear();



// Footer Newsletter Validation + Redirect
const emailInput = document.getElementById("hc-email");
const sendBtn = document.querySelector(".hc-send");
const newsletterError = document.getElementById("newsletterError");

sendBtn.addEventListener("click", function () {
  const email = emailInput.value.trim();

  // If email is empty
  if (email === "") {
    newsletterError.style.display = "block";
    newsletterError.textContent = "Fill the credentials";
    return;
  }

  // Optionally: check if email format is valid
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    newsletterError.style.display = "block";
    newsletterError.textContent = "Enter a valid email";
    return;
  }

  // If everything is correct → hide error + redirect
  newsletterError.style.display = "none";
  window.location.href = "404page.html";
});





/* HERO — counters + booking drawer logic */

// animate counters
function animateNumber(el, target, isFloat=false, duration=1200) {
  const start = 0;
  const startTime = performance.now();
  const step = (now)=>{
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const val = start + (target - start) * progress;
    el.textContent = isFloat ? val.toFixed(1) : Math.floor(val);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isFloat ? target.toFixed(1) : target;
  };
  requestAnimationFrame(step);
}

// when hero in view, trigger counters once
let heroCounted = false;
const heroEl = document.getElementById('hero');
if (heroEl) {
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting && !heroCounted) {
        heroCounted = true;
        document.querySelectorAll('.trust-number').forEach(el=>{
          const t = parseFloat(el.getAttribute('data-target')) || 0;
          const isFloat = t % 1 !== 0;
          animateNumber(el, t, isFloat, 1000 + Math.random()*600);
        });
      }
    });
  }, { threshold: 0.3 });
  io.observe(heroEl);
}

// booking drawer open/close
const bookNowBtn = document.getElementById('bookNow');
const bookingDrawer = document.getElementById('bookingDrawer');
const drawerClose = document.getElementById('drawerClose');
const drawerCancel = document.getElementById('drawerCancel');
const quickBookForm = document.getElementById('quickBookForm');
const bookingSuccess = document.getElementById('bookingSuccess');

function openDrawer(){
  if (!bookingDrawer) return;
  bookingDrawer.classList.add('open');
  bookingDrawer.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeDrawer(){
  if (!bookingDrawer) return;
  bookingDrawer.classList.remove('open');
  bookingDrawer.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

// wire buttons
if (bookNowBtn) bookNowBtn.addEventListener('click', (e)=>{ e.preventDefault(); openDrawer(); });
if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
if (drawerCancel) drawerCancel.addEventListener('click', closeDrawer);

// form submit (mock)
if (quickBookForm) {
  quickBookForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    quickBookForm.style.display = 'none';
    bookingSuccess.hidden = false;
   bookingSuccess.querySelector('button#doneBtn')?.addEventListener('click', ()=>{
  window.location.href = "404page.html";  // <-- replace with your page


      closeDrawer();
    });
  });
}





/* Simple count-up when the stats section scrolls into view.
   Works without libraries and respects reduced-motion preference. */

(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const statsSection = document.querySelector('.stats-section');
  if (!statsSection) return;

  const statEls = statsSection.querySelectorAll('.stat-value');
  const fills = statsSection.querySelectorAll('.stat-fill');

  let started = false;

  function animateNumbers() {
    statEls.forEach((el, idx) => {
      const target = Number(el.getAttribute('data-target')) || 0;
      if (prefersReduced) {
        el.textContent = target.toLocaleString();
      } else {
        const duration = 1400; // ms
        const start = performance.now();
        const startVal = 0;
        function step(now) {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
          const current = Math.floor(startVal + (target - startVal) * eased);
          el.textContent = (current).toLocaleString();
          if (t < 1) requestAnimationFrame(step);
          else el.textContent = target.toLocaleString();
        }
        requestAnimationFrame(step);
      }

      // animate bar fill width (already set in HTML inline style as percentage)
      const fill = fills[idx];
      if (fill) {
        // read inline width if present, else default to 80%
        const inline = fill.getAttribute('style');
        const m = inline && inline.match(/width\s*:\s*(\d+)%/i);
        const width = m ? m[1] + '%' : '80%';
        // apply with a short timeout so CSS transition runs
        setTimeout(() => fill.style.width = width, 120);
      }
    });
  }

  // Intersection observer for entering viewport
  if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true; animateNumbers(); obs.disconnect();
        }
      });
    }, { threshold: 0.35 });
    io.observe(statsSection);
  } else {
    // fallback: trigger immediately
    animateNumbers();
  }
})();




(function(){
  const searchInput = document.getElementById('blog-search');
  const clearBtn = document.getElementById('search-clear');
  const filters = document.querySelectorAll('.blog-controls .filter');
  const postGrid = document.getElementById('posts-grid');
  const posts = Array.from(postGrid.querySelectorAll('.post-card'));
  const pageInfo = document.querySelector('.page-info');
  const prevBtn = document.querySelector('.page-btn.prev');
  const nextBtn = document.querySelector('.page-btn.next');

  // simple pagination settings
  const perPage = 6; // change if you want fewer visible
  let currentPage = 1;
  let filteredPosts = posts.slice();

  function renderPage() {
    // hide all
    posts.forEach(p => p.style.display = 'none');

    const start = (currentPage - 1) * perPage;
    const pageItems = filteredPosts.slice(start, start + perPage);

    pageItems.forEach(p => p.style.display = '');
    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / perPage));
    pageInfo.textContent = currentPage + ' / ' + totalPages;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
  }

  function applyFilter() {
    const q = (searchInput.value || '').trim().toLowerCase();
    const activeCat = document.querySelector('.filter.active')?.getAttribute('data-filter') || 'all';

    filteredPosts = posts.filter(p => {
      const cat = p.getAttribute('data-category') || '';
      const title = (p.querySelector('h3')?.innerText || '').toLowerCase();
      const excerpt = (p.querySelector('.excerpt')?.innerText || '').toLowerCase();
      const matchesQuery = !q || title.includes(q) || excerpt.includes(q);
      const matchesCat = (activeCat === 'all') || (cat === activeCat);
      return matchesQuery && matchesCat;
    });

    currentPage = 1;
    renderPage();
  }

  // events
  searchInput.addEventListener('input', () => { applyFilter(); });
  clearBtn.addEventListener('click', () => { searchInput.value=''; applyFilter(); searchInput.focus(); });

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('active'); btn.setAttribute('aria-pressed','true');
      applyFilter();
    });
  });

  prevBtn.addEventListener('click', () => { if(currentPage>1){ currentPage--; renderPage(); } });
  nextBtn.addEventListener('click', () => {
    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / perPage));
    if(currentPage < totalPages){ currentPage++; renderPage(); }
  });

  // init
  applyFilter();

 // newsletter demo submit
const nl = document.getElementById('newsletter-form');
if (nl) nl.addEventListener('submit', (e) => {
  e.preventDefault(); // stop form from reloading

  const email = document.getElementById('nl-email').value;

  if (email) {
    // optional popup
    alert('Thanks — subscribed: ' + email);

    // Redirect to 404 page
    window.location.href = "404page.html";
  }


  });
})();




document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;

    // Close all others
    document.querySelectorAll('.faq-item').forEach(faq => {
      if (faq !== item) faq.classList.remove('active');
    });

    // Toggle current
    item.classList.toggle('active');
  });
});


