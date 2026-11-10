/**
 * HOTEL NILWALA - MAIN SCRIPT
 * Handles navigation, mobile menu, scroll reveal, modal management,
 * room details gallery modal, and toast notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initScrollReveal();
  initModals();
  initQuickBookingBar();
  initRoomDetailsModal();
});

/**
 * Sticky Navigation with Header Scrolled State
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
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

/**
 * Mobile Navigation Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      navMenu.classList.remove('open');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      navMenu.classList.add('open');
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      toggleBtn.classList.remove('active');
    }
  });
}

/**
 * Scroll Reveal Animations via IntersectionObserver
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * Global Modal System
 */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-open-modal]');
  const modalCloseBtns = document.querySelectorAll('[data-close-modal]');
  const modals = document.querySelectorAll('.modal-overlay');

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-open-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Pre-fill room type if provided
        const roomType = btn.getAttribute('data-room-type');
        if (roomType) {
          const roomSelect = targetModal.querySelector('select[name="roomType"]');
          if (roomSelect) roomSelect.value = roomType;
        }
      }
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modals.forEach(m => m.classList.remove('active'));
      document.body.style.overflow = '';
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(m => m.classList.remove('active'));
      document.body.style.overflow = '';
    }
  });
}

/**
 * Quick Booking Bar Helper on Homepage
 */
function initQuickBookingBar() {
  const quickForm = document.getElementById('quickBookingForm');
  if (!quickForm) return;

  quickForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const checkin = quickForm.querySelector('[name="checkin"]')?.value || '';
    const checkout = quickForm.querySelector('[name="checkout"]')?.value || '';
    const guests = quickForm.querySelector('[name="guests"]')?.value || '2 Adults';
    const room = quickForm.querySelector('[name="room"]')?.value || 'Deluxe Double Room with Balcony and Sea/River View';

    const modal = document.getElementById('bookingModal');
    if (modal) {
      const modalCheckin = modal.querySelector('[name="checkin"]');
      const modalCheckout = modal.querySelector('[name="checkout"]');
      const modalRoom = modal.querySelector('[name="roomType"]');
      
      if (modalCheckin && checkin) modalCheckin.value = checkin;
      if (modalCheckout && checkout) modalCheckout.value = checkout;
      if (modalRoom && room) modalRoom.value = room;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  const today = new Date().toISOString().split('T')[0];
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    input.min = today;
  });
}

/**
 * Verified Hotel Nilwala Room Data Repository
 * Directly sourced from Booking.com (ID: nilwala-bentota2) and Agoda (ID: 534304)
 */
