import cartsModel from "../models/carts.js";
import productModel from "../models/products.js";

export default class CartsManager {
  getCarts = (params) => {
    return cartsModel.find(params).lean();
  };

  getCartById = (cid) => {
    return cartsModel.findById(cid);
  };

  createCart = (product) => {
    return cartsModel.create(product);
  };

  deleteCart = (cid) => {
    return cartsModel.findByIdAndDelete(cid);
  };

  addProductToCart = (cid, pid) => {
    //Verifico si existe el carrito
    const cart = cartsModel.findById(cid);
    if (!cart) {
      console.log("ese carrito no existe");
    }
    //Si esta el producto sumo uno al quantity
    const productIsInCart = cart.products.find(
      (product) => product.product.toString() === pid
    );
    if (productIsInCart) {
      productIsInCart.quantity += 1;
    } else {
      cart.products.push({ product: pid });
    }

    //actualizo el total amount del carrito
    const product = productModel.findById(pid);
    cart.totalAmount += product.price;

    //Guardar todo esto en el carrito con save
    cart.save();
    return cart;
  };

  deleteProductToCart = (cid, pid) => {
    const cart = cartsModel.findById(cid);
    if (!cart) {
      console.log("carrito no encontrado");
    }

    const productIndex = cart.products.findIndex((p) => {
      p.product.toString() === pid;
    });
    if (productIndex === -1) {
      console.log("Este Producto no esta en el carrito");
    }
    //Restar el precio al totalAmount:

    const product = productModel.findById(pid);
    cart.totalAmount -= product.price * cart.products[productIndex].quantity;
    //borro el profucto del carrito:
    cart.products.splice(productIndex, 1);
    //guardo los cambios del carrito:
    cart.save();
    return cart;
  };
}