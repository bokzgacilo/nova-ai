import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Stack,
  Spinner,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [InputPrompt, SetInputPrompt] = useState("");
  const [promptResponses, setpromptResponses] = useState([]);
  const [promptInput, setPromptInput] = useState([]);
  const [Loading, setLoading] = useState(false);
  const genAI = new GoogleGenerativeAI(
    "AIzaSyCPTVx7extfB2xgx3qJ-6qWE-NT7YJ4KTU"
  );

  const getResponseForGivenPrompt = async () => {
    setLoading(true);
    setPromptInput([...promptInput, InputPrompt]);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

      const generationConfig = {
        // Add generation configuration
        temperature: 0.3, // Adjust for shorter, more predictable responses
        maxOutputTokens: 64, // Limit the number of output tokens (adjust as needed)
      };

      const result = await model.generateContent(InputPrompt, generationConfig);
      SetInputPrompt("");
      const response = result.response;
      const text = response.text();
      setLoading(false);
      setpromptResponses([...promptResponses, text]);
    } catch (error) {
      console.log(error);
      console.log("Something Went Wrong");
      setLoading(false);
    }
  };
  return (
    <Container maxW="600px">
      <Flex height="100vh" direction="column">
        <Flex
          mt={4}
          mb={4}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading size="lg">Nova AI</Heading>
          <Avatar
            size="sm"
            name="Dan Abrahmov"
            src="https://bit.ly/dan-abramov"
          />
        </Flex>
        <Stack borderRadius={4} flex={1}  overflowY="auto">
          {promptInput.map((prompt, index) => (
            <Stack key={index} spacing={2}>
              <Box p={4} borderRadius={4} bg="gray.200">
                <Text fontWeight="500">{prompt}</Text>
              </Box>
              {promptResponses[index] && ( // Show the text when Loading is NOT true
                <Box p={4} bg="blue.400" borderRadius={4} color="white">
                  <Text>{promptResponses[index]}</Text>
                </Box>
              )}
            </Stack>
          ))}
          {Loading && (
            <Flex
              justifyContent="center"
              gap={4}
              bg="gray.200"
              p={2}
              borderRadius={4}
            >
              <Spinner />
              <Text fontWeight="500">Generating Answer...</Text>
            </Flex>
          )}
        </Stack>
        <Flex
          direction="row"
          gap={2}
          mt={4}
          mb={4}
          alignItems="center"
          justifyContent="space-between"
        >
          <Input
            value={InputPrompt}
            onChange={(e) => SetInputPrompt(e.target.value)}
            placeholder="Message Nova AI"
            type="text"
          />
          <Button onClick={getResponseForGivenPrompt} colorScheme="blue">
            Send
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
}

export default App;
