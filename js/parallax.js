const initParallax = () => {
  const section = document.querySelector("#parallax-section");
  const layers = document.querySelectorAll(".parallax-layer");

  window.addEventListener("scroll", () => {
    const sectionRect = section.getBoundingClientRect();
    const sectionTop = sectionRect.top;
    const windowHeight = window.innerHeight;

    if (sectionTop <= windowHeight && sectionRect.bottom >= 0) {
      layers.forEach((layer) => {
        const speed = parseFloat(layer.getAttribute("data-speed"));

        const yOffset = sectionTop * speed;

        layer.style.transform = `translateY(${yOffset}px)`;
      });
    }
  });
};

document.addEventListener("DOMContentLoaded", initParallax);
