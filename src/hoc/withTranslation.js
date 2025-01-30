import React, { useEffect, useState, useMemo } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useTranslation } from '../providers/TranslationProvider';
import decodeHtmlEntities from '../utils/decodeHtmlEntities';

export const withTranslation = (Component) => {
  return (props) => {
    const { language, translateText } = useTranslation();
    const [translatedHTML, setTranslatedHtml] = useState(null);

    useEffect(() => {
      const translateElement = async (element) => {
        // Skip translation for elements with a specific class or tag
        if (element.classList && element.classList.contains('no-translate')) {
          return;
        }
        if (element.tagName === 'CODE' || element.tagName === 'PRE') {
          return; // Skip translation for <code> and <pre> tags
        }
        if (element.nodeType === Node.TEXT_NODE && element.nodeValue.trim()) {
          const translated = await translateText(element.nodeValue, language);
          element.nodeValue = decodeHtmlEntities(translated);
        }
        if (element.childNodes && element.childNodes.length > 0) {
          for (let i = 0; i < element.childNodes.length; i++) {
            await translateElement(element.childNodes[i]);
          }
        }
      };

      const translateContent = async () => {
        const container = document.createElement('div');
        const componentHtml = ReactDOMServer.renderToString(
          <Component {...props} />
        );

        container.innerHTML = componentHtml;

        await translateElement(container);
        setTranslatedHtml(container.innerHTML);
      };

      translateContent();
    }, [language, props, translateText]);

    const memoizedContent = useMemo(() => translatedHTML, [translatedHTML]);

    if (!translatedHTML) {
      return <Component {...props} />;
    }
    return <div dangerouslySetInnerHTML={{ __html: memoizedContent }}></div>;
  };
};
