import Account from "../Entities/Account";
import Repositories from "../Repositories";

export interface AccountData {
  email: string;
  username: string;
  refreshToken: string;
}

export interface AccountsList {
  [key: string]: AccountData;
}

const accounts: AccountsList = {
  tonelive: {
    email: "bruno.scastro2012@hotmail.com",
    username: "tonelive",
    refreshToken:
      "AFxQ4_oPtCFHUNXE8sPZY0PwgY1H25fiWNvre1cnzbDE45O5vOyUwFTZzo_iL_I_c1aLtmhVcNxTSz0v6qrJoNuYEPmMM6qhYgpqbzJXTkfhpYjzQheoV1oino5b0ljr1XWS5scea_yyzsoz1X3NwpXItWIXWUhrcPl7M_kf7DAGhke8lDehKXpzigXqnf4m0gtJhhWnmRm1ezEAaJq7x9j_2zRodf_vqQ",
  },
  brunoocastro: {
    email: "bruno.c0310@gmail.com",
    username: "brunoocastro",
    refreshToken:
      "AFxQ4_o-0ODio-J_6FcF-w6YyLsNvSLb4l4gHhUxD3bjWsRI_k7lhNK6zz_UbTEpoF8kuiQ1Oz2Pg5XN6FIebDgD6UQCNDA6steZQnutPhfJezpFQnhU9IjCP_6Ydt5SaNzyIArSu8If552RHUx7b61_2Zks2Y42xIoMUU8WxoXfqLlvO3mbwILygk4gIXO9WPPijfnpF1IMcBa_I1EXEjKui-egDSlEew",
  },
  eduardolima100: {
    email: "eduardolima100@gmail.com",
    username: "eduardolima100",
    refreshToken:
      "AFxQ4_qxgFYDgu6n-0mf4-IYjUH4psG7gVXo_zpzbD-QX6DNLE-7I_qyYsLLK3eR3WmadjL-DzAw-1w5GOXotN7qqvp9AY3i_EUtKOq2LuaZfkKBB8XRMyuoiEZFLoeDsNM7gawPnFQhqza5TAhsXqiyi8rLlKKL3juwyYkTVtug6F8BMT-bytOs_Yo17QtB8WUFmCSNTCozEq-qUar60XX9OVFlfAfVeA",
  },
  newstovideo: {
    email: "newstovideo@gmail.com",
    username: "newstovideo",
    refreshToken:
      "AFxQ4_p2fS4wOpH347u5H67dS_Zxe3kALZArFTdiGlvSnqr6qOy8goUSVtjSdnGAOE3ZVVH3RQIC50HFf0HIrf6BUr4T6tSjaOHZMPj4ZKYf9Sx3J4tEC10Fdj-XVvIUmdhnlxsfsz4o0etLUgORmPNse1K6BheY3g9zwqpZdKI5hP-0cgV9PjUV_whxEfCsNwku3ejG-mpOxndcjgwAFjIEKjWVymHNfQ",
  },
  newstovideorobot: {
    email: "newstovideorobot@gmail.com",
    username: "newstovideorobot",
    refreshToken:
      "AFxQ4_pcvz10rbTMbDZkHZ_jvOBRIMRViCuX0tlXNrQeItz69Ln0e7a4P5pQW1zq_msre01eGRgxXDInq5FnPaxq0G_540jR5KYl4-QzAFOTS6Otu8auwQwQ3gy7_audHJ19iNIVKPJ7ndFWHcl4kg0GZCjtLxH3LoYchAlUPDC4vcVcVfak3meuDQHTRhz7Fv7Kc_9VWGnfOksuqJERIb6eHQtQIUtgew",
  },
  hitalopraxedes: {
    email: "hitalo_net@hotmail.com",
    username: "hitalopraxedes",
    refreshToken:
      "AFxQ4_rC-wDILAZ8kIN84NcwW-SMy_cQIkZ_-lORQL-Hz7kCOckxJeJyRLcNtSpztJh9b_dDsOKJTeat9oBH8hu3a7Y7xVxKf5-l4N6wnal2alv_x804hvG5GL-1VdOmc5Hl36K2NbPg2BMCHK5jMN-jsc0ma-juE6fiZkwkGhkk2dFR2_MAE2-bUE6OXt0wlxETTbdqRIRWGkXY30HhLwqCEMrlq0lcZA",
  },
  gevhard: {
    email: "gevrod@gmail.com",
    username: "gevhard",
    refreshToken:
      "AFxQ4_rPC11ATzVsLz1Kff5qd5f0Qv5ob78svQwrMSZ-7l18lxKe3m24UNtApPzcCBRUDKVVqJO7ca_VFIfyb-gytpujlHW69cVeXHJiWe-DFZnUU6b8QrDDJgZ3sfEApp970ejgf_oTCuuUin2FGJDlZAJluoMifOGopK_RC65WNEYMwggdriD5oafdlxcBnzy3gpOZW_Sp",
  },
  gabrieelrod: {
    email: "gabriel5rod@hotmail.com",
    username: "gabrieelrod",
    refreshToken:
      "AFxQ4_plfgP6mTxNLaV0w5x6wfg9D53UEcnDN_G40xiFbwlGA7Se1dV3a7VM00A_h_QZNfQUY5w-ghNJXAVaHLZweQpBG2GN-ci8swauoNrE1jWofp17flayQTxZTzpJzF-2s1VnpQ19c66JiDUOumC8grB-7ikkyo5QfvnmAoht-DxyEioOIVoO9uVD1x0Tn82NgGl4WB7AZ_QCMaQ3pWm9gIns-9PGSg",
  },
  thiagoth: {
    email: "thiago.xavier.mello@gmail.com",
    username: "thiagoth",
    refreshToken:
      "AFxQ4_rT1aW2WckZ5nm7dL1_ljDiFoiBnGRmbT2rUvR8BNnMbNoD9G3Y2t09xJnbOxtU9q4Z97sE9aVQVkLUIGilNuMkN5nChnF7x4gkO9gTHoqHkz3v_ZfHIPIFJUxmErqt8VixMEk57oSCdRsZTXfSskH1h8xDtM98Hlik7ofTnb3E-3XbvHNNNA6BU1bDHbzxVOLGwKTnIDlCyoW2yqaO6BIWn1I4ZQ",
  },
  glimacs: {
    email: "glimasdev@gmail.com",
    username: "glimacs",
    refreshToken:
      "AFxQ4_qA-wj9nkjqilN3NupzmMpPpVTtDDWcZi0ffo9P8BtO5J3tcInlrcqcTpYg4IaIIQHAfaD3gSXl6KB6vdlnsaEIqj-yRfG1Ztt3w3HweVgmPUUy7DyvVdWsAO4G6w_CUEfp1q1q-sP3W6MUeug24_aQex_qhm4NaWPdkHNu7SYP7gGTykQYkCysj3RvARK4J6B_2Cso",
  },
  rnata: {
    email: "revieiracorrea07@gmail.com",
    username: "rnata",
    refreshToken:
      "AFxQ4_rtsstWC21Lzi4gg0z-UcI6xgvUhgAhsY2oBtyR7mcw6CxhmmH6CuSHhheMxVJcQMFhodIQgVKoMUSKQeXiSBPfohYJO2fWS_HN2Fnap65b_YrDvjaeW6E4ZF8TewQT-4WnPyQ8bFNHRgbTLVkh-zN7H1haoDO6O6BGtzsAT-8eounKDHPtcHneqr19FOUOnQCc7Ws3dZTAtSoOkJ_GrRm8z_fXzw",
  },
  geovana: {
    email: "geovana.scastro007@gmail.com",
    username: "geovana",
    refreshToken:
      "AFxQ4_rbUS4YL1C-Z_-kbl9CPhPC3bXKXNQ5oqjBWN-FSXxPreFrpyzIYKJBi8KjDuG7G_Gl8oVGtqdJXLBGJpZsvAzGMI-Vp3tgdjL3M6YJHJpOvS6uB3S06pt4FK4-srx6uCmEk6S_kuw1qBTQd5PD30423Use1XVU3KuvhF30kmk_BSSqORGgzIa60ltu0DwjAeiauLqUixjG43IAZQJhE6y-SYCd7A",
  },
};

const AccountCreator = async () => {
  for (const account of Object.values(accounts)) {
    await Repositories.AccountsRepository.set(
      new Account(account.email, account.username, account.refreshToken)
    );
  }
};

export default AccountCreator;
