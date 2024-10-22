import { config } from "process";

const router = {
  routes: [
    {
      method: "GET",
      path: "/global",
      handler: "global.globalData",
      config: {
        auth: false,
      },
    },
  ],
};

export default router;
