/* ============================================================
   ABSOLUT CANDLES — script.js
   Modular vanilla JS. No frameworks. No AI/ML — all recommendation
   logic below is plain rule-based JavaScript.
   ============================================================ */

/* ---------------- DATA ---------------- */
const PRODUCTS = [
  {
    id: 'sandalwood-01',
    name: 'Sandalwood No. 01',
    category: 'scented',
    family: 'Woody',
    notes: 'Indian sandalwood · Amber · Soft musk',
    price: 2400
  },
  {
    id: 'gulab-07',
    name: 'Gulab No. 07',
    category: 'scented',
    family: 'Floral',
    notes: 'Rose · Saffron · Vanilla',
    price: 2400
  },
  {
    id: 'vetiver-03',
    name: 'Vetiver No. 03',
    category: 'scented',
    family: 'Woody',
    notes: 'Vetiver / Khus · Cedar · Dry earth',
    price: 2400
  },
  {
    id: 'classic-ivory',
    name: 'Classic Ivory',
    category: 'classic',
    family: 'Unscented',
    notes: 'Pure wax · No fragrance · Long, even burn',
    price: 1400
  },
  {
    id: 'house-box',
    name: 'The House Box',
    category: 'gift',
    family: 'Mixed',
    notes: 'Sandalwood · Gulab · Vetiver — one of each',
    price: 6400
  },
];

const FRAGRANCE_FAMILIES = [
  { name: 'Woody', desc: 'Sandalwood, cedar, oud and vetiver — grounded and warm.' },
  { name: 'Floral', desc: 'Rose, jasmine, tuberose and lavender — soft and romantic.' },
  { name: 'Warm / Resinous', desc: 'Amber, frankincense, vanilla and musk — deep and enveloping.' },
  { name: 'Fresh', desc: 'Citrus, neroli, green leaves and herbs — clear and bright.' },
];

const FAQ_DATA = {
  Products: [
    ['What wax do you use?', 'A blend of natural soy and vegetable wax, chosen for a clean, even burn.'],
    ['How long do candles burn?', 'Our standard jar burns for approximately 45–50 hours with proper care.'],
    ['Are candles hand poured?', 'Yes — every ABSOLUT candle is hand poured in small batches.'],
    ['Are fragrances natural?', 'We blend natural extracts with skin-safe, IFRA-compliant fragrance oils for consistency and longevity.'],
    ['How should I care for my candle?', 'Trim the wick to 5mm before each burn and let the wax pool reach the edges on the first light.'],
  ],
  Orders: [
    ['How do I place an order?', 'Add items to your bag and check out securely online, or reach us on WhatsApp for custom orders.'],
    ['Can I cancel an order?', 'Orders can be cancelled within 24 hours of purchase — contact us as soon as possible.'],
    ['Can I modify an order?', 'Yes, if it hasn\u2019t shipped yet. Message us with your order number.'],
  ],
  Shipping: [
    ['Where do you ship?', 'Currently across India, with select international shipping on request.'],
    ['How long does delivery take?', 'Typically 3–7 business days depending on your location.'],
    ['Do you offer COD?', 'Yes, cash on delivery is available for most pin codes.'],
  ],
  Custom: [
    ['Can I create my own fragrance?', 'Yes — use our fragrance builder or custom candle form to compose your own blend.'],
    ['Can you make wedding candles?', 'Yes, we offer bespoke wedding and event editions — enquire via the custom form.'],
    ['Can you make corporate gifts?', 'Yes, see our Wholesale section for bulk and branded gifting.'],
  ],
};

/* ---------------- STATE ---------------- */
const state = {
  cart: JSON.parse(localStorage.getItem('ac_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('ac_wishlist') || '[]'),
};

function saveState(){
  localStorage.setItem('ac_cart', JSON.stringify(state.cart));
  localStorage.setItem('ac_wishlist', JSON.stringify(state.wishlist));
}

/* ---------------- TOASTS ---------------- */
function showToast(message){
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('leaving');
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

/* ---------------- PRELOADER ---------------- */
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  setTimeout(() => pre.classList.add('hidden'), 900);
});

/* ---------------- HEADER SCROLL STATE ---------------- */
const header = document.getElementById('site-header');
function onScroll(){
  header.classList.toggle('scrolled', window.scrollY > 40);
}
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------------- MOBILE MENU ---------------- */
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle.classList.remove('open');
}));

