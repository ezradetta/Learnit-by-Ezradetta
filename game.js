/* ==========================================
   LearnIt
   Game Page
========================================== */

const games = {

    mlbb: {
        title: "Mobile Legends",
        description: "Heroes, builds, tier lists, counters and patch notes.",
        logo: "assets/logo/logo.png"
    },

    valorant: {
        title: "Valorant",
        description: "Agents, maps, crosshairs and lineups.",
        logo: "assets/logo/logo.png"
    },

    minecraft: {
        title: "Minecraft",
        description: "Blocks, crafting, survival and redstone guides.",
        logo: "assets/logo/logo.png"
    },

    cod: {
        title: "Call of Duty",
        description: "Loadouts, maps and weapon guides.",
        logo: "assets/logo/logo.png"
    }

};

const params = new URLSearchParams(window.location.search);

const gameId = params.get("game");

const game = games[gameId];

if(game){

    document.getElementById("gameTitle").textContent = game.title;

    document.getElementById("gameDescription").textContent = game.description;

    document.getElementById("gameLogo").src = game.logo;

}else{

    document.getElementById("gameTitle").textContent = "Game Not Found";

    document.getElementById("gameDescription").textContent =
    "Return to the homepage.";

}
