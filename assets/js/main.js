const siteHeader = document.querySelector("#siteHeader");

const updateHeaderState = () => {
  if (!siteHeader) {
    return;
  }

  siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });
/**
 * CART SECURITY SOLUTIONS PVT. LTD. - Responsive Carousel Sync Handler
 * Keeps the carousel sliding correctly across Desktop (3 items), Tablet (2 items), and Mobile (1 item).
 */
document.addEventListener('DOMContentLoaded', () => {
  const carouselElement = document.getElementById('cartReviewsCarousel');
  if (!carouselElement) return;

  function syncActiveSlideOnResize() {
    const width = window.innerWidth;
    let targetDevice = 'desktop';

    if (width < 768) {
      targetDevice = 'mobile';
    } else if (width < 992) {
      targetDevice = 'tablet';
    }

    const allSlides = carouselElement.querySelectorAll('.carousel-item');
    const deviceSlides = Array.from(allSlides).filter(
      (slide) => slide.getAttribute('data-device') === targetDevice
    );

    const hasActiveDeviceSlide = deviceSlides.some((slide) =>
      slide.classList.contains('active')
    );

    if (!hasActiveDeviceSlide && deviceSlides.length > 0) {
      allSlides.forEach((slide) => slide.classList.remove('active'));
      deviceSlides[0].classList.add('active');
    }
  }

  // Initial Sync & Resize Listener
  syncActiveSlideOnResize();
  window.addEventListener('resize', syncActiveSlideOnResize);
});