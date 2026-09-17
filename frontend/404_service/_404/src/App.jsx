import { useEffect } from 'react';
import { animate, stagger } from 'animejs';
import './css/App.css';
import HeroSection from './components/HeroSection';
import WorksSection from './components/WorksSection';
import AboutSection from './components/AboutSection';

export default function App() {
  useEffect(() => {
    const layers = document.querySelectorAll('[data-depth]');
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const handleMouseMove = (event) => {
      tx = (event.clientX / window.innerWidth - 0.5) * 2;
      ty = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    function loop() {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;

      layers.forEach((el) => {
        const d = Number(el.dataset.depth);
        el.style.transform = `translate(${(-cx * d).toFixed(2)}px, ${(-cy * d).toFixed(2)}px)`;
      });

      requestAnimationFrame(loop);
    }

    loop();

    const zero = document.querySelector('.n2');
    const glitchTimer = setInterval(() => {
      if (Math.random() > 0.72 && zero) {
        zero.style.transition = 'none';
        zero.style.webkitTextStroke = '3px var(--lime)';
        zero.style.textShadow = '0 0 22px rgba(139,92,246,.9)';

        setTimeout(() => {
          zero.style.transition = 'all .25s';
          zero.style.webkitTextStroke = '3px var(--purple)';
          zero.style.textShadow = 'none';
        }, 90);
      }
    }, 1600);

    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el) => io.observe(el));

    const navLinks = [...document.querySelectorAll('.sidenav a')];
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
            });
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );

    sections.forEach((section) => spy.observe(section));

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('motion-ready');
    if (reduceMotion) {
      document.documentElement.classList.add('no-anime');
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('pointermove', handlePointerMove);
        clearInterval(glitchTimer);
        cancelAnimationFrame(rafId);
        io.disconnect();
        spy.disconnect();
      };
    }

    animate('.character', {
      opacity: [0, 0.86],
      x: [80, 0],
      scale: [1.04, 1],
      duration: 1250,
      ease: 'outExpo',
    });

    animate('.shard', {
      opacity: [0, 1],
      y: [-34, 0],
      scaleY: [0.72, 1],
      delay: stagger(85, { start: 220 }),
      duration: 980,
      ease: 'outQuint',
    });

    animate('.digit', {
      opacity: [0, 1],
      y: [34, 0],
      skewX: [-12, 0],
      delay: stagger(115, { start: 360 }),
      duration: 740,
      ease: 'outBack',
    });

    animate('.reveal-copy', {
      opacity: [0, 1],
      y: [18, 0],
      delay: stagger(80, { start: 520 }),
      duration: 700,
      ease: 'outCubic',
    });

    animate('.reveal-top', {
      opacity: [0, 1],
      y: [-12, 0],
      delay: stagger(90, { start: 180 }),
      duration: 650,
      ease: 'outCubic',
    });

    animate('.reveal-line', {
      scaleX: [0, 1],
      opacity: [0, 1],
      duration: 850,
      delay: 260,
      ease: 'outExpo',
    });

    animate('.reveal-right', {
      opacity: [0, 1],
      x: [22, 0],
      delay: stagger(140, { start: 760 }),
      duration: 760,
      ease: 'outCubic',
    });

    animate('.pulse', {
      scale: [1, 1.08, 1],
      opacity: [0.76, 1, 0.76],
      delay: 1350,
      duration: 2200,
      ease: 'inOutSine',
      loop: true,
    });

    animate('.ambient', {
      opacity: [0.35, 0.8],
      y: [-5, 5],
      delay: stagger(180),
      duration: 2800,
      direction: 'alternate',
      ease: 'inOutSine',
      loop: true,
    });

    animate('.top-glitch, .tiny-x', {
      x: [
        { value: 2, duration: 40 },
        { value: -3, duration: 55 },
        { value: 0, duration: 60 },
      ],
      delay: stagger(520, { start: 1700 }),
      endDelay: 2600,
      ease: 'linear',
      loop: true,
    });

    const page = document.querySelector('.page');
    const flickerZero = document.querySelector('.zero');
    const motionLayers = [
      { nodes: [...document.querySelectorAll('.character')], depth: 18 },
      { nodes: [...document.querySelectorAll('.shard-a, .shard-c')], depth: -24 },
      { nodes: [...document.querySelectorAll('.shard-b, .shard-d, .shard-e')], depth: -14 },
      { nodes: [...document.querySelectorAll('.number')], depth: 10 },
      { nodes: [...document.querySelectorAll('.right-copy, .side-note')], depth: 7 },
      { nodes: [...document.querySelectorAll('.ambient, .green-dot')], depth: -9 },
    ];

    let pointerX = 0;
    let pointerY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = 0;

    const tick = () => {
      currentX += (pointerX - currentX) * 0.09;
      currentY += (pointerY - currentY) * 0.09;

      motionLayers.forEach((layer) => {
        layer.nodes.forEach((node) => {
          const x = currentX * layer.depth;
          const y = currentY * layer.depth;
          node.style.setProperty('--mx', `${x}px`);
          node.style.setProperty('--my', `${y}px`);
          node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
      });

      rafId = requestAnimationFrame(tick);
    };

    const handlePointerMove = (event) => {
      pointerX = event.clientX / window.innerWidth - 0.5;
      pointerY = event.clientY / window.innerHeight - 0.5;
      if (page) {
        page.style.setProperty('--cursor-x', `${event.clientX}px`);
        page.style.setProperty('--cursor-y', `${event.clientY}px`);
      }
      if (!rafId) tick();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', () => {
      pointerX = 0;
      pointerY = 0;
    });

    if (flickerZero) {
      const staggerFlicker = () => {
        flickerZero.classList.add('is-flickering');
        setTimeout(() => {
          flickerZero.classList.remove('is-flickering');
          setTimeout(staggerFlicker, 1800 + Math.random() * 2600);
        }, 180);
      };
      setTimeout(staggerFlicker, 1000);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointermove', handlePointerMove);
      clearInterval(glitchTimer);
      cancelAnimationFrame(rafId);
      io.disconnect();
      spy.disconnect();
    };
  }, []);

  return (
    <>
      <HeroSection />
      <WorksSection />
      <AboutSection />
    </>
  );
}
