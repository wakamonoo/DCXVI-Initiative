document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add("opacity-0", "transition-opacity", "duration-700");
    setTimeout(() => loader.remove(), 700);
  }, 1000);

  const movieCards = document.querySelectorAll('.movie-card');
  const watchedClasses = ['opacity-50', 'grayscale'];

  // Map of original background color classes used in movie cards
  const originalBackgroundClasses = {
    'bg-slate-900': true,
    'bg-amber-900': true,
    'bg-indigo-900': true,
  };

  // Loads watched movies from localStorage and updates card appearance accordingly
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

  // Saves watched/unwatched state to localStorage and toggles card visual state
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
  };

  // Attaches click listeners to cards to toggle watched state when clicked
  movieCards.forEach(card => {
    card.addEventListener('click', () => {
      const movieId = card.dataset.movieId;
      const isCurrentlyWatched = card.classList.contains('grayscale');
      saveWatchedMovies(movieId, !isCurrentlyWatched, card);
    });
  });

  // Initializes watched states after loader fade-out
  loadWatchedMovies();
});
