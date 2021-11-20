// tslint:disable-next-line: no-var-requires
require("dotenv").config();
import axios from "axios";
import Twit from "twit";

console.log(process.env.TWITTER_API_KEY);
const Twitter = new Twit({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_KEY_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
});

const getBadge = async (badgeName: string, email: string, token: string) => {
  const link =
    "https://flow3r-api-master-2eqj3fl3la-ue.a.run.app//v2/badges/redeem";
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const data = {
    email,
    code: badgeName,
  };

  return await axios.post(link, data, config);
};

const getRefreshedToken = async (refreshToken: string): Promise<string> => {
  const link =
    "https://securetoken.googleapis.com/v1/token?key=AIzaSyDXtoJRAEQCZL3nzNDToCHTtoBn2Y-g6jY";
  const data = {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  };

  const config = {
    headers: {
      referer: "https://flowpodcast.com.br/",
    },
  };

  try {
    const request = await axios.post(link, data, config);
    console.log(request.data)
    return request.data.access_token;
  } catch (e) {
    console.log("ERRO: ", e);
    throw new Error(e);
  }
};

const refreshToken =
  "AFxQ4_pW17lthI8B6OsBp2VYN-yszncBv73QMlCgF6BFtf-FkQpmw-Wfn9oPNhZBccQkO9ijkLHoS6BlRvJtnuxY0ybduzpbKrfNFv0D4Xn5uu_UBFShq4KJlclBa2HZkzwu8rUsMyTYKB4l-bXepeiaSFR2X40CD0Mp7pQVK7QCuMsPfU_4ZXmUTKmaf_zny9irFFNBb_MCTy94bEDcz42JhtY6L97StQ";

const run = async () => {
  try {
    const meuBearerToken = await getRefreshedToken(refreshToken);
    const req = await getBadge(
      "TRILHA",
      "bruno.scastro2012@hotmail.com",
      meuBearerToken
    );
    // console.log(req.status);
    console.log(req.data.response.data);
  } catch (e) {
    console.log(e.response.data);
  }
};

run();

console.log("Start");
