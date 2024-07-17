
# react-google-multi-lang with Redux Integration

A React library to support multi-language translation in React apps using Google Translation API, integrated with Redux for state management.

## Installation

To install the package, run:

```bash
npm install react-google-multi-lang redux react-redux
```

## Usage

### 1. Set up Redux in Your Application

Install the necessary Redux packages:

```bash
npm install redux react-redux
```

### 2. Create Redux Actions and Reducers for Language Management

Define actions and reducers to manage the language state.

**`src/redux/actions/languageActions.js`**:

```javascript
export const SET_LANGUAGE = 'SET_LANGUAGE';

export const setLanguage = (language) => ({
  type: SET_LANGUAGE,
  payload: language,
});
```

**`src/redux/reducers/languageReducer.js`**:

```javascript
import { SET_LANGUAGE } from '../actions/languageActions';

const initialState = {
  language: 'en',
};

const languageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };
    default:
      return state;
  }
};

export default languageReducer;
```

### 3. Combine Reducers and Create the Redux Store

**`src/redux/reducers/index.js`**:

```javascript
import { combineReducers } from 'redux';
import languageReducer from './languageReducer';

const rootReducer = combineReducers({
  language: languageReducer,
});

export default rootReducer;
```

**`src/redux/store.js`**:

```javascript
import { createStore } from 'redux';
import rootReducer from './reducers';

const store = createStore(rootReducer);

export default store;
```

### 4. Wrap Your Application with Redux Provider and TranslationProvider

Wrap your application with the `Provider` from `react-redux` and `TranslationProvider` from `react-google-multi-lang`.

**`src/index.js`**:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './redux/store';
import { TranslationProvider } from 'react-google-multi-lang';

const apiKey = process.env.REACT_APP_TRANSLATION_API;

ReactDOM.render(
  <Provider store={store}>
    <TranslationProvider apiKey={apiKey} defaultLanguage="en">
      <App />
    </TranslationProvider>
  </Provider>,
  document.getElementById('root')
);
```

### 5. Connect Components to Redux and Use Translation Hooks

Connect your components to Redux to dispatch actions and select state. Use the `useTranslation` hook to handle translations.

**`src/components/LanguageSwitcher.js`**:

```javascript
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-google-multi-lang';
import { setLanguage } from '../redux/actions/languageActions';

const LanguageSwitcher = () => {
  const dispatch = useDispatch();
  const { setLanguage: setTranslationLanguage } = useTranslation();
  const language = useSelector((state) => state.language.language);

  const handleLanguageChange = (lang) => {
    dispatch(setLanguage(lang));
    setTranslationLanguage(lang);
  };

  return (
    <div>
      <button onClick={() => handleLanguageChange('en')}>English</button>
      <button onClick={() => handleLanguageChange('es')}>Spanish</button>
      <button onClick={() => handleLanguageChange('fr')}>French</button>
    </div>
  );
};

export default LanguageSwitcher;
```

**`src/components/ExampleComponent.js`**:

```javascript
import React from 'react';
import { withTranslation } from 'react-google-multi-lang';

const ExampleComponent = () => (
  <div>
    <h1>Hello, World!</h1>
    <p>This is a translatable text.</p>
  </div>
);

export default withTranslation(ExampleComponent);
```

### 6. Use the Connected Components in Your App

**`src/App.js`**:

```javascript
import React from 'react';
import LanguageSwitcher from './components/LanguageSwitcher';
import ExampleComponent from './components/ExampleComponent';

const App = () => (
  <div>
    <LanguageSwitcher />
    <ExampleComponent />
  </div>
);

export default App;
```

## License

MIT © [Boniface Mwanza](https://github.com/bonifacemwanza)
