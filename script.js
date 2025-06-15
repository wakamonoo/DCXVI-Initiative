document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  loader.classList.add("opacity-0", "transition-opacity", "duration-700");
  setTimeout(() => loader.remove(), 700); // remove after fade-out
});
