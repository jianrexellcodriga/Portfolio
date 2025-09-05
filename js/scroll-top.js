document.addEventListener("DOMContentLoaded", () => {
    // Create button
    const btn = document.createElement("button");
    btn.id = "scrollTopBtn";
    btn.title = "Go to top";
    btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 4l-8 8h6v8h4v-8h6z"/>
    </svg>
  `;

    // Append button to body
    document.body.appendChild(btn);

    // Scroll detection
    window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY;
        const screenHeight = window.innerHeight;

        if (scrollPosition > screenHeight * 0.6) {
            btn.classList.add("show");
        } else {
            btn.classList.remove("show");
        }
    });

    // Scroll to top
    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
