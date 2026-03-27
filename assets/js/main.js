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
  const serviceCards = document.querySelectorAll('.service__card');

  serviceCards.forEach((card) => {
    const cardLink = card.querySelector('.service__link');
    if (!cardLink) {
      return;
    }

    const href = cardLink.getAttribute('href');
    if (!href) {
      return;
    }

    card.setAttribute('role', 'link');
    card.setAttribute('tabindex', '0');

    const navigateToTarget = () => {
      if (!href.startsWith('#')) {
        window.location.href = href;
        return;
      }

      const targetEl = document.querySelector(href);
      if (!targetEl) {
        return;
      }

      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    card.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        return;
      }
      navigateToTarget();
    });

    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }
      event.preventDefault();
      navigateToTarget();
    });
  });

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

    const lazyMediaObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            const media = entry.target;
            if (media.tagName === 'VIDEO') {
              const sources = media.querySelectorAll('source[data-src]');
              if (sources.length) {
                sources.forEach((source) => {
                  source.setAttribute('src', source.dataset.src);
                  source.removeAttribute('data-src');
                });
                media.load();
              }
              media.dataset.mediaLoaded = 'true';
            }

            observer.unobserve(media);
          });
        }, {
          rootMargin: '300px 0px',
          threshold: 0.01,
        })
      : null;

    function observeProjectMedia(mediaEl) {
      if (!mediaEl) {
        return;
      }

      if (!lazyMediaObserver) {
        if (mediaEl.tagName === 'VIDEO') {
          const sources = mediaEl.querySelectorAll('source[data-src]');
          if (sources.length) {
            sources.forEach((source) => {
              source.setAttribute('src', source.dataset.src);
              source.removeAttribute('data-src');
            });
            mediaEl.load();
          }
          mediaEl.dataset.mediaLoaded = 'true';
        }
        return;
      }

      lazyMediaObserver.observe(mediaEl);
    }

    function ensureVideoLoaded(video) {
      if (video.dataset.mediaLoaded === 'true') {
        return;
      }

      const sources = video.querySelectorAll('source[data-src]');
      if (sources.length) {
        sources.forEach((source) => {
          source.setAttribute('src', source.dataset.src);
          source.removeAttribute('data-src');
        });
        video.load();
      }

      video.dataset.mediaLoaded = 'true';
    }

    function prepareProjectCardMedia(scope = document) {
      const cardImages = scope.querySelectorAll('.project__card img.project__card-img');
      cardImages.forEach((imageEl) => {
        imageEl.loading = 'lazy';
        imageEl.decoding = 'async';
        imageEl.fetchPriority = 'low';
      });

      const cardVideos = scope.querySelectorAll('.project__card video[data-hover-play]');
      cardVideos.forEach((videoEl) => {
        videoEl.muted = true;
        videoEl.preload = 'none';

        const sources = videoEl.querySelectorAll('source');
        sources.forEach((sourceEl) => {
          if (!sourceEl.dataset.src) {
            const currentSrc = sourceEl.getAttribute('src');
            if (currentSrc) {
              sourceEl.dataset.src = currentSrc;
              sourceEl.removeAttribute('src');
            }
          }
        });

        observeProjectMedia(videoEl);
      });
    }

    const videoExistenceCache = new Map();

    function getCandidateVideoPathFromImage(imagePath) {
      if (!imagePath || !/^assets\/projects\//i.test(imagePath)) {
        return null;
      }

      if (!/\.jpg$/i.test(imagePath)) {
        return null;
      }

      return imagePath.replace(/\.jpg$/i, '.mp4');
    }

    async function checkVideoExists(videoPath) {
      if (videoExistenceCache.has(videoPath)) {
        return videoExistenceCache.get(videoPath);
      }

      let exists = false;
      try {
        const response = await fetch(videoPath, { method: 'HEAD' });
        exists = response.ok;
      } catch (error) {
        exists = false;
      }

      videoExistenceCache.set(videoPath, exists);
      return exists;
    }

    async function attachAutoHoverVideos(scope = document) {
      const cards = Array.from(scope.querySelectorAll('.project__card'));

      for (const card of cards) {
        if (card.dataset.autoVideoChecked === 'true') {
          continue;
        }

        if (card.dataset.disableVideo === 'true') {
          card.dataset.autoVideoChecked = 'true';
          continue;
        }

        card.dataset.autoVideoChecked = 'true';

        const wrapper = card.querySelector('.project__image-wrapper');
        if (!wrapper) {
          continue;
        }

        const imageEl = wrapper.querySelector('img.project__card-img');
        const existingVideo = wrapper.querySelector('video[data-hover-play]');
        if (!imageEl || existingVideo) {
          continue;
        }

        const imagePath = imageEl.getAttribute('src') || '';
        const candidateVideoPath = getCandidateVideoPathFromImage(imagePath);
        if (!candidateVideoPath) {
          continue;
        }

        const hasVideo = await checkVideoExists(candidateVideoPath);
        if (!hasVideo) {
          continue;
        }

        imageEl.classList.add('project__card-thumbnail');

        const videoEl = document.createElement('video');
        videoEl.className = 'project__card-img project__card-video';
        videoEl.setAttribute('muted', '');
        videoEl.setAttribute('playsinline', '');
        videoEl.setAttribute('preload', 'metadata');
        videoEl.setAttribute('data-hover-play', '');

        const sourceEl = document.createElement('source');
        sourceEl.setAttribute('src', candidateVideoPath);
        sourceEl.setAttribute('type', 'video/mp4');
        videoEl.appendChild(sourceEl);

        wrapper.appendChild(videoEl);
      }
    }

    function initProjectShowMore(scope = document) {
      const visibleCount = 3;
      const subsections = scope.classList && scope.classList.contains('project__subsection')
        ? [scope]
        : Array.from(scope.querySelectorAll('.project__subsection'));

      subsections.forEach((subsection) => {
        if (subsection.dataset.showMoreReady === 'true') {
          return;
        }

        const cards = Array.from(subsection.querySelectorAll('.project__grid .project__card'));
        if (cards.length <= visibleCount) {
          subsection.dataset.showMoreReady = 'true';
          return;
        }

        cards.forEach((card, idx) => {
          card.classList.toggle('project__card--hidden', idx >= visibleCount);
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
        showMoreButton.addEventListener('click', () => {
          isExpanded = !isExpanded;
          cards.forEach((card, idx) => {
            card.classList.toggle('project__card--hidden', !isExpanded && idx >= visibleCount);
          });
          showMoreButton.textContent = isExpanded ? 'Show less <' : 'Show more >';
        });

        subsection.dataset.showMoreReady = 'true';
      });
    }

    function initProjectVideoHover(scope = document) {
      const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const scopedVideos = Array.from(scope.querySelectorAll('.project__card video[data-hover-play]'));

      const disableBrokenVideo = (video, card) => {
        const thumbnail = card.querySelector('img.project__card-thumbnail');
        if (thumbnail) {
          thumbnail.classList.remove('project__card-thumbnail');
        }
        card.classList.remove('is-video-active');
        video.remove();
      };

      const stopVideo = (video, card) => {
        video.pause();
        video.currentTime = 0;
        card.classList.remove('is-video-active');
      };

      const stopOtherVideos = (activeVideo) => {
        document.querySelectorAll('.project__card video[data-hover-play]').forEach((videoEl) => {
          if (videoEl === activeVideo) {
            return;
          }

          const otherCard = videoEl.closest('.project__card');
          if (!otherCard) {
            return;
          }

          stopVideo(videoEl, otherCard);
        });
      };

      scopedVideos.forEach((video) => {
        if (video.dataset.hoverReady === 'true') {
          return;
        }

        video.muted = true;

        const card = video.closest('.project__card');
        if (!card) {
          return;
        }

        video.addEventListener('error', () => {
          disableBrokenVideo(video, card);
        }, { once: true });

        const videoSource = video.querySelector('source');
        if (videoSource) {
          videoSource.addEventListener('error', () => {
            disableBrokenVideo(video, card);
          }, { once: true });
        }

        const startVideo = () => {
          stopOtherVideos(video);
          ensureVideoLoaded(video);
          video.currentTime = 0;
          card.classList.add('is-video-active');

          const playPromise = video.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
              video.addEventListener('canplay', () => {
                video.play().catch(() => {});
              }, { once: true });
            });
          }
        };

        if (canHover) {
          card.addEventListener('mouseenter', () => {
            startVideo();
          });

          card.addEventListener('mouseleave', () => {
            stopVideo(video, card);
          });
        } else {
          const handleTapStart = (event) => {
            if (event.target.closest('a, button')) {
              return;
            }

            event.preventDefault();

            if (card.classList.contains('is-video-active') && !video.paused) {
              stopVideo(video, card);
              return;
            }

            startVideo();
          };

          let pointerHandled = false;

          card.addEventListener('pointerdown', (event) => {
            if (event.pointerType === 'mouse') {
              return;
            }

            pointerHandled = true;
            handleTapStart(event);
          });

          card.addEventListener('click', (event) => {
            if (pointerHandled) {
              pointerHandled = false;
              return;
            }

            handleTapStart(event);
          });
        }

        video.dataset.hoverReady = 'true';
      });
    }

    const projectSubsections = document.querySelectorAll('.project__subsection');
    const subsectionObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            const subsection = entry.target;
            subsection.classList.remove('project__subsection--deferred');
            subsection.classList.add('project__subsection--active');

            attachAutoHoverVideos(subsection)
              .finally(() => {
                prepareProjectCardMedia(subsection);
                initProjectShowMore(subsection);
                initProjectVideoHover(subsection);
              });

            observer.unobserve(subsection);
          });
        }, {
          rootMargin: '240px 0px',
          threshold: 0.05,
        })
      : null;

    projectSubsections.forEach((subsection) => {
      subsection.classList.add('project__subsection--deferred');
      if (subsectionObserver) {
        subsectionObserver.observe(subsection);
      } else {
        subsection.classList.remove('project__subsection--deferred');
        subsection.classList.add('project__subsection--active');
        attachAutoHoverVideos(subsection)
          .finally(() => {
            prepareProjectCardMedia(subsection);
            initProjectShowMore(subsection);
            initProjectVideoHover(subsection);
          });
      }
    });
});
