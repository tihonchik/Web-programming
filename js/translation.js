import { getFromLocalStorage, setToLocalStorage } from "/js/localStotage.js";

function getCurentLang() {
  return getFromLocalStorage("lang");
}

function setLang(lang) {
  setToLocalStorage("lang", lang);
}

function getAllDataI18N() {
  const items = document.querySelectorAll("[data-i18n]");

  return items;
}

let cachedTranslations = null;

async function getTranslations() {
  if (cachedTranslations) return cachedTranslations;

  try {
    const response = await fetch("/i18n/translations.json");
    cachedTranslations = await response.json();
    return cachedTranslations;
  } catch (error) {
    console.error("Ошибка загрузки переводов:", error);
    return null;
  }
}

async function translatePage(lang) {
  setLang(lang);

  const translations = await getTranslations();
  if (!translations) return;

  const items = getAllDataI18N();

  items.forEach((item) => {
    const keyPath = item.dataset.i18n;
    const keys = keyPath.split(".");

    const translatedText = keys.reduce((obj, key) => {
      return obj && obj[key] !== undefined ? obj[key] : null;
    }, translations[lang]);

    if (translatedText) {
      if (item.tagName === "INPUT" || item.tagName === "TEXTAREA") {
        if (keyPath.toLowerCase().includes("placeholder")) {
          item.placeholder = translatedText;
        } else {
          item.value = translatedText;
        }
      } else {
        item.textContent = translatedText;
      }
    } else {
      console.warn(`Перевод не найден для ключа: ${keyPath} [${lang}]`);
    }
  });

  document.documentElement.lang = lang;
}

function loadTranslationPage() {
  const lang = getCurentLang();
  translatePage(lang);
}

export { translatePage, loadTranslationPage, getCurentLang };
