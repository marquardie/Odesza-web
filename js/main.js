// ── Tarot card data sources ──
// Google Sheet (78 card descriptions) published as CSV. Replace SHEET_ID with your sheet's ID.
const CARD_SHEET_URL = "https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv&gid=0";

// Базовый путь к файлам картинок в вашем репозитории
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/marquardie/Tarot-Cards/main/";

const CARD_BACK_FILE = "Gemini_Generated_Image_745loz745loz745l.png";

const CARD_IMAGES = [
  // Major Arcana (00 - 21)
  "00-TheFool.png", "01-TheMagician.png", "02-TheHighPriestess.png", "03-TheEmpress.png",
  "04-TheEmperor.png", "05-TheHierophant.png", "06-TheLovers.png", "07-TheChariot.png",
  "08-Strength.png", "09-TheHermit.png", "10-WheelOfFortune.png", "11-Justice.png",
  "12-TheHangedMan.png", "13-Death.png", "14-Temperance.png", "15-TheDevil.png",
  "16-TheTower.png", "17-TheStar.png", "18-TheMoon.png", "19-TheSun.png",
  "20-Judgement.png", "21-TheWorld.png",

  // Cups (01 - 14)
  "Cups01.png", "Cups02.png", "Cups03.png", "Cups04.png", "Cups05.png", "Cups06.png",
  "Cups07.png", "Cups08.png", "Cups09.png", "Cups10.png", "Cups11.png", "Cups12.png",
  "Cups13.png", "Cups14.png",

  // Pentacles (01 - 14)
  "Pentacles01.png", "Pentacles02.png", "Pentacles03.png", "Pentacles04.png", "Pentacles05.png", "Pentacles06.png",
  "Pentacles07.png", "Pentacles08.png", "Pentacles09.png", "Pentacles10.png", "Pentacles11.png", "Pentacles12.png",
  "Pentacles13.png", "Pentacles14.png",

  // Swords (01 - 14)
  "Swords01.png", "Swords02.png", "Swords03.png", "Swords04.png", "Swords05.png", "Swords06.png",
  "Swords07.png", "Swords08.png", "Swords09.png", "Swords10.png", "Swords11.png", "Swords12.png",
  "Swords13.png", "Swords14.png",

  // Wands (01 - 14)
  "Wands01.png", "Wands02.png", "Wands03.png", "Wands04.png", "Wands05.png", "Wands06.png",
  "Wands07.png", "Wands08.png", "Wands09.png", "Wands10.png", "Wands11.png", "Wands12.png",
  "Wands13.png", "Wands14.png"
];

const getCardUrl = (fileName) => `${GITHUB_RAW_BASE}${fileName}`;

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
let wheelGuard = 0; // frames during which scroll deltas are skipped (already counted via wheel)

// Mouse wheel / trackpad (desktop). Fires even when the page can't scroll —
// e.g. wheeling up while already at the very top — so the spiral keeps spinning.
// deltaY > 0 (down) and deltaY < 0 (up) spin it in opposite directions.
window.addEventListener("wheel", (e) => {
  const unit = e.deltaMode === 1 ? 16 : 1; // Firefox line-mode → approx px
  scrollVelocity += e.deltaY * unit * 0.0009;
  wheelGuard = 4;
}, { passive: true });

// Page scroll (touch swipe, scrollbar drag, keyboard). Skipped right after a
// wheel event so the same gesture isn't counted twice on desktop.
window.addEventListener("scroll", () => {
  const delta = window.scrollY - lastScrollY;
  lastScrollY = window.scrollY;
  if (wheelGuard > 0) return;
  scrollVelocity += delta * 0.003;
}, { passive: true });

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
  baseRotation += 0.0008 + scrollVelocity;
  scrollVelocity *= 0.92;
  if (wheelGuard > 0) wheelGuard -= 1;
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

