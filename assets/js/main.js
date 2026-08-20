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
 * CART SECURITY SOLUTIONS PVT. LTD. - Client Reviews Carousel Handler
 * Keeps controls moving only through the slides for the current breakpoint.
 */
document.addEventListener('DOMContentLoaded', () => {
  const carouselElement = document.getElementById('cartReviewsCarousel');
  if (!carouselElement) return;

  const allSlides = Array.from(carouselElement.querySelectorAll('.carousel-item'));
  const previousButton = carouselElement.querySelector('.cart-reviews-prev');
  const nextButton = carouselElement.querySelector('.cart-reviews-next');
  const intervalDelay = Number(carouselElement.getAttribute('data-bs-interval')) || 0;
  let autoplayTimer = null;
  let isPaused = false;

  carouselElement.removeAttribute('data-bs-ride');

  const bootstrapCarousel = window.bootstrap?.Carousel
    ? window.bootstrap.Carousel.getOrCreateInstance(carouselElement, {
      interval: false,
      ride: false,
      wrap: true,
    })
    : null;

  bootstrapCarousel?.pause();

  function getCurrentDevice() {
    const width = window.innerWidth;

    if (width < 768) {
      return 'mobile';
    }

    if (width < 992) {
      return 'tablet';
    }

    return 'desktop';
  }

  function getDeviceSlides(device = getCurrentDevice()) {
    return allSlides.filter(
      (slide) => slide.getAttribute('data-device') === device
    );
  }

  function clearTransitionClasses() {
    allSlides.forEach((slide) => {
      slide.classList.remove(
        'active',
        'carousel-item-start',
        'carousel-item-end',
        'carousel-item-next',
        'carousel-item-prev'
      );
    });
  }

  function syncActiveSlide(device = getCurrentDevice()) {
    const deviceSlides = getDeviceSlides(device);
    if (!deviceSlides.length) return;

    const hasActiveDeviceSlide = deviceSlides.some((slide) =>
      slide.classList.contains('active')
    );

    if (!hasActiveDeviceSlide) {
      clearTransitionClasses();
      deviceSlides[0].classList.add('active');
    }
  }

  function goToDeviceSlide(direction) {
    const device = getCurrentDevice();
    const deviceSlides = getDeviceSlides(device);
    if (!deviceSlides.length) return;

    syncActiveSlide(device);

    const activeIndex = Math.max(
      deviceSlides.findIndex((slide) => slide.classList.contains('active')),
      0
    );
    const nextIndex = (activeIndex + direction + deviceSlides.length) % deviceSlides.length;
    const targetSlide = deviceSlides[nextIndex];
    const targetGlobalIndex = allSlides.indexOf(targetSlide);

    if (bootstrapCarousel && targetGlobalIndex >= 0) {
      bootstrapCarousel.to(targetGlobalIndex);
    } else {
      clearTransitionClasses();
      targetSlide.classList.add('active');
    }
  }

  carouselElement.addEventListener('slide.bs.carousel', (event) => {
    const targetDevice = event.relatedTarget?.getAttribute('data-device');

    if (targetDevice && targetDevice !== getCurrentDevice()) {
      event.preventDefault();
      goToDeviceSlide(event.direction === 'right' ? -1 : 1);
    }
  });

  function startAutoplay() {
    if (!intervalDelay) return;
    window.clearInterval(autoplayTimer);
    autoplayTimer = window.setInterval(() => {
      if (!isPaused) {
        goToDeviceSlide(1);
      }
    }, intervalDelay);
  }

  function handleNavigation(direction) {
    return (event) => {
      event.preventDefault();
      event.stopPropagation();
      goToDeviceSlide(direction);
      startAutoplay();
    };
  }

  previousButton?.addEventListener('click', handleNavigation(-1));
  nextButton?.addEventListener('click', handleNavigation(1));

  carouselElement.addEventListener('mouseenter', () => {
    isPaused = true;
  });

  carouselElement.addEventListener('mouseleave', () => {
    isPaused = false;
  });

  carouselElement.addEventListener('focusin', () => {
    isPaused = true;
  });

  carouselElement.addEventListener('focusout', () => {
    isPaused = false;
  });

  syncActiveSlide();
  startAutoplay();
  window.addEventListener('resize', () => syncActiveSlide());
});
