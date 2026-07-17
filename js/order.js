import { openModal, closeModal } from "./modal.js";
import { productIndex, productDetailsTemplate } from "./render.js";
import { postOrder } from "./api.js";

const productModalNode = document.getElementById("product-modal");
const orderFormNode = document.querySelector(".form-order");
const toastNode = document.getElementById("order-toast");

let activeProduct = null;
let toastTimeout = null;

const displaySuccessToast = () => {
    if (!toastNode) return;

    toastNode.classList.add("is-visible");
    window.clearTimeout(toastTimeout);

    toastTimeout = window.setTimeout(() => {
        toastNode.classList.remove("is-visible");
    }, 4000);
};

const handleProductDetailsOpen = (cardElement) => {
    const product = productIndex.get(String(cardElement.dataset.id));
    if (!product) return;

    activeProduct = product;

    const detailsContainer = productModalNode.querySelector(".product-details-layout");
    if (detailsContainer) {
        detailsContainer.innerHTML = productDetailsTemplate(product);
    }

    openModal("product-modal", cardElement);
};

const handleCardActivation = (event) => {
    const cardElement = event.target.closest(".product-card");
    if (!cardElement || !cardElement.dataset.id) return;

    if (event.type === "keydown") {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
    }

    handleProductDetailsOpen(cardElement);
};

const handleOrderSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const statusMessageNode = form.querySelector(".form-status-msg");
    const submitBtn = form.querySelector('[type="submit"]');

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);

    const orderPayload = {
        name: formData.get("name"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        message: formData.get("message"),
        agree: formData.get("agree") === "on",
        product: activeProduct ? activeProduct.name : null,
        quantity: Number(productModalNode.querySelector(".quantity-input")?.value) || 1,
    };

    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    statusMessageNode.textContent = "";
    statusMessageNode.classList.remove("is-error");

    try {
        await postOrder(orderPayload);
        form.reset();
        closeModal();
        displaySuccessToast();
    } catch (error) {
        console.error("Order submit failed:", error);
        statusMessageNode.textContent = "Something went wrong. Please try again.";
        statusMessageNode.classList.add("is-error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
};

export const initOrder = () => {
    const listSelectors = [".bestsellers-track", ".bouquets-grid"];

    listSelectors.forEach((selector) => {
        const listNode = document.querySelector(selector);
        if (!listNode) return;

        listNode.addEventListener("click", handleCardActivation);
        listNode.addEventListener("keydown", handleCardActivation);
    });

    if (orderFormNode) {
        orderFormNode.addEventListener("submit", handleOrderSubmit);
    }
};