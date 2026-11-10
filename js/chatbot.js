/**
 * HOTEL NILWALA - LIVE CHATBOT ("Hotel Nilwala Team")
 * Interactive FAQ-based chatbot powered by verified hotel knowledge.
 * Adheres strictly to hospitality guidelines and provides WhatsApp handover.
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveChatbot();
});

function initLiveChatbot() {
  const WHATSAPP_NUMBER = '94701708944';
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Hotel Nilwala Team, I am inquiring from your website chat.')}`;

  // Find or create Chatbot DOM
  let widget = document.querySelector('.chatbot-widget');
  if (!widget) {
    widget = createChatbotWidget(WHATSAPP_LINK);
    document.body.appendChild(widget);
  }

  const triggerBtn = widget.querySelector('.chatbot-trigger-btn');
  const chatBox = widget.querySelector('.chatbot-box');
  const closeBtn = widget.querySelector('.chatbot-close-btn');
  const messagesArea = widget.querySelector('.chatbot-messages-area');
  const inputField = widget.querySelector('.chatbot-input');
  const sendBtn = widget.querySelector('.chatbot-send-btn');
  const unreadDot = widget.querySelector('.chatbot-unread-dot');

  // Toggle chat window
  triggerBtn.addEventListener('click', () => {
    chatBox.classList.toggle('open');
    if (chatBox.classList.contains('open')) {
      if (unreadDot) unreadDot.style.display = 'none';
      inputField.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    chatBox.classList.remove('open');
  });

  // Handle Quick Replies
  messagesArea.addEventListener('click', (e) => {
    const pill = e.target.closest('.quick-reply-pill');
    if (pill) {
      const query = pill.getAttribute('data-query') || pill.textContent.trim();
      handleUserMessage(query, messagesArea, WHATSAPP_LINK);
    }
  });

  // Handle Send Button & Enter Key
  const sendMessage = () => {
    const text = inputField.value.trim();
    if (!text) return;
    inputField.value = '';
    handleUserMessage(text, messagesArea, WHATSAPP_LINK);
  };

  sendBtn.addEventListener('click', sendMessage);
  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });
}

/**
 * Creates the Chatbot HTML structure if not already embedded
 */
function createChatbotWidget(whatsappLink) {
  const container = document.createElement('div');
  container.className = 'chatbot-widget';
  container.innerHTML = `
    <!-- Floating Trigger Button -->
    <button class="chatbot-trigger-btn" aria-label="Open Chat with Hotel Nilwala Team">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span class="chatbot-unread-dot"></span>
    </button>

    <!-- Chat Window Container -->
    <div class="chatbot-box" role="dialog" aria-label="Hotel Nilwala Live Chat">
      <div class="chatbot-header">
        <div class="chatbot-team-info">
          <img src="assets/logo/hotel-nilwala-logo.jpg" alt="Hotel Nilwala Logo" class="chatbot-avatar">
          <div>
            <div class="chatbot-title-text">Hotel Nilwala Team</div>
            <div class="chatbot-status-row">
              <span class="status-dot-active"></span>
              <span>Online • Welcoming since 1992</span>
            </div>
          </div>
        </div>
        <button class="chatbot-close-btn" aria-label="Close Chat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="chatbot-messages-area">
        <div class="chat-bubble bot">
          <strong>Hello! Welcome to Hotel Nilwala.</strong><br>
          How can we help you today?
        </div>
        <div class="chat-quick-replies">
          <button type="button" class="quick-reply-pill" data-query="Room Inquiries">Room Inquiries</button>
          <button type="button" class="quick-reply-pill" data-query="Booking Assistance">Booking Assistance</button>
          <button type="button" class="quick-reply-pill" data-query="Boat Safari">Boat Safari</button>
          <button type="button" class="quick-reply-pill" data-query="Wedding Inquiries">Wedding Inquiries</button>
          <button type="button" class="quick-reply-pill" data-query="Nearby Activities">Nearby Activities</button>
          <button type="button" class="quick-reply-pill" data-query="Contact Hotel">Contact Hotel</button>
        </div>
      </div>

      <div class="chatbot-input-area">
        <input type="text" class="chatbot-input" placeholder="Ask about rooms, safaris, weddings..." aria-label="Type your message">
        <button class="chatbot-send-btn" aria-label="Send message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  `;
  return container;
}

/**
 * Handles sending user message and generating verified bot response
 */
