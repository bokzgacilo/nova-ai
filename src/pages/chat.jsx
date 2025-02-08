import { initializeApp } from "firebase/app";
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
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Card,
  CardBody,
  Image,
} from "@chakra-ui/react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDatabase, ref, set } from "firebase/database";
import axios from "axios";

const firebaseConfig = {
  apiKey: "AIzaSyB4fTVJM0CS6RBrIsjW65Y4525kJezRIms",
  authDomain: "nova-ai-450014.firebaseapp.com",
  databaseURL:
    "https://nova-ai-450014-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nova-ai-450014",
  storageBucket: "nova-ai-450014.firebasestorage.app",
  messagingSenderId: "454543426095",
  appId: "1:454543426095:web:d66880345d133f447cfcda",
};

// Initialize Firebase

function Chat() {
  const app = initializeApp(firebaseConfig);
  const {isOpen, onOpen, onClose } = useDisclosure();
  const [InputPrompt, SetInputPrompt] = useState("");
  const [promptResponses, setpromptResponses] = useState([]);
  const [promptInput, setPromptInput] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [itemsArray, setItemsArray] = useState([]);

  const genAI = new GoogleGenerativeAI(
    "AIzaSyCPTVx7extfB2xgx3qJ-6qWE-NT7YJ4KTU"
  );

  const getSearchResults = async () => {
    getResponseForGivenPrompt();
    const url = `https://www.googleapis.com/customsearch/v1`;

    try {
      const response = await axios.get(url, {
        params: {
          key: "AIzaSyCPTVx7extfB2xgx3qJ-6qWE-NT7YJ4KTU",
          cx: "d0a2fabdf5d414739",
          q: InputPrompt,
          num: 2,
        },
      });

      const links = response.data.items.map((item) => item.link);
      const transformedArray = response.data.items.map((item) => ({
        link: item.link,
        title: item.title,
        thumbnail: item.pagemap?.cse_thumbnail?.[0]?.src, // Safe access to thumbnail using optional chaining
      }));

      setItemsArray(transformedArray);

      return links;
    } catch (error) {
      console.error("Error fetching search results:", error);
      return [];
    }
  };

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
      const database = getDatabase(app);

      setpromptResponses([...promptResponses, text]);
      set(ref(database, "/chats/" + "sess1/" + InputPrompt), {
        question: InputPrompt,
        answer: text,
      });
    } catch (error) {
      console.log(error);
      console.log("Something Went Wrong");
      setLoading(false);
    }
  };

  const HandleClearHistory = () => {
    SetInputPrompt([]);
    setpromptResponses([]);
    setItemsArray([]);
    setPromptInput([]);
    onClose()
  };

  return (
    <Container maxW="600px">
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>History</DrawerHeader>
          <DrawerBody>
            <Stack>
              <Button onClick={HandleClearHistory} colorScheme="red">
                Clear History
              </Button>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

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
            onClick={onOpen}
            size="sm"
            name="Dan Abrahmov"
            src="https://bit.ly/dan-abramov"
          />
        </Flex>
        <Stack borderRadius={4} flex={1} overflowY="auto">
          {promptInput.length > 0 ? (
            promptInput.map((prompt, index) => (
              <Stack key={index}>
                <Box>
                  <Text fontSize="md" fontWeight="bold">
                    {prompt}
                  </Text>
                </Box>
                {Loading ? (
                  <Flex justifyContent="center" gap={4} p={2} borderRadius={4}>
                    <Spinner />
                    <Text fontWeight="500">Generating Answer...</Text>
                  </Flex>
                ) : (
                  <Tabs size="sm">
                    <TabList>
                      <Tab>Prompt</Tab>
                      <Tab>Video</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel p={0}>
                        <Box
                          mt={2}
                          as="pre"
                          whiteSpace="pre-wrap"
                          wordBreak="break-word"
                        >
                          <Text>
                            {promptResponses[index] && (
                              <Box
                                as="pre"
                                whiteSpace="pre-wrap"
                                wordBreak="break-word"
                                fontSize="14px"
                              >
                                {promptResponses[index]}
                              </Box>
                            )}
                          </Text>
                        </Box>
                      </TabPanel>
                      <TabPanel p={0}>
                        <Stack spacing={4}>
                          {itemsArray.length > 0 &&
                            itemsArray.map((item, index) => (
                              <Card key={index}>
                                <CardBody p={4}>
                                  <Stack>
                                    <Image
                                      src={item.thumbnail}
                                      alt={item.title}
                                    />
                                    <a href={item.link}>{item.title}</a>
                                  </Stack>
                                </CardBody>
                              </Card>
                            ))}
                        </Stack>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                )}
              </Stack>
            ))
          ) : (
            <Flex justifyContent="center" gap={4} p={2} borderRadius={4}>
              <Text fontWeight="500">Welcome to Nova AI</Text>
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
          <Button onClick={getSearchResults} colorScheme="blue">
            Send
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
}

export default Chat;
