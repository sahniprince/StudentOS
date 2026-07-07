/**
 * StudentOS — Landing Page JavaScript
 * ====================================
 * Handles all interactive behaviors:
 *  - Mobile navigation menu
 *  - Sticky navbar with blur on scroll
 *  - FAQ accordion
 *  - Scroll reveal animations
 *  - Smooth scrolling for anchor links
 *  - Active navigation link highlighting
 *  - Animated number counters
 */

"use strict";

/* ===========================================
   DOM ELEMENT REFERENCES
   =========================================== */

const navbar     = document.getElementById("navbar");
const navToggle  = document.getElementById("navToggle");
const navMenu    = document.getElementById("navMenu");
const navLinks   = document.querySelectorAll(".navbar__link");
const faqItems   = document.querySelectorAll(".faq__item");
const revealEls  = document.querySelectorAll(".reveal");
const counters   = document.querySelectorAll(".trusted__number");


/* ===========================================
   MOBILE NAVIGATION MENU
   =========================================== */

/**
 * Toggles the mobile navigation drawer open/closed.
 * Also manages body scroll-lock and ARIA attributes.
 */
function toggleMobileMenu() {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.classList.toggle("is-active", isOpen);
  navToggle.setAttribute("aria-expanded", isOpen);

  // Prevent background scroll when menu is open
  document.body.style.overflow = isOpen ? "hidden" : "";
}

/**
 * Closes the mobile navigation drawer.
 */
function closeMobileMenu() {
  navMenu.classList.remove("is-open");
  navToggle.classList.remove("is-active");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

navToggle.addEventListener("click", toggleMobileMenu);

// Close the menu when a nav link is clicked (mobile UX)
navLinks.forEach(function (link) {
  link.addEventListener("click", closeMobileMenu);
});

// Close menu on Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && navMenu.classList.contains("is-open")) {
    closeMobileMenu();
  }
});


/* ===========================================
   STICKY NAVBAR WITH BLUR
   =========================================== */

/**
 * Adds a 'scrolled' class to the navbar when the user scrolls
 * past a threshold, enabling the frosted-glass backdrop blur.
 */
const SCROLL_THRESHOLD = 50;

function handleNavbarScroll() {
  if (window.scrollY > SCROLL_THRESHOLD) {
    navbar.classList.add("is-scrolled");
  } else {
    navbar.classList.remove("is-scrolled");
  }
}

window.addEventListener("scroll", handleNavbarScroll, { passive: true });


/* ===========================================
   ACTIVE NAVIGATION LINK HIGHLIGHTING
   =========================================== */

/**
 * Highlights the navbar link corresponding to the section
 * currently visible in the viewport using IntersectionObserver.
 */
const sections = document.querySelectorAll("section[id]");

const sectionObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute("id");

        navLinks.forEach(function (link) {
          link.classList.remove("is-active");

          // Match the link's href hash to the section id
          if (link.getAttribute("href") === "#" + currentId) {
            link.classList.add("is-active");
          }
        });
      }
    });
  },
  {
    rootMargin: "-40% 0px -60% 0px", // Trigger roughly when section is centered
  }
);

sections.forEach(function (section) {
  sectionObserver.observe(section);
});


/* ===========================================
   SMOOTH SCROLLING
   =========================================== */

/**
 * Intercepts clicks on anchor links (href="#...") and scrolls
 * smoothly to the target section, accounting for the fixed navbar.
 */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener("click", function (event) {
    const targetId = this.getAttribute("href");

    // Skip empty hashes
    if (targetId === "#") return;

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    event.preventDefault();

    const navbarHeight = navbar.offsetHeight;
    const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  });
});


/* ===========================================
   FAQ ACCORDION
   =========================================== */

/**
 * Implements an accessible accordion pattern for the FAQ section.
 * Only one item can be expanded at a time.
 */
faqItems.forEach(function (item) {
  const questionBtn = item.querySelector(".faq__question");
  const answer = item.querySelector(".faq__answer");

  questionBtn.addEventListener("click", function () {
    const isCurrentlyOpen = item.classList.contains("is-open");

    // Close all FAQ items first (single-open accordion)
    faqItems.forEach(function (otherItem) {
      const otherAnswer = otherItem.querySelector(".faq__answer");
      otherItem.classList.remove("is-open");
      otherItem.querySelector(".faq__question").setAttribute("aria-expanded", "false");
      otherAnswer.setAttribute("aria-hidden", "true");
      otherAnswer.style.maxHeight = null;
    });

    // Toggle the clicked item
    if (!isCurrentlyOpen) {
      item.classList.add("is-open");
      questionBtn.setAttribute("aria-expanded", "true");
      answer.setAttribute("aria-hidden", "false");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});


/* ===========================================
   SCROLL REVEAL ANIMATIONS
   =========================================== */

/**
 * Uses IntersectionObserver to add a 'is-visible' class when
 * elements with the '.reveal' class enter the viewport,
 * triggering CSS-driven fade-in / slide-up animations.
 */
const revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        // Stop observing after reveal to avoid re-triggering
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -60px 0px",
  }
);

revealEls.forEach(function (el) {
  revealObserver.observe(el);
});


/* ===========================================
   ANIMATED NUMBER COUNTERS
   =========================================== */

/**
 * Animates number counters from 0 to their data-target value
 * when the trusted stats section enters the viewport.
 * Uses requestAnimationFrame for smooth performance.
 */
let countersAnimated = false;

function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;

  counters.forEach(function (counter) {
    const target = parseInt(counter.getAttribute("data-target"), 10);
    const duration = 2000; // Animation duration in ms
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for natural deceleration
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easedProgress * target);

      counter.textContent = currentValue.toLocaleString() + "+";

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

const counterObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.3,
  }
);

// Observe the trusted section container
const trustedSection = document.getElementById("trusted");
if (trustedSection) {
  counterObserver.observe(trustedSection);
}