/* ---------------- SCROLL REVEAL ---------------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

/* ============================================================
   PRODUCT RENDERING
   ============================================================ */
function renderProducts(filter = 'all'){
  const grid = document.getElementById('product-grid');
  const list = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  grid.innerHTML = list.map(p => productCardHTML(p)).join('');
  attachProductCardEvents();
}

function productCardHTML(p){
  const inWishlist = state.wishlist.includes(p.id);
  return `
  <article class="product-card reveal in-view" data-id="${p.id}">
    <div class="product-media">
      <button class="product-wishlist ${inWishlist ? 'active' : ''}" data-wishlist="${p.id}" aria-label="Toggle wishlist">
        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="${inWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.6" d="M12 20s-7.5-4.6-10-9.3C.4 7.6 2 4 5.6 4 8 4 10 5.5 12 8c2-2.5 4-4 6.4-4C22 4 23.6 7.6 22 10.7 19.5 15.4 12 20 12 20z"/></svg>
      </button>
      <div class="flame small" aria-hidden="true"></div>
    </div>
    <div class="product-info">
      <h3>${p.name}</h3>
      <p class="product-notes">${p.notes}</p>
      <div class="product-footer">
        <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
        <div class="product-actions">
          <button class="icon-action" data-quickview="${p.id}" title="Quick view">⊕</button>
          <button class="icon-action" data-addcart="${p.id}" title="Add to bag">🛍</button>
        </div>
      </div>
    </div>
  </article>`;
}

function attachProductCardEvents(){
  document.querySelectorAll('[data-wishlist]').forEach(btn => {
    btn.addEventListener('click', () => toggleWishlist(btn.getAttribute('data-wishlist')));
  });
  document.querySelectorAll('[data-addcart]').forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn.getAttribute('data-addcart')));
  });
  document.querySelectorAll('[data-quickview]').forEach(btn => {
    btn.addEventListener('click', () => openQuickView(btn.getAttribute('data-quickview')));
  });
}

document.getElementById('category-filters').addEventListener('click', (e) => {
  const chip = e.target.closest('.filter-chip');
  if (!chip) return;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  renderProducts(chip.getAttribute('data-filter'));
});

/* ============================================================
   FRAGRANCE FAMILIES
   ============================================================ */
function renderFamilies(){
  const grid = document.getElementById('family-grid');
  grid.innerHTML = FRAGRANCE_FAMILIES.map(f => `
    <div class="family-card reveal in-view">
      <div class="family-glow" aria-hidden="true"></div>
      <h3>${f.name}</h3>
      <p>${f.desc}</p>
    </div>
  `).join('');
}

/* ============================================================
   WISHLIST / CART
   ============================================================ */
function toggleWishlist(id){
  const idx = state.wishlist.indexOf(id);
  if (idx > -1){
    state.wishlist.splice(idx, 1);
    showToast('Removed from wishlist');
  } else {
    state.wishlist.push(id);
    showToast('Added to wishlist');
  }
  saveState();
  refreshCounts();
  renderProducts(document.querySelector('.filter-chip.active')?.getAttribute('data-filter') || 'all');
  renderWishlistDrawer();
}

function addToCart(id, qty = 1){
  const existing = state.cart.find(c => c.id === id);
  if (existing){ existing.qty += qty; }
  else { state.cart.push({ id, qty }); }
  saveState();
  refreshCounts();
  renderCartDrawer();
  const product = PRODUCTS.find(p => p.id === id);
  showToast(`${product ? product.name : 'Item'} added to bag`);
}

function removeFromCart(id){
  state.cart = state.cart.filter(c => c.id !== id);
  saveState();
  refreshCounts();
  renderCartDrawer();
}

function refreshCounts(){
  document.getElementById('wishlist-count').textContent = state.wishlist.length;
  document.getElementById('cart-count').textContent = state.cart.reduce((sum, c) => sum + c.qty, 0);
}

