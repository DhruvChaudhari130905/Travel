import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import summitCss from "../summit.css?url";

import background from "@/assets/background.jpg";
import wCanyon from "@/assets/wonder-canyon.jpg";
import wRoad from "@/assets/wonder-road.jpg";
import wMeadow from "@/assets/wonder-meadow.jpg";
import wCliff from "@/assets/wonder-cliff.jpg";
import sLake from "@/assets/split-lake.jpg";
import sFall from "@/assets/split-waterfall.jpg";
import sRiver from "@/assets/split-river.jpg";
import jungle from "@/assets/jungle-canopy.jpg";

declare global {
  interface Window {
    gsap?: any;
    ScrollTrigger?: any;
    Lenis?: any;
  }
}

export const Route = createFileRoute("/")({
  component: SummitPage,
  head: () => ({
    meta: [
      { title: "Summit — Where the Map Ends, We Begin" },
      {
        name: "description",
        content:
          "Cinematic, guided expeditions for the relentlessly curious. 320+ destinations, 50,000+ trail miles, 4,800+ travelers led to altitude.",
      },
      { property: "og:title", content: "Summit — Where the Map Ends, We Begin" },
      {
        property: "og:description",
        content:
          "Cinematic, guided expeditions for the relentlessly curious. Venture your outdoor adventurous journey with us.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "stylesheet", href: summitCss },
      { rel: "canonical", href: "/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Oswald:wght@300;400;700;900&family=Playfair+Display:wght@600;700&family=Montserrat:wght@900&family=Saira+Stencil+One&display=swap",
      },
    ],
    scripts: [
      { src: "https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js", defer: true },
      { src: "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js", defer: true },
      { src: "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js", defer: true },
    ],
  }),
});

function Compass({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function SummitPage() {
  useEffect(() => {
    let raf = 0;
    let lenis: any;
    const triggers: any[] = [];

    // 1) Hero character split + entrance animation (vanilla, no framework)
    const titleEls = document.querySelectorAll<HTMLElement>(".hero__title");
    titleEls.forEach(titleEl => {
      if (titleEl && !titleEl.dataset.split) {
        const text = titleEl.textContent || "";
        titleEl.textContent = "";
        for (const ch of text) {
          const span = document.createElement("span");
          span.className = "char";
          span.textContent = ch === " " ? "\u00A0" : ch;
          span.style.transform = "translateY(-60px)";
          span.style.opacity = "0";
          titleEl.appendChild(span);
        }
        titleEl.dataset.split = "1";
      }
    });

    // 2) Throttled navbar scrolled state via rAF
    const nav = document.querySelector<HTMLElement>(".nav");
    let pending = false;
    const onScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        if (nav) {
          if (window.scrollY > 80) nav.classList.add("is-scrolled");
          else nav.classList.remove("is-scrolled");
        }
        pending = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // 3) Wait for Lenis + GSAP scripts to load, then wire everything
    const startWhenReady = () => {
      if (!window.gsap || !window.Lenis || !window.ScrollTrigger) {
        raf = window.setTimeout(startWhenReady, 60) as unknown as number;
        return;
      }
      const { gsap, Lenis, ScrollTrigger } = window;
      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Hero headline character entrance
      const chars = document.querySelectorAll(".hero__title .char");
      if (chars.length) {
        gsap.to(chars, {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.04,
          delay: 0.2,
        });
      }

      // Hero feats entrance
      const feats = document.querySelectorAll(".feat");
      if (feats.length) {
        gsap.fromTo(
          feats,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            delay: 0.8,
          }
        );
      }

      // Staggered reveals via ScrollTrigger
      const reveal = (selector: string, stepDelay = 0) => {
        const items = gsap.utils.toArray(selector);
        if (!items.length) return;

        ScrollTrigger.batch(selector, {
          start: "top 85%",
          onEnter: (elements: any[]) => {
            gsap.fromTo(
              elements,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.08,
                delay: stepDelay,
                overwrite: true,
              }
            );
          },
          once: true,
        });
      };
      reveal(".wonder");
      reveal(".reason", 0.1);
      reveal(".explore__stat", 0.2);
      reveal(".explore__list li", 0.1);

      // Section Headers reveal
      const sectionHeads = gsap.utils.toArray(
        ".section-head, .reasons__head, .split__text, .explore__text"
      );
      sectionHeads.forEach((head: any) => {
        const t = gsap.fromTo(
          head,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: head,
              start: "top 85%",
            },
          }
        );
        triggers.push(t);
      });

      // Parallax utility for elements
      const par = (sel: string, percent: number, triggerSelector: string, startOffset = "top bottom") => {
        const el = document.querySelector(sel);
        if (!el) return;
        const t = gsap.to(el, {
          yPercent: percent,
          ease: "none",
          scrollTrigger: {
            trigger: triggerSelector,
            start: startOffset,
            end: "bottom top",
            scrub: true,
          },
        });
        triggers.push(t);
      };

      // Apply parallax to various media
      par(".split__media .m1", -8, ".split");
      par(".split__media .m2", -14, ".split");
      par(".split__media .m3", -6, ".split");
      par(".explore__bg img", 15, ".explore");
      par(".hero__media img", 15, ".hero", "top top");

      ScrollTrigger.refresh();
    };
    startWhenReady();

    // Wonder card hover -> inner img scale (GSAP, no CSS hover so we control duration)
    const wonders = document.querySelectorAll<HTMLElement>(".wonder");
    const onEnter = (e: Event) => {
      const img = (e.currentTarget as HTMLElement).querySelector("img");
      if (img && window.gsap) {
        window.gsap.to(img, { scale: 1.06, duration: 0.5, ease: "power2.out" });
      }
    };
    const onLeave = (e: Event) => {
      const img = (e.currentTarget as HTMLElement).querySelector("img");
      if (img && window.gsap) {
        window.gsap.to(img, { scale: 1, duration: 0.5, ease: "power2.out" });
      }
    };
    wonders.forEach((w) => {
      w.addEventListener("mouseenter", onEnter);
      w.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      wonders.forEach((w) => {
        w.removeEventListener("mouseenter", onEnter);
        w.removeEventListener("mouseleave", onLeave);
      });
      if (raf) clearTimeout(raf);
      triggers.forEach((t) => t?.scrollTrigger?.kill());
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <a className="nav__logo" href="#top" aria-label="Summit home">
          <Compass />
        </a>
        <label className="nav__search" aria-label="Search">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
          </svg>
          <input type="text" placeholder="Search destinations, trails, gear…" />
        </label>
        <div className="nav__links">
          <a className="nav__link is-active" href="#destinations">Adventure</a>
          <a className="nav__link" href="#about">About</a>
          <a className="nav__link" href="#blog">Blog</a>
          <a className="nav__link" href="#shop">Shop</a>
          <a className="nav__link" href="#contact">Contact</a>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero" id="top">
        {/* SVG Mask for Text Behind Mountains */}
        <svg style={{ width: 0, height: 0, position: 'absolute', pointerEvents: 'none' }}>
          <defs>
            <filter id="mask-contrast">
              <feColorMatrix type="matrix" values="
                4   0   0   0  -1.2
                0   4   0   0  -1.2
                0   0   4   0  -1.2
                0   0   0   1   0" />
            </filter>
            <mask id="mountain-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100vw" height="100vh">
              <image className="mask-bg" href={background} x="0" y="-15vh" width="100vw" height="130vh" preserveAspectRatio="xMidYMid slice" filter="url(#mask-contrast)" />
            </mask>
          </defs>
        </svg>

        <div className="hero__media">
          <img src={background} alt="Cinematic background" width={1920} height={1280} />
        </div>
        <div className="hero__overlay" />
        <div className="hero__side" aria-hidden="true">
          <span>R</span><span>E</span><span>A</span><span>C</span><span>H</span>
          <span className="hero__side-line" />
        </div>
        
        {/* Invisible title preserves standard flex layout */}
        <div className="hero__content">
          <h1 className="hero__title" style={{ visibility: 'hidden' }}>ADVENTURE</h1>
          <p className="hero__sub">Create Your Outdoor Adventure Story With Us</p>
        </div>
        
        {/* Visible title perfectly masked by the mountains */}
        <div className="hero__content" style={{ position: 'absolute', inset: 0, mask: 'url(#mountain-mask)', WebkitMask: 'url(#mountain-mask)', pointerEvents: 'none' }}>
          <h1 className="hero__title">ADVENTURE</h1>
        </div>
        <div className="hero__feats" aria-label="What sets us apart">
          {[
            { n: "1", t: "Be Present", s: "Just stand here." },
            { n: "2", t: "Craft the Route", s: "Your terrain, your way." },
            { n: "3", t: "Be Powered", s: "Led and self-sourced." },
            { n: "4", t: "Find the Horizon", s: "The peak is a posture." },
          ].map((f) => (
            <div className="feat" key={f.n}>
              <div className="feat__num">{f.n}</div>
              <div>
                <div className="feat__t">{f.t}</div>
                <div className="feat__s">{f.s}</div>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* WONDERS */}
      <section className="wonders" id="destinations">
        <div className="section-head">
          <h2>The Wonders Of Nature</h2>
          <p>From towering peaks to ancient forests, each landscape holds a story written in stone and sky. We take you there.</p>
        </div>
        <div className="wonders__grid">
          {[
            { src: wCanyon, loc: "Utah, USA", ttl: "Vermilion Canyonlands" },
            { src: wRoad, loc: "Pacific Northwest", ttl: "Cascade Forest Pass" },
            { src: wMeadow, loc: "Patagonia, AR", ttl: "Wind & Storm Steppe" },
            { src: wCliff, loc: "Wadi Rum, JO", ttl: "Sandstone Vertical" },
          ].map((w) => (
            <article className="wonder" key={w.ttl}>
              <img src={w.src} alt={w.ttl} loading="lazy" />
              <div className="wonder__veil" />
              <div className="wonder__label">
                <div className="loc">{w.loc}</div>
                <div className="ttl">{w.ttl}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* REASONS */}
      <section className="reasons" id="about">
        <div className="reasons__head"><h2>Reasons For Choosing Us</h2></div>
        <div className="reasons__grid">
          {[
            {
              title: "Trail-Tested Guides",
              body: "Our team has logged 50,000+ trail miles across six continents. We don't consult maps. We wrote them.",
              icon: (
                <svg viewBox="0 0 24 24"><path d="M3 20l5-12 4 8 3-5 6 9H3z" /></svg>
              ),
            },
            {
              title: "Flexible Departures",
              body: "Leave when the season calls. We operate year-round across all climate zones, so no window is ever closed.",
              icon: (
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              ),
            },
            {
              title: "Always Home Outside",
              body: "Every camp, lodge, and basecamp is selected for immersion, not just accommodation. Sleep where the wild things are.",
              icon: (
                <svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></svg>
              ),
            },
          ].map((r) => (
            <div className="reason" key={r.title}>
              <div className="reason__icon">{r.icon}</div>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SPLIT */}
      <section className="split">
        <div className="split__media">
          <div className="m m1"><img src={sLake} alt="Glacial lake at dawn" loading="lazy" /></div>
          <div className="m m2"><img src={sFall} alt="Mossy gorge waterfall" loading="lazy" /></div>
          <div className="m m3"><img src={sRiver} alt="Aerial of serpentine river valley" loading="lazy" /></div>
        </div>
        <div className="split__text">
          <span className="overline">Why Choose Us</span>
          <h2>Here's what makes a vacation perfect for you!</h2>
          <p>
            When you stop planning a holiday and start living an expedition, something changes. You stop counting days
            and start measuring moments — by summit gained, by silence found, by fire shared at altitude.
          </p>
          <a href="#book" className="btn-gold">Start Your Journey</a>
        </div>
      </section>

      {/* EXPLORE */}
      <section className="explore">
        <div className="explore__bg"><img src={jungle} alt="Aerial of dense jungle canopy" loading="lazy" /></div>
        <div className="explore__veil" />
        <div className="explore__inner">
          <div className="explore__text">
            <span className="overline">Our Story</span>
            <h2>Explore The Nature With Us</h2>
            <p>
              We are not a tour company. We are a community of people who believe that the most important journeys are
              the ones that change how you see everything else. Founded by mountaineers, guided by locals, built for the
              relentlessly curious.
            </p>
            <ul className="explore__list">
              <li><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>Customised Itineraries</li>
              <li><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>Expert Local Guides</li>
              <li><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>24/7 Trail Support</li>
            </ul>
          </div>
          <div className="explore__panel">
            <div className="explore__thumb">
              <img src={jungle} alt="Jungle expedition footage" loading="lazy" />
              <button className="explore__play" aria-label="Play story video">
                <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </button>
            </div>
            <div className="explore__stats">
              <div className="explore__stat"><div className="num">12+</div><div className="lbl">Years</div></div>
              <div className="explore__stat"><div className="num">4.8K</div><div className="lbl">Travelers</div></div>
              <div className="explore__stat"><div className="num">320</div><div className="lbl">Routes</div></div>
              <div className="explore__stat"><div className="num">6</div><div className="lbl">Continents</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" id="contact">
        <div className="footer__grid">
          <div>
            <div className="footer__logo"><Compass /><span>SUMMIT</span></div>
            <p className="footer__tag">Where the map ends, we begin.</p>
            <div className="footer__social">
              <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" /></svg></a>
              <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="3" /><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none" /></svg></a>
              <a href="#" aria-label="Pinterest"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M11 8c2 0 4 1 4 3.5S13 16 11.5 15c-.5-.4-.5-1 0-2l1-4-2 9" /></svg></a>
            </div>
          </div>
          <div className="footer__col">
            <h4>Explore</h4>
            <ul><li><a href="#">Destinations</a></li><li><a href="#">Expeditions</a></li><li><a href="#">Trail Stories</a></li><li><a href="#">Gear Shop</a></li></ul>
          </div>
          <div className="footer__col">
            <h4>Company</h4>
            <ul><li><a href="#">About</a></li><li><a href="#">Guides</a></li><li><a href="#">Press</a></li><li><a href="#">Careers</a></li></ul>
          </div>
          <div className="footer__col">
            <h4>Contact</h4>
            <ul><li><a href="#">hello@summit.co</a></li><li><a href="#">+1 (415) 555-0199</a></li><li><a href="#">Reno, Nevada</a></li></ul>
          </div>
        </div>
        <div className="footer__bar">
          <div>© 2026 Summit Expeditions. All rights reserved.</div>
          <div className="links"><a href="#">Privacy</a><a href="#">Terms</a></div>
        </div>
      </footer>
    </>
  );
}
