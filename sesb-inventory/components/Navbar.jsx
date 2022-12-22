import React from "react";
import {
  Avatar,
  HStack,
  Spacer,
  VStack,
  Link,
  IconButton,
  Text,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

import {
  HamburgerIcon,
  SunIcon,
  MoonIcon,
  CalendarIcon,
  LockIcon
} from "@chakra-ui/icons";

import { signOut } from "next-auth/react";

export default function NavBar({ session, props }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  console.log(session);
  return (
    <HStack
      paddingX={5}
      paddingY={3}
      marginBottom={5}
      bg={useColorModeValue("white", "black")}
      fontFamily={"navbar.200"}
      position={""}
      width={"100%"}
      spacing={3}
    >
      <Avatar
        size={{ base: "sm", md: "sm", lg: "md" }}
        name="Science and Engineering Student Board"
        src={"/SESB.webp"}
        as="a"
        href="/"
      />
      <Text
        as="a"
        href="/"
        fontFamily={"navbar.600"}
        fontSize={{ base: "lg", md: "2xl" }}
      >
        SESB Inventory
      </Text>
      <Spacer />
      <IconButton
        size="sm"
        onClick={toggleColorMode}
        icon={useColorModeValue(<SunIcon />, <MoonIcon color={"yellow.300"} />)}
      />
      {session && (
        <IconButton
          ref={btnRef}
          _dark={{colorScheme:'black'}}
          _light={{colorScheme:'gray'}}
          size="sm"
          onClick={onOpen}
          icon={<HamburgerIcon />}
        ></IconButton>
      )}
      {session && 
      <Drawer placement={"right"} onClose={onClose} isOpen={isOpen} size={"xs"}>
        <DrawerOverlay />
        <DrawerContent
          paddingY={10}
          _light={{bg:'white'}}
          _dark={{bg:'black'}}
        >
          <DrawerCloseButton />
          <DrawerBody>
            <VStack fontSize={"xl"} alignItems={"start"}>
              <Link href="/dashboard/ledger" onClick={onClose}>
                <CalendarIcon /> Ledger
              </Link>
              <Link onClick={signOut}>
                <LockIcon /> Sign Out
              </Link>
              <Divider/>
              <VStack alignItems={'center'} width={"100%"} fontSize={'sm'}>
                <Avatar
                  size={{base:'lg',md:'xl'}}
                  name={session.user.name}
                  src={session.user.image}
                />
                <Text>Welcome Back</Text>
                <Text>{session.user.name}</Text>
              </VStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>}
    </HStack>
  );
}
