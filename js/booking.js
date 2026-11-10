/**
 * HOTEL NILWALA - BOOKING & INQUIRY SYSTEM
 * Handles booking modal, inline booking forms, quick reservation bar,
 * wedding inquiry forms, contact page inquiries,
 * automated WhatsApp message formatting, and dual-email dispatch.
 */

document.addEventListener('DOMContentLoaded', () => {
  initBookingSystem();
  initWeddingInquirySystem();
  initContactInquirySystem();
});

const HOTEL_WHATSAPP = '94701708944'; // Format for wa.me: Sri Lanka (94) + 701708944
const HOTEL_PRIMARY_EMAIL = 'hotelnilwala1993@gmail.com';
const HOTEL_SECONDARY_EMAIL = 'shehanabey1@gmail.com';

/**
 * 1. Booking Inquiry System
 */
function initBookingSystem() {
  const forms = document.querySelectorAll('.booking-inquiry-form');

  forms.forEach(form => {
    // Setup date constraints (min date today, checkout > checkin)
    const checkinInput = form.querySelector('[name="checkin"]');
    const checkoutInput = form.querySelector('[name="checkout"]');

    if (checkinInput && checkoutInput) {
      const today = new Date().toISOString().split('T')[0];
      checkinInput.min = today;
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      checkoutInput.min = tomorrow.toISOString().split('T')[0];

      checkinInput.addEventListener('change', () => {
        if (checkinInput.value) {
          const nextDay = new Date(checkinInput.value);
          nextDay.setDate(nextDay.getDate() + 1);
          checkoutInput.min = nextDay.toISOString().split('T')[0];
          if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
            checkoutInput.value = nextDay.toISOString().split('T')[0];
          }
        }
      });
    }

    // WhatsApp submission button
    const btnWhatsApp = form.querySelector('.btn-submit-whatsapp');
    if (btnWhatsApp) {
      btnWhatsApp.addEventListener('click', (e) => {
        e.preventDefault();
        handleBookingSubmission(form, 'whatsapp');
      });
    }

    // Email submission button
    const btnEmail = form.querySelector('.btn-submit-email');
    if (btnEmail) {
      btnEmail.addEventListener('click', (e) => {
        e.preventDefault();
        handleBookingSubmission(form, 'email');
      });
    }

    // Generic form submit event handler (Enter key)
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleBookingSubmission(form, 'whatsapp');
    });
  });
}

function handleBookingSubmission(form, method) {
  const checkin = form.querySelector('[name="checkin"]')?.value?.trim();
  const checkout = form.querySelector('[name="checkout"]')?.value?.trim();
  const adults = form.querySelector('[name="adults"]')?.value || '1';
  const children = form.querySelector('[name="children"]')?.value || '0';
  const roomType = form.querySelector('[name="roomType"]')?.value?.trim() || 'General Inquiry';
  const guestName = form.querySelector('[name="guestName"]')?.value?.trim();
  const guestEmail = form.querySelector('[name="guestEmail"]')?.value?.trim();
  const guestPhone = form.querySelector('[name="guestPhone"]')?.value?.trim();
  const specialRequests = form.querySelector('[name="specialRequests"]')?.value?.trim() || 'None';

  // Validation
  if (!checkin) {
    alert('Please select your Check-in date.');
    form.querySelector('[name="checkin"]')?.focus();
    return;
  }
  if (!checkout) {
    alert('Please select your Check-out date.');
    form.querySelector('[name="checkout"]')?.focus();
    return;
  }
  if (!guestName) {
    alert('Please enter your full name.');
    form.querySelector('[name="guestName"]')?.focus();
    return;
  }
  if (!guestPhone) {
    alert('Please enter your contact phone or WhatsApp number.');
    form.querySelector('[name="guestPhone"]')?.focus();
    return;
  }
  if (!guestEmail || !validateEmail(guestEmail)) {
    alert('Please enter a valid email address.');
    form.querySelector('[name="guestEmail"]')?.focus();
    return;
  }

  // Calculate nights
  let nights = 1;
  try {
    const d1 = new Date(checkin);
    const d2 = new Date(checkout);
    const diffTime = Math.abs(d2 - d1);
    nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  } catch (err) {
    nights = 1;
  }

  if (method === 'whatsapp') {
    const message = 
`*HOTEL NILWALA - ROOM BOOKING INQUIRY*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Guest Name:* ${guestName}
*Phone / WhatsApp:* ${guestPhone}
*Email:* ${guestEmail}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Room Category:* ${roomType}
*Check-In Date:* ${checkin}
*Check-Out Date:* ${checkout} (${nights} night${nights > 1 ? 's' : ''})
*Guests:* ${adults} Adult(s), ${children} Child(ren)
*Special Requests:* ${specialRequests}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Inquiry sent from Hotel Nilwala Official Website_`;

    const encodedMsg = encodeURIComponent(message);
    const waUrl = `https://wa.me/${HOTEL_WHATSAPP}?text=${encodedMsg}`;

    if (window.showToast) {
      window.showToast('Opening WhatsApp with your booking details for Hotel Nilwala...');
    }

    closeAllModals();
    window.open(waUrl, '_blank');

  } else if (method === 'email') {
    const subject = encodeURIComponent(`Hotel Nilwala Booking Inquiry - ${guestName} (${roomType})`);
    const bodyContent = 
`Dear Hotel Nilwala Team,

I would like to inquire about room availability and current rates at Hotel Nilwala, Aluthgama:

GUEST & RESERVATION DETAILS:
- Full Name: ${guestName}
- Phone Number: ${guestPhone}
- Email Address: ${guestEmail}
- Preferred Room: ${roomType}
- Check-In Date: ${checkin}
- Check-Out Date: ${checkout} (${nights} night${nights > 1 ? 's' : ''})
- Number of Adults: ${adults}
- Number of Children: ${children}
- Special Requests: ${specialRequests}

Please confirm current seasonal rates, availability, and reservation confirmation details.

Warm regards,
${guestName}`;

    const encodedBody = encodeURIComponent(bodyContent);
    const mailtoUrl = `mailto:${HOTEL_PRIMARY_EMAIL}?cc=${HOTEL_SECONDARY_EMAIL}&subject=${subject}&body=${encodedBody}`;

    if (window.showToast) {
      window.showToast(`Opening your email client to contact ${HOTEL_PRIMARY_EMAIL}...`);
    }

    closeAllModals();
    window.location.href = mailtoUrl;
  }
}

