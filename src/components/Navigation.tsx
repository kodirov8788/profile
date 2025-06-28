"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bars3Icon,
  XMarkIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./auth/AuthModal";
import UserProfile from "./auth/UserProfile";

const Navigation = () => {
  const t = useTranslations("navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { currentUser } = useAuth();

  const locales = [
    { code: "uz", name: "O'zbekcha" },
    { code: "en", name: "English" },
    { code: "ru", name: "Русский" },
    { code: "ja", name: "日本語" },
  ];

  const navigation = [
    { name: t("home"), href: `/${locale}` },
    { name: t("about"), href: `/${locale}#about` },
    { name: t("projects"), href: `/${locale}#projects` },
    { name: t("contact"), href: `/${locale}#contact` },
    { name: t("blog"), href: `/${locale}#blog` },
  ];

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) {
      setIsLanguageOpen(false);
      return;
    }

    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

    router.push(`/${newLocale}${pathWithoutLocale}`);
    setIsLanguageOpen(false);
  };

  const scrollToSection = (href: string) => {
    const sectionId = href.split("#")[1];
    if (sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-shrink-0"
            >
              <h1 className="text-2xl font-bold text-white">Portfolio</h1>
            </motion.div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      if (item.href.includes("#")) {
                        e.preventDefault();
                        scrollToSection(item.href);
                      }
                    }}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                  </motion.a>
                ))}
                {currentUser && (
                  <motion.a
                    href={`/${locale}/admin`}
                    className="text-blue-300 hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Admin
                  </motion.a>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <GlobeAltIcon className="h-5 w-5" />
                  <span>{locales.find((l) => l.code === locale)?.name}</span>
                </button>

                <AnimatePresence>
                  {isLanguageOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                    >
                      <div className="py-1">
                        {locales.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {lang.name}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Authentication */}
              {currentUser ? (
                <UserProfile />
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openAuthModal("login")}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal("signup")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 backdrop-blur-md"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      if (item.href.includes("#")) {
                        e.preventDefault();
                        scrollToSection(item.href);
                      }
                    }}
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  >
                    {item.name}
                  </a>
                ))}
                {currentUser && (
                  <a
                    href={`/${locale}/admin`}
                    className="text-blue-300 hover:text-blue-200 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Admin
                  </a>
                )}

                {/* Mobile Authentication */}
                {!currentUser && (
                  <div className="border-t border-gray-700 pt-4 space-y-2">
                    <button
                      onClick={() => {
                        openAuthModal("login");
                        setIsOpen(false);
                      }}
                      className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        openAuthModal("signup");
                        setIsOpen(false);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                    >
                      Sign Up
                    </button>
                  </div>
                )}

                {/* Mobile User Profile */}
                {currentUser && (
                  <div className="border-t border-gray-700 pt-4">
                    <UserProfile />
                  </div>
                )}

                <div className="border-t border-gray-700 pt-4">
                  <div className="px-3 py-2 text-sm font-medium text-gray-400">
                    Language
                  </div>
                  {locales.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authMode}
      />
    </>
  );
};

export default Navigation;
