let cart;
try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
} catch (e) {
    console.error('Invalid cart data in localStorage. Resetting cart.');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
}

async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error(error);
        document.getElementById('products').innerHTML = '<p>Error fetching products!</p>';
    }
}

function renderProducts(products) {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = products
        .map(
            (product) => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${product.price}, '${product.image}')">Add to Cart</button>
        </div>
    `
        )
        .join('');
}

function addToCart(id, name, price, image) {
    console.log(`Adding to cart: ${name} (ID: ${id}, Price: ${price})`);
    const existingProduct = cart.find((item) => item.id === id);
    if (existingProduct) {
        existingProduct.quantity += 1;
        console.log(`Updated quantity: ${existingProduct.quantity}`);
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
        console.log(`New product added: ${name}`);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${name} has been added to your cart!`);
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

function loadCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartItemsContainer.innerHTML = `
        <div class="cart-list">
            ${cart
                .map(
                    (item, index) => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <p>${item.name}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
                        <button onclick="removeFromCart(${index})">Remove</button>
                    </div>
                </div>
            `
                )
                .join('')}
        </div>
        <div class="cart-total">
            <p><strong>Total: $${total.toFixed(2)}</strong></p>
        </div>
    `;
}

function removeFromCart(index) {
    const removedItem = cart[index];
    console.log(`Removing from cart: ${removedItem.name}`);
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('products')) {
        fetchProducts();
    }
    if (document.getElementById('cart-items')) {
        loadCart();
    }
    updateCartCount();
});
