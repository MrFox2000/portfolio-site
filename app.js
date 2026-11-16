/* Hand-written vanilla JS: no framework, no build step.
 *
 * 1. sticky header state
 * 2. mobile navigation
 * 3. project filtering
 * 4. scroll reveal via IntersectionObserver
 * 5. footer year
 */

(function () {
  "use strict";

  /* 1. header gets a border once the page is scrolled */
  var header = document.querySelector(".site-header");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-stuck", window.scrollY > 8);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 2. mobile navigation */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", function (event) {
      if (event.target instanceof HTMLAnchorElement) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* 3. filter projects by tag */
  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip"));
  var projects = Array.prototype.slice.call(document.querySelectorAll(".project"));

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var filter = chip.dataset.filter || "all";

      chips.forEach(function (other) {
        other.classList.toggle("is-active", other === chip);
      });

      projects.forEach(function (project) {
        var tags = (project.dataset.tags || "").split(/\s+/);
        var match = filter === "all" || tags.indexOf(filter) !== -1;
        project.classList.toggle("is-hidden", !match);
      });
    });
  });

  /* 4. reveal sections as they enter the viewport */
  var revealTargets = document.querySelectorAll(
    ".section-head, .project, .stack-card, .steps li, .contact-card"
  );

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach(function (target, index) {
      target.classList.add("reveal");
      /* stagger cards so a row does not pop all at once */
      target.style.transitionDelay = (index % 4) * 60 + "ms";
      observer.observe(target);
    });
  }

  /* 5. footer year */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