const HOTEL_ROOMS_DATA = {
  'deluxe-double': {
    name: 'Deluxe Double Room with Balcony and Sea/River View',
    badge: 'Official Booking.com & Agoda Verified Category',
    desc: 'Our premier accommodation category offering a private furnished balcony with sweeping views of the river and cooling sea breezes. Features a spacious double bed, quiet air conditioning, and a private attached bathroom with shower.',
    specs: [
      { label: 'Room Size', val: '24 m² / 258 ft²' },
      { label: 'Bed Configuration', val: '1 Large Double Bed' },
      { label: 'Max Occupancy', val: '2 Adults' },
      { label: 'View Type', val: 'Balcony River & Sea Breeze' },
      { label: 'Floor', val: 'Upper Floor with Balcony' }
    ],
    amenities: [
      'Private Furnished Balcony',
      'Air Conditioning (Quiet Climate Control)',
      'Ensuite Bathroom with Walk-in Shower',
      'Free High-Speed Wi-Fi',
      'Flat-Screen Television',
      'Work Desk & Dressing Area',
      'Electric Tea & Coffee Setup',
      'Tile / Marble Flooring',
      'Fresh Linens & Towels Daily',
      'Daily Housekeeping & Room Assistance'
    ],
    images: [
      { src: 'assets/images/nilwala_deluxe_double_632865232.jpg', title: 'Deluxe Bedroom Interior' },
      { src: 'assets/images/nilwala_deluxe_double_632865268.jpg', title: 'Private Balcony Water View' },
      { src: 'assets/images/nilwala_deluxe_double_623616391.jpg', title: 'Guestroom Perspective' },
      { src: 'assets/images/nilwala_deluxe_double_623615568.jpg', title: 'Ensuite Bathroom & Shower' },
      { src: 'assets/images/nilwala_deluxe_double_632865211.jpg', title: 'Room Interior Angle' }
    ]
  },
  'superior-double': {
    name: 'Superior Double Room with River View',
    badge: 'Direct Riverfront Accommodation',
    desc: 'Designed for travelers seeking peaceful rest beside the water. Opens directly toward the river gardens with terrace seating, gentle natural breezes, double bedding, and dedicated guest amenities.',
    specs: [
      { label: 'Room Size', val: '22 m²' },
      { label: 'Bed Configuration', val: '1 Double Bed' },
      { label: 'Max Occupancy', val: '2 Adults' },
      { label: 'View Type', val: 'Direct Riverfront View' },
      { label: 'Setting', val: 'River Terrace Access' }
    ],
    amenities: [
      'Direct Riverfront Setting',
      'Quiet Air Conditioning',
      'Attached Bathroom with Shower',
      'Free High-Speed Wi-Fi',
      'Outdoor Seating on Terrace',
      'Electric Tea & Coffee Facilities',
      'Fresh Towels & Linens',
      'Room Service Support'
    ],
    images: [
      { src: 'assets/images/nilwala_deluxe_double_632865268.jpg', title: 'Panoramic River View' },
      { src: 'assets/images/nilwala_facilities_balcony_terrace_1156415684.jpg', title: 'Riverfront Terrace Seating' },
      { src: 'assets/images/nilwala_facilities_surrounding_environment_1156415681.jpg', title: 'Riverside Surroundings' }
    ]
  },
  'standard-double': {
    name: 'Standard Double Room',
    badge: 'Official Agoda Listing Photo',
    desc: 'Our cozy, value-focused accommodation option. Provides everything needed for a restful night after a day of beach excursions or river safaris, featuring a clean comfortable bed, air conditioning, and private bathroom.',
    specs: [
      { label: 'Room Size', val: '20 m²' },
      { label: 'Bed Configuration', val: '1 Double Bed' },
      { label: 'Max Occupancy', val: '2 Adults' },
      { label: 'Climate', val: 'Air Conditioned' },
      { label: 'Access', val: 'Garden Grounds Access' }
    ],
    amenities: [
      '1 Double Bed with Fresh Linens',
      'Air Conditioning',
      'Private Ensuite Bathroom',
      'Free High-Speed Wi-Fi',
      'Work Desk / Dressing Table',
      'Tile Flooring',
      'Daily Housekeeping'
    ],
    images: [
      { src: 'assets/images/nilwala_rooms_view_21107468.jpg', title: 'Standard Room Interior (Agoda Verified)' },
      { src: 'assets/images/nilwala_facilities_garden_17050466.jpg', title: 'Lush Tropical Garden Setting' }
    ]
  },
  'family-room': {
    name: 'Family / Triple Room',
    badge: 'Spacious Family Configuration',
    desc: 'A spacious layout designed for small families or travel companions. Configured with one double bed plus single bedding, private ensuite bathroom, air conditioning, and plenty of space for luggage and river gear.',
    specs: [
      { label: 'Room Size', val: '30 m²' },
      { label: 'Bed Configuration', val: '1 Double Bed + 1 Single Bed' },
      { label: 'Max Occupancy', val: '3 Adults or Family' },
      { label: 'Climate', val: 'Air Conditioned' },
      { label: 'Layout', val: 'Spacious Group Layout' }
    ],
    amenities: [
      '1 Double Bed + 1 Single Bed',
      'Air Conditioning',
      'Private Ensuite Bathroom',
      'Free High-Speed Wi-Fi',
      'Spacious Wardrobe & Luggage Area',
      'Seating Area',
      'Daily Housekeeping',
      'Tea & Coffee Setup'
    ],
    images: [
      { src: 'assets/images/nilwala_facilities_surrounding_environment_1156415683.jpg', title: 'Riverfront Property Grounds' },
      { src: 'assets/images/nilwala_facilities_balcony_terrace_1156415684.jpg', title: 'Riverside Terrace' }
    ]
  }
};

