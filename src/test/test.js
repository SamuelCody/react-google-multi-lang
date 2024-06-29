import React from 'react';
import ReactDOM from 'react-dom';
import { TranslationProvider, withTranslation, useTranslation } from 'react-google-multi-lang';

const CustomLanguageSwitcher = () => {
  const { setLanguage } = useTranslation();

  return (
    <div>
      <button onClick={() => setLanguage('en')}>English</button>
      <button onClick={() => setLanguage('es')}>Spanish</button>
      <button onClick={() => setLanguage('fr')}>French</button>
    </div>
  );
};

const MyComponent = () => (
  <div>
    <h1>Hello, World!</h1>
    <p>This is a translatable text.</p>
  </div>
);

const TranslatedComponent = withTranslation(MyComponent);

const App = () => (
  <TranslationProvider>
    <CustomLanguageSwitcher />
    <TranslatedComponent />
  </TranslationProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
