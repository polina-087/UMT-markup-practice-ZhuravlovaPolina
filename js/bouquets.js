import { getBouquets } from "./api.js";
import { PAGE_LIMIT } from "./config.js";
import { renderProducts, setListState, refreshAOS } from "./render.js";

const gridNode = document.querySelector(".bouquets-grid");
const loadMoreBtn = document.querySelector(".btn-load-more");
const filterGroupNode = document.querySelector(".filter-group");

const state = {
    page: 1,
    limit: PAGE_LIMIT,
    category: "all",
    hasMore: false,
    loading: false,
};

const toggleLoadMoreVisibility = (isVisible) => {
    if (loadMoreBtn) loadMoreBtn.hidden = !isVisible;
};

const setLoadMoreStatus = (isBusy) => {
    if (loadMoreBtn) loadMoreBtn.textContent = isBusy ? "Loading…" : "Show More";
};

const fetchCurrentPageData = () => {
    return getBouquets({
        page: state.page,
        limit: state.limit,
        category: state.category,
        featured: false,
    });
};

const loadFirstPage = async () => {
    state.loading = true;
    state.page = 1;
    toggleLoadMoreVisibility(false);
    setListState(gridNode, "Loading bouquets…");

    try {
        const items = await fetchCurrentPageData();
        if (items.length === 0) {
            setListState(gridNode, "No bouquets match this filter.");
            state.hasMore = false;
            return;
        }
        gridNode.innerHTML = "";
        renderProducts(gridNode, items, "grid");
        state.hasMore = items.length === state.limit;
        toggleLoadMoreVisibility(state.hasMore);
    } catch (error) {
        console.error("Failed to load bouquets:", error);
        setListState(gridNode, "Couldn't load bouquets. Please try again later.", true);
        state.hasMore = false;
    } finally {
        state.loading = false;
        refreshAOS();
    }
};

const handleLoadMore = async () => {
    if (state.loading || !state.hasMore) return;
    state.loading = true;
    setLoadMoreStatus(true);
    state.page += 1;

    try {
        const items = await fetchCurrentPageData();
        renderProducts(gridNode, items, "grid");
        const cardHeight = gridNode.firstElementChild.getBoundingClientRect().height;
        window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
        });
        state.hasMore = items.length === state.limit;
        toggleLoadMoreVisibility(state.hasMore);
    } catch (error) {
        console.error("Failed to load more bouquets:", error);
        state.page -= 1;
    } finally {
        state.loading = false;
        setLoadMoreStatus(false);
        refreshAOS();
    }
};

const selectCategory = (categoryName) => {
    if (state.loading || categoryName === state.category) return;
    state.category = categoryName;

    filterGroupNode.querySelectorAll(".filter-chip").forEach((chip) => {
        const isActive = chip.dataset.category === categoryName;
        chip.classList.toggle("is-active", isActive);
        chip.setAttribute("aria-pressed", String(isActive));
    });

    loadFirstPage();
};

export const initBouquets = () => {
    if (!gridNode) return;

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", handleLoadMore);
    }

    if (filterGroupNode) {
        filterGroupNode.addEventListener("click", (event) => {
            const chip = event.target.closest(".filter-chip");
            if (chip) selectCategory(chip.dataset.category);
        });
    }

    loadFirstPage();
};