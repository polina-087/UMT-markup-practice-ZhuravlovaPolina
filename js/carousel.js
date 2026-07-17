const calculateStepSize = (listNode) => {
    const firstItem = listNode.querySelector(":scope > *:not(.fetch-status-msg)");
    const gap = parseFloat(getComputedStyle(listNode).columnGap) || 0;
    return firstItem ? firstItem.getBoundingClientRect().width + gap : listNode.clientWidth;
};

const setupCarousel = (listNode, prevBtn, nextBtn) => {
    if (!listNode) return () => { };

    const updateArrowStates = () => {
        // Ждем 100мс, чтобы DOM-дерево и картинки успели занять свою ширину
        setTimeout(() => {
            const maxScroll = listNode.scrollWidth - listNode.clientWidth;
            const fits = maxScroll <= 1;

            if (prevBtn) prevBtn.disabled = fits || listNode.scrollLeft <= 1;
            if (nextBtn) nextBtn.disabled = fits || listNode.scrollLeft >= maxScroll - 1;
        }, 100);
    };

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            listNode.scrollBy({ left: -calculateStepSize(listNode), behavior: "smooth" });
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            listNode.scrollBy({ left: calculateStepSize(listNode), behavior: "smooth" });
        });
    }

    listNode.addEventListener("scroll", updateArrowStates, { passive: true });
    window.addEventListener("resize", updateArrowStates);

    updateArrowStates();

    return updateArrowStates;
};

export const initCarousels = () => {
    const bestsellersSection = document.querySelector(".bestsellers-section");
    const testimonialsSection = document.querySelector(".testimonials-section");

    const refreshTop = bestsellersSection
        ? setupCarousel(
            bestsellersSection.querySelector(".bestsellers-track"),
            ...bestsellersSection.querySelectorAll(".btn-slider-arrow")
        )
        : () => { };

    const refreshTestimonials = testimonialsSection
        ? setupCarousel(
            testimonialsSection.querySelector(".testimonials-track"),
            ...testimonialsSection.querySelectorAll(".btn-slider-arrow")
        )
        : () => { };

    return { refreshTop, refreshTestimonials };
};