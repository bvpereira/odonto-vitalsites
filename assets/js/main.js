// Preencher com as URLs oficiais quando fornecidas pela clínica.
const clinic = { whatsapp: "", instagram: "", maps: "" };
document.getElementById("year").textContent = new Date().getFullYear();

// Ícones vetoriais leves, sem biblioteca externa.
const toothIcon = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5C9 2 4 3 4 7c0 3 2 5 2.5 8 .5 3 1 6 2.5 6 2 0 1-7 3-7s1 7 3 7c1.5 0 2-3 2.5-6C18 12 20 10 20 7c0-4-5-5-8-2Z"/><path d="M9 4c1 1 2 2 4 2"/></svg>';
document.querySelectorAll('.round-icon').forEach(icon => {
  if (icon.textContent.trim() === '♧') icon.innerHTML = toothIcon;
  icon.setAttribute('aria-hidden', 'true');
});

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