function handleUserMessage(userText, messagesArea, whatsappLink) {
  // Append User message
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.textContent = userText;
  messagesArea.appendChild(userBubble);
  scrollToBottom(messagesArea);

  // Generate bot response with small natural typing pause
  setTimeout(() => {
    const reply = getVerifiedHotelResponse(userText.toLowerCase(), whatsappLink);
    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot';
    botBubble.innerHTML = reply.html;
    messagesArea.appendChild(botBubble);

    // If quick replies are provided, append them
    if (reply.quickReplies && reply.quickReplies.length) {
      const qrWrap = document.createElement('div');
      qrWrap.className = 'chat-quick-replies';
      reply.quickReplies.forEach(qr => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quick-reply-pill';
        btn.setAttribute('data-query', qr);
        btn.textContent = qr;
        qrWrap.appendChild(btn);
      });
      messagesArea.appendChild(qrWrap);
    }

    scrollToBottom(messagesArea);
  }, 350);
}

/**
 * Knowledge Base Engine - Strictly adheres to verified facts
 */
function getVerifiedHotelResponse(query, whatsappLink) {
  // Handover Button Component
  const handoverBtn = `
    <div style="margin-top: 10px;">
      <a href="${whatsappLink}" target="_blank" class="btn btn-whatsapp btn-sm" style="font-size: 0.8rem; padding: 7px 14px; display: inline-flex; align-items: center; gap: 6px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
        </svg>
        Chat on WhatsApp (0701708944)
      </a>
    </div>
  `;

  // 1. Room inquiries & categories
  if (query.includes('room') || query.includes('accommodation') || query.includes('bed') || query.includes('deluxe') || query.includes('standard')) {
    return {
      html: `
        <strong>Hotel Nilwala Accommodations:</strong><br>
        We offer approximately 10 comfortable boutique rooms, featuring:
        <ul style="margin: 6px 0 6px 18px; font-size: 0.85rem; line-height: 1.5;">
          <li><strong>Deluxe Double Room with Balcony:</strong> Overlooking the scenic river & ocean breeze, double/queen bed, private balcony.</li>
          <li><strong>Superior River View Room:</strong> Riverfront views with patio/terrace and modern ensuite bathroom.</li>
          <li><strong>Standard Double Room:</strong> Clean, comfortable, air-conditioned with attached bathroom and Wi-Fi.</li>
          <li><strong>Family / Triple Configuration:</strong> Spacious layout suitable for small families or groups.</li>
        </ul>
        All rooms feature air conditioning, private bathrooms, and free Wi-Fi.<br>
        <em>For current rates and real-time room availability, our team is happy to assist:</em>
        ${handoverBtn}
      `,
      quickReplies: ['Booking Assistance', 'Boat Safari', 'Contact Hotel']
    };
  }

  // 2. Booking Assistance / How to book
  if (query.includes('book') || query.includes('reserve') || query.includes('reservation') || query.includes('rate') || query.includes('price')) {
    return {
      html: `
        <strong>Booking Assistance:</strong><br>
        You can make a direct booking inquiry via our online booking form or message our team directly on WhatsApp.<br>
        To ensure you receive the most accurate current seasonal rates and personal attention, we verify each inquiry individually.<br>
        ${handoverBtn}
      `,
      quickReplies: ['Room Inquiries', 'Contact Hotel']
    };
  }

  // 3. Location & Directions
  if (query.includes('location') || query.includes('where') || query.includes('address') || query.includes('map') || query.includes('station') || query.includes('aluthgama')) {
    return {
      html: `
        <strong>Location & Accessibility:</strong><br>
        <strong>Address:</strong> Galle Road, Kaluwamodara, Aluthgama, Sri Lanka.<br>
        • Beautifully situated along the river and very close to the beach.<br>
        • Just 0.1 km from Aluthgama Railway Station (very easy walking distance).<br>
        • Approximately 1.3 km from Bentota Station.<br>
        • Convenient access via the main coastal Galle Road.
        ${handoverBtn}
      `,
      quickReplies: ['Nearby Activities', 'Room Inquiries']
    };
  }

  // 4. Boat Safari & River Activities
  if (query.includes('boat') || query.includes('safari') || query.includes('river') || query.includes('water sports') || query.includes('kayak') || query.includes('ski')) {
    return {
      html: `
        <strong>River Experiences & Boat Safari:</strong><br>
        Hotel Nilwala is blessed with direct river access along the famous waterways of Aluthgama and Bentota.<br>
        • <strong>Boat Safari:</strong> We gladly arrange authentic river boat safaris to explore mangroves, wildlife, and river scenery.<br>
        • <strong>Water Sports:</strong> Jet skiing, water skiing, banana boat rides, and river excursions can be coordinated through the hotel.<br>
        • <strong>River Terrace:</strong> Enjoy peaceful river views right from our outdoor dining and relaxation areas.
        ${handoverBtn}
      `,
      quickReplies: ['Booking Assistance', 'Nearby Activities', 'Contact Hotel']
    };
  }

  // 5. Beach
  if (query.includes('beach') || query.includes('sea') || query.includes('ocean') || query.includes('swim')) {
    return {
      html: `
        <strong>Beach & Coastal Relaxation:</strong><br>
        Hotel Nilwala is located moments away from Moragalla Beach and Bentota Golden Beach. You can enjoy the best of both worlds: serene river frontage and walking access to the sandy tropical beach for sunset strolls and swimming.
        ${handoverBtn}
      `,
      quickReplies: ['Boat Safari', 'Room Inquiries']
    };
  }

  // 6. Weddings & Special Events
  if (query.includes('wedding') || query.includes('event') || query.includes('celebration') || query.includes('party') || query.includes('reception') || query.includes('gathering')) {
    return {
      html: `
        <strong>Weddings & Celebrations:</strong><br>
        Celebrate your special day with the romantic backdrop of the river! Hotel Nilwala hosts:<br>
        • Wedding receptions & intimate ceremonies<br>
        • Anniversary & birthday celebrations<br>
        • Family gatherings & private dinners<br>
        • Group riverfront events<br>
        <em>Please contact our event coordination team directly to discuss arrangements, dates, and customized arrangements:</em>
        ${handoverBtn}
      `,
      quickReplies: ['Contact Hotel', 'Booking Assistance']
    };
  }

  // 7. Check-in / Check-out & General Facilities
  if (query.includes('check-in') || query.includes('checkin') || query.includes('checkout') || query.includes('pool') || query.includes('facilities') || query.includes('restaurant') || query.includes('wifi') || query.includes('amenities')) {
    return {
      html: `
        <strong>Hotel Nilwala Facilities:</strong><br>
        • <strong>Standard Check-in:</strong> from 2:00 PM<br>
        • <strong>Standard Check-out:</strong> until 11:00 AM / 12:00 PM (flexible upon prior arrangement)<br>
        • <strong>Property Features:</strong> Riverside garden terrace, on-site dining & bar, river boat safaris & water sports arrangements, free Wi-Fi, 24-hour reception assistance, free private parking.<br>
        ${handoverBtn}
      `,
      quickReplies: ['Room Inquiries', 'Contact Hotel']
    };
  }

  // 8. Nearby Attractions
  if (query.includes('attraction') || query.includes('nearby') || query.includes('temple') || query.includes('garden') || query.includes('brief') || query.includes('bawa') || query.includes('turtle')) {
    return {
      html: `
        <strong>Nearby Attractions around Aluthgama & Bentota:</strong><br>
        • <strong>Kande Viharaya Temple (~2.5 km):</strong> Renowned historic Buddhist temple with a giant sitting Buddha statue.<br>
        • <strong>Brief Garden by Bevis Bawa (~8 km):</strong> World-famous lush landscape garden.<br>
        • <strong>Kosgoda Turtle Conservation Project (~10 km):</strong> Sea turtle sanctuary along the southern coast.<br>
        • <strong>Bentota Beach & Water Sports:</strong> Just minutes away.<br>
        • <strong>Bentota River Safari:</strong> Organized directly by Hotel Nilwala.
        ${handoverBtn}
      `,
      quickReplies: ['Boat Safari', 'Contact Hotel']
    };
  }

  // 9. Contact Details
  if (query.includes('contact') || query.includes('phone') || query.includes('call') || query.includes('number') || query.includes('email') || query.includes('whatsapp')) {
    return {
      html: `
        <strong>Hotel Nilwala Contact Information:</strong><br>
        <strong>Address:</strong> Galle Road, Kaluwamodara, Aluthgama, Sri Lanka.<br>
        <strong>Telephones:</strong><br>
        • +94 34 227 5017<br>
        • 0344 939 755<br>
        • +94 777 470 529<br>
        <strong>WhatsApp:</strong> 0701708944<br>
        <strong>Emails:</strong><br>
        • hotelnilwala1993@gmail.com<br>
        • shehanabey1@gmail.com
        ${handoverBtn}
      `,
      quickReplies: ['Booking Assistance', 'Room Inquiries']
    };
  }

  // 10. Fallback message (strictly as requested in prompt)
  return {
    html: `
      Thank you for contacting Hotel Nilwala. For further assistance, please contact our Hotel Nilwala Team through WhatsApp.
      ${handoverBtn}
    `,
    quickReplies: ['Room Inquiries', 'Boat Safari', 'Wedding Inquiries', 'Contact Hotel']
  };
}

function scrollToBottom(el) {
  el.scrollTop = el.scrollHeight;
}
