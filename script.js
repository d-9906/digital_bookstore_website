function showGenre(genre) {

document.getElementById("thriller").style.display="none";
document.getElementById("con-fiction").style.display="none";
document.getElementById("romance").style.display="none";
document.getElementById("hist-fiction").style.display="none";

// show selected genre
document.getElementById(genre).style.display="block";

document.getElementById(genre).scrollIntoView({ behavior: 'smooth' });

}

function getInput(promptText, validateFn, emptyMsg) {
    let input = prompt(promptText);
    if (input === null) return null; // user clicked Cancel
    while (!validateFn(input)) {
        alert(emptyMsg);
        input = prompt(promptText);
        if (input === null) return null;
    }
    return input;
}

function buyNow(btn) {
    const card = btn.parentElement.parentElement;
    const bookTitle = card.getElementsByTagName("h3")[0].innerText;
    const bookPrice = card.getElementsByTagName("p")[1].innerText;
    const name = getInput("Enter your name:", input => input.trim() !== "", "Name cannot be empty!");

    if (name === null) return;
    const phone = getInput(
        "Enter your 10-digit phone number:",
        input => /^\d{10}$/.test(input),
        "Invalid phone number! Must be 10 digits."
    );
    if (phone === null) return;
   const address = getInput("Enter your address:", input => input.trim() !== "", "Address cannot be empty!");
    if (address === null) return;
    const payment = getInput(
        "Enter payment mode: cash or online",
        input => ["cash", "online"].includes(input.toLowerCase()),
        "Invalid payment mode! Type 'cash' or 'online'."
    );
    if (payment === null) return;
   if (payment.toLowerCase() === "cash") {
        alert(`Order Confirmed!\n\nBook: ${bookTitle}\n${bookPrice}\nPayment: Cash on Delivery\nThank you ${name}!`);
    } else {
        alert(`Order Confirmed!\n\nBook: ${bookTitle}\n${bookPrice}\nPayment: Online\nYou will receive the payment link on ${phone}.`);
    }
}

document.querySelectorAll('button').forEach(btn => {
    if (btn.innerText === "Add to Cart") {
        btn.addEventListener("click", function() {
            const card = btn.parentElement.parentElement;
            const title = card.getElementsByTagName("h3")[0].innerText;
            const author = card.getElementsByTagName("p")[0].innerText;
            const priceText = card.getElementsByTagName("p")[1].innerText;
            const price = parseInt(priceText.replace(/[^\d]/g,''));

            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push({ title, author, price, quantity: 1 });
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
        });
    }
});

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
    const tbody = document.querySelector("#cartTable tbody");
    tbody.innerHTML = "";
    let total = 0;
    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.title}</td>
            <td>${item.author}</td>
            <td>₹${item.price}</td>
            <td><input type="number" min="1" value="${item.quantity}" onchange="updateQty(${index}, this.value)"></td>
            <td>₹${subtotal}</td>
            <td><button onclick="removeItem(${index})">Remove</button></td>
        `;
        tbody.appendChild(row);
    });
    document.getElementById("totalAmount").innerText = total;
}


function updateQty(index, qty) {
    qty = parseInt(qty);
    if (qty <= 0) return removeItem(index);
    cart[index].quantity = qty;
    renderCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function buyNowFromCart() {
    if(cart.length === 0) { 
        alert("Cart is empty!"); 
        return; 
    }

    const name = getInput("Enter your name:", input => input.trim() !== "", "Name cannot be empty!");
    if (name === null) return;

    const phone = getInput(
        "Enter your 10-digit phone number:",
        input => /^\d{10}$/.test(input),
        "Invalid phone number! Must be 10 digits."
    );
    if (phone === null) return;

    const address = getInput("Enter your address:", input => input.trim() !== "", "Address cannot be empty!");
    if (address === null) return;
const payment = getInput(
        "Enter payment mode: cash or online",
        input => ["cash", "online"].includes(input.toLowerCase()),
        "Invalid payment mode! Type 'cash' or 'online'."
    );
    if (payment === null) return;
let message = `Order Confirmed!\n\nCustomer: ${name}\nPayment: ${payment.toLowerCase() === "cash" ? "Cash on Delivery" : "Online"}\n\nBooks:\n`;
    let totalAmount = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        totalAmount += subtotal;
        message += `- ${item.title} (${item.quantity} × ₹${item.price}) = ₹${subtotal}\n`;
    });
message += `\nTotal Amount: ₹${totalAmount}`;

    if (payment.toLowerCase() === "online") {
        message += `\n\nYou will receive the payment link on ${phone}.`;
    } else {
        message += `\n\nThank you ${name}! Payment will be collected on delivery.`;
    }

    alert(message);
    cart = [];
    localStorage.removeItem("cart");
    renderCart();
}
renderCart();