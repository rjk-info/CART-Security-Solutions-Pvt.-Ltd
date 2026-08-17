const siteHeader = document.querySelector("#siteHeader");

const updateHeaderState = () => {
  if (!siteHeader) {
    return;
  }

  siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });
