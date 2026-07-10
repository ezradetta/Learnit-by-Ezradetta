/* ==========================================
   LearnIt v0.1.0
   Foundation
   Created by Ezradetta
========================================== */

// ===========================
// Splash Screen
// ===========================

const splash = document.getElementById("splash");
const app = document.getElementById("app");

window.addEventListener("load", () => {

    setTimeout(() => {

        splash.style.opacity = "0";

        setTimeout(() => {

            splash.style.display = "none";

            app.classList.remove("hidden");
            app.classList.add("fadeIn");

        }, 500);

    }, 1500);

});

// ===========================
// Games Database
// ===========================

const games = [

    {
        id: "mlbb",
        name: "Mobile Legends",
        icon: "⚔️"
    },

    {
        id: "valorant",
        name: "Valorant",
        icon: "🎯"
    },

    {
        id: "minecraft",
        name: "Minecraft",
        icon: "⛏️"
    },

    {
        id: "cod",
        name: "Call of Duty",
        icon: "🎖️"
    }

];

// ===========================
// Render Games
// ===========================

const gamesContainer =
document.getElementById("gamesContainer");

function renderGames(list){

    gamesContainer.innerHTML = "";

    list.forEach(game => {

        const card = document.createElement("div");

        card.className = "gameTile";

        card.innerHTML = `

            <div class="gameIcon">
                ${game.icon}
            </div>

            <h3>${game.name}</h3>

        `;

        card.addEventListener("click", () => {

    window.location.href =
    `game.html?game=${game.id}`;

});

        gamesContainer.appendChild(card);

    });

}

renderGames(games);

// ===========================
// News Database
// ===========================

const news = [

    {
        title: "MLBB Patch 1.9.92",
        text: "New hero balancing and equipment changes."
    },

    {
        title: "Valorant Night Market",
        text: "Limited-time weapon skins are available."
    },

    {
        title: "Minecraft Update",
        text: "New blocks and survival improvements released."
    }

];

// ===========================
// Render News
// ===========================

const newsContainer =
document.getElementById("newsContainer");

function renderNews(){

    newsContainer.innerHTML = "";

    news.forEach(item => {

        const card = document.createElement("div");

        card.className = "card newsCard";

        card.innerHTML = `

            <h3>${item.title}</h3>

            <p>${item.text}</p>

        `;

        newsContainer.appendChild(card);

    });

}

renderNews();

// ===========================
// Search
// ===========================

const search =
document.getElementById("search");

search.addEventListener("input", () => {

    const keyword =
    search.value.toLowerCase();

    const filtered =
    games.filter(game =>

        game.name
        .toLowerCase()
        .includes(keyword)

    );

    renderGames(filtered);

});

// ===========================
// Bottom Navigation
// ===========================

const navItems =
document.querySelectorAll(".navItem");

navItems.forEach(item => {

    item.addEventListener("click", () => {

        navItems.forEach(nav =>

            nav.classList.remove("active")

        );

        item.classList.add("active");

    });

});

console.log("✅ LearnIt v0.1.0 Loaded Successfully");
