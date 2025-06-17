document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');

  //──────────────── Loader fade-out after 1s delay
  setTimeout(() => {
    loader.classList.add("opacity-0", "transition-opacity", "duration-700");
    setTimeout(() => loader.remove(), 700);
  }, 1000);

  const movieCards = document.querySelectorAll('.movie-card');
  const watchedClasses = ['opacity-50', 'grayscale'];

  //──────────────── Background classes used for original cards
  const originalBackgroundClasses = {
    'bg-slate-900': true,
    'bg-amber-900': true,
    'bg-indigo-900': true,
  };

  //──────────────── Phase configuration with movie IDs
  const phaseConfig = {
    phase1: {
      ids: [
        'captain-america-first-avenger',
        'agent-carter-one-shot',
        'agent-carter-series',
        'captain-marvel',
        'iron-man',
        'iron-man-2',
        'the-incredible-hulk',
        'the-consultant-one-shot',
        'funny-thing-thor-hammer',
        'thor',
        'the-avengers',
        'item-47-one-shot'
      ]
    },
    phase2: {
      ids: [
        'iron-man-3',
        'thor-the-dark-world',
        'all-hail-the-king-one-shot',
        'captain-america-winter-soldier',
        'guardians-of-the-galaxy-1',
        'daredevil-season-1',
        'i-am-groot-season-1',
        'i-am-groot-season-2',
        'guardians-of-the-galaxy-2',
        'avengers-age-of-ultron',
        'ant-man',
        'jessica-jones-season-1'
      ]
    },
    phase3: {
      ids: [
        'daredevil-season-2',
        'captain-america-civil-war',
        'black-widow',
        'black-panther',
        'luke-cage-season-1',
        'iron-fist-season-1',
        'doctor-strange',
        'the-defenders',
        'spider-man-homecoming',
        'the-punisher-season-1',
        'jessica-jones-season-2',
        'luke-cage-season-2',
        'thor-ragnarok',
        'iron-fist-season-2',
        'daredevil-season-3',
        'the-punisher-season-2',
        'jessica-jones-season-3',
        'ant-man-and-the-wasp',
        'avengers-infinity-war',
        'avengers-endgame'
      ]
    },
    phase4: {
      ids: [
        'loki-season-1',
        'wandavision',
        'what-if-season-1',
        'what-if-season-2',
        'falcon-winter-soldier',
        'shang-chi',
        'eternals',
        'spider-man-no-way-home',
        'hawkeye',
        'moon-knight',
        'ms-marvel',
        'she-hulk',
        'thor-love-and-thunder',
        'werewolf-by-night',
        'guardians-holiday-special',
        'black-panther-wakanda-forever'
      ]
    },
    phase5: {
      ids: [
        'ant-man-quantumania',
        'secret-invasion',
        'guardians-of-the-galaxy-vol-3',
        'loki-season-2',
        'echo',
        'agatha-all-along',
        'daredevil-born-again',
        'ironheart',
        'captain-america-brave-new-world',
        'thunderbolts',
        'blade',
        'what-if-season-3'
      ]
    }
  };

  //──────────────── Load watched movies from localStorage and update styles
  const loadWatchedMovies = () => {
    const watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || {};

    movieCards.forEach(card => {
      const movieId = card.dataset.movieId;
      if (watchedMovies[movieId]) {
        card.classList.add(...watchedClasses);
        for (const originalClass in originalBackgroundClasses) {
          if (card.classList.contains(originalClass)) {
            card.classList.remove(originalClass);
          }
        }
        card.classList.add('bg-gray-700');
      }
    });
  };

  //──────────────── Save watched/unwatched state and update card appearance
  const saveWatchedMovies = (movieId, isWatched, cardElement) => {
    const watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || {};

    if (isWatched) {
      watchedMovies[movieId] = true;
      cardElement.classList.add(...watchedClasses);

      let currentOriginalBg = null;
      for (const originalClass in originalBackgroundClasses) {
        if (cardElement.classList.contains(originalClass)) {
          currentOriginalBg = originalClass;
          break;
        }
      }
      if (currentOriginalBg) {
        cardElement.dataset.originalBgClass = currentOriginalBg;
        cardElement.classList.remove(currentOriginalBg);
      }
      cardElement.classList.add('bg-gray-700');
    } else {
      delete watchedMovies[movieId];
      cardElement.classList.remove(...watchedClasses);
      cardElement.classList.remove('bg-gray-700');

      if (cardElement.dataset.originalBgClass) {
        cardElement.classList.add(cardElement.dataset.originalBgClass);
      } else {
        console.warn(`No original background class found for ${movieId} to restore.`);
      }
    }

    localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
    updatePhaseProgress();
  };

  //──────────────── Update phase progress bars based on watched movies
  const updatePhaseProgress = () => {
    const watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || {};

    for (let phase in phaseConfig) {
      const phaseIds = phaseConfig[phase].ids;
      const watchedCount = phaseIds.filter(id => watchedMovies[id]).length;
      const total = phaseIds.length;
      const percentage = Math.round((watchedCount / total) * 100);

      const progressElement = document.getElementById(`${phase}-progress`);
      const barElement = document.getElementById(`${phase}-bar`);

      if (progressElement && barElement) {
        progressElement.textContent = `${percentage}%`;
        barElement.style.width = `${percentage}%`;

        //──────────────── Update bar color based on completion percentage
        barElement.classList.remove('bg-red-500', 'bg-yellow-500', 'bg-green-500');
        if (percentage < 30) {
          barElement.classList.add('bg-red-500');
        } else if (percentage < 70) {
          barElement.classList.add('bg-yellow-500');
        } else {
          barElement.classList.add('bg-green-500');
        }
      }
    }
  };

  //──────────────── Toggle watched state on card click
  movieCards.forEach(card => {
    card.addEventListener('click', () => {
      const movieId = card.dataset.movieId;
      const isCurrentlyWatched = card.classList.contains('grayscale');
      saveWatchedMovies(movieId, !isCurrentlyWatched, card);
    });
  });

  //──────────────── Initialize card states and progress on page load
  loadWatchedMovies();
  updatePhaseProgress();
});