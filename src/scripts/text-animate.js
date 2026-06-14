import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let splits = [];

document.addEventListener('astro:before-swap', () => {
  splits.forEach((s) => s.revert());
  splits = [];
});

document.addEventListener('astro:page-load', () => {
  document.querySelectorAll('.split-words').forEach((el) => {
    const split = new SplitText(el, { type: 'words' });
    splits.push(split);

    if (reduceMotion) {
      gsap.set(split.words, { opacity: 1, y: 0 });
      return;
    }

    gsap.from(split.words, {
      y: '0.6em',
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      delay: 0.4,
      ease: 'power2.out',
    });
  });

  document.querySelectorAll('.split-chars').forEach((el) => {
    const split = new SplitText(el, { type: 'chars' });
    splits.push(split);

    if (reduceMotion) {
      gsap.set(split.chars, { opacity: 1, y: 0 });
      return;
    }

    gsap.from(split.chars, {
      y: '0.6em',
      opacity: 0,
      duration: 0.6,
      stagger: 0.04,
      delay: 0.2,
      ease: 'power2.out',
    });
  });

  const navButtons = document.querySelectorAll('.nav-button');
  if (navButtons.length && !reduceMotion) {
    const tl = gsap.timeline();
    navButtons.forEach((btn) => {
      tl.to(btn, {
        scale: 1.15,
        duration: 0.18,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: 1,
        clearProps: 'transform',
      }, '+=0.15');
    });
  }
});
