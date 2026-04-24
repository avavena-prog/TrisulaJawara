// === CART SYSTEM ===
let cart = [];

// Tambah ke keranjang
function addToCart(event, name, price, quantity = 1) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ name, price, quantity });
    }

    // Animasi sukses
    const btn = event.target;
    const originalText = btn.innerHTML;

    btn.innerHTML = "✅ Ditambahkan!";
    btn.classList.add("added");

    // efek getar kecil
    btn.style.transform = "scale(1.2)";
    setTimeout(() => {
        btn.style.transform = "scale(1)";
    }, 200);

    // Update UI
    updateCartDisplay();

    // Reset button
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove("added");
    }, 2000);

    // Notifikasi mini
    showNotification(`${quantity}x ${name} ditambahkan!`, "success");
}

// Update tampilan keranjang
function updateCartDisplay() {
    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const totalPrice = cart.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
    );

    // Update counter
    document.getElementById("cartBadge").textContent = totalItems;

    document.getElementById("cartCounter").style.background =
        totalItems > 0
            ? "linear-gradient(135deg, #22c55e, #16a34a)"
            : "linear-gradient(135deg, #dc2626, #ef4444)";

    // Update modal
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const emptyMsg = document.getElementById("emptyCartMsg");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const totalAmount = document.getElementById("totalAmount");

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "";
        emptyMsg.style.display = "block";
        checkoutBtn.disabled = true;
        totalAmount.textContent = "Rp 0";
        return;
    }

    emptyMsg.style.display = "none";
    checkoutBtn.disabled = false;

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-qty">
                    ${item.quantity}x @ Rp ${formatRupiah(item.price)}
                </div>
            </div>
            <div class="cart-item-price">
                Rp ${formatRupiah(item.price * item.quantity)}
            </div>
        </div>
    `).join("");

    totalAmount.textContent = `Rp ${formatRupiah(totalPrice)}`;
}

// Format Rupiah
function formatRupiah(angka) {
    return angka.toString().replace(
        /\B(?=(\d{3})+(?!\d))/g,
        "."
    );
}

// Toggle cart modal
function toggleCart() {
    const modal = document.getElementById("cartModal");

    modal.style.display =
        modal.style.display === "flex"
            ? "none"
            : "flex";

    if (modal.style.display === "flex") {
        updateCartDisplay();
    }
}

// Checkout ke WhatsApp
function checkoutToWhatsApp() {
    if (cart.length === 0) return;

    const totalPrice = cart.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
    );

    const itemsText = cart.map(item =>
        `${item.quantity}x ${item.name} (Rp ${formatRupiah(item.price * item.quantity)})`
    ).join("\n");

    const message =
`Halo! 📱 Saya mau pesan:

${itemsText}

*Total: Rp ${formatRupiah(totalPrice)}*

Alamat pengiriman: [isi alamat]
Catatan: [opsional]

Terima kasih! 🙏`;

    // WA harus pakai kode negara, bukan 08
    const phone = "62895341437143";

    const whatsappUrl =
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // Animasi checkout
    const checkoutBtn = document.getElementById("checkoutBtn");

    checkoutBtn.innerHTML = "🚀 Mengalihkan...";
    checkoutBtn.disabled = true;

    setTimeout(() => {
        window.open(whatsappUrl, "_blank");

        showNotification(
            "✅ Pesanan terkirim ke WhatsApp!",
            "success"
        );

        cart = [];
        updateCartDisplay();
        toggleCart();

        checkoutBtn.innerHTML =
            "🚀 Checkout & Kirim ke WhatsApp";
        checkoutBtn.disabled = false;
    }, 1000);
}

// Notifikasi mini
function showNotification(message, type = "info") {
    const notification = document.createElement("div");

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${
            type === "success"
                ? "#22c55e"
                : "#dc2626"
        };
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 16px 40px rgba(0,0,0,0.2);
        z-index: 3000;
        font-weight: 600;
        transform: translateX(400px);
        transition: all 0.4s ease;
        max-width: 350px;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Animasi masuk
    requestAnimationFrame(() => {
        notification.style.transform =
            "translateX(0)";
    });

    // Hilang otomatis
    setTimeout(() => {
        notification.style.transform =
            "translateX(400px)";

        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 3000);
}

// Event listeners
document.addEventListener("click", (e) => {
    if (
        !e.target.closest(".cart-modal") &&
        !e.target.closest(".cart-counter")
    ) {
        const modal =
            document.getElementById("cartModal");

        if (modal.style.display === "flex") {
            toggleCart();
        }
    }
});

// Escape key close modal
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        const modal =
            document.getElementById("cartModal");

        if (modal.style.display === "flex") {
            toggleCart();
        }
    }
});

// Smooth scroll reveal
document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState =
                        "running";
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll(".product-card")
        .forEach(card => {
            card.style.animationPlayState =
                "paused";
            observer.observe(card);
        });
});

// Page load animation
window.addEventListener("load", () => {
    document.body.style.opacity = "0";
    document.body.style.transition =
        "opacity 0.6s ease";

    setTimeout(() => {
        document.body.style.opacity = "1";
    }, 200);
});
