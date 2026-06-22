document.addEventListener('DOMContentLoaded', () => {

  // Header scroll effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });

  // Fade-in on scroll
  const fadeEls = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeEls.forEach(el => observer.observe(el));

  // Count-up animation for stats
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  const countUp = (el) => {
    const target = parseInt(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.round(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(el => countUp(el));
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats');
  if (statsSection) statsObserver.observe(statsSection);

  // Scroll hint click
  const scrollHint = document.querySelector('.hero-scroll-hint');
  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      const mission = document.querySelector('.mission');
      const headerH = document.querySelector('.site-header').offsetHeight;
      window.scrollTo({ top: mission.offsetTop - headerH, behavior: 'smooth' });
    });
  }

  // Frequency toggle
  const freqBtns = document.querySelectorAll('.freq-btn');
  freqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      freqBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateImpactMessage();
    });
  });

  // Amount selection
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customInput = document.getElementById('customAmount');

  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      customInput.value = '';
      updateImpactMessage();
    });
  });

  customInput.addEventListener('input', () => {
    if (customInput.value) {
      amountBtns.forEach(b => b.classList.remove('active'));
    }
    updateImpactMessage();
  });

  // Impact messages based on amount
  const impactMessages = {
    5: 'could help buy a gas card to get a patient to their next appointment.',
    25: 'could help cover fuel costs for a patient\'s trips to and from treatment.',
    50: 'could help pay for a night\'s hotel stay near a treatment center.',
    100: 'could help cover a portion of a patient\'s out-of-pocket medical bills.',
  };

  function getSelectedAmount() {
    const activeBtn = document.querySelector('.amount-btn.active');
    if (activeBtn) return parseInt(activeBtn.dataset.amount);
    if (customInput.value) return parseInt(customInput.value);
    return 25;
  }

  function getFrequency() {
    const activeFreq = document.querySelector('.freq-btn.active');
    return activeFreq ? activeFreq.dataset.freq : 'monthly';
  }

  function updateImpactMessage() {
    const amount = getSelectedAmount();
    const freq = getFrequency();
    const prefix = freq === 'monthly' ? `/month` : '';
    const impactEl = document.querySelector('.impact-text');

    let message = impactMessages[amount];
    if (!message) {
      if (amount < 10) message = 'helps a patient get to the care they need.';
      else if (amount < 50) message = 'could help cover travel and fuel for a patient in treatment.';
      else if (amount < 100) message = 'could help with hotel stays or meals during treatment.';
      else message = 'could make a significant impact on a family facing brain cancer.';
    }

    impactEl.textContent = `$${amount}${prefix} ${message}`;
  }

  // Donate button
  document.querySelector('.btn-donate-main').addEventListener('click', () => {
    const amount = getSelectedAmount();
    const freq = getFrequency();
    alert(`Thank you for your ${freq} donation of $${amount}! This is a demo — payment processing would be integrated here.`);
  });

});
