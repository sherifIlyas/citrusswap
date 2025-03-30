import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#171b26',
        color: 'white'
      }
    }
  }
});

export default theme;