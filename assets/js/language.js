'use strict';

// English is the default on every visit. Add data-zh to translate a text node;
// data-zh-alt / data-zh-aria-label / data-zh-content translate attributes.
(() => {
  const selector = document.getElementById('site-language');
  if (!selector) return;
  const textNodes = Array.from(document.querySelectorAll('[data-zh]'), element => ({
    element, en: element.textContent, zh: element.getAttribute('data-zh')
  }));
  const attributes = ['alt', 'aria-label', 'content'].flatMap(attribute =>
    Array.from(document.querySelectorAll('[data-zh-' + attribute + ']'), element => ({
      element, attribute, en: element.getAttribute(attribute),
      zh: element.getAttribute('data-zh-' + attribute)
    }))
  );
  function setLanguage(language) {
    const chinese = language === 'zh-CN';
    document.documentElement.lang = chinese ? 'zh-CN' : 'en';
    selector.value = chinese ? 'zh-CN' : 'en';
    for (const item of textNodes) item.element.textContent = chinese && item.zh ? item.zh : item.en;
    for (const item of attributes) item.element.setAttribute(item.attribute, chinese && item.zh ? item.zh : item.en);
    // Re-measure translated labels in the existing responsive navigation.
    window.dispatchEvent(new Event('resize'));
  }
  selector.addEventListener('change', () => setLanguage(selector.value));
  setLanguage('en');
})();
