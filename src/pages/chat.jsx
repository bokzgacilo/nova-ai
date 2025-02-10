import { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";
import { FiSend } from "react-icons/fi";
import { FiTrash } from "react-icons/fi";
import LOGO from "../assets/icon-only.png";
import BACKGROUND from "../assets/hexagon.png";
import { BiCopy, BiLogoYoutube, BiPencil } from "react-icons/bi";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Stack,
  Spinner,
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
  Image,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

function Chat() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [InputPrompt, SetInputPrompt] = useState("");
  const [Loading, setLoading] = useState(false);
  const [PromptArray, SetPromptArray] = useState([]);

  useEffect(() => {
    console.log(PromptArray);
  }, [PromptArray]);

  const getSearchResults = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/customsearch/v1`,
        {
          params: {
            key: "AIzaSyCPTVx7extfB2xgx3qJ-6qWE-NT7YJ4KTU",
            cx: "d0a2fabdf5d414739",
            q: InputPrompt,
            num: 10,
          },
        }
      );

      const transformedArray = response.data.items.map((item) => ({
        link: item.link,
        title: item.title,
        thumbnail: item.pagemap?.cse_thumbnail?.[0]?.src,
      }));
      return transformedArray;
    } catch (error) {
      console.error("Error fetching search results:", error);
      return [];
    }
  };

  const getPromptResponse = async () => {
    const genAI = new GoogleGenerativeAI(
      "AIzaSyCPTVx7extfB2xgx3qJ-6qWE-NT7YJ4KTU"
    );

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

      const generationConfig = {
        temperature: 0.3,
        maxOutputTokens: 64,
      };

      const result = await model.generateContent(InputPrompt, generationConfig);
      const prompt_response = result.response.text();

      return prompt_response;
    } catch (error) {
      console.log(error);
    }
  };

  const HandlePrompt = async () => {
    setLoading(true);
    const video_links = await getSearchResults();
    const prompt_response = await getPromptResponse();

    SetPromptArray((prevData) => [
      ...prevData,
      {
        prompt: InputPrompt,
        response: prompt_response,
        video_links: video_links,
      },
    ]);
    setLoading(false);
    SetInputPrompt("");
  };

  const HandleClearHistory = () => {
    onClose();
    SetInputPrompt("");
    SetPromptArray([]);
  };

  const HandleCopy = (index) => {
    navigator.clipboard
      .writeText(PromptArray[index].response)
      .then(() => {
        // If successfully copied, show the alert and toast
        toast({
          title: "Copy Successful!",
          description: "Prompt successfully copied to your clipboard.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          title: "Copy failed.",
          description: "There was an issue copying the text to the clipboard.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const HandleRemoveHistory = (index) => {

    toast({
      title: "Prompt Removed!",
      description: PromptArray[index].prompt + " removed successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    const updatedArray = PromptArray.filter((_, i) => i !== index)


    SetPromptArray(updatedArray)
  };

  return (
    <Container
      backgroundColor="#ededed"
      maxW="600px"
      p={0}
    >
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>History</DrawerHeader>
          <DrawerBody>
            <Stack spacing={4}>
              {PromptArray.length > 0 ? (
                PromptArray.map((prompt, index) => (
                  <Flex key={index} direction='row' alignItems='center' gap={4}>
                    <Icon boxSize={4} as={FiTrash} onClick={() => HandleRemoveHistory(index)} />
                    <Text key={index}>{prompt.prompt}</Text>
                  </Flex>
                ))
              ) : (
                <Text fontWeight="500">No prompt to show</Text>
              )}
              <Button
                leftIcon={<FiTrash />}
                onClick={HandleClearHistory}
                colorScheme="red"
              >
                Clear History
              </Button>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Flex height="100vh" direction="column">
        <Flex
          p={4}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          backgroundColor="#fff"
        >
          <Flex direction="row" alignItems="center" gap={4}>
            <Image boxSize="32px" objectFit="cover" src={LOGO} />
            <Heading size="lg">Nova AI</Heading>
          </Flex>
          <Icon boxSize={6} as={FiClock} onClick={onOpen} />
        </Flex>
        <Stack
          borderRadius={4}
          flex={1}
          overflowY="auto"
          spacing={4}
          pr={4}
          pl={4}
        >
          {PromptArray.length > 0
            ? PromptArray.map((prompt, index) => (
                <Stack key={index} pb={4} mt={2}>
                  <Text
                    pt={2}
                    pb={2}
                    pr={4}
                    pl={4}
                    fontSize="md"
                    fontWeight="semibold"
                    alignSelf="flex-end"
                    color="#F8F8F8"
                    backgroundColor="#006AFF"
                    borderRadius={8}
                  >
                    {prompt.prompt}
                  </Text>
                  <Tabs size="sm" backgroundColor="#F8F8F8">
                    <TabList>
                      <Tab>
                        <Icon as={BiPencil} mr={2} />
                        Prompt
                      </Tab>
                      <Tab>
                        <Icon as={BiLogoYoutube} mr={2} />
                        Video
                      </Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <Flex direction="row" justifyContent="flex-end" mb={4}>
                          <Button
                            align="flex-end"
                            size="sm"
                            leftIcon={<BiCopy />}
                            onClick={() => HandleCopy(index)}
                          >
                            Copy
                          </Button>
                        </Flex>
                        <Box
                          as="pre"
                          whiteSpace="pre-wrap"
                          wordBreak="break-word"
                          fontSize="14px"
                        >
                          {prompt.response}
                        </Box>
                      </TabPanel>
                      <TabPanel>
                        <Stack spacing={4}>
                          {prompt.video_links.map((video, index) => (
                            <Flex key={index} direction="row" gap={2}>
                              <Image
                                src={video.thumbnail}
                                alt={video.title}
                                width="20%"
                                height="auto"
                                objectFit="cover"
                              />
                              <a target="_blank" href={video.link}>
                                {video.title}
                              </a>
                            </Flex>
                          ))}
                        </Stack>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </Stack>
              ))
            : !Loading && (
                <Flex
                  height="100vh"
                  justifyContent="center"
                  direction="column"
                  alignItems="center"
                  gap={4}
                  p={2}
                  borderRadius={4}
                >
                  <Text fontWeight="bold" fontSize="36px" textAlign="center">
                    Welcome to <br />
                    Nova AI
                  </Text>
                </Flex>
              )}
          {Loading && (
            <Flex justifyContent="center" gap={4} p={2} borderRadius={4}>
              <Spinner />
              <Text fontWeight="500">Generating Answer...</Text>
            </Flex>
          )}
        </Stack>
        <Flex
          direction="row"
          gap={2}
          p={4}
          backgroundColor="#fff"
          alignItems="center"
          justifyContent="space-between"
        >
          <Input
            value={InputPrompt}
            onChange={(e) => SetInputPrompt(e.target.value)}
            placeholder="Message Nova AI"
            type="text"
          />
          <Button
            leftIcon={<FiSend />}
            onClick={HandlePrompt}
            colorScheme="blue"
          >
            Send
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
}

export default Chat;
