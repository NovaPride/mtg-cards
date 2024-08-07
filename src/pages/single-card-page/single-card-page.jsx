import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import {
  CardImage,
  CardDescription,
  CardInfo,
  CardPrices,
  CardPurchase,
} from "../../components/card";

import { useUniteMtgSfService } from "../../services/UniteMtgSfService";

import "./single-card-page.scss";

const SingleCardPage = () => {
  const [card, setCard] = useState({});
  const { multiverseid } = useParams();

  const { loading, error, getCardById, clearError } = useUniteMtgSfService();

  useEffect(() => {
    const cachedCard = sessionStorage.getItem(`card_${multiverseid}`);
    cachedCard
      ? setCard(JSON.parse(cachedCard))
      : getCardById(multiverseid)
          .then((data) => {
            setCard(data);
            sessionStorage.setItem(
              `card_${multiverseid}`,
              JSON.stringify(data)
            );
          })
          .catch(() => {
            console.error(`Error while fetching data from APIs! \n ${error}`);
          });
  }, [multiverseid]);

  const content = !error && !loading ? <View card={card} /> : null;
  return <div className="single_card_page">{content}</div>;
};

export default SingleCardPage;

const View = ({ card }) => {
  if (Object.keys(card).length === 0) return <></>;
  const { name, image_uris, prices, purchase_uris, card_faces } = card;
  const image =
    image_uris && !card_faces ? (
      <CardImage src={image_uris} alt={name} scale={1.2} />
    ) : (
      <>
        {card_faces.map((card) => (
          <CardImage src={card.image_uris} alt={card.name} scale={1.2} />
        ))}
      </>
    );
  return (
    <div className="card_wrapper">
      <div className="card_wrapper_elem card_wrapper_image">{image}</div>
      <div className="card_wrapper_elem card_wrapper_description">
        <CardDescription card={card} />
      </div>
      <div className="card_wrapper_elem card_wrapper_image">
        <CardInfo card={card} />
        <CardPrices prices={prices} />
        <CardPurchase purchase_uris={purchase_uris} />
      </div>
    </div>
  );
};
