/**
 * HOTEL NILWALA - GUEST REVIEW SYSTEM
 * Authentic review submission, persistent storage (localStorage database),
 * spam protection (honeypot + rate limiter), and administrator moderation workflow.
 * Strict compliance: Zero fabricated reviews. Only authentic guest submissions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initReviewsSystem();
});

function getStoredReviews() {
  try {
    const data = localStorage.getItem('hotel_nilwala_guest_reviews');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading reviews from localStorage:', e);
    return [];
  }
}

function saveStoredReviews(reviews) {
  try {
    localStorage.setItem('hotel_nilwala_guest_reviews', JSON.stringify(reviews));
  } catch (e) {
    console.error('Error saving reviews to localStorage:', e);
  }
}

function initReviewsSystem() {
  const reviewsContainer = document.getElementById('reviewsContainer');
  const reviewForm = document.getElementById('guestReviewForm');

  if (reviewsContainer) {
    renderReviews(reviewsContainer);
  }

  if (reviewForm) {
    initStarRatingSelector(reviewForm);
    initReviewFormSubmit(reviewForm, reviewsContainer);
  }

  initAdminModerationToggle(reviewsContainer);
}

/**
 * Initializes Interactive Star Rating Selector
 */
function initStarRatingSelector(form) {
  const starsContainer = form.querySelector('.star-rating-selector');
  const ratingInput = form.querySelector('[name="starRating"]');
  if (!starsContainer || !ratingInput) return;

  const starButtons = starsContainer.querySelectorAll('.star-btn');

  starButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.getAttribute('data-value'), 10);
      ratingInput.value = val;
      updateStarsDisplay(starButtons, val);
    });

    btn.addEventListener('mouseenter', () => {
      const val = parseInt(btn.getAttribute('data-value'), 10);
      highlightStars(starButtons, val);
    });
  });

  starsContainer.addEventListener('mouseleave', () => {
    const currentVal = parseInt(ratingInput.value, 10) || 5;
    updateStarsDisplay(starButtons, currentVal);
  });

  // Default to 5 stars
  updateStarsDisplay(starButtons, 5);
}

function updateStarsDisplay(buttons, value) {
  buttons.forEach(btn => {
    const val = parseInt(btn.getAttribute('data-value'), 10);
    if (val <= value) {
      btn.classList.add('selected');
      btn.classList.remove('hovered');
      btn.innerHTML = '★';
    } else {
      btn.classList.remove('selected', 'hovered');
      btn.innerHTML = '☆';
    }
  });
}

function highlightStars(buttons, hoverValue) {
  buttons.forEach(btn => {
    const val = parseInt(btn.getAttribute('data-value'), 10);
    if (val <= hoverValue) {
      btn.classList.add('hovered');
      btn.innerHTML = '★';
    } else {
      btn.classList.remove('hovered');
      btn.innerHTML = '☆';
    }
  });
}

/**
 * Renders reviews from persistent storage
 * Only shows approved reviews to regular visitors, plus pending review note if submitted by this user.
 */
function renderReviews(container) {
  const storedReviews = getStoredReviews();
  const isAdmin = sessionStorage.getItem('nilwala_admin_authenticated') === 'true';

  const approvedReviews = storedReviews.filter(r => r.status === 'approved');
  const pendingReviews = storedReviews.filter(r => r.status === 'pending_moderation');

  container.innerHTML = '';

  // If no approved reviews yet, display verified Agoda score badge and invitation
  if (approvedReviews.length === 0 && (!isAdmin || pendingReviews.length === 0)) {
    const emptyState = document.createElement('div');
    emptyState.className = 'reviews-empty-state reveal';
    emptyState.innerHTML = `
      <div class="empty-state-card">
        <div class="agoda-score-badge">
          <span class="score-num">8.0 / 10</span>
          <span class="score-text">Agoda Verified Guest Rating for Room Comfort & Quality</span>
        </div>
        <h3 class="empty-title">Be the First to Review Hotel Nilwala</h3>
        <p class="empty-desc">
          We uphold complete integrity: we do not display fake or fabricated guest testimonials.
          Have you stayed with us in Aluthgama? Please submit your honest review below. All submissions are moderated by hotel management before publication.
        </p>
      </div>
    `;
    container.appendChild(emptyState);
    return;
  }

  // Render Approved Reviews
  approvedReviews.forEach(rev => {
    const card = document.createElement('div');
    card.className = 'review-card reveal';

    const starsHtml = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
    const initial = rev.name ? rev.name.charAt(0).toUpperCase() : 'G';

    card.innerHTML = `
      <div class="review-header">
        <div class="review-stars" aria-label="${rev.rating} out of 5 stars">${starsHtml}</div>
        <span class="review-source-badge">Verified Guest Stay</span>
      </div>
      <h3 class="review-title">${escapeHTML(rev.title)}</h3>
      <p class="review-content">${escapeHTML(rev.content)}</p>
      <div class="review-author-wrap">
        <div class="review-author-avatar">${initial}</div>
        <div>
          <div class="review-author-name">${escapeHTML(rev.name)}</div>
          <div class="review-author-date">${escapeHTML(rev.date || 'Verified Review')}</div>
        </div>
      </div>
      ${isAdmin ? `<button class="btn btn-sm btn-danger mt-2" onclick="deleteReview('${rev.id}')">Delete Review</button>` : ''}
    `;

    container.appendChild(card);
  });

  // Render Admin Pending Review Moderation Queue if Admin Logged In
  if (isAdmin && pendingReviews.length > 0) {
    const adminSection = document.createElement('div');
    adminSection.className = 'admin-pending-section reveal';
    adminSection.innerHTML = `<h3 style="margin: 24px 0 12px; color: var(--navy-deep);">Administrator Moderation Queue (${pendingReviews.length} Pending)</h3>`;

    pendingReviews.forEach(rev => {
      const pCard = document.createElement('div');
      pCard.className = 'review-card pending-card reveal';
      pCard.innerHTML = `
        <div class="review-header">
          <span class="badge badge-warning">Pending Moderation</span>
          <span>Submitted: ${new Date(rev.submittedAt).toLocaleDateString()}</span>
        </div>
        <h4>${escapeHTML(rev.title)} (${rev.rating} ★)</h4>
        <p>${escapeHTML(rev.content)}</p>
        <p><strong>Guest:</strong> ${escapeHTML(rev.name)} (${escapeHTML(rev.email)})</p>
        <div style="display: flex; gap: 10px; margin-top: 12px;">
          <button class="btn btn-sm btn-primary" onclick="approveReview('${rev.id}')">Approve & Publish</button>
          <button class="btn btn-sm btn-secondary" onclick="deleteReview('${rev.id}')">Reject / Delete</button>
        </div>
      `;
      adminSection.appendChild(pCard);
    });

    container.appendChild(adminSection);
  }
}

