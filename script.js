document.addEventListener("DOMContentLoaded", () => {
    const cart = [];
    const cartPopup = document.getElementById("cart-popup");
    const cartItemsList = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", (event) => {
            const product = event.target.closest(".product");
            const name = product.getAttribute("data-name");
            const price = parseFloat(product.getAttribute("data-price"));

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name, price, quantity: 1 });
            }
            updateCart();
        });
    });

    document.getElementById("open-cart").addEventListener("click", () => {
        cartPopup.style.display = "flex";
    });

    document.getElementById("close-cart").addEventListener("click", () => {
        cartPopup.style.display = "none";
    });

    document.getElementById("clear-cart").addEventListener("click", () => {
        cart.length = 0;
        updateCart();
    });

    document.getElementById("checkout").addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        let orderText = "Pedido:\n";
        cart.forEach(item => {
            orderText += `- ${item.quantity}x ${item.name} R$ ${(item.price * item.quantity).toFixed(2)}\n`;
        });

        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        orderText += `\nTotal: R$ ${totalPrice.toFixed(2)}`;

        const whatsappURL = `https://wa.me/seunumerodetelefone?text=${encodeURIComponent(orderText)}`;
        window.open(whatsappURL, "_blank");
    });

    function updateCart() {
        cartItemsList.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            const li = document.createElement("li");
            li.textContent = `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`;

            const decreaseButton = document.createElement("button");
            decreaseButton.textContent = "-";
            decreaseButton.addEventListener("click", () => {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            });

            const increaseButton = document.createElement("button");
            increaseButton.textContent = "+";
            increaseButton.addEventListener("click", () => {
                item.quantity++;
                updateCart();
            });

            li.appendChild(decreaseButton);
            li.appendChild(increaseButton);
            cartItemsList.appendChild(li);
            total += item.price * item.quantity;
        });

        cartTotal.textContent = total.toFixed(2);
        cartCount.textContent = cart.length;
    }
});
