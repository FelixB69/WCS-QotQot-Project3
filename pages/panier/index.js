/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import Cart from "../../components/Cart";
import Layout from "../../components/Layout";
import LoadingSpin from "../../components/LoadingSpin";
import { CurrentUserContext } from "../../contexts/currentUserContext";
import ProgressBar from "@ramonak/react-progress-bar";
import ConfirmationModal from "../../components/ConfirmationModal";
import CongratsModal from "../../components/CongratsModal";
import Link from "next/link";
import styles from "../../styles/product_item.module.css";
import axios from "axios";
import { useRouter } from "next/router";

export default function Panier() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [modalCongrats, setModalCongrats] = useState(false);
  const [modalFranco, setModalFranco] = useState(false);
  const { cartItems, getCartItems, modal, setModal, totalPrice } =
    useContext(CurrentUserContext);
  const [date, setDate] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    setError("");
    getCartItems()
      .catch(() => setError("Couldnt get data from cart"))
      .finally(() => setIsLoading(false));
  }, [getCartItems]);

  const handleClose = () => {
    setModal(!modal);
  };

  const handleClose2 = () => {
    setModalCongrats(!modalCongrats);
    router.push("/commandes");
  };

  const handleClose3 = () => {
    setModalFranco(!modalFranco);
  };

  const confirmPurchase = () => {
    setModalFranco(!modalFranco);
    setModalCongrats(!modalCongrats);
    setModal(false);
    handleCreateOrder();
  };

  const handleCreateOrder = () => {
    axios
      .post("/api/ordersProduct", { date, comment, totalPrice })
      .then(getCartItems)
      .catch(() => console.error("panier not working"));
  };

  async function handleConfirm() {
    if (totalPrice >= 75) {
      setModal(!modal);
      setModalCongrats(!modalCongrats);
      handleCreateOrder();
    } else {
      setModal(!modal);
      setModalFranco(!modalFranco);
    }
  }

  const renderProducts = (
    <div className={styles.main_container}>
      {cartItems.map((item) => (
        <Cart
          key={item.id}
          id={item.id}
          codeProduit={item.product.codeProduit}
          name={item.product.name}
          weight={item.product.weight}
          totalPrice={item.product.totalPrice}
          pricePerKg={item.product.pricePerKg}
          stock={item.product.stock}
          picture={item.product.picture ? item.product.picture : ""}
          Quantity={item.quantity}
          typeUVC={item.product.typeUVC}
          poidsUVC={item.product.poidsUVC}
          uniteUVC={item.product.uniteUVC}
          price={item.product.price}
        />
      ))}
    </div>
  );

  return (
    <>
      <Layout pageTitle="Panier">
        <>
          {modal && (
            <ConfirmationModal
              modal={modal}
              handleClose={handleClose}
              setModal={setModal}
              handleConfirm={handleConfirm}
              date={date}
              setDate={setDate}
              comment={comment}
              setComment={setComment}
            />
          )}

          {modalCongrats && (
            <CongratsModal
              confirmPurchase={confirmPurchase}
              modalCongrats={modalCongrats}
              handleClose2={handleClose2}
            />
          )}

          {modalFranco && (
            <CongratsModal
              confirmPurchase={confirmPurchase}
              setModalCongratsm={setModalCongrats}
              setModal={setModal}
              setModalFranco={setModalFranco}
              modalFranco={modalFranco}
              handleClose3={handleClose3}
              handleCreateOrder={handleCreateOrder}
            />
          )}
          {error && (
            <p className="error">
              Impossible d'obtenir les données du serveur, veuillez réessayer
            </p>
          )}
          {isLoading ? <LoadingSpin /> : renderProducts}
        </>
      </Layout>
    </>
  );
}
