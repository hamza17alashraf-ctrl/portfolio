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
  ".hero__info-wrapper, .skills__title, .skills__content, .qualification__name, .qualification__item, .service__card, .project__card, .testimonial__wrapper, .footer__content",
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

  const projectSubsections = document.querySelectorAll('.project__subsection');
  const projectPool = [
    {
      image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=900&q=80',
      title: 'Concept Development',
      description: 'Early concept studies focused on massing, natural light, and spatial relationships.',
      date: 'April 2024'
    },
    {
      image: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=900&q=80',
      title: 'Facade Exploration',
      description: 'Material and facade exploration balancing identity, performance, and aesthetics.',
      date: 'May 2024'
    },
    {
      image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80',
      title: 'Urban Proposal',
      description: 'A site-responsive proposal integrating circulation, landscape, and public activity.',
      date: 'June 2024'
    },
    {
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80',
      title: 'Detailed Study',
      description: 'Refined technical study for structure, envelope, and interior atmosphere.',
      date: 'July 2024'
    },
    {
      image: 'https://images.unsplash.com/photo-1465808028273-23916f3f7a4f?auto=format&fit=crop&w=900&q=80',
      title: 'Presentation Board',
      description: 'Visual storytelling package for client presentation and design communication.',
      date: 'August 2024'
    },
    {
      image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=900&q=80',
      title: 'Construction Phase',
      description: 'Execution-focused drawings and coordinated details for build-ready delivery.',
      date: 'September 2024'
    },
    {
      image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
      title: 'Interior Concept',
      description: 'Interior mood and material strategy with comfort-driven space planning.',
      date: 'October 2024'
    },
    {
      image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80',
      title: 'Landscape Vision',
      description: 'Outdoor environment design combining planting, pathways, and gathering zones.',
      date: 'November 2024'
    }
  ];

  function pickRandomProject() {
    return projectPool[Math.floor(Math.random() * projectPool.length)];
  }

  projectSubsections.forEach((subsection) => {
    const grid = subsection.querySelector('.project__grid');
    const baseCard = grid ? grid.querySelector('.project__card') : null;

    if (!grid || !baseCard) {
      return;
    }

    const subsectionTitle = subsection.querySelector('.project__subsection-title')?.textContent?.trim() || 'Project';
    const isRealisticRenderings = subsection.id === 'project-realistic-renderings';
    const targetCount = isRealisticRenderings ? 2 : 6 + Math.floor(Math.random() * 2);

    while (grid.querySelectorAll('.project__card').length < targetCount) {
      const randomProject = pickRandomProject();
      const clonedCard = baseCard.cloneNode(true);
      const cardIndex = grid.querySelectorAll('.project__card').length + 1;

      const imageEl = clonedCard.querySelector('.project__card-img');
      const titleEl = clonedCard.querySelector('.project__card-title');
      const descriptionEl = clonedCard.querySelector('.project__card-description');
      const linkEl = clonedCard.querySelector('.project__card-link');

      if (imageEl) {
        imageEl.src = randomProject.image;
        imageEl.alt = randomProject.title;
      }
      if (titleEl) {
        titleEl.textContent = subsectionTitle + ' Project ' + cardIndex;
      }
      if (descriptionEl) {
        descriptionEl.textContent = randomProject.description;
      }
      if (linkEl) {
        linkEl.href = '#';
      }

      grid.appendChild(clonedCard);
    }

    const cards = Array.from(grid.querySelectorAll('.project__card'));
    const visibleCount = 3;
    if (cards.length > visibleCount) {
      cards.forEach((card, idx) => {
        if (idx >= visibleCount) {
          card.classList.add('project__card--hidden');
        }
      });

      let showMoreButton = subsection.querySelector('.project__show-more');
      if (!showMoreButton) {
        showMoreButton = document.createElement('button');
        showMoreButton.type = 'button';
        showMoreButton.className = 'project__show-more';
        showMoreButton.textContent = 'Show more >';
        subsection.appendChild(showMoreButton);
      }

      let isExpanded = false;
      showMoreButton.addEventListener('click', function() {
        isExpanded = !isExpanded;

        cards.forEach((card, idx) => {
          const shouldHide = !isExpanded && idx >= visibleCount;
          card.classList.toggle('project__card--hidden', shouldHide);
        });

        showMoreButton.textContent = isExpanded ? 'Show less <' : 'Show more >';
      });
    }
  });
});