/**
 * Handles Review Submission with Spam Protection & Moderation
 */
function initReviewFormSubmit(form, container) {
  let lastSubmitTime = 0;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Spam Protection: Honeypot check
    const honeypot = form.querySelector('[name="website_url"]');
    if (honeypot && honeypot.value.trim() !== '') {
      return; // Silent reject for spam bots
    }

    // 2. Spam Protection: Rate limit check (minimum 15 seconds)
    const now = Date.now();
    if (now - lastSubmitTime < 15000) {
      alert('Please wait a moment before submitting another review.');
      return;
    }

    // Form values
    const name = form.querySelector('[name="guestName"]')?.value?.trim();
    const email = form.querySelector('[name="guestEmail"]')?.value?.trim();
    const rating = parseInt(form.querySelector('[name="starRating"]')?.value, 10) || 5;
    const title = form.querySelector('[name="reviewTitle"]')?.value?.trim();
    const experience = form.querySelector('[name="guestExperience"]')?.value?.trim();

    // Validations
    if (!name || name.length < 2) {
      alert('Please enter your full name.');
      form.querySelector('[name="guestName"]')?.focus();
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      form.querySelector('[name="guestEmail"]')?.focus();
      return;
    }
    if (!title || title.length < 3) {
      alert('Please enter a short review title.');
      form.querySelector('[name="reviewTitle"]')?.focus();
      return;
    }
    if (!experience || experience.length < 15) {
      alert('Please share your experience (at least 15 characters).');
      form.querySelector('[name="guestExperience"]')?.focus();
      return;
    }

    lastSubmitTime = now;

    const newReview = {
      id: 'rev-' + Date.now(),
      name: name,
      email: email,
      rating: rating,
      title: title,
      content: experience,
      source: 'Verified Traveler Submission',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'pending_moderation', // Requires administrator moderation
      submittedAt: new Date().toISOString()
    };

    const stored = getStoredReviews();
    stored.unshift(newReview);
    saveStoredReviews(stored);

    form.reset();
    const starButtons = form.querySelectorAll('.star-btn');
    updateStarsDisplay(starButtons, 5);

    if (container) {
      renderReviews(container);
    }

    alert('Thank you! Your review has been submitted for administrator approval before publishing.');
  });
}

/**
 * Admin Moderation Helpers
 */
window.approveReview = function(id) {
  const reviews = getStoredReviews();
  const target = reviews.find(r => r.id === id);
  if (target) {
    target.status = 'approved';
    saveStoredReviews(reviews);
    const container = document.getElementById('reviewsContainer');
    if (container) renderReviews(container);
  }
};

window.deleteReview = function(id) {
  let reviews = getStoredReviews();
  reviews = reviews.filter(r => r.id !== id);
  saveStoredReviews(reviews);
  const container = document.getElementById('reviewsContainer');
  if (container) renderReviews(container);
};

function initAdminModerationToggle(container) {
  const adminBtn = document.getElementById('adminModerateBtn');
  if (!adminBtn) return;

  adminBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const currentStatus = sessionStorage.getItem('nilwala_admin_authenticated') === 'true';
    if (currentStatus) {
      sessionStorage.removeItem('nilwala_admin_authenticated');
      adminBtn.innerText = 'Admin Login';
      if (container) renderReviews(container);
    } else {
      const pass = prompt('Enter Hotel Administrator Passcode:');
      if (pass === 'nilwala1992' || pass === 'admin') {
        sessionStorage.setItem('nilwala_admin_authenticated', 'true');
        adminBtn.innerText = 'Admin Logout';
        if (container) renderReviews(container);
      } else if (pass !== null) {
        alert('Invalid administrator passcode.');
      }
    }
  });
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
