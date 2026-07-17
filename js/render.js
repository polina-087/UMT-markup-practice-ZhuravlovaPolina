export const productIndex = new Map();

const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]
  );

const productCard = (b, variant) => {
  const isGrid = variant === "grid";
  const w = isGrid ? 296 : 405;
  const h = isGrid ? 296 : 320;
  const alignClass = isGrid ? " content-centered" : "";

  return `
    <li class="product-card" data-id="${esc(b.id)}" role="button" tabindex="0" aria-label="View details for ${esc(b.name)}">
      <img
        class="product-media"
        src="${esc(b.image)}"
        srcset="${esc(b.image)} 1x, ${esc(b.image2x)} 2x"
        width="${w}"
        height="${h}"
        alt="${esc(b.alt)}"
      />
      <div class="product-content${alignClass}">
        <h3 class="product-title">${esc(b.name)}</h3>
        <p class="product-excerpt">${esc(b.description)}</p>
        <p class="product-price">$${esc(b.price)}</p>
      </div>
    </li>`;
};

export const renderProducts = (container, items, variant) => {
  items.forEach((item) => productIndex.set(String(item.id), item));
  const html = items.map((item) => productCard(item, variant)).join("");
  container.insertAdjacentHTML("beforeend", html);
};

export const productDetailsTemplate = (b) => `
  <img
    class="details-media"
    src="${esc(b.image)}"
    srcset="${esc(b.image)} 1x, ${esc(b.image2x)} 2x"
    width="600"
    height="600"
    alt="${esc(b.alt)}"
  />
  <div class="details-content">
    <h2 class="details-title" id="product-modal-title">${esc(b.name)}</h2>
    <p class="details-price">$${esc(b.price)}</p>
    <p class="details-desc">${esc(b.description)}</p>
    <div class="details-action-group">
      <button class="btn-solid" type="button" data-modal-open="order-modal">Buy now</button>
      <label>
        <span class="visually-hidden">Quantity</span>
        <input class="quantity-input" type="number" name="quantity" value="1" min="1" max="99" />
      </label>
    </div>
  </div>`;

const testimonialCard = (f) => `
  <li class="testimonial-card">
    <blockquote class="testimonial-body">
      <p>${esc(f.text)}</p>
      <footer class="testimonial-author">${esc(f.author)}</footer>
    </blockquote>
  </li>`;

export const renderTestimonials = (container, items) => {
  const html = items.map(testimonialCard).join("");
  container.insertAdjacentHTML("beforeend", html);
};


export const setListState = (container, message, isError = false) => {
  const errorClass = isError ? " msg-error" : "";
  container.innerHTML = `<li class="fetch-status-msg${errorClass}">${esc(message)}</li>`;
};

export const clearList = (container) => {
  container.innerHTML = "";
};

export const refreshAOS = () => {
  if (window.AOS && typeof window.AOS.refresh === "function") window.AOS.refresh();
};