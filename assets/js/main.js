/**
 * THE NINE HOMES - MAIN JAVASCRIPT
 * Location: Punadipadu, near Kankipadu, Vijayawada, Andhra Pradesh
 * Contact: 96188 96669
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initSmoothScroll();
  initActiveNavSpy();
  initInteractiveMap();
  initGalleryLightbox();
  initEmiCalculator();
  initBookingForm();
  initFaqAccordion();
  initDateConstraints();
});

/* --------------------------------------------------------------------------
   1. STICKY HEADER
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const closeBtn = document.querySelector('.mobile-nav-close');
  const navLinks = document.querySelectorAll('.mobile-nav-list a');

  if (!toggleBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

/* --------------------------------------------------------------------------
   3. SMOOTH SCROLL FOR IN-PAGE ANCHORS
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. ACTIVE NAV LINK SPY (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------------
   5. INTERACTIVE MAP (LEAFLET.JS)
   -------------------------------------------------------------------------- */
function initInteractiveMap() {
  const mapElement = document.getElementById('project-interactive-map');
  if (!mapElement) return;

  // Check if Leaflet is loaded
  if (typeof L === 'undefined') {
    mapElement.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100%;padding:24px;text-align:center;background:#f5f0ea;">
        <div>
          <h4 style="color:#1B382B;margin-bottom:8px;">The Nine Homes — Punadipadu</h4>
          <p style="color:#535E58;font-size:0.9rem;">Punadipadu, near Kankipadu, Vijayawada, Andhra Pradesh.<br>Next to Sri City Venture | Near Narayana Medical College</p>
        </div>
      </div>
    `;
    return;
  }

  // Punadipadu Coordinates (near Kankipadu / Bandar Road corridor, Vijayawada)
  const projectCoords = [16.4715, 80.7328];
  const sriCityCoords = [16.4728, 80.7345];
  const narayanaCollegeCoords = [16.4810, 80.7210];
  const kankipaduCoords = [16.4530, 80.7510];
  const benzCircleCoords = [16.4990, 80.6550];

  const map = L.map('project-interactive-map', {
    center: [16.4760, 80.7250],
    zoom: 13,
    scrollWheelZoom: false
  });

  // Standard OpenStreetMap tiles - clean, reliable, and completely free without API key
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  // Custom Pin Icons
  const createPinIcon = (color, isMain = false) => {
    return L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="
          background:${color};
          width:${isMain ? '36px' : '28px'};
          height:${isMain ? '36px' : '28px'};
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:2px solid #FFFFFF;
          box-shadow:0 6px 14px rgba(0,0,0,0.3);
          display:flex;
          align-items:center;
          justify-content:center;
        ">
          <span style="
            transform:rotate(45deg);
            color:#FFFFFF;
            font-size:${isMain ? '16px' : '12px'};
            font-weight:bold;
          ">${isMain ? '★' : '•'}</span>
        </div>
      `,
      iconSize: isMain ? [36, 36] : [28, 28],
      iconAnchor: isMain ? [18, 36] : [14, 28],
      popupAnchor: [0, -32]
    });
  };

  const projectIcon = createPinIcon('#1B382B', true);
  const landmarkIcon = createPinIcon('#C29B4F', false);

  // Markers
  const projectMarker = L.marker(projectCoords, { icon: projectIcon })
    .addTo(map)
    .bindPopup(`
      <div style="font-family:'Plus Jakarta Sans',sans-serif;padding:4px;">
        <h4 style="margin:0 0 4px;color:#1B382B;font-size:14px;font-weight:700;">The Nine Homes</h4>
        <p style="margin:0;font-size:12px;color:#444;">168 Sq. Yds | 1325 Sq. Ft<br>Punadipadu, near Kankipadu</p>
      </div>
    `)
    .openPopup();

  const sriCityMarker = L.marker(sriCityCoords, { icon: landmarkIcon })
    .addTo(map)
    .bindPopup(`<b>Sri City Venture</b><br><small style="color:#666">Next to The Nine Homes</small>`);

  const narayanaMarker = L.marker(narayanaCollegeCoords, { icon: landmarkIcon })
    .addTo(map)
    .bindPopup(`<b>Narayana Medical College</b><br><small style="color:#666">Nearby Key Facility</small>`);

  const kankipaduMarker = L.marker(kankipaduCoords, { icon: landmarkIcon })
    .addTo(map)
    .bindPopup(`<b>Kankipadu Town</b><br><small style="color:#666">Convenient Access</small>`);

  const benzCircleMarker = L.marker(benzCircleCoords, { icon: landmarkIcon })
    .addTo(map)
    .bindPopup(`<b>Benz Circle, Vijayawada</b><br><small style="color:#666">Approx. 25 Minutes Drive</small>`);

  // Interactive landmark cards interaction
  const landmarkCards = document.querySelectorAll('.landmark-card');
  landmarkCards.forEach(card => {
    card.addEventListener('click', () => {
      landmarkCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const target = card.getAttribute('data-landmark');
      if (target === 'project') {
        map.flyTo(projectCoords, 15, { duration: 1.2 });
        projectMarker.openPopup();
      } else if (target === 'sricity') {
        map.flyTo(sriCityCoords, 15, { duration: 1.2 });
        sriCityMarker.openPopup();
      } else if (target === 'narayana') {
        map.flyTo(narayanaCollegeCoords, 14, { duration: 1.2 });
        narayanaMarker.openPopup();
      } else if (target === 'benz') {
        map.flyTo(benzCircleCoords, 13, { duration: 1.5 });
        benzCircleMarker.openPopup();
      } else if (target === 'kankipadu') {
        map.flyTo(kankipaduCoords, 14, { duration: 1.2 });
        kankipaduMarker.openPopup();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. GALLERY & LIGHTBOX
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const filterBtns = document.querySelectorAll('.gallery-tab-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.querySelector('.lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const modalDesc = document.getElementById('lightbox-desc');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  if (!modal || !modalImg) return;

  let currentIndex = 0;
  let activeItems = Array.from(galleryItems);

  // Category Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });

      // Update visible active items for lightbox cycling
      activeItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
    });
  });

  // Open Lightbox
  const openModal = (index) => {
    currentIndex = index;
    const item = activeItems[currentIndex];
    if (!item) return;

    const img = item.querySelector('img');
    const title = item.getAttribute('data-title') || 'The Nine Homes';
    const desc = item.getAttribute('data-desc') || 'Punadipadu, near Kankipadu, Vijayawada';

    modalImg.src = img.src;
    modalImg.alt = title;
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % activeItems.length;
    openModal(currentIndex);
  };

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + activeItems.length) % activeItems.length;
    openModal(currentIndex);
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      activeItems = Array.from(galleryItems).filter(i => i.style.display !== 'none');
      const idx = activeItems.indexOf(item);
      if (idx !== -1) openModal(idx);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* --------------------------------------------------------------------------
   7. INTERACTIVE EMI CALCULATOR
   -------------------------------------------------------------------------- */
function initEmiCalculator() {
  const loanSlider = document.getElementById('slider-loan-amount');
  const loanDisplay = document.getElementById('display-loan-amount');
  const tenureSlider = document.getElementById('slider-tenure');
  const tenureDisplay = document.getElementById('display-tenure');
  const rateSlider = document.getElementById('slider-rate');
  const rateDisplay = document.getElementById('display-rate');

  const monthlyEmiDisplay = document.getElementById('display-monthly-emi');
  const totalInterestDisplay = document.getElementById('display-total-interest');
  const totalPaymentDisplay = document.getElementById('display-total-payment');

  if (!loanSlider || !monthlyEmiDisplay) return;

  const formatCurrency = (val) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  const calculateEMI = () => {
    const P = parseFloat(loanSlider.value); // Principal in Lakhs
    const principalAmount = P * 100000;
    const annualRate = parseFloat(rateSlider.value);
    const tenureYears = parseFloat(tenureSlider.value);

    loanDisplay.textContent = `₹${P} Lakhs`;
    tenureDisplay.textContent = `${tenureYears} Years`;
    rateDisplay.textContent = `${annualRate}%`;

    const monthlyRate = annualRate / (12 * 100);
    const totalMonths = tenureYears * 12;

    // EMI formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emi = (principalAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
                (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - principalAmount;

    monthlyEmiDisplay.textContent = formatCurrency(emi);
    if (totalInterestDisplay) totalInterestDisplay.textContent = formatCurrency(totalInterest);
    if (totalPaymentDisplay) totalPaymentDisplay.textContent = formatCurrency(totalPayment);
  };

  loanSlider.addEventListener('input', calculateEMI);
  tenureSlider.addEventListener('input', calculateEMI);
  rateSlider.addEventListener('input', calculateEMI);

  calculateEMI();
}

/* --------------------------------------------------------------------------
   8. SITE VISIT BOOKING & ENQUIRY FORM
   -------------------------------------------------------------------------- */
function initBookingForm() {
  const form = document.getElementById('site-visit-form');
  const successModal = document.getElementById('booking-success-modal');
  const closeSuccessBtn = document.getElementById('btn-close-success');
  const whatsappConfirmBtn = document.getElementById('btn-whatsapp-confirm');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('form-name');
    const phoneInput = document.getElementById('form-phone');
    const emailInput = document.getElementById('form-email');
    const dateInput = document.getElementById('form-date');
    const slotInput = document.getElementById('form-slot');
    const messageInput = document.getElementById('form-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const date = dateInput ? dateInput.value : '';
    const slot = slotInput ? slotInput.value : 'Morning (10:00 AM - 1:00 PM)';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name) {
      alert('Please enter your full name.');
      nameInput.focus();
      return;
    }

    // Validate 10 digit Indian Phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      alert('Please enter a valid 10-digit Indian mobile number (e.g., 9618896669).');
      phoneInput.focus();
      return;
    }

    if (!date) {
      alert('Please select your preferred visit date.');
      dateInput.focus();
      return;
    }

    // Generate reference code
    const refCode = 'TNH-' + Math.floor(100000 + Math.random() * 900000);

    // Update Confirmation Details
    const confName = document.getElementById('conf-name');
    const confPhone = document.getElementById('conf-phone');
    const confDate = document.getElementById('conf-date');
    const confSlot = document.getElementById('conf-slot');
    const confRef = document.getElementById('conf-ref');

    if (confName) confName.textContent = name;
    if (confPhone) confPhone.textContent = cleanPhone;
    if (confDate) confDate.textContent = date;
    if (confSlot) confSlot.textContent = slot;
    if (confRef) confRef.textContent = refCode;

    // Prepare WhatsApp Message
    const whatsappText = encodeURIComponent(
      `Hi, I would like to schedule a site visit for The Nine Homes.\n\n` +
      `Booking Ref: ${refCode}\n` +
      `Name: ${name}\n` +
      `Phone: ${cleanPhone}\n` +
      `Preferred Date: ${date}\n` +
      `Preferred Slot: ${slot}\n` +
      (message ? `Note: ${message}\n` : '') +
      `\nPlease confirm availability.`
    );

    if (whatsappConfirmBtn) {
      whatsappConfirmBtn.href = `https://wa.me/919618896669?text=${whatsappText}`;
    }

    // Show Confirmation Modal
    if (successModal) {
      successModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    // Reset Form
    form.reset();
  });

  if (closeSuccessBtn && successModal) {
    closeSuccessBtn.addEventListener('click', () => {
      successModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
}

/* --------------------------------------------------------------------------
   9. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answerPanel = item.querySelector('.faq-answer-panel');

    if (!questionBtn || !answerPanel) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQs
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const panel = otherItem.querySelector('.faq-answer-panel');
          if (panel) panel.style.maxHeight = null;
        }
      });

      // Toggle current FAQ
      if (isActive) {
        item.classList.remove('active');
        answerPanel.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answerPanel.style.maxHeight = answerPanel.scrollHeight + 'px';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   10. SET DATE PICKER MINIMUM DATE TO TODAY
   -------------------------------------------------------------------------- */
function initDateConstraints() {
  const dateInput = document.getElementById('form-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }
}
