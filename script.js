document.addEventListener("DOMContentLoaded", () => {
    const cart = [];
    const cartPopup = document.getElementById("cart-popup");
    const cartItemsList = document.getElementById("cart-items");
    const cartTotal = document.getElementById("total");
    const cartCount = document.getElementById("cart-count");

    document.getElementById("troco").style.visibility = 'hidden';
    document.getElementById("limptroco").style.visibility = 'hidden';
    document.getElementById("lbtroco").style.visibility = 'hidden';

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", (event) => {
            const product = event.target.closest(".product");
            const name = product.getAttribute("data-name");
            const price = parseFloat(product.getAttribute("data-price").toLocaleString('fr-FR'));
            const existingItem = cart.find(item => item.name === name);
            const endereco = document.getElementById("endereco").value;
            const dinheiro = document.getElementById("dinheiro").value;
            const pix = document.getElementById("pix").value;
            const cartao = document.getElementById("cartao").value;

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name, price, quantity: 1 });
                document.getElementById("vazio").innerHTML = "Carrinho";
            }
            updateCart();
        });
    });

    document.getElementById("open-cart").addEventListener("click", () => {
        if (cart.length === 0) {
            document.getElementById("vazio").innerHTML = "Carrinho Vazio";
            document.getElementById("top").style.visibility = "visible";
            cartPopup.style.display = "flex";
            //document.getElementById("troco").style = "display:none";

            if (document.getElementById('top').style.visibility == "visible") {
                document.getElementById("top").style = "display:none";
            }           
        }
        else {
            document.getElementById("vazio").innerHTML = "Carrinho";
            document.getElementById("top").style = "display:none";
            cartPopup.style.display = "flex";
            //document.getElementById("troco").style = "display:none";

        }
    });

    document.getElementById("close-cart").addEventListener("click", () => {
        cartPopup.style.display = "none";
        document.getElementById("top").style = "display:visible";
    });

    document.getElementById("clear-cart").addEventListener("click", () => {
        cart.length = 0;
        document.getElementById("dinheiro").checked = false;
        document.getElementById("pix").checked = false;
        document.getElementById("cartao").checked = false;
        document.getElementById("vazio").innerHTML = "Carrinho Vazio";
        document.getElementById("troco").style = "display:none";
        updateCart();
    });

    document.getElementById("limp-end").addEventListener("click", () => {
        document.getElementById("endereco").value = '';
        document.getElementById("endereco").placeholder = 'Endereço para entrega...';
    });
    
    //botão limpar troco
    document.getElementById("limptroco").addEventListener("click", () => {
        document.getElementById("troco").value = '';
        document.getElementById("troco").placeholder = 'Troco para...';
        document.getElementById("lbtroco").innerHTML = 'Troco R$ 0.00';
    });

    let tp = " "; // Variável para tipo de pagamento a ser exibido no WhatsApp
    
    //Fechando e finalizando pedido e enviando pelo WhatsApp
    document.getElementById("checkout").addEventListener("click", () => {

        if (cart.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

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
                
        const endereco = document.getElementById("endereco").value;

        if (endereco == "") {
            alert("Insira um endereço para entrega!");
            return;
        }

        let orderText = "PEDIDO:\n";
        cart.forEach(item => {
            orderText += `\n- ${item.quantity} --> ${item.name} X ${(item.price.toLocaleString('br-BR'))} = R$ ${(item.price * item.quantity).toFixed(2)}\n`;
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
            li.textContent = `${item.quantity} --> ${item.name}`;

            const li2 = document.createElement("li");
            li2.textContent = `x ${item.price.toLocaleString('br-BR')} = R$ ${(item.price * item.quantity).toFixed(2)}\n`;
            
            const li3 = document.createElement("li");
            li3.textContent = ` ••••••••••••••••••••••••••••••••••••••••••• `;
            
            
         
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
            
            const newContent1 = document.createTextNode(" ");
            
            const increaseButton = document.createElement("button-itemaum");
            increaseButton.textContent = "+";
            
            increaseButton.addEventListener("click", () => {
                item.quantity++;
                updateCart();
            });
            
            const newContent2 = document.createTextNode(" ");
            
            const deleteButton = document.createElement("button-itemdelete");
            deleteButton.textContent = "x";
            
            deleteButton.addEventListener("click", () => {
                //item.quantity++;
                cart.splice(index, 1);
                updateCart();
            });

            
            li2.appendChild(decreaseButton);
            li2.appendChild(newContent1);
            li2.appendChild(increaseButton);
            li2.appendChild(newContent2);
            li2.appendChild(deleteButton);
            

            cartItemsList.appendChild(li);
            cartItemsList.appendChild(li2);
            cartItemsList.appendChild(li3);
            
            total += item.price * item.quantity;
        });

        cartTotal.textContent = total.toFixed(2);
        cartCount.textContent = cart.length;

        if (cartCount.textContent !== '0') {
            document.getElementById("vazio").innerHTML = "Carrinho";
        }else {
            document.getElementById("vazio").innerHTML = "Carrinho vazio";
        }
        
    }
    
      document.getElementById("dinheiro").onclick = function() {ckdinheiro()};

        function ckdinheiro() {
            if (document.getElementById("dinheiro").checked == true 
                && document.getElementById("pix").checked == false
                && document.getElementById("cartao").checked == false) {

                if (document.getElementById("troco").style.visibility === 'hidden') {
                    document.getElementById("troco").style.visibility = 'visible';
                    document.getElementById("limptroco").style.visibility = 'visible';
                    document.getElementById("lbtroco").style.visibility = 'visible'; 
                    document.getElementById("troco").value = '';                                                            
                }
            }    
        }

        document.getElementById("pix").onclick = function() {ckpix()};

        function ckpix() {
            if (document.getElementById("pix").checked == true 
                && document.getElementById("dinheiro").checked == false
                && document.getElementById("cartao").checked == false) {

                    document.getElementById("troco").style.visibility = 'hidden';
                    document.getElementById("limptroco").style.visibility = 'hidden';
                    document.getElementById("lbtroco").style.visibility = 'hidden';
                    document.getElementById("troco").value = '';                                                            
            }    
        }

        document.getElementById("cartao").onclick = function() {ckcartao()};

        function ckcartao() {
            if (document.getElementById("cartao").checked == true 
                && document.getElementById("dinheiro").checked == false
                && document.getElementById("pix").checked == false) {

                    document.getElementById("troco").style.visibility = 'hidden';
                    document.getElementById("limptroco").style.visibility = 'hidden';
                    document.getElementById("lbtroco").style.visibility = 'hidden';
                    document.getElementById("troco").value = '';                                                                                
            }    
        }

       /* document.getElementById("troco").onkeydown = function() {myFunction()};
        function myFunction() {
           /* var v1 = parseFloat(document.getElementById('lbltroco').value);
            var v2 = parseFloat(document.getElementById('troco').value);    
            var v3 = parseFloat(document.getElementById('total').value);
            var tot = '';*/
    
            //alert("You pressed a key inside the input field");
            /*tot = v2 - v3;
            v1 = tot;*/
            /*let trok = (document.getElementById("troco").value) - (parseFloat(document.getElementById("total").innerHTML))
            document.getElementById("lbtroco").innerHTML = trok;
            alert(trok);*/

           /* parseFloat(document.getElementById("lbtroco").value) = document.getElementById("troco").value
            - parseFloat(document.getElementById("total").value);*/
         // }

});