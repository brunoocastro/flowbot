// tslint:disable-next-line: no-var-requires
require("dotenv").config();
import axios from "axios";
import Twit from "twit";
import Account from "./account";

const Twitter = new Twit({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_KEY_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
});

const tonelive = {
  email: "bruno.scastro2012@hotmail.com",
  refreshToken:
    "AFxQ4_pW17lthI8B6OsBp2VYN-yszncBv73QMlCgF6BFtf-FkQpmw-Wfn9oPNhZBccQkO9ijkLHoS6BlRvJtnuxY0ybduzpbKrfNFv0D4Xn5uu_UBFShq4KJlclBa2HZkzwu8rUsMyTYKB4l-bXepeiaSFR2X40CD0Mp7pQVK7QCuMsPfU_4ZXmUTKmaf_zny9irFFNBb_MCTy94bEDcz42JhtY6L97StQ",
};

const dudu = {
  email: "eduardolima100@gmail.com",
  refreshToken:
    "AFxQ4_qxgFYDgu6n-0mf4-IYjUH4psG7gVXo_zpzbD-QX6DNLE-7I_qyYsLLK3eR3WmadjL-DzAw-1w5GOXotN7qqvp9AY3i_EUtKOq2LuaZfkKBB8XRMyuoiEZFLoeDsNM7gawPnFQhqza5TAhsXqiyi8rLlKKL3juwyYkTVtug6F8BMT-bytOs_Yo17QtB8WUFmCSNTCozEq-qUar60XX9OVFlfAfVeA",
};

const run = async () => {
console.log("$$ Rodando o BOT! $$");

  try {
    const tone = new Account(tonelive.email, tonelive.refreshToken);
    const lima = new Account(dudu.email, dudu.refreshToken);

    lima.getBadge("quintavezdorato");
  } catch (e) {
    console.log(e.response.data);
  }
};

run();

