import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#171b26',
        color: 'white',
        overflowX: 'hidden' // Add this to prevent horizontal scrolling
      }
    }
  }
});

export default theme;