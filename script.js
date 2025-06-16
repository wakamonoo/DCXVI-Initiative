document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');

  // Loader Logic
  // Delay before starting fade-out (e.g., 1000ms)
  setTimeout(() => {
    loader.classList.add("opacity-0", "transition-opacity", "duration-700");

    // Remove loader after fade-out duration (700ms)
    setTimeout(() => loader.remove(), 700);
  }, 1000); // delay before fade-out


  // Watched Card Functionality
  const movieCards = document.querySelectorAll('.movie-card');

  // Define the Tailwind classes for the "watched" state
  const watchedClasses = ['opacity-50', 'grayscale'];

  // Store original background classes to correctly restore them.
  // IMPORTANT: Ensure these match the initial bg classes in your HTML exactly.
  const originalBackgroundClasses = {
    'bg-slate-900': true,
    'bg-amber-900': true,
    'bg-indigo-900': true,
    // Add any other specific original background colors you use for movie cards here
  };


  // Function to load watched movies from localStorage
  const loadWatchedMovies = () => {
    const watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || {};

    movieCards.forEach(card => {
      const movieId = card.dataset.movieId;
      if (watchedMovies[movieId]) {
        // Apply watched classes
        card.classList.add(...watchedClasses);

        // Remove original backgrounds and add bg-gray-700
        for (const originalClass in originalBackgroundClasses) {
          if (card.classList.contains(originalClass)) {
            card.classList.remove(originalClass);
          }
        }
        card.classList.add('bg-gray-700'); // Consistent gray for watched
      }
    });
  };

  // Function to save watched movies to localStorage and update card appearance
  const saveWatchedMovies = (movieId, isWatched, cardElement) => {
    const watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || {};

    if (isWatched) {
      watchedMovies[movieId] = true;
      cardElement.classList.add(...watchedClasses);

      // Store the original background class *before* changing it for easier restoration
      // This is the most reliable way to handle varying original backgrounds
      let currentOriginalBg = null;
      for (const originalClass in originalBackgroundClasses) {
          if (cardElement.classList.contains(originalClass)) {
              currentOriginalBg = originalClass;
              break;
          }
      }
      if (currentOriginalBg) {
          cardElement.dataset.originalBgClass = currentOriginalBg; // Store it as a data attribute
          cardElement.classList.remove(currentOriginalBg);
      }
      cardElement.classList.add('bg-gray-700');

    } else { // Unmarking as watched
      delete watchedMovies[movieId];
      cardElement.classList.remove(...watchedClasses);
      cardElement.classList.remove('bg-gray-700'); // Remove gray background

      // Restore original background using the stored data attribute
      if (cardElement.dataset.originalBgClass) {
          cardElement.classList.add(cardElement.dataset.originalBgClass);
      } else {
          // Fallback if data-original-bg-class wasn't set (shouldn't happen if logic is solid)
          // You might choose to set a default background here or log a warning.
          console.warn(`No original background class found for ${movieId} to restore.`);
      }
    }
    localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
  };

  // Add click event listener to each movie card
  movieCards.forEach(card => {
    // Attach event listener
    card.addEventListener('click', () => {
      const movieId = card.dataset.movieId;
      // Check if the card currently has one of the 'watchedClasses' (e.g., 'grayscale')
      const isCurrentlyWatched = card.classList.contains('grayscale');
      // The new state will be the opposite of the current state
      saveWatchedMovies(movieId, !isCurrentlyWatched, card);
    });
  });

  // Load watched movies when the page loads (after loader is handled)
  loadWatchedMovies();
});