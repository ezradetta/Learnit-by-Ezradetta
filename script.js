/* ==========================================
   STRATFOUNDER v2.0
   Homepage behavior
========================================== */

"use strict";

/* ==========================================
   DATA
========================================== */

const games = [
    {
        id: "mlbb",
        name: "Mobile Legends",
        subtitle: "MOBA",
        image: "assets/images/games/mlbb.png",
        page: "pages/mlbb.html",
        searchTerms: [
            "mobile legends",
            "mlbb",
            "moba",
            "heroes",
            "builds",
            "counters"
        ]
    },
    {
        id: "valorant",
        name: "Valorant",
        subtitle: "Tactical FPS",
        image: "assets/images/games/valorant.png",
        page: "pages/valorant.html",
        searchTerms: [
            "valorant",
            "riot",
            "fps",
            "agents",
            "crosshair",
            "lineups"
        ]
    },
    {
        id: "codm",
        name: "Call of Duty",
        subtitle: "Mobile FPS",
        image: "assets/images/games/codm.png",
        page: "pages/codm.html",
        searchTerms: [
            "call of duty",
            "codm",
            "fps",
            "weapons",
            "loadouts",
            "mobile"
        ]
    },
    {
        id: "minecraft",
        name: "Minecraft",
        subtitle: "Sandbox",
        image: "assets/images/games/minecraft.png",
        page: "pages/minecraft.html",
        searchTerms: [
            "minecraft",
            "sandbox",
            "survival",
            "crafting",
            "redstone",
            "building"
        ]
    }
];

const loadingMessages = [
    {
        progress: 0,
        text: "Preparing StratFounder..."
    },
    {
        progress: 18,
        text: "Loading heroes..."
    },
    {
        progress: 39,
        text: "Finding counters..."
    },
    {
        progress: 61,
        text: "Checking the latest meta..."
    },
    {
        progress: 80,
        text: "Preparing strategies..."
    },
    {
        progress: 96,
        text: "Gaming with Ease..."
    }
];

/* ==========================================
   ELEMENT REFERENCES
========================================== */

const elements = {
    body: document.body,

    splashScreen: document.getElementById("splashScreen"),
    loadingBar: document.getElementById("loadingBar"),
    loadingText: document.getElementById("loadingText"),
    loadingPercent: document.getElementById("loadingPercent"),
    loadingTrack: document.querySelector(".loading-track"),

    drawer: document.getElementById("drawer"),
    drawerOverlay: document.getElementById("drawerOverlay"),
    openDrawerButton: document.getElementById("openDrawerButton"),
    closeDrawerButton: document.getElementById("closeDrawerButton"),

    gamesCarousel: document.getElementById("gamesCarousel"),
    noGameResults: document.getElementById("noGameResults"),

    globalSearch: document.getElementById("globalSearch"),
    clearSearchButton: document.getElementById("clearSearchButton"),
    searchStatus: document.getElementById("searchStatus"),

    toast: document.getElementById("toast"),
    toastTitle: document.getElementById("toastTitle"),
    toastMessage: document.getElementById("toastMessage")
};

/* ==========================================
   HELPERS
========================================== */

function normalizeText(value) {
    return String(value ?? "")
        .trim()
        .toLocaleLowerCase();
}

function elementExists(element) {
    return element instanceof Element;
}

function buttonExists(element) {
    return element instanceof HTMLButtonElement;
}

function inputExists(element) {
    return element instanceof HTMLInputElement;
}

function safeNavigate(path) {
    if (typeof path !== "string" || !path.trim()) {
        showToast(
            "Page unavailable",
            "This destination has not been configured yet."
        );

        return;
    }

    window.location.assign(path);
}

/* ==========================================
   SPLASH SCREEN
========================================== */

function getLoadingMessage(progress) {
    let selectedMessage = loadingMessages[0].text;

    for (const message of loadingMessages) {
        if (progress >= message.progress) {
            selectedMessage = message.text;
        }
    }

    return selectedMessage;
}

