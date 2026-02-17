const menuBtn = document.getElementById("menu");
const list = document.getElementById("list");
const menuIcon = document.getElementById("menu-icon");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

// --- 1. PAGE LOAD (Refresh ke liye) ---
window.addEventListener('load', () => {
    const savedQuery = localStorage.getItem('lastSearch');
    
    // Check Search state
    if (localStorage.getItem('searchVisible') === 'true') {
        searchInput.style.display = 'inline-block';
        if (savedQuery) {
            searchInput.value = savedQuery;
            // Agar products wale page par hain toh filter apply karein
            if (window.location.href.includes("second.html")) {
                applyFilter(savedQuery);
            }
        }
    }

    // Check Menu state
    if (localStorage.getItem('menuOpen') === 'true') {
        list.classList.add('navlist-active');
        if(menuIcon) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-xmark');
        }
    }
});

// --- 2. MENU & X-MARK TOGGLE ---
menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = list.classList.toggle('navlist-active');
    menuIcon.classList.toggle('fa-bars');
    menuIcon.classList.toggle('fa-xmark');
    localStorage.setItem('menuOpen', isOpen);
});

// --- 3. SEARCH LOGIC ---
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.getComputedStyle(searchInput).display === "none") {
        searchInput.style.display = "inline-block";
        searchInput.focus();
        localStorage.setItem('searchVisible', 'true');
    } else {
        handleSearch();
    }
});

function handleSearch() {
    let query = searchInput.value.toLowerCase().trim();
    if (query !== "") {
        localStorage.setItem('lastSearch', query);
        // Agar aap index par hain toh second.html par bhej do
        if (!window.location.href.includes("second.html")) {
            window.location.href = "second.html";
        } else {
            applyFilter(query);
        }
    }
}

// --- 4. FILTERING FUNCTION ---
function applyFilter(query) {
    const cards = document.querySelectorAll('.product-card, .category-card');
    let found = 0;

    cards.forEach(card => {
        if (card.innerText.toLowerCase().includes(query)) {
            card.style.display = "block";
            found++;
        } else {
            card.style.display = "none";
        }
    });

    // "Not Found" message handling
    let msg = document.getElementById('not-found-msg');
    if (!msg) {
        msg = document.createElement('div');
        msg.id = 'not-found-msg';
        msg.style.cssText = "text-align:center; padding:20px; color:brown; font-weight:bold; width:100%;";
        document.querySelector('main').appendChild(msg);
    }

    if (found === 0 && query !== "") {
        msg.innerText = "Oops! No results for '" + query + "'";
        msg.style.display = "block";
    } else {
        msg.style.display = "none";
    }
}

// Enter key support
searchInput.addEventListener('keydown', (e) => {
    if (e.key === "Enter") handleSearch();
});
