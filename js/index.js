let watches = [];
let randomWatch;
let p = 0; // points
let r = 1; // rounds

// Fisher-Yates shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function loadWatches() {
    try {
        const response = await fetch("data/watches.json");
        watches = await response.json();
    } catch (error) {
        console.error("Failed to load watch data:", error);
    }
    shuffle(watches);
}
loadWatches();

async function loadRandomWatch() {
    if (watches.length == 0) await loadWatches();

    randomWatch = watches[r - 1];
    document.getElementById("name").textContent = randomWatch.name;
    document.getElementById("image").src = randomWatch.image;
    document.getElementById("date-sold").textContent = "Sold: " + randomWatch.dateSold;
}

function calculatePoints() {
    let price = randomWatch.price;
    let guess = document.getElementById("guess").value;
    guess = parseInt(guess.replace(/,/g, ""), 10);

    let percentageError = 1 - Math.abs((price - guess) / price);
    let roundPoints = 0;
    if (!(percentageError < 0)) roundPoints += Math.round(1000 * percentageError);
    p += roundPoints;

    document.getElementById("roundPoints").textContent = "+" + roundPoints + " Points";

    let actualPrice = document.getElementById("actualPrice");
    actualPrice.textContent = "$" + randomWatch.price.toLocaleString("en-US");
    actualPrice.style.display = "block";

    document.getElementById("sold").classList.add("show");
}

function loadSummary() {
    document.getElementById("start").style.display = "none"; // unnecessary
    document.getElementById("rounds").style.display = "none";
    document.getElementById("image-wrapper").style.display = "none";
    document.getElementById("date-sold").style.display = "none";
    document.getElementById("round-summary").style.display = "none";

    document.getElementById("name").textContent = "The WatchWorth Game";
    document.getElementById("name").style.fontSize = "40px";

    document.getElementById("gamePoints").textContent = p.toLocaleString("en-US") + " Points";
    document.getElementById("game-summary").style.display = "flex";
}

const guessInput = document.getElementById("guess");

guessInput.addEventListener("input", () => {
    let val = guessInput.value.replace(/,/g, ""); // Remove existing commas
    val = val.replace(/\D/g, ""); // Only allow digits
    guessInput.value = Number(val).toLocaleString("en-US"); // Add commas
});
document.getElementById("start").addEventListener("click", () => {
    document.getElementById("rounds").textContent = "Round " + r + " of 5";
    document.getElementById("start").style.display = "none";
    document.getElementById("input-container").style.display = "flex";
    loadRandomWatch();
});
document.querySelector("#input-container button").addEventListener("click", () => {
    calculatePoints();
    document.getElementById("input-container").style.display = "none";
    document.getElementById("round-summary").style.display = "flex";
    document.getElementById("guess").value = 0;
});
document.getElementById("next").addEventListener("click", () => {
    document.getElementById("sold").classList.remove("show");
    document.getElementById("actualPrice").style.display = "none";
    r++;
    if (r == 6) loadSummary();
    else {
        document.getElementById("round-summary").style.display = "none";
        document.getElementById("rounds").textContent = "Round " + r + " of 5";
        document.getElementById("input-container").style.display = "flex";
        loadRandomWatch();
    }
})
document.getElementById("again").addEventListener("click", () => {
    r = 1;
    p = 0;

    shuffle(watches);
    
    document.getElementById("name").style.fontSize = "24px";
    document.getElementById("game-summary").style.display = "none";
    document.getElementById("rounds").style.display = "block";
    document.getElementById("image-wrapper").style.display = "flex";
    document.getElementById("date-sold").style.display = "block";
    document.getElementById("rounds").textContent = "Round " + r + " of 5";
    document.getElementById("input-container").style.display = "flex";
    loadRandomWatch();
})