function renderWishlistDrawer(){
  const el = document.getElementById('wishlist-items');
  if (!state.wishlist.length){
    el.innerHTML = '<p class="empty-state">Your wishlist is empty.</p>';
    return;
  }
  el.innerHTML = state.wishlist.map(id => {
    const p = PRODUCTS.find(pr => pr.id === id);
    if (!p) return '';
    return `<div class="drawer-item">
      <div class="drawer-thumb"></div>
      <div class="drawer-item-info"><h4>${p.name}</h4><p>₹${p.price.toLocaleString('en-IN')}</p></div>
      <button class="drawer-remove" data-unwish="${id}">Remove</button>
    </div>`;
  }).join('');
  el.querySelectorAll('[data-unwish]').forEach(btn => {
    btn.addEventListener('click', () => toggleWishlist(btn.getAttribute('data-unwish')));
  });
}

function renderCartDrawer(){
  const el = document.getElementById('cart-items');
  let total = 0;
  if (!state.cart.length){
    el.innerHTML = '<p class="empty-state">Your bag is empty.</p>';
  } else {
    el.innerHTML = state.cart.map(c => {
      const p = PRODUCTS.find(pr => pr.id === c.id);
      if (!p) return '';
      total += p.price * c.qty;
      return `<div class="drawer-item">
        <div class="drawer-thumb"></div>
        <div class="drawer-item-info"><h4>${p.name}</h4><p>Qty ${c.qty} · ₹${(p.price * c.qty).toLocaleString('en-IN')}</p></div>
        <button class="drawer-remove" data-uncart="${c.id}">Remove</button>
      </div>`;
    }).join('');
    el.querySelectorAll('[data-uncart]').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(btn.getAttribute('data-uncart')));
    });
  }
  document.getElementById('cart-total-amount').textContent = `₹${total.toLocaleString('en-IN')}`;
}

document.getElementById('checkout-btn').addEventListener('click', () => {
  if (!state.cart.length){ showToast('Your bag is empty'); return; }
  showToast('This is a prototype — checkout connects to Razorpay/UPI in production.');
});

/* ============================================================
   QUICK VIEW MODAL
   ============================================================ */
function openQuickView(id){
  const p = PRODUCTS.find(pr => pr.id === id);
  if (!p) return;
  const content = document.getElementById('quickview-content');
  content.innerHTML = `
    <button class="modal-close" data-close="quickview-modal" aria-label="Close">×</button>
    <div class="qv-body">
      <div class="qv-media"></div>
      <div class="qv-info">
        <p class="eyebrow">${p.family}</p>
        <h3>${p.name}</h3>
        <p class="product-notes">${p.notes}</p>
        <p class="qv-price">₹${p.price.toLocaleString('en-IN')}</p>
        <div class="qv-qty">
          <button id="qv-minus">−</button>
          <span id="qv-qty-val">1</span>
          <button id="qv-plus">+</button>
        </div>
        <button class="btn btn-primary full" id="qv-add">Add to bag</button>
      </div>
    </div>`;
  let qty = 1;
  content.querySelector('#qv-minus').addEventListener('click', () => {
    qty = Math.max(1, qty - 1);
    content.querySelector('#qv-qty-val').textContent = qty;
  });
  content.querySelector('#qv-plus').addEventListener('click', () => {
    qty = Math.min(12, qty + 1);
    content.querySelector('#qv-qty-val').textContent = qty;
  });
  content.querySelector('#qv-add').addEventListener('click', () => {
    addToCart(id, qty);
    closeModal('quickview-modal');
  });
  content.querySelector('[data-close]').addEventListener('click', () => closeModal('quickview-modal'));
  openModal('quickview-modal');
}

/* ============================================================
   MODAL HELPERS
   ============================================================ */
function openModal(id){
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id){
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.getAttribute('data-close')));
});
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal.id);
  });
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape'){
    document.querySelectorAll('.modal.open').forEach(m => closeModal(m.id));
  }
});

