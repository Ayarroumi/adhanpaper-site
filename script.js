const CONFIG = {
  appStoreUrl: "",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.aey.adhanpaper&pcampaignid=web_share",
  marketplaceUrl: "",
  // Set these after deploying the backend and creating the Cloudflare Turnstile widget.
  waitlistEndpoint: "https://hvqze5mh58.execute-api.eu-west-1.amazonaws.com/waitlist",
  turnstileSiteKey: "0x4AAAAAAEnYmhjGbEBEv5M0"
};

const toast = document.querySelector('.toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function bindConfiguredLink(selector, url, missingMessage) {
  document.querySelectorAll(selector).forEach(link => {
    link.addEventListener('click', event => {
      if (!url) {
        event.preventDefault();
        showToast(missingMessage);
        return;
      }
      link.href = url;
    });
  });
}

bindConfiguredLink('[data-app-link]', CONFIG.appStoreUrl, 'App Store link coming soon.');
bindConfiguredLink('[data-play-link]', CONFIG.playStoreUrl, 'Google Play link coming soon.');
bindConfiguredLink('[data-marketplace-link]', CONFIG.marketplaceUrl, 'Marketplace link coming soon.');

document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Launch waitlist modal
const waitlistModal = document.getElementById('waitlist-modal');
const waitlistDialog = waitlistModal?.querySelector('.waitlist-dialog');
const waitlistForm = document.getElementById('waitlist-form');
const waitlistEmail = document.getElementById('waitlist-email');
const waitlistError = document.getElementById('waitlist-error');
const waitlistFormView = waitlistModal?.querySelector('.waitlist-form-view');
const waitlistSuccess = waitlistModal?.querySelector('.waitlist-success');
let lastFocusedElement = null;
let turnstileWidgetId = null;
let turnstileToken = '';
let turnstileLoader;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (turnstileLoader) return turnstileLoader;

  turnstileLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = () => reject(new Error('Turnstile could not be loaded'));
    document.head.appendChild(script);
  });

  return turnstileLoader;
}

async function renderTurnstile() {
  const container = document.getElementById('waitlist-turnstile');
  if (!container || !CONFIG.turnstileSiteKey) return;

  try {
    const turnstile = await loadTurnstile();
    if (turnstileWidgetId === null) {
      turnstileWidgetId = turnstile.render(container, {
        sitekey: CONFIG.turnstileSiteKey,
        theme: 'light',
        appearance: 'interaction-only',
        callback: token => {
          turnstileToken = token;
          waitlistError.textContent = '';
        },
        'expired-callback': () => { turnstileToken = ''; },
        'error-callback': () => { turnstileToken = ''; }
      });
    } else {
      turnstile.reset(turnstileWidgetId);
    }
  } catch (_error) {
    waitlistError.textContent = 'Security verification is unavailable. Please try again shortly.';
  }
}

function resetTurnstile() {
  turnstileToken = '';
  if (turnstileWidgetId !== null && window.turnstile) {
    window.turnstile.reset(turnstileWidgetId);
  }
}

function resetWaitlist() {
  waitlistForm?.reset();
  resetTurnstile();
  waitlistError.textContent = '';
  waitlistFormView?.classList.remove('is-hidden');
  waitlistSuccess?.classList.remove('is-visible');
  const submitButton = waitlistForm?.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Join the list <i class="bi bi-arrow-right"></i>';
  }
}

function openWaitlist(event) {
  event?.preventDefault();
  lastFocusedElement = document.activeElement;
  resetWaitlist();
  waitlistModal?.classList.add('is-open');
  waitlistModal?.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  renderTurnstile();
  requestAnimationFrame(() => waitlistEmail?.focus());
}

function closeWaitlist() {
  waitlistModal?.classList.remove('is-open');
  waitlistModal?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  lastFocusedElement?.focus?.();
}

document.querySelectorAll('[data-shop-link]').forEach(link => {
  link.addEventListener('click', openWaitlist);
});

document.querySelectorAll('[data-waitlist-close]').forEach(button => {
  button.addEventListener('click', closeWaitlist);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && waitlistModal?.classList.contains('is-open')) {
    closeWaitlist();
  }

  if (event.key === 'Tab' && waitlistModal?.classList.contains('is-open')) {
    const focusable = [...waitlistDialog.querySelectorAll('button, input:not([tabindex="-1"]), a[href], [tabindex]:not([tabindex="-1"])')]
      .filter(el => !el.disabled && el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

waitlistForm?.addEventListener('submit', async event => {
  event.preventDefault();
  waitlistError.textContent = '';

  const email = waitlistEmail.value.trim();
  if (!email || !waitlistEmail.validity.valid) {
    waitlistError.textContent = 'Please enter a valid email address.';
    waitlistEmail.focus();
    return;
  }

  if (!CONFIG.waitlistEndpoint) {
    waitlistError.textContent = 'The launch list is not connected yet.';
    return;
  }

  if (!CONFIG.turnstileSiteKey) {
    waitlistError.textContent = 'Security verification is not configured yet.';
    return;
  }

  if (!turnstileToken) {
    waitlistError.textContent = 'Please complete the security check and try again.';
    return;
  }

  const submitButton = waitlistForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Joining…';

  try {
    const response = await fetch(CONFIG.waitlistEndpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        turnstileToken,
        website: new FormData(waitlistForm).get('website') || ''
      })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.message || 'Submission failed');
    }

    waitlistFormView?.classList.add('is-hidden');
    waitlistSuccess?.classList.add('is-visible');
    waitlistSuccess?.querySelector('button')?.focus();
  } catch (error) {
    waitlistError.textContent = error.message || 'Something went wrong. Please try again in a moment.';
    resetTurnstile();
    submitButton.disabled = false;
    submitButton.innerHTML = 'Join the list <i class="bi bi-arrow-right"></i>';
  }
});
