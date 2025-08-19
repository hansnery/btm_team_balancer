// Player data
const players = [
  { nickname: "Annatar_BR", category: "GM", ranking: 1 },
  { nickname: "Viapiana_BR", category: "GM", ranking: 2 },
  { nickname: "JrTurambar", category: "GM", ranking: 3 },
  { nickname: "Apocalipse", category: "GM", ranking: 4 },
  { nickname: "Polimix", category: "GM", ranking: 5 },
  { nickname: "Oakenshield", category: "GM", ranking: 6 },
  { nickname: "Felagund", category: "GM", ranking: 7 },
  { nickname: "Moicano", category: "GM", ranking: 8 },
  { nickname: "PBR", category: "GM", ranking: 9 },
  { nickname: "Frazão", category: "Texugão da Malásia" },
  { nickname: "Zurkov", category: "Texugão da Malásia" },
  { nickname: "Tauren", category: "Texugão da Malásia" },
  { nickname: "PigFoot", category: "Texugão da Malásia" },
  { nickname: "Killer_Elf", category: "Texugão da Malásia" },
  { nickname: "SoldierBoy", category: "Texugo Atroz" },
  { nickname: "Ximalia", category: "Aposentado" },
  { nickname: "Uchi", category: "Aposentado" },
  { nickname: "UrukDinho", category: "Aposentado" },
  { nickname: "Ogney", category: "Ogney" },
  { nickname: "Aragorn", category: "Recruta" },
];

// Categories in descending order
const categoriesOrder = [
  "GM",
  "Semi-GM",
  "Texugão da Malásia",
  "Texugo Atroz",
  "Ogney",
  "Recruta",
];

// Getting main container
const container = document.getElementById("container");

// Players selected by user
let selectedPlayers = [];

// Generate teams and update HTML tables
const generateTeams = () => {
  // Get tables
  const teamATable = document.getElementById("teamATable");
  const teamBTable = document.getElementById("teamBTable");

  // Clear existing tables
  teamATable.innerHTML = "";
  teamBTable.innerHTML = "";

  // Initialize teams
  const teamA = [];
  const teamB = [];

  // Strength mapping by category
  const categoryStrength = {
    GM: 100,
    "Semi-GM": 80,
    "Texugão da Malásia": 60,
    "Texugo Atroz": 50,
    Aposentado: 45,
    Ogney: 40,
    Recruta: 30,
    Bot: 50,
  };

  // Helper function: Shuffle players array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // Sort players by category and ranking, then shuffle
  const sortedPlayers = [...selectedPlayers].sort((a, b) => {
    if (a.category === b.category) {
      return (a.ranking || Infinity) - (b.ranking || Infinity);
    }
    return (
      categoriesOrder.indexOf(a.category) - categoriesOrder.indexOf(b.category)
    );
  });

  shuffleArray(sortedPlayers);

  // Distribute players to teams with slight randomness
  sortedPlayers.forEach((player) => {
    if (
      teamA.length === teamB.length ||
      (teamA.length > teamB.length && Math.random() > 0.5)
    ) {
      teamB.push(player);
    } else {
      teamA.push(player);
    }
  });

  // Add AI Bot only if the total number of players is odd
  if (selectedPlayers.length % 2 !== 0) {
    let difficulty = "Captain";

    const gmCountA = teamA.filter((p) => p.category === "GM").length;
    const gmCountB = teamB.filter((p) => p.category === "GM").length;

    if (gmCountA > 1 || gmCountB > 1) {
      difficulty = "Death March";
    } else if (
      sortedPlayers.some(
        (p) => p.category === "Recruta" || p.category === "Ogney"
      )
    ) {
      difficulty = "Soldier";
    }

    const botPlayer = {
      nickname: "AI_Bot",
      category: "Bot",
      bot: true,
      difficulty,
    };

    if (teamA.length < teamB.length) {
      teamA.push(botPlayer);
    } else {
      teamB.push(botPlayer);
    }
  }

  // Calculate team strength
  const calculateStrength = (team) =>
    team.reduce((sum, player) => {
      const baseStrength = categoryStrength[player.category] || 0;
      const rankingBonus = player.ranking ? 100 - player.ranking : 0;
      return sum + baseStrength + rankingBonus;
    }, 0);

  const strengthA = calculateStrength(teamA);
  const strengthB = calculateStrength(teamB);
  const totalStrength = strengthA + strengthB;
  const percentageA = ((strengthA / totalStrength) * 100).toFixed(1);
  const percentageB = ((strengthB / totalStrength) * 100).toFixed(1);

  // Helper function to create a progress bar
  const createProgressBar = (percentage) => {
    const progressBarContainer = document.createElement("div");
    progressBarContainer.style.width = "100%";
    progressBarContainer.style.backgroundColor = "#e0e0e0";
    progressBarContainer.style.borderRadius = "8px";
    progressBarContainer.style.overflow = "hidden";
    progressBarContainer.style.marginBottom = "10px";

    const progressBar = document.createElement("div");
    progressBar.style.width = `${percentage}%`;
    progressBar.style.height = "20px";
    progressBar.style.backgroundColor = "#4caf50";
    progressBar.style.textAlign = "center";
    progressBar.style.color = "white";
    progressBar.style.lineHeight = "20px";
    progressBar.style.fontSize = "12px";
    progressBar.textContent = `${percentage}%`;

    progressBarContainer.appendChild(progressBar);
    return progressBarContainer;
  };

  // Update tables with team data and strengths
  [teamA, teamB].forEach((team, index) => {
    const table = index === 0 ? teamATable : teamBTable;
    const percentage = index === 0 ? percentageA : percentageB;

    // Add strength bar at the top
    const strengthRow = document.createElement("tr");
    const strengthCell = document.createElement("td");
    strengthCell.colSpan = 1;

    // Add progress bar to the cell
    const progressBar = createProgressBar(percentage);
    strengthCell.appendChild(progressBar);

    strengthRow.appendChild(strengthCell);
    table.appendChild(strengthRow);

    // Add players to the table
    team.forEach((player) => {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.textContent = player.bot ? player.difficulty : player.nickname;
      row.appendChild(cell);
      table.appendChild(row);
    });
  });

  // Unhide your GIF element here
  document
    .querySelectorAll(".hidden")
    .forEach((el) => el.classList.remove("hidden"));
};

