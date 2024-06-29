import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const TranslationContext = createContext();

const URL = 'https://translation.googleapis.com/language/translate/v2';

const TranslationProvider = ({ children, apiKey, defaultLanguage = 'en' }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('siteLanguage');
    return savedLanguage || defaultLanguage;
  });

  const [translations, setTranslations] = useState(() => {
    const savedTranslations = localStorage.getItem('translations');
    return savedTranslations ? JSON.parse(savedTranslations) : {};
  });

  useEffect(() => {
    localStorage.setItem('siteLanguage', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('translations', JSON.stringify(translations));
  }, [translations]);

  const translateText = useCallback(
    async (text, targetLanguage) => {
      if (targetLanguage === defaultLanguage) {
        return text;
      }

      const cacheKey = `${text}-${targetLanguage}`;
      if (translations[cacheKey]) {
        return translations[cacheKey];
      }

      try {
        const response = await axios.post(URL, null, {
          params: {
            q: text,
            target: targetLanguage,
            key: apiKey,
          },
        });

        const translatedText =
          response.data.data.translations[0].translatedText;
        setTranslations((prev) => ({ ...prev, [cacheKey]: translatedText }));
        return translatedText;
      } catch (error) {
        console.error('Error translating text:', error);
        return text;
      }
    },
    [translations, apiKey, defaultLanguage]
  );

  return (
    <TranslationContext.Provider
      value={{ language, setLanguage, translateText }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

TranslationProvider.propTypes = {
  children: PropTypes.node.isRequired,
  apiKey: PropTypes.string.isRequired,
  defaultLanguage: PropTypes.string,
};

TranslationProvider.displayName = 'TranslationProvider';

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export { TranslationProvider };
