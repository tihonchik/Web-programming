import { isAuthenticated, removeCurrentUser, isAdmin } from "../js/auth.js";
import {
  translatePage,
  loadTranslationPage,
  getCurentLang,
} from "../js/translation.js";
import { getCurrentTheme, setTheme, loadTheme } from "../js/theme.js";
import { getCurrentUser } from "../js/auth.js";

class MyHeader extends HTMLElement {
  connectedCallback() {
    const authButton = isAuthenticated()
      ? `<button class="header__right-button button Smalltext logout-btn" data-i18n="header.logout">
           Logout
         </button>`
      : `<a href="../pages/login.html" class="header__right-button button Smalltext" data-i18n="header.login">
           Login
         </a>`;

    const adminLink = isAdmin()
      ? `<a href="../pages/admin.html" class="header__a Smalltext" data-i18n="header.admin">Admin</a>`
      : "";

    this.innerHTML = `
      <style>

        .burger-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--colors-text-title, #000);
          cursor: pointer;
          padding: var(--spacing-sm, 8px);
          transition: color 0.3s ease;
        }

        html.font-size-100 {
          zoom: 1;
        }

        html.font-size-125 {
          zoom: 1.25;
        }

        html.font-size-150 {
          zoom: 1.5;
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

        body.hide-images img,
        body.hide-images svg,
        body.hide-images picture,
        body.hide-images canvas {
          display: none !important;
        }
        body.hide-images * {
          background-image: none !important;
        }

        .settings-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          backdrop-filter: blur(var(--space-4));
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .settings-modal.open {
          opacity: 1;
          visibility: visible;
        }

        .settings-modal-content {
          background: var(--colors-backgroung-card-2);
          border-radius: var(--radius-lg);
          box-shadow: 0 var(--space-8) var(--space-24) rgba(0, 0, 0, 0.2);
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .settings-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md) var(--spacing-lg);
          border-bottom: var(--border-size) solid var(--colors-border);
          flex-shrink: 0;
        }

        .settings-modal-title {
          color: var(--colors-text-title);
          font-family: var(--fonts-h3-family, Roboto);
          font-size: var(--fonts-sizes-32, 32px);
          font-weight: 600;
        }

        .settings-modal-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: var(--space-36);
          height: var(--space-36);
          border: none;
          border-radius: var(--radius-sm);
          background: transparent;
          color: var(--colors-text-main);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .settings-modal-close:hover {
          background-color: var(--colors-backgroung-button-1);
          color: var(--colors-violet-700);
        }

        .settings-modal-body {
          padding: var(--spacing-md) var(--spacing-lg);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          overflow-y: auto;
          flex: 1;
        }

        .settings-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .settings-group-title {
          color: var(--colors-text-title);
          font-family: var(--fonts-h5-family, Roboto);
          font-size: var(--fonts-sizes-18, 18px);
          font-weight: 600;
        }

        .settings-group-description {
          color: var(--colors-text-main);
          font-family: var(--fonts-smalltext-family, Roboto);
          font-size: var(--fonts-sizes-14, 14px);
          margin-bottom: var(--spacing-xs);
        }

        .settings-options {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        .settings-divider {
          height: var(--border-size);
          background-color: var(--colors-grey-700);
          margin: var(--spacing-xs) 0;
        }

        .settings-reset-btn {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          background-color: var(--colors-backgroung-button-1);
          color: var(--colors-violet-700);
          border: 1px solid var(--colors-violet-700);
          border-radius: var(--radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-xs);
          font-family: var(--fonts-smalltext-family, Roboto);
          font-size: var(--fonts-sizes-14, 14px);
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .settings-reset-btn:hover {
          background-color: var(--colors-violet-700);
          color: var(--colors-backgroung-card-2);
        }

        .settings-reset-btn {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          background-color: var(--colors-backgroung-button-1);
          color: var(--colors-violet-700);
          border: 1px solid var(--colors-violet-700);
          border-radius: var(--radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-xs);
          font-family: var(--fonts-smalltext-family, Roboto);
          font-size: var(--fonts-sizes-14, 14px);
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .settings-reset-btn:hover {
          background-color: var(--colors-violet-700);
          color: var(--colors-backgroung-card-2);
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
            <a href="../index.html" class="header__a Smalltext" data-i18n="header.home">Home</a>
            <a href="../pages/catalog.html" class="header__a Smalltext" data-i18n="header.catalog">Catalog</a>
            <a href="../pages/favorites.html" class="header__a Smalltext" data-i18n="header.favorites">Favorites</a>
            <a href="../pages/Basket.html" class="header__a Smalltext" data-i18n="header.basket">Basket</a>
            <a href="../pages/orders.html" class="header__a Smalltext" data-i18n="header.orders">Orders</a>
            ${adminLink}
          </nav>

          <div class="header__buttons">
            <button class="theme-btn MaterialIcons" id="openSettingsBtn" title="Settings">settings</button>
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
          <a href="../index.html" data-i18n="header.home">Home</a>
          <a href="../pages/catalog.html" data-i18n="header.catalog">Products</a>
          <a href="../pages/favorites.html" data-i18n="header.favorites">Favorites</a>
          <a href="../pages/Basket.html" data-i18n="header.basket">Basket</a>
          <a href="../pages/orders.html" data-i18n="header.orders">Orders</a>
          ${adminLink ? `<a href="../pages/admin.html" data-i18n="header.admin">Admin</a>` : ""}
        </nav>
        <div class="mobile-divider"></div>
        <div class="mobile-actions">
          <div class="theme-switcher" style="justify-content: center;">
            <button class="theme-btn MaterialIcons" data-theme="light">light_mode</button>
            <button class="theme-btn MaterialIcons" data-theme="dark">dark_mode</button>
          </div>
          <div class="theme-switcher" style="justify-content: center;">
            <button class="theme-btn MaterialIcons" data-image="show" title="Show images">image</button>
            <button class="theme-btn MaterialIcons" data-image="hide" title="Hide images">image_not_supported</button>
          </div>
          <div class="language-switcher" style="justify-content: center;">
            <button class="lang-btn" data-lang="en">EN</button>
            <button class="lang-btn" data-lang="ru">RU</button>
          </div>
          <div class="theme-switcher" style="justify-content: center;">
            <button class="theme-btn" data-fontsize="100">
              <span data-i18n="settings.fontSize.normal">100%</span>
            </button>
            <button class="theme-btn" data-fontsize="125">
              <span data-i18n="settings.fontSize.large">150%</span>
            </button>
            <button class="theme-btn" data-fontsize="150">
              <span data-i18n="settings.fontSize.xlarge">200%</span>
            </button>
          </div>
          <div style="display: flex; justify-content: center; align-items: center; gap: var(--spacing-xs, 4px);">
            <button class="theme-btn MaterialIcons" data-reset="true" title="Reset settings">restart_alt</button>
          </div>
          <div style="display: flex; width: 100%; justify-content: center; margin-top: var(--gap-md);">
            ${authButton}
          </div>
        </div>
      </div>

      <!-- Модальное окно настроек -->
      <div class="settings-modal" id="settingsModal">
        <div class="settings-modal-content">
          <div class="settings-modal-header">
            <h3 class="settings-modal-title" data-i18n="settings.title">Settings</h3>
            <button class="settings-modal-close MaterialIcons" id="closeSettingsBtn">close</button>
          </div>
          <div class="settings-modal-body">
            <div class="settings-group">
              <h4 class="settings-group-title" data-i18n="settings.language.title">Language</h4>
              <p class="settings-group-description" data-i18n="settings.language.description">Choose your preferred language</p>
              <div class="settings-options">
                <button class="lang-btn" data-lang="en">English</button>
                <button class="lang-btn" data-lang="ru">Русский</button>
              </div>
            </div>

            <div class="settings-divider"></div>

            <div class="settings-group">
              <h4 class="settings-group-title" data-i18n="settings.theme.title">Theme</h4>
              <p class="settings-group-description" data-i18n="settings.theme.description">Choose your preferred theme</p>
              <div class="settings-options">
                <button class="theme-btn" data-theme="light">
                  <span class="MaterialIcons" style="margin-right: 4px;">light_mode</span>
                  <span data-i18n="settings.theme.light">Light</span>
                </button>
                <button class="theme-btn" data-theme="dark">
                  <span class="MaterialIcons" style="margin-right: 4px;">dark_mode</span>
                  <span data-i18n="settings.theme.dark">Dark</span>
                </button>
              </div>
            </div>

            <div class="settings-divider"></div>

            <div class="settings-group">
              <h4 class="settings-group-title" data-i18n="settings.images.title">Images</h4>
              <p class="settings-group-description" data-i18n="settings.images.description">Show or hide images on the page</p>
              <div class="settings-options">
                <button class="theme-btn" data-image="show">
                  <span class="MaterialIcons" style="margin-right: 4px;">image</span>
                  <span data-i18n="settings.images.show">Show images</span>
                </button>
                <button class="theme-btn" data-image="hide">
                  <span class="MaterialIcons" style="margin-right: 4px;">image_not_supported</span>
                  <span data-i18n="settings.images.hide">Hide images</span>
                </button>
              </div>
            </div>

            <div class="settings-divider"></div>

            <div class="settings-group">
              <h4 class="settings-group-title" data-i18n="settings.fontSize.title">Font Size</h4>
              <p class="settings-group-description" data-i18n="settings.fontSize.description">Adjust text size for better readability</p>
              <div class="settings-options">
                <button class="theme-btn" data-fontsize="100">
                  <span data-i18n="settings.fontSize.normal">100%</span>
                </button>
                <button class="theme-btn" data-fontsize="125">
                  <span data-i18n="settings.fontSize.large">150%</span>
                </button>
                <button class="theme-btn" data-fontsize="150">
                  <span data-i18n="settings.fontSize.xlarge">200%</span>
                </button>
              </div>
            </div>

            <div class="settings-divider"></div>

            <div class="settings-group">
              <button class="settings-reset-btn" data-reset="true">
                <span class="MaterialIcons">restart_alt</span>
                <span data-i18n="settings.reset">Reset all settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    if (isAuthenticated()) {
      const logoutButtons = this.querySelectorAll(".logout-btn");
      logoutButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          removeCurrentUser();
          window.location.href = "../pages/login.html";
        });
      });
    }

    const openBtn = this.querySelector("#openMenuBtn");
    const closeBtn = this.querySelector("#closeMenuBtn");
    const overlay = this.querySelector("#mobileOverlay");
    const mobileMenu = this.querySelector("#mobileMenu");
    const translateBtns = this.querySelectorAll("[data-lang]");
    const themeBtns = this.querySelectorAll("[data-theme]");
    const imageBtns = this.querySelectorAll("[data-image]");
    const resetBtns = this.querySelectorAll("[data-reset]");
    const fontSizeBtns = this.querySelectorAll("[data-fontsize]");
    const openSettingsBtn = this.querySelector("#openSettingsBtn");
    const closeSettingsBtn = this.querySelector("#closeSettingsBtn");
    const settingsModal = this.querySelector("#settingsModal");

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

    const openSettings = () => {
      settingsModal.classList.add("open");
      document.body.style.overflow = "hidden";
    };

    const closeSettings = () => {
      settingsModal.classList.remove("open");
      document.body.style.overflow = "";
    };

    const user = getCurrentUser();
    let id = null;
    if (user) {
      id = user.id;
    }

    const updateActiveLanguageButton = () => {
      const curentLang = getCurentLang(id);
      translateBtns.forEach((btn) => {
        if (btn.dataset.lang === curentLang) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    };

    const updateActiveThemeButton = () => {
      const currentTheme = getCurrentTheme(id);
      themeBtns.forEach((btn) => {
        if (btn.dataset.theme === currentTheme) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    };

    const updateActiveImageButton = () => {
      const hideImages = localStorage.getItem("hide-images") === "true";
      imageBtns.forEach((btn) => {
        if (
          (btn.dataset.image === "hide" && hideImages) ||
          (btn.dataset.image === "show" && !hideImages)
        ) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
      if (hideImages) {
        document.body.classList.add("hide-images");
      } else {
        document.body.classList.remove("hide-images");
      }
    };

    const updateActiveFontSizeButton = () => {
      const fontSize = localStorage.getItem("font-size") || "100";
      fontSizeBtns.forEach((btn) => {
        if (btn.dataset.fontsize === fontSize) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
      document.documentElement.className = document.documentElement.className.replace(/font-size-\d+/g, '').trim();
      if (document.documentElement.className) {
        document.documentElement.className += ' ';
      }
      document.documentElement.className += `font-size-${fontSize}`;
    };

    themeBtns.forEach((themeBtn) => {
      themeBtn.addEventListener("click", () => {
        const theme = themeBtn.dataset.theme;
        setTheme(theme, id);
        updateActiveThemeButton();
      });
    });

    imageBtns.forEach((imageBtn) => {
      imageBtn.addEventListener("click", () => {
        const value = imageBtn.dataset.image;
        localStorage.setItem(
          "hide-images",
          value === "hide" ? "true" : "false",
        );
        updateActiveImageButton();
      });
    });

    fontSizeBtns.forEach((fontSizeBtn) => {
      fontSizeBtn.addEventListener("click", () => {
        const size = fontSizeBtn.dataset.fontsize;
        localStorage.setItem("font-size", size);
        updateActiveFontSizeButton();
      });
    });

    translateBtns.forEach((translateBtn) => {
      const lang = translateBtn.dataset.lang;
      translateBtn.addEventListener("click", () => {
        translatePage(lang, id);
        updateActiveLanguageButton();
      });
    });

    resetBtns.forEach((resetBtn) => {
      resetBtn.addEventListener("click", () => {
        setTheme("light", id);
        updateActiveThemeButton();

        translatePage("en", id);
        updateActiveLanguageButton();

        localStorage.setItem("hide-images", "false");
        updateActiveImageButton();

        localStorage.setItem("font-size", "100");
        updateActiveFontSizeButton();
      });
    });

    loadTranslationPage(id);
    updateActiveLanguageButton();
    loadTheme(id);
    updateActiveThemeButton();
    updateActiveImageButton();
    updateActiveFontSizeButton();

    openBtn.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);
    openSettingsBtn.addEventListener("click", openSettings);
    closeSettingsBtn.addEventListener("click", closeSettings);
    settingsModal.addEventListener("click", (e) => {
      if (e.target === settingsModal) {
        closeSettings();
      }
    });
    openSettingsBtn.addEventListener("click", openSettings);
    closeSettingsBtn.addEventListener("click", closeSettings);
    settingsModal.addEventListener("click", (e) => {
      if (e.target === settingsModal) {
        closeSettings();
      }
    });
  }
}

customElements.define("my-header", MyHeader);
