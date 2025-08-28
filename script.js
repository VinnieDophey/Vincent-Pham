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
