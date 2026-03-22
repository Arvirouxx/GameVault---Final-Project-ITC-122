function register() {
  let user = {
    username: document.getElementById("regUser").value,
    password: document.getElementById("regPass").value,
    currency: 0,
    library: [],
    cart: []
  };

  localStorage.setItem("user", JSON.stringify(user));
  alert("Registered successfully!");
}

function login() {
  let username = document.getElementById("loginUser").value;
  let password = document.getElementById("loginPass").value;

  let user = JSON.parse(localStorage.getItem("user"));

  if (user && username === user.username && password === user.password) {
    alert("Login successful!");
    window.location.href = "index.html";
  } else {
    alert("Invalid login!");
  }
}

function loadUser() {
  let user = JSON.parse(localStorage.getItem("user"));

  let usernameEl = document.getElementById("username");
  let currencyEl = document.getElementById("currency");

  if (user) {
    usernameEl.innerText = user.username;
    currencyEl.innerText = "$" + user.currency.toFixed(2);
  } else {
    usernameEl.innerText = "Guest";
    currencyEl.innerText = "$0.00";
  }
}

window.onload = function () {
  loadUser();

  if (typeof loadCart === "function") loadCart();
  if (typeof loadLibrary === "function") loadLibrary();
};

function togglePass(){
  let pass = document.getElementById("loginPass");
  pass.type = pass.type === "password" ? "text" : "password";
}

function topup(amount) {
  let user = JSON.parse(localStorage.getItem("user"));

  user.currency += amount;

  localStorage.setItem("user", JSON.stringify(user));

  alert("Top-up successful!");
  location.reload();
}

function addToCart(name, price, img) {
  let user = JSON.parse(localStorage.getItem("user"));

  let exists = user.cart.find(game => game.name === name);

  if (exists) {
    alert("Already in cart!");
    return;
  }

  user.cart.push({ name, price, img });

  localStorage.setItem("user", JSON.stringify(user));

  alert("Added to cart!");
}

function loadCart() {
  let user = JSON.parse(localStorage.getItem("user"));
  let container = document.getElementById("cartItems");

  if (!user || !user.cart || !container) return;

  container.innerHTML = "";

  let subtotal = 0;

  user.cart.forEach((game, index) => {
    subtotal += game.price;

    let item = document.createElement("div");
    item.classList.add("cart-item");

    item.innerHTML = `
      <img src="${game.img}">
      <div>
        <h3>${game.name}</h3>
        <p onclick="removeItem(${index})" style="color:red;cursor:pointer;">Remove</p>
      </div>
      <div>$${game.price.toFixed(2)}</div>
    `;

    container.appendChild(item);
  });

  let tax = subtotal * 0.08;
  let total = subtotal + tax;

  document.getElementById("subtotal").innerText = "$" + subtotal.toFixed(2);
  document.getElementById("tax").innerText = "$" + tax.toFixed(2);
  document.getElementById("total").innerText = "$" + total.toFixed(2);
}

function removeItem(index) {
  let user = JSON.parse(localStorage.getItem("user"));

  user.cart.splice(index, 1);

  localStorage.setItem("user", JSON.stringify(user));

  loadCart();
}

function checkout() {
  let user = JSON.parse(localStorage.getItem("user"));

  let subtotal = user.cart.reduce((sum, g) => sum + g.price, 0);
  let tax = subtotal * 0.08;
  let total = subtotal + tax;

  if (user.currency < total) {
    alert("Not enough balance!");
    return;
  }

  user.currency -= total;

  user.cart.forEach(game => {
    user.library.push(game.name);
  });

  user.cart = [];

  localStorage.setItem("user", JSON.stringify(user));

  alert("Purchase successful!");

  location.reload();
}

window.onload = function() {
  loadUser();
  loadCart();
};

function loadLibrary() {
  let user = JSON.parse(localStorage.getItem("user"));
  let list = document.getElementById("libraryList");

  if (!list) return;

  list.innerHTML = "";

  user.library.forEach(game => {
    let li = document.createElement("li");
    li.innerText = game;
    list.appendChild(li);
  });
}

window.onload = function() {
  loadUser();
  loadLibrary();
};

function buyGame(name, price) {
  let user = JSON.parse(localStorage.getItem("user"));

  if (user.currency < price) {
    alert("Not enough balance!");
    return;
  }

  user.currency -= price;

  // add to library
  user.library.push(name);

  localStorage.setItem("user", JSON.stringify(user));

  alert("Game purchased!");
  location.reload();
}

function handleAddToCart(btn) {
  let name = btn.getAttribute("data-name");
  let price = parseFloat(btn.getAttribute("data-price"));
  let img = btn.getAttribute("data-img");

  addToCart(name, price, img);
}

function logout() {
  localStorage.removeItem("user");
  alert("Logged out!");
  location.href = "login.html";
}

function loadLibrary() {
  let user = JSON.parse(localStorage.getItem("user"));
  let list = document.getElementById("libraryList");

  if (!list) return;

  list.innerHTML = "";

  user.library.forEach(game => {
    let li = document.createElement("li");
    li.innerText = game;
    list.appendChild(li);
  });
}

document.getElementById("currentBalance").innerText = "Current Balance: $" + user.currency.toFixed(2);

window.onload = function() {
  loadUser();
  loadLibrary();
};

window.onload = function () {
  loadCart();
};