/* eslint-disable no-unused-vars */
import axios from "axios";
import s from "../../styles/ProductDetail.module.css";
import { minifyProducts, getMinifiedProduct } from "../api/utils/Airtable";
import Link from "next/link";

const DetailProduit = ({ product }) => {
  return (
    <>
      <div className={s.detail_wrapper}>
        <Link className={s.backHome} href="/nouvelleCommande">
          <button>X</button>
        </Link>
        <h1 className={s.detail_title}>{product.name}</h1>
        <div className={s.top_container}>
          <div className={s.top_left}>
            <img
              className={s.product_pic}
              src={
                product.picture ? product.picture : "/images/notAvailable.png"
              }
              alt={product.name}
            />
            <div className={s.product_detail}>
              <h3>Conditionnement</h3>
              <p>{product.weight}</p>
              <h3>Prix</h3>
              <p>
                {product.price}€ ( {product.pricePerKg}€/Kg)
              </p>
            </div>
          </div>
          <div className={s.top_right}>
            <p className={s.product_desc}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laboriosam accusamus repudiandae non quae hic quibusdam eum
              expedita distinctio odit ex adipisci molestiae, pariatur inventore
              dolores magni dicta dolore ut saepe ipsam error esse eveniet quod.
              Recusandae expedita officiis delectus quam odio temporibus earum
              dicta, dolorem beatae quos, qui possimus obcaecati.
            </p>
          </div>
        </div>
        <div className={s.bot_container}>
          <div className={s.bot_top}>
            <img
              className={s.maker_pic}
              src={
                product.makerPicture
                  ? product.makerPicture
                  : "/images/notAvailable.png"
              }
              alt={product.makerName}
            />
            <div className={s.bot_top_desc}>
              <h3>{product.makerName}</h3>

              <p>{product.makerAdress}</p>
            </div>
          </div>
          <div className={s.bot_bot}>
            <p>{product.descriptionProducteur}</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default DetailProduit;

export const getStaticPaths = async () => {
  const res = await axios.get(
    "https://api.airtable.com/v0/app5Yy06J0dhcG7Xb/Produits%20Actifs",
    {
      headers: {
        Authorization: `Bearer ${process.env.AIR_TABLE_API_KEY}`,
      },
    }
  );
  const data = await res.data?.records;

  const paths = await data.map((product) => {
    return {
      params: { id: product.id.toString() },
    };
  });
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
  const id = context.params.id;
  const res = await axios.get(
    `https://api.airtable.com/v0/app5Yy06J0dhcG7Xb/Produits%20Actifs/${id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AIR_TABLE_API_KEY}`,
      },
    }
  );
  const data = await getMinifiedProduct(res.data);
  console.log(data);
  return {
    props: { product: data },
  };
};
