import React from "react";
import useSWR from "swr";
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Card,
  CardBody,
  CardHeader,
  Badge,
  IconButton,
  Spinner,
  Input,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Code,
  useDisclosure,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import TableInput from "./TableInput";

export default function PurposeTable({ props }) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const [modalName, setNewModalName] = React.useState("");
  const [modalId, setNewModalId] = React.useState(-1);
  const [submitable, setSubmitable] = React.useState(false);
  const { data, mutate, isLoading } = useSWR(
    "/api/dashboard/purpose/get",
    fetcher
  );
  const toast = useToast();
  const {isOpen,onOpen,onClose} = useDisclosure()

  function handleDelete(id) {
    fetch("/api/dashboard/purpose/delete", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => {
        res.status == 400 &&
          toast({
            title: "Error Deleting",
            description:
              "Please remove or re-assign all child items before deleting.",
            status: "error",
            position: "top",
          });
      })
      .then((res) => mutate())
  }

  function verifyDelete(e, id, name){
    onOpen();
    setNewModalName(name);
    setNewModalId(id);
  }

  if (isLoading)
    return (
      <Card width={"100%"} alignItems={"center"}>
        <CardBody>
          <Spinner color="orange.500" size={"xl"} />
        </CardBody>
      </Card>
    );

  return (
    <Card width={"100%"}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Purpose?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>You are deleting a purpose, this will orphan any associated items (remove their parent purpose). Are you sure you want to do this?</Text>
            <form>
              <Input onChange={e=>{setSubmitable(e.target.value == modalName)}}></Input>
            </form>
            <Text mt={2}>Please type <Code colorScheme={"orange"} fontSize={"sm"}>{modalName}</Code> into the box above to confirm.</Text>
          </ModalBody>

          <ModalFooter>
            <Button 
              isLoading={!submitable}
              colorScheme={"red"}
              onClick={e => {
                onClose();
                setSubmitable(false);
                handleDelete(modalId);
              }} 
              >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <CardHeader>
        <TableInput color={'orange.500'} createEndpoint={'/api/dashboard/purpose/add'} mutator={mutate} tabletype={'Purpose'}/>
      </CardHeader>
      <CardBody>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Item Count</Th>
                <Th>Remove</Th>
              </Tr>
            </Thead>
            <Tbody>
              {!data.message &&
                data
                  .sort((a, b) => (a._count.items < b._count.items ? 1 : -1))
                  .map((purpose) => (
                    <Tr key={purpose.id}>
                      <Td>
                        <Badge colorScheme={"orange"} fontSize={"sm"}>
                          {purpose.name}
                        </Badge>
                      </Td>
                      <Td>{purpose._count.items}</Td>
                      <Td>
                        <IconButton
                          size={"sm"}
                          _hover={{ bg: "red.500" }}
                          icon={<CloseIcon />}
                          onClick={e => verifyDelete(e, purpose.id, purpose.name)}
                        />
                      </Td>
                    </Tr>
                  ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
}
