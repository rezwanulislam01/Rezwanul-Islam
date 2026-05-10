/* ===================================================
   CUSTOM CURSOR
=================================================== */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function animateCursor() {
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

/* ===================================================
   NAVBAR SCROLL
=================================================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ===================================================
   HAMBURGER MOBILE MENU
=================================================== */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ===================================================
   SCROLL REVEAL
=================================================== */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .skill-card, .project-card').forEach(el => revealObs.observe(el));

// Stagger cards
document.querySelectorAll('.skill-card').forEach((c, i)   => c.style.transitionDelay = (i * 70)  + 'ms');
document.querySelectorAll('.project-card').forEach((c, i) => c.style.transitionDelay = (i * 110) + 'ms');

/* ===================================================
   CONTACT FORM → YOUR Google Sheet
   ─────────────────────────────────────────────────
   Sheet ID: 1aEfIm4HCtHhpYAm_Qo6CdUwita0raFhTQmvWsZ_fyhs
   Sheet URL: https://docs.google.com/spreadsheets/d/
              1aEfIm4HCtHhpYAm_Qo6CdUwita0raFhTQmvWsZ_fyhs/

   HOW TO CONNECT (one time, 3 minutes):
   ─────────────────────────────────────────────────
   1. Open your sheet (link above)
   2. Click  Extensions → Apps Script
   3. Delete everything → paste the code from setup-sheet.gs
   4. Ctrl+S → Deploy → New deployment
      · Type:            Web app
      · Execute as:      Me
      · Who has access:  Anyone
      → Deploy → Authorize → Allow → COPY the URL
   5. Replace PASTE_YOUR_APPS_SCRIPT_URL_HERE below
      with the URL you just copied
   ─────────────────────────────────────────────────
=================================================== */

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwJae3SYQKlpmlY4mRi1Kd1Pkq_x1koaCOmapD0Lj6VU6Up-hgfvK2RV9MOuPUAGBUZ1w/exec';

const contactForm = document.getElementById('contactForm');
const formMsg     = document.getElementById('formMsg');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = document.getElementById('submitBtn');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  formMsg.textContent = '';
  formMsg.className = 'form-msg';

  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const subject = document.getElementById('fsubject').value.trim();
  const message = document.getElementById('fmessage').value.trim();

  if (!name) {
    formMsg.innerHTML = '⚠️ Please enter your name.';
    formMsg.className = 'form-msg error';
    btn.innerHTML = 'Send Message 🌿';
    btn.disabled = false;
    return;
  }
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    formMsg.innerHTML = '⚠️ Please enter a valid email.';
    formMsg.className = 'form-msg error';
    btn.innerHTML = 'Send Message 🌿';
    btn.disabled = false;
    return;
  }
  if (!message) {
    formMsg.innerHTML = '⚠️ Please write your message.';
    formMsg.className = 'form-msg error';
    btn.innerHTML = 'Send Message 🌿';
    btn.disabled = false;
    return;
  }

  const payload = { name, email, subject, message };

  try {
    await fetch(SHEET_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    });
    formMsg.innerHTML  = '✅ Message sent! We will get back to you shortly.';
    formMsg.className  = 'form-msg success';
    contactForm.reset();
  } catch (err) {
    formMsg.innerHTML = '❌ Network error. Please try again.';
    formMsg.className = 'form-msg error';
    console.error(err);
  }

  btn.innerHTML = 'Send Message 🌿';
  btn.disabled  = false;
  setTimeout(() => { formMsg.textContent = ''; formMsg.className = 'form-msg'; }, 7000);
});