// Player data
const players = [
  { "nickname": "Annatar_BR", "category": "GM", "ranking": 1 },
  { "nickname": "Viapiana_BR", "category": "GM", "ranking": 2 },
  { "nickname": "JrTurambar", "category": "GM", "ranking": 3 },
  { "nickname": "Oakenshield", "category": "Semi-GM" },
  { "nickname": "Apocalipse", "category": "Semi-GM" },
  { "nickname": "Felagund", "category": "Semi-GM" },
  { "nickname": "Killer_Elf", "category": "Texugão da Malásia" },
  { "nickname": "Uchi", "category": "Texugão da Malásia" },
  { "nickname": "Moicano", "category": "Texugão da Malásia" },
  { "nickname": "Ximalia", "category": "Texugão da Malásia" },
  { "nickname": "Polimix", "category": "Texugão da Malásia" },
  { "nickname": "UrukDinho", "category": "Texugão da Malásia" },
  { "nickname": "PigFoot", "category": "Texugo Atroz" },
  { "nickname": "Frazão", "category": "Texugo Atroz" },
  { "nickname": "Ogney", "category": "Ogney" },
  { "nickname": "SoldierBoy", "category": "Ogney" },
  { "nickname": "Carneiro", "category": "Recruta" },
  { "nickname": "Witt", "category": "Recruta" }
];

// Categories in descending order
const categoriesOrder = ['GM', 'Semi-GM', 'Texugão da Malásia', 'Texugo Atroz', 'Ogney', 'Recruta'];

// Getting main container
const container = document.getElementById('container');

// Players selected by user
let selectedPlayers = [];

// Generate teams and update HTML tables
const generateTeams = () => {
  // Get tables
  const teamATable = document.getElementById('teamATable');
  const teamBTable = document.getElementById('teamBTable');

  // Clear existing tables
  teamATable.innerHTML = '';
  teamBTable.innerHTML = '';

  // Initialize teams
  const teamA = [];
  const teamB = [];

  // Count GMs in both teams for future reference
  let gmCountA = 0;
  let gmCountB = 0;

  // Sort players based on category and ranking
  const sortedPlayers = [...selectedPlayers].sort((a, b) => {
    if (a.category === b.category) {
      return (a.ranking || Infinity) - (b.ranking || Infinity);
    }
    return categoriesOrder.indexOf(a.category) - categoriesOrder.indexOf(b.category);
  });

  // Distribute players to teams
  sortedPlayers.forEach((player, index) => {
    if (index % 2 === 0) {
      teamA.push(player);
      if (player.category === 'GM') {
        gmCountA++;
      }
    } else {
      teamB.push(player);
      if (player.category === 'GM') {
        gmCountB++;
      }
    }
  });
  
  // Add AI Bot if teams are unbalanced
  if (selectedPlayers.length % 2 !== 0) {
    let difficulty = "Captain";
    
    if (gmCountA > 1 || gmCountB > 1) {
      difficulty = 'Death March';
    } else if (sortedPlayers.some(p => p.category === 'Recruta' || p.category === 'Ogney')) {
      difficulty = 'Soldier';
    }
    
    const botPlayer = { nickname: 'AI_Bot', category: 'Bot', bot: true, difficulty };
    
    // Determine which team is smaller and add the bot to it
    if (teamA.length < teamB.length) {
      teamA.push(botPlayer);
    } else {
      teamB.push(botPlayer);
    }
  }

  // Update tables with team data
  [teamA, teamB].forEach((team, index) => {
    const table = index === 0 ? teamATable : teamBTable;
    team.forEach(player => {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.textContent = player.bot ? player.difficulty : player.nickname;
      row.appendChild(cell);
      table.appendChild(row);
    });
  });

  // Unhide your GIF element here
  document.querySelectorAll('.hidden').forEach(el => el.classList.remove('hidden'));
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
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    counter.textContent = `(${remainingSlots}/8)`;
  });
};

