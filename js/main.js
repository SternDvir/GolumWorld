const year = document.getElementById("year");
const currentYear = new Date().getFullYear();
if (year) year.textContent = currentYear;
if (currentYear > 2024) {
  const footerTagline = document.querySelector(".footer-tagline");
  if (footerTagline) {
    footerTagline.textContent = footerTagline.textContent.slice(0, -1);
    footerTagline.textContent += ' For Ever"';
  }
}

// Where-is button scroll functionality
const whereIsButton = document.getElementById("Where-is");
const contentWrapper = document.querySelector(".content-wrapper");

if (whereIsButton && contentWrapper) {
  whereIsButton.addEventListener("click", function () {
    contentWrapper.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Focus for accessibility
    contentWrapper.setAttribute("tabindex", "-1");
    contentWrapper.focus();

    // Clean up tabindex
    setTimeout(() => {
      contentWrapper.removeAttribute("tabindex");
    }, 100);
  });
}

// About toggle functionality
const aboutToggle = document.getElementById("aboutToggle");
const aboutPanel = document.getElementById("aboutPanel");
const aboutImage = document.getElementById("aboutImage");

if (aboutToggle && aboutPanel) {
  aboutToggle.addEventListener("click", function () {
    const isExpanded = aboutToggle.getAttribute("aria-expanded") === "true";

    // Toggle aria-expanded attribute
    aboutToggle.setAttribute("aria-expanded", !isExpanded);

    // Toggle panel and image visibility
    if (isExpanded) {
      aboutPanel.classList.remove("show");
      aboutToggle.textContent = "Read About Gollum";
      if (aboutImage) {
        aboutImage.classList.remove("show");
      }
    } else {
      aboutPanel.classList.add("show");
      aboutToggle.textContent = "Hide About Gollum";
      if (aboutImage) {
        setTimeout(() => {
          aboutImage.classList.add("show");
        }, 300);
      }
    }
  });
}

// Map Animation System
function initializeMapAnimation() {
  // Only run on locations page
  const mapImage = document.querySelector(".map-image");
  if (!mapImage) return;

  let animationTriggered = false;

  function triggerMapAnimation() {
    if (animationTriggered) return;

    animationTriggered = true;
    mapImage.classList.add("reveal");
  }

  // Strategy 1: Animate when image loads
  if (mapImage.complete && mapImage.naturalHeight !== 0) {
    // Image already loaded
    setTimeout(triggerMapAnimation, 100);
  } else {
    // Wait for image to load
    mapImage.addEventListener("load", () => {
      setTimeout(triggerMapAnimation, 100);
    });

    // Fallback timeout (3 seconds)
    setTimeout(triggerMapAnimation, 3000);
  }

  // Strategy 2: Animate when scrolled into view
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

    // Start observing after a short delay
    setTimeout(() => {
      if (!animationTriggered) {
        observer.observe(mapImage);
      }
    }, 500);
  }
}

// Initialize all features when DOM is ready
function initializeAllFeatures() {
  initializeMapAnimation();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAllFeatures);
} else {
  initializeAllFeatures();
}
