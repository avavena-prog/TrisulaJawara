let cart = [];

// Format rupiah
function formatRupiah(number) {
    return "Rp " + number.toLocaleString("id-ID");
}

// Tambah ke keranjang
function addToCart(event, productName, price) {
    const existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            qty: 1
        });
    }

    updateCart();

    // efek tombol berhasil
    const button = event.target;
    const originalText = button.innerHTML;

    button.classList.add("added");
    button.innerHTML = "✓ Berhasil Ditambahkan";

    setTimeout(() => {
        button.classList.remove("added");
        button.innerHTML = originalText;
    }, 1500);
}

// Update tampilan keranjang
function updateCart() {
    const badge = document.getElementById("cartBadge");
    const container = document.getElementById("cartItemsContainer");
    const totalAmount = document.getElementById("totalAmount");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const emptyCartMsg = document.getElementById("emptyCartMsg");

    let totalQty = 0;
    let totalPrice = 0;

    container.innerHTML = "";

    if (cart.length === 0) {
        emptyCartMsg.style.display = "block";
        checkoutBtn.disabled = true;
    } else {
        emptyCartMsg.style.display = "none";
        checkoutBtn.disabled = false;

        cart.forEach(item => {
            totalQty += item.qty;
            totalPrice += item.price * item.qty;

            const itemDiv = document.createElement("div");
            itemDiv.classList.add("cart-item");

            itemDiv.innerHTML = `
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-qty">Jumlah: ${item.qty}</div>
                </div>
                <div class="cart-item-price">
                    ${formatRupiah(item.price * item.qty)}
                </div>
            `;

            container.appendChild(itemDiv);
        });
    }

    badge.textContent = totalQty;
    totalAmount.textContent = formatRupiah(totalPrice);
}

// Buka/tutup modal keranjang
function toggleCart() {
    const modal = document.getElementById("cartModal");

    if (modal.style.display === "flex") {
        modal.style.display = "none";
    } else {
        modal.style.display = "flex";
    }
}

// Checkout ke WhatsApp
function checkoutToWhatsApp() {
    if (cart.length === 0) return;

    let message = "Halo, saya ingin memesan:%0A%0A";
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;

        message += `• ${item.name} x${item.qty} = ${formatRupiah(subtotal)}%0A`;
    });

    message += `%0ATotal Pesanan: ${formatRupiah(total)}%0A`;
    message += `%0ATerima kasih 🙏`;

    const phoneNumber = "62895341437143";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappURL, "_blank");
}

// Tutup modal kalau klik luar area
window.onclick = function(event) {
    const modal = document.getElementById("cartModal");

    if (event.target === modal) {
        modal.style.display = "none";
    }
};

// Saat halaman dibuka
updateCart();
