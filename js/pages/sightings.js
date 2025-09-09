// js/pages/sightings.js

document.addEventListener("DOMContentLoaded", () => {
  // --- ELEMENT REFERENCES ---
  const mapContainer = document.querySelector(".map-container");
  const mapContent = document.querySelector(".map-content");
  const mapImage = document.querySelector(".map-image");
  // *** FIX #1: Define the sightingForm variable ***
  const sightingForm = document.getElementById("sighting-form");

  // A safety check to ensure all critical elements exist
  if (!mapContainer || !mapContent || !mapImage || !sightingForm) {
    console.error("A critical element for the map page is missing.");
    return;
  }

  let newSightingCoordinates = null;

  // --- CORE FUNCTIONS ---

  function initializeMapAnimation() {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(mapImage);
    } else {
      setTimeout(() => mapImage.classList.add("reveal"), 500);
    }
  }

  function initializeMagnifyingZoom() {
    mapContainer.addEventListener("mousemove", (event) => {
      const rect = mapContainer.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const originX = (x / rect.width) * 100;
      const originY = (y / rect.height) * 100;
      mapContent.style.transformOrigin = `${originX}% ${originY}%`;
      mapContent.style.transform = "scale(1.2)";
    });
    mapContainer.addEventListener("mouseleave", () => {
      mapContent.style.transformOrigin = "center center";
      mapContent.style.transform = "scale(1)";
    });
  }

  async function fetchSightings() {
    try {
      const response = await fetch("http://localhost:8080/api/sightings", {
        method: "GET",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Could not fetch sightings data:", error);
      mapContent.innerHTML =
        "<p>Could not load sightings... Precious is lost!</p>";
      return [];
    }
  }

  function adjustTooltipPosition(pin) {
    const tooltip = pin.querySelector(".sighting-tooltip");
    const tooltipRect = tooltip.getBoundingClientRect();
    tooltip.classList.remove("align-left", "align-right");
    if (tooltipRect.right > window.innerWidth)
      tooltip.classList.add("align-right");
    if (tooltipRect.left < 0) tooltip.classList.add("align-left");
  }

  function createPin(sighting) {
    const pin = document.createElement("div");
    pin.className = "sighting-pin";
    pin.style.top = `${sighting.coordinates.top}%`;
    pin.style.left = `${sighting.coordinates.left}%`;

    // Re-added the clean HTML structure and classes for styling
    pin.innerHTML = `
  <div class="sighting-tooltip">
    <h4 class="tooltip-title">${sighting.name}</h4>
    <p class="tooltip-clue">"${sighting.clue}"</p>
    <small class="tooltip-reporter">Reported by: ${sighting.reported_by}</small>
  </div>
`;

    // Re-added the click listener for showing/hiding tooltips
    pin.addEventListener("click", (event) => {
      event.stopPropagation();
      const currentlyActivePin = document.querySelector(".sighting-pin.active");
      if (currentlyActivePin && currentlyActivePin !== pin) {
        currentlyActivePin.classList.remove("active");
      }
      pin.classList.toggle("active");
      if (pin.classList.contains("active")) {
        adjustTooltipPosition(pin);
      }
    });
    return pin;
  }

  function handleMapClickForForm(event) {
    const existingMarker = mapContent.querySelector(".sighting-marker");
    if (existingMarker) existingMarker.remove();

    const rect = mapContent.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const leftPercent = (x / rect.width) * 100;
    const topPercent = (y / rect.height) * 100;

    newSightingCoordinates = { top: topPercent, left: leftPercent };

    const marker = document.createElement("div");
    marker.className = "sighting-marker";
    marker.style.top = `${topPercent}%`;
    marker.style.left = `${leftPercent}%`;
    mapContent.appendChild(marker);
  }

  function handleFormSubmit(event) {
    event.preventDefault(); // This will now work correctly!

    if (!newSightingCoordinates) {
      alert("Nasty hobbitses! You must click on the map to show us where!");
      return;
    }

    const reporterName = document.getElementById("reporter-name").value;
    const sightingClue = document.getElementById("sighting-clue").value;

    const newSighting = {
      id: `sighting-${Date.now()}`,
      name: "A New Clue!",
      coordinates: newSightingCoordinates,
      clue: sightingClue,
      reported_by: reporterName,
    };

    const newPin = createPin(newSighting);
    mapContent.appendChild(newPin);

    sightingForm.reset();
    newSightingCoordinates = null;
    const marker = mapContent.querySelector(".sighting-marker");
    if (marker) marker.remove();
    (async function () {
      try {
        const response = await fetch("http://localhost:8080/api/sightings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSighting),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Success:", data);
      } catch (error) {
        console.error("Request failed:", error);
      }
    })();

    alert("Yesss, precious! A new secret for us! We will find it!");
  }

  // --- CONSOLIDATED INITIALIZATION ---
  async function initializePage() {
    // 1. Fetch initial sightings and create their pins
    const sightings = await fetchSightings();
    if (sightings.length > 0) {
      sightings.forEach((sighting) => {
        mapContent.appendChild(createPin(sighting));
      });
    }

    // 2. Set up event listeners for the form functionality
    mapContent.addEventListener("click", handleMapClickForForm);
    sightingForm.addEventListener("submit", handleFormSubmit);

    // 3. Activate the magnifying zoom
    initializeMagnifyingZoom();
  }

  // This is now the single, clean starting point after the animation
  mapImage.addEventListener("animationend", initializePage);

  // A single fallback timer
  setTimeout(() => {
    if (document.querySelectorAll(".sighting-pin").length === 0) {
      initializePage();
    }
  }, 2600);

  // Start the very first animation
  initializeMapAnimation();
});
