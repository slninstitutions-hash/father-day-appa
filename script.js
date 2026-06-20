/* ══════════════════════════════════════════
   FATHER'S DAY WEBSITE — script.js
   D. Niranjan → P. Daivasikhamani (Appa)
══════════════════════════════════════════ */

'use strict';

// ──────────────────────────────────────────
// CUSTOM CURSOR
// ──────────────────────────────────────────
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;
  let mx = -100, my = -100, fx = -100, fy = -100;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function animateCursor() {
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
    fx += (mx - fx) * 0.14;
    fy += (my - fy) * 0.14;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateCursor);
  })();
})();

// ──────────────────────────────────────────
// SCROLL PROGRESS
// ──────────────────────────────────────────
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
  }, { passive: true });
})();

// ──────────────────────────────────────────
// LOADING SCREEN
// ──────────────────────────────────────────
(function initLoading() {
  const screen = document.getElementById('loadingScreen');
  const bar = document.getElementById('loadingBar');
  const canvas = document.getElementById('loadingCanvas');
  if (!screen || !bar || !canvas) return;

  // Background particles on loading canvas
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const pts = Array.from({length:60}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    speed: Math.random() * 0.4 + 0.1,
    opacity: Math.random() * 0.6 + 0.1
  }));
  let loadRAF;
  function drawLoading() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,215,0,${p.opacity})`;
      ctx.fill();
      p.y -= p.speed;
      if (p.y < 0) { p.y = canvas.height; p.x = Math.random() * canvas.width; }
    });
    loadRAF = requestAnimationFrame(drawLoading);
  }
  drawLoading();

  // Progress bar
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 4 + 1;
    if (progress >= 100) { progress = 100; clearInterval(interval); }
    bar.style.width = progress + '%';
    if (progress >= 100) {
      setTimeout(() => {
        cancelAnimationFrame(loadRAF);
        screen.classList.add('hide');
        setTimeout(() => { screen.style.display = 'none'; initHeroReveal(); }, 850);
      }, 400);
    }
  }, 45);
})();

// ──────────────────────────────────────────
// HERO REVEAL — trigger after loading
// ──────────────────────────────────────────
function initHeroReveal() {
  document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 140);
  });
}

// ──────────────────────────────────────────
// STAR FIELD — Hero
// ──────────────────────────────────────────
(function initStars() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars = Array.from({length:200}, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.2,
      opacity: Math.random() * 0.8 + 0.1,
      speed: Math.random() * 0.015 + 0.003,
      twinkle: Math.random() * Math.PI * 2
    }));
  }
  resize();
  window.addEventListener('resize', resize, { passive:true });

  let time = 0;
  (function animate() {
    ctx.clearRect(0,0,W,H);
    time += 0.012;
    stars.forEach(s => {
      s.twinkle += s.speed;
      const op = s.opacity * (0.6 + 0.4 * Math.sin(s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${op})`;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  })();
})();

// ──────────────────────────────────────────
// HERO PARTICLES
// ──────────────────────────────────────────
(function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  function spawnParticle() {
    const p = document.createElement('div');
    const isHeart = Math.random() < 0.25;
    p.style.cssText = `
      position:absolute;
      left:${Math.random()*100}%;
      bottom:-10px;
      font-size:${Math.random()*12+8}px;
      opacity:0;
      pointer-events:none;
      animation: particleFloat ${Math.random()*6+5}s linear forwards;
      color: rgba(255,215,0,${Math.random()*0.5+0.3});
    `;
    p.textContent = isHeart ? '❤️' : '✦';
    if (isHeart) p.style.animation = `heartFloat ${Math.random()*4+3}s ease-out forwards`;
    container.appendChild(p);
    setTimeout(() => p.remove(), 9000);
  }
  setInterval(spawnParticle, 600);
})();

// ──────────────────────────────────────────
// MOUSE PARALLAX on hero
// ──────────────────────────────────────────
(function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  let mx = 0, my = 0;
  hero.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth - 0.5) * 20;
    my = (e.clientY / window.innerHeight - 0.5) * 20;
    const content = hero.querySelector('.hero-content');
    if (content) content.style.transform = `translate(${mx * 0.4}px, ${my * 0.4}px)`;
  });
  hero.addEventListener('mouseleave', () => {
    const content = hero.querySelector('.hero-content');
    if (content) content.style.transform = '';
  });
})();

