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

function getAllDataI18NPlaceholder() {
  const items = document.querySelectorAll("[data-i18n-placeholder]");
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

  items.forEach(async (item) => {
    const key = item.dataset.i18n;

    const translatedText = await getTranslation(key);

    if (translatedText) {
      item.textContent = translatedText;
    } else {
      console.warn(`Перевод не найден для ключа: ${keyPath} [${lang}]`);
    }
  });

  const placeholderItems = getAllDataI18NPlaceholder();

  placeholderItems.forEach(async (item) => {
    const key = item.dataset.i18nPlaceholder;

    const translatedText = await getTranslation(key);

    if (translatedText) {
      item.placeholder = translatedText;
    } else {
      console.warn(
        `Перевод не найден для placeholder ключа: ${keyPath} [${lang}]`,
      );
    }
  });

  document.documentElement.lang = lang;
}

function loadTranslationPage() {
  const lang = getCurentLang();
  translatePage(lang);
}

async function getTranslation(key) {
  const translations = await getTranslations();
  if (!translations) return key;
  const lang = getCurentLang();
  const keys = key.split(".");
  const translatedText = keys.reduce((obj, k) => {
    return obj && obj[k] !== undefined ? obj[k] : null;
  }, translations[lang]);
  return translatedText || key;
}

export {
  translatePage,
  loadTranslationPage,
  getCurentLang,
  getTranslations,
  getTranslation,
};
