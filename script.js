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
            const endereco = document.getElementById("endereco").value;

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
        
       /* const end = document.getElementById("endereco");
        end.addEventListener('input', function() {
            const valor = inputElement.value;
            alert(valor);
        })*/
        
        //document.getElementById("endereco").addEventListener("input", () => {
        //document.getElementById('endereco').innerHTML = entrega;
        const endereco = document.getElementById("endereco").value;

        if (endereco == "") {
            alert("Insira um endereço para entrega!");
            return;
        }

        let orderText = "Pedido:\n";
        cart.forEach(item => {
            orderText += `- ${item.quantity} x ${item.name} R$ ${(item.price * item.quantity).toFixed(2)}\n ${endereco}`;
        });

        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        orderText += `\nTotal: R$ ${totalPrice.toFixed(2)}`;

        const whatsappURL = `https://wa.me/5575998886000?text=${encodeURIComponent(orderText)}`;
        window.open(whatsappURL, "_blank");
    });

    function updateCart() {
        cartItemsList.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            
            const li = document.createElement("li");
            li.textContent = `${item.quantity} x ${item.name}`;

            const li2 = document.createElement("li");
            li2.textContent = ` = R$ ${(item.price * item.quantity).toFixed(2)}\n`;
            
            const li3 = document.createElement("li");
            li3.textContent = ` ••••••••••••••••••••••••••••••••••••••••••• `;

           /* const inp = document.createElement("input");
            inp.textContent = `end`;
            
            inp.addEventListener("onexit", () => {
                if (inp.length == " ") {
                    alert("Seu   vazio!");
                    return;
                }*/
            
            const decreaseButton = document.createElement("button-itemdim");
            decreaseButton.textContent = "-";
            
            decreaseButton.addEventListener("click", () => {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            });
            
            const increaseButton = document.createElement("button-itemaum");
            increaseButton.textContent = "+";
            
            const newContent = document.createTextNode(" ");
            
            increaseButton.addEventListener("click", () => {
                item.quantity++;
                updateCart();
            });
            
            decreaseButton.addEventListener("click", () => {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            });

            
            li2.appendChild(decreaseButton);
            li2.appendChild(newContent);
            li2.appendChild(increaseButton);
            //li2.appendChild(inp);

            cartItemsList.appendChild(li);
            cartItemsList.appendChild(li2);
            cartItemsList.appendChild(li3);
            //cartItemsList.appendChild(inp);

            total += item.price * item.quantity;
        });

        cartTotal.textContent = total.toFixed(2);
        cartCount.textContent = cart.length;
    }
});