document.getElementById('search-toggle').addEventListener('click', () => {
  openModal('search-modal');
  document.getElementById('search-input').focus();
});
document.getElementById('wishlist-toggle').addEventListener('click', () => {
  renderWishlistDrawer();
  openModal('wishlist-modal');
});
document.getElementById('cart-toggle').addEventListener('click', () => {
  renderCartDrawer();
  openModal('cart-modal');
});

/* ============================================================
   SEARCH
   ============================================================ */
document.getElementById('search-input').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  const results = document.getElementById('search-results');
  if (!q){ results.innerHTML = ''; return; }
  const matches = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.notes.toLowerCase().includes(q) ||
    p.family.toLowerCase().includes(q)
  );
  results.innerHTML = matches.length
    ? matches.map(p => `<div class="search-result-item">${p.name} — ₹${p.price.toLocaleString('en-IN')}</div>`).join('')
    : '<div class="search-result-item">No matches found.</div>';
});

/* ============================================================
   FRAGRANCE COMBINATION BUILDER (plain JS rules, no AI)
   ============================================================ */
const builderState = { base: 'Sandalwood', heart: 'Rose', accent: 'Saffron' };
document.querySelectorAll('.pill-group[data-step]').forEach(group => {
  const step = group.getAttribute('data-step');
  group.addEventListener('click', (e) => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    group.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    builderState[step] = pill.getAttribute('data-value');
    updateBuilderFormula();
  });
});
function updateBuilderFormula(){
  document.getElementById('builder-formula').textContent =
    `${builderState.base} + ${builderState.heart} + ${builderState.accent}`;
}
document.getElementById('builder-add').addEventListener('click', () => {
  document.getElementById('c-combo').value = `${builderState.base} + ${builderState.heart} + ${builderState.accent}`;
  document.getElementById('custom').scrollIntoView({ behavior: 'smooth' });
  showToast('Combination carried over to your custom candle');
});

/* ============================================================
   CANDLE PERSONALITY QUIZ (rule-based)
   ============================================================ */
const quizAnswers = {};
const quizPanel = document.getElementById('quiz-panel');
const quizQuestions = quizPanel.querySelectorAll('.quiz-question');
const quizProgressBar = document.getElementById('quiz-progress-bar');

quizPanel.addEventListener('click', (e) => {
  const opt = e.target.closest('.quiz-opt');
  if (!opt) return;
  const questionEl = opt.closest('.quiz-question');
  const qNum = questionEl.getAttribute('data-q');
  quizAnswers[qNum] = opt.getAttribute('data-value');
  const next = questionEl.nextElementSibling;
  questionEl.classList.remove('active');
  if (next && next.classList.contains('quiz-question')){
    next.classList.add('active');
    quizProgressBar.style.width = `${(Object.keys(quizAnswers).length / 3) * 100}%`;
  } else {
    showQuizResult();
  }
});

function showQuizResult(){
  quizProgressBar.style.width = '100%';
  const { result, recommendation } = computeQuizResult(quizAnswers);
  document.getElementById('quiz-result-title').textContent = result;
  document.getElementById('quiz-result-desc').textContent = `Recommended: ${recommendation}`;
  document.getElementById('quiz-result').classList.add('active');
}

function computeQuizResult(answers){
  // Simple deterministic rule set — first question carries the most weight.
  const map = {
    warm: { result: 'THE GROUNDING SOUL', recommendation: 'Vetiver No. 03' },
    fresh: { result: 'THE CLEAR MIND', recommendation: 'A Fresh-family blend' },
    soft: { result: 'THE ROMANTIC', recommendation: 'Gulab No. 07' },
    grounded: { result: 'THE QUIET GROUND', recommendation: 'Sandalwood No. 01' },
  };
  return map[answers['1']] || map.warm;
}

document.getElementById('quiz-restart').addEventListener('click', () => {
  Object.keys(quizAnswers).forEach(k => delete quizAnswers[k]);
  document.getElementById('quiz-result').classList.remove('active');
  quizQuestions.forEach(q => q.classList.remove('active'));
  quizQuestions[0].classList.add('active');
  quizProgressBar.style.width = '0%';
});

/* ============================================================
   VIRTUAL ROOM FRAGRANCE SELECTOR (rule-based)
   ============================================================ */