/**
 * Interactive Room Details Modal
 */
function initRoomDetailsModal() {
  const detailButtons = document.querySelectorAll('[data-open-room-details]');
  const modal = document.getElementById('roomDetailsModal');
  if (!modal || !detailButtons.length) return;

  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const roomId = btn.getAttribute('data-open-room-details');
      const room = HOTEL_ROOMS_DATA[roomId];
      if (!room) return;

      // Populate Modal Content
      const titleEl = modal.querySelector('.modal-room-title');
      const badgeEl = modal.querySelector('.modal-room-badge');
      const descEl = modal.querySelector('.modal-room-desc');
      const mainImg = modal.querySelector('.room-modal-main-img');
      const thumbsWrap = modal.querySelector('.room-modal-gallery-thumbs');
      const specsWrap = modal.querySelector('.room-modal-specs');
      const amenWrap = modal.querySelector('.room-modal-amenities');
      const bookBtn = modal.querySelector('.btn-modal-book');
      const waBtn = modal.querySelector('.btn-modal-wa');

      if (titleEl) titleEl.textContent = room.name;
      if (badgeEl) badgeEl.textContent = room.badge;
      if (descEl) descEl.textContent = room.desc;

      // Gallery Setup
      if (mainImg && room.images.length) {
        mainImg.src = room.images[0].src;
        mainImg.alt = room.images[0].title;
      }

      if (thumbsWrap) {
        thumbsWrap.innerHTML = '';
        room.images.forEach((img, idx) => {
          const thumbBtn = document.createElement('button');
          thumbBtn.type = 'button';
          thumbBtn.className = `room-thumb-btn ${idx === 0 ? 'active' : ''}`;
          thumbBtn.setAttribute('aria-label', img.title);
          thumbBtn.innerHTML = `<img src="${img.src}" alt="${img.title}">`;
          
          thumbBtn.addEventListener('click', () => {
            thumbsWrap.querySelectorAll('.room-thumb-btn').forEach(b => b.classList.remove('active'));
            thumbBtn.classList.add('active');
            mainImg.style.opacity = '0.3';
            setTimeout(() => {
              mainImg.src = img.src;
              mainImg.alt = img.title;
              mainImg.style.opacity = '1';
            }, 150);
          });

          thumbsWrap.appendChild(thumbBtn);
        });
      }

      // Specs
      if (specsWrap) {
        specsWrap.innerHTML = '';
        room.specs.forEach(s => {
          const chip = document.createElement('div');
          chip.className = 'room-spec-chip';
          chip.innerHTML = `
            <span class="room-spec-label">${s.label}</span>
            <span class="room-spec-val">${s.val}</span>
          `;
          specsWrap.appendChild(chip);
        });
      }

      // Amenities
      if (amenWrap) {
        amenWrap.innerHTML = '';
        room.amenities.forEach(a => {
          const item = document.createElement('div');
          item.className = 'room-modal-amenity';
          item.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${a}</span>
          `;
          amenWrap.appendChild(item);
        });
      }

      // Action Buttons
      if (bookBtn) {
        bookBtn.onclick = () => {
          modal.classList.remove('active');
          const bookingModal = document.getElementById('bookingModal');
          if (bookingModal) {
            const select = bookingModal.querySelector('select[name="roomType"]');
            if (select) select.value = room.name;
            bookingModal.classList.add('active');
            document.body.style.overflow = 'hidden';
          }
        };
      }

      if (waBtn) {
        const msg = encodeURIComponent(`Hello Hotel Nilwala Team, I am interested in inquiring about the ${room.name}. Could you please share current availability and seasonal rates?`);
        waBtn.href = `https://wa.me/94701708944?text=${msg}`;
      }

      // Show Modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
}

/**
 * Toast Notice System
 */
window.showToast = function(message, duration = 4000) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;
  
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
};
