import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["uz", "en", "ru", "ja"],
  defaultLocale: "uz",
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
