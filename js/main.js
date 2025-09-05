// main.js

document.addEventListener('DOMContentLoaded', () => {
    // // Set initial theme based on user preference or default light
    // const darkModeToggle = document.getElementById('dark-mode-toggle');
    // const html = document.documentElement;

    // const savedTheme = localStorage.getItem('theme');
    // if (savedTheme === 'dark') {
    //     html.setAttribute('data-theme', 'dark');
    //     darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    // } else {
    //     html.removeAttribute('data-theme');
    //     darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    // }

    // // Toggle Dark Mode
    // darkModeToggle.addEventListener('click', () => {
    //     if (html.getAttribute('data-theme') === 'dark') {
    //         html.removeAttribute('data-theme');
    //         darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    //         localStorage.setItem('theme', 'light');
    //     } else {
    //         html.setAttribute('data-theme', 'dark');
    //         darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    //         localStorage.setItem('theme', 'dark');
    //     }
    // });

    // Glassmorphism navbar effect on scroll
    const navHeader = document.getElementById('nav-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navHeader.classList.add('scrolled');
        } else {
            navHeader.classList.remove('scrolled');
        }
    });

    // Animated typing effect for Hero
    const texts = ["Programmer", "UI Designer"];
    const animatedText = document.getElementById('animated-text');

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 150;
    const deletingSpeed = 80;
    const pauseBetween = 2000;

    function type() {
        const current = texts[textIndex];
        if (!isDeleting) {
            // Add characters
            animatedText.textContent = current.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === current.length) {
                // Pause before deleting
                setTimeout(() => {
                    isDeleting = true;
                    type();
                }, pauseBetween);
                return;
            }
        } else {
            // Delete characters
            animatedText.textContent = current.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
        }
        setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
    }
    type();

    // "View Projects" button scrolls to featured projects section
    const viewProjectsBtn = document.getElementById('view-projects-btn');
    viewProjectsBtn.addEventListener('click', () => {
        document.getElementById('featured-projects').scrollIntoView({ behavior: 'smooth' });
    });
});

document.querySelectorAll(".project-image").forEach(div => {
    const style = div.style.backgroundImage;
    const match = style.match(/url\(["']?(.*?)["']?\)/);

    if (match && match[1]) {
        const img = new Image();
        img.src = match[1];
        img.onload = () => {
            div.querySelector(".fallback-text").style.display = "none";
        };
        img.onerror = () => {
            div.querySelector(".fallback-text").style.display = "block";
        };
    } else {
        div.querySelector(".fallback-text").style.display = "block";
    }
});

document.querySelectorAll('.project-description').forEach(desc => {
    const fullText = desc.textContent.trim();
    const maxLength = 155;

    if (fullText.length > maxLength) {
        // Find the last space before the cutoff
        let cutoffIndex = fullText.lastIndexOf(" ", maxLength);
        if (cutoffIndex === -1) cutoffIndex = maxLength; // fallback if no space found

        const visibleText = fullText.slice(0, cutoffIndex) + "...";
        const moreText = fullText.slice(cutoffIndex);

        // Set initial state
        desc.innerHTML = `
          <span class="visible-text">${visibleText}</span>
          <span class="more-text" style="display:none;">${moreText}</span>
          <button class="read-more-btn">Read more</button>
        `;

        const btn = desc.querySelector('.read-more-btn');
        const more = desc.querySelector('.more-text');
        const visible = desc.querySelector('.visible-text');

        btn.addEventListener('click', () => {
            const expanded = more.style.display === "inline";

            if (expanded) {
                // Collapse
                more.style.display = "none";
                visible.textContent = visibleText;
                btn.textContent = "Read more";
            } else {
                // Expand
                more.style.display = "inline";
                visible.textContent = fullText.slice(0, cutoffIndex);
                btn.textContent = "Read less";
            }
        });
    }
});





