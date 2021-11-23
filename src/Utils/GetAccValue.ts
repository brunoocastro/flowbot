import axios from "axios";
import Account from "../Entities/account";

async function getMediaFromBadge(badge: string) {
  const linkValue = `https://stickers-flow3r-2eqj3fl3la-ue.a.run.app/v1/market/graph?code=${badge}&type=trade&range=7days`;
  try {
    const req = await axios.get(linkValue);
    const valuesArray = [];
    for (const value of req.data.dataset) {
      if (value > 0) valuesArray.push(value);
    }
    if (Array.isArray(valuesArray) && !valuesArray.length) {
      console.log(`Média pro emblema ${badge} é nula`);
      return 0;
    }
    const totalValue = valuesArray.reduce((soma, i) => soma + i);
    const media = Number(totalValue / valuesArray.length);
    console.log(`Média pro emblema ${badge}: ${media} sparks`);
    return media;
  } catch {
    console.log(`Deu erro pro emblema ${badge}`);

    return 0;
  }
}

async function getUserBadges(account: Account) {
  const linkAccBadges = `https://flow3r-api-master-2eqj3fl3la-ue.a.run.app//v2/user/badges/private/${account.email}`;

  const config = {
    headers: { Authorization: `Bearer ${account.accessToken}` },
  };
  const accBadges = await axios.get(linkAccBadges, config);

  const badgesList = [];

  let badgesArray = accBadges.data.badges;

  badgesArray = badgesArray.sort(() => Math.random() - 0.5);

  badgesArray.forEach((element) => {
    if (element.code) badgesList.push(element.code);
  });

  return badgesList;
}

const getAccValue = async (account: Account) => {
  await account.verifyTokenValidation();

  try {
    const badgesList = await getUserBadges(account);
    console.log("All Badges(", badgesList.length, ") :", badgesList);

    let valueInSparks = 0;

    for (const badge of badgesList) {
      const media = await getMediaFromBadge(badge);
      valueInSparks += media;
    }

    console.log(`Valor final da conta ${account.username}: ${valueInSparks}`);
  } catch (e) {
    console.log(
      `Erro ao obter valor final da conta ${account.username}.`,
      e.response.data
    );
  }
};

export default getAccValue;
