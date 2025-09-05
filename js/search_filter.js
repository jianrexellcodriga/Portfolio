document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('project-search');
    const dropdown = document.querySelector(".custom-dropdown");
    const selected = dropdown.querySelector(".selected");
    const optionsContainer = dropdown.querySelector(".options");
    const optionsList = optionsContainer.querySelectorAll("li");
    const projectCards = document.querySelectorAll('.project-card');

    let activeFilter = 'all';

    // Function to filter projects based on search and selected filter
    function filterProjects() {
        const search = searchInput.value.toLowerCase();

        projectCards.forEach(card => {
            const title = card.querySelector('.project-title').textContent.toLowerCase();
            const description = card.querySelector('.project-description').textContent.toLowerCase();
            const skills = card.dataset.skills.toLowerCase();
            const category = card.dataset.filter;

            const matchesFilter = (activeFilter === 'all') || (category === activeFilter);
            const matchesSearch = title.includes(search) || description.includes(search) || skills.includes(search);

            card.style.display = (matchesFilter && matchesSearch) ? '' : 'none';
        });
    }

    // --- Dropdown toggle ---
    selected.addEventListener("click", () => {
        dropdown.classList.toggle("active");
    });

    // --- Dropdown option selection ---
    optionsList.forEach(option => {
        option.addEventListener("click", () => {
            // Remove active class from other options
            optionsList.forEach(opt => opt.classList.remove("active"));

            // Set selected
            option.classList.add("active");
            selected.textContent = option.textContent;
            activeFilter = option.dataset.value;

            // Close dropdown
            dropdown.classList.remove("active");

            // Trigger project filtering
            filterProjects();
        });
    });

    // --- Live search input ---
    searchInput.addEventListener('input', filterProjects);

    // --- Close dropdown if clicked outside ---
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
});
