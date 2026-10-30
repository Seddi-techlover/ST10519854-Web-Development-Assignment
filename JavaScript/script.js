function findDirections() {
  const storeAddress = "Braamfontein, Johannesburg";

  if (!navigator.geolocation) {
    alert("Location access isn't supported on this browser. Opening directions without your current location.");
    window.open("https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(storeAddress), "_blank");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      const origin = position.coords.latitude + "," + position.coords.longitude;
      const url = "https://www.google.com/maps/dir/?api=1&origin=" + origin +
        "&destination=" + encodeURIComponent(storeAddress);
      window.open(url, "_blank");
    },
    function () {
      alert("Couldn't access your location. Opening directions without it.");
      window.open("https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(storeAddress), "_blank");
    }
  );
}

/* ===== Lightbox Gallery + Slideshow =====
   Any <img class="lightbox-trigger"> opens in the overlay on click.
   The overlay doubles as a slideshow: the previous/next buttons (or the
   left/right arrow keys) move through every trigger image that is currently
   visible on the page, so a filtered catalogue only slides through its matches.
   Pages whose overlay has no prev/next buttons simply show one image. */
let slideImages = [];   // the trigger images in the current slideshow
let slideIndex = 0;     // which one is showing

function showSlide(index) {
  const img = document.getElementById("lightbox-image");
  const caption = document.getElementById("lightbox-caption");
  const counter = document.getElementById("lightbox-counter");
  if (!img || slideImages.length === 0) return;

  // Wrap around at both ends
  slideIndex = (index + slideImages.length) % slideImages.length;
  const current = slideImages[slideIndex];

  img.src = current.getAttribute("src");
  img.alt = current.getAttribute("alt") || "";
  if (caption) caption.textContent = current.dataset.caption || current.getAttribute("alt") || "";
  if (counter) counter.textContent = (slideIndex + 1) + " / " + slideImages.length;
}

function openLightbox(trigger) {
  const overlay = document.getElementById("lightbox-overlay");
  if (!overlay) return;

  // Build the slideshow from the visible trigger images on this page
  slideImages = Array.from(document.querySelectorAll(".lightbox-trigger")).filter(function (el) {
    return !el.closest(".is-hidden");
  });
  const start = slideImages.indexOf(trigger);
  overlay.classList.toggle("lightbox-single", slideImages.length < 2);
  showSlide(start === -1 ? 0 : start);

  overlay.classList.add("lightbox-open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const overlay = document.getElementById("lightbox-overlay");
  overlay.classList.remove("lightbox-open");
  document.body.style.overflow = "";
}

function nextSlide() { showSlide(slideIndex + 1); }
function prevSlide() { showSlide(slideIndex - 1); }

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".lightbox-trigger").forEach(function (img) {
    img.addEventListener("click", function () {
      openLightbox(img);
    });
  });

  const overlay = document.getElementById("lightbox-overlay");
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeLightbox();
    });

    const prevBtn = overlay.querySelector(".lightbox-prev");
    const nextBtn = overlay.querySelector(".lightbox-next");
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  }

  document.addEventListener("keydown", function (e) {
    const isOpen = overlay && overlay.classList.contains("lightbox-open");
    if (!isOpen) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });

  // Touch support: swipe left/right to change slide
  if (overlay) {
    let touchStartX = null;
    overlay.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    overlay.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) { dx < 0 ? nextSlide() : prevSlide(); }
      touchStartX = null;
    }, { passive: true });
  }

  /* ===== Accordion ===== */
  document.querySelectorAll(".accordion-header").forEach(function (header) {
    header.addEventListener("click", function () {
      const item = header.parentElement;
      const wasOpen = item.classList.contains("accordion-open");

      item.parentElement.querySelectorAll(".accordion-item").forEach(function (i) {
        i.classList.remove("accordion-open");
      });

      if (!wasOpen) item.classList.add("accordion-open");
    });
  });

  /* ===== Form Validation ===== */
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^(\+27|0)[1-9][0-9]{8}$/;

  function showError(id, message) {
    const el = document.getElementById(id + "-error");
    if (el) el.textContent = message;
  }

  function clearErrors(form) {
    form.querySelectorAll(".error-text").forEach(function (el) {
      el.textContent = "";
    });
  }

  /* ===== AJAX Form Submission =====
     Both forms are sent with fetch() so the page never reloads: the button
     shows a sending state, then a success or error message appears in place.
     The endpoint lives in one constant so it can be swapped without touching
     the logic below. */

  /* Submissions go to Netlify Forms, which is built into the Netlify host.
     Each form in the HTML has data-netlify="true" and a hidden "form-name"
     field. Netlify stores every submission and emails it to the address set
     under Forms > Notifications in the Netlify dashboard, so no email address
     needs to appear in this public code. */
  const REQUEST_TIMEOUT_MS = 10000;

  function setSending(form, isSending) {
    const button = form.querySelector("button[type=submit]");
    if (!button) return;
    if (isSending) {
      button.dataset.label = button.textContent;
      button.textContent = "Sending...";
      button.disabled = true;
      button.classList.add("btn-sending");
    } else {
      button.textContent = button.dataset.label || "Send";
      button.disabled = false;
      button.classList.remove("btn-sending");
    }
  }

  function showResponse(boxId, message, isError) {
    const box = document.getElementById(boxId);
    if (!box) return;
    box.innerHTML = message;
    box.classList.toggle("form-response-error", !!isError);
    box.classList.toggle("form-response-success", !isError);
    box.hidden = false;
    box.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Posts the form to Netlify Forms (url-encoded, as Netlify expects) and
  // resolves on a 2xx response
  function sendForm(payload) {
    const controller = new AbortController();
    const timer = setTimeout(function () {
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    // Netlify needs the form name plus the real field values
    const params = new URLSearchParams();
    params.append("form-name", payload.form);
    Object.keys(payload).forEach(function (key) {
      if (key !== "form" && key.charAt(0) !== "_") {
        params.append(key, payload[key]);
      }
    });

    return fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      signal: controller.signal
    })
      .then(function (response) {
        clearTimeout(timer);
        if (!response.ok) {
          throw new Error("Server responded with status " + response.status);
        }
        return response;
      })
      .finally(function () {
        clearTimeout(timer);
      });
  }

  function friendlyError(err) {
    if (err && err.name === "AbortError") {
      return "That took too long to send. Please check your connection and try again.";
    }
    return "Sorry, we couldn't send your message just now. Please try again, or email " +
      "<a href=\"mailto:info@revivethrift.co.za\">info@revivethrift.co.za</a> directly.";
  }

  /* ----- Contact form ----- */
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault(); // stop the normal page-reload submission
      clearErrors(contactForm);
      let valid = true;

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const subject = document.getElementById("subject").value.trim();
      const message = document.getElementById("message").value.trim();

      if (name.length < 2) {
        showError("name", "Please enter your full name.");
        valid = false;
      }
      if (!emailPattern.test(email)) {
        showError("email", "Please enter a valid email address.");
        valid = false;
      }
      if (phone && !phonePattern.test(phone.replace(/\s/g, ""))) {
        showError("phone", "Please enter a valid South African number, e.g. 071 234 5678.");
        valid = false;
      }
      if (subject.length < 3) {
        showError("subject", "Please enter a subject.");
        valid = false;
      }
      if (message.length < 10) {
        showError("message", "Message should be at least 10 characters.");
        valid = false;
      }

      // Honeypot: only a bot fills this hidden field in
      if (contactForm.querySelector("[name=_honey]").value !== "") {
        return;
      }
      if (!valid) return;

      setSending(contactForm, true);

      sendForm({
        // FormSubmit reserved fields: email subject, layout, and no captcha step
        _subject: "Website contact form: " + subject,
        _template: "table",
        _captcha: "false",
        form: "contact",
        name: name,
        email: email,
        phone: phone,
        subject: subject,
        message: message,
        submittedAt: new Date().toISOString()
      })
        .then(function () {
          showResponse(
            "contact-response",
            "<strong>Thanks, " + name + " — your message is on its way.</strong><br>" +
            "We'll reply to " + email + " within one business day.",
            false
          );
          contactForm.reset();
        })
        .catch(function (err) {
          console.error("Contact form failed:", err);
          showResponse("contact-response", friendlyError(err), true);
        })
        .finally(function () {
          setSending(contactForm, false);
        });
    });
  }

  /* ----- Enquiry form ----- */
  const enquiryForm = document.getElementById("enquiry-form");
  if (enquiryForm) {
    enquiryForm.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors(enquiryForm);
      let valid = true;

      const name = document.getElementById("enq-name").value.trim();
      const email = document.getElementById("enq-email").value.trim();
      const type = document.getElementById("enq-type").value;
      const item = document.getElementById("enq-item").value.trim();
      const message = document.getElementById("enq-message").value.trim();

      if (name.length < 2) {
        showError("enq-name", "Please enter your full name.");
        valid = false;
      }
      if (!emailPattern.test(email)) {
        showError("enq-email", "Please enter a valid email address.");
        valid = false;
      }
      if (!type) {
        showError("enq-type", "Please select an enquiry type.");
        valid = false;
      }
      if (item.length < 2) {
        showError("enq-item", "Please tell us which item or category.");
        valid = false;
      }

      if (enquiryForm.querySelector("[name=_honey]").value !== "") {
        return;
      }
      if (!valid) return;

      // The dynamic response the brief asks for: tailored to the enquiry type
      const responses = {
        availability: "We'll check current stock on \"" + item +
          "\" and confirm availability by email within 1 business day.",
        sizing: "For sizing on \"" + item +
          "\", our team will reply with measurements so you can confirm the right fit before visiting.",
        custom: "Custom requests like \"" + item +
          "\" are handled case-by-case — we'll follow up with feasibility and an estimated cost.",
        bulk: "For bulk/wholesale enquiries on \"" + item +
          "\", we'll send you pricing tiers and minimum order details by email."
      };

      setSending(enquiryForm, true);

      sendForm({
        _subject: "Website stock enquiry (" + type + "): " + item,
        _template: "table",
        _captcha: "false",
        form: "enquiry",
        name: name,
        email: email,
        enquiryType: type,
        item: item,
        message: message,
        submittedAt: new Date().toISOString()
      })
        .then(function () {
          showResponse(
            "enquiry-response",
            "<strong>Thanks, " + name + " — enquiry received.</strong><br>" + responses[type],
            false
          );
          enquiryForm.reset();
        })
        .catch(function (err) {
          console.error("Enquiry form failed:", err);
          showResponse("enquiry-response", friendlyError(err), true);
        })
        .finally(function () {
          setSending(enquiryForm, false);
        });
    });
  }
});

