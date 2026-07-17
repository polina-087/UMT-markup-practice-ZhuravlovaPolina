"use strict";

const mobileMenu = document.getElementById("mobile-menu");
const menuOpenBtns = document.querySelectorAll("[data-menu-open]");
const menuCloseBtns = mobileMenu ? mobileMenu.querySelectorAll("[data-menu-close]") : [];

const toggleMenuState = (isOpen) => {
    if (!mobileMenu) return;

    mobileMenu.classList.toggle("is-open", isOpen);
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("is-menu-open", isOpen);

    menuOpenBtns.forEach((btn) => btn.setAttribute("aria-expanded", String(isOpen)));
};

menuOpenBtns.forEach((btn) => {
    btn.addEventListener("click", () => toggleMenuState(true));
});

menuCloseBtns.forEach((btn) => {
    btn.addEventListener("click", () => toggleMenuState(false));
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenu?.classList.contains("is-open")) {
        toggleMenuState(false);
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth >= 1440 && mobileMenu?.classList.contains("is-open")) {
        toggleMenuState(false);
    }
});