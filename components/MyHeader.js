import { isAuthenticated, removeCurrentUser, isAdmin } from "/js/auth.js";
import {
  translatePage,
  loadTranslationPage,
  getCurentLang,
} from "/js/translation.js";
import { getCurrentTheme, setTheme, loadTheme } from "/js/theme.js";

class MyHeader extends HTMLElement {
  connectedCallback() {
    const authButton = isAuthenticated()
      ? `<button class="header__right-button button Smalltext logout-btn" data-i18n="header.logout">
           Logout
         </button>`
      : `<a href="/pages/login.html" class="header__right-button button Smalltext" data-i18n="header.login">
           Login
         </a>`;

    const adminLink = isAdmin()
      ? `<a href="/pages/admin.html" class="header__a Smalltext" data-i18n="header.admin">Admin</a>`
      : "";

    this.innerHTML = `
      <style>

        .burger-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--colors-basic-black, #000);
          cursor: pointer;
          padding: var(--spacing-sm, 8px);
        }

        .language-switcher {
          display: flex;
          gap: var(--spacing-xs, 4px);
          align-items: center;
        }

        .lang-btn {
          background: none;
          border: 1px solid var(--colors-grey-700, #cdd5df);
          color: var(--colors-text-title, #3c2769);
          cursor: pointer;
          padding: var(--spacing-xs, 4px) var(--spacing-sm, 8px);
          border-radius: var(--radius-xs, 4px);
          font-family: var(--fonts-smalltext-family, Roboto);
          font-size: var(--fonts-sizes-14, 14px);
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .lang-btn:hover {
          background-color: var(--colors-backgroung-button-1, #e8d5f2);
          border-color: var(--colors-violet-700, #7c3aed);
        }

        .lang-btn.active {
          background-color: var(--colors-backgroung-button-1, #e8d5f2);
          border-color: var(--colors-violet-700, #7c3aed);
          color: var(--colors-violet-700, #7c3aed);
          font-weight: 600;
        }

        .theme-switcher {
          display: flex;
          gap: var(--spacing-xs, 4px);
          align-items: center;
        }

        .theme-btn {
          background: none;
          border: 1px solid var(--colors-grey-700, #cdd5df);
          color: var(--colors-text-title, #3c2769);
          cursor: pointer;
          padding: var(--spacing-xs, 4px) var(--spacing-sm, 8px);
          border-radius: var(--radius-xs, 4px);
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .theme-btn:hover {
          background-color: var(--colors-backgroung-button-1, #e8d5f2);
          border-color: var(--colors-violet-700, #7c3aed);
        }

        .theme-btn.active {
          background-color: var(--colors-backgroung-button-1, #e8d5f2);
          border-color: var(--colors-violet-700, #7c3aed);
          color: var(--colors-violet-700, #7c3aed);
        }

        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(var(--space-4));
          z-index: 999;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          right: -100%;
          width: 100%;
          max-width: 320px;
          height: 100vh;
          background-color: var(--colors-backgroung-page, #ffffff);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          padding: var(--spacing-xl, 32px);
          box-shadow: -5px 0 var(--spacing-xl) rgba(0,0,0,0.1);
          transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-menu.open {
          right: 0;
        }

        .mobile-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        .mobile-header {
          display: flex;
          justify-content: flex-end;
          margin-bottom: var(--spacing-xl, 32px);
        }

        .close-menu-btn {
          background: none;
          border: none;
          color: var(--colors-basic-black, #000);
          cursor: pointer;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg, 24px);
        }

        .mobile-nav a {
          text-decoration: none;
          color: var(--colors-text-title, #3c2769);
          font-family: var(--fonts-h4-family, Roboto);
          font-size: var(--fonts-sizes-24, 24px);
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .mobile-nav a:hover {
          color: var(--colors-pink-500, #cf4d74);
        }

        .mobile-divider {
          height: var(--border-size);
          background-color: var(--colors-grey-700, #cdd5df);
          margin: var(--spacing-xl, 32px) 0;
        }

        .mobile-actions {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md, 16px);
        }

       
        @media (max-width: 1104px) {
          .header__nav {
            display: none !important;
          }
          .burger-menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }
         
          .bottom-header__grid {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        }
      </style>

      <section class="top-header top-block">
        <div class="top-header__grid">
          <div class="empty"></div>
          <p class="header_text Smalltext" data-i18n="header.topBanner">
            Free worldwide shipping for orders over $55. Shop now
          </p>
          <p class="header__close MaterialIcons">close</p>
        </div>
      </section>

      <section class="bottom-header top-block">
        <div class="bottom-header__grid">
          <div class="empty"></div>

          <!-- Десктопная навигация -->
          <nav class="header__nav">
            <a href="/index.html" class="header__a Smalltext" data-i18n="header.home">Home</a>
            <a href="/pages/catalog.html" class="header__a Smalltext" data-i18n="header.catalog">Catalog</a>
            <a href="/pages/favorites.html" class="header__a Smalltext" data-i18n="header.favorites">Favorites</a>
            <a href="/pages/Basket.html" class="header__a Smalltext" data-i18n="header.basket">Basket</a>
            <a href="/pages/orders.html" class="header__a Smalltext" data-i18n="header.orders">Orders</a>
            ${adminLink}
          </nav>

          <div class="header__buttons">
            <div class="theme-switcher">
              <button class="theme-btn MaterialIcons" data-theme="light">light_mode</button>
              <button class="theme-btn MaterialIcons" data-theme="dark">dark_mode</button>
            </div>
            <div class="language-switcher">
              <button class="lang-btn" data-lang="en">EN</button>
              <button class="lang-btn" data-lang="ru">RU</button>
            </div>
            ${authButton}
          </div>

          <!-- Кнопка вызова Бургер-меню (видна только на мобильных/планшетах) -->
          <button class="burger-menu-btn MaterialIcons" id="openMenuBtn">menu</button>
        </div>
      </section>

      <!-- Само всплывающее мобильное меню -->
      <div class="mobile-overlay" id="mobileOverlay"></div>
      <div class="mobile-menu" id="mobileMenu">
        <div class="mobile-header">
          <button class="close-menu-btn MaterialIcons" id="closeMenuBtn">close</button>
        </div>
        <nav class="mobile-nav">
          <a href="/index.html" data-i18n="header.home">Home</a>
          <a href="/pages/catalog.html" data-i18n="header.catalog">Products</a>
          <a href="/pages/favorites.html" data-i18n="header.favorites">Favorites</a>
          <a href="/pages/Basket.html" data-i18n="header.basket">Basket</a>
          <a href="/pages/orders.html" data-i18n="header.orders">Orders</a>
          ${adminLink ? `<a href="/pages/admin.html" data-i18n="header.admin">Admin</a>` : ""}
        </nav>
        <div class="mobile-divider"></div>
        <div class="mobile-actions">
          <div class="theme-switcher" style="justify-content: center;">
            <button class="theme-btn MaterialIcons" data-theme="light">light_mode</button>
            <button class="theme-btn MaterialIcons" data-theme="dark">dark_mode</button>
          </div>
          <div class="language-switcher" style="justify-content: center;">
            <button class="lang-btn" data-lang="en">EN</button>
            <button class="lang-btn" data-lang="ru">RU</button>
          </div>
          <div style="display: flex; width: 100%; justify-content: center; margin-top: var(--gap-md);">
            ${authButton}
          </div>
        </div>
      </div>
    `;

    if (isAuthenticated()) {
      const logoutButtons = this.querySelectorAll(".logout-btn");
      logoutButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          removeCurrentUser();
          window.location.href = "/pages/login.html";
        });
      });
    }

    const openBtn = this.querySelector("#openMenuBtn");
    const closeBtn = this.querySelector("#closeMenuBtn");
    const overlay = this.querySelector("#mobileOverlay");
    const mobileMenu = this.querySelector("#mobileMenu");
    const translateBtns = this.querySelectorAll("[data-lang]");
    const themeBtns = this.querySelectorAll("[data-theme]");

    const openMenu = () => {
      mobileMenu.classList.add("open");
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    };

    const closeMenu = () => {
      mobileMenu.classList.remove("open");
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    };

    const updateActiveLanguageButton = () => {
      const curentLang = getCurentLang();
      translateBtns.forEach((btn) => {
        if (btn.dataset.lang === curentLang) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    };

    const updateActiveThemeButton = () => {
      const currentTheme = getCurrentTheme();
      themeBtns.forEach((btn) => {
        if (btn.dataset.theme === currentTheme) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    };

    themeBtns.forEach((themeBtn) => {
      themeBtn.addEventListener("click", () => {
        const theme = themeBtn.dataset.theme;
        setTheme(theme);
        updateActiveThemeButton();
      });
    });

    translateBtns.forEach((translateBtn) => {
      const lang = translateBtn.dataset.lang;
      translateBtn.addEventListener("click", () => {
        translatePage(lang);
        updateActiveLanguageButton();
      });
    });

    loadTranslationPage();
    updateActiveLanguageButton();
    loadTheme();
    updateActiveThemeButton();

    openBtn.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);
  }
}

customElements.define("my-header", MyHeader);
