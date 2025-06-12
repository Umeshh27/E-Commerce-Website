const products = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 199.99,
        image: "./images/product1_headphones.jpg",
        category: "Electronics"
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        price: 299.99,
        image: "./images/product2_fitness_watch.jpg",
        category: "Electronics"
    },
    {
        id: 3,
        name: "Designer Sunglasses",
        price: 149.99,
        image: "./images/product3_sunglasses.png",
        category: "Fashion"
    },
    {
        id: 4,
        name: "Leather Backpack",
        price: 89.99,
        image: "./images/product4_leather_backpack.jpg",
        category: "Fashion"
    },
    {
        id: 5,
        name: "Coffee Maker Pro",
        price: 179.99,
        image: "./images/product5_coffee_maker.jpg",
        category: "Home & Garden"
    },
    {
        id: 6,
        name: "Yoga Mat Premium",
        price: 49.99,
        image: "./images/product6_yoga_mat.jpg",
        category: "Sports"
    },
    {
        id: 7,
        name: "Gaming Laptop X1",
        price: 1299.99,
        image: "./images/product7_gaming_laptop.jpg",
        category: "Electronics"
    },
    {
        id: 8,
        name: "Wireless Gaming Mouse",
        price: 59.99,
        image: "./images/product8_gaming_mouse.jpg",
        category: "Electronics"
    },
    {
        id: 9,
        name: "Classic Denim Jacket",
        price: 79.99,
        image: "./images/product9_denim_jacket.jpg",
        category: "Fashion"
    },
    {
        id: 10,
        name: "Stylish Leather Boots",
        price: 119.99,
        image: "./images/product10_leather_boots.jpeg",
        category: "Fashion"
    },
    {
        id: 11,
        name: "Smart Home Speaker",
        price: 99.99,
        image: "./images/product11_smart_speaker.jpg",
        category: "Home & Garden"
    },
    {
        id: 12,
        name: "Ergonomic Office Chair",
        price: 249.99,
        image: "./images/product12_office_chair.jpg",
        category: "Home & Garden"
    },
    {
        id: 13,
        name: "Dumbbell Set 20kg",
        price: 129.99,
        image: "./images/product13_dumbbell_set.jpg",
        category: "Sports"
    },
    {
        id: 14,
        name: "Running Shoes Pro",
        price: 89.99,
        image: "./images/product14_running_shoes.jpg",
        category: "Sports"
    },
    {
        id: 15,
        name: "Organic Green Tea",
        price: 15.99,
        image: "./images/product15_green_tea.jpg",
        category: "Groceries"
    },
    {
        id: 16,
        name: "Fresh Apples (1kg)",
        price: 4.99,
        image: "./images/product16_fresh_apples.jpg",
        category: "Groceries"
    }
];

let cart = [];

const productGrid = document.getElementById("productGrid");
const cartIcon = document.getElementById("cartIcon");
const cartCount = document.getElementById("cartCount");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

document.addEventListener("DOMContentLoaded", function() {
    renderProducts();
    updateCartUI();
    setupEventListeners();
    addSmoothScrolling();
});

function renderProducts() {
    productGrid.innerHTML = "";
    
    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.innerHTML = `
            <div class="product-image" style="background-image: url('${product.image}')"></div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        `;
        
        productCard.style.opacity = "0";
        productCard.style.transform = "translateY(30px)";
        productGrid.appendChild(productCard);
        
        setTimeout(() => {
            productCard.style.transition = "all 0.6s ease";
            productCard.style.opacity = "1";
            productCard.style.transform = "translateY(0)";
        }, 100 * products.indexOf(product));
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    showAddToCartAnimation();
    
    showNotification("Product added to cart!", "success");
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    renderCartItems();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            renderCartItems();
        }
    }
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (totalItems > 0) {
        cartCount.style.display = "flex";
        cartCount.classList.add("cart-updated");
        setTimeout(() => cartCount.classList.remove("cart-updated"), 300);
    } else {
        cartCount.style.display = "none";
    }
}

function showAddToCartAnimation() {
    cartIcon.style.transform = "scale(1.2)";
    cartIcon.style.color = "#ffd700";
    
    setTimeout(() => {
        cartIcon.style.transform = "scale(1)";
        cartIcon.style.color = "";
    }, 300);
}

function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #999;">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotal.textContent = "0.00";
        return;
    }
    
    cartItems.innerHTML = "";
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="background: #ff4757; color: white;">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2);
}

