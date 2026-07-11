"use strict";

/* ==========================================
   STRATFOUNDER — MLBB HUB
========================================== */

/*
Hero portraits are optional for now.

Later, place them inside:

assets/images/heroes/mlbb/

Example:
assets/images/heroes/mlbb/hayabusa.png

Missing images automatically display letter placeholders.
*/

/* ==========================================
   HERO DATA
========================================== */

const heroes = [
    {
        id: "hayabusa",
        name: "Hayabusa",
        role: "Assassin",
        lane: "Jungle",
        difficulty: 4,
        image: "../assets/images/heroes/mlbb/hayabusa.png"
    },
    {
        id: "fanny",
        name: "Fanny",
        role: "Assassin",
        lane: "Jungle",
        difficulty: 5,
        image: "../assets/images/heroes/mlbb/fanny.png"
    },
    {
        id: "ling",
        name: "Ling",
        role: "Assassin",
        lane: "Jungle",
        difficulty: 5,
        image: "../assets/images/heroes/mlbb/ling.png"
    },
    {
        id: "julian",
        name: "Julian",
        role: "Fighter",
        lane: "Jungle / Mid",
        difficulty: 4,
        image: "../assets/images/heroes/mlbb/julian.png"
    },
    {
        id: "yu-zhong",
        name: "Yu Zhong",
        role: "Fighter",
        lane: "EXP Lane",
        difficulty: 3,
        image: "../assets/images/heroes/mlbb/yu-zhong.png"
    },
    {
        id: "ruby",
        name: "Ruby",
        role: "Fighter",
        lane: "EXP / Roam",
        difficulty: 3,
        image: "../assets/images/heroes/mlbb/ruby.png"
    },
    {
        id: "khufra",
        name: "Khufra",
        role: "Tank",
        lane: "Roam",
        difficulty: 3,
        image: "../assets/images/heroes/mlbb/khufra.png"
    },
    {
        id: "tigreal",
        name: "Tigreal",
        role: "Tank",
        lane: "Roam",
        difficulty: 2,
        image: "../assets/images/heroes/mlbb/tigreal.png"
    },
    {
        id: "xavier",
        name: "Xavier",
        role: "Mage",
        lane: "Mid Lane",
        difficulty: 3,
        image: "../assets/images/heroes/mlbb/xavier.png"
    },
    {
        id: "lunox",
        name: "Lunox",
        role: "Mage",
        lane: "Mid Lane",
        difficulty: 4,
        image: "../assets/images/heroes/mlbb/lunox.png"
    },
    {
        id: "granger",
        name: "Granger",
        role: "Marksman",
        lane: "Gold / Jungle",
        difficulty: 3,
        image: "../assets/images/heroes/mlbb/granger.png"
    },
    {
        id: "beatrix",
        name: "Beatrix",
        role: "Marksman",
        lane: "Gold Lane",
        difficulty: 5,
        image: "../assets/images/heroes/mlbb/beatrix.png"
    },
    {
        id: "estes",
        name: "Estes",
        role: "Support",
        lane: "Roam",
        difficulty: 2,
        image: "../assets/images/heroes/mlbb/estes.png"
    },
    {
        id: "angela",
        name: "Angela",
        role: "Support",
        lane: "Roam",
        difficulty: 2,
        image: "../assets/images/heroes/mlbb/angela.png"
    }
];

/* ==========================================
   ELEMENTS
========================================== */

const elements = {
    body: document.body,

    loader: document.getElementById("pageLoader"),

    pageMenu: document.getElementById("pageMenu"),
    menuOverlay: document.getElementById("menuOverlay"),
    pageMenuButton: document.getElementById("pageMenuButton"),
    closeMenuButton: document.getElementById("closeMenuButton"),

    search: document.getElementById("mlbbSearch"),
    clearSearchButton:
        document.getElementById("clearSearchButton"),
    searchStatus:
        document.getElementById("searchStatus"),

    roleFilters:
        document.getElementById("roleFilters"),
    heroGrid:
        document.getElementById("heroGrid"),
    heroCount:
        document.getElementById("heroCount"),
    emptyHeroes:
        document.getElementById("emptyHeroes"),

    toast:
        document.getElementById("toast"),
    toastTitle:
        document.getElementById("toastTitle"),
    toastMessage:
        document.getElementById("toastMessage")
};

/* ==========================================
   APP STATE
========================================== */

const state = {
    query: "",
    role: "All"
};

let toastTimer = null;
let previousFocus = null;

/* ==========================================
   HELPERS
========================================== */

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLocaleLowerCase();
}

function getDifficultyStars(level) {
    const safeLevel = Math.min(
        5,
        Math.max(1, Number(level) || 1)
    );

    const filled = "★".repeat(safeLevel);
    const empty = "☆".repeat(5 - safeLevel);

    return filled + empty;
}

/* ==========================================
   HERO CARDS
========================================== */

