// INICIO DO PRINCIPAL
document.addEventListener("DOMContentLoaded", () => {
    const cart = [];
    const cartPopup = document.getElementById("cart-popup");
    const cartItemsList = document.getElementById("cart-items");
    const cartTotal = document.getElementById("total");
    const cartCount = document.getElementById("cart-count");
    var orderText = " ";
    var contador = 0; // Variável para contar qtd de itens geral

    document.getElementById("troco").style.visibility = 'hidden';
    document.getElementById("limp-troco").style.visibility = 'hidden';
    document.getElementById("lbtroco").style.visibility = 'hidden';
    document.getElementById("divpix").style.visibility = 'hidden';

    
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", (event) => {
            const product = event.target.closest(".product");
            const name = product.getAttribute("data-name");
            const price = parseFloat(product.getAttribute("data-price").toLocaleString('fr-FR'));
            const existingItem = cart.find(item => item.name === name);
            /*const endereco = document.getElementById("endereco").value;
            const dinheiro = document.getElementById("dinheiro").value;
            const pix = document.getElementById("pix").value;
            const cartao = document.getElementById("cartao").value;*/

            if (existingItem) {
                existingItem.quantity++;
                contador++;
            } else {
                cart.push({ name, price, quantity: 1 });
                document.getElementById("vazio").innerHTML = "Carrinho";
                contador++;
            }
            updateCart();
            alert(contador);
        });
    });

    // botão abrir tela do carrinho
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
            document.getElementById("nome").focus();
    });
    
    // botão fechar tela do carrinho
    document.getElementById("close-cart").addEventListener("click", () => {
        cartPopup.style.display = "none";
        document.getElementById("top").style = "display:visible";
    });
    
    // botão limpar carrinho
    document.getElementById("clear-cart").addEventListener("click", () => {
        limpCart();
    });
 
    // botão limpar nome
    document.getElementById("limp-nome").addEventListener("click", () => {
        document.getElementById("nome").value = '';
        document.getElementById("nome").placeholder = 'Seu nome...';
        document.getElementById("nome").focus();
    });


    // botão limpar endereço
    document.getElementById("limp-end").addEventListener("click", () => {
        document.getElementById("endereco").value = '';
        document.getElementById("endereco").placeholder = 'Endereço para entrega...';
        document.getElementById("endereco").focus();
    });
    
    // botão limpar troco
    document.getElementById("limp-troco").addEventListener("click", () => {
        document.getElementById("troco").value = '';
        document.getElementById("troco").placeholder = 'Troco para...';
        document.getElementById("lbtroco").innerHTML = 'Valor do Troco R$ 0,00';
        document.getElementById('lbtroco').style.color = "red";
        document.getElementById("troco").focus();
    });

    let tp = " "; // Variável para tipo de pagamento a ser exibido no WhatsApp
    
     // Fechando e finalizando pedido e enviando pelo WhatsApp
    document.getElementById("checkout").addEventListener("click", () => {

        if (cart.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        const nome = document.getElementById("nome").value;
        if (nome == "") {
            alert("Insira seu nome!");
            document.getElementById("nome").focus();
            return;
        }
        
        const endereco = document.getElementById("endereco").value;
        if (endereco == "") {
            alert("Insira um endereço para entrega!");
            document.getElementById("endereco").focus();
            return;
        }

        if (document.getElementById("dinheiro").checked) {
            alert("Pagamento selecionado:\n" + "= (" + document.getElementById("dinheiro").value + ")\n\nPara enviar e finalizar seu pedido, envie-nos no WhatsApp!\n\nObrigado...");
            tp = "DINHEIRO";
        
        }
        else if (document.getElementById("pix").checked) {
            alert("Pagamento selecionado:\n" + "= (" + document.getElementById("pix").value + ")\n\nPara enviar e finalizar seu pedido, envie-nos no WhatsApp!\n\nObrigado...");
            tp = "PIX";
        }
        else if (document.getElementById("cartao").checked) {
            alert("Pagamento selecionado:\n" + "= (" + document.getElementById("cartao").value + ")\n\nPara enviar e finalizar seu pedido, envie-nos no WhatsApp!\n\nObrigado...");
        }
        else if (document.getElementById("dinheiro").checked == false
            && document.getElementById("pix").checked == false 
            && document.getElementById("cartao").checked == false) {
            alert('Selecione uma forma de pagamento!');
            return;
        }          

        if (document.getElementById("dinheiro").checked == true
            && document.getElementById("troco").value == "") {
                alert("Informe um valor para TROCO!");
                return
            }

            if (document.getElementById("dinheiro").checked == true
            && document.getElementById("troco").value == 0 ) {                
                alert("Valor para TROCO não pode ser ZERO!");
                return
            }

            if (document.getElementById("dinheiro").checked == true
            && (document.getElementById("troco").value < parseFloat(document.getElementById("total").innerHTML))) {
                alert("Valor digitado menor que o Total da COMPRA!");
                document.getElementById("troco").focus();
                return
            }
            
            if (document.getElementById("pix").checked == true
            && document.getElementById("troco").value == "" ) {                
                //alert("Agora sim PIX OK!"); 
                //alert(document.getElementById("troco").value);
            }
            
            if (document.getElementById("cartao").checked == true
            && document.getElementById("troco").value == "" ) {                
                //alert("Agora sim CARTÃO OK!"); 
                //alert(document.getElementById("troco").value);
            }

        const cliente = document.getElementById("nome").value;
        orderText = `******************************\n`;
        orderText += '_*PEDIDO PARA:*_';
        orderText += `\n( ${cliente} )\n`; 
        cart.forEach(item => {
            orderText += `\n- *${item.quantity} -->* ${item.name} X ${(item.price.toLocaleString('br-BR'))} = R$ ${(item.price * item.quantity).toFixed(2)}\n`;
        });

        const totitens = document.getElementById("cart-count").innerHTML;
        orderText += `\n_*QTD SELECIONADAS:*_ ${totitens} _*TOTAL ITENS:*_ ${contador}\n`;

        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const troco = document.getElementById("lbtroco").innerHTML;
        
        orderText += `\n_*TOTAL:*_ R$ ${totalPrice.toFixed(2)}\n`;

        const vdin = document.getElementById("troco").value;
        if (document.getElementById("dinheiro").checked == true) {
            orderText += `\n_*FORMA DE PAGAMENTO:*_ ${tp} R$ ${vdin}\n`;
        }
        else 
        orderText += `\n_*FORMA DE PAGAMENTO:*_ ${tp}\n`;
        
        if (troco != "Valor do Troco R$ 0,00") {
        orderText += `\n_*${troco}*_\n`; 
        }
       
        orderText += `\n_*ENDEREÇO DE ENTREGA:*_ ${endereco}\n`;

        orderText += `\n******************************`;
        orderText += `\n_*AVISO:*_ Qualquer Divergência no Pedido com relação a Valores ou Quantidade,`;
        orderText += `\no mesmo será CANCELADO por nossa equipe!\n`;
        
        const whatsappURL = `https://wa.me/5575998886000?text=${encodeURIComponent(orderText)}`;
        window.open(whatsappURL, "_blank"); // Aber o WhatsApp diretamente
        //setTimeout(() => { window.open(whatsappURL, "_blank"); }, 5000); // Abrir o WhatsApp com Delay

        // Cria o arquivo PDF
        /*const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        var hoje = new Date();
        const dia = hoje.getDate().toString().padStart(2,'0');
        const mes = String(hoje.getMonth() + 1).padStart(2,'0');
        const ano = hoje.getFullYear();
        //const hora = hoje.getHours();
        //const minuto = hoje.getMinutes();
        const hora = hoje.toLocaleTimeString(); 
        const dataAtual = (`${dia}-${mes}-${ano} ${hora}s`);
        doc.text(orderText, 5, 10);
        doc.save("Pedido "+dataAtual+".pdf");*/
    });

    // Atualizando o carrinho
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
                    contador--;
                } else {
                    cart.splice(index, 1);
                    contador--;
                }
                updateCart();
                alert(contador);
            });
            
            const newContent1 = document.createTextNode(" ");
            
            const increaseButton = document.createElement("button-itemaum");
            increaseButton.textContent = "+";
            
            increaseButton.addEventListener("click", () => {
                item.quantity++;
                contador++;
                updateCart();
                alert(contador);
            });
            
            const newContent2 = document.createTextNode(" ");
            
            const deleteButton = document.createElement("button-itemdelete");
            deleteButton.textContent = "x";
            
            deleteButton.addEventListener("click", () => {
                //item.quantity++;
                cart.splice(index, 1);
                contador = contador - item.quantity;
                updateCart();
                alert(contador);
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
        } else {
            document.getElementById("vazio").innerHTML = "Carrinho Vazio";
            document.getElementById('lbtroco').style.color = "red";
            document.getElementById("troco").value = '';
            document.getElementById("lbtroco").innerHTML = 'Valor do Troco R$ 0,00';
            updateCart();
        }     
        myFunction();   
    }
        
    // Eventos de click no radio button seleção de pagamento
    document.getElementById("dinheiro").onclick = function() {ckdinheiro()};
    function ckdinheiro() {
        if (document.getElementById("dinheiro").checked == true 
        && document.getElementById("pix").checked == false
        && document.getElementById("cartao").checked == false) {
            if (document.getElementById("troco").style.visibility === 'hidden') {
                document.getElementById("troco").style.visibility = 'visible';
                document.getElementById("limp-troco").style.visibility = 'visible';
                document.getElementById("lbtroco").style.visibility = 'visible';
                document.getElementById("divpix").style.visibility = 'hidden';
                document.getElementById("lbtroco").innerHTML = 'Valor do Troco R$ 0,00';
                document.getElementById("troco").focus();
            }

            } else if (document.getElementById("dinheiro").checked == false) {
                if (document.getElementById("troco").style.visibility === 'hidden') {
                    document.getElementById("troco").style.visibility = 'visible';
                    document.getElementById("limp-troco").style.visibility = 'visible';
                    document.getElementById("lbtroco").style.visibility = 'visible';
                    document.getElementById("lbtroco").innerHTML = 'Valor do Troco R$ 0,00';
                    document.getElementById("endereco").focus();
                }
            }
    }
        
    document.getElementById("pix").onclick = function() {ckpix()};
    function ckpix() {
        if (document.getElementById("pix").checked == true
        && document.getElementById("dinheiro").checked == false
        && document.getElementById("cartao").checked == false) {
            document.getElementById("troco").style.visibility = 'hidden';
            document.getElementById("limp-troco").style.visibility = 'hidden';
            document.getElementById("troco").value = '';
            document.getElementById("lbtroco").style.visibility = 'hidden';
            document.getElementById("lbtroco").innerHTML = 'Valor do Troco R$ 0,00';
            document.getElementById("endereco").focus();
            document.getElementById("divpix").style.visibility = 'visible';
        }
    }

    document.getElementById("cartao").onclick = function() {ckcartao()};
    function ckcartao() {
        if (document.getElementById("cartao").checked == true
        && document.getElementById("dinheiro").checked == false
        && document.getElementById("pix").checked == false) {
            document.getElementById("troco").style.visibility = 'hidden';
            document.getElementById("limp-troco").style.visibility = 'hidden';
            document.getElementById("troco").value = '';
            document.getElementById("lbtroco").style.visibility = 'hidden';
            document.getElementById("divpix").style.visibility = 'hidden';
            document.getElementById("lbtroco").innerHTML = 'Valor do Troco R$ 0,00';
            document.getElementById("endereco").focus();
        }
    }

    // Função para o cáuculo input valor do troco
    document.getElementById("troco").onkeyup = function() {myFunction()};
    function myFunction() {
        let tot = document.getElementById('troco').value - parseFloat(document.getElementById('total').innerHTML);
        document.getElementById('lbtroco').innerHTML = "Valor do Troco R$ " + tot.toFixed(2).replace(".", ",");
        
        // Verifica se o valor do troco informado é positivo ou negativo -1, 0, ou >= 0 ...
        let i = Math.sign(tot) >= 0 ? "Positive" : "Negative";
        if (i == 'Positive') {
            document.getElementById('lbtroco').style.color = "blue";
        }
        else
        document.getElementById('lbtroco').style.color = "red";

        // Aqui zera o input troco e label valor do troco, se total de vendas for 0 (zero)
        let totVendas = parseFloat(document.getElementById('total').innerHTML);        
        if (totVendas == 0) {
            document.getElementById("troco").value = "";
            document.getElementById('lbtroco').innerHTML = "Valor do Troco R$ 0,00";
        }
    }

    // Função para o teclado não esconde o input valor do troco
    const input = document.getElementById('troco').display="flex";
    input.addEventListener('focus', () => {
    // Garante que o input fique visível ao abrir o teclado
    setTimeout(() => {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100); // Atraso para garantir que o teclado já esteja aberto
    });

    // Função para limpar o carrinho
    function limpCart() {
        cart.length = 0;
        contador = 0;
        document.getElementById("dinheiro").checked = false;
        document.getElementById("pix").checked = false;
        document.getElementById("cartao").checked = false;
        document.getElementById("vazio").innerHTML = "Carrinho Vazio";
        document.getElementById("troco").style.visibility = 'hidden';
        document.getElementById("limp-troco").style.visibility = 'hidden';
        document.getElementById("lbtroco").style.visibility = 'hidden';
        document.getElementById("divpix").style.visibility = 'hidden';
        updateCart();
        document.getElementById("lbtroco").innerHTML = 'Valor do Troco R$ 0,00';
        document.getElementById('lbtroco').style.color = "red";
        document.getElementById("nome").focus();
    }

}); // FIM DO PRINCIPAL

   // Função para obter um cookie pelo nome
   function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

    // Função para definir um cookie
    function setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/`;
    }

    // Aceitar os termos da LGPD
    function acceptLgpd() {
        setCookie('lgpdConsent', 'accepted', 1);
        document.getElementById('lgpdBanner').style.display = 'none';
    }

    // Recusar os termos da LGPD
    function declineLgpd() {
        setCookie('lgpdConsent', 'declined', 365);
        alert('Você recusou o uso de cookies!');
        document.getElementById('lgpdBanner').style.display = 'none';
    }

    // Mostrar o banner se o consentimento não foi dado
    window.onload = function() {
        if (!getCookie('lgpdConsent')) {
            document.getElementById('lgpdBanner').style.display = 'block';
        }
    }

    function copiarPix() {
        const chave = document.getElementById("chave-pix").textContent;
        navigator.clipboard.writeText(chave).then(() => {
            document.getElementById("mensagem").textContent = "Chave PIX copiada!";
        }).catch(() => {
            document.getElementById("mensagem").textContent = "Erro ao copiar chave PIX!";
        });
    }

