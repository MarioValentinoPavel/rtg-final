/* =========================================================
   Reescribe tu Guion · versión final (M.V.P)
   Cambia aquí tu WhatsApp y el enlace del vídeo de la masterclass.
   ========================================================= */
const RTG = {
  whatsapp: '34633712475',
  // Pega aquí el enlace de YouTube o Vimeo de la masterclass. Vacío = "se estrena muy pronto".
  videoUrl: ''
};

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const G = !reduce && window.gsap ? window.gsap : null;
  const ST = G && window.ScrollTrigger ? window.ScrollTrigger : null;
  if (ST) G.registerPlugin(ST);

  const wa = text => `https://wa.me/${RTG.whatsapp}?text=${encodeURIComponent(text)}`;
  const pad = n => String(n).padStart(2, '0');

  /* ---------- WhatsApp ---------- */
  const WA_MSG = 'Hola Mario, vengo de la web de Reescribe tu Guion y quiero agendar una llamada contigo.';
  $$('[data-wa]').forEach(a => { a.href = wa(WA_MSG); a.target = '_blank'; a.rel = 'noopener'; });

  /* ---------- Enlaces internos con desplazamiento suave ---------- */
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const el = id.length > 1 && $(id);
    if (!el) return;
    e.preventDefault();
    const top = id === '#top' ? 0 : el.getBoundingClientRect().top + scrollY - 70;
    scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  }));

  /* ---------- Código de tiempo REC ---------- */
  const tc = $('#tc');
  const t0 = performance.now();
  const drawTC = () => {
    const s = (performance.now() - t0) / 1000, S = Math.floor(s);
    tc.textContent = `${pad(Math.floor(S / 3600))}:${pad(Math.floor(S / 60) % 60)}:${pad(S % 60)}:${pad(Math.floor((s % 1) * 25))}`;
  };
  if (reduce) setInterval(drawTC, 1000);
  else (function loop() { drawTC(); requestAnimationFrame(loop); })();

  /* ---------- Barra y segmento en antena ---------- */
  const bar = $('.bar');
  const onScroll = () => bar.classList.toggle('is-scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const seg = $('#seg');
  const segIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) seg.textContent = e.target.dataset.seg; }), { rootMargin: '-50% 0px -50% 0px' });
  $$('[data-seg]').forEach(s => segIO.observe(s));

  /* ---------- Prompter de la apertura: el guion de otros, en bucle ---------- */
  (() => {
    const roll = $('#roll');
    if (!roll) return;
    const base = [...roll.children], n = base.length;
    if (reduce) { base[0].classList.add('is-live'); return; }
    base.forEach(li => roll.appendChild(li.cloneNode(true)));
    base.forEach(li => roll.appendChild(li.cloneNode(true)));
    const all = [...roll.children];
    let lh = 0, off = 0, last = 0, run = true, live = -1;
    const measure = () => { lh = all[0].offsetHeight; off = off % (n * lh || 1) + n * lh; };
    measure();
    addEventListener('resize', measure);
    document.fonts && document.fonts.ready.then(measure);
    new IntersectionObserver(([e]) => { run = e.isIntersecting; }).observe(roll.parentElement);
    const loop = now => {
      const dt = Math.min(64, now - (last || now));
      last = now;
      if (run && lh && !document.hidden) {
        off += dt * lh / 1500;
        if (off >= 2 * n * lh) off -= n * lh;
        roll.style.transform = `translate3d(0, ${(lh - off).toFixed(2)}px, 0)`;
        const k = Math.round(off / lh) % n;
        if (k !== live) {
          all.forEach((li, i) => li.classList.toggle('is-live', i % n === k));
          live = k;
        }
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  })();

  /* ---------- Arranque: cuenta atrás en CAM 2 + titular ---------- */
  (() => {
    const mon = $('#heroMon'), state = $('#heroState');
    const goLive = () => { mon.classList.remove('is-booting'); mon.classList.add('is-live'); state.textContent = 'En directo'; };
    if (!G) { goLive(); return; }

    // Partir el titular en palabras para revelarlas
    const h1 = $('.hero__title');
    const split = el => [...el.childNodes].forEach(node => {
      if (node.nodeType === 3) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(' '); return; }
          const w = document.createElement('span'), inner = document.createElement('span');
          w.className = 'w'; inner.textContent = part; w.append(inner); frag.append(w);
        });
        node.replaceWith(frag);
      } else if (node.nodeType === 1) split(node);
    });
    split(h1);

    mon.classList.add('is-booting');
    state.textContent = 'Señal en 3';
    const num = $('#countNum'), dial = $('#countDial'), img = $('img', mon);
    const tl = G.timeline({ delay: .2 });
    tl.from('.hero .tag, .hero .prompter', { y: 18, opacity: 0, duration: .8, stagger: .08, ease: 'expo.out', clearProps: 'all' }, 0)
      .from('.hero__title .w > span', { yPercent: 115, duration: 1.15, stagger: .045, ease: 'expo.out' }, .1)
      .from('.hero__lede, .hero__ctas', { y: 22, opacity: 0, duration: .9, stagger: .1, ease: 'expo.out', clearProps: 'all' }, .55);
    [3, 2, 1].forEach((v, i) => {
      tl.call(() => { num.textContent = v; state.textContent = `Señal en ${v}`; }, null, i * .55)
        .fromTo(dial, { '--p': 0 }, { '--p': 1, duration: .55, ease: 'none' }, i * .55);
    });
    tl.call(goLive, null, 1.65)
      .fromTo(img, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'expo.out', clearProps: 'all' }, 1.65)
      .from($$('.l3 > *', mon), { clipPath: 'inset(0 100% 0 0)', duration: .8, stagger: .12, ease: 'expo.out', clearProps: 'clipPath' }, 2.1);
  })();

  /* ---------- Apariciones al hacer scroll ---------- */
  if (ST) {
    $$('[data-reveal]').forEach(el => {
      G.from(el, {
        y: 34, opacity: 0, duration: 1, ease: 'expo.out', clearProps: 'transform,opacity',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      });
    });
  }

  /* ---------- Masterclass ---------- */
  const embedUrl = url => {
    let m = (url || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    if (m) return `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0`;
    m = (url || '').match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return `https://player.vimeo.com/video/${m[1]}?autoplay=1`;
    return null;
  };
  $('#play').addEventListener('click', () => {
    const src = embedUrl(RTG.videoUrl), screen = $('#screen');
    if (src) {
      screen.insertAdjacentHTML('beforeend', `<iframe src="${src}" title="Masterclass gratuita de Reescribe tu Guion" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`);
    } else {
      const soon = $('#soon');
      soon.hidden = false;
      G && G.from(soon.children, { y: 16, opacity: 0, duration: .6, stagger: .07, ease: 'expo.out', clearProps: 'all' });
      $('a', soon).focus({ preventScroll: true });
    }
  });

  /* ---------- Escaleta: el bloque que cruza el centro pasa a "En antena" ---------- */
  (() => {
    const rows = $$('.row');
    const label = (r, st) => ({ done: 'Emitido', live: r.dataset.live || 'En antena', queue: r.dataset.queue || 'En cola' })[st];
    const setLive = idx => rows.forEach((r, i) => {
      const st = i < idx ? 'done' : i === idx ? 'live' : 'queue';
      if (r.dataset.state === st) return;
      r.dataset.state = st;
      r.classList.toggle('is-live', st === 'live');
      r.classList.toggle('is-done', st === 'done');
      $('.row__state b', r).textContent = label(r, st);
    });
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setLive(rows.indexOf(e.target)); }), { rootMargin: '-50% 0px -50% 0px' });
    rows.forEach(r => io.observe(r));
    if (ST) rows.forEach(r => G.fromTo($('.row__bar', r), { scaleX: 0 }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: r, start: 'top 50%', end: 'bottom 50%', scrub: true }
    }));
    else rows.forEach(r => { $('.row__bar', r).style.transform = 'none'; });
  })();

  /* ---------- Mesa de realización: palanca T entre CAM 1 y CAM 2 ---------- */
  (() => {
    const real = $('#mario'), mix = $('#mix'), track = $('#tbar'), handle = $('#tbarHandle');
    const ledsBox = $('#leds'), label = $('#pgmLabel'), autoBtn = $('#auto'), cutBtn = $('#cut'), hint = $('#tbarHint');
    if (!mix) return;
    const N = 16;
    ledsBox.innerHTML = '<i></i>'.repeat(N);
    const leds = [...ledsBox.children];
    let t = 0, raf = 0, touched = false, grab = null;

    const vertical = () => track.clientHeight >= track.clientWidth;
    const set = v => {
      t = Math.min(1, Math.max(0, v));
      mix.style.setProperty('--t', t.toFixed(4));
      mix.style.setProperty('--edge', t > .003 && t < .997 ? 1 : 0);
      const vert = vertical();
      const room = vert ? track.clientHeight - handle.offsetHeight : track.clientWidth - handle.offsetWidth;
      handle.style.transform = vert ? `translate3d(0, ${(t * room).toFixed(1)}px, 0)` : `translate3d(${(t * room).toFixed(1)}px, 0, 0)`;
      const lit = Math.round(t * N);
      leds.forEach((l, i) => l.classList.toggle('on', i < lit));
      const cam = t >= .5 ? '2' : '1';
      if (real.dataset.cam !== cam) {
        real.dataset.cam = cam;
        label.textContent = cam === '2' ? 'CAM 2 · Al mando' : 'CAM 1 · Copiloto';
      }
      track.setAttribute('aria-valuenow', Math.round(t * 100));
      track.setAttribute('aria-valuetext', cam === '2' ? 'Cámara 2, al mando' : 'Cámara 1, de copiloto');
    };
    const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0; autoBtn.classList.remove('is-on'); };
    const ease = x => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const go = (to, dur, quiet, after) => {
      stop();
      const from = t, start = performance.now();
      if (!quiet) autoBtn.classList.add('is-on');
      const step = now => {
        const p = dur ? Math.min(1, (now - start) / dur) : 1;
        set(from + (to - from) * ease(p));
        if (p < 1) raf = requestAnimationFrame(step);
        else { raf = 0; autoBtn.classList.remove('is-on'); after && after(); }
      };
      raf = requestAnimationFrame(step);
    };
    const takeOver = () => { touched = true; stop(); hint.classList.add('is-gone'); };

    const posToT = e => {
      const r = track.getBoundingClientRect(), vert = r.height >= r.width;
      const hs = vert ? handle.offsetHeight : handle.offsetWidth;
      return vert ? (e.clientY - r.top - hs / 2) / (r.height - hs) : (e.clientX - r.left - hs / 2) / (r.width - hs);
    };
    track.addEventListener('pointerdown', e => {
      takeOver();
      track.setPointerCapture(e.pointerId);
      track.classList.add('is-grab');
      if (e.target === handle) grab = posToT(e) - t;
      else { grab = 0; set(posToT(e)); }
    });
    track.addEventListener('pointermove', e => { if (grab !== null) set(posToT(e) - grab); });
    const release = () => { grab = null; track.classList.remove('is-grab'); };
    track.addEventListener('pointerup', release);
    track.addEventListener('pointercancel', release);
    track.addEventListener('keydown', e => {
      const map = { ArrowDown: .05, ArrowRight: .05, ArrowUp: -.05, ArrowLeft: -.05, PageDown: .25, PageUp: -.25 };
      let v = null;
      if (e.key in map) v = t + map[e.key];
      else if (e.key === 'Home') v = 0;
      else if (e.key === 'End') v = 1;
      if (v === null) return;
      e.preventDefault();
      takeOver();
      set(v);
    });
    autoBtn.addEventListener('click', () => { takeOver(); go(t < .5 ? 1 : 0, reduce ? 0 : 1100); });
    cutBtn.addEventListener('click', () => {
      takeOver();
      set(t < .5 ? 1 : 0);
      cutBtn.classList.add('is-on');
      setTimeout(() => cutBtn.classList.remove('is-on'), 200);
    });

    // Pista: la palanca se mueve sola un poco la primera vez que se ve
    if (!reduce) {
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting || touched) return;
        io.disconnect();
        setTimeout(() => { if (!touched) go(.24, 750, true, () => { if (!touched) setTimeout(() => !touched && go(0, 650, true), 250); }); }, 450);
      }, { threshold: .6 });
      io.observe(mix);
    }
    addEventListener('resize', () => set(t));
    set(0);
  })();

  /* ---------- Test: tu turno en el prompter ---------- */
  (() => {
    const root = $('#quiz');
    if (!root) return;

    const Q = [
      { q: '¿Quién escribió el guion que estás viviendo ahora mismo?', a: [['Mis padres y mi entorno', 'c'], ['Lo que se supone que «toca» hacer', 'c'], ['Yo, pero lo abandono a mitad', 'x'], ['Yo, pero nadie lo ve', 'm']] },
      { q: 'Cuando empiezas algo nuevo…', a: [['Lo dejo cuando se acaba la motivación', 'x'], ['Me da miedo enseñarlo por lo que dirán', 'm'], ['No sé si de verdad es lo que quiero', 'c'], ['Me cuesta que alguien se entere de que existe', 'm']] },
      { q: '¿Qué frase te suena más?', a: [['«Algún día me pondré en serio»', 'x'], ['«Yo es que soy así»', 'c'], ['«Hago cosas buenas, pero nadie me paga por ellas»', 'm'], ['«Empiezo fuerte y me desinflo»', 'x']] },
      { q: '¿Qué parte de tu vida va más en piloto automático?', a: [['Trabajo y dinero', 'm'], ['Relaciones y cómo me ven', 'c'], ['Hábitos, cuerpo y rutina', 'x'], ['Mi propósito', 'c']] },
      { q: '¿Cómo de en serio vas a reescribirlo?', a: [['Solo estoy mirando', '1'], ['Quiero empezar este mes', '2'], ['Estoy listo para invertir en mí ya', '3']] }
    ];
    const RES = {
      m: { role: 'El talento invisible', al: 'al talento invisible', line: 'Tengo valor que aportar, pero me quedo en segundo plano.', act: 'Acto I, Marketing', actLine: 'Dejar de rogar que me vean.',
        text: 'Tienes cosas que contar y valor que aportar, pero tu guion te deja en segundo plano. No es falta de capacidad: nadie te enseñó a mostrarte sin sentir que ruegas atención.' },
      c: { role: 'El actor sin papel propio', al: 'al actor sin papel propio', line: 'Interpreto un personaje que escribieron otros.', act: 'Acto II, Conciencia', actLine: 'Mirar el papel que llevo actuando.',
        text: 'Estás interpretando un personaje que escribieron otros: expectativas, creencias heredadas, lo que «toca». Antes de cambiar nada necesitas ver con claridad el papel que llevas actuando.' },
      x: { role: 'El protagonista intermitente', al: 'al protagonista intermitente', line: 'Arranco con fuerza, pero el cambio no se queda.', act: 'Acto III, Mentalidad', actLine: 'Convertirlo en quien soy, no en lo que intento.',
        text: 'Sabes lo que quieres y arrancas con fuerza, pero el cambio no se queda. Se acaba la motivación y vuelves al guion de siempre. Te falta convertirlo en identidad.' }
    };
    const COMMIT = { 1: 'Solo estoy mirando', 2: 'Quiero empezar este mes', 3: 'Estoy listo para invertir en mí ya' };
    const CHIPS = ['Dejar de esperar al lunes.', 'Enseñar lo que hago sin miedo.', 'Elegir yo mi camino.'];
    const DEFAULT_LINE = 'Dejo de recitar. Empiezo a escribir.';
    const TOTAL = Q.length + 1;

    const answers = [];
    let step = 0, name = '', line = '', busy = false, started = false, rollTween = null;

    root.innerHTML = `
      <div class="quiz__bar"><span class="quiz__cam"><i class="tally is-on"></i>Prompter · Tu turno</span><span id="qCount"></span></div>
      <div class="quiz__segs" aria-hidden="true">${'<i></i>'.repeat(TOTAL)}</div>
      <div class="quiz__body" id="qBody"></div>`;
    const body = $('#qBody', root), count = $('#qCount', root), segs = $$('.quiz__segs i', root);

    const progress = () => {
      const done = step >= TOTAL;
      count.textContent = done ? 'Guion listo' : `${pad(step + 1)} / ${pad(TOTAL)}`;
      segs.forEach((s, i) => { s.classList.toggle('on', done || i < step); s.classList.toggle('cur', !done && i === step); });
    };

    const swap = (node, dir = 1, after) => {
      const put = () => {
        if (rollTween) { rollTween.kill(); rollTween = null; }
        body.replaceChildren(node);
        progress();
        if (started) {
          const h = $('[tabindex="-1"]', body);
          h && h.focus({ preventScroll: true });
          const top = root.getBoundingClientRect().top;
          if (top < 70) scrollTo({ top: top + scrollY - 80, behavior: reduce ? 'auto' : 'smooth' });
        }
        if (G) G.from(node.children, { x: 36 * dir, opacity: 0, duration: .55, stagger: .05, ease: 'expo.out', clearProps: 'all' });
        after && after();
        busy = false;
      };
      if (G && body.firstElementChild) {
        G.to(body.firstElementChild, { x: -28 * dir, opacity: 0, duration: .2, ease: 'power2.in' });
        setTimeout(put, 210);
      } else put();
    };
    const el = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };

    const viewQuestion = (dir) => {
      const q = Q[step];
      const node = el(`<div class="q">
        <h3 class="q__title" tabindex="-1"></h3>
        <div class="opts" role="group" aria-label="Respuestas">${q.a.map((o, k) => `<button type="button" class="opt${answers[step] === k ? ' is-picked' : ''}" data-k="${k}"><b>${'ABCD'[k]}</b><span></span></button>`).join('')}</div>
        ${step ? '<button type="button" class="q__back">Anterior</button>' : ''}
      </div>`);
      $('.q__title', node).textContent = q.q;
      $$('.opt', node).forEach((b, k) => {
        $('span', b).textContent = q.a[k][0];
        b.addEventListener('click', () => {
          if (busy) return;
          busy = true; started = true;
          answers[step] = k;
          $$('.opt', node).forEach(o => o.classList.toggle('is-picked', o === b));
          setTimeout(() => { step++; step < Q.length ? viewQuestion(1) : viewSign(1); }, reduce ? 120 : 340);
        });
      });
      const back = $('.q__back', node);
      back && back.addEventListener('click', () => { if (busy) return; busy = true; started = true; step--; viewQuestion(-1); });
      swap(node, dir);
    };

    const viewSign = (dir) => {
      step = Q.length;
      const node = el(`<form class="firma" novalidate>
        <h3 class="q__title" tabindex="-1">Último bloque. Fírmalo tú.</h3>
        <label class="field"><span>¿Cómo te llamas?</span><input name="name" type="text" maxlength="40" autocomplete="given-name" placeholder="Tu nombre"></label>
        <label class="field field--line"><span>La primera línea de tu nuevo guion</span><input name="line" type="text" maxlength="90" placeholder="Ej.: Dejar de pedir permiso para empezar."></label>
        <div class="chips" role="group" aria-label="Ideas para tu primera línea">${CHIPS.map(c => `<button type="button" class="chip">${c}</button>`).join('')}</div>
        <div class="sign__row"><button type="button" class="q__back">Anterior</button><button type="submit" class="btn btn--rec"><i></i>Ver mi guion en el prompter</button></div>
      </form>`);
      const fName = node.elements.name, fLine = node.elements.line;
      fName.value = name; fLine.value = line;
      $$('.chip', node).forEach(c => c.addEventListener('click', () => { fLine.value = c.textContent; fLine.focus(); }));
      $('.q__back', node).addEventListener('click', () => {
        if (busy) return;
        busy = true; name = fName.value.trim(); line = fLine.value.trim();
        step = Q.length - 1; viewQuestion(-1);
      });
      node.addEventListener('submit', e => {
        e.preventDefault();
        if (busy) return;
        busy = true; name = fName.value.trim(); line = fLine.value.trim();
        step = TOTAL; viewResult(1);
      });
      swap(node, dir);
    };

    const compute = () => {
      const c = { m: 0, c: 0, x: 0 };
      answers.slice(0, 4).forEach((a, i) => c[Q[i].a[a][1]]++);
      return ['m', 'c', 'x'].reduce((best, k) => (c[k] > c[best] ? k : best), 'm');
    };
    const commitOf = () => COMMIT[Q[4].a[answers[4]][1]];

    const message = key => {
      const r = RES[key];
      const list = Q.map((q, i) => `${i + 1}. ${q.q} → ${q.a[answers[i]][0]}`).join('\n');
      return `Hola Mario 👋${name ? ` Soy ${name}.` : ''} Acabo de hacer el test de Reescribe tu Guion.\n\n` +
        `🎬 Mi papel: ${r.role}\n📌 Mi acto pendiente: ${r.act}\n🔥 Compromiso: ${commitOf()}\n✍️ Mi primera línea: «${line || DEFAULT_LINE}»\n\n` +
        `Mis respuestas:\n${list}\n\nQuiero ver la masterclass y saber más del curso.`;
    };

    const playScript = script => {
      const roll = $('.script__roll', script), ls = [...roll.children];
      if (!G) {
        script.classList.add('is-static');
        ls.forEach(l => l.classList.add('is-live'));
        return;
      }
      script.classList.remove('is-static');
      const centers = ls.map(l => l.offsetTop + l.offsetHeight / 2);
      const pos = { y: centers[0] };
      let cur = -1;
      const draw = () => {
        roll.style.transform = `translate3d(0, ${(-pos.y).toFixed(1)}px, 0)`;
        let k = 0;
        centers.forEach((c, i) => { if (Math.abs(c - pos.y) < Math.abs(centers[k] - pos.y)) k = i; });
        if (k === cur) return;
        cur = k;
        ls.forEach((l, i) => { l.classList.toggle('is-live', i === k); l.classList.toggle('is-read', i < k); });
      };
      draw();
      rollTween = G.to(pos, { y: centers[centers.length - 1], duration: (ls.length - 1) * 1.25, delay: .7, ease: 'none', onUpdate: draw });
    };

    const viewResult = (dir) => {
      const key = compute(), r = RES[key];
      const lines = [];
      if (name) lines.push(`Me llamo ${name}.`);
      lines.push(`Hasta hoy he interpretado ${r.al}.`, r.line, `Mi acto pendiente: ${r.act}.`, `${r.actLine}`, `Mi compromiso: ${commitOf().toLowerCase()}.`, 'Y a partir de hoy, escribo yo:');
      const node = el(`<div class="res">
        <h3 class="q__title" tabindex="-1">${name ? 'Tu nuevo guion, ' : 'Tu nuevo guion'}<span class="res__name"></span></h3>
        <div class="script" role="region" aria-label="Tu nuevo guion"><span class="script__marker" aria-hidden="true"></span><div class="script__roll"></div></div>
        <div class="res__end">
          <p class="res__role">Tu papel ahora mismo: <strong></strong>. <span class="res__text"></span></p>
          <a class="btn btn--rec" target="_blank" rel="noopener"><i></i>Enviar mi guion a Mario</a>
          <button type="button" class="btn btn--line" data-replay>Reproducir otra vez</button>
          <button type="button" class="q__back" data-again>Repetir el test</button>
        </div>
      </div>`);
      $('.res__name', node).textContent = name;
      const roll = $('.script__roll', node);
      lines.forEach(t => { const p = document.createElement('p'); p.className = 'script__l'; p.textContent = t; roll.append(p); });
      const you = document.createElement('p');
      you.className = 'script__l script__l--you';
      you.textContent = `«${line || DEFAULT_LINE}»`;
      roll.append(you);
      $('.res__role strong', node).textContent = r.role;
      $('.res__text', node).textContent = r.text;
      $('a', node).href = wa(message(key));
      const script = $('.script', node);
      $('[data-replay]', node).addEventListener('click', () => { if (rollTween) rollTween.kill(); playScript(script); });
      $('[data-again]', node).addEventListener('click', () => {
        if (busy) return;
        busy = true; answers.length = 0; step = 0;
        viewQuestion(-1);
      });
      swap(node, dir, () => playScript(script));
    };

    viewQuestion(1);
  })();
})();
