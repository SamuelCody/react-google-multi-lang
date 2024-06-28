import React, { useEffect, useState, useMemo, ComponentType } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useTranslation } from '../providers/TranslationProvider';
import decodeHtmlEntities from '../utils/decodeHtmlEntities';

export const withTranslation = <P extends object>(Component: ComponentType<P>) => {
  const TranslatedComponent: React.FC<P> = (props) => {
    const { language, translateText } = useTranslation();
    const [translatedHTML, setTranslatedHtml] = useState<string | null>(null);

    useEffect(() => {
      const translateElement = async (element: Node) => {
        if (element.nodeType === Node.TEXT_NODE && element.nodeValue?.trim()) {
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
        const componentHtml = ReactDOMServer.renderToString(<Component {...props} />);
        container.innerHTML = componentHtml;
        await translateElement(container);
        setTranslatedHtml(container.innerHTML);
      };

      translateContent();
    }, [language, props, translateText]);

    const memoizedContent = useMemo(() => translatedHTML, [translatedHTML]) as string  | TrustedHTML;

    if (!translatedHTML) {
      return <Component {...props} />;
    }
    return <div dangerouslySetInnerHTML={{ __html: memoizedContent }}></div>;
  };

  return TranslatedComponent;
};
