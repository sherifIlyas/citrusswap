import { Box, useDisclosure, Button, VStack, Text, Image, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { SearchIcon } from '@chakra-ui/icons';
import tokenList from '../../../shadow-assets/blockchains/sonic/tokenlist.json';
import { usePublicClient } from 'wagmi';
import { isAddress } from 'viem';

type CachedImage = {
  url: string;
  timestamp: number;
};

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (coin: any) => void;
}

export default function TokenModal({ isOpen, onClose, onSelect }: TokenModalProps) {
  const [displayedTokens, setDisplayedTokens] = useState(20);
  const [tokens, setTokens] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTokens, setFilteredTokens] = useState<any[]>([]);
  const publicClient = usePublicClient();

  useEffect(() => {
    if(isOpen) {
      const allTokens = tokenList.tokens.flat();
      setTokens(allTokens);
      setFilteredTokens(allTokens);
      setSearchQuery('');
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTokens(tokens);
    } else {
      // Check if search query is a valid address
      if (isAddress(searchQuery)) {
        // Fetch token details from blockchain
        Promise.all([
          publicClient.readContract({
            address: searchQuery,
            abi: [{
              inputs: [],
              name: 'symbol',
              outputs: [{ name: '', type: 'string' }],
              stateMutability: 'view',
              type: 'function'
            }],
            functionName: 'symbol'
          }),
          publicClient.readContract({
            address: searchQuery,
            abi: [{
              inputs: [],
              name: 'decimals',
              outputs: [{ name: '', type: 'uint8' }],
              stateMutability: 'view',
              type: 'function'
            }],
            functionName: 'decimals'
          }),
          publicClient.readContract({
            address: searchQuery,
            abi: [{
              inputs: [],
              name: 'name',
              outputs: [{ name: '', type: 'string' }],
              stateMutability: 'view',
              type: 'function'
            }],
            functionName: 'name'
          })
        ]).then(([symbol, decimals, name]) => {
          const newToken = {
            address: searchQuery,
            symbol,
            decimals,
            name
          };
          setFilteredTokens([newToken]);
        }).catch(() => {
          // If contract calls fail, fall back to regular search
          const query = searchQuery.toLowerCase();
          const filtered = tokens.filter(token => 
            token.symbol.toLowerCase().includes(query) || 
            token.name?.toLowerCase().includes(query)
          );
          setFilteredTokens(filtered);
        });
      } else {
        // Regular search for symbol/name
        const query = searchQuery.toLowerCase();
        const filtered = tokens.filter(token => 
          token.symbol.toLowerCase().includes(query) || 
          token.name?.toLowerCase().includes(query)
        );
        setFilteredTokens(filtered);
      }
    }
  }, [searchQuery, tokens]);

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
            <Box mb={2}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input 
                  placeholder="Search tokens" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  bg="whiteAlpha.100"
                  color="white"
                  _placeholder={{ color: 'gray.300' }}
                  borderRadius="md"
                />
              </InputGroup>
            </Box>
            {filteredTokens.slice(0, displayedTokens).map((token, index) => (
              <Button
                key={index}
                variant="ghost"
                height="60px"
                onClick={() => {
                  onSelect(token);
                  onClose();
                }}
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                _hover={{ bg: 'whiteAlpha.100' }}
              >
                <Image
                  src={`/shadow-assets/blockchains/sonic/assets/${token.address}/logo.png`}
                  boxSize="32px"
                  borderRadius="full"
                  mr={3}
                  onError={(e) => {
                    // Try to load from cache if image fails
                    const cached = localStorage.getItem(`token-image-${token.address}`);
                    if (cached) {
                      const cachedImage: CachedImage = JSON.parse(cached);
                      (e.target as HTMLImageElement).src = cachedImage.url;
                    }
                  }}
                  onLoad={(e) => {
                    // Cache successful image loads
                    const url = (e.target as HTMLImageElement).src;
                    const cachedImage: CachedImage = {
                      url,
                      timestamp: Date.now()
                    };
                    localStorage.setItem(`token-image-${token.address}`, JSON.stringify(cachedImage));
                  }}
                  fallbackSrc='/placeholder-coin.png' bg='gray.800'
                />
                <Text fontWeight="bold" color="whiteAlpha.900">{token.symbol}</Text>
              </Button>
            ))}
            
            {displayedTokens < filteredTokens.length && (
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