function setLoadingProgress(progress) {
    const safeProgress = Math.min(100, Math.max(0, Math.round(progress)));

    if (elementExists(elements.loadingBar)) {
        elements.loadingBar.style.width = `${safeProgress}%`;
    }

    if (elementExists(elements.loadingText)) {
        elements.loadingText.textContent = getLoadingMessage(safeProgress);
    }

    if (elementExists(elements.loadingPercent)) {
        elements.loadingPercent.textContent = `${safeProgress}%`;
    }

    if (elementExists(elements.loadingTrack)) {
        elements.loadingTrack.setAttribute(
            "aria-valuenow",
            String(safeProgress)
        );
    }
}

function finishSplash() {
    setLoadingProgress(100);
    elements.body?.classList.add("app-ready");

    if (!elementExists(elements.splashScreen)) {
        return;
    }

    window.setTimeout(() => {
        elements.splashScreen.classList.add("is-leaving");

        window.setTimeout(() => {
            elements.splashScreen.remove();
        }, 700);
    }, 160);
}

function startSplash() {
    if (!elementExists(elements.splashScreen)) {
        elements.body?.classList.add("app-ready");
        return;
    }

    const minimumSplashTime = 1900;
    const startTime = performance.now();

    let progress = 0;
    let lastFrameTime = startTime;

    function update(currentTime) {
        const elapsedSinceFrame = currentTime - lastFrameTime;
        lastFrameTime = currentTime;

        const slowingFactor =
            progress < 60
                ? 0.055
                : progress < 88
                    ? 0.025
                    : 0.008;

        progress += elapsedSinceFrame * slowingFactor;
        progress = Math.min(progress, 96);

        setLoadingProgress(progress);

        const totalElapsed = currentTime - startTime;
        const pageLoaded = document.readyState === "complete";

        if (pageLoaded && totalElapsed >= minimumSplashTime) {
            finishSplash();
            return;
        }

        window.requestAnimationFrame(update);
    }

    window.requestAnimationFrame(update);

    /*
     * Defensive escape hatch:
     * the splash cannot remain forever if an unrelated resource stalls.
     */
    window.setTimeout(() => {
        if (document.body.contains(elements.splashScreen)) {
            finishSplash();
        }
    }, 5000);
}

/* ==========================================
   DRAWER
========================================== */

let previouslyFocusedElement = null;

function getDrawerFocusables() {
    if (!elementExists(elements.drawer)) {
        return [];
    }

    return Array.from(
        elements.drawer.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), ' +
            'select:not([disabled]), textarea:not([disabled]), ' +
            '[tabindex]:not([tabindex="-1"])'
        )
    );
}

function openDrawer() {
    if (
        !elementExists(elements.drawer) ||
        !elementExists(elements.drawerOverlay)
    ) {
        return;
    }

    previouslyFocusedElement = document.activeElement;

    elements.drawer.classList.add("is-open");
    elements.drawerOverlay.classList.add("is-open");
    elements.body.classList.add("drawer-open");

    elements.drawer.setAttribute("aria-hidden", "false");
    elements.drawerOverlay.setAttribute("aria-hidden", "false");

    if (buttonExists(elements.openDrawerButton)) {
        elements.openDrawerButton.setAttribute("aria-expanded", "true");
    }

    const focusables = getDrawerFocusables();

    window.setTimeout(() => {
        focusables[0]?.focus();
    }, 100);
}

function closeDrawer({ restoreFocus = true } = {}) {
    if (
        !elementExists(elements.drawer) ||
        !elementExists(elements.drawerOverlay)
    ) {
        return;
    }

    elements.drawer.classList.remove("is-open");
    elements.drawerOverlay.classList.remove("is-open");
    elements.body.classList.remove("drawer-open");

    elements.drawer.setAttribute("aria-hidden", "true");
    elements.drawerOverlay.setAttribute("aria-hidden", "true");

    if (buttonExists(elements.openDrawerButton)) {
        elements.openDrawerButton.setAttribute("aria-expanded", "false");
    }

    if (
        restoreFocus &&
        previouslyFocusedElement instanceof HTMLElement
    ) {
        previouslyFocusedElement.focus();
    }
}

