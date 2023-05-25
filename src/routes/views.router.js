import { Router } from "express";
import ProductsManager from "../dao/mongo/managers/productManager.js";
import CartsManager from "../dao/mongo/managers/cart.js";

const router = Router();

const productsManager = new ProductsManager();
const cartsManager = new CartsManager();

router.get("/", async (req, res) => {
  const products = await productsManager.getProducts();
  res.render("home", { products, css: "products" });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realtimeproducts", { css: "realTimeProducts" });
});

router.get("/cart", async (req, res) => {
  const carts = await cartsManager.getCarts();
  console.log(carts);
  res.render("cart", { carts, css: "cart" });
});

router.get("/chat", async (req, res) => {
  res.render("chat");
});

export default router;