function createHeroCard(hero) {
    const card = document.createElement("button");

    card.className = "hero-card";
    card.type = "button";
    card.dataset.heroId = hero.id;
    card.dataset.searchItem =
        `${hero.name} ${hero.role} ${hero.lane}`;

    card.setAttribute(
        "aria-label",
        `Open the ${hero.name} guide`
    );

    const portrait = document.createElement("div");
    portrait.className = "hero-portrait";

    const fallback = document.createElement("span");
    fallback.className = "hero-fallback";
    fallback.textContent = hero.name.charAt(0);

    const image = document.createElement("img");
    image.src = hero.image;
    image.alt = `${hero.name} portrait`;
    image.loading = "lazy";
    image.decoding = "async";

    image.addEventListener("load", () => {
        fallback.hidden = true;
    });

    image.addEventListener("error", () => {
        image.remove();
        fallback.hidden = false;
    });

    portrait.append(fallback, image);

    const copy = document.createElement("div");
    copy.className = "hero-card-copy";

    const name = document.createElement("h3");
    name.textContent = hero.name;

    const role = document.createElement("p");
    role.className = "hero-card-role";
    role.textContent = hero.role;

    const lane = document.createElement("p");
    lane.className = "hero-card-lane";
    lane.textContent = hero.lane;

    const difficulty = document.createElement("p");
    difficulty.className = "difficulty";
    difficulty.textContent =
        getDifficultyStars(hero.difficulty);

    difficulty.setAttribute(
        "aria-label",
        `Difficulty ${hero.difficulty} out of 5`
    );

    copy.append(
        name,
        role,
        lane,
        difficulty
    );

    card.append(
        portrait,
        copy
    );

    card.addEventListener("click", () => {
        showToast(
            `${hero.name} guide`,
            "Individual hero pages are coming in the next milestone."
        );
    });

    return card;
}

/* ==========================================
   HERO FILTERING
========================================== */

function getFilteredHeroes() {
    return heroes.filter((hero) => {
        const matchesRole =
            state.role === "All" ||
            hero.role === state.role;

        const searchableText = normalize(
            `${hero.name} ${hero.role} ${hero.lane}`
        );

        const matchesQuery =
            !state.query ||
            searchableText.includes(state.query);

        return matchesRole && matchesQuery;
    });
}

function renderHeroes() {
    if (!elements.heroGrid) {
        return;
    }

    const filteredHeroes = getFilteredHeroes();
    const fragment = document.createDocumentFragment();

    filteredHeroes.forEach((hero) => {
        fragment.appendChild(
            createHeroCard(hero)
        );
    });

    elements.heroGrid.replaceChildren(fragment);

    if (elements.heroCount) {
        const word =
            filteredHeroes.length === 1
                ? "hero"
                : "heroes";

        elements.heroCount.textContent =
            `${filteredHeroes.length} ${word}`;
    }

    if (elements.emptyHeroes) {
        elements.emptyHeroes.hidden =
            filteredHeroes.length !== 0;
    }

    updateSearchStatus(filteredHeroes.length);
}

function updateSearchStatus(heroMatches) {
    if (!elements.searchStatus) {
        return;
    }

    if (!state.query && state.role === "All") {
        elements.searchStatus.textContent =
            "Search the Mobile Legends hub.";

        return;
    }

    const word =
        heroMatches === 1
            ? "hero"
            : "heroes";

    const roleMessage =
        state.role === "All"
            ? ""
            : ` in ${state.role}`;

    elements.searchStatus.textContent =
        `${heroMatches} ${word} found${roleMessage}.`;
}

function selectRole(role) {
    state.role = role;

    document
        .querySelectorAll(".role-filter")
        .forEach((button) => {
            const active =
                button.dataset.role === role;

            button.classList.toggle(
                "active",
                active
            );

            button.setAttribute(
                "aria-pressed",
                String(active)
            );
        });

    renderHeroes();
}

/* ==========================================
   SEARCH
========================================== */

function filterGeneralContent(query) {
    const searchableItems =
        document.querySelectorAll(
            "[data-search-item]:not(.hero-card)"
        );

    searchableItems.forEach((item) => {
        const searchableText = normalize(
            item.dataset.searchItem ||
            item.textContent
        );

        const shouldHide =
            Boolean(query) &&
            !searchableText.includes(query);

        item.classList.toggle(
            "search-hidden",
            shouldHide
        );
    });
}

function handleSearch(value) {
    state.query = normalize(value);

    if (elements.clearSearchButton) {
        elements.clearSearchButton.hidden =
            state.query.length === 0;
    }

    filterGeneralContent(state.query);
    renderHeroes();
}

function clearSearch() {
    if (!elements.search) {
        return;
    }

    elements.search.value = "";
    state.query = "";

    if (elements.clearSearchButton) {
        elements.clearSearchButton.hidden = true;
    }

    filterGeneralContent("");
    renderHeroes();

    elements.search.focus();
}

/* ==========================================
   PAGE MENU
========================================== */

