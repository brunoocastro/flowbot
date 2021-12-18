import axios from "axios";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const thresholdBadgeValue = 5;

const embQuePossuo = (email: string) =>
  `https://stickers-flow3r-2eqj3fl3la-ue.a.run.app/v1/badges/private?email=${email}&sort=desc`;
// Bearer token
const dataDoEmblema = (code) =>
  `https://stickers-flow3r-2eqj3fl3la-ue.a.run.app/v1/market/feed?code=${code}`;

const offerLink =
  "https://stickers-flow3r-2eqj3fl3la-ue.a.run.app/v1/market/offer";

const verifyOfferLink = (email: string, badgeId: string) =>
  `https://stickers-flow3r-2eqj3fl3la-ue.a.run.app/v1/badges/market?email=${email}&type=offer&badge_id=${badgeId}`;

const dataForCreateOffer = (email: string, badgeId: string, value: number) => {
  const data = {
    email,
    badge_id: badgeId,
    offer: {
      sparks: { enabled: true, value },
      badge: {
        enabled: false,
        value: [],
      },
    },
  };

  return data;
};
const dataForUpdateOffer = (email: string, markedId: string, value: number) => {
  const data = {
    email,
    market_id: markedId,
    offer: {
      sparks: { enabled: true, value },
      badge: {
        enabled: false,
        value: [],
      },
    },
  };

  return data;
};

export const verifyBadges = async (email: string, token: string) => {
  const badgedWithoutOffers = [];
  const buyBadges = [];
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const req = await axios.get(embQuePossuo(email), config);
    // console.log(req.data.badges)
    let valueRemaining = 0;

    for (const emb of req.data.badges) {
      // console.log("Emb", emb);
      const code = emb.code;
      console.log(code);

      try {
        if (!emb.redeemed) {
          console.log(`Emblema ${code} não resgatado para ${email}`);

          let value = 3;

          const embData = await axios.get(
            encodeURI(dataDoEmblema(code)),
            config
          );

          if (!embData.data.actualTradesAsc[0]) {
            console.log(`O emblema ${code} não possui nem um anúncio`);
            badgedWithoutOffers.push(code);
          } else {
            const lowerValue = embData.data.actualTradesAsc[0].value || 0;
            console.log(
              `O valor mais baixo anunciado pro emblema ${code} é ${lowerValue}`
            );

            if (embData.data.actualTradesAsc[0].value < 10000)
              valueRemaining += embData.data.actualTradesAsc[0].value || 0;
            continue;

            if (lowerValue !== 0 && lowerValue <= thresholdBadgeValue + 0.1) {
              buyBadges.push(code);
              value = lowerValue;
            }
          }

          const verifyOffer = await axios.get(
            verifyOfferLink(email, emb.badge_id),
            config
          );

          console.log(
            `Verificando encomenda do emblema ${code}: Encomendado ? ${verifyOffer.data.to_offer}. Valor: ${verifyOffer.data.value}`
          );
          if (verifyOffer.data.value !== value) {
            await axios.options(offerLink, config);
            if (
              !verifyOffer.data.to_offer ||
              verifyOffer.data.doc_id === null
            ) {
              console.log(`Tentando encomendar emblema ${code}`);
              const doOffer = await axios.post(
                offerLink,
                dataForCreateOffer(email, emb.badge_id, value),
                config
              );
              console.log(
                `Emblema ${code} encomendado para ${email} por ${value}`,
                doOffer.data.status.message
              );
            } else {
              console.log(`Tentando atualizar encomenda do emblema ${code}`);
              const updateOffer = await axios.patch(
                offerLink,
                dataForUpdateOffer(email, verifyOffer.data.doc_id, value),
                config
              );

              console.log(
                `[${email}] Encomenda do emblema ${code} atualizada para ${value} sparks.`,
                updateOffer.data.status.message
              );
            }
          }
        }
      } catch (error) {
        console.error("Erro 2", error);
      }
    }
    console.log("Emblemas sem nenhum anuncio:", badgedWithoutOffers);
    console.log("Emblemas que tentei comprar:", buyBadges);
    console.log("Valor em sparks que falta:", valueRemaining);
  } catch (error) {
    console.error(error);
  }
};

async function getMediaFromBadge(badge: string) {
  const linkValue = `https://stickers-flow3r-2eqj3fl3la-ue.a.run.app/v1/market/graph?code=${badge}&type=trade&range=7days`;
  try {
    const req = await axios.get(linkValue);
    const valuesArray = [];
    req.data.dataset.forEach((value) => {
      if (value > 0) valuesArray.push(value);
    });

    if (Array.isArray(valuesArray) && !valuesArray.length) {
      console.log(`Média pro emblema ${badge} é nula`);
      return 0;
    }
    const totalValue = valuesArray.reduce((soma, i) => soma + i);
    const media = Number(totalValue / valuesArray.length);
    // console.log(`Média pro emblema ${badge}: ${media} sparks`);
    return media;
  } catch {
    console.log(`Deu erro pro emblema ${badge}`);
    return 0;
  }
}

async function getUserBadges(username: string) {
  const linkAccBadges = `https://flow3r-api-master-2eqj3fl3la-ue.a.run.app//v2/user/badges/${username}`;

  const accBadges = await axios.get(linkAccBadges);

  const badgesList = [];

  let badgesArray = accBadges.data.badges;

  badgesArray = badgesArray.sort(() => Math.random() - 0.5);

  badgesArray.forEach((element) => {
    if (element.code) badgesList.push(element.code);
  });

  return badgesList;
}

export async function getBadgesData() {
  const linkAccBadges = `https://flow3r-api-master-2eqj3fl3la-ue.a.run.app//v2/user/badges/monark`;

  const accBadges = await axios.get(linkAccBadges);

  const badgesList = {};

  let badgesArray = accBadges.data.badges;

  badgesArray = badgesArray.sort(() => Math.random() - 0.5);

  badgesArray.forEach((element) => {
    if (element.code) badgesList[element.code] = element;
  });

  return badgesList;
}

const getAccValue = async (username: string) => {
  try {
    const badgesList = await getUserBadges(username);
    console.log("All Badges(", badgesList.length, ") :", badgesList);

    let valueInSparks = 0;
    let failed = 0;

    for (const badge of badgesList) {
      const media = await getMediaFromBadge(encodeURIComponent(badge));
      if (!media) failed += 1;
      valueInSparks += media;
    }

    console.log(
      `Valor final da conta do ${username}: ${valueInSparks.toFixed(
        3
      )} Sparks\nEle possui ${
        badgesList.length
      } emblemas, mas não foi possível calcular o valor de ${failed} emblemas.`
    );
  } catch (e) {
    console.log(
      `Erro ao obter valor final da conta ${username}.`,
      e.response.data
    );
  }
};

export default getAccValue;
