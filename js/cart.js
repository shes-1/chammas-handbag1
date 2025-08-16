const cartCounter = document.getElementById('cart-counter');
const cartDropdown = document.getElementById('cart-dropdown');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutClose = document.getElementById('checkout-close');
const paymentOptions = document.querySelectorAll('.payment-option');
const cardForm = document.getElementById('card-form');
const payCardBtn = document.getElementById('pay-card');

let cart = {};

// Add to Cart
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.product-card');
        const name = card.dataset.name;
        const img = card.querySelector('img').src;
        const price = parseFloat(card.querySelector('p').textContent.replace('$', ''));

        if (cart[name]) cart[name].quantity += 1;
        else cart[name] = { quantity: 1, img, price };

        updateCartDisplay();
        cartDropdown.style.display = 'block'; // Keep cart open
        alert(`Added "${name}" to cart!`);
    });
});

// Update Cart Display
function updateCartDisplay() {
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = `🛒 ${totalItems}`;
    cartDropdown.innerHTML = '';

    if (totalItems === 0) {
        cartDropdown.innerHTML = '<p style="text-align:center">Cart is empty</p>';
        return;
    }

    let totalPrice = 0;
    for (const [name, item] of Object.entries(cart)) {
        totalPrice += item.price * item.quantity;

        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'space-between';
        div.style.marginBottom = '8px';

        const thumb = document.createElement('img');
        thumb.src = item.img;
        thumb.style.width = '40px';
        thumb.style.height = '40px';
        thumb.style.objectFit = 'cover';
        thumb.style.borderRadius = '5px';
        thumb.style.marginRight = '10px';

        const info = document.createElement('span');
        info.style.flex = '1';
        info.textContent = `${name} - $${(item.price * item.quantity).toFixed(2)}`;

        // Quantity controls
        const qtyControls = document.createElement('div');
        qtyControls.style.display = 'flex';
        qtyControls.style.alignItems = 'center';
        qtyControls.style.gap = '5px';

        const minusBtn = document.createElement('button');
        minusBtn.textContent = '−';
        minusBtn.style.cursor = 'pointer';
        minusBtn.addEventListener('click', () => {
            if (cart[name].quantity > 1) {
                cart[name].quantity -= 1;
            } else {
                delete cart[name];
            }
            updateCartDisplay();
            cartDropdown.style.display = 'block'; // keep open
        });

        const qtyDisplay = document.createElement('span');
        qtyDisplay.textContent = item.quantity;

        const plusBtn = document.createElement('button');
        plusBtn.textContent = '+';
        plusBtn.style.cursor = 'pointer';
        plusBtn.addEventListener('click', () => {
            cart[name].quantity += 1;
            updateCartDisplay();
            cartDropdown.style.display = 'block'; // keep open
        });

        qtyControls.appendChild(minusBtn);
        qtyControls.appendChild(qtyDisplay);
        qtyControls.appendChild(plusBtn);

        // Delete button
        const removeBtn = document.createElement('span');
        removeBtn.textContent = '🗑️';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.marginLeft = '10px';
        removeBtn.addEventListener('click', () => {
            delete cart[name];
            updateCartDisplay();
            cartDropdown.style.display = 'block'; // keep open
        });

        div.appendChild(thumb);
        div.appendChild(info);
        div.appendChild(qtyControls);
        div.appendChild(removeBtn);
        cartDropdown.appendChild(div);
    }

    // Total Price
    const totalDiv = document.createElement('div');
    totalDiv.style.textAlign = 'center';
    totalDiv.style.fontWeight = 'bold';
    totalDiv.style.marginTop = '10px';
    totalDiv.textContent = `Total: $${totalPrice.toFixed(2)}`;
    cartDropdown.appendChild(totalDiv);

    // Checkout Button
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('btn-container');
    btnContainer.style.marginTop = '10px';
    const checkoutBtn = document.createElement('button');
    checkoutBtn.textContent = "Checkout / Pay";
    checkoutBtn.classList.add('checkout');
    checkoutBtn.addEventListener('click', () => checkoutModal.style.display = 'block');

    btnContainer.appendChild(checkoutBtn);
    cartDropdown.appendChild(btnContainer);
}

// Toggle Cart
cartCounter.addEventListener('click', () => {
    cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';
});

// Close cart if clicked outside
document.addEventListener('click', e => {
    if (!document.getElementById('cart-container').contains(e.target) && !checkoutModal.contains(e.target)) {
        cartDropdown.style.display = 'none';
    }
});

// Checkout modal
checkoutClose.addEventListener('click', () => {
    checkoutModal.style.display = 'none';
    cardForm.style.display = 'none';
});

paymentOptions.forEach(opt => {
    opt.addEventListener('click', () => {
        if (opt.dataset.method === 'paypal') {
            window.open('https://www.paypal.com/paypalme/YOURUSERNAME', '_blank');
        } else cardForm.style.display = 'block';
    });
});

payCardBtn.addEventListener('click', e => {
    e.preventDefault();
    alert("Payment processed successfully!");
    checkoutModal.style.display = 'none';
    cardForm.style.display = 'none';
    cart = {};
    updateCartDisplay();
});

// Initialize
updateCartDisplay();
