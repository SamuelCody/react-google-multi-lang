import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import axios from 'axios';

interface TranslationContextProps {
  language: string;
  setLanguage: (language: string) => void;
  translateText: (text: string, targetLanguage: string) => Promise<string>;
}

const TranslationContext = createContext<TranslationContextProps | undefined>(undefined);

const API_KEY = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY || 'your-google-translate-api-key';
const URL = 'https://translation.googleapis.com/language/translate/v2';

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});

  const translateText = useCallback(async (text: string, targetLanguage: string): Promise<string> => {
    const cacheKey = `${text}-${targetLanguage}`;
    if (translations[cacheKey]) {
      return translations[cacheKey];
    }

    try {
      const response = await axios.post(URL, null, {
        params: {
          q: text,
          target: targetLanguage,
          key: API_KEY,
        },
      });

      const translatedText = response.data.data.translations[0].translatedText;
      setTranslations((prev) => ({ ...prev, [cacheKey]: translatedText }));
      return translatedText;
    } catch (error) {
      console.error("Error translating text:", error);
      return text;
    }
  }, [translations]);

  return (
    <TranslationContext.Provider value={{ language, setLanguage, translateText }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextProps => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
