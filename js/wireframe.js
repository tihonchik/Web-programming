// js/wireframe.js

(function () {
  // 1. Создаем и внедряем стили вайрфрейма
  const style = document.createElement("style");
  style.id = "wireframe-styles";
  style.textContent = `
    /* Принудительный монохромный чертежный режим для всех элементов */
    body,
    body * {
      background-color: #ffffff !important;
      background-image: none !important;
      color: #000000 !important;
      border-color: #777777 !important;
      box-shadow: none !important;
      text-shadow: none !important;
      transition: none !important;
      animation: none !important;
    }

    /* Упрощение полей ввода и кнопок */
    input,
    select,
    textarea,
    button,
    .button,
    a.button {
      background-color: #fafafa !important;
      border: 1px solid #444444 !important;
      border-radius: 3px !important;
      color: #000000 !important;
      text-decoration: none !important;
    }

    /* Скрытие реальных графических элементов */
    img,
    video,
    iframe,
    canvas,
    picture,
    svg:not(.wireframe-x) {
      visibility: hidden !important;
      opacity: 0 !important;
    }

    /* Обертка для сохранения исходных размеров элементов */
    .wireframe-img-wrapper {
      position: relative !important;
      display: inline-block;
      overflow: hidden;
      box-sizing: border-box;
    }

    /* Заглушка-контейнер */
    .wireframe-img-placeholder {
      position: absolute !important;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: 1px solid #777777;
      background-color: #f5f5f5 !important;
      display: flex !important;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }
  `;
  document.head.appendChild(style);

  // 2. Функция генерации SVG-заглушки ("X" из угла в угол с надписью "Image")
  function createSvgPlaceholder(width, height) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "wireframe-x");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";

    // Диагональные линии
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      `M 0 0 L ${width} ${height} M ${width} 0 L 0 ${height}`,
    );
    path.setAttribute("stroke", "#888888");
    path.setAttribute("stroke-width", "1");
    path.setAttribute("vector-effect", "non-scaling-stroke");

    // Текстовый блок
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "50%");
    text.setAttribute("y", "50%");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "#444444");
    text.setAttribute("font-family", "monospace");
    text.setAttribute("font-size", "14");
    text.textContent = "Image";

    // Фоновая подложка для текста, чтобы линии под ним прерывались
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "35%");
    rect.setAttribute("y", "42%");
    rect.setAttribute("width", "30%");
    rect.setAttribute("height", "16%");
    rect.setAttribute("fill", "#f5f5f5");

    svg.appendChild(path);
    svg.appendChild(rect);
    svg.appendChild(text);
    return svg;
  }

  // 3. Функция замены медиа-элементов на заглушки
  function applyWireframe() {
    const mediaElements = document.querySelectorAll("img, iframe, video");

    mediaElements.forEach((el) => {
      if (el.dataset.wireframeApplied) return;

      const rect = el.getBoundingClientRect();
      const w = rect.width || el.offsetWidth || 300;
      const h = rect.height || el.offsetHeight || 200;

      // Создаем обертку с сохранением исходного позиционирования
      const wrapper = document.createElement("div");
      wrapper.className = "wireframe-img-wrapper";
      wrapper.style.width =
        el.style.width || (el.width ? el.width + "px" : "100%");
      wrapper.style.height =
        el.style.height || (el.height ? el.height + "px" : "auto");
      wrapper.style.display = window.getComputedStyle(el).display;

      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);

      // Вставляем заглушку поверх скрытого элемента
      const placeholder = document.createElement("div");
      placeholder.className = "wireframe-img-placeholder";

      const svgPlaceholder = createSvgPlaceholder(w, h);
      placeholder.appendChild(svgPlaceholder);
      wrapper.appendChild(placeholder);

      el.dataset.wireframeApplied = "true";
    });
  }

  // 4. Автоматический запуск при готовности DOM-дерева
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyWireframe);
  } else {
    applyWireframe();
  }
})();
