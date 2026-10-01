// Preencher com as URLs oficiais quando fornecidas pela clínica.
const clinic = {
  whatsapp: "",
  instagram: "",
  maps: "https://www.google.com/maps/search/?api=1&query=Rua+Bangu%2C+10%2C+Nova+Cidade%2C+Rio+das+Ostras+-+RJ",
};
document.getElementById("year").textContent = new Date().getFullYear();

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

const specialtyLinks = [...document.querySelectorAll(".specialty-nav a")];
let activeSpecialty = 0;
const highlightSpecialty = () => {
  specialtyLinks.forEach((link, index) =>
    link.classList.toggle("is-active", index === activeSpecialty),
  );
};
highlightSpecialty();
window.setInterval(() => {
  activeSpecialty = (activeSpecialty + 1) % specialtyLinks.length;
  highlightSpecialty();
}, 3000);

specialtyLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(`${link.getAttribute("href")} details`).open = true;
  });
});

const locationDialog = document.getElementById("location-dialog");
const locationVideo = locationDialog.querySelector("video");
document.querySelector("[data-location-video]").addEventListener("click", () => {
  locationDialog.showModal();
  document.body.style.overflow = "hidden";
  locationVideo.play().catch(() => {});
});
locationDialog.querySelector(".location-close").addEventListener("click", () => locationDialog.close());
locationDialog.addEventListener("close", () => {
  locationVideo.pause();
  locationVideo.currentTime = 0;
  document.body.style.overflow = "";
});
locationDialog.addEventListener("click", (event) => {
  if (event.target !== locationDialog) return;
  const bounds = locationDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) locationDialog.close();
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
