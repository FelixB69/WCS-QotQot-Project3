import style from "../styles/orderedProductItem.module.css";
import { useContext, useEffect } from "react";
import { CurrentUserContext } from "../contexts/currentUserContext";
import "dayjs/locale/fr";
import axios from "axios";
const dayjs = require("dayjs");
import { useRouter } from "next/router";

function OrderProductItem(props) {
  const { setOrderAmount, setOrderNumberState, setOrderStatut, setOrderDate } =
    useContext(CurrentUserContext);

  const calculateWeight = parseInt(props.poidsUVC * props.quantity);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    axios
      .get(`/api/orders/${id}`)
      .then((res) => res.data)
      .then((data) => data[0])
      .then((data) => {
        setOrderAmount(data.totalAmount);
        setOrderNumberState(data.orderNumber);
        setOrderStatut(data.statut);
        dayjs(setOrderDate(data.dateLivraison))
          .locale("fr")
          .format("DD/MM/YYYY");
      })
      .catch(() =>
        console.log("Could not get data from the server, please try again")
      ),
      [];
  });

  return (
    <div className={style.item_wrapper}>
      <div className={style.item_picture}>
        <img
          src={props.picture ? props.picture : "/images/notAvailable.png"}
          alt={props.name}
        />
      </div>
      <div className={style.item_detail}>
        <div className={style.item_title}>{props.name}</div>
        <div className={style.item_weight}>{props.weight}</div>
      </div>
      <div className={style.quantity}>
        <div className={style.itemQuantity}>{props.quantity}</div>
        <div className={style.totalWeight}>{`${calculateWeight}g`}</div>
      </div>
      <div className={style.price}>
        <div className={style.itemPrice}>{props.price}€ HT</div>
        <div className={style.itemPricePerKg}>
          {props.pricePerKg.toFixed(2)}€ HT /Kg
        </div>
      </div>
    </div>
  );
}

export default OrderProductItem;
