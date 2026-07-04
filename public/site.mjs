import "./preferences.mjs?v=20260704g";

const revealItems = [...document.querySelectorAll("[data-reveal]")];

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  }
}, { threshold: 0.16 });

for (const item of revealItems) observer.observe(item);

const hero = document.querySelector(".hero");
if (hero && window.matchMedia("(pointer: fine)").matches) {
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    document.documentElement.style.setProperty("--tilt-x", `${x * 10}px`);
    document.documentElement.style.setProperty("--tilt-y", `${y * 10}px`);
  });
}