// ──────────────────────────────────────────
// GIFT BUTTON → smooth scroll to letters
// ──────────────────────────────────────────
(function initGiftBtn() {
  const btn = document.getElementById('giftBtn');
  if (!btn) return;
  btn.addEventListener('click', function(e) {
    // Ripple
    const ripple = this.querySelector('.btn-ripple');
    if (ripple) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.cssText = `
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
        position:absolute; border-radius:50%;
        background:rgba(255,255,255,0.2);
        transform:scale(0); animation:rippleAnim 0.7s ease-out forwards;
      `;
    }
    document.getElementById('letters')?.scrollIntoView({ behavior:'smooth' });
  });
  // Inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = `@keyframes rippleAnim { to { transform:scale(1); opacity:0; } }`;
  document.head.appendChild(style);
})();

// ──────────────────────────────────────────
// MUSIC (Web Audio + visualizer)
// ──────────────────────────────────────────
const Music = (function() {
  let audioCtx, analyser, source, gainNode;
  let audioElement;
  let isPlaying = false;
  let visRAF;

  function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;

    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.7;

    analyser.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    audioElement = new Audio("assets/music/chirunavvutho.mp3");
    audioElement.loop = true;

    source = audioCtx.createMediaElementSource(audioElement);
    source.connect(analyser);
  }

  return audioCtx;
}
  
  function play() {
  const ctx = getCtx();

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  audioElement.play();

  isPlaying = true;

  document.getElementById("musicIcon").textContent = "⏸";

  startVisualizer();
 }

  function pause() {
  if (!audioElement) return;

  audioElement.pause();

  isPlaying = false;

  document.getElementById("musicIcon").textContent = "▶";

  stopVisualizer();
 }
  function toggle() { isPlaying ? pause() : play(); }

  function setVolume(v) {
  if (audioElement) {
    audioElement.volume = v;
  }
}

  // Visualizer
  function startVisualizer() {
    const bars = document.querySelectorAll('.vis-bar');
    const viz = document.getElementById('visualizer');
    if (viz) viz.classList.add('active');
    if (!analyser || !bars.length) return;
    const dataArr = new Uint8Array(analyser.frequencyBinCount);
    function draw() {
      if (!isPlaying) return;
      analyser.getByteFrequencyData(dataArr);
      bars.forEach((bar, i) => {
        const val = dataArr[i % dataArr.length] || 0;
        bar.style.height = Math.max(4, (val / 255) * 55 + 4) + 'px';
      });
      visRAF = requestAnimationFrame(draw);
    }
    draw();
  }
  function stopVisualizer() {
    cancelAnimationFrame(visRAF);
    const viz = document.getElementById('visualizer');
    if (viz) viz.classList.remove('active');
    document.querySelectorAll('.vis-bar').forEach(b => b.style.height = '8px');
  }

  return { play, pause, toggle, setVolume };
})();

// Wire music controls
document.getElementById('musicToggle')?.addEventListener('click', Music.toggle);
document.getElementById('playBtn')?.addEventListener('click', Music.play);
document.getElementById('pauseBtn')?.addEventListener('click', Music.pause);
document.getElementById('volumeSlider')?.addEventListener('input', function() { Music.setVolume(+this.value); });

// Music notes animation
(function initMusicNotes() {
  const container = document.getElementById('musicNotes');
  if (!container) return;
  const noteChars = ['♪','♫','♬','♩','𝅘𝅥𝅮'];
  setInterval(() => {
    const note = document.createElement('span');
    note.className = 'music-note';
    note.textContent = noteChars[Math.floor(Math.random() * noteChars.length)];
    note.style.left = Math.random() * 90 + 5 + '%';
    note.style.bottom = '10%';
    note.style.animationDelay = '0s';
    note.style.animationDuration = (Math.random() * 2 + 3) + 's';
    note.style.color = 'rgba(255,215,0,' + (Math.random()*0.5+0.3) + ')';
    container.appendChild(note);
    setTimeout(() => note.remove(), 5000);
  }, 900);
})();

