document.addEventListener("DOMContentLoaded", () => {
    // Example feature: Category Filter
    const categoryButtons = document.querySelectorAll(".category-button");
    const categories = document.querySelectorAll(".category");

    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;
            categories.forEach(category => {
                if (filter === "all" || category.dataset.category === filter) {
                    category.style.display = "block";
                } else {
                    category.style.display = "none";
                }
            });
        });
    });

    // Example feature: Smooth Scroll to Top
    const scrollTopButton = document.getElementById("scroll-top");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 200) {
            scrollTopButton.style.display = "block";
        } else {
            scrollTopButton.style.display = "none";
        }
    });

    scrollTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Add event listeners for additional features if needed
});
