document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");

  // Delay before starting fade-out (e.g., 1000ms)
  setTimeout(() => {
    loader.classList.add("opacity-0", "transition-opacity", "duration-700");

    // Remove loader after fade-out duration (700ms)
    setTimeout(() => loader.remove(), 700);
  }, 1000); // delay before fade-out
});
