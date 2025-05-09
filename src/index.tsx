import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@fontsource/outfit'; // Import the Outfit font
import {
  ChakraProvider,
  defaultSystem,
  defineTextStyles,
  createSystem,
  defineConfig,
  defaultConfig,
} from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';

const textStyles = defineTextStyles({
  body: {
    description: 'The body text style - used in paragraphs',
    value: {
      fontFamily: 'Outfit',
      // fontWeight: '500',
      // fontSize: '16px',
      // lineHeight: '24',
      // letterSpacing: '0',
      textDecoration: 'None',
      textTransform: 'None',
    },
  },
});

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);

  const config = defineConfig({
    theme: {
      textStyles,
    },
  });

  root.render(
    <React.StrictMode>
      <ChakraProvider value={createSystem(defaultConfig, config)}>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <App />
        </ThemeProvider>
      </ChakraProvider>
    </React.StrictMode>,
  );
}
