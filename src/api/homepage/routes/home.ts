import { config } from "process";

const router = {
  routes: [
    {
      method: "GET",
      path: "/home",
      handler: "homepage.getHomepageData",
      config: {
        auth: false,
      },
    },
  ],
};

export default router;
