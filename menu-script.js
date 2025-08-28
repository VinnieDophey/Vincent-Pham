document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const img = document.querySelector(".img");

  // Move the image up by full viewport height as you scroll
  gsap.to(img, {
    y: -window.innerHeight,
    ease: "none",
    scrollTrigger: {
      trigger: "main", // when main content scrolls
      start: "top bottom", // start when top of main hits bottom of viewport
      end: "bottom top", // end when bottom of main hits top of viewport
      scrub: true, // sync with scroll
    },
  });
});

// Hide/show header on scroll (same as index)
let lastScrollTop = 0;
const header = document.querySelector(".header");
let isHidden = false;

window.addEventListener("scroll", function () {
  const currentScroll = window.scrollY || document.documentElement.scrollTop;
  const scrollThreshold = 100;

  if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
    if (!isHidden) {
      header.style.transform = "translateY(-100%)";
      isHidden = true;
    }
  } else if (currentScroll < lastScrollTop) {
    if (isHidden) {
      header.style.transform = "translateY(0)";
      isHidden = false;
    }
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});
(function () {
  const konami = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
    "Enter",
  ];
  let i = 0;

  const STYLE_ID = "giant-crosshair-style";
  const CLASS_ON = "giant-crosshair-on";

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
        // <defs>
        //   <!-- Neon red glow -->
        //   <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        //     <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
        //     <feMerge>
        //       <feMergeNode in="blur"/>
        //       <feMergeNode in="SourceGraphic"/>
        //     </feMerge>
        //   </filter>
        //   <!-- Pulse animation -->
        //   <style>
        //     @keyframes pulse {
        //       0%, 100% { stroke-opacity: 1; }
        //       50% { stroke-opacity: 0.3; }
        //     }
        //     .pulse {
        //       animation: pulse 1.5s infinite;
        //     }
        //   </style>
        // </defs>

        <!-- Outer dashed circle -->
        <circle cx="64" cy="64" r="60" fill="none" stroke="black" stroke-width="6" stroke-dasharray="6,6"/>
        <circle class="pulse" cx="64" cy="64" r="60" fill="none" stroke="white" stroke-width="2" stroke-dasharray="6,6" filter="url(#glow)"/>
        
        <!-- Middle bold circle -->
        <circle cx="64" cy="64" r="20" fill="none" stroke="black" stroke-width="6"/>
        <circle class="pulse" cx="64" cy="64" r="20" fill="none" stroke="white" stroke-width="4" filter="url(#glow)"/>

        <!-- Long crosshair arms -->
        <line x1="64" y1="0"   x2="64" y2="30"  stroke="black" stroke-width="6"/>
        <line class="pulse" x1="64" y1="0"   x2="64" y2="30"  stroke="white"   stroke-width="4" filter="url(#glow)"/>
        
        <line x1="64" y1="98"  x2="64" y2="128" stroke="black" stroke-width="6"/>
        <line class="pulse" x1="64" y1="98"  x2="64" y2="128" stroke="white"   stroke-width="4" filter="url(#glow)"/>
        
        <line x1="0"  y1="64"  x2="30" y2="64"  stroke="black" stroke-width="6"/>
        <line class="pulse" x1="0"  y1="64"  x2="30" y2="64"  stroke="white"   stroke-width="4" filter="url(#glow)"/>
        
        <line x1="98" y1="64"  x2="128" y2="64" stroke="black" stroke-width="6"/>
        <line class="pulse" x1="98" y1="64"  x2="128" y2="64" stroke="white"   stroke-width="4" filter="url(#glow)"/>

        <!-- Small inner tick marks -->
        <line x1="64" y1="44" x2="64" y2="52" stroke="black" stroke-width="5"/>
        <line class="pulse" x1="64" y1="44" x2="64" y2="52" stroke="white"   stroke-width="3" filter="url(#glow)"/>

        <line x1="64" y1="76" x2="64" y2="84" stroke="black" stroke-width="5"/>
        <line class="pulse" x1="64" y1="76" x2="64" y2="84" stroke="white"   stroke-width="3" filter="url(#glow)"/>

        <line x1="44" y1="64" x2="52" y2="64" stroke="black" stroke-width="5"/>
        <line class="pulse" x1="44" y1="64" x2="52" y2="64" stroke="white"   stroke-width="3" filter="url(#glow)"/>

        <line x1="76" y1="64" x2="84" y2="64" stroke="black" stroke-width="5"/>
        <line class="pulse" x1="76" y1="64" x2="84" y2="64" stroke="white"   stroke-width="3" filter="url(#glow)"/>
      </svg>
    `.trim();

    const dataUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    const css = `
      .${CLASS_ON}, .${CLASS_ON} * {
        cursor: url("${dataUrl}") 64 64, crosshair !important;
      }
      .${CLASS_ON} a {
        color: gray !important;
      }
    `;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function toggleCrosshair(on) {
    ensureStyle();
    document.documentElement.classList.toggle(CLASS_ON, on);
  }

  function activate() {
    toggleCrosshair(!document.documentElement.classList.contains(CLASS_ON));
  }

  // Disable link clicks but keep hover
  document.addEventListener(
    "click",
    (e) => {
      if (document.documentElement.classList.contains("giant-crosshair-on")) {
        const link = e.target.closest("a");
        if (link) {
          e.preventDefault(); // stops navigation
          // don't stop propagation
          // now other listeners still receive the click
          console.log(
            "Clicked a link (navigation blocked), element:",
            e.target
          );
        }
      }
    },
    true
  );

  // Key handling
  window.addEventListener("keydown", (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

    if (key === konami[i] || (konami[i].length === 1 && key === konami[i])) {
      i++;
      if (i === konami.length) {
        activate();
        i = 0;
      }
    } else {
      i = key === konami[0] ? 1 : 0;
    }

    if (e.key === "Escape") toggleCrosshair(false);
  });
})();
