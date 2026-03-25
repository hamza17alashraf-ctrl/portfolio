const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navItem = document.querySelectorAll(".nav__item"),
  header = document.getElementById("header");

// open and close menu
navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("nav__menu--open");
  changeIcon();
});

// close the menu when the user clicks the nav links
navItem.forEach((item) => {
  item.addEventListener("click", () => {
    if (navMenu.classList.contains("nav__menu--open")) {
      navMenu.classList.remove("nav__menu--open");
    }
    changeIcon();
  });
});

// Change nav toggle icon
function changeIcon() {
  if (navMenu.classList.contains("nav__menu--open")) {
    navToggle.classList.replace("fa-bars", "fa-times");
  } else {
    navToggle.classList.replace("fa-times", "fa-bars");
  }
}

// header scroll animation
window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header.classList.add("header--scroll");
  } else {
    header.classList.remove("header--scroll");
  }
});

// ScrollReveal animations
const sr = ScrollReveal({
  duration: 500,
  distance: "80px",
  delay: 50,
  reset: false,
});

sr.reveal(".hero__content, .about__content");
sr.reveal(".hero__img", { origin: "top" });

sr.reveal(
  ".hero__info-wrapper, .skills__title, .skills__content, .qualification__name, .qualification__item, .service__card, .project__content, .testimonial__wrapper, .footer__content",
  {
    delay: 300,
    interval: 80,
  }
);

sr.reveal(".qualification__footer-text, .contact__content", {
  origin: "left",
});

sr.reveal(".qualification__footer .btn, .contact__btn", { origin: "right" });

// Profile Picture Modal Logic
const heroImg = document.querySelector('.hero__img');
const pfpModal = document.getElementById('pfp-modal');
const pfpModalClose = document.getElementById('pfp-modal-close');

if (heroImg && pfpModal && pfpModalClose) {
  heroImg.style.cursor = 'pointer';
  heroImg.addEventListener('click', () => {
    pfpModal.style.display = 'flex';
  });
  pfpModalClose.addEventListener('click', () => {
    pfpModal.style.display = 'none';
  });
  pfpModal.addEventListener('click', (e) => {
    if (e.target === pfpModal) {
      pfpModal.style.display = 'none';
    }
  });
}

// Smooth scroll to top for Home link
const homeLink = document.querySelector('.nav__link[href="#top"]');
if (homeLink) {
  homeLink.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// EmailJS integration for contact form
window.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  const contactSuccess = document.getElementById('contact-success');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (contactSuccess) contactSuccess.style.display = 'none';
      emailjs.init('lXKHA1tBqa1Nb3Qbu');
      emailjs.sendForm('service_4y60ocf', 'template_ohmqzf5', this)
        .then(function() {
          if (contactSuccess) contactSuccess.style.display = 'block';
          contactForm.reset();
        }, function(error) {
          alert('Failed to send message. Please try again.');
          if (contactSuccess) contactSuccess.style.display = 'none';
          console.log('EmailJS error:', error);
        });
    });
  }
});
