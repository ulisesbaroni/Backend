const socket = io();

socket.on("updateProducts", (products) => {
  const productContainer = document.getElementById("product-container");
  let content = "";

  products.forEach((products) => {
    content += 
           `
           <div class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${products.thumbnail}" alt="${products.title}" class="img-fluid rounded-start" />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${products.title}</h5>
              <p class="category">${products.category}</p>
              <p class="card-text card-text-description">${products.description}</p>
              <p class="card-text"><small class="text-muted">$ ${products.price}</small></p>
              <button id="{{_id}}" class="add-to-cart-button btn btn-outline-secondary">Agrecar al carrito</button>
            </div>
          </div>
        </div>
      </div>
      
         `;
    productContainer.innerHTML = content;
  });
});

console.log("conectado");