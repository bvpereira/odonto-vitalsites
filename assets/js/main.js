// Preencher com as URLs oficiais quando fornecidas pela clínica.
const clinic = {
  whatsapp: "",
  instagram: "",
  maps: "https://www.google.com/maps/search/?api=1&query=Rua+Bangu%2C+10%2C+Nova+Cidade%2C+Rio+das+Ostras+-+RJ",
};
document.getElementById("year").textContent = new Date().getFullYear();

// Ícones vetoriais leves, sem biblioteca externa.
const toothIcon =
  '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5C9 2 4 3 4 7c0 3 2 5 2.5 8 .5 3 1 6 2.5 6 2 0 1-7 3-7s1 7 3 7c1.5 0 2-3 2.5-6C18 12 20 10 20 7c0-4-5-5-8-2Z"/><path d="M9 4c1 1 2 2 4 2"/></svg>';
document.querySelectorAll(".round-icon").forEach((icon) => {
  if (icon.textContent.trim() === "♧") icon.innerHTML = toothIcon;
  icon.setAttribute("aria-hidden", "true");
});

// Contadores recomeçam alguns segundos depois de alcançar o valor final.
const counters = document.querySelectorAll(".counter");
const formatCounter = (value, suffix) =>
  `${new Intl.NumberFormat("pt-BR").format(value)}${suffix}`;
const runCounters = () => {
  const duration = 1700;
  const startedAt = performance.now();
  const frame = (now) => {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counters.forEach((counter) => {
      const value = Math.round(Number(counter.dataset.target) * eased);
      counter.textContent = formatCounter(value, counter.dataset.suffix);
    });
    if (progress < 1) requestAnimationFrame(frame);
    else window.setTimeout(runCounters, 4200);
  };
  counters.forEach((counter) => {
    counter.textContent = `0${counter.dataset.suffix}`;
  });
  requestAnimationFrame(frame);
};
const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    runCounters();
  },
  { threshold: 0.35 },
);
if (counters.length)
  counterObserver.observe(document.querySelector(".highlights"));

// Depoimentos são digitados uma vez quando chegam à área visível.
const typewriters = document.querySelectorAll(".typewriter");
typewriters.forEach((element) => {
  element.setAttribute("aria-label", element.dataset.text);
  element.textContent = "";
});
const typeReview = (element, delay) => {
  const text = element.dataset.text;
  element.textContent = "";
  element.classList.add("is-typing");
  window.setTimeout(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      element.textContent += text[index];
      index += 1;
      if (index >= text.length) {
        window.clearInterval(timer);
        element.classList.remove("is-typing");
      }
    }, 23);
  }, delay);
};
const reviewObserver = new IntersectionObserver(
  (entries, observer) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    typewriters.forEach((element, index) => typeReview(element, index * 420));
  },
  { threshold: 0.25 },
);
if (typewriters.length)
  reviewObserver.observe(document.querySelector(".reviews-grid"));

// As duas sequências têm larguras idênticas para um loop contínuo.
const carousel = document.querySelector(".carousel");
const track = carousel.querySelector(".carousel-track");
const duplicate = track.querySelector(".gallery-group").cloneNode(true);
duplicate.setAttribute("aria-hidden", "true");
track.append(duplicate);
const carouselControl = document.querySelector(".carousel-control");
carouselControl.addEventListener("click", () => {
  const paused = carousel.classList.toggle("is-paused");
  carouselControl.setAttribute("aria-pressed", String(paused));
  carouselControl.textContent = paused
    ? "Continuar carrossel ▷"
    : "Pausar carrossel Ⅱ";
});

// O range permite uso por teclado; pointer events permitem arrastar em toda a foto.
document.querySelectorAll(".comparison").forEach((comparison) => {
  const input = comparison.querySelector("input");
  const update = (value) => {
    input.value = value;
    comparison.style.setProperty("--position", `${input.value}%`);
    input.setAttribute(
      "aria-valuetext",
      `${input.value}% da imagem antes visível`,
    );
  };
  update(50);
  input.addEventListener("input", () => update(input.value));
  let dragging = false;
  const move = (event) => {
    const bounds = comparison.getBoundingClientRect();
    update(
      Math.round(
        Math.max(
          0,
          Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100),
        ),
      ),
    );
  };
  input.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    dragging = true;
    input.setPointerCapture(event.pointerId);
    input.focus({ preventScroll: true });
    move(event);
  });
  input.addEventListener("pointermove", (event) => {
    if (dragging) move(event);
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach((type) =>
    input.addEventListener(type, () => {
      dragging = false;
    }),
  );
});

document.querySelectorAll(".specialty-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(`${link.getAttribute("href")} details`).open = true;
  });
});

const dialog = document.getElementById("contact-dialog");
const messages = {
  whatsapp: "O WhatsApp da Vital Odontologia será disponibilizado em breve.",
  instagram: "O Instagram da Vital Odontologia será disponibilizado em breve.",
  maps: "O endereço e o link de localização serão adicionados em breve.",
};
document.querySelectorAll("[data-contact]").forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.contact;
    if (clinic[type]) {
      window.open(clinic[type], "_blank", "noopener,noreferrer");
      return;
    }
    document.getElementById("dialog-message").textContent = messages[type];
    dialog.showModal();
  });
});
document
  .querySelectorAll(".dialog-close, .dialog-dismiss")
  .forEach((button) => button.addEventListener("click", () => dialog.close()));
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    dialog.close();
});
