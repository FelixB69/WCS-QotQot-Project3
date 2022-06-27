/* eslint-disable no-unused-vars */
import axios from "axios";
import base from "../../../middlewares/common";
import reqCurrentUser from "../../../middlewares/reqCurrentUser";
import { minifyCartItems } from "../utils/Airtable";
import { setCartQuantity } from "../../../models/cart_model";

export async function getCartItems(req, res) {
  axios
    .get(
      `https://api.airtable.com/v0/app5Yy06J0dhcG7Xb/Panier?filterByFormula=%7BCode_Client%7D%3D%22${req.currentUser.id}%22`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIR_TABLE_API_KEY}`,
        },
      }
    )
    .then((response) => {
      res.send(minifyCartItems(response.data.records));
    })
    .catch(() => res.status(500).json({ msg: "Something went very wrong" }));
}

export async function handlePostCartItems(req, res) {
  setCartQuantity({
    product_id: req.body.ProductId,
    customer_id: req.currentUser.id,
    Quantity: req.body.Quantity,
  });
}

export default base()
  .use(reqCurrentUser)
  .get(getCartItems)
  .post(handlePostCartItems);