// Create and populate category boxes
Object.keys(groupedPlayers).sort((a, b) => categoriesOrder.indexOf(a) - categoriesOrder.indexOf(b)).forEach(category => {
  // Create a box for the category
  const categoryBox = document.createElement('div');
  categoryBox.className = 'box p-4 m-2';
  
  // Create a div for the category title
  const categoryContent = document.createElement('div');
  categoryContent.style.textAlign = 'center';
  categoryBox.appendChild(categoryContent);

  // Create a title for the category
  const categoryTitle = document.createElement('h3');
  categoryTitle.className = 'title is-4';  // Bulma class for title styling
  categoryTitle.textContent = category;
  categoryContent.appendChild(categoryTitle);

  // Loop through players in this category
  groupedPlayers[category].forEach(player => {
    const row = document.createElement('div');
    row.className = 'columns is-mobile m-2 box';
  
    // Add click event to the row
    row.addEventListener('click', function(event) {
      if (event.target !== checkbox) {  // Add this line to check if the event target is not the checkbox
        if (checkbox.checked) {
          checkbox.checked = false;
          selectedPlayers = selectedPlayers.filter(p => p.nickname !== player.nickname);
          row.classList.toggle('selected');
        } else if (selectedPlayers.length < 8) {
          checkbox.checked = true;
          selectedPlayers.push(player);
          row.classList.toggle('selected');
        }
      }
      updateCounter(counter);  // Pass the counter specific to this checkbox
    });
    
    // Create a checkbox for the row
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.width = '24px';
    checkbox.style.height = '24px';
    
    // Add click event to the checkbox
    checkbox.addEventListener('change', function (event) {
      event.stopPropagation(); // Stop event from bubbling up to row
    
      if (this.checked && selectedPlayers.length < 8) {
        selectedPlayers.push(player);
        row.classList.add('selected');  // Add 'selected' class when checked
      } else if (!this.checked) {
        selectedPlayers = selectedPlayers.filter(p => p.nickname !== player.nickname);
        row.classList.remove('selected');  // Remove 'selected' class when unchecked
      } else {
        this.checked = false;
      }
      updateCounter(counter);  // Pass the counter specific to this checkbox
    });
  
    // Create a column for the image inside the row
    const imgColumn = document.createElement('div');
    imgColumn.className = 'column is-flex is-align-items-center'; // Bulma class for vertical centering
    row.appendChild(imgColumn);
  
    // Add category image inside the image column
    const img = document.createElement('img');
    img.src = `images/${category}.png`; // Assuming image filenames match category names
    img.alt = category; // Alt text for accessibility
    img.style.maxWidth = '64px'; // Set a maximum width
    img.style.maxHeight = '64px'; // Set a maximum height
    img.className = 'image'; // Bulma class for margin
    imgColumn.appendChild(img);
    
    // Create a column for the player's name
    const playerNameColumn = document.createElement('div');
    playerNameColumn.className = 'column is-flex is-align-items-center'; // Bulma class for vertical centering
  
    // Apply custom CSS styles to the player's name
    playerNameColumn.style.fontFamily = 'CoolFont, sans-serif'; // Replace 'CoolFont' with your preferred font
    playerNameColumn.style.fontSize = '20px'; // Adjust the font size as needed
  
    playerNameColumn.textContent = player.nickname;
    row.appendChild(playerNameColumn);
  
    // Create a column for the checkbox
    const checkboxColumn = document.createElement('div');
    checkboxColumn.className = 'column is-flex is-align-items-center'; // Bulma class for vertical centering

    // Add a counter to the checkbox column
    const counter = document.createElement('span');
    counter.className = 'counter ml-2';  // Class to identify counter elements
    counter.textContent = '(8/8)';  // Initial count
    checkboxColumn.appendChild(checkbox);  // Add checkbox first
    checkboxColumn.appendChild(counter);  // Add counter after checkbox

    // Add checkbox column to the row
    row.appendChild(checkboxColumn);
  
    // Apply CSS styles to center both the player's name and checkbox vertically
    playerNameColumn.style.display = 'flex';
    playerNameColumn.style.justifyContent = 'center';
    checkboxColumn.style.display = 'flex';
    checkboxColumn.style.justifyContent = 'center';
  
    categoryBox.appendChild(row);
  });
  
  // Add category box to the main container
  container.appendChild(categoryBox);
});

// Add click event to the Generate Teams button
document.getElementById('generateTeamsBtn').addEventListener('click', generateTeams);
