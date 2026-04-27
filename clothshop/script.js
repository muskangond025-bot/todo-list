// Intezar karein jab tak DOM puri tarah load na ho jaye
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Navbar Scroll Effect
    const nav = document.getElementById("main-nav");
    
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }
    });

    // 2. Mobile Menu Toggle Logic
    const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");

    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        menuBtn.classList.toggle("open");
    });

    // 3. Close menu when link is clicked
    document.querySelectorAll("#nav-links a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuBtn.classList.remove("open");
        });
    });

    // 4. Initialize AOS (Animations)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 120,
        });
    }

    // 5. Add to Cart Button Alert (Optional)
    const cartButtons = document.querySelectorAll(".order-btn");
    cartButtons.forEach(button => {
        button.addEventListener("click", () => {
            alert("Item added to cart! 🍔");
        });
    });
});