/* ===== Catalogue Search and Category Filter =====
   Filters the Shop grid on the home page by keyword and by category.
   Both work together: a search term narrows whatever category is active. */
document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("catalogue-grid");
  if (!grid) return;

  const searchInput = document.getElementById("catalogue-search");
  const chips = document.querySelectorAll(".filter-chips .chip");
  const countEl = document.getElementById("catalogue-count");
  const emptyEl = document.getElementById("catalogue-empty");
  const items = Array.from(grid.querySelectorAll(".catalogue-item"));

  let activeCategory = "all";

  function applyFilters() {
    const term = (searchInput.value || "").trim().toLowerCase();
    let visible = 0;

    items.forEach(function (item) {
      const category = item.dataset.category;
      const haystack = (
        item.dataset.name + " " + category + " " + item.dataset.keywords
      ).toLowerCase();

      const matchesCategory = activeCategory === "all" || category === activeCategory;
      const matchesSearch = term === "" || haystack.indexOf(term) !== -1;

      if (matchesCategory && matchesSearch) {
        item.classList.remove("is-hidden");
        visible++;
      } else {
        item.classList.add("is-hidden");
      }
    });

    // Live result count, announced to screen readers via aria-live
    const label = visible === 1 ? "1 piece" : visible + " pieces";
    if (term === "" && activeCategory === "all") {
      countEl.textContent = "Showing all " + items.length + " pieces";
    } else {
      countEl.textContent = "Showing " + label + " of " + items.length;
    }

    emptyEl.hidden = visible !== 0;
  }

  searchInput.addEventListener("input", applyFilters);

  // Escape clears the search box
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      searchInput.value = "";
      applyFilters();
    }
  });

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      activeCategory = chip.dataset.filter;

      chips.forEach(function (c) {
        const isActive = c === chip;
        c.classList.toggle("chip-active", isActive);
        c.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      applyFilters();
    });
  });

  applyFilters();
});

/* ===== Live Date and Time in the Footer =====
   Fills <p id="datetime"> on every page and refreshes it every second.
   Uses the visitor's own clock, formatted for South Africa (en-ZA). */
document.addEventListener("DOMContentLoaded", function () {
  const dateTimeEl = document.getElementById("datetime");
  if (!dateTimeEl) return;

  const formatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };

  function updateDateTime() {
    const now = new Date();
    dateTimeEl.textContent = now.toLocaleString("en-ZA", formatOptions);
  }

  updateDateTime();                    // show it immediately
  setInterval(updateDateTime, 1000);   // then update every second
});