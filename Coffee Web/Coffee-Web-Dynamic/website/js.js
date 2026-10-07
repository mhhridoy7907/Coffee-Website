
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
    getDatabase,
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const firebaseConfig = {
    apiKey: "**************************",
    authDomain: "************************",
    databaseURL: "************************",
    projectId: "************************",
    storageBucket: "************************",
    messagingSenderId: "************************",
    appId: "************************"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const carousel = document.getElementById("carousel");
const milkshakesContainer = document.getElementById("milkshakes-container");
const blogsContainer = document.getElementById("blogs-container");
const orderContainer = document.getElementById("order-container");

let carouselData = {};
let shakesData = {};
let blogsData = {};
let ordersData = {};

let rotY = 0;
let draggingCarousel = false;
let startX = 0;

function enableDragScroll(selector) {
    const slider = document.querySelector(selector);

    if (!slider) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    slider.addEventListener("mousedown", e => {
        isDown = true;
        slider.classList.add("active");
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("mouseleave", () => {
        isDown = false;
        slider.classList.remove("active");
    });

    slider.addEventListener("mouseup", () => {
        isDown = false;
        slider.classList.remove("active");
    });

    slider.addEventListener("mousemove", e => {
        if (!isDown) return;

        e.preventDefault();

        const x = e.pageX - slider.offsetLeft;
        slider.scrollLeft = scrollLeft - (x - startX) * 2;
    });
}

function createElement(tag, className, text = "") {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text) {
        element.textContent = text;
    }

    return element;
}

function renderCarousel(data) {
    carousel.innerHTML = "";

    const items = Object.values(data || {});

    if (!items.length) {
        carousel.innerHTML = `<div class="empty">No categories available.</div>`;
        return;
    }

    items.forEach((item, index) => {
        const panel = createElement("div", "panel");

        const image = document.createElement("img");
        image.src = item.image || "";
        image.alt = item.title || "Coffee";

        panel.appendChild(image);

        const angle = index * (360 / items.length);

        panel.style.transform = `rotateY(${angle}deg) translateZ(400px)`;

        carousel.appendChild(panel);
    });

    updatePanels();
}

function renderShakes(data) {
    milkshakesContainer.innerHTML = "";

    const items = Object.entries(data || {});

    if (!items.length) {
        milkshakesContainer.innerHTML = `<div class="empty">No shakes available.</div>`;
        return;
    }

    items.forEach(([id, item]) => {
        const card = createElement("div", "milkshake-card");

        card.dataset.id = id;
        card.dataset.type = "shake";
        card.dataset.search = `${item.name || ""} ${item.description || ""}`.toLowerCase();

        const image = document.createElement("img");
        image.src = item.image || "";
        image.alt = item.name || "Milkshake";

        const title = createElement("h3", "", item.name || "Unnamed Shake");

        const price = createElement(
            "p",
            "",
            `Price: ${item.price !== undefined ? item.price : "N/A"}`
        );

        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(price);

        milkshakesContainer.appendChild(card);
    });

    enableDragScroll(".milkshakes-container");
}

function renderBlogs(data) {
    blogsContainer.innerHTML = "";

    const items = Object.entries(data || {});

    if (!items.length) {
        blogsContainer.innerHTML = `<div class="empty">No blogs available.</div>`;
        return;
    }

    items.forEach(([id, item]) => {
        const card = createElement("div", "blog-card");

        card.dataset.id = id;
        card.dataset.type = "blog";
        card.dataset.search = `${item.title || ""} ${item.description || ""}`.toLowerCase();

        const image = document.createElement("img");
        image.src = item.image || "";
        image.alt = item.title || "Blog";

        const title = createElement("h3", "", item.title || "Untitled Blog");

        card.appendChild(image);
        card.appendChild(title);

        blogsContainer.appendChild(card);
    });

    enableDragScroll(".blogs-container");
}

function renderOrders(data) {
    orderContainer.innerHTML = "";

    const items = Object.entries(data || {});

    if (!items.length) {
        orderContainer.innerHTML = `<div class="empty">No products available.</div>`;
        return;
    }

    items.forEach(([id, item]) => {
        const card = createElement("div", "order-card");

        card.dataset.id = id;
        card.dataset.type = "order";
        card.dataset.search = `${item.name || ""} ${item.description || ""}`.toLowerCase();

        const image = document.createElement("img");
        image.src = item.image || "";
        image.alt = item.name || "Product";

        const title = createElement("h3", "", item.name || "Unnamed Product");

        const price = createElement(
            "p",
            "",
            `Price: ${item.price !== undefined ? item.price : "N/A"}`
        );

        const button = createElement("button", "order-btn", "Order Now");

        button.dataset.id = id;

        button.addEventListener("click", () => {
            const productName = item.name || "Product";
            alert(`Order request received for ${productName}`);
        });

        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(price);
        card.appendChild(button);

        orderContainer.appendChild(card);
    });

    enableDragScroll(".order-container");
}

function updatePanels() {
    const panels = carousel.querySelectorAll(".panel");
    const totalPanels = panels.length;

    if (!totalPanels) return;

    panels.forEach((panel, index) => {
        let angle = (index * (360 / totalPanels) + rotY) % 360;

        if (angle < 0) {
            angle += 360;
        }

        const delta = Math.min(angle, 360 - angle);
        const blurFactor = Math.min(delta / 60, 1);

        panel.style.filter = `brightness(${1 - 0.88 * blurFactor})`;
    });
}

function animateCarousel() {
    if (!draggingCarousel && carousel.children.length) {
        rotY += 0.25;
        carousel.style.transform = `rotateY(${rotY}deg)`;
        updatePanels();
    }

    requestAnimationFrame(animateCarousel);
}

carousel.addEventListener("mousedown", e => {
    draggingCarousel = true;
    startX = e.clientX;
    carousel.style.cursor = "grabbing";
});

document.addEventListener("mouseup", () => {
    draggingCarousel = false;
    carousel.style.cursor = "grab";
});

document.addEventListener("mousemove", e => {
    if (!draggingCarousel) return;

    const movement = e.clientX - startX;

    rotY += movement * 0.4;

    carousel.style.transform = `rotateY(${rotY}deg)`;

    startX = e.clientX;

    updatePanels();
});

document.querySelectorAll(".scroll-btn").forEach(button => {
    button.addEventListener("click", () => {
        const container = document.querySelector(button.dataset.target);

        if (!container) return;

        const amount = 250;

        container.scrollBy({
            left: button.dataset.dir === "left" ? -amount : amount,
            behavior: "smooth"
        });
    });
});

document.querySelectorAll(".navbar li").forEach(item => {
    item.addEventListener("click", () => {
        const target = document.getElementById(item.dataset.section);

        if (target) {
            
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

const searchInput = document.getElementById("search-input");
const notFound = document.getElementById("not-found");

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    const cards = document.querySelectorAll(
        ".milkshake-card, .blog-card, .order-card"
    );

    let found = false;

    cards.forEach(card => {
        const text = card.dataset.search || "";

        if (!query || text.includes(query)) {
            card.style.display = "";
            found = true;
        } else {
            card.style.display = "none";
        }
    });

    notFound.style.display = query && !found ? "block" : "none";
});

const modal = document.getElementById("img-modal");
const modalImg = document.getElementById("modal-img");
const copyrightImg = document.getElementById("copyright-img");
const closeBtn = modal.querySelector(".close");

copyrightImg.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = copyrightImg.src;
});

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

modal.addEventListener("click", e => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

onValue(ref(db, "carousel"), snapshot => {
    carouselData = snapshot.val() || {};
    renderCarousel(carouselData);
});

onValue(ref(db, "shakes"), snapshot => {
    shakesData = snapshot.val() || {};
    renderShakes(shakesData);
});

onValue(ref(db, "blogs"), snapshot => {
    blogsData = snapshot.val() || {};
    renderBlogs(blogsData);
});

onValue(ref(db, "orders"), snapshot => {
    ordersData = snapshot.val() || {};
    renderOrders(ordersData);
});

enableDragScroll(".milkshakes-container");
enableDragScroll(".blogs-container");
enableDragScroll(".order-container");

animateCarousel();
