const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.15 });

document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));

const canvas = document.getElementById("spiral-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

let baseRotation = 0;
let scrollVelocity = 0;
let lastScrollY = 0;

window.addEventListener("scroll", () => {
  scrollVelocity = (window.scrollY - lastScrollY) * 0.004;
  lastScrollY = window.scrollY;
});

const resizeCanvas = () => {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas._stars = null;
};

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const drawStars = () => {
  if (!canvas || !ctx) return;

  if (!canvas._stars) {
    canvas._stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2,
      o: Math.random() * 0.4 + 0.1,
    }));
  }

  canvas._stars.forEach((star) => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201, 168, 76, ${star.o})`;
    ctx.fill();
  });
};

const drawSpiral = (rotation) => {
  if (!canvas || !ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  drawStars();

  const nebula = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.height * 0.6);
  nebula.addColorStop(0, "rgba(180, 120, 30, 0.07)");
  nebula.addColorStop(0.5, "rgba(100, 70, 10, 0.03)");
  nebula.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = nebula;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);

  const turns = 3.5;
  const maxRadius = Math.min(canvas.width, canvas.height) * 0.42;
  const totalPoints = 600;

  ctx.beginPath();
  for (let i = 0; i <= totalPoints; i += 1) {
    const t = i / totalPoints;
    const angle = t * turns * Math.PI * 2;
    const radius = t * maxRadius;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius);
  grad.addColorStop(0, "rgba(255, 245, 210, 0.95)");
  grad.addColorStop(0.3, "rgba(232, 201, 122, 0.7)");
  grad.addColorStop(0.7, "rgba(201, 168, 76, 0.4)");
  grad.addColorStop(1, "rgba(201, 168, 76, 0.05)");

  ctx.strokeStyle = grad;
  ctx.lineWidth = 1.8;
  ctx.shadowColor = "#C9A84C";
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.restore();

  const starGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
  starGlow.addColorStop(0, "rgba(255, 251, 232, 0.9)");
  starGlow.addColorStop(0.2, "rgba(232, 201, 122, 0.4)");
  starGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = starGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, 60, 0, Math.PI * 2);
  ctx.fill();
};

const animate = () => {
  baseRotation += 0.0008 + Math.abs(scrollVelocity);
  scrollVelocity *= 0.92;
  drawSpiral(baseRotation);
  requestAnimationFrame(animate);
};

animate();

const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");

const syncNavState = () => {
  if (!nav) return;
  nav.classList.toggle("scrolled", window.scrollY > 50);
};

syncNavState();
window.addEventListener("scroll", syncNavState, { passive: true });

if (navToggle && mobileMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.addEventListener("click", (e) => {
  if (e.target.closest(".tst-next")) {
    const track = document.querySelector(".testimonials-container");
    const card = document.querySelector(".testimonial-card");
    const scrollAmount = card ? card.offsetWidth + 24 : 364;
    track.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }

  if (e.target.closest(".tst-prev")) {
    const track = document.querySelector(".testimonials-container");
    const card = document.querySelector(".testimonial-card");
    const scrollAmount = card ? card.offsetWidth + 24 : 364;
    track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  }
});
