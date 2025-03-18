import React, { useEffect, useState } from 'react';
import { useTranslation } from '../providers/TranslationProvider';

export const withTranslation = (Component) => {
  const WithTranslationComponent = (props) => {
    const TranslatedComponent = () => {
      const { language, translateText } = useTranslation();
      const [translatedContent, setTranslatedContent] = useState(null);
      const containerRef = React.useRef(null);
      const processingRef = React.useRef(false);

      useEffect(() => {
        const translateElement = async (element) => {
          // Skip translation for specific elements
          if (
            element.classList?.contains('no-translate') ||
            element.tagName === 'CODE' ||
            element.tagName === 'PRE' ||
            element.tagName === 'SVG' ||
            element.closest('svg')
          ) {
            return;
          }

          // Collect all text nodes first
          const textNodes = [];
          const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
              acceptNode: (node) => {
                // Skip if parent or ancestor is SVG, CODE, PRE, or has no-translate class
                if (
                  node.parentElement?.closest('svg, code, pre, .no-translate')
                ) {
                  return NodeFilter.FILTER_REJECT;
                }
                return node.nodeValue.trim()
                  ? NodeFilter.FILTER_ACCEPT
                  : NodeFilter.FILTER_REJECT;
              },
            }
          );

          let node;
          while ((node = walker.nextNode())) {
            textNodes.push(node);
          }

          // Batch translate all text nodes
          if (textNodes.length > 0) {
            const textsToTranslate = textNodes.map((node) =>
              node.nodeValue.trim()
            );
            try {
              // Translate all texts in one request
              const translations = await Promise.all(
                textsToTranslate.map((text) => translateText(text, language))
              );

              // Apply translations
              textNodes.forEach((node, index) => {
                node.nodeValue = translations[index];
              });
            } catch (error) {
              console.error('Translation error:', error);
            }
          }
        };

        const translateContent = async () => {
          if (containerRef.current && !processingRef.current) {
            processingRef.current = true;
            try {
              const clonedContainer = containerRef.current.cloneNode(true);
              await translateElement(clonedContainer);
              setTranslatedContent(clonedContainer.innerHTML);
            } finally {
              processingRef.current = false;
            }
          }
        };

        translateContent();
      }, [language, translateText]);

      return (
        <>
          <div
            style={{ display: translatedContent ? 'none' : 'block' }}
            ref={containerRef}
          >
            <Component {...props} />
          </div>
          {translatedContent && (
            <div dangerouslySetInnerHTML={{ __html: translatedContent }}></div>
          )}
        </>
      );
    };

    return (
      <React.Suspense fallback={<Component {...props} />}>
        <TranslatedComponent />
      </React.Suspense>
    );
  };

  WithTranslationComponent.displayName = `WithTranslation(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WithTranslationComponent;
};

export default withTranslation;
