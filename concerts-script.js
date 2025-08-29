document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Background parallax effect
  const img = document.querySelector(".img");
  gsap.to(img, {
    y: -window.innerHeight,
    ease: "none",
    scrollTrigger: {
      trigger: "main",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });

  // Animate each project box on scroll
  gsap.utils.toArray(".box").forEach((box, i) => {
    gsap.from(box, {
      opacity: 0,
      y: 80,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: box,
        start: "top bottom", // when top of box is 85% down viewport
        toggleActions: "play none none reverse", // fade out if scrolling back up
      },
      delay: i * 0.1, // optional: slight stagger between boxes
    });
  });
});

// Hide/show header on scroll
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
