import React, { useState } from "react";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import PageLayout from "../../components/Layout/PageLayout";
import UserCard from "../../components/Dashboard/UserCard";
import useSWR from "swr";
import {
  SimpleGrid,
  VStack,
  Alert,
  AlertTitle,
  AlertIcon,
  Heading,
  HStack,
  Stack,
  Input,
  Text,
  Switch,
  Box,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Code,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

export default function Users({ session, props }) {
  const toast = useToast();
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const [queryParams, setQueryParams] = useState({
    name: "",
    isActive: false,
    isAdmin: false,
    skip: 0,
  });
  const [submitable, setSubmitable] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, mutate, isLoading } = useSWR(
    `/api/dashboard/users/get_auth?name=${queryParams.name}&active=${queryParams.isActive}&admin=${queryParams.isAdmin}&skip=${queryParams.skip}`,
    fetcher
  );

  function handleAdmin(e) {
    if (session.user.id !== selectedUser.id) {
      const changingVal = {
        ...selectedUser,
        isAdmin: !selectedUser.isAdmin,
      };

      fetch("/api/dashboard/users/modify_auth", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changingVal),
      }).then((res) => {
        if (res.status != 200) {
          toast({
            title: "Update Failed",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        } else {
          selectedUser.recall(changingVal);
          toast({
            title: `${changingVal.name} ${
              changingVal.isAdmin ? "Authorized" : "Unauthorized"
            }`,
            status: `${changingVal.isAdmin ? "success" : "error"}`,
            duration: 9000,
            isClosable: true,
          });
        }
      });
    } else {
      toast({
        title: 'You cannot modify your own admin status.',
        status: 'error',
        description:'Please contact another admin to modify your permission.',
        duration: 9000,
        isClosable: true,
      });
    }
  }

  return (
    <PageLayout session={session}>
      {selectedUser && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedUser.isAdmin ? "Unauthorize" : "Authorize"}{" "}
              {selectedUser.name}?
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={2}>
                You are {selectedUser.isAdmin ? "unauthorizing" : "authorizing"}{" "}
                {selectedUser.name}. This means that {selectedUser.name} will{" "}
                {selectedUser.isAdmin ? "lose" : "gain"} the ability to
                add/edit/modify items in the database permanently.
              </Text>
              <form onSubmit={(e) => e.preventDefault()}>
                <Input
                  onInput={(e) => {
                    setSubmitable(e.target.value);
                  }}
                ></Input>
              </form>
              <Text mt={2}>
                Please type{" "}
                <Code
                  colorScheme={selectedUser.isAdmin ? "red" : "green"}
                  fontSize={"sm"}
                >
                  {selectedUser.name}
                </Code>{" "}
                into the box above to confirm.
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button
                isLoading={
                  selectedUser ? submitable != selectedUser.name : false
                }
                colorScheme={selectedUser.isAdmin ? "red" : "green"}
                onClick={(e) => {
                  onClose();
                  setSubmitable("");
                  handleAdmin();
                }}
              >
                {selectedUser.isAdmin ? "Unauthorize" : "Authorize"}{" "}
                {selectedUser.name}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <VStack width={"100%"}>
        <VStack>
          <Heading>User Control</Heading>
          {isLoading ? (
            <Text>Loading Content</Text>
          ) : (
            <Text>
              Showing {queryParams.skip} -{" "}
              {data.length < 10
                ? queryParams.skip + data.length
                : queryParams.skip + 10}{" "}
              users
            </Text>
          )}
        </VStack>
        <Stack
          width={{ base: "100%", md: "75%", lg: "50%" }}
          direction={{ base: "column", lg: "row" }}
          alignItems={"center"}
        >
          <VStack width={"100%"} alignItems={"start"}>
            <Text whiteSpace={"nowrap"}>Name</Text>
            <Input
              focusBorderColor={"blue.500"}
              placeholder={"Specify User's Name"}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  e.target.blur();
                }
              }}
              onBlur={(e) =>
                setQueryParams((queryParams) => ({
                  ...queryParams,
                  skip: 0,
                  name: e.target.value,
                }))
              }
            />
          </VStack>
          <HStack>
            <Box>
              <Text whiteSpace={"nowrap"}>Require Active?</Text>
              <Switch
                size={"lg"}
                onChange={(e) => {
                  setQueryParams((queryParams) => ({
                    ...queryParams,
                    skip: 0,
                    isActive: e.target.checked,
                  }));
                }}
              />
            </Box>
            <Box>
              <Text whiteSpace={"nowrap"}>Require Admin?</Text>
              <Switch
                size={"lg"}
                onChange={(e) => {
                  setQueryParams((queryParams) => ({
                    ...queryParams,
                    skip: 0,
                    isAdmin: e.target.checked,
                  }));
                }}
              />
            </Box>
          </HStack>
        </Stack>
        {isLoading ? (
          <h1>Loading</h1>
        ) : data.length ? (
          <>
            <HStack justifyContent={"space-between"} width={"100%"}>
              <IconButton
                colorScheme={"blue"}
                size={{ base: "sm", md: "md" }}
                hidden={queryParams.skip <= 0}
                onClick={(e) => {
                  setQueryParams((queryParams) => ({
                    ...queryParams,
                    skip: queryParams.skip - 10,
                  }));
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <VStack
                alignItems={
                  queryParams.skip <= 0
                    ? "flex-start"
                    : data.length < 10
                    ? "flex-end"
                    : "center"
                }
              ></VStack>
              <IconButton
                colorScheme={"blue"}
                size={{ base: "sm", md: "md" }}
                hidden={data.length < 10}
                onClick={(e) => {
                  setQueryParams((queryParams) => ({
                    ...queryParams,
                    skip: queryParams.skip + 10,
                  }));
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </HStack>
            <SimpleGrid columns={[1, 1, 3, 4, 5]} gap={4}>
              {data.map((user) => (
                <UserCard
                  user={user}
                  key={user.id}
                  toast={toast}
                  userSelector={setSelectedUser}
                  modalControl={onOpen}
                />
              ))}
            </SimpleGrid>
          </>
        ) : (
          <Alert
            status="warning"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            rounded={5}
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              No users fitting your criteria were found.
            </AlertTitle>
          </Alert>
        )}
      </VStack>
    </PageLayout>
  );
}
export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session || !session.user.isAdmin) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
