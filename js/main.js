/**
 * BHUTAN HINDU DHARMA SABHA & THIMPHU HINDU TEMPLE (SAMTELING)
 * Sacred Web Audio Bell Chimes, Donation Gateway, Puja Booking & Live Aarti
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Web Audio API Sacred Temple Bell Chime
  let audioCtx = null;

  function playTempleBell() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;

      // Bell fundamental frequencies (Tibetan & Himalayan temple bell harmonics)
      const frequencies = [432, 864, 1296, 1728];
      const gains = [0.4, 0.25, 0.15, 0.08];

      frequencies.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Exponential decay of bell resonance
        gainNode.gain.setValueAtTime(gains[idx], now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 3.5);
      });

      showTempleToast('🔔 Om Namah Shivaya! Divine Temple Bell chimed in Samteling Temple.');
    } catch (err) {
      console.warn('Audio playback error', err);
    }
  }

  const bellTrigger = document.getElementById('templeBellBtn');
  const omMedallion = document.getElementById('omCrestBtn');
  bellTrigger?.addEventListener('click', playTempleBell);
  omMedallion?.addEventListener('click', playTempleBell);

  // 2. Modern Native Dialog Light Dismiss Fallback
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const isOutside = (e, dialog) => {
      const rect = dialog.getBoundingClientRect();
      return e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;
    };
    document.querySelectorAll('dialog').forEach(dialog => {
      let pressedOutside = false;
      dialog.addEventListener('pointerdown', (e) => {
        pressedOutside = isOutside(e, dialog);
      });
      dialog.addEventListener('pointerup', (e) => {
        if (pressedOutside && isOutside(e, dialog)) {
          dialog.close();
        }
      });
    });
  }

  // 3. Modal Dialog Triggers
  const donationModal = document.getElementById('donationModal');
  const pujaModal = document.getElementById('pujaModal');
  const liveModal = document.getElementById('liveModal');
  const galleryModal = document.getElementById('galleryModal');
  const newsModal = document.getElementById('newsModal');

  // Open Donation Modal
  document.querySelectorAll('[data-open-modal="donate"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      donationModal?.showModal();
    });
  });

  // Open Puja Booking Modal
  document.querySelectorAll('[data-open-modal="puja"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pujaName = btn.getAttribute('data-puja') || 'Special Archana & Puja';
      const select = document.getElementById('pujaTypeSelect');
      if (select) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].text.toLowerCase().includes(pujaName.toLowerCase())) {
            select.selectedIndex = i;
            break;
          }
        }
      }
      pujaModal?.showModal();
    });
  });

  // Open Live Aarti Modal
  document.querySelectorAll('[data-open-modal="live"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      liveModal?.showModal();
    });
  });

  // Close modals
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      document.getElementById(modalId)?.close();
    });
  });

  // 4. Donation Amount Selector
  window.selectDonationAmount = (amount) => {
    const customInput = document.getElementById('customDonationInput');
    if (customInput) customInput.value = amount;
    document.querySelectorAll('.donation-preset-btn').forEach(btn => {
      if (btn.getAttribute('data-amt') == amount) {
        btn.style.background = '#f59e0b';
        btn.style.color = '#071727';
        btn.style.borderColor = '#d97706';
      } else {
        btn.style.background = '#fff';
        btn.style.color = '#334155';
        btn.style.borderColor = '#cbd5e1';
      }
    });
  };

  // Donation Form Submission
  const donationForm = document.getElementById('donationForm');
  if (donationForm) {
    donationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = document.getElementById('customDonationInput')?.value || '501';
      const donorName = document.getElementById('donorName')?.value || 'Devotee';
      const cause = document.getElementById('donationCauseSelect')?.value || 'Temple Seva';
      donationModal?.close();
      playTempleBell();
      showTempleToast(`🙏 Pranam & Blessings! Thank you ${donorName} for your offering of Nu. ${amount} to ${cause}. Blessed digital receipt #BHDS-REC-${Math.floor(10000 + Math.random() * 90000)} generated.`);
      donationForm.reset();
    });
  }

  // 5. Puja Form Submission
  const pujaForm = document.getElementById('pujaBookingForm');
  if (pujaForm) {
    pujaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('devoteeName')?.value || 'Devotee';
      const puja = document.getElementById('pujaTypeSelect')?.value || 'Special Puja';
      const date = document.getElementById('pujaDate')?.value || 'Selected Date';
      pujaModal?.close();
      playTempleBell();
      showTempleToast(`🕉️ Puja Confirmed! Sankalpa for ${puja} scheduled for ${name} on ${date}. Head Acharya in Samteling Temple has been notified.`);
      pujaForm.reset();
    });
  }

  // 6. Gallery Lightbox Handler
  window.openGalleryZoom = (imgSrc, caption) => {
    const zoomImg = document.getElementById('galleryZoomImg');
    const zoomCap = document.getElementById('galleryZoomCaption');
    if (zoomImg) zoomImg.src = imgSrc;
    if (zoomCap) zoomCap.textContent = caption;
    galleryModal?.showModal();
  };

  // 7. News Article Reader
  window.readTempleNews = (title, date, summary) => {
    const titleEl = document.getElementById('newsModalTitle');
    const bodyEl = document.getElementById('newsModalBody');
    if (titleEl) titleEl.textContent = title;
    if (bodyEl) {
      bodyEl.innerHTML = `
        <div style="font-size:0.75rem; color:#94a3b8; margin-bottom:12px; font-weight:700;">PUBLISHED: ${date} &bull; SAMTELING TEMPLE SECRETARIAT</div>
        <p style="font-size:0.92rem; color:#334155; line-height:1.7; margin-bottom:14px;">${summary}</p>
        <p style="font-size:0.85rem; color:#64748b; line-height:1.6;">
          Under the auspices of the Bhutan Hindu Dharma Sabha, all community members, pilgrims and tourists are cordially invited to participate. For volunteer service (Seva) or prasadam sponsorship, kindly contact the central committee office.
        </p>
      `;
    }
    newsModal?.showModal();
  };

  // Toast Notification Helper
  function showTempleToast(msg) {
    let container = document.getElementById('templeToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'templeToastContainer';
      container.style.position = 'fixed';
      container.style.bottom = '24px';
      container.style.right = '24px';
      container.style.zIndex = '9999';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '10px';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.background = '#071727';
    toast.style.color = '#ffffff';
    toast.style.padding = '14px 20px';
    toast.style.borderRadius = '10px';
    toast.style.borderLeft = '4px solid #f59e0b';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.35)';
    toast.style.fontSize = '0.88rem';
    toast.style.fontWeight = '600';
    toast.style.maxWidth = '380px';
    toast.style.lineHeight = '1.4';
    toast.innerHTML = msg;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }
});