/**
 * 2. Wedding & Special Events Inquiry Form
 */
function initWeddingInquirySystem() {
  const form = document.getElementById('weddingInquiryForm');
  if (!form) return;

  const btnWhatsApp = document.getElementById('btnWeddingWhatsApp') || form.querySelector('.btn-wedding-whatsapp');
  const btnEmail = document.getElementById('btnWeddingEmail') || form.querySelector('.btn-wedding-email');

  if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', (e) => {
      e.preventDefault();
      handleWeddingSubmission(form, 'whatsapp');
    });
  }

  if (btnEmail) {
    btnEmail.addEventListener('click', (e) => {
      e.preventDefault();
      handleWeddingSubmission(form, 'email');
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleWeddingSubmission(form, 'whatsapp');
  });
}

function handleWeddingSubmission(form, method) {
  const fullName = form.querySelector('[name="fullName"]')?.value?.trim() || form.querySelector('[name="name"]')?.value?.trim();
  const email = form.querySelector('[name="emailAddress"]')?.value?.trim() || form.querySelector('[name="email"]')?.value?.trim();
  const phone = form.querySelector('[name="phoneNumber"]')?.value?.trim() || form.querySelector('[name="phone"]')?.value?.trim();
  const eventDate = form.querySelector('[name="eventDate"]')?.value?.trim() || 'Date to be finalized';
  const eventType = form.querySelector('[name="eventType"]')?.value?.trim() || 'Wedding / Special Event';
  const guestsCount = form.querySelector('[name="guestsCount"]')?.value?.trim() || form.querySelector('[name="guests"]')?.value?.trim() || 'Not specified';
  const requirements = form.querySelector('[name="requirements"]')?.value?.trim() || 'None provided';

  if (!fullName) {
    alert('Please enter your full name.');
    return;
  }
  if (!phone) {
    alert('Please enter your contact phone or WhatsApp number.');
    return;
  }
  if (!email || !validateEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  if (method === 'whatsapp') {
    const message = 
`*HOTEL NILWALA - WEDDINGS & EVENTS INQUIRY*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Host Name:* ${fullName}
*Phone / WhatsApp:* ${phone}
*Email:* ${email}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Event Type:* ${eventType}
*Planned Date:* ${eventDate}
*Estimated Guests:* ${guestsCount}
*Additional Requirements:* ${requirements}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Sent via Hotel Nilwala Weddings & Events Portal_`;

    const encodedMsg = encodeURIComponent(message);
    const waUrl = `https://wa.me/${HOTEL_WHATSAPP}?text=${encodedMsg}`;

    if (window.showToast) {
      window.showToast('Preparing WhatsApp message to Hotel Nilwala Event Coordination...');
    }

    window.open(waUrl, '_blank');

  } else if (method === 'email') {
    const subject = encodeURIComponent(`Hotel Nilwala Event Inquiry - ${eventType} (${fullName})`);
    const bodyContent = 
`Dear Hotel Nilwala Events Team,

I would like to inquire about hosting a celebration at Hotel Nilwala, Aluthgama:

EVENT DETAILS:
- Host Full Name: ${fullName}
- Contact Phone: ${phone}
- Email Address: ${email}
- Event Type: ${eventType}
- Proposed Date: ${eventDate}
- Estimated Number of Guests: ${guestsCount}
- Special Arrangements / Requirements:
${requirements}

Please provide information on riverfront terrace availability, venue arrangements, catering menus, and package options.

Sincerely,
${fullName}`;

    const encodedBody = encodeURIComponent(bodyContent);
    const mailtoUrl = `mailto:${HOTEL_PRIMARY_EMAIL}?cc=${HOTEL_SECONDARY_EMAIL}&subject=${subject}&body=${encodedBody}`;

    if (window.showToast) {
      window.showToast(`Opening email to dispatch to ${HOTEL_PRIMARY_EMAIL}...`);
    }

    window.location.href = mailtoUrl;
  }
}

/**
 * 3. Contact Us Page Inquiry Form
 */
function initContactInquirySystem() {
  const form = document.getElementById('contactPageForm');
  if (!form) return;

  const btnWhatsApp = document.getElementById('btnContactWhatsApp');
  const btnEmail = document.getElementById('btnContactEmail');

  if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', (e) => {
      e.preventDefault();
      handleContactSubmission(form, 'whatsapp');
    });
  }

  if (btnEmail) {
    btnEmail.addEventListener('click', (e) => {
      e.preventDefault();
      handleContactSubmission(form, 'email');
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleContactSubmission(form, 'whatsapp');
  });
}

