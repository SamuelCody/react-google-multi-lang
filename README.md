
# react-google-multi-lang

A React library to support multi-language translation in React apps using Google Translation API.

## Installation

To install the package, run:

```bash
npm install react-google-multi-lang
```

## Usage

### 1. Set up the Translation Provider

Wrap your application with the `TranslationProvider` component. Pass your Google Translation API key as a prop to the `TranslationProvider`.

```javascript
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { TranslationProvider } from 'react-google-multi-lang';

ReactDOM.render(
  <TranslationProvider apiKey={process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY} defaultLanguage="en">
    <App />
  </TranslationProvider>,
  document.getElementById('root')
);
```

### 2. Create a Custom Language Switcher

Use the `useTranslation` hook to create a custom language switcher.

```javascript
// src/CustomLanguageSwitcher.js
import React from 'react';
import { useTranslation } from 'react-google-multi-lang';

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

export default CustomLanguageSwitcher;
```

### 3. Wrap Components with `withTranslation`

Wrap the components you want to translate with the `withTranslation` higher-order component.

```javascript
// src/MyComponent.js
import React from 'react';
import { withTranslation } from 'react-google-multi-lang';

const MyComponent = () => (
  <div>
    <h1>Hello, World!</h1>
    <p>This is a translatable text.</p>
  </div>
);

export default withTranslation(MyComponent);
```

### 4. Use the Translated Components

Use the wrapped components in your application.

```javascript
// src/App.js
import React from 'react';
import CustomLanguageSwitcher from './CustomLanguageSwitcher';
import MyComponent from './MyComponent';

const App = () => (
  <div>
    <CustomLanguageSwitcher />
    <MyComponent />
  </div>
);

export default App;
```

## Props

### TranslationProvider

- `apiKey` (string, required): Your Google Translation API key.
- `defaultLanguage` (string, optional): The default language of the site. Defaults to `'en'`.

## Custom Hooks

### useTranslation

Use the `useTranslation` hook to get access to the `setLanguage` function.

```javascript
const { setLanguage } = useTranslation();
```

## Example

Here is a complete example of how to use the package in your project.

```javascript
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { TranslationProvider } from 'react-google-multi-lang';

ReactDOM.render(
  
    <App />
  </TranslationProvider>,
  document.getElementById('root')
);

// src/CustomLanguageSwitcher.js
import React from 'react';
import { useTranslation } from 'react-google-multi-lang';

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

export default CustomLanguageSwitcher;

// src/MyComponent.js
import React from 'react';
import { withTranslation } from 'react-google-multi-lang';

const MyComponent = () => (
  <div>
    <h1>Hello, World!</h1>
    <p>This is a translatable text.</p>
  </div>
);

export default withTranslation(MyComponent);

// src/App.js
import React from 'react';
import CustomLanguageSwitcher from './CustomLanguageSwitcher';
import MyComponent from './MyComponent';

const App = () => (
  <div>
    <CustomLanguageSwitcher />
    <MyComponent />
  </div>
);

export default App;
```

## License

MIT © [Boniface Mwanza](https://github.com/bonifacemwanza)
