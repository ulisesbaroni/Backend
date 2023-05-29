const socket = io();

socket.on("updateProducts", (products) => {
  const productContainer = document.getElementById("product-container");
  let content = "";

  products.forEach((products) => {
    content += `
          <div>
           <div class="cardContainer">
             <h2 class="cardTitle">${products.title}</h2>
             <p class="category">${products.category}</p>
             <div class="imgConteiner" >
             <img  src="${products.thumbnail}" alt="${products.title}">
             </div>
             <p class="description">${products.description}</p>
             <p class="price">$ ${products.price}</p>
           </div>
           </div>
      
         `;
    productContainer.innerHTML = content;
  });
});

console.log("conectado");