// ──────────────────────────────────────────
// ENVELOPE / LETTER SYSTEM
// ──────────────────────────────────────────
(function initLetters() {
  const overlay = document.getElementById('letterOverlay');
  const wraps = document.querySelectorAll('.envelope-wrap');

  function closeLetter(letterKey) {
    const popup = document.getElementById('letter-' + letterKey);
    const env = document.getElementById('env-' + letterKey);
    if (popup) { popup.classList.remove('open'); setTimeout(() => popup.style.display = 'none', 450); }
    if (env) env.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
  }

  function openLetter(letterKey) {
    const popup = document.getElementById('letter-' + letterKey);
    const env = document.getElementById('env-' + letterKey);
    if (popup) {
      popup.style.display = 'block';
      requestAnimationFrame(() => { popup.classList.add('open'); });
    }
    if (env) env.classList.add('open');
    if (overlay) overlay.classList.add('active');
  }

  wraps.forEach(wrap => {
    const key = wrap.dataset.letter;
    wrap.querySelector('.envelope')?.addEventListener('click', () => openLetter(key));
    wrap.querySelector('.letter-close')?.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLetter(key);
    });
  });

  overlay?.addEventListener('click', () => {
    wraps.forEach(w => closeLetter(w.dataset.letter));
  });
})();

// ──────────────────────────────────────────
// CARD TILT EFFECT
// ──────────────────────────────────────────
(function initCardTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ──────────────────────────────────────────
// CONFETTI EXPLOSION
// ──────────────────────────────────────────
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#FFD700','#ffffff','#0A1F44','#ff6b6b','#ffd93d','#6bcb77'];
  const pieces = Array.from({length:180}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    r: Math.random() * 7 + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 4,
    vy: Math.random() * 4 + 2,
    rot: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 6
  }));

  let frame = 0;
  function drawConfetti() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.rect(-p.r/2, -p.r/2, p.r, p.r * 2);
      ctx.fill();
      ctx.restore();
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      p.vy += 0.07;
      if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }
    });
    frame++;
    if (frame < 200) requestAnimationFrame(drawConfetti);
    else { ctx.clearRect(0,0,canvas.width,canvas.height); canvas.style.display = 'none'; }
  }
  drawConfetti();
}

// Heart particle burst
function launchHearts() {
  const body = document.body;
  for (let i = 0; i < 22; i++) {
    setTimeout(() => {
      const h = document.createElement('div');
      h.style.cssText = `
        position:fixed;
        left:${Math.random()*100}vw;
        top:${Math.random()*60+20}vh;
        font-size:${Math.random()*24+12}px;
        pointer-events:none;
        z-index:9999;
        animation:heartFloat ${Math.random()*2+1.5}s ease-out forwards;
      `;
      h.textContent = '❤️';
      body.appendChild(h);
      setTimeout(() => h.remove(), 3500);
    }, i * 60);
  }
}

// ──────────────────────────────────────────
// TYPEWRITER EFFECT
// ──────────────────────────────────────────
function typewrite(el, text, speed = 28, cb) {
  el.textContent = '';
  let i = 0;
  function tick() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(tick, text[i-1] === '\n' ? speed * 4 : speed);
    } else if (cb) cb();
  }
  tick();
}

// ──────────────────────────────────────────
// SURPRISE SECTION
// ──────────────────────────────────────────
(function initSurprise() {
  const btn = document.getElementById('surpriseBtn');
  const msgBox = document.getElementById('surpriseMessage');
  const typeEl = document.getElementById('typewriterText');
  if (!btn || !msgBox || !typeEl) return;

  const message = `Appa,

I may not say this often.

But I am proud to be your son.

Thank you for every sacrifice,
every lesson,
and every smile.

Thank you for choosing responsibility over comfort.

Thank you for carrying our family through difficult times.

Thank you for being my father.

And...

I'm sorry for all the mistakes I made in my life.

I promise,
I will become someone you will always be proud of.

Happy Father's Day ❤️

Love Forever,

Your Son,
D. Niranjan`;

  let triggered = false;
  btn.addEventListener('click', function() {
    if (triggered) return;
    triggered = true;
    launchConfetti();
    launchHearts();
    msgBox.style.display = 'block';
    msgBox.style.opacity = '0';
    msgBox.style.transform = 'translateY(20px)';
    requestAnimationFrame(() => {
      msgBox.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      msgBox.style.opacity = '1';
      msgBox.style.transform = 'translateY(0)';
    });
    btn.style.opacity = '0.4';
    btn.style.pointerEvents = 'none';
    typewrite(typeEl, message, 25);
  });
})();