function handleContactSubmission(form, method) {
  const fullName = form.querySelector('[name="fullName"]')?.value?.trim();
  const email = form.querySelector('[name="emailAddress"]')?.value?.trim();
  const phone = form.querySelector('[name="phoneNumber"]')?.value?.trim();
  const subject = form.querySelector('[name="subject"]')?.value?.trim() || 'General Inquiry';
  const message = form.querySelector('[name="message"]')?.value?.trim();

  if (!fullName) {
    alert('Please enter your full name.');
    form.querySelector('[name="fullName"]')?.focus();
    return;
  }
  if (!email || !validateEmail(email)) {
    alert('Please enter a valid email address.');
    form.querySelector('[name="emailAddress"]')?.focus();
    return;
  }
  if (!phone) {
    alert('Please enter your contact phone number.');
    form.querySelector('[name="phoneNumber"]')?.focus();
    return;
  }
  if (!message) {
    alert('Please enter your message.');
    form.querySelector('[name="message"]')?.focus();
    return;
  }

  if (method === 'whatsapp') {
    const waText = 
`*HOTEL NILWALA - CONTACT MESSAGE*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Name:* ${fullName}
*Phone:* ${phone}
*Email:* ${email}
*Subject:* ${subject}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Message:*
${message}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Sent via Hotel Nilwala Website Contact Page_`;

    const encodedMsg = encodeURIComponent(waText);
    const waUrl = `https://wa.me/${HOTEL_WHATSAPP}?text=${encodedMsg}`;

    if (window.showToast) {
      window.showToast('Redirecting to WhatsApp to send your message to Hotel Nilwala...');
    }

    window.open(waUrl, '_blank');

  } else if (method === 'email') {
    const mailSubject = encodeURIComponent(`Hotel Nilwala Website Inquiry: ${subject} - ${fullName}`);
    const mailBody = 
`Dear Hotel Nilwala Team,

You have received a new contact inquiry via the Hotel Nilwala website:

FROM:
- Full Name: ${fullName}
- Email: ${email}
- Phone: ${phone}
- Subject: ${subject}

MESSAGE:
${message}

Sent on: ${new Date().toLocaleString()}
Warm regards,
${fullName}`;

    const encodedBody = encodeURIComponent(mailBody);
    const mailtoUrl = `mailto:${HOTEL_PRIMARY_EMAIL}?cc=${HOTEL_SECONDARY_EMAIL}&subject=${mailSubject}&body=${encodedBody}`;

    if (window.showToast) {
      window.showToast(`Opening your email client to send to ${HOTEL_PRIMARY_EMAIL}...`);
    }

    window.location.href = mailtoUrl;
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function closeAllModals() {
  const modals = document.querySelectorAll('.modal-overlay');
  modals.forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
}
