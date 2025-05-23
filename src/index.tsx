import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@fontsource/outfit'; // Import the Outfit font
import {
  ChakraProvider,
  defineTextStyles,
  createSystem,
  defineConfig,
  defaultConfig,
} from '@chakra-ui/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

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
  document.title = "Crypto Market Data"; // Set the new title
  const root = ReactDOM.createRoot(rootEl);

  const config = defineConfig({
    theme: {
      textStyles,
    },
  });
  // Create a client
  const queryClient = new QueryClient();

  root.render(
    <React.StrictMode>
      <ChakraProvider value={createSystem(defaultConfig, config)}>
        
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
      </ChakraProvider>
    </React.StrictMode>,
  );
}
