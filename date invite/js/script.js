/**
 * ==========================================================================
 * DATE INVITATION APPLICATION ENGINE - PREMIUM & FULLY REPAIRED
 * ==========================================================================
 */
const DateInvitationApp = (() => {
  // Application State
  const state = {
    currentStep: 1,
    totalSteps: 6,
    recipientName: '',
    selectedDate: '',
    selectedTimeSlot: '',
    exactTime: '',
    selectedActivity: '',
    userMessage: '',
    isMusicPlaying: false,
    localStorageKey: 'premium_date_invite_state_v2'
  };

  // Cached Elements DOM References
  let elements = {};

  const initDOMElements = () => {
    elements = {
      phoneContainer: document.querySelector('.phone'),
      progressBar: document.getElementById('progress'),
      recipientNameInput: document.getElementById('recipientName'),
      envelope: document.getElementById('envelope'),
      polaroidCap: document.getElementById('polaroidCap'),
      askHeadline: document.getElementById('askHeadline'),
      noBtn: document.getElementById('noBtn'),
      dateInput: document.getElementById('dateInput'),
      timeChips: document.querySelectorAll('#timeChips .chip'),
      clockInput: document.getElementById('clockInput'),
      actCards: document.querySelectorAll('#actGrid .act-card'),
      msgInput: document.getElementById('msgInput'),
      bgMusic: document.getElementById('bgMusic'),
      toastContainer: document.getElementById('toastContainer'),
      bloomFlash: document.getElementById('bloomFlash'),
      loadingOverlay: document.getElementById('loadingOverlay'),
      premiumTicket: document.getElementById('premiumTicket'),
      sparklesContainer: document.getElementById('sparklesContainer'),
      flowerShowerContainer: document.getElementById('flowerShowerContainer'),
      // Ticket DOM Outputs
      tName: document.getElementById('tName'),
      tDate: document.getElementById('tDate'),
      tAct: document.getElementById('tAct'),
      tMsg: document.getElementById('tMsg'),
      // Screens
      screens: {
        's-envelope': document.getElementById('s-envelope'),
        's-ask': document.getElementById('s-ask'),
        's-date': document.getElementById('s-date'),
        's-activity': document.getElementById('s-activity'),
        's-message': document.getElementById('s-message'),
        's-ticket': document.getElementById('s-ticket')
      }
    };
  };

  /**
   * ==========================================================================
   * FEEDBACK & TOAST ENGINE
   * ==========================================================================
   */
  const showToast = (message, duration = 3000) => {
    if (!elements.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✨</span><span>${message}</span>`;
    elements.toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => {
        toast.remove();
      });
    }, duration);
  };

  /**
   * ==========================================================================
   * PROGRESS BAR INDICATOR
   * ==========================================================================
   */
  const updateProgressBar = () => {
    if (!elements.progressBar) return;
    const progressPercentage = ((state.currentStep - 1) / (state.totalSteps - 1)) * 100;
    elements.progressBar.style.width = `${progressPercentage}%`;
  };

  /**
   * ==========================================================================
   * SCREEN TRANSITIONS & ROUTER
   * ==========================================================================
   */
  const goToScreen = (targetScreenId) => {
    const targetScreen = elements.screens[targetScreenId];
    if (!targetScreen) return;

    const currentActive = document.querySelector('.screen.active');
    if (currentActive) {
      currentActive.classList.remove('active');
    }

    const stepOrder = ['s-envelope', 's-ask', 's-date', 's-activity', 's-message', 's-ticket'];
    state.currentStep = stepOrder.indexOf(targetScreenId) + 1;
    updateProgressBar();

    targetScreen.classList.add('active');
    triggerRippleEffectOnScreen(targetScreen);
    saveStateToLocalStorage();
  };

  const triggerRippleEffectOnScreen = (screenElement) => {
    const rippleWrap = document.createElement('div');
    rippleWrap.className = 'ripple';
    rippleWrap.style.left = '50%';
    rippleWrap.style.top = '50%';
    rippleWrap.style.width = '100px';
    rippleWrap.style.height = '100px';
    rippleWrap.style.marginLeft = '-50px';
    rippleWrap.style.marginTop = '-50px';
    screenElement.appendChild(rippleWrap);
    
    rippleWrap.addEventListener('animationend', () => {
      rippleWrap.remove();
    });
  };

  /**
   * ==========================================================================
   * SCREEN 1: ENVELOPE INTERACTION & FULLSCREEN FLOWER BURST
   * ==========================================================================
   */
  const openEnvelope = () => {
    const nameInputVal = elements.recipientNameInput ? elements.recipientNameInput.value.trim() : 'Nailah Hanaa';
    if (!nameInputVal) {
      showToast('Tolong masukkan namamu dulu ya... ❤️');
      if (elements.recipientNameInput) elements.recipientNameInput.focus();
      return;
    }

    state.recipientName = nameInputVal;
    elements.envelope.classList.add('open');
    
    // Ledakan 80 bunga warna-warni dan hati yang meriah
    triggerFlowerShowerBurst(80);
    triggerFloatingHearts(15);

    if (elements.polaroidCap) {
      elements.polaroidCap.textContent = `For ${state.recipientName} ✨`;
    }

    setTimeout(() => {
      if (elements.bloomFlash) elements.bloomFlash.classList.add('trigger');
    }, 450);

    setTimeout(() => {
      goToScreen('s-ask');
      if (elements.bloomFlash) elements.bloomFlash.classList.remove('trigger');
      handleAutoplayMusic();
    }, 1200);
  };

  /**
   * ==========================================================================
   * SCREEN 2: ASK (SUPER WILD REJECTION DODGING LOGIC)
   * ==========================================================================
   */
  const cheekyMessages = [
    "Eits, gak bisa! ",
    "Mau lari ke mana sih? Haha",
    "Coba lagi sampai jempol kapalan! ",
    "Tombol ini sudah diprogram untuk menolak penolakan.",
    "Eits.. nyaris! 🤏",
    "Mantan dilarang nolak, pamali! ",
    "Yakin gak mau? Pikir-pikir dulu deh... 🥺"
  ];

  const cheekyButtonTexts = [
    "gamau ah",
    "yakin?",
    "mikir dulu...",
    "plis? 🥺",
    "tetep ga bisa wkwk",
    "nyerah aja deh"
  ];

  let dodgeCount = 0;

  const dodgeNoButton = () => {
    const button = elements.noBtn;
    if (!button) return;

    const limitX = elements.phoneContainer.clientWidth - button.clientWidth - 40;
    const limitY = elements.phoneContainer.clientHeight - button.clientHeight - 80;

    const randomX = Math.floor(Math.random() * limitX) + 20;
    const randomY = Math.floor(Math.random() * limitY) + 40;
    const randomRotate = Math.floor(Math.random() * 60) - 30; 
    const randomScale = (Math.random() * 0.3 + 0.85).toFixed(2);

    button.style.position = 'absolute';
    button.style.left = `${randomX}px`;
    button.style.top = `${randomY}px`;
    button.style.transform = `rotate(${randomRotate}deg) scale(${randomScale})`;
    button.style.zIndex = '9999';
    button.style.transition = 'all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.1)';

    dodgeCount++;
    const textIndex = Math.min(Math.floor(dodgeCount / 2), cheekyButtonTexts.length - 1);
    button.textContent = cheekyButtonTexts[textIndex];

    if (dodgeCount % 2 === 0) {
      const randomMsg = cheekyMessages[Math.floor(Math.random() * cheekyMessages.length)];
      showToast(randomMsg);
    }

    triggerFloatingHearts(2);
  };

  /**
   * ==========================================================================
   * SCREEN 3: CHIP & TIME SELECTION ENGINE
   * ==========================================================================
   */
  const setupDateAndTimeInputListeners = () => {
    elements.timeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        elements.timeChips.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-checked', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-checked', 'true');
        state.selectedTimeSlot = chip.getAttribute('data-v');
      });
    });
  };

  const validateAndProceedFromDateScreen = () => {
    const dateVal = elements.dateInput.value;
    const clockVal = elements.clockInput.value;

    if (!dateVal) {
      showToast('Pilih tanggalnya dulu ya mantan... 📅');
      return;
    }
    if (!state.selectedTimeSlot) {
      showToast('Kamu kosongnya kapan? Pagi, siang, atau malam, mantan? 😊');
      return;
    }
    if (!clockVal) {
      showToast('Jam kira-kiranya diisi juga ya mantan biar pas... ⏰');
      return;
    }

    state.selectedDate = dateVal;
    state.exactTime = clockVal;
    goToScreen('s-activity');
  };

  /**
   * ==========================================================================
   * SCREEN 4: ACTIVITY SELECTOR ENGINE
   * ==========================================================================
   */
  const setupActivityCards = () => {
    elements.actCards.forEach(card => {
      card.addEventListener('click', () => {
        elements.actCards.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-checked', 'false');
        });
        card.classList.add('active');
        card.setAttribute('aria-checked', 'true');
        state.selectedActivity = card.getAttribute('data-v');
      });
      
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  };

  const validateAndProceedFromActivityScreen = () => {
    if (!state.selectedActivity) {
      showToast('Pilih salah satu kegiatannya ya mantan, jangan dikosongin... 🤏');
      return;
    }
    goToScreen('s-message');
  };

  /**
   * ==========================================================================
   * SCREEN 5 & 6: TICKET ENGINE & DOWNLOAD
   * ==========================================================================
   */
  const buildTicket = () => {
    state.userMessage = elements.msgInput.value.trim() || '-';
    
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateObj = new Date(state.selectedDate);
    const formattedDateString = isNaN(dateObj) 
      ? state.selectedDate 
      : dateObj.toLocaleDateString('id-ID', dateOptions);

    elements.tName.textContent = state.recipientName;
    elements.tDate.textContent = `${formattedDateString} (${state.selectedTimeSlot} - ${state.exactTime})`;
    elements.tAct.textContent = state.selectedActivity;
    elements.tMsg.textContent = state.userMessage;

    elements.loadingOverlay.classList.remove('hidden');
    setTimeout(() => {
      elements.loadingOverlay.classList.add('hidden');
      triggerConfetti();
      triggerFloatingHearts(20);
      goToScreen('s-ticket');
    }, 1500);
  };

  const downloadTicket = () => {
    const ticketElement = elements.premiumTicket;
    if (!ticketElement) return;

    showToast('Sedang memproses unduhan tiket... 📸');

    html2canvas(ticketElement, {
      scale: 3, 
      backgroundColor: null,
      useCORS: true,
      logging: false
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = `Tiket_Jalan_Kita_${state.recipientName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Tiket berhasil diunduh! Simpan baik-baik ya mantan ❤️');
    }).catch(err => {
      console.error(err);
      showToast('Gagal memproses tiket ke format PNG.');
    });
  };

  /**
   * ==========================================================================
   * GLOBAL SHARING AND UTILITIES (WHATSAPP, RESTART, LOCALSTORAGE)
   * ==========================================================================
   */
  const getShareableText = () => {
    const formattedDate = new Date(state.selectedDate).toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    return `Halo! Aku sudah mengisi undangan spesial kita 💌\n\n` +
           `👤 Nama: *${state.recipientName}*\n` +
           `📅 Tanggal: *${formattedDate}*\n` +
           `⏰ Waktu: *${state.selectedTimeSlot} (${state.exactTime} WIB)*\n` +
           `✨ Agenda: *${state.selectedActivity}*\n` +
           `📝 Pesan: "${state.userMessage}"\n\n` +
           `Nggak sabar buat jalan bareng kamu! ❤️`;
  };

  const shareWA = () => {
    const textEncoded = encodeURIComponent(getShareableText());
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${nomorWA}&text=${textEncoded}`;
    window.open(whatsappUrl, '_blank');

  };

  const copyText = () => {
    const shareText = getShareableText();
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(shareText)
        .then(() => showToast('Detail rencana berhasil disalin ke clipboard! 📋'))
        .catch(() => fallbackCopyText(shareText));
    } else {
      fallbackCopyText(shareText);
    }
  };

  const fallbackCopyText = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('Detail rencana berhasil disalin ke clipboard! 📋');
    } catch (err) {
      showToast('Gagal menyalin teks secara otomatis. Silakan salin manual.');
    }
    document.body.removeChild(textArea);
  };

  const restart = () => {
    state.recipientName = '';
    state.selectedDate = '';
    state.selectedTimeSlot = '';
    state.exactTime = '';
    state.selectedActivity = '';
    state.userMessage = '';

    if (elements.recipientNameInput) {
      elements.recipientNameInput.value = 'Nailah Hanaa';
    }
    if (elements.dateInput) elements.dateInput.value = '';
    if (elements.clockInput) elements.clockInput.value = '';
    if (elements.msgInput) elements.msgInput.value = '';
    if (elements.envelope) elements.envelope.classList.remove('open');
    
    elements.timeChips.forEach(c => {
      c.classList.remove('active');
      c.setAttribute('aria-checked', 'false');
    });
    elements.actCards.forEach(c => {
      c.classList.remove('active');
      c.setAttribute('aria-checked', 'false');
    });

    if (elements.noBtn) {
      elements.noBtn.removeAttribute('style');
      elements.noBtn.textContent = "gamau ah";
    }
    dodgeCount = 0;

    localStorage.removeItem(state.localStorageKey);

    goToScreen('s-envelope');
    showToast('Mari membuat rencana baru! ✨');
  };

  const saveStateToLocalStorage = () => {
    localStorage.setItem(state.localStorageKey, JSON.stringify(state));
  };

  const restoreStateFromLocalStorage = () => {
    const rawData = localStorage.getItem(state.localStorageKey);
    if (!rawData) return;
    try {
      const savedState = JSON.parse(rawData);
      Object.assign(state, savedState);

      if (state.recipientName && elements.recipientNameInput) {
        elements.recipientNameInput.value = state.recipientName;
      }
      if (state.selectedDate && elements.dateInput) {
        elements.dateInput.value = state.selectedDate;
      }
      if (state.exactTime && elements.clockInput) {
        elements.clockInput.value = state.exactTime;
      }
      if (state.userMessage && elements.msgInput) {
        elements.msgInput.value = state.userMessage === '-' ? '' : state.userMessage;
      }

      if (state.selectedTimeSlot) {
        elements.timeChips.forEach(chip => {
          if (chip.getAttribute('data-v') === state.selectedTimeSlot) {
            chip.classList.add('active');
            chip.setAttribute('aria-checked', 'true');
          }
        });
      }

      if (state.selectedActivity) {
        elements.actCards.forEach(card => {
          if (card.getAttribute('data-v') === state.selectedActivity) {
            card.classList.add('active');
            card.setAttribute('aria-checked', 'true');
          }
        });
      }

      const stepOrder = ['s-envelope', 's-ask', 's-date', 's-activity', 's-message', 's-ticket'];
      const correctScreenId = stepOrder[state.currentStep - 1] || 's-envelope';
      
      if (correctScreenId !== 's-envelope') {
        goToScreen(correctScreenId);
        if (correctScreenId === 's-ticket') {
          buildTicket();
        }
      }
    } catch (e) {
      console.warn('Gagal membaca data sesi sebelumnya.');
    }
  };

  const handleAutoplayMusic = () => {
    if (!state.isMusicPlaying && elements.bgMusic) {
      elements.bgMusic.play()
        .then(() => {
          state.isMusicPlaying = true;
        })
        .catch(() => {});
    }
  };

  /**
   * ==========================================================================
   * FULL-SCREEN FLOWER SHOWER GENERATOR (WARNA-WARNI EDITION)
   * ==========================================================================
   */
  const triggerFlowerShowerBurst = (count = 80) => {
    const container = elements.flowerShowerContainer || document.body;
    
    // Variasi bunga dengan warna-warni cantik
    const flowers = ['🌸', '🌺', '🌷', '🌹', '🌻', '🌼', '🏵️', '💮', '🍇', '💎', '🌿']; 
    
    // Warna pendar (shadow glow) yang disesuaikan acak
    const glowColors = [
      'rgba(255, 112, 150, 0.6)',  // Pink
      'rgba(240, 58, 126, 0.6)',   // Fuchsia
      'rgba(255, 183, 3, 0.6)',    // Kuning Emas
      'rgba(251, 133, 0, 0.6)',    // Oranye Hangat
      'rgba(141, 153, 174, 0.5)',  // Silver/Putih
      'rgba(138, 43, 226, 0.6)',   // Ungu 
      'rgba(72, 191, 227, 0.6)'    // Biru Tosca
    ];

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'flower-petal';
      petal.innerHTML = flowers[Math.floor(Math.random() * flowers.length)];

      const randomGlow = glowColors[Math.floor(Math.random() * glowColors.length)];
      petal.style.setProperty('--shadow-color', randomGlow);

      const startX = screenWidth / 2;
      const startY = screenHeight / 2 + 50;

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * Math.max(screenWidth, screenHeight) * 0.9;
      
      const midX = startX + Math.cos(angle) * (distance * 0.45);
      const midY = startY + Math.sin(angle) * (distance * 0.45) - 150;

      const endX = startX + Math.cos(angle) * distance;
      const endY = startY + Math.sin(angle) * distance + (Math.random() * 250 + 150);

      petal.style.setProperty('--startX', `${startX}px`);
      petal.style.setProperty('--startY', `${startY}px`);
      petal.style.setProperty('--midX', `${midX}px`);
      petal.style.setProperty('--midY', `${midY}px`);
      petal.style.setProperty('--endX', `${endX}px`);
      petal.style.setProperty('--endY', `${endY}px`);

      petal.style.animationDelay = `${Math.random() * 0.3}s`;
      petal.style.animationDuration = `${Math.random() * 2 + 2.5}s`;

      container.appendChild(petal);
      
      petal.addEventListener('animationend', () => {
        petal.remove();
      });
    }
  };

  const triggerConfetti = () => {
    const container = document.getElementById('confettiContainer') || document.body;
    const colors = ['#f4f1de', '#ff7096', '#5c3d46', '#f2cc8f', '#ffb3c6'];

    for (let i = 0; i < 75; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.transform = `scale(${Math.random() * 0.8 + 0.4})`;
      piece.style.animationDelay = `${Math.random() * 2}s`;
      piece.style.animationDuration = `${Math.random() * 2 + 1.5}s`;
      container.appendChild(piece);
      
      piece.addEventListener('animationend', () => {
        piece.remove();
      });
    }
  };

  const triggerFloatingHearts = (count = 10) => {
    const container = document.getElementById('floatingHeartsContainer') || document.body;

    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart-float';
      heart.innerHTML = '❤️';
      heart.style.left = `${Math.random() * 80 + 10}%`;
      heart.style.fontSize = `${Math.random() * 18 + 12}px`;
      heart.style.animationDelay = `${Math.random() * 1.5}s`;
      heart.style.animationDuration = `${Math.random() * 2.5 + 2.5}s`;
      container.appendChild(heart);
      
      heart.addEventListener('animationend', () => {
        heart.remove();
      });
    }
  };

  const setupSparkles = () => {
    const container = elements.sparklesContainer;
    if (!container) return;
    
    setInterval(() => {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.width = `${Math.random() * 6 + 4}px`;
      sparkle.style.height = sparkle.style.width;
      sparkle.style.animationDuration = `${Math.random() * 1.5 + 1}s`;
      
      container.appendChild(sparkle);
      
      setTimeout(() => {
        sparkle.remove();
      }, 2000);
    }, 400);
  };

  /**
   * ==========================================================================
   * INITIALIZATION ENTRY POINT (DOM LOADED LIFECYCLE)
   * ==========================================================================
   */
  const initializeApplication = () => {
    initDOMElements();
    
    if (elements.loadingOverlay) {
      elements.loadingOverlay.classList.add('hidden');
    }
    
    setupDateAndTimeInputListeners();
    setupActivityCards();
    setupSparkles();
    restoreStateFromLocalStorage();
    updateProgressBar();
    
    if (elements.noBtn) {
      elements.noBtn.addEventListener('mouseenter', dodgeNoButton);
      elements.noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); 
        dodgeNoButton();
      });
    }

    // Daftarkan API Global ke Window
    window.openEnvelope = openEnvelope;
    window.goTo = goToScreen;
    window.dodgeNo = dodgeNoButton;
    window.confirmDate = validateAndProceedFromDateScreen;
    window.confirmActivity = validateAndProceedFromActivityScreen;
    window.buildTicket = buildTicket;
    window.downloadTicket = downloadTicket;
    window.shareWA = shareWA;
    window.copyText = copyText;
    window.restart = restart;
  };

  document.addEventListener('DOMContentLoaded', initializeApplication);

  return {
    state,
    triggerConfetti,
    triggerFloatingHearts,
    triggerFlowerShowerBurst
  };
})();