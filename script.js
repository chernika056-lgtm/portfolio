const filterButtons = document.querySelectorAll(".filter-button");
const galleryCards = document.querySelectorAll(".gallery-card");
const galleryCount = document.querySelector(".gallery-count");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });

    galleryCards.forEach((card) => {
      const isVisible = category === "all" || card.dataset.category === category;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    galleryCount.textContent = `${String(visibleCount).padStart(2, "0")} ${visibleCount === 1 ? "photo" : "photos"}`;
  });
});

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
const closeLightboxButton = document.querySelector(".lightbox-close");

galleryCards.forEach((card) => {
  card.addEventListener("click", () => {
    const image = card.querySelector("img");
    lightboxImage.src = card.dataset.full;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = card.dataset.caption;
    lightbox.showModal();
  });
});

closeLightboxButton.addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("close", () => {
  lightboxImage.removeAttribute("src");
});

const form = document.querySelector("#booking-form");
const formStatus = document.querySelector("#form-status");
const fields = [
  {
    input: document.querySelector("#name"),
    error: document.querySelector("#name-error"),
    validate: (value) => value.trim().length >= 2,
    message: "Please enter your name (at least 2 characters).",
  },
  {
    input: document.querySelector("#email"),
    error: document.querySelector("#email-error"),
    validate: (value, input) => value.trim() !== "" && input.validity.valid,
    message: "Please enter a valid email address.",
  },
  {
    input: document.querySelector("#shoot-type"),
    error: document.querySelector("#shoot-type-error"),
    validate: (value) => value !== "",
    message: "Please choose a session type.",
  },
];

function validateField(field) {
  const isValid = field.validate(field.input.value, field.input);
  field.error.textContent = isValid ? "" : field.message;
  field.input.setAttribute("aria-invalid", String(!isValid));
  return isValid;
}

fields.forEach((field) => {
  field.input.addEventListener("input", () => validateField(field));
  field.input.addEventListener("change", () => validateField(field));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const isValid = fields.map(validateField).every(Boolean);

  if (!isValid) {
    formStatus.textContent = "Please check the fields above.";
    formStatus.classList.remove("is-success");
    fields.find((field) => field.input.getAttribute("aria-invalid") === "true")?.input.focus();
    return;
  }

  const name = document.querySelector("#name").value.trim();
  const shootType = document.querySelector("#shoot-type").value;
  formStatus.textContent = `Thank you, ${name}! I’ve noted your interest: ${shootType.toLowerCase()}. Email me at hello@lunavisuals.example — this demo form does not send your details.`;
  formStatus.classList.add("is-success");
  form.reset();
  fields.forEach((field) => {
    field.error.textContent = "";
    field.input.removeAttribute("aria-invalid");
  });
});
