const SCROLL_LOCK_CLASS = "is-modal-open";
const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

let currentModal = null;
let previousFocus = null;

const getFocusableNodes = (modalNode) => {
    return [...modalNode.querySelectorAll(FOCUSABLE_SELECTOR)].filter((el) => el.offsetParent !== null);
};

const hideModal = (modalNode) => {
    modalNode.classList.remove("is-open");
    document.body.classList.remove(SCROLL_LOCK_CLASS);
};

export const openModal = (modalId, triggerElement) => {
    const modalNode = document.getElementById(modalId);
    if (!modalNode) return;

    if (currentModal && currentModal !== modalNode) hideModal(currentModal);

    previousFocus = triggerElement || document.activeElement;
    modalNode.classList.add("is-open");
    document.body.classList.add(SCROLL_LOCK_CLASS);
    currentModal = modalNode;

    void modalNode.offsetWidth;

    const focusableElements = getFocusableNodes(modalNode);
    (focusableElements || modalNode.querySelector(".modal-content-box"))?.focus();
};

export const closeModal = () => {
    if (!currentModal) return;

    const elementToFocus = previousFocus;
    hideModal(currentModal);

    currentModal = null;
    previousFocus = null;

    if (elementToFocus && typeof elementToFocus.focus === "function" && elementToFocus.isConnected) {
        elementToFocus.focus();
    }
};

const handleKeydown = (event) => {
    if (!currentModal) return;

    if (event.key === "Escape") {
        closeModal();
        return;
    }

    if (event.key !== "Tab") return;

    const focusableElements = getFocusableNodes(currentModal);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements;
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
};

export const initModals = () => {
    document.addEventListener("click", (event) => {
        const triggerOpen = event.target.closest("[data-modal-open]");
        if (triggerOpen) {
            openModal(triggerOpen.dataset.modalOpen, triggerOpen);
            return;
        }

        const triggerClose = event.target.closest("[data-modal-close]");
        if (triggerClose && currentModal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", handleKeydown);
};