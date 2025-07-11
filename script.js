document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const img = document.querySelector(".img");
  const container = document.querySelector(".img-container");

  // Calculate how much we want to reveal (20% of viewport height)
  const revealAmount = window.innerHeight;

  // Set initial crop (shows top 80% of image)

  // Animate to reveal bottom 20%
  gsap.to(img, {
    y: -revealAmount, // Negative moves image up
    ease: "none",
    scrollTrigger: {
      trigger: "main",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
});