function drawerIsOpen() {
    return elements.drawer?.classList.contains("is-open") ?? false;
}

function trapDrawerFocus(event) {
    if (event.key !== "Tab" || !drawerIsOpen()) {
        return;
    }

    const focusables = getDrawerFocusables();

    if (!focusables.length) {
        event.preventDefault();
        return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

/* ==========================================
   GAME CARDS
========================================== */

function createGameCard(game) {
    const link = document.createElement("a");

    link.className = "game-card";
    link.href = game.page;
    link.dataset.gameId = game.id;
    link.dataset.searchItem = [
        game.name,
        game.subtitle,
        ...game.searchTerms
    ].join(" ");

    link.setAttribute("aria-label", `Open ${game.name}`);

    const image = document.createElement("img");

    image.src = game.image;
    image.alt = "";
    image.loading = "eager";
    image.decoding = "async";

    image.addEventListener("error", () => {
        image.remove();

        link.style.background =
            "linear-gradient(145deg, #342c48, #242424)";
    });

    const copy = document.createElement("span");

    copy.className = "game-card-copy";

    const name = document.createElement("strong");
    name.textContent = game.name;

    const subtitle = document.createElement("small");
    subtitle.textContent = game.subtitle;

    copy.append(name, subtitle);
    link.append(image, copy);

    link.addEventListener("pointerdown", () => {
        link.classList.add("is-pressed");
    });

    const releasePress = () => {
        link.classList.remove("is-pressed");
    };

    link.addEventListener("pointerup", releasePress);
    link.addEventListener("pointercancel", releasePress);
    link.addEventListener("pointerleave", releasePress);

    link.addEventListener("click", (event) => {
        event.preventDefault();
        link.classList.add("is-pressed");

        window.setTimeout(() => {
            safeNavigate(game.page);
        }, 120);
    });

    return link;
}

function renderGames() {
    if (!elementExists(elements.gamesCarousel)) {
        return;
    }

    const fragment = document.createDocumentFragment();

    for (const game of games) {
        fragment.appendChild(createGameCard(game));
    }

    elements.gamesCarousel.replaceChildren(fragment);
}

/* ==========================================
   SEARCH
========================================== */

function getSearchableItems() {
    return Array.from(
        document.querySelectorAll(
            "[data-search-item], [data-search-section]"
        )
    );
}

function itemMatchesQuery(element, query) {
    const searchValue = normalizeText(
        element.dataset.searchItem ||
        element.dataset.searchTerms ||
        element.textContent
    );

    return searchValue.includes(query);
}

function filterSearchableSection(section, query) {
    const childItems = Array.from(
        section.querySelectorAll("[data-search-item]")
    );

    if (!childItems.length) {
        const matches = itemMatchesQuery(section, query);
        section.classList.toggle("is-empty", !matches);
        return matches ? 1 : 0;
    }

    let matchCount = 0;

    for (const item of childItems) {
        const matches = itemMatchesQuery(item, query);

        item.classList.toggle("is-search-hidden", !matches);

        if (matches) {
            matchCount += 1;
        }
    }

    section.classList.toggle("is-empty", matchCount === 0);

    return matchCount;
}

function filterHomeContent(value) {
    const query = normalizeText(value);

    if (buttonExists(elements.clearSearchButton)) {
        elements.clearSearchButton.hidden = query.length === 0;
    }

    const sections = Array.from(
        document.querySelectorAll("[data-search-section]")
    );

    if (!query) {
        document
            .querySelectorAll(".is-search-hidden")
            .forEach((element) => {
                element.classList.remove("is-search-hidden");
            });

        sections.forEach((section) => {
            section.classList.remove("is-empty");
        });

        if (elementExists(elements.noGameResults)) {
            elements.noGameResults.hidden = true;
        }

        if (elementExists(elements.searchStatus)) {
            elements.searchStatus.textContent =
                "Search across games, guides, updates, and tools.";
        }

        return;
    }

    let totalMatches = 0;
    let gameMatches = 0;

    for (const section of sections) {
        const count = filterSearchableSection(section, query);

        totalMatches += count;

        if (section.dataset.searchSection === "games") {
            gameMatches = count;
        }
    }

    if (elementExists(elements.noGameResults)) {
        elements.noGameResults.hidden = gameMatches !== 0;
    }

    if (elementExists(elements.searchStatus)) {
        elements.searchStatus.textContent =
            totalMatches === 1
                ? `1 result found for “${value.trim()}”.`
                : `${totalMatches} results found for “${value.trim()}”.`;
    }
}

function clearSearch() {
    if (!inputExists(elements.globalSearch)) {
        return;
    }

    elements.globalSearch.value = "";
    filterHomeContent("");
    elements.globalSearch.focus();
}

/* ==========================================
   TOAST AND PLACEHOLDER ACTIONS
========================================== */

let toastTimeout = null;

function showToast(title, message) {
    if (
        !elementExists(elements.toast) ||
        !elementExists(elements.toastTitle) ||
        !elementExists(elements.toastMessage)
    ) {
        return;
    }

    window.clearTimeout(toastTimeout);

    elements.toastTitle.textContent = title;
    elements.toastMessage.textContent = message;

    elements.toast.classList.add("is-visible");
    elements.toast.setAttribute("aria-hidden", "false");

    toastTimeout = window.setTimeout(() => {
        elements.toast.classList.remove("is-visible");
        elements.toast.setAttribute("aria-hidden", "true");
    }, 2800);
}

function activateComingSoon(element) {
    const featureName =
        element.dataset.comingSoon || "This feature";

    showToast(
        `${featureName} is coming soon`,
        "It is planned for a future StratFounder update."
    );
}

function registerPlaceholderActions() {
    const placeholders = document.querySelectorAll(
        "[data-coming-soon]"
    );

    placeholders.forEach((element) => {
        element.addEventListener("click", () => {
            closeDrawer({ restoreFocus: false });
            activateComingSoon(element);
        });

        if (
            element instanceof HTMLElement &&
            element.getAttribute("tabindex") === "0"
        ) {
            element.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    activateComingSoon(element);
                }
            });
        }
    });
}

