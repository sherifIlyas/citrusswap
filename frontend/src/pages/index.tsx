import { Box, Container, Heading, Text, VStack, Button, useDisclosure, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { useState, useEffect } from 'react';
// WalletModal component moved from WalletModal.tsx
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
  const [selectedToken, setSelectedToken] = useState<any>(null);

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
      <VStack spacing={6} align="stretch" mt={20}>
        <Box textAlign="center" position="relative">
          <TokenModal isOpen={isModalOpen} onClose={onModalClose} onSelect={setSelectedToken} />
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
              onClick={onModalOpen}
            >
              {selectedToken ? (
                <>
                  <Image
                    src={`/shadow-assets/blockchains/sonic/assets/${selectedToken.address}/logo.png`}
                    boxSize="24px"
                    borderRadius="full"
                    mr={2}
                    fallbackSrc='/placeholder-coin.png' bg='gray.800'
                  />
                  <Text>{selectedToken.symbol}</Text>
                </>
              ) : (
                <Box />
              )}
              <Text>v</Text>
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
              onClick={onModalOpen}
            >
              {selectedToken ? (
                <>
                  <Image
                    src={`/shadow-assets/blockchains/sonic/assets/${selectedToken.address}/logo.png`}
                    boxSize="24px"
                    borderRadius="full"
                    mr={2}
                    fallbackSrc='/placeholder-coin.png' bg='gray.800'
                  />
                  <Text>{selectedToken.symbol}</Text>
                </>
              ) : (
                <Box />
              )}
              <Text>v</Text>
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
        </Box>
      </VStack>
    </Container>
  );
}