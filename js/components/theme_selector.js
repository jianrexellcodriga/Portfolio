class TTheme extends HTMLElement {
    connectedCallback() {
        const type = this.getAttribute("mode") || "navbar";
        const html = document.documentElement;

        // --- Apply system theme dynamically ---
        const applySystemTheme = () => {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) html.setAttribute("data-theme", "dark");
            else html.removeAttribute("data-theme");
        };

        // --- Load saved theme or default to auto ---
        let savedTheme = localStorage.getItem("theme") || "auto";
        let mq; // keep reference to system listener

        const applyTheme = (mode) => {
            // clean up old listener
            if (mq) mq.removeEventListener("change", applySystemTheme);

            if (mode === "light") {
                html.setAttribute("data-theme", "light");
            } else if (mode === "dark") {
                html.setAttribute("data-theme", "dark");
            } else {
                // auto mode: listen for system changes again
                mq = window.matchMedia("(prefers-color-scheme: dark)");
                mq.addEventListener("change", applySystemTheme);
                applySystemTheme();
            }
        };

        // Initial apply
        applyTheme(savedTheme);

        // --- Broadcast theme changes globally ---
        const broadcastThemeChange = (mode) => {
            localStorage.setItem("theme", mode); // syncs across tabs
            window.dispatchEvent(new CustomEvent("theme-change", { detail: mode }));
        };

        if (type === "sidebar") {
            // Sidebar layout
            this.innerHTML = `
                <div class="theme-buttons">
                    <button class="mode-btn" data-mode="light" aria-label="Light mode">
                        <i class="fas fa-sun"></i>
                    </button>
                    <button class="mode-btn" data-mode="auto" aria-label="System mode">
                        <i class="fas fa-desktop"></i>
                    </button>
                    <button class="mode-btn" data-mode="dark" aria-label="Dark mode">
                        <i class="fas fa-moon"></i>
                    </button>
                </div>
            `;

            const buttons = this.querySelectorAll(".mode-btn");

            const updateActive = () => {
                buttons.forEach((btn) =>
                    btn.classList.toggle("active", btn.dataset.mode === savedTheme)
                );
            };
            updateActive();

            buttons.forEach((btn) => {
                btn.addEventListener("click", () => {
                    const mode = btn.dataset.mode;
                    savedTheme = mode;
                    applyTheme(mode);
                    broadcastThemeChange(mode);
                    updateActive();
                });
            });
        } else {
            // Navbar dropdown layout
            const getIconClass = (theme) =>
                theme === "dark" ? "fa-moon" :
                    theme === "auto" ? "fa-desktop" : "fa-sun";

            this.innerHTML = `
                <li class="dark-mode-toggle" id="dark-mode-toggle" role="button" tabindex="0">
                    <i class="fas ${getIconClass(savedTheme)}"></i>
                </li>
                <ul class="dropdown-theme">
                    <li data-mode="light"><i class="fas fa-sun"></i> Light</li>
                    <li data-mode="auto"><i class="fas fa-desktop"></i> System</li>
                    <li data-mode="dark"><i class="fas fa-moon"></i> Dark</li>
                </ul>
            `;

            const toggleBtn = this.querySelector("#dark-mode-toggle");
            const dropdown = this.querySelector(".dropdown-theme");
            const dropdownItems = dropdown.querySelectorAll("li");

            const updateDropdownActive = () => {
                dropdownItems.forEach((item) =>
                    item.classList.toggle("active", item.dataset.mode === savedTheme)
                );
                toggleBtn.querySelector("i").className = `fas ${getIconClass(savedTheme)}`;
            };
            updateDropdownActive();

            toggleBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const isOpen = dropdown.style.display === "block";
                dropdown.style.display = isOpen ? "none" : "block";
                toggleBtn.classList.toggle("active", !isOpen);
            });

            dropdownItems.forEach((item) => {
                item.addEventListener("click", () => {
                    const mode = item.dataset.mode;
                    savedTheme = mode;
                    applyTheme(mode);
                    broadcastThemeChange(mode);
                    dropdown.style.display = "none";
                    toggleBtn.classList.remove("active");
                    updateDropdownActive();
                });
            });

            document.addEventListener("click", (e) => {
                if (!this.contains(e.target)) {
                    dropdown.style.display = "none";
                    toggleBtn.classList.remove("active");
                }
            });
        }

        // --- Update UI when theme changes in same tab ---
        window.addEventListener("theme-change", (e) => {
            savedTheme = e.detail;
            applyTheme(savedTheme);

            if (type === "sidebar") {
                const buttons = this.querySelectorAll(".mode-btn");
                buttons.forEach((btn) =>
                    btn.classList.toggle("active", btn.dataset.mode === savedTheme)
                );
            } else {
                const toggleBtn = this.querySelector("#dark-mode-toggle");
                const dropdownItems = this.querySelectorAll(".dropdown-theme li");
                dropdownItems.forEach((item) =>
                    item.classList.toggle("active", item.dataset.mode === savedTheme)
                );
                toggleBtn.querySelector("i").className =
                    `fas ${savedTheme === "dark" ? "fa-moon" : savedTheme === "auto" ? "fa-desktop" : "fa-sun"}`;
            }
        });

        // --- Sync across tabs/windows ---
        window.addEventListener("storage", (e) => {
            if (e.key === "theme" && e.newValue) {
                const mode = e.newValue;
                savedTheme = mode;
                applyTheme(mode); // 🔥 ensures "auto" attaches system listener too
                window.dispatchEvent(new CustomEvent("theme-change", { detail: mode }));
            }
        });
    }
}

customElements.define("t-theme", TTheme);
