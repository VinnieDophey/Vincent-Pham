// Replace your current scroll event listener with this:
let lastScrollTop = 0;
const header = document.querySelector(".header");
const headerHeight = header.offsetHeight;
let isHidden = false;

window.addEventListener("scroll", function () {
  const currentScroll = window.scrollY || document.documentElement.scrollTop;
  const scrollThreshold = 100; // How far to scroll before hiding

  if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
    // Scrolling down past threshold → Hide header
    if (!isHidden) {
      header.style.transform = "translateY(-100%)";
      isHidden = true;
    }
  } else if (currentScroll < lastScrollTop) {
    // Scrolling up → Show header
    if (isHidden) {
      header.style.transform = "translateY(0)";
      isHidden = false;
    }
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});