/* ==========================================
   INTERNAL LINKS
========================================== */

function registerInternalDrawerLinks() {
    document
        .querySelectorAll('.drawer-link[href^="#"]')
        .forEach((link) => {
            link.addEventListener("click", () => {
                closeDrawer({ restoreFocus: false });
            });
        });
}

/* ==========================================
   EVENT REGISTRATION
========================================== */

function registerEvents() {
    elements.openDrawerButton?.addEventListener(
        "click",
        openDrawer
    );

    elements.closeDrawerButton?.addEventListener(
        "click",
        () => closeDrawer()
    );

    elements.drawerOverlay?.addEventListener(
        "click",
        () => closeDrawer()
    );

    elements.globalSearch?.addEventListener(
        "input",
        (event) => {
            filterHomeContent(event.currentTarget.value);
        }
    );

    elements.globalSearch?.addEventListener(
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

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && drawerIsOpen()) {
            closeDrawer();
            return;
        }

        trapDrawerFocus(event);
    });
}

/* ==========================================
   INITIALIZATION
========================================== */

function initializeApp() {
    try {
        renderGames();
        registerEvents();
        registerPlaceholderActions();
        registerInternalDrawerLinks();
        startSplash();

        console.info("StratFounder v2.0 loaded successfully.");
    } catch (error) {
        console.error("StratFounder failed to initialize:", error);

        /*
         * A defensive fallback ensures an unrelated error never traps
         * the visitor behind the loading screen.
         */
        elements.body?.classList.add("app-ready");
        elements.splashScreen?.remove();

        showToast(
            "Some features could not load",
            "Refresh the page to try again."
        );
    }
}

initializeApp();
