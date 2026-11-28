(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Fade-up reveals */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* Split statement into words */
  const statement = document.querySelector('[data-words]');
  let words = [];
  if (statement) {
    const text = statement.textContent.trim().split(/\s+/);
    statement.innerHTML = text.map((w) => `<span class="w">${w}</span>`).join(' ');
    words = [...statement.querySelectorAll('.w')];
  }

  /* Sticky story */
  const story = document.querySelector('[data-story]');
  const cube = document.querySelector('[data-story-cube]');
  const captions = [...document.querySelectorAll('[data-caption]')];

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  function onScroll() {
    const vh = window.innerHeight;

    if (words.length && !reduceMotion) {
      const r = statement.getBoundingClientRect();
      const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35));
      const lit = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < lit));
    }

    if (story) {
      const r = story.getBoundingClientRect();
      const p = clamp(-r.top / (r.height - vh));
      const idx = Math.min(captions.length - 1, Math.floor(p * captions.length));
      captions.forEach((c, i) => c.classList.toggle('is-active', i === idx));
      if (cube && !reduceMotion) {
        cube.style.setProperty('--ry', `${30 + p * 360}deg`);
        cube.style.setProperty('--rx', `${-20 + p * 40}deg`);
      }
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(() => { onScroll(); ticking = false; }); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* Featured game picker */
  const games = {
    tycoon:   { genre: 'Tycoon', title: 'Pear Tycoon', emoji: '🍐', copy: "Grow, sell and expand. The most relaxing empire you'll ever build.", bg: 'linear-gradient(160deg, #34c759, #0f6b2a)' },
    obby:     { genre: 'Obby', title: 'Orchard Obby', emoji: '🧗', copy: '100 stages, hidden shortcuts and a leaderboard that resets every week.', bg: 'linear-gradient(160deg, #c774e8, #3a1d6e)' },
    runner:   { genre: 'Runner', title: 'Core Runner', emoji: '⚡', copy: 'Endless neon tracks that get faster the longer you survive.', bg: 'linear-gradient(160deg, #2ee6ff, #0b4a6e)' },
    survival: { genre: 'Survival · Coming soon', title: 'Seedfall', emoji: '🌙', copy: 'Build by day, defend by night. Squad up with up to eight friends.', bg: 'linear-gradient(160deg, #4a2a6e, #0b1030)' },
  };
  const $ = (s) => document.querySelector(s);
  const art = $('[data-featured-art]'), emoji = $('[data-featured-emoji]');
  const picks = document.querySelectorAll('.pick');

  picks.forEach((btn) => btn.addEventListener('click', () => {
    const g = games[btn.dataset.game];
    picks.forEach((b) => { const on = b === btn; b.classList.toggle('is-selected', on); b.setAttribute('aria-selected', on); });
    art.style.background = g.bg;
    emoji.classList.add('swap');
    setTimeout(() => {
      emoji.textContent = g.emoji;
      $('[data-featured-genre]').textContent = g.genre;
      $('[data-featured-title]').textContent = g.title;
      $('[data-featured-copy]').textContent = g.copy;
      emoji.classList.remove('swap');
    }, reduceMotion ? 0 : 200);
  }));
})();
