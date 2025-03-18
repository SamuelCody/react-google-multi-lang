import React, { useEffect, useRef } from 'react';
import { useTranslation } from '../providers/TranslationProvider';

// Add HTML entity decoder
const decodeHTMLEntities = (text) => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

export const withTranslation = (Component) => {
  const WithTranslationComponent = (props) => {
    const { language, translateText } = useTranslation();
    const containerRef = useRef(null);
    const processingRef = useRef(false);
    const originalTextsRef = useRef(new Map());

    useEffect(() => {
      const translateContent = async () => {
        if (containerRef.current && !processingRef.current) {
          processingRef.current = true;
          try {
            const textNodes = [];
            const walker = document.createTreeWalker(
              containerRef.current,
              NodeFilter.SHOW_TEXT,
              {
                acceptNode: (node) => {
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

            if (textNodes.length > 0) {
              textNodes.forEach((node) => {
                if (!originalTextsRef.current.has(node)) {
                  originalTextsRef.current.set(
                    node,
                    decodeHTMLEntities(node.nodeValue)
                  );
                }
              });

              const uniqueTexts = [
                ...new Set(
                  textNodes.map((node) =>
                    originalTextsRef.current.get(node).trim()
                  )
                ),
              ];

              const results = await Promise.all(
                uniqueTexts.map((text) => translateText(text, language))
              );

              const translationMap = Object.fromEntries(
                uniqueTexts.map((text, index) => [
                  text,
                  decodeHTMLEntities(results[index]),
                ])
              );

              textNodes.forEach((node) => {
                const originalText = originalTextsRef.current.get(node).trim();
                if (translationMap[originalText]) {
                  node.nodeValue = translationMap[originalText];
                }
              });
            }
          } finally {
            processingRef.current = false;
          }
        }
      };

      translateContent();
    }, [language, translateText]);

    return (
      <div ref={containerRef}>
        <Component {...props} />
      </div>
    );
  };

  WithTranslationComponent.displayName = `WithTranslation(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WithTranslationComponent;
};

export default withTranslation;
