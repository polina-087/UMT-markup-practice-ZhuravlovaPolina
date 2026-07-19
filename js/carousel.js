const calculateStepSize = (listNode) => {
    const firstItem = listNode.querySelector(":scope > *:not(.fetch-status-msg)");
    const gap = parseFloat(getComputedStyle(listNode).columnGap) || 0;
    return firstItem ? firstItem.getBoundingClientRect().width + gap : listNode.clientWidth;
};

const setupCarousel = (listNode, prevBtn, nextBtn, dotsContainer) => {
    if (!listNode) return () => { };

    const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll(".dot-indicator")) : [];

    const updateArrowStates = () => {
        setTimeout(() => {
            const maxScroll = listNode.scrollWidth - listNode.clientWidth;
            const fits = maxScroll <= 1;

            if (prevBtn) prevBtn.disabled = fits || listNode.scrollLeft <= 1;
            if (nextBtn) nextBtn.disabled = fits || listNode.scrollLeft >= maxScroll - 1;

            if (dots.length > 0) {
                const step = calculateStepSize(listNode);
                let activeIndex = step > 0 ? Math.round(listNode.scrollLeft / step) : 0;
                activeIndex = Math.min(Math.max(activeIndex, 0), dots.length - 1);

                dots.forEach((dot, index) => {
                    dot.classList.toggle("is-active", index === activeIndex);
                });
            }
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

    dots.forEach((dot, index) => {
        const dotElement = dot.closest('li') || dot;
        dotElement.addEventListener("click", () => {
            const step = calculateStepSize(listNode);
            listNode.scrollTo({ left: step * index, behavior: "smooth" });
        });
    });

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
            ...bestsellersSection.querySelectorAll(".btn-slider-arrow"),
            bestsellersSection.querySelector(".slider-pagination-dots")
        )
        : () => { };

    const refreshTestimonials = testimonialsSection
        ? setupCarousel(
            testimonialsSection.querySelector(".testimonials-track"),
            ...testimonialsSection.querySelectorAll(".btn-slider-arrow"),
            testimonialsSection.querySelector(".slider-pagination-dots")
        )
        : () => { };

    return { refreshTop, refreshTestimonials };
};