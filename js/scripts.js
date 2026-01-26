
/*!
 * Start Bootstrap - Personal v1.0.1 (https://startbootstrap.com/template-overviews/personal)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-personal/blob/master/LICENSE)
 */
// This file is the project's main JS — animations added with GSAP

'use strict'

/* Animaciones GSAP para la sección del perfil */
document.addEventListener('DOMContentLoaded', () => {
	if (typeof gsap === 'undefined') return;
	if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
	if (window.ScrollSmoother) gsap.registerPlugin(ScrollSmoother);
	if (window.ScrambleTextPlugin) gsap.registerPlugin(ScrambleTextPlugin);

	// Crear ScrollSmoother si está disponible (suavizado de scroll)
	try {
		if (window.ScrollSmoother) {
			// Ajusta `smooth` y `effects` según prefieras
			ScrollSmoother.create({
				wrapper: '#smooth-wrapper',
				content: '#smooth-content',
				smooth: 1.6,
				effects: true
			});
		}
	} catch (e) {
		console.warn('ScrollSmoother no pudo inicializarse:', e);
	}

	const profile = document.querySelector('.profile');
	const img = document.querySelector('.profile-img');
	const dots = Array.from(document.querySelectorAll('.dots-1, .dots-2, .dots-3, .dots-4'));

	// Entrada suave del bloque profile
	if (profile) {
		gsap.from(profile, { opacity: 0, y: 40, duration: 1.2, ease: 'power3.out', delay: 0.2 });
		// Flotación sutil contínua
		gsap.to(profile, { x: 38, y: 8, duration: 2.6, yoyo: true, repeat: 1, ease: 'sine.inOut' });
	}

	// Efecto sobre la imagen principal
	if (img) {
		gsap.fromTo(img, { scale: 0.98, rotation: -1 }, { scale: 1, rotation: 0, duration: 1.2, ease: 'power3.out' });
		img.addEventListener('mouseenter', () => gsap.to(img, { scale: 1.04, duration: 1.56, ease: 'power3.out' }));
		img.addEventListener('mouseleave', () => gsap.to(img, { scale: 1, duration: 1.56, ease: 'power3.out' }));
	}

	if (dots.length) {
		// Movimiento orgánico y stagger
		gsap.to(dots, {
			y: (i) => 12 + i * 6,
			rotation: (i) => (i % 2 ? 4 : -4),
			duration: 3.2,
			yoyo: true,
			repeat: -1,
			ease: 'sine.inOut',
			stagger: 0.14
		});

		gsap.from(dots, { opacity: 0.45, scale: 0.96, duration: 2.2, stagger: 0.07, ease: 'power2.out' });

		// Parallax con el ratón
		document.addEventListener('mousemove', (e) => {
			const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
			const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
			dots.forEach((d, i) => {
				gsap.to(d, { x: x * (10 + i * 8), y: y * (6 + i * 5), duration: 0.85, ease: 'power3.out' });
			});
		}, { passive: true });
	}

	// Respectar preferencia de reducir movimiento
	const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (prefersReduced) gsap.globalTimeline.timeScale(0);

		// --- ScrambleText: animar el título visible y sincronizar con document.title ---
		const headerTitleEl = document.querySelector('h1.display-3 .text-gradient');
		/* const fullTitle = 'DR23 | Marketing Digital y Desarrollo Web con IA en Benidorm'; */
		const fullTitle = 'Inteligencia Artificial Web Seo Marketing Digital';
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()-_+=';

		// Si el plugin oficial está disponible, usarlo; si no, fallback personalizado
		if (window.ScrambleTextPlugin) {
			if (headerTitleEl) {
				gsap.to(headerTitleEl, {
					duration: 2.0,
					scrambleText: { text: fullTitle, chars, revealDelay: 0.5, speed: 0.3 },
					delay: 0.9
				});
			}

			const scrambler = document.createElement('span');
			scrambler.style.position = 'absolute';
			scrambler.style.left = '-9999px';
			document.body.appendChild(scrambler);

			gsap.to(scrambler, {
				duration: 2.2,
				scrambleText: { text: fullTitle, chars, revealDelay: 0.5, speed: 0.3 },
				delay: 1.0,
				onUpdate: () => { document.title = scrambler.textContent || fullTitle; },
				onComplete: () => { document.title = fullTitle; scrambler.remove(); }
			});
		} else {
			// Fallback: animación scramble personalizada sin plugin
			function customScramble(targetEl, text, duration = 2.0, delay = 0) {
				const state = { progress: 0 };
				gsap.to(state, {
					progress: 1,
					duration,
					delay,
					ease: 'power2.out',
					onUpdate: () => {
						const p = state.progress;
						const revealed = Math.floor(p * text.length);
						let out = '';
						for (let i = 0; i < text.length; i++) {
							if (i < revealed) out += text[i];
							else out += chars[Math.floor(Math.random() * chars.length)];
						}
						if (targetEl) targetEl.textContent = out;
					},
					onComplete: () => { if (targetEl) targetEl.textContent = text; }
				});
			}

			if (headerTitleEl) customScramble(headerTitleEl, fullTitle, 2.0, 0.9);

			// sincronizar con document.title
			const titleHolder = { text: '' };
			const setTitle = (s) => { document.title = s; };
			// use customScramble but update document.title inside onUpdate by tapping into the same progress
			const progressObj = { p: 0 };
			gsap.to(progressObj, {
				p: 1,
				duration: 2.2,
				delay: 1.0,
				ease: 'power2.out',
				onUpdate: () => {
					const p = progressObj.p;
					const revealed = Math.floor(p * fullTitle.length);
					let out = '';
					for (let i = 0; i < fullTitle.length; i++) {
						if (i < revealed) out += fullTitle[i];
						else out += chars[Math.floor(Math.random() * chars.length)];
					}
					setTitle(out);
				},
				onComplete: () => setTitle(fullTitle)
			});
		}
        // Rotación del logo del navbar cada 3 segundos
gsap.to("#logo-navbar", {
    rotation: 360,
    duration: 0.4,
    ease: "power2.inOut",
    repeat: -1,
    repeatDelay: 2.6 // 3 segundos totales - 0.4 segundos de duración = 2.6 segundos de pausa
});
});

