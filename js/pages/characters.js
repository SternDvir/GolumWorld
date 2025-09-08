// Characters Page JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const characterList = document.getElementById("characterList");
  const characterContent = document.getElementById("characterContent");

  // Fetch character data from API
  async function fetchCharacters() {
    try {
      // Show loading state
      characterContent.innerHTML =
        '<div class="loading">Loading characters, my precious...</div>';

      // Try to fetch from the API endpoint as specified
      const response = await fetch("http://localhost:8080/api/characters");

      // If the API is not available, show error
      let characters;
      if (response.ok) {
        const data = await response.json();
        characters = data.characters || data;
      } else {
        throw new Error("API not available");
      }

      // Populate character navigation
      populateCharacterNavigation(characters);

      // Display first character by default
      if (characters.length > 0) {
        displayCharacter(characters[0]);
      }
    } catch (error) {
      console.error("Error fetching character data:", error);
      characterContent.innerHTML =
        '<div class="error">Failed to load characters, precious! Try again later.</div>';
    }
  }

  // Populate character navigation sidebar
  function populateCharacterNavigation(characters) {
    characterList.innerHTML = "";

    characters.forEach((character) => {
      const listItem = document.createElement("li");
      const button = document.createElement("button");

      button.className = "character-btn";
      button.textContent = character.name;
      button.setAttribute("data-character", character.name);

      button.addEventListener("click", () => {
        displayCharacter(character);
      });

      listItem.appendChild(button);
      characterList.appendChild(listItem);
    });
  }

  // Display character details
  function displayCharacter(character) {
    // Add fade-out effect
    characterContent.classList.add("fade-out");

    // Update active button
    updateActiveButton(character.name);

    // After fade-out, update content and fade-in
    setTimeout(() => {
      // Handle key_items array properly
      const keyItemsHTML =
        character.key_items && character.key_items.length > 0
          ? `<ul>${character.key_items
              .map((item) => `<li>${item}</li>`)
              .join("")}</ul>`
          : "<p>None</p>";

      characterContent.innerHTML = `
        <h2 class="character-name">${character.name}</h2>
          <div class="character-section">
          <h3>Race</h3>
        <p>${character.race || "Unknown"}</p>
        </div>
          <div class="character-section">
          <h3>Affiliation</h3>
        <p>${character.affiliation || "Unknown"}</p>
        </div>
          <div class="character-section">
          <h3>Description</h3>
            <p>${character.description || "No description available."}</p>
          </div>
        <div class="character-section">
        <h3>Key Items</h3>
          ${keyItemsHTML}
          </div>
        <div class="gollum-thoughts">
      <h3>Gollum's Thoughts</h3>
<p>"${
        character.gollums_thoughts ||
        "Gollum has no thoughts on this character."
      }"</p>
      </div>
      `;

      // Update current character
      currentCharacter = character;

      // Add fade-in effect
      characterContent.classList.remove("fade-out");
      characterContent.classList.add("fade-in");

      // Clean up animation classes after transition
      setTimeout(() => {
        characterContent.classList.remove("fade-in");
      }, 500);
    }, 250);
  }

  // Update active button in navigation
  function updateActiveButton(characterName) {
    // Remove active class from all buttons
    const buttons = document.querySelectorAll(".character-btn");
    buttons.forEach((button) => {
      button.classList.remove("active");
    });

    // Add active class to clicked button
    const activeButton = document.querySelector(
      `.character-btn[data-character="${characterName}"]`
    );
    if (activeButton) {
      activeButton.classList.add("active");
    }
  }

  // Initialize the page
  fetchCharacters();
});