const roomState = { room: null, mood: null };
const ROOM_RULES = {
  'Bedroom|Relax': 'Sandalwood / Lavender',
  'Bedroom|Romantic': 'Rose / Amber',
  'Living Room|Entertain': 'Rose / Citrus',
  'Living Room|Relax': 'Amber / Sandalwood',
  'Study|Focus': 'Cedar / Vetiver',
  'Bathroom|Refresh': 'Citrus / Green Leaves',
  'Dining Room|Entertain': 'Rose / Citrus',
  'Dining Room|Romantic': 'Vanilla / Rose',
};
function updateRoomResult(){
  const resultEl = document.getElementById('room-result-text');
  if (!roomState.room || !roomState.mood){
    resultEl.textContent = 'Choose a room and a mood.';
    return;
  }
  const key = `${roomState.room}|${roomState.mood}`;
  const rec = ROOM_RULES[key] || 'Sandalwood / Amber — our versatile, all-room blend';
  resultEl.textContent = `${roomState.room}, for ${roomState.mood.toLowerCase()}: ${rec}`;
}
document.getElementById('room-choices').addEventListener('click', (e) => {
  const pill = e.target.closest('.pill');
  if (!pill) return;
  document.querySelectorAll('#room-choices .pill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');
  roomState.room = pill.getAttribute('data-value');
  updateRoomResult();
});
document.getElementById('mood-choices').addEventListener('click', (e) => {
  const pill = e.target.closest('.pill');
  if (!pill) return;
  document.querySelectorAll('#mood-choices .pill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');
  roomState.mood = pill.getAttribute('data-value');
  updateRoomResult();
});

/* ============================================================
   SUBSCRIPTION FREQUENCY
   ============================================================ */
document.getElementById('sub-frequency').addEventListener('click', (e) => {
  const pill = e.target.closest('.pill');
  if (!pill) return;
  document.querySelectorAll('#sub-frequency .pill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');
});
document.getElementById('sub-start').addEventListener('click', () => {
  const freq = document.querySelector('#sub-frequency .pill.active')?.getAttribute('data-value') || 'Monthly';
  showToast(`The Monthly Ritual started — ${freq} delivery`);
});

/* ============================================================
   INSTAGRAM GRID
   ============================================================ */
function renderInstaGrid(){
  const grid = document.getElementById('insta-grid');
  grid.innerHTML = Array.from({ length: 6 }).map(() => '<div class="insta-tile"></div>').join('');
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
function renderFAQ(){
  const el = document.getElementById('faq-accordion');
  let html = '';
  Object.entries(FAQ_DATA).forEach(([category, items]) => {
    html += `<h3 class="faq-category">${category}</h3>`;
    items.forEach(([q, a]) => {
      html += `
        <div class="accordion-item">
          <button class="accordion-trigger">
            <span>${q}</span><span class="accordion-icon">+</span>
          </button>
          <div class="accordion-panel"><p>${a}</p></div>
        </div>`;
    });
  });
  el.innerHTML = html;
  el.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const panel = item.querySelector('.accordion-panel');
      const isOpen = item.classList.contains('open');
      el.querySelectorAll('.accordion-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.accordion-panel').style.maxHeight = null;
      });
      if (!isOpen){
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

/* ============================================================
   FORMS — enquiry submissions (frontend-only prototype)
   ============================================================ */
function bindFormSuccess(formId, message){
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast(message);
    form.reset();
  });
}
bindFormSuccess('custom-form', 'Custom candle request received — we\u2019ll follow up by email.');
bindFormSuccess('wholesale-form', 'Wholesale enquiry submitted — our team will reach out shortly.');
bindFormSuccess('contact-form', 'Message sent — thank you for reaching out.');
bindFormSuccess('newsletter-form', 'Welcome to the ritual — check your inbox to confirm.');
bindFormSuccess('footer-newsletter-form', 'You\u2019re on the list.');

/* ============================================================
   INIT
   ============================================================ */
renderProducts();
renderFamilies();
renderInstaGrid();
renderFAQ();
refreshCounts();
updateBuilderFormula();
