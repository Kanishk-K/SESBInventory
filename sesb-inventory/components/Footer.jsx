import React from "react";
import {
  SimpleGrid,
  Flex,
  Avatar,
  useColorModeValue,
  VStack,
  Text,
} from "@chakra-ui/react";

export default function Footer({ props }) {
  return (
    <SimpleGrid
      marginTop={5}
      paddingX={5}
      paddingY={3}
      columns={{ base: 1, md: 2 }}
      spacing={3}
      justifyContent={"space-between"}
      fontFamily={"navbar.200"}
      bg={useColorModeValue("white", "black")}
    >
      <Flex
        flexDirection={{ base: "column", md: "row" }}
        justifyContent={{ base: "center", md: "start" }}
        spacing={2}
      >
        <Avatar
          name="Kanishk Kacholia"
          alignSelf={"center"}
          src={"/Kanishk.jpg"}
          as="a"
          href="https://www.kanishkkacholia.com/"
          target={'_blank'}
          marginRight={{ base: 0, md: 3 }}
        />
        <VStack
          alignItems={{ base: "center", md: "start" }}
        >
          <Text>Kanishk Kacholia</Text>
          <Text display={{ base: "none", md: "flex" }}>
            Class of 2025
          </Text>
        </VStack>
      </Flex>

      <Flex
        flexDirection={{ base: "column-reverse", md: "row" }}
        justifyContent={{ base: "center", md: "end" }}
        spacing={2}
      >
        <VStack
          alignItems={{ base: "center", md: "end" }}
          justifyContent={'center'}
        >
          <Text>SESB Student Board 2022-2023</Text>
        </VStack>
        <Avatar
          name="Kanishk Kacholia"
          alignSelf={"center"}
          src={"/SESB.webp"}
          as="a"
          href="/"
          marginLeft={{ base: 0, md: 3 }}
        />
      </Flex>
    </SimpleGrid>
  );
}
