import { getBestsellers, getFeedbacks } from "./api.js";
import { renderProducts, renderTestimonials, setListState, clearList, refreshAOS } from "./render.js";
import { initBouquets } from "./bouquets.js";
import { initModals } from "./modal.js";
import { initOrder } from "./order.js";
import { initCarousels } from "./carousel.js";

const bestsellersTrackNode = document.querySelector(".bestsellers-track");
const testimonialsTrackNode = document.querySelector(".testimonials-track");

const { refreshTop, refreshTestimonials } = initCarousels();

const loadBestsellers = async () => {
    if (!bestsellersTrackNode) return;

    setListState(bestsellersTrackNode, "Loading bestsellers…");

    try {
        const items = await getBestsellers();
        clearList(bestsellersTrackNode);
        renderProducts(bestsellersTrackNode, items, "carousel");
    } catch (error) {
        console.error("Failed to load bestsellers:", error);
        setListState(bestsellersTrackNode, "Couldn't load bestsellers. Please try again later.", true);
    } finally {
        refreshAOS();
        refreshTop();
    }
};

const loadFeedbacks = async () => {
    if (!testimonialsTrackNode) return;

    setListState(testimonialsTrackNode, "Loading feedback…");

    try {
        const items = await getFeedbacks();
        clearList(testimonialsTrackNode);
        renderTestimonials(testimonialsTrackNode, items);
    } catch (error) {
        console.error("Failed to load feedback:", error);
        setListState(testimonialsTrackNode, "Couldn't load feedback. Please try again later.", true);
    } finally {
        refreshAOS();
        refreshTestimonials();
    }
};

initModals();
initOrder();
loadBestsellers();
initBouquets();
loadFeedbacks();