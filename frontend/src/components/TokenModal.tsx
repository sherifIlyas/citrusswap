import { Box, useDisclosure, Button, VStack, Text, Image } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import tokenList from '../../../shadow-assets/blockchains/sonic/tokenlist.json';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (coin: any) => void;
}

export default function TokenModal({ isOpen, onClose, onSelect }: TokenModalProps) {
  const [displayedTokens, setDisplayedTokens] = useState(20);
  const [tokens, setTokens] = useState<any[]>([]);

  useEffect(() => {
    if(isOpen) {
      setTokens(tokenList.tokens.flat());
    }
  }, [isOpen]);

  const loadMore = () => {
    setDisplayedTokens(prev => prev + 20);
  };
  
  return (
    <>
      {isOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          zIndex={999}
          onClick={onClose}
        />
      )}
      {isOpen && (
        <Box
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w="450px"
          h="800px"
          bg="gray.700"
          borderRadius="xl"
          zIndex={1000}
          p={4}
          overflowY="auto"
        >
          <VStack spacing={3} align="stretch">
            {tokens.slice(0, displayedTokens).map((token, index) => (
              <Button
                key={index}
                variant="ghost"
                height="60px"
                onClick={() => onSelect(token)}
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
              >
                <Image
                  src={`/shadow-assets/blockchains/sonic/assets/${token.address}/logo.png`}
                  boxSize="32px"
                  borderRadius="full"
                  mr={3}
                  fallbackSrc='/placeholder-coin.png' bg='gray.800'
                />
                <Text fontWeight="bold" color="whiteAlpha.900">{token.symbol}</Text>
              </Button>
            ))}
            
            {displayedTokens < tokens.length && (
              <Button
                mt={4}
                onClick={loadMore}
                colorScheme="blue"
              >
                Load More
              </Button>
            )}
          </VStack>
        </Box>
      )}
    </>
  );
}