// ──────────────────────────────────────────
// FINAL STARS CANVAS
// ──────────────────────────────────────────
(function initFinalStars() {
  const canvas = document.getElementById('finalStars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];
  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    stars = Array.from({length:160}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*1.5+0.2,
      t: Math.random()*Math.PI*2,
      speed: Math.random()*0.02+0.005
    }));
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);
  resize();
  (function anim() {
    ctx.clearRect(0,0,W,H);
    stars.forEach(s => {
      s.t += s.speed;
      const op = 0.3 + 0.6 * Math.sin(s.t);
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(255,215,0,${op})`;
      ctx.fill();
    });
    requestAnimationFrame(anim);
  })();
})();

// ──────────────────────────────────────────
// INTERSECTION OBSERVER — scroll reveals
// ──────────────────────────────────────────
(function initScrollReveal() {
  const opts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

  // Generic reveal classes
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, opts);

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .appreciation-quote, .timeline-end, .teacher-content, .final-one, .final-reveal, .final-credit').forEach(el => observer.observe(el));

  // Cards — staggered
  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const delay = parseInt(card.dataset.delay) || 0;
        setTimeout(() => card.classList.add('visible'), delay);
        cardObserver.unobserve(card);
      }
    });
  }, opts);
  document.querySelectorAll('.glass-card').forEach(c => cardObserver.observe(c));

  // Word items — staggered
  const wordObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.word-item').forEach(w => {
          const delay = parseInt(w.dataset.delay) || 0;
          setTimeout(() => w.classList.add('visible'), delay);
        });
        wordObserver.disconnect();
      }
    });
  }, opts);
  const wordCloud = document.getElementById('wordCloud');
  if (wordCloud) wordObserver.observe(wordCloud);

  // Timeline items
  const timeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        timeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.timeline-item').forEach(el => timeObserver.observe(el));
})();

// ──────────────────────────────────────────
// ANIMATED UNDERLINE on section titles
// ──────────────────────────────────────────
(function initUnderlines() {
  const style = document.createElement('style');
  style.textContent = `
    .section-title {
      position: relative;
      display: inline-block;
    }
    .section-title::after {
      content: '';
      position: absolute;
      bottom: -6px; left: 50%;
      transform: translateX(-50%) scaleX(0);
      width: 60%; height: 2px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
      border-radius: 99px;
      transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0.3s;
    }
    .section-header.visible .section-title::after { transform: translateX(-50%) scaleX(1); }
  `;
  document.head.appendChild(style);

  const headerObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); headerObs.unobserve(e.target); } });
  }, { threshold:0.3 });
  document.querySelectorAll('.section-header').forEach(h => headerObs.observe(h));
})();

// ──────────────────────────────────────────
// GRADIENT BG ANIMATION on appreciation section
// ──────────────────────────────────────────
(function initGradientBg() {
  const appr = document.querySelector('.appreciation');
  if (!appr) return;
  let hue = 220;
  setInterval(() => {
    hue = (hue + 0.3) % 360;
    appr.style.background = `radial-gradient(ellipse at center, hsla(${hue},60%,18%,0.4) 0%, var(--bg) 70%)`;
  }, 60);
})();

// ──────────────────────────────────────────
// SMOOTH SECTION ENTRY — slight scale
// ──────────────────────────────────────────
(function initSectionEntry() {
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.transform = 'scale(1)';
        e.target.style.opacity = '1';
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.section').forEach(s => {
    s.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    sectionObs.observe(s);
  });
})();

// ──────────────────────────────────────────
// GLOW SHADOW on hero name
// ──────────────────────────────────────────
(function initGlowPulse() {
  const name = document.querySelector('.hero-name');
  if (!name) return;
  let t = 0;
  setInterval(() => {
    t += 0.04;
    const intensity = 0.25 + 0.15 * Math.sin(t);
    name.style.filter = `drop-shadow(0 0 ${30 + 10*Math.sin(t)}px rgba(255,215,0,${intensity}))`;
  }, 50);
})();

console.log('❤️ Made with endless love — D. Niranjan to Appa');
