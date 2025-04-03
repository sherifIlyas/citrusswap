import { Box, Container, Heading, Text, VStack, Button, useDisclosure, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Image, Flex, Slide, Input } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { useState, useEffect } from 'react';
import { ChartComponent } from '../components/ChartComponent';

const WalletModal = () => {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const formatAddress = (address: string | undefined) => {
    if (!address) return '';
    return `${address.substring(0, 3)}...${address.substring(address.length - 3)}`;
  };

  return (
    <>
      <Button
        onClick={onOpen}
        color="#161616"
        fontSize="1.5rem"
        background="none"
        border="none"
        padding={0}
        _hover={{ background: 'none' }}
      >
        {formatAddress(address)}
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="gray.800">
          <DrawerCloseButton color="white" />
          <DrawerHeader color="white">Wallet</DrawerHeader>
          <DrawerBody>
            <Button
              w="100%"
              colorScheme="red"
              onClick={() => {
                disconnect();
                onClose();
              }}
            >
              Disconnect
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
import TokenModal from '../components/TokenModal';

export default function Home() {
  const { isConnected, address } = useAccount();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  // Default token values
  const defaultToken1 = {
    name: "Wrapped Sonic",
    address: "0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38",
    symbol: "wS",
    decimals: 18
  };
  
  const defaultToken2 = {
    name: "Bridged USDC",
    address: "0x29219dd400f2Bf60E5a23d13Be72B486D4038894",
    symbol: "USDC.e",
    decimals: 6
  };
  
  const [selectedToken1, setSelectedToken1] = useState<any>(defaultToken1);
  const [selectedToken2, setSelectedToken2] = useState<any>(defaultToken2);
  const [activeTokenBox, setActiveTokenBox] = useState<number>(0); // 1 for first box, 2 for second box
  const [showPanel, setShowPanel] = useState<boolean>(false); // State to control panel visibility
  const [isHovering, setIsHovering] = useState<boolean>(false); // State to track hover on arrow button
  const [showSlippagePanel, setShowSlippagePanel] = useState<boolean>(false); // State to control slippage panel visibility
  const [slippageTolerance, setSlippageTolerance] = useState<number | 'auto'>(0.5); // Default slippage tolerance value
  const [tempSlippage, setTempSlippage] = useState<number | 'auto'>(0.5); // Temporary slippage value while panel is open
  const [isTypingInSelling, setIsTypingInSelling] = useState<boolean>(false); // State to track typing in Selling input
  const [sellingInputValue, setSellingInputValue] = useState<string>(''); // State to store the selling input value

  // Initialize tempSlippage when panel opens
  useEffect(() => {
    if (showSlippagePanel) {
      setTempSlippage(slippageTolerance);
    }
  }, [showSlippagePanel]);

  // Load tokens from localStorage on component mount
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const savedToken1 = localStorage.getItem('selectedToken1');
      const savedToken2 = localStorage.getItem('selectedToken2');
      
      if (savedToken1) {
        try {
          setSelectedToken1(JSON.parse(savedToken1));
        } catch (error) {
          console.error('Error parsing token1 from localStorage:', error);
          // Fallback to default if parsing fails
          setSelectedToken1(defaultToken1);
        }
      } else {
        // If no token in localStorage, use default
        setSelectedToken1(defaultToken1);
      }
      
      if (savedToken2) {
        try {
          setSelectedToken2(JSON.parse(savedToken2));
        } catch (error) {
          console.error('Error parsing token2 from localStorage:', error);
          // Fallback to default if parsing fails
          setSelectedToken2(defaultToken2);
        }
      } else {
        // If no token in localStorage, use default
        setSelectedToken2(defaultToken2);
      }
    }
  }, []);

  // Save tokens to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedToken1', JSON.stringify(selectedToken1));
    }
  }, [selectedToken1]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedToken2', JSON.stringify(selectedToken2));
    }
  }, [selectedToken2]);
  
  return (
    <Container maxW="container.xl" py={40}>
      <Box
        position="absolute"
        top={4}
        right={4}
        w="200px"
        h="40px"
        bg="whiteAlpha.200"
        borderRadius="xl"
        p={4}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {isConnected ? (
          <>
            <WalletModal />
          </>
        ) : (
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    'style': {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                  style={{ width: '100%', height: '100%' }}
                >
                  {!connected && (
                    <button 
                      onClick={openConnectModal} 
                      type="button"
                      style={{
                        width: '100%',
                        height: '100%',
                        color: '#161616',
                        fontSize: '1.5rem',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      Connect Wallet
                    </button>
                  )}
                </div>
              );
            }}
          </ConnectButton.Custom>
        )}
      </Box>
      <Flex position="relative" mt={20}>
        {/* Panel that appears when first square button is clicked */}
        {showPanel && (
          <Slide direction="left" in={showPanel} style={{ position: 'absolute', zIndex: 10, width: '800px', left: '-140px' }}>
            <Box 
              w="800px"
              h="500px"
              bg="#292d37"
              borderRadius="xl"
              p={6}
              boxShadow="lg"
              mr={4}
            >
              <ChartComponent 
    data={initialData} 
    tokenImages={{
      selling: selectedToken1 ? `/shadow-assets/blockchains/sonic/assets/${selectedToken1.address}/logo.png` : null,
      buying: selectedToken2 ? `/shadow-assets/blockchains/sonic/assets/${selectedToken2.address}/logo.png` : null
    }}
    colors={{ 
      backgroundColor: '#292d37', 
      lineColor: '#abc4ff', 
      textColor: 'white', 
      areaTopColor: '#abc4ff', 
      areaBottomColor: 'rgba(41, 98, 255, 0.28)' 
    }} 
  />
            </Box>
          </Slide>
        )}
        
        {/* Slippage Tolerance Panel */}
        {showSlippagePanel && (
          <Box
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex={20}
            w="500px"
            bg="#292d37"
            borderRadius="xl"
            p={6}
            boxShadow="lg"
          >
            <Text fontSize="lg" fontWeight="bold" mb={4} color="white" textAlign="left">
              Slippage tolerance
            </Text>
            
            <Flex gap={2} mb={6} wrap="nowrap">
              {['Auto', '0.1%', '0.5%', '1%', '3%', '5%'].map((value) => (
                <Button
                  key={value}
                  size="sm"
                  bg={tempSlippage === (value === 'Auto' ? 'auto' : parseFloat(value.replace('%', ''))) ? '#abc4ff' : '#3a3f4a'}
                  color={tempSlippage === (value === 'Auto' ? 'auto' : parseFloat(value.replace('%', ''))) ? '#292d37' : 'white'}
                  _hover={{ bg: '#8da8ff' }}
                  onClick={() => {
                    setTempSlippage(value === 'Auto' ? 'auto' : parseFloat(value.replace('%', '')));
                  }}
                  borderRadius="full"
                  px={4}
                >
                  {value}
                </Button>
              ))}
              <Input
                key="custom"
                size="sm"
                bg="#3a3f4a"
                color="white"
                _hover={{ bg: '#8da8ff' }}
                borderRadius="full"
                px={4}
                w="80px"
                placeholder="Custom"
                type="text"
                value={tempSlippage === 'auto' ? '' : tempSlippage}
                onKeyDown={(e) => {
                  // Prevent 'e', '+', '-' and other non-numeric characters
                  const invalidChars = ['e', 'E', '+', '-'];
                  if (invalidChars.includes(e.key) || 
                      // Allow only numbers, backspace, delete, tab, arrows, and period
                      (!/^[0-9.]$/.test(e.key) && 
                       !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '.', 'Period'].includes(e.key))) {
                    e.preventDefault();
                  }
                  // Prevent multiple decimal points
                  if (e.key === '.' && e.currentTarget.value.includes('.')) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setTempSlippage('auto');
                  } else {
                    // Remove any non-numeric characters except decimal point
                    const sanitizedValue = value.replace(/[^0-9.]/g, '');
                    // Ensure only one decimal point
                    const parts = sanitizedValue.split('.');
                    const cleanValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
                    
                    if (cleanValue !== value) {
                      e.target.value = cleanValue;
                    }
                    
                    const num = parseFloat(cleanValue);
                    if (!isNaN(num) && num >= 0) {
                      setTempSlippage(num);
                    }
                  }
                }}
              />
            </Flex>
            
            <Flex justifyContent="flex-end">
              <Button
                size="md"
                bg="#abc4ff"
                color="#292d37"
                _hover={{ bg: "#8da8ff" }}
                onClick={() => {
                  // Cap the slippage value at 75% regardless of what was entered
                  const cappedSlippage = tempSlippage === 'auto' ? 'auto' : Math.min(parseFloat(tempSlippage.toString()), 75);
                  setSlippageTolerance(cappedSlippage);
                  setShowSlippagePanel(false);
                }}
                borderRadius="md"
                width="100%"
              >
                Confirm
              </Button>
            </Flex>
          </Box>
        )}
        
        {/* Add overlay when slippage panel is open */}
        {showSlippagePanel && (
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.600"
            zIndex={15}
            onClick={() => setShowSlippagePanel(false)}
          />
        )}
        
        {/* Swapping interface that moves to the right */}
        <Box 
          transition="transform 0.3s ease-in-out"
          transform={showPanel ? "translateX(300px)" : "translateX(0)"}
          width="100%"
        >
          {/* Controls that will move with the swapping interface */}
          <Box
            position="relative"
            display="flex"
            alignItems="center"
            mx="auto"
            mb={5}
            left="735px"
            top="10px"
          >
            {/* Slider icon button */}
            <Flex alignItems="center">
              <Box
                w="80px"
                h="20px"
                bg="whiteAlpha.200"
                borderRadius="md"
                p={3.5}
                pr={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                cursor="pointer"
                onClick={() => setShowSlippagePanel(!showSlippagePanel)}
              >
                <Text color="gray.300" fontSize="sm">
                  {slippageTolerance === 'auto' ? 'Auto' : `${slippageTolerance}%`}
                </Text>
              </Box>
            </Flex>
            
            {/* First square button with chart icon */}
            <Box
              w="30px"
              h="30px"
              bg={showPanel ? "#3a3f4a" : "#292d37"}
              borderRadius="md"
              ml={2}
              cursor="pointer"
              _hover={{ bg: "#3a3f4a" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              onClick={() => setShowPanel(!showPanel)}
            >
              <svg width="18" height="18" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(1.4 1.4) scale(0.97 0.97)">
                  <path d="M 87.994 0 H 69.342 c -1.787 0 -2.682 2.16 -1.418 3.424 l 5.795 5.795 l -33.82 33.82 L 28.056 31.196 l -3.174 -3.174 c -1.074 -1.074 -2.815 -1.074 -3.889 0 L 0.805 48.209 c -1.074 1.074 -1.074 2.815 0 3.889 l 3.174 3.174 c 1.074 1.074 2.815 1.074 3.889 0 l 15.069 -15.069 l 14.994 14.994 c 1.074 1.074 2.815 1.074 3.889 0 l 1.614 -1.614 c 0.083 -0.066 0.17 -0.125 0.247 -0.202 l 37.1 -37.1 l 5.795 5.795 C 87.84 23.34 90 22.445 90 20.658 V 2.006 C 90 0.898 89.102 0 87.994 0 z" fill="#abc4ff"/>
                  <path d="M 65.626 37.8 v 49.45 c 0 1.519 1.231 2.75 2.75 2.75 h 8.782 c 1.519 0 2.75 -1.231 2.75 -2.75 V 23.518 L 65.626 37.8 z" fill="#abc4ff"/>
                  <path d="M 47.115 56.312 V 87.25 c 0 1.519 1.231 2.75 2.75 2.75 h 8.782 c 1.519 0 2.75 -1.231 2.75 -2.75 V 42.03 L 47.115 56.312 z" fill="#abc4ff"/>
                  <path d="M 39.876 60.503 c -1.937 0 -3.757 -0.754 -5.127 -2.124 l -6.146 -6.145 V 87.25 c 0 1.519 1.231 2.75 2.75 2.75 h 8.782 c 1.519 0 2.75 -1.231 2.75 -2.75 V 59.844 C 41.952 60.271 40.933 60.503 39.876 60.503 z" fill="#abc4ff"/>
                  <path d="M 22.937 46.567 L 11.051 58.453 c -0.298 0.298 -0.621 0.562 -0.959 0.8 V 87.25 c 0 1.519 1.231 2.75 2.75 2.75 h 8.782 c 1.519 0 2.75 -1.231 2.75 -2.75 V 48.004 L 22.937 46.567 z" fill="#abc4ff"/>
                </g>
              </svg>
            </Box>
            
            {/* Second square button */}
            <Box
              w="30px"
              h="30px"
              bg="#292d37"
              borderRadius="md"
              ml={2}
              cursor="pointer"
              _hover={{ bg: "#3a3f4a" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="#abc4ff"/>
              </svg>
            </Box>
          </Box>
          
          <VStack spacing={6} align="stretch">
        <Box textAlign="center" position="relative">
          <TokenModal isOpen={isModalOpen} onClose={onModalClose} onSelect={(token) => {
    // Check if the selected token is already in use in the other section
    if (activeTokenBox === 1) {
      // If the selected token is already in the buying section, swap tokens
      if (selectedToken2 && token.address === selectedToken2.address) {
        // Swap tokens between sections
        const tempToken = selectedToken1;
        setSelectedToken1(selectedToken2);
        setSelectedToken2(tempToken);
      } else {
        // Normal selection - token not in use elsewhere
        setSelectedToken1(token);
      }
    } else if (activeTokenBox === 2) {
      // If the selected token is already in the selling section, swap tokens
      if (selectedToken1 && token.address === selectedToken1.address) {
        // Swap tokens between sections
        const tempToken = selectedToken2;
        setSelectedToken2(selectedToken1);
        setSelectedToken1(tempToken);
      } else {
        // Normal selection - token not in use elsewhere
        setSelectedToken2(token);
      }
    }
  }} />
          <Box
            w="13cm"
            h="120px"
            bg="whiteAlpha.200"
            borderRadius="xl"
            p={4}
            mb={4}
            mx="auto"
            position="relative"
          >
            <Text
              position="absolute"
              top="4"
              left="4"
              fontSize="sm"
              color="whiteAlpha.600"
            >
              Selling
            </Text>
            <Box
              position="absolute"
              top="50%"
              right="4"
              transform="translateY(-50%)"
              w="9cm"
              h="40px"
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              paddingX={2}
            >
              <input
                type="text"
                placeholder="0.00"
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  textAlign: 'right',
                  outline: 'none'
                }}
                onChange={(e) => {
                  if (e.target.placeholder === '0.00') {
                    e.target.placeholder = '';
                  }
                  let value = e.target.value;
                  // Replace comma with period
                  value = value.replace(/,/g, '.');
                  // Remove any non-numeric characters except periods
                  value = value.replace(/[^0-9.]/g, '');
                  // Prevent multiple decimal points
                  const decimalCount = value.split('.').length - 1;
                  if (decimalCount > 1) {
                    value = value.substring(0, value.lastIndexOf('.'));
                  }
                  
                  // Split into integer and decimal parts
                  const parts = value.split('.');
                  
                  // Handle leading zeros in integer part
                  if (parts[0].length > 1) {
                    parts[0] = parts[0].replace(/^0+/, '');
                    if (parts[0] === '') parts[0] = '0';
                  }
                  
                  // Limit to 18 digits (100.000.000.000.000.000)
                  if (parts[0].length > 18) {
                    parts[0] = parts[0].substring(0, 18);
                  }
                  
                  value = parts.join('.');
                  e.target.value = value;
                  setSellingInputValue(value); // Store the value in state
                  setIsTypingInSelling(value !== ''); // Set typing state based on input value
                  
                  // Restore placeholder when input is empty
                  if (value === '') {
                    e.target.placeholder = '0.00';
                  } else if (/^0+$/.test(value)) {
                    // If input becomes all zeros, keep just one zero
                    e.target.value = '0';
                    setSellingInputValue('0');
                  }
                }}
                onFocus={() => {
                  if (sellingInputValue !== '') {
                    setIsTypingInSelling(true);
                  }
                }}
                onBlur={() => {
                  // Don't immediately hide the panel to allow for interactions with it
                  // The panel will be hidden when clicking outside or when explicitly closed
                }}
              />
            </Box>
            <Box
              position="absolute"
              top="107%"
              left="50%"
              transform="translate(-50%, -50%)"
              w="35px"
              h="35px"
              bg="#abc4ff"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              _hover={{ bg: "#8da8ff" }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => {
                // Swap the tokens between selling and buying sections
                const tempToken = selectedToken1;
                setSelectedToken1(selectedToken2);
                setSelectedToken2(tempToken);
              }}
            >
              {isHovering ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 2L9 22M9 2L4 7M15 22L15 2M15 22L20 17" stroke="#292d37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12L12 19L5 12M12 5V19" stroke="#292d37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              )}
            </Box>
            <Box
              position="absolute"
              bottom={6}
              left={2}
              w="4cm"
              h="40px"
              bg="whiteAlpha.300"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              paddingX={2}
              cursor="pointer"
              onClick={() => {
                setActiveTokenBox(1);
                onModalOpen();
              }}
            >
              {selectedToken1 ? (
                <>
                  <Image
                    src={`/shadow-assets/blockchains/sonic/assets/${selectedToken1.address}/logo.png`}
                    boxSize="24px"
                    borderRadius="full"
                    mr={2}
                    fallbackSrc='/placeholder-coin.png' bg='gray.800'
                  />
                  <Text fontWeight="bold">{selectedToken1.symbol}</Text>
                </>
              ) : (
                <Box />
              )}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10l5 5 5-5" stroke="#d1d5db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </Box>
          </Box>
          <Box
            w="13cm"
            h="120px"
            bg="whiteAlpha.200"
            borderRadius="xl"
            p={4}
            mb={4}
            mx="auto"
            position="relative"
          >
            <Text
              position="absolute"
              top="4"
              left="4"
              fontSize="sm"
              color="whiteAlpha.600"
            >
              Buying
            </Text>
            <Box
              position="absolute"
              top="50%"
              right="4"
              transform="translateY(-50%)"
              w="9cm"
              h="40px"
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              paddingX={2}
            >
              <input
                type="text"
                placeholder="0.00"
                readOnly
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  textAlign: 'right',
                  outline: 'none'
                }}
                onChange={(e) => {
                  if (e.target.placeholder === '0.00') {
                    e.target.placeholder = '';
                  }
                  let value = e.target.value;
                  // Replace comma with period
                  value = value.replace(/,/g, '.');
                  // Remove any non-numeric characters except periods
                  value = value.replace(/[^0-9.]/g, '');
                  // Prevent multiple decimal points
                  const decimalCount = value.split('.').length - 1;
                  if (decimalCount > 1) {
                    value = value.substring(0, value.lastIndexOf('.'));
                  }
                  
                  // Split into integer and decimal parts
                  const parts = value.split('.');
                  
                  // Handle leading zeros in integer part
                  if (parts[0].length > 1) {
                    parts[0] = parts[0].replace(/^0+/, '');
                    if (parts[0] === '') parts[0] = '0';
                  }
                  
                  // Limit to 18 digits (100.000.000.000.000.000)
                  if (parts[0].length > 18) {
                    parts[0] = parts[0].substring(0, 18);
                  }
                  
                  value = parts.join('.');
                  e.target.value = value;
                  
                  // Restore placeholder when input is empty
                  if (value === '') {
                    e.target.placeholder = '0.00';
                  } else if (/^0+$/.test(value)) {
                    // If input becomes all zeros, keep just one zero
                    e.target.value = '0';
                  }
                }}
              />
            </Box>
            <Box
              position="absolute"
              bottom={6}
              left={2}
              w="4cm"
              h="40px"
              bg="whiteAlpha.300"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              paddingX={2}
              cursor="pointer"
              onClick={() => {
                setActiveTokenBox(2);
                onModalOpen();
              }}
            >
              {selectedToken2 ? (
                <>
                  <Image
                    src={`/shadow-assets/blockchains/sonic/assets/${selectedToken2.address}/logo.png`}
                    boxSize="24px"
                    borderRadius="full"
                    mr={2}
                    fallbackSrc='/placeholder-coin.png' bg='gray.800'
                  />
                  <Text fontWeight="bold">{selectedToken2.symbol}</Text>
                </>
              ) : (
                <Box />
              )}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10l5 5 5-5" stroke="#d1d5db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </Box>
          </Box>
          <Box
            w="13cm"
            h="60px"
            bg="whiteAlpha.200"
            borderRadius="xl"
            p={4}
            mx="auto"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative" // Added position relative for absolute positioning of the panel
          >
            {/* Connected panel that appears when typing in Selling input */}
            {isTypingInSelling && (
              <Box
                position="absolute"
                top="calc(100% + 10px)" // Position below the button with a small gap
                left="0"
                width="100%" // Same width as the parent button
                bg="#1e212a" // Darker background color
                borderRadius="xl"
                p={4}
                boxShadow="lg"
                zIndex={5}
              >
                <Flex direction="column" gap={2}>
                  <Flex justifyContent="space-between">
                    <Text color="gray.400">Route</Text>
                    <Text color="white">-</Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text color="gray.400">Price Impact</Text>
                    <Text color="white">-</Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text color="gray.400">Minimum Received</Text>
                    <Text color="white">-</Text>
                  </Flex>
                </Flex>
              </Box>
            )}
            
            {isConnected ? (
              <>
                <WalletModal />
              </>
            ) : (
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== 'loading';
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === 'authenticated');

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        'style': {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                      style={{ width: '100%', height: '100%' }}
                    >
                      {!connected && (
                        <button 
                          onClick={openConnectModal} 
                          type="button"
                          style={{
                            width: '100%',
                            height: '100%',
                            color: '#161616',
                            fontSize: '1.5rem',
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          Connect Wallet
                        </button>
                      )}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            )}
          </Box>
        </Box>
           </VStack>
         </Box>
       </Flex>
    </Container>
  );
}

const initialData = [
    { time: '2018-12-22', value: 32.51 },
    { time: '2018-12-23', value: 31.11 },
    { time: '2018-12-24', value: 27.02 },
    { time: '2018-12-25', value: 27.32 },
    { time: '2018-12-26', value: 25.17 },
    { time: '2018-12-27', value: 28.89 },
    { time: '2018-12-28', value: 25.46 },
    { time: '2018-12-29', value: 23.92 },
    { time: '2018-12-30', value: 22.68 },
    { time: '2018-12-31', value: 22.67 },
];