function setupEventListeners() {
    cartIcon.addEventListener("click", () => {
        cartModal.style.display = "block";
        renderCartItems();
        document.body.style.overflow = "hidden";
    });
    
    closeCart.addEventListener("click", () => {
        cartModal.style.display = "none";
        document.body.style.overflow = "auto";
    });
    
    cartModal.addEventListener("click", (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });
    
    const searchInput = document.querySelector(".search-input");
    const searchBtn = document.querySelector(".search-btn");
    
    searchBtn.addEventListener("click", performSearch);
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            performSearch();
        }
    });
    
    const categoryCards = document.querySelectorAll(".category-card");
    categoryCards.forEach(card => {
        card.addEventListener("click", () => {
            const category = card.querySelector("h3").textContent;
            filterProductsByCategory(category);
        });
    });
    
    const ctaBtn = document.querySelector(".cta-btn");
    ctaBtn.addEventListener("click", () => {
        document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
    });
    
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("checkout-btn")) {
            if (cart.length === 0) {
                showNotification("Your cart is empty!", "warning");
                return;
            }
            window.location.href = "checkout.html";
        }
    });
}

function performSearch() {
    const searchTerm = document.querySelector(".search-input").value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    renderFilteredProducts(filteredProducts);
    
    if (filteredProducts.length === 0) {
        showNotification("No products found matching your search.", "info");
    }
}

function filterProductsByCategory(category) {
    let filteredProducts;
    
    if (category === "Electronics") {
        filteredProducts = products.filter(p => p.category === "Electronics");
    } else if (category === "Fashion") {
        filteredProducts = products.filter(p => p.category === "Fashion");
    } else if (category === "Home & Garden") {
        filteredProducts = products.filter(p => p.category === "Home & Garden");
    } else if (category === "Sports") {
        filteredProducts = products.filter(p => p.category === "Sports");
    } else if (category === "Groceries") {
        filteredProducts = products.filter(p => p.category === "Groceries");
    } else {
        filteredProducts = products;
    }
    
    renderFilteredProducts(filteredProducts);
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
}

function renderFilteredProducts(filteredProducts) {
    productGrid.innerHTML = "";
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <p style="font-size: 1.2rem; color: #999;">No products found in this category.</p>
                <button onclick="renderProducts()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">Show All Products</button>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.innerHTML = `
            <div class="product-image" style="background-image: url('${product.image}')"></div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        `;
        
        productCard.style.opacity = "0";
        productCard.style.transform = "translateY(30px)";
        productGrid.appendChild(productCard);
        
        setTimeout(() => {
            productCard.style.transition = "all 0.6s ease";
            productCard.style.opacity = "1";
            productCard.style.transform = "translateY(0)";
        }, 100 * filteredProducts.indexOf(product));
    });
}

function handleCheckout() {
    if (cart.length === 0) {
        showNotification("Your cart is empty!", "warning");
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showNotification(`Thank you for your purchase! Total: $${total.toFixed(2)}`, "success");
    
    cart = [];
    updateCartUI();
    renderCartItems();
    
    cartModal.style.display = "none";
    document.body.style.overflow = "auto";
}

function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === "success" ? "check-circle" : type === "warning" ? "exclamation-triangle" : "info-circle"}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === "success" ? "#28a745" : type === "warning" ? "#ffc107" : "#17a2b8"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = "translateX(0)";
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = "translateX(100%)";
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function addSmoothScrolling() {
    const navLinks = document.querySelectorAll(".nav-link");
    
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            
            // Check if the href is an anchor link (starts with #)
            if (href.startsWith("#")) {
                e.preventDefault();
                const targetId = href;
                const targetEl = document.querySelector(targetId);
                
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: "smooth" });
                }
            }
            // For non-anchor links (e.g., about.html, contact.html, login.html), allow default navigation
        });
    });
}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("checkout-btn")) {
        if (cart.length === 0) {
            showNotification("Your cart is empty!", "warning");
            return;
        }
        window.location.href = "checkout.html";
    }
});

document.querySelector(".search-btn").addEventListener("click", performSearch);

document.querySelector(".search-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        performSearch();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".navbar a");
    navLinks.forEach(link => {
        const textContent = link.textContent.trim();
        if (textContent === "Home") {
            link.href = "index.html";
        } else if (textContent === "Shop") {
            link.href = "index.html#shop";
        } else if (textContent === "About") {
            link.href = "about.html";
        } else if (textContent === "Contact") {
            link.href = "contact.html";
        } else if (textContent === "Login") {
            link.href = "login.html";
        }
    });
});