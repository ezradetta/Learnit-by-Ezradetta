/* ==========================================
   LearnIt v0.1.0
   Foundation
========================================== */

// -----------------------------
// Splash Screen
// -----------------------------

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

// -----------------------------
// Games
// -----------------------------

const games = [

    {
        name: "Mobile Legends",
        icon: "⚔️"
    },

    {
        name: "Valorant",
        icon: "🎯"
    },

    {
        name: "Minecraft",
        icon: "⛏️"
    },

    {
        name: "Call of Duty",
        icon: "🎖️"
    }

];

const gamesContainer =
document.getElementById("gamesContainer");

function renderGames(list){

    gamesContainer.innerHTML = "";

    list.forEach(game => {

        gamesContainer.innerHTML += `

        <div class="gameTile">

            <div class="gameIcon">
                ${game.icon}
            </div>

            <h3>${game.name}</h3>

        </div>

        `;

    });

}

renderGames(games);

// -----------------------------
// News
// -----------------------------

const news = [

    {
        title:"MLBB Patch Notes Released",
        text:"See the newest hero adjustments and balance changes."
    },

    {
        title:"Valorant Night Market",
        text:"Limited-time skins are now available."
    }

];

const newsContainer =
document.getElementById("newsContainer");

function renderNews(){

    newsContainer.innerHTML = "";

    news.forEach(item=>{

        newsContainer.innerHTML += `

        <div class="card newsCard">

            <h3>${item.title}</h3>

            <p>${item.text}</p>

        </div>

        `;

    });

}

renderNews();

// -----------------------------
// Search
// -----------------------------

const search =
document.getElementById("search");

search.addEventListener("input",()=>{

    const keyword =
    search.value.toLowerCase();

    const filtered =
    games.filter(game=>

        game.name
        .toLowerCase()
        .includes(keyword)

    );

    renderGames(filtered);

});
