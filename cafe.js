document.addEventListener('DOMContentLoaded', () => {
    const menuItems = [];
    const orderItems = [];

    // Function to add a menu item
    function addMenuItem(id, name, price, image, stockStatus, stockQuantity) {
        menuItems.push({ id, name, price, image, stockStatus, stockQuantity });
    }

    // Function to update the menu display
    function updateMenu() {
        const container = document.getElementById('menu-items-container');
        container.innerHTML = '';

        menuItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('menu-item');

            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)}</p>
                <p class="stock-status ${item.stockStatus === 'In Stock' ? 'in-stock' : 'out-of-stock'}">${item.stockStatus}</p>
                <button class="add-to-order-btn" ${item.stockStatus === 'Out of Stock' ? 'disabled' : ''}>Add to Order</button>
            `;

            const addToOrderBtn = itemElement.querySelector('.add-to-order-btn');
            addToOrderBtn.addEventListener('click', () => addToOrder(item));

            container.appendChild(itemElement);
        });
    }

    // Function to add an item to the order
    function addToOrder(item) {
        const existingItem = orderItems.find(orderItem => orderItem.id === item.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            orderItems.push({ ...item, quantity: 1 });
        }

        updateOrder();
    }

    // Function to update the order display
    function updateOrder() {
        const container = document.getElementById('order-items-container');
        container.innerHTML = '';

        let totalPrice = 0;

        orderItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('order-item');

            itemElement.innerHTML = `
                <h4>${item.name}</h4>
                <div class="quantity-controls">
                    <button class="decrease-qty-btn">-</button>
                    <input type="text" value="${item.quantity}" readonly>
                    <button class="increase-qty-btn">+</button>
                </div>
                <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
            `;

            const decreaseBtn = itemElement.querySelector('.decrease-qty-btn');
            const increaseBtn = itemElement.querySelector('.increase-qty-btn');

            decreaseBtn.addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    orderItems.splice(orderItems.indexOf(item), 1);
                }
                updateOrder();
            });

            increaseBtn.addEventListener('click', () => {
                item.quantity++;
                updateOrder();
            });

            container.appendChild(itemElement);
            totalPrice += item.price * item.quantity;
        });

        document.getElementById('total-price').textContent = totalPrice.toFixed(2);
        
        // Update place order button state
        const placeOrderBtn = document.getElementById('place-order-btn');
        placeOrderBtn.disabled = orderItems.length === 0;
    }

    // Function to show a section
    function showSection(sectionId) {
        document.querySelectorAll('main section').forEach(section => {
            section.classList.remove('section-active');
            section.classList.add('section-hidden');
        });
        document.getElementById(sectionId).classList.remove('section-hidden');
        document.getElementById(sectionId).classList.add('section-active');
    }

    // Event listener for place order button
    document.getElementById('place-order-btn').addEventListener('click', () => {
        if (orderItems.length > 0) {
            alert('Thank you for your order! Total: $' + document.getElementById('total-price').textContent);
            orderItems.length = 0;
            updateOrder();
        } else {
            alert('Please add items to your order before placing it.');
        }
    });

    // Event listener for clear order button
    document.getElementById('clear-order-btn').addEventListener('click', () => {
        orderItems.length = 0;
        updateOrder();
    });

    // Add some sample menu items
    addMenuItem(1, 'Croissant', 9999.99, 'images/croissant.jpg', 'In Stock', 10);
    addMenuItem(2, 'Macaron', 7000.00, 'images/macaron.jpg', 'In Stock', 5);
    addMenuItem(3, 'Éclair', 0.01, 'images/eclair.jpg', 'Out of Stock', 0);

    // Falling leaves animation
    function createLeaf() {
        const leaf = document.createElement('div');
        leaf.classList.add('leaf');
        leaf.style.backgroundImage = 'url(images/leaf.png)';
        leaf.style.left = Math.random() * 100 + 'vw';
        leaf.style.animationDuration = Math.random() * 5 + 5 + 's';
        leaf.style.animationDelay = Math.random() * 5 + 's';
        leaf.style.opacity = Math.random() * 0.5 + 0.5;

        document.getElementById('falling-leaves').appendChild(leaf);

        setTimeout(() => {
            leaf.remove();
        }, parseFloat(leaf.style.animationDuration) * 1000 + parseFloat(leaf.style.animationDelay) * 1000);
    }

    // Create leaves at regular intervals
    setInterval(createLeaf, 300);

    // Initialize the menu section as active
    showSection('menu');

    // Add event listeners to navigation buttons
    document.querySelectorAll('nav button').forEach(button => {
        button.addEventListener('click', (event) => {
            const sectionId = event.target.getAttribute('onclick').match(/'(\w+)'/)[1];
            showSection(sectionId);
        });
    });

    // Initialize the menu display
    updateMenu();

    // Initialize the order display
    updateOrder();
});