// Infinite-loop testimonials carousel
(function () {
  const track = document.querySelector(".testimonials-container");
  if (!track) return;

  // Clone all cards and append to end AND prepend to start for seamless looping
  const cards = Array.from(track.querySelectorAll(".testimonial-card"));
  const cardCount = cards.length;

  // Prepend clones of last 2 cards
  const headClones = cards.slice(-2).map(c => c.cloneNode(true));
  headClones.forEach(c => track.prepend(c));

  // Append clones of first 2 cards
  const tailClones = cards.slice(0, 2).map(c => c.cloneNode(true));
  tailClones.forEach(c => track.append(c));

  // Start at the first real card (after the 2 prepended clones)
  const getCardWidth = () => {
    const card = track.querySelector(".testimonial-card");
    return card ? card.offsetWidth + 24 : 364; // 24 = gap
  };

  let currentIndex = 2; // offset by 2 clones at head
  let isTransitioning = false;

  const jumpTo = (index, animate) => {
    track.style.transition = animate ? "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)" : "none";
    track.style.transform = `translateX(-${index * getCardWidth()}px)`;
    currentIndex = index;
  };

  // Set initial position without animation
  jumpTo(currentIndex, false);

  const totalCloned = cardCount + 4; // original + 2 head + 2 tail clones

  track.addEventListener("transitionend", () => {
    isTransitioning = false;
    // If we've scrolled past the tail clones, jump silently back to real start
    if (currentIndex >= cardCount + 2) {
      jumpTo(2, false);
    }
    // If we've scrolled before the head clones, jump silently to real end
    if (currentIndex <= 1) {
      jumpTo(cardCount + 1, false);
    }
  });

  document.addEventListener("click", (e) => {
    if (isTransitioning) return;

    if (e.target.closest(".tst-next")) {
      isTransitioning = true;
      jumpTo(currentIndex + 1, true);
    }

    if (e.target.closest(".tst-prev")) {
      isTransitioning = true;
      jumpTo(currentIndex - 1, true);
    }
  });

  // Disable the old overflow-x scroll behavior — use transform instead
  track.style.overflowX = "visible";
  track.style.flexWrap = "nowrap";
  track.style.width = "max-content";
})();

// ── Pull Free Card Feature ──
(function () {
  const btn = document.getElementById("frcBtn");
  const cardImg = document.getElementById("frcCardImg");
  const modal = document.getElementById("frcModal");
  const overlay = document.getElementById("frcOverlay");
  const modalImg = document.getElementById("frcModalImg");
  const cardNameEl = document.getElementById("frcCardName");
  const cardDescEl = document.getElementById("frcCardDesc");

  if (!btn) return;

  let cardData = []; // Будет загружено из CSV Google Таблицы
  let pulled = false;

  // Загрузка данных карт из опубликованной таблицы
  fetch(CARD_SHEET_URL)
    .then(r => r.text())
    .then(csv => {
      cardData = csv.trim().split("\n").slice(1).map(row => {
        const cols = row.split(",");
        const name = cols[0]?.trim().replace(/^"|"$/g, "") || "";
        // Описание может содержать запятые, поэтому объединяем оставшиеся столбцы
        const desc = cols.slice(1).join(",").trim().replace(/^"|"$/g, "") || "";
        return { name, desc };
      });
    })
    .catch(() => console.warn("Could not load card data from Google Sheets"));

  const openModal = (cardIndex) => {
    const card = cardData[cardIndex] || { name: "Unknown Card", desc: "No description available." };
    const imgName = CARD_IMAGES[cardIndex] || CARD_BACK_FILE;

    modalImg.src = getCardUrl(imgName);
    modalImg.alt = card.name;
    cardNameEl.textContent = card.name;
    cardDescEl.textContent = card.desc;

    setTimeout(() => {
      overlay.classList.add("active");
      modal.classList.add("active");
      modal.removeAttribute("aria-hidden");
    }, 2000); // 2 секунды задержки после анимации открытия карты
  };

  const closeModal = () => {
    overlay.classList.remove("active");
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  };

  overlay.addEventListener("click", closeModal);

  btn.addEventListener("click", () => {
    if (pulled) return;

    const name = document.getElementById("frcName")?.value.trim();
    const dob = document.getElementById("frcDob")?.value;

    if (!name || !dob) {
      alert("Please enter your name and date of birth.");
      return;
    }

    pulled = true;
    btn.disabled = true;
    btn.textContent = "Reading the energy…";

    // Генерация стабильного индекса карты на основе Имени + Даты рождения
    const seed = (name + dob).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const cardIndex = seed % (CARD_IMAGES.length || 78);

    // Запуск анимации переворота
    cardImg.classList.add("frc-flip");

    cardImg.addEventListener("animationend", () => {
      // После половины анимации подменяем картинку рубашки на лицевую сторону карты из GitHub
      const resultCardFile = CARD_IMAGES[cardIndex] || CARD_BACK_FILE;
      cardImg.src = getCardUrl(resultCardFile);
      cardImg.alt = cardData[cardIndex]?.name || "Your card";

      openModal(cardIndex);
    }, { once: true });
  });
})();
