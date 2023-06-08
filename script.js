const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "2302-ACC-CT-WEB-PT-A";
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/2302-ACC-CT-WEB-PT-A/players`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL);
        const players = await response.json();
        return players.data.players;
    } catch (err) {
        console.error("Uh oh, trouble fetching players!", err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${playerId}`);
        const data = await response.json();
        const player = data.data.player;

        playerContainer.innerHTML = "";
        newPlayerFormContainer.innerHTML = "";
        const playerDetailsElement = document.createElement("div");
        playerDetailsElement.classList.add("player-details");
        playerDetailsElement.innerHTML = `
                        <div class="player-container">
                        <h2>${player.name}</h2>
                        <img src="${player.imageUrl}" alt="${player.name}">
                        <h3>Breed: ${player.breed}</h3>
                        <h3> Status: ${player.status}</h3>
                        <button class="close-button btn">Close</button>
                        </div>
            `;
        playerContainer.appendChild(playerDetailsElement);

        // add event listener to close button
        const closeButton = playerDetailsElement.querySelector(".close-button");
        closeButton.addEventListener("click", () => {
            playerDetailsElement.remove();
            init();
        });
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

// const addNewPlayer = async (playerObj) => {
//   try {
//     const response = await fetch(APIURL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(playerObj)
//     });
//     const newDog = await response.json();
//     console.log(newDog);
//   } catch (err) {
//     console.error("Oops, something went wrong with adding that player!", err);
//   }
// };
const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(APIURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: playerObj.name,
                breed: playerObj.breed,
                status: playerObj.status,
                imageURL: playerObj.imageURL,
                createdAt: playerObj.createdAt,
                updtedAt: playerObj.updtedAt,
                teamId: playerObj.teamId,
                cohortId: playerObj.cohortId
            })
        });
        const result = await response.json();
        console.log(result);
    } catch (err) {
        console.error("Oops, something went wrong with adding that player!", err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${playerId}`, {
            method: "DELETE"
        });
        const player = await response.json();
        console.log(player);
        fetchAllPlayers();
        window.location.reload();
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players.
 *
 * Then it takes that larger string of HTML and adds it to the DOM.
 *
 * It also adds event listeners to the buttons in each player card.
 *
 * The event listeners are for the "See details" and "Remove from roster" buttons.
 *
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player.
 *
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster.
 *
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = async (playerList) => {
    try {
        playerContainer.innerHTML = "";
        playerList.forEach((player) => {
            const playerElement = document.createElement("div");
            playerElement.classList.add("player");
            playerElement.innerHTML = `
                    <div class="players-container">
                    <h2>${player.name}</h2>
                    <img src="${player.imageUrl}" alt="${player.name}">
                    <button class="details-button btn" data-id="${player.id}">See Details</button>
                    <button class="delete-button btn" data-id="${player.id}">Delete</button>
                    </div>
                `;
            playerContainer.appendChild(playerElement);

            // see details
            const detailsButton = playerElement.querySelector(".details-button");
            detailsButton.addEventListener("click", async (event) => {
                event.preventDefault();
                fetchSinglePlayer(player.id);
            });

            // delete party
            const deleteButton = playerElement.querySelector(".delete-button");
            deleteButton.addEventListener("click", async (event) => {
                event.preventDefault();
                removePlayer(player.id);
            });
        });
    } catch (err) {
        console.error("Uh oh, trouble rendering players!", err);
    }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        const formHtml = `
      <form class="players-container">
        <h2> Add Dog </h2>
        <img id ="dogimg" src= "https://media.istockphoto.com/id/639255368/vector/vector-black-silhouette-of-a-dog.jpg?s=612x612&w=0&k=20&c=LxmhSbJvDDhjkC56P1P9rW-SdVXejpTZroOd_6WlYDk=" alt="dog">
        <label for="name">Name:</label>
        <input id="name" name="name" placeholder="Banjo"><br>
        <label for="breed">Breed:</label>
        <input id="breed" name="breed" placeholder="Chocolate Labrador"><br>
        <label for="status">Status:</label>
        <select id="status">
            <option value="bench">Bench</option>
            <option value="field">Field</option>
        </select> <br>
        <label for="img">Image:</label>
        <input id="img" name="img" placeholder="img-URL"><br>
        <button class="btn" type="submit">Submit</button>
        </form>`;
        newPlayerFormContainer.innerHTML = formHtml;

        newPlayerFormContainer.addEventListener("submit", async (event) => {
            event.preventDefault();
            const data = {
                status: document.getElementById("status").value,
                name: document.getElementById("name").value,
                breed: document.getElementById("breed").value,
                imageUrl: document.getElementById("img").value
            };
            const newDog = await addNewPlayer(data);
            console.log(newDog);
            init();
        });
    } catch (err) {
        console.error("Uh oh, trouble rendering the new player form!", err);
    }
};

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    renderNewPlayerForm();
};

init();