// Group players by category
const groupedPlayers = players.reduce((acc, player) => {
  if (!acc[player.category]) acc[player.category] = [];
  acc[player.category].push(player);
  return acc;
}, {});

// Update available slots counter
const updateCounter = () => {
  const remainingSlots = 8 - selectedPlayers.length;
  const counters = document.querySelectorAll(".counter");
  counters.forEach((counter) => {
    counter.textContent = `(${remainingSlots}/8)`;
  });
};

// Create and populate category boxes
Object.keys(groupedPlayers)
  .sort((a, b) => categoriesOrder.indexOf(a) - categoriesOrder.indexOf(b))
  .forEach((category) => {
    // Create a box for the category
    const categoryBox = document.createElement("div");
    categoryBox.className = "box p-4 m-2";

    // Create a div for the category title
    const categoryContent = document.createElement("div");
    categoryContent.style.textAlign = "center";
    categoryBox.appendChild(categoryContent);

    // Create a title for the category
    const categoryTitle = document.createElement("h3");
    categoryTitle.className = "title is-4"; // Bulma class for title styling
    categoryTitle.textContent = category;
    categoryContent.appendChild(categoryTitle);

    // Loop through players in this category
    groupedPlayers[category].forEach((player) => {
      const row = document.createElement("div");
      row.className = "columns is-mobile m-2 box";

      // Add click event to the row
      row.addEventListener("click", function (event) {
        if (event.target !== checkbox) {
          // Add this line to check if the event target is not the checkbox
          if (checkbox.checked) {
            checkbox.checked = false;
            selectedPlayers = selectedPlayers.filter(
              (p) => p.nickname !== player.nickname
            );
            row.classList.toggle("selected");
          } else if (selectedPlayers.length < 8) {
            checkbox.checked = true;
            selectedPlayers.push(player);
            row.classList.toggle("selected");
          }
        }
        updateCounter(counter); // Pass the counter specific to this checkbox
      });

      // Create a checkbox for the row
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.style.width = "24px";
      checkbox.style.height = "24px";

      // Add click event to the checkbox
      checkbox.addEventListener("change", function (event) {
        event.stopPropagation(); // Stop event from bubbling up to row

        if (this.checked && selectedPlayers.length < 8) {
          selectedPlayers.push(player);
          row.classList.add("selected"); // Add 'selected' class when checked
        } else if (!this.checked) {
          selectedPlayers = selectedPlayers.filter(
            (p) => p.nickname !== player.nickname
          );
          row.classList.remove("selected"); // Remove 'selected' class when unchecked
        } else {
          this.checked = false;
        }
        updateCounter(counter); // Pass the counter specific to this checkbox
      });

      // Create a column for the image inside the row
      const imgColumn = document.createElement("div");
      imgColumn.className = "column is-flex is-align-items-center"; // Bulma class for vertical centering
      row.appendChild(imgColumn);

      // Add category image inside the image column
      const img = document.createElement("img");
      img.src = `images/${category}.png`; // Assuming image filenames match category names
      img.alt = category; // Alt text for accessibility
      img.style.maxWidth = "64px"; // Set a maximum width
      img.style.maxHeight = "64px"; // Set a maximum height
      img.className = "image"; // Bulma class for margin
      imgColumn.appendChild(img);

      // Create a column for the player's name
      const playerNameColumn = document.createElement("div");
      playerNameColumn.className = "column is-flex is-align-items-center"; // Bulma class for vertical centering

      // Apply custom CSS styles to the player's name
      playerNameColumn.style.fontFamily = "CoolFont, sans-serif"; // Replace 'CoolFont' with your preferred font
      playerNameColumn.style.fontSize = "20px"; // Adjust the font size as needed

      playerNameColumn.textContent = player.nickname;
      row.appendChild(playerNameColumn);

      // Create a column for the checkbox
      const checkboxColumn = document.createElement("div");
      checkboxColumn.className = "column is-flex is-align-items-center"; // Bulma class for vertical centering

      // Add a counter to the checkbox column
      const counter = document.createElement("span");
      counter.className = "counter ml-2"; // Class to identify counter elements
      counter.textContent = "(8/8)"; // Initial count
      checkboxColumn.appendChild(checkbox); // Add checkbox first
      checkboxColumn.appendChild(counter); // Add counter after checkbox

      // Add checkbox column to the row
      row.appendChild(checkboxColumn);

      // Apply CSS styles to center both the player's name and checkbox vertically
      playerNameColumn.style.display = "flex";
      playerNameColumn.style.justifyContent = "center";
      checkboxColumn.style.display = "flex";
      checkboxColumn.style.justifyContent = "center";

      categoryBox.appendChild(row);
    });

    // Add category box to the main container
    container.appendChild(categoryBox);
  });

// Add click event to the Generate Teams button
document
  .getElementById("generateTeamsBtn")
  .addEventListener("click", generateTeams);
