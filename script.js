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
            const dinheiro = document.getElementById("dinheiro").value;
            const pix = document.getElementById("pix").value;
            const cartao= document.getElementById("cartao").value;

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name, price, quantity: 1 });
            }
            updateCart();
        });
    });

    document.getElementById("open-cart").addEventListener("click", () => {
        if (cart.length === 0) {
            document.getElementById("vazio").innerHTML = "Carrinho Vazio";
            document.getElementById("top").style.visibility = "visible";
            cartPopup.style.display = "flex";
            if (document.getElementById('top').style.visibility == "visible") {
                document.getElementById("top").style = "display:none";
            }           
        }
        else {
            document.getElementById("vazio").innerHTML = "Carrinho";
            document.getElementById("top").style = "display:none";
            cartPopup.style.display = "flex";
        }
    });

    document.getElementById("close-cart").addEventListener("click", () => {
        cartPopup.style.display = "none";
        document.getElementById("top").style = "display:visible";
    });

    document.getElementById("clear-cart").addEventListener("click", () => {
        cart.length = 0;
        document.getElementById("vazio").innerHTML = "Carrinho Vazio";
        updateCart();
    });

    let tp = " "; // Variável para tipo de pagamento a ser exibido no WhatsApp

    document.getElementById("checkout").addEventListener("click", () => {

        if (document.getElementById("dinheiro").checked) {
            alert("Pagamento selecionado:\n" + "= (" + document.getElementById("dinheiro").value + ")");
            tp = "DINHEIRO";
        }
        else if (document.getElementById("pix").checked) {
            alert("Pagamento selecionado:\n" + "= (" + document.getElementById("pix").value + ")");
            tp = "PIX";
        }
        else if (document.getElementById("cartao").checked) {
            alert("Pagamento selecionado:\n" + "= (" + document.getElementById("cartao").value + ")");
            tp = "CARTÃO";
        }

        else if (document.getElementById("dinheiro").checked == false
            && document.getElementById("pix").checked == false 
            && document.getElementById("cartao").checked == false) {
            alert('Selecione uma forma de pagamento!');
            return;
         }          
        
        if (cart.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }
        
        const endereco = document.getElementById("endereco").value;

        if (endereco == "") {
            alert("Insira um endereço para entrega!");
            return;
        }

        let orderText = "PEDIDO:\n";
        cart.forEach(item => {
            orderText += `\n- ${item.quantity} x ${item.name} R$ ${(item.price * item.quantity).toFixed(2)}\n`;
        });

        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        orderText += `\nTOTAL: R$ ${totalPrice.toFixed(2)}\n`;

        orderText += `\nFORMA DE PAGAMENTO: = ${tp}\n`;
        
        orderText += `\nENDEREÇO DE ENTREGA: ${endereco}`;

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
         
            const decreaseButton = document.createElement("button-itemdim");
            decreaseButton.textContent = "-";
            
            decreaseButton.addEventListener("click", () => {
                if (item.quantity > 0) {
                    item.quantity = item.quantity --;
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

            cartItemsList.appendChild(li);
            cartItemsList.appendChild(li2);
            cartItemsList.appendChild(li3);
            
            total += item.price * item.quantity;
        });

        cartTotal.textContent = total.toFixed(2);
        cartCount.textContent = cart.length;
    }
});
