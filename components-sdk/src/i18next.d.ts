import "i18next";
import componentsSdk from "./locales/en.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "components-sdk";
    // custom resources type
    resources: {
      "components-sdk": typeof componentsSdk;
    };
  }
}