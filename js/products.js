document.addEventListener('DOMContentLoaded', () => {

    const searchInput = document.querySelector('.nav-right input');
    const products = document.querySelectorAll('.product-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const contactModal = document.getElementById('contact-modal');
    const contactClose = document.getElementById('contact-close');
    const contactSubmit = document.getElementById('contact-submit');

    let activeFilter = "all";

    // ---------------- Search & Filter ----------------
    function updateProducts() {
        const query = searchInput.value.toLowerCase().trim();
        let anyVisible = false;

        products.forEach(product => {
            const name = product.dataset.name.toLowerCase();
            const category = product.dataset.category.toLowerCase();
            const matchesSearch = name.includes(query) || category.includes(query);
            const matchesFilter = activeFilter === "all" || category === activeFilter;

            if (matchesSearch && matchesFilter) {
                product.style.display = "block";
                anyVisible = true;
            } else {
                product.style.display = "none";
            }
        });

        const msg = document.querySelector('.no-products');
        if (!anyVisible) {
            if (!msg) {
                const p = document.createElement('p');
                p.textContent = "No products found.";
                p.classList.add('no-products');
                document.querySelector('.product-grid').appendChild(p);
            }
        } else if (msg) msg.remove();
    }

    searchInput.addEventListener('keyup', updateProducts);

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            activeFilter = button.textContent.toLowerCase();
            updateProducts();
            filterButtons.forEach(btn => btn.classList.remove('active-filter'));
            button.classList.add('active-filter');
        });
    });

    // ---------------- Inquiry Modal ----------------
    document.querySelectorAll('.inquiry-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productCard = btn.closest('.product-card');
            const name = productCard.dataset.name;
            const price = productCard.querySelector('p').textContent;
            document.getElementById('contact-message').value = `I am interested in: ${name} - ${price}`;
            contactModal.style.display = 'block';
        });
    });

    contactClose.addEventListener('click', () => contactModal.style.display = 'none');
    window.addEventListener('click', e => {
        if (e.target === contactModal) contactModal.style.display = 'none';
    });

    contactSubmit.addEventListener('click', () => {
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;
        if (!name || !email || !message) {
            alert("⚠️ Please fill all fields.");
            return;
        }
        alert("✅ Inquiry sent successfully!");
        contactModal.style.display = 'none';
    });

});