function openMenu() {
    if (
        !elements.pageMenu ||
        !elements.menuOverlay
    ) {
        return;
    }

    previousFocus = document.activeElement;

    elements.pageMenu.classList.add("open");
    elements.menuOverlay.classList.add("open");
    elements.body.classList.add("menu-open");

    elements.pageMenu.setAttribute(
        "aria-hidden",
        "false"
    );

    elements.pageMenuButton?.setAttribute(
        "aria-expanded",
        "true"
    );

    window.setTimeout(() => {
        elements.closeMenuButton?.focus();
    }, 100);
}

function closeMenu({
    restoreFocus = true
} = {}) {
    if (
        !elements.pageMenu ||
        !elements.menuOverlay
    ) {
        return;
    }

    elements.pageMenu.classList.remove("open");
    elements.menuOverlay.classList.remove("open");
    elements.body.classList.remove("menu-open");

    elements.pageMenu.setAttribute(
        "aria-hidden",
        "true"
    );

    elements.pageMenuButton?.setAttribute(
        "aria-expanded",
        "false"
    );

    if (
        restoreFocus &&
        previousFocus instanceof HTMLElement
    ) {
        previousFocus.focus();
    }
}

/* ==========================================
   TOAST NOTIFICATIONS
========================================== */

function showToast(title, message) {
    if (
        !elements.toast ||
        !elements.toastTitle ||
        !elements.toastMessage
    ) {
        return;
    }

    window.clearTimeout(toastTimer);

    elements.toastTitle.textContent = title;
    elements.toastMessage.textContent = message;

    elements.toast.classList.add("visible");
    elements.toast.setAttribute(
        "aria-hidden",
        "false"
    );

    toastTimer = window.setTimeout(() => {
        elements.toast.classList.remove("visible");

        elements.toast.setAttribute(
            "aria-hidden",
            "true"
        );
    }, 2800);
}

/* ==========================================
   PLACEHOLDER FEATURES
========================================== */

function registerPlaceholderActions() {
    document
        .querySelectorAll("[data-coming-soon]")
        .forEach((element) => {
            const activate = () => {
                closeMenu({
                    restoreFocus: false
                });

                const feature =
                    element.dataset.comingSoon ||
                    "This feature";

                showToast(
                    `${feature} is coming soon`,
                    "It is planned for an upcoming StratFounder milestone."
                );
            };

            element.addEventListener(
                "click",
                activate
            );

            if (
                element.getAttribute("tabindex") === "0"
            ) {
                element.addEventListener(
                    "keydown",
                    (event) => {
                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {
                            event.preventDefault();
                            activate();
                        }
                    }
                );
            }
        });
}

/* ==========================================
   EVENT LISTENERS
========================================== */

function registerEvents() {
    elements.pageMenuButton?.addEventListener(
        "click",
        openMenu
    );

    elements.closeMenuButton?.addEventListener(
        "click",
        () => closeMenu()
    );

    elements.menuOverlay?.addEventListener(
        "click",
        () => closeMenu()
    );

    elements.search?.addEventListener(
        "input",
        (event) => {
            handleSearch(
                event.currentTarget.value
            );
        }
    );

    elements.search?.addEventListener(
        "keydown",
        (event) => {
            if (event.key === "Escape") {
                clearSearch();
            }
        }
    );

    elements.clearSearchButton?.addEventListener(
        "click",
        clearSearch
    );

    elements.roleFilters?.addEventListener(
        "click",
        (event) => {
            const button =
                event.target.closest(".role-filter");

            if (!button) {
                return;
            }

            selectRole(
                button.dataset.role || "All"
            );
        }
    );

    document.addEventListener(
        "keydown",
        (event) => {
            if (
                event.key === "Escape" &&
                elements.pageMenu?.classList.contains(
                    "open"
                )
            ) {
                closeMenu();
            }
        }
    );

    document
        .querySelectorAll(
            '.page-menu a[href^="#"]'
        )
        .forEach((link) => {
            link.addEventListener(
                "click",
                () => {
                    closeMenu({
                        restoreFocus: false
                    });
                }
            );
        });
}

/* ==========================================
   PAGE LOADER
========================================== */

function hideLoader() {
    window.setTimeout(() => {
        elements.loader?.classList.add("hidden");

        window.setTimeout(() => {
            elements.loader?.remove();
        }, 500);
    }, 500);

    /*
    Defensive fallback:
    the loader will never remain stuck.
    */

    window.setTimeout(() => {
        elements.loader?.remove();
    }, 4000);
}

/* ==========================================
   INITIALIZE
========================================== */

function initialize() {
    try {
        renderHeroes();
        registerEvents();
        registerPlaceholderActions();
        hideLoader();

        console.info(
            "StratFounder MLBB Hub loaded."
        );
    } catch (error) {
        console.error(
            "MLBB Hub failed to initialize:",
            error
        );

        elements.loader?.remove();

        showToast(
            "Some content could not load",
            "Refresh the page to try again."
        );
    }
}

initialize();
