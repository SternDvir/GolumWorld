// This script will fetch location data and build the location cards.
document.addEventListener("DOMContentLoaded", () => {
  const locationsGrid = document.getElementById("locations-grid");
  if (!locationsGrid) return;

  // --- Map Animation System  ---
  function initializeMapAnimation() {
    const mapImage = document.querySelector(".map-image");
    if (!mapImage) return;

    let animationTriggered = false;

    function triggerMapAnimation() {
      if (animationTriggered) return;
      animationTriggered = true;
      mapImage.classList.add("reveal");
    }

    if (mapImage.complete && mapImage.naturalHeight !== 0) {
      setTimeout(triggerMapAnimation, 100);
    } else {
      mapImage.addEventListener("load", () =>
        setTimeout(triggerMapAnimation, 100)
      );
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              triggerMapAnimation();
              observer.unobserve(mapImage);
            }
          });
        },
        { threshold: 0.3 }
      );
      setTimeout(() => {
        if (!animationTriggered) observer.observe(mapImage);
      }, 500);
    } else {
      // Fallback for older browsers
      setTimeout(triggerMapAnimation, 1000);
    }
  }

  // --- Location Cards Logic ---

  // Function to fetch location data
  async function fetchLocations() {
    try {
      const response = await fetch("../data/locations.json");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.locations;
    } catch (error) {
      console.error("Could not fetch locations:", error);
      return [];
    }
  }

  // Function to create a single location card
  function createLocationCard(location) {
    const card = document.createElement("div");
    card.className = "location-card";
    card.innerHTML = `
      <h3 class="location-name">${location.name}</h3>
      <p class="location-description"><strong>Description:</strong> ${location.description}</p>
      <p class="location-significance"><strong>Significance:</strong> ${location.significance}</p>
      <button class="btn gollum-opinion-btn" aria-expanded="false">Gollum's Opinion</button>
      <div class="gollum-opinion-text" hidden>
        <p>${location.gollums_thoughts}</p>
      </div>
    `;

    const opinionBtn = card.querySelector(".gollum-opinion-btn");

    opinionBtn.addEventListener("click", (event) => {
      // 'event.currentTarget' is ALWAYS the button that was clicked
      const clickedButton = event.currentTarget;
      const isExpanded = clickedButton.getAttribute("aria-expanded") === "true";

      // Find the text panel that is the NEXT element sibling to the button
      const opinionText = clickedButton.nextElementSibling;

      clickedButton.setAttribute("aria-expanded", !isExpanded);
      if (opinionText) {
        opinionText.hidden = !opinionText.hidden;
      }
    });

    return card;
  }

  // --- Animation on Scroll for Cards ---
  function initializeCardAnimation() {
    const cards = document.querySelectorAll(".location-card");
    if (cards.length === 0) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25, rootMargin: "0px 0px -50px 0px" }
      );

      cards.forEach((card) => observer.observe(card));
    } else {
      // Fallback for older browsers: just show them
      cards.forEach((card) => card.classList.add("visible"));
    }
  }

  // Main function to build the grid
  async function buildLocationsGrid() {
    const locations = await fetchLocations();
    if (locations.length === 0) {
      locationsGrid.innerHTML = "<p>Could not load locations data.</p>";
      return;
    }

    locations.forEach((location) => {
      const card = createLocationCard(location);
      locationsGrid.appendChild(card);
    });

    // After cards are created, initialize their animation
    initializeCardAnimation();
  }

  // --- Initialize Everything ---
  initializeMapAnimation();
  buildLocationsGrid();
});
