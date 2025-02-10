import { Button, Container, Flex, Heading, Image, Text } from "@chakra-ui/react";
import LOGO from "../assets/icon-only.png";
import { useNavigate } from "react-router-dom";

export default function SplashScreen() {
  const navigate = useNavigate();

  return (
    <Container maxW="600px" height='100vh'>
      <Flex
        direction='column'
        alignItems='center'
        p={4}
        height='100%'
      >
        <Image mt='40%' boxSize="120px" objectFit="cover" src={LOGO} />
        <Heading mt={2} mb={4}>Nova AI</Heading>
        <Button mt={4} colorScheme="blue" size="lg" w='100%' onClick={() => {navigate('/chat')}}>
          Start Chatting
        </Button>
        <Text mt='auto' fontWeight='bold' fontSize='12px' color='#3c3c3c'>Powered by Google Gemini AI</Text>
      </Flex>
    </Container>
  );
}
