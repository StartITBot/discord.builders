import "i18next";
import website from "./locales/en.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "website";
    // custom resources type
    resources: {
      website: typeof website;
    };
  }
}