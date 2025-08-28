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
        <!-- Outer dashed circle -->
        <circle cx="64" cy="64" r="60" fill="none" stroke="black" stroke-width="6" stroke-dasharray="6,6"/>
        <circle class="pulse" cx="64" cy="64" r="60" fill="none" stroke="white" stroke-width="2" stroke-dasharray="6,6" filter="url(#glow)"/>
        
        <!-- Middle bold circle -->
        <circle cx="64" cy="64" r="20" fill="none" stroke="black" stroke-width="6"/>
        <circle class="pulse" cx="64" cy="64" r="20" fill="none" stroke="white" stroke-width="4" filter="url(#glow)"/>

        <!-- Long crosshair arms -->
        <line x1="64" y1="0"   x2="64" y2="30"  stroke="white" stroke-width="6"/>
        <line class="pulse" x1="64" y1="0"   x2="64" y2="30"  stroke="white"   stroke-width="4" filter="url(#glow)"/>
        
        <line x1="64" y1="98"  x2="64" y2="128" stroke="white" stroke-width="6"/>
        <line class="pulse" x1="64" y1="98"  x2="64" y2="128" stroke="white"   stroke-width="4" filter="url(#glow)"/>
        
        <line x1="0"  y1="64"  x2="30" y2="64"  stroke="white" stroke-width="6"/>
        <line class="pulse" x1="0"  y1="64"  x2="30" y2="64"  stroke="white"   stroke-width="4" filter="url(#glow)"/>
        
        <line x1="98" y1="64"  x2="128" y2="64" stroke="white" stroke-width="6"/>
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
          screenShake(100);
          setTimeout(() => launchProjectile(e.target), 1500);
          // --- Pause orbit animations ---
          const orbitingBodies = document.querySelectorAll(
            ".btn1, .btn2, .btn3"
          );
          orbitingBodies.forEach((el) => {
            el.style.animationPlayState = "paused";
          });
          toggleCrosshair(false);
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

  function launchProjectile(target) {
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    const projectile = document.createElement("div");
    projectile.className = "projectile";
    projectile.textContent = "oop!";
    document.body.appendChild(projectile);

    // pick random starting side
    const side = Math.floor(Math.random() * 4);
    let startX, startY;
    if (side === 0) {
      // top
      startX = Math.random() * window.innerWidth;
      startY = -50;
    } else if (side === 1) {
      // right
      startX = window.innerWidth + 50;
      startY = Math.random() * window.innerHeight;
    } else if (side === 2) {
      // bottom
      startX = Math.random() * window.innerWidth;
      startY = window.innerHeight + 50;
    } else {
      // left
      startX = -50;
      startY = Math.random() * window.innerHeight;
    }

    projectile.style.left = `${startX}px`;
    projectile.style.top = `${startY}px`;
    projectile.style.opacity = 1;
    projectile.style.transition = "transform 0.1s linear, opacity 0.3s ease 1s";

    const dx = targetX - startX;
    const dy = targetY - startY;

    attachCometTrail(startX, startY, targetX, targetY);

    requestAnimationFrame(() => {
      projectile.style.transform = `translate(${dx}px, ${dy}px)`;
      projectile.style.opacity = 0;
    });
    triggerBlindingFlash();
    screenShake();
    supernova(target, 40);
    setTimeout(() => projectile.remove(), 1500);
  }
  function attachCometTrail(startX, startY, targetX, targetY, spacing = 15) {
    const dx = targetX - startX;
    const dy = targetY - startY;
    const dist = Math.hypot(dx, dy);
    const steps = Math.floor(dist / spacing);

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = startX + dx * t;
      const y = startY + dy * t;

      const particle = document.createElement("div");
      particle.className = "trail-particle";
      particle.style.left = x + "px";
      particle.style.top = y + "px";
      document.body.appendChild(particle);

      requestAnimationFrame(() => {
        particle.style.transform = "scale(0)";
        particle.style.opacity = "0";
      });

      // keep glowing for ~5s
      setTimeout(() => particle.remove(), 5000);
    }
  }

  function screenShake(duration = 500, intensity = 10) {
    const body = document.body;
    const originalStyle = body.style.transform;
    let start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      if (elapsed < duration) {
        const x = (Math.random() - 0.5) * intensity;
        const y = (Math.random() - 0.5) * intensity;
        body.style.transform = `translate(${x}px, ${y}px)`;
        requestAnimationFrame(step);
      } else {
        body.style.transform = originalStyle; // reset
      }
    }

    requestAnimationFrame(step);
  }
  function triggerBlindingFlash(duration = 400) {
    const flash = document.createElement("div");
    flash.className = "supernova-flash";
    document.body.appendChild(flash);

    requestAnimationFrame(() => (flash.style.opacity = "0"));
    setTimeout(() => flash.remove(), duration + 100);
  }
  function spawnNebula(x, y, duration = 25000) {
    const nebula = document.createElement("div");
    nebula.className = "nebula";
    nebula.style.left = x + "px";
    nebula.style.top = y + "px";
    document.body.appendChild(nebula);

    setTimeout(() => (nebula.style.opacity = "0.9"), 100);
    setTimeout(() => nebula.classList.add("nebula-shift"), 2000);
    setTimeout(() => {
      nebula.style.transform = "translate(-50%, -50%) scale(4)";
      nebula.style.opacity = "0.2";
    }, duration - 5000);
    setTimeout(() => nebula.remove(), duration);
  }
  function supernova(target, options = {}) {
    if (!target) return;

    const {
      particleCount = 150,
      residueCount = 100,
      collapseDuration = 2500,
      flashDuration = 2000,
      explosionDuration = 7500,
      residueDuration = 35000,
      shakeIntensity = 25,
      shakeDuration = 600,
    } = options;

    // --- Select the whole button wrapper instead of just text ---
    const buttonWrapper =
      target.closest(".btn1, .btn2, .btn3, .black-hole") || target;
    const rect = buttonWrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 + window.scrollX;
    const centerY = rect.top + rect.height / 2 + window.scrollY;

    // --- Collapse entire button ---
    buttonWrapper.style.transition = `transform ${collapseDuration}ms ease-in, opacity ${collapseDuration}ms ease-in`;
    buttonWrapper.style.transformOrigin = "center center";
    buttonWrapper.style.transform = "scale(0.1) rotate(45deg)";
    buttonWrapper.style.opacity = "0";
    // --- Collapse ---
    target.style.transition = `transform ${collapseDuration}ms ease-in, opacity ${collapseDuration}ms ease-in`;
    target.style.transformOrigin = "center center";
    target.style.transform = "scale(0.1) rotate(45deg)";
    target.style.opacity = "0";
    for (let i = 0; i < particleCount / 2; i++) {
      const particle = document.createElement("div");
      particle.className = "supernova-particle";
      document.body.appendChild(particle);

      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 400;
      const startX = centerX + Math.cos(angle) * distance;
      const startY = centerY + Math.sin(angle) * distance;

      particle.style.left = startX + "px";
      particle.style.top = startY + "px";
      particle.style.opacity = "1";

      const dx = centerX - startX;
      const dy = centerY - startY;

      let life = 0;
      const maxLife = collapseDuration / 16;

      function animateInward() {
        life++;
        const progress = life / maxLife;
        particle.style.left = startX + dx * progress + "px";
        particle.style.top = startY + dy * progress + "px";
        particle.style.opacity = 1 - progress;
        if (life < maxLife) requestAnimationFrame(animateInward);
        else particle.remove();
      }
      requestAnimationFrame(animateInward);
    }
    setTimeout(() => {
      buttonWrapper.remove();
      triggerBlindingFlash(flashDuration);
      // --- Blinding flash ---
      // const flash = document.createElement("div");
      // flash.className = "supernova-flash";
      // document.body.appendChild(flash);

      // requestAnimationFrame(() => (flash.style.opacity = "0"));
      // setTimeout(() => flash.remove(), flashDuration + 100);

      screenShake(2000);
      // --- Particle explosion ---
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "supernova-particle";
        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const speed = 5 + Math.random() * 25;
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;

        let life = 0;
        const maxLife = explosionDuration / 16;

        function animate() {
          life++;
          particle.style.left = centerX + velocityX * life + "px";
          particle.style.top = centerY + velocityY * life + "px";
          particle.style.opacity = 1 - life / maxLife;
          particle.style.transform = `scale(${1 - life / maxLife})`;
          if (life < maxLife) requestAnimationFrame(animate);
          else particle.remove();
        }
        requestAnimationFrame(animate);
      }

      // --- Residue/embers ---
      for (let i = 0; i < residueCount; i++) {
        const residue = document.createElement("div");
        residue.className = "supernova-residue";
        document.body.appendChild(residue);

        const angle = Math.random() * 2 * Math.PI;
        const speed = 1 + Math.random() * 3;
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;

        let life = 0;
        const maxLife = residueDuration / 16;

        function animateResidue() {
          life++;
          residue.style.left = centerX + velocityX * life + "px";
          residue.style.top = centerY + velocityY * life + "px";
          residue.style.opacity = 1 - life / maxLife;
          residue.style.transform = `scale(${1 + life / maxLife})`;
          if (life < maxLife) requestAnimationFrame(animateResidue);
          else residue.remove();
        }
        requestAnimationFrame(animateResidue);
      }

      // --- Lingering nebula ---
      spawnNebula(centerX, centerY, 25000);

      // --- Resume orbit animations quickly but with ramp-up ---
      setTimeout(() => {
        orbitingBodies.forEach((el) => {
          el.style.animationPlayState = "running";
          el.style.transition = "animation-duration 2s ease-in-out";
          el.style.animationDuration = "40s"; // slower first
          setTimeout(() => (el.style.animationDuration = "25s"), 1500);
          setTimeout(() => (el.style.animationDuration = "15s"), 3000);
        });
      }, explosionDuration + 2000);
    }, collapseDuration);
  }
  document.head.appendChild(style);
})();
