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

// Mobile menu toggle
const menuBtn = document.querySelector(".menu-btn");
const primaryNav = document.getElementById("primaryNav");

if (menuBtn && primaryNav) {
  // On page load, check if menu should be open
  if (sessionStorage.getItem("menuOpen") === "true") {
    primaryNav.classList.add("open");
    menuBtn.setAttribute("aria-expanded", "true");
  }

  menuBtn.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", isOpen);

    // Save the state to sessionStorage
    if (isOpen) {
      sessionStorage.setItem("menuOpen", "true");
    } else {
      sessionStorage.removeItem("menuOpen");
    }
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

// Initialize all features when DOM is ready
function initializeAllFeatures() {
  // This function is now empty as page-specific logic has been moved.
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAllFeatures);
} else {
  initializeAllFeatures();
}
