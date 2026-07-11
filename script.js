/* ==========================================
   StratFounder v2.0
   Main Script
   Created by Ezradetta
==========================================*/

/* ==========================
   Splash Screen
========================== */

const splash = document.getElementById("splash-screen");

window.addEventListener("load", () => {

    setTimeout(() => {

        splash.style.opacity = "0";

        setTimeout(() => {

            splash.style.display = "none";

        }, 500);

    }, 2200);

});


/* ==========================
   Menu Drawer
========================== */

const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menu-btn");
const overlay = document.querySelector(".menu-overlay");

if(menu && menuBtn && overlay){

    menuBtn.addEventListener("click", () => {

        menu.classList.add("active");
        overlay.classList.add("active");

    });

    overlay.addEventListener("click", () => {

        menu.classList.remove("active");
        overlay.classList.remove("active");

    });

}


/* ==========================
   Games
========================== */

const games = [

    {
        id:"mlbb",
        name:"Mobile Legends",
        icon:"assets/images/mlbb.png"
    },

    {
        id:"valorant",
        name:"Valorant",
        icon:"assets/images/valorant.png"
    },

    {
        id:"minecraft",
        name:"Minecraft",
        icon:"assets/images/minecraft.png"
    },

    {
        id:"codm",
        name:"Call of Duty",
        icon:"assets/images/codm.png"
    }

];

const gamesContainer =
document.getElementById("gamesContainer");

if(gamesContainer){

    games.forEach(game=>{

        const card =
        document.createElement("div");

        card.className = "game-card";

        card.innerHTML = `

            <img src="${game.icon}" alt="${game.name}">

            <p>${game.name}</p>

        `;

        card.onclick = ()=>{

            window.location.href =
            "game.html?game=" + game.id;

        };

        gamesContainer.appendChild(card);

    });

}


/* ==========================
   Search
========================== */

const search =
document.querySelector(".search-section input");

if(search){

    search.addEventListener("input", ()=>{

        const keyword =
        search.value.toLowerCase();

        gamesContainer.innerHTML = "";

        games
        .filter(game=>

            game.name
            .toLowerCase()
            .includes(keyword)

        )

        .forEach(game=>{

            const card =
            document.createElement("div");

            card.className = "game-card";

            card.innerHTML = `

                <img src="${game.icon}" alt="${game.name}">

                <p>${game.name}</p>

            `;

            card.onclick = ()=>{

                window.location.href =
                "game.html?game=" + game.id;

            };

            gamesContainer.appendChild(card);

        });

    });

}

console.log("✅ StratFounder Loaded Successfully");
