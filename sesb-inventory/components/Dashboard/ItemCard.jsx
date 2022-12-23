import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Stack,
  Heading,
  Text,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  HStack,
  Breadcrumb,
  BreadcrumbItem,
  Badge,
  VStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Code,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import {
  ChevronRightIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  EditIcon,
  SmallCloseIcon,
  CheckIcon,
} from "@chakra-ui/icons";
import { useRouter } from "next/router";

export default function ItemCard({ itemObject, session, mutator, props }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDelOpen,
    onOpen: onDelOpen,
    onClose: onDelClose,
  } = useDisclosure();
  const [handleCase, setHandleCase] = useState("");
  const [reason, setReason] = useState("");
  const [deleteVal, setDelete] = useState("");

  const [itemName, setItemName] = useState(itemObject.name || "");
  const [itemQuantity, setItemQuantity] = useState(itemObject.quantity || 0);
  const [itemPrice, setItemPrice] = useState(itemObject.price || 0);
  const [itemAffiliation, setItemAffiliation] = useState(
    itemObject.affiliation
  );
  const [itemStorage, setItemStorage] = useState(itemObject.storage);
  const [itemPurpose, setItemPurpose] = useState(
    itemObject.purpose || { id: -1, name: "None" }
  );
  const [itemDescription, setItemDescription] = useState(
    itemObject.description || ""
  );
  const [itemLocation, setItemLocation] = useState(itemObject.location || "");

  const [affiliations, setAffiliations] = useState([]);
  const [purposes, setPurposes] = useState([]);
  const [storages, setStorages] = useState([]);

  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (affiliations.length == 0) {
      fetch("/api/dashboard/affiliation/get")
        .then((res) => res.json())
        .then((data) => setAffiliations(data));
    }
    if (purposes.length == 0) {
      fetch("/api/dashboard/purpose/get")
        .then((res) => res.json())
        .then((data) => {
          data.push({ id: -1, name: "None", _count: { items: -1 } });
          setPurposes(data);
        });
    }
    if (storages.length == 0) {
      fetch("/api/dashboard/storage/get")
        .then((res) => res.json())
        .then((data) => setStorages(data));
    }
  });

  const [isModifying, setIsModifying] = useState(!itemObject);

  function handleTransaction() {
    const action = handleCase == "Withdraw" ? 3 : 2;
    const apiReason = reason;
    setReason("");
    setHandleCase("");
    onClose();
    fetch("/api/dashboard/transactions/add", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason: apiReason,
        action: action,
        itemId: itemObject.id,
      }),
    }).then((e) => mutator());
  }

  function verifyInputs() {
    if (itemName == "") {
      return { success: false, message: "Name cannot be empty" };
    }
    if (itemQuantity < 0) {
      return { success: false, message: "Quantity cannot be negative" };
    }
    if (itemPrice < 0) {
      return {
        success: false,
        message: "The price of an item cannot be negative",
      };
    }
    if (itemDescription == "") {
      return {
        success: false,
        message: "You must provide a description for the item",
      };
    }
    if (itemLocation == "") {
      return {
        success: false,
        message: "There must be a provided sub-location for the item",
      };
    }
    return { success: true, message: "Submitting modifications to server." };
  }

  function handleModify() {
    const valid = verifyInputs();
    if (valid.success) {
      fetch("/api/dashboard/items/modify", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: itemObject.id,
          name: itemName,
          description: itemDescription,
          price: parseInt(itemPrice),
          quantity: parseInt(itemQuantity),
          location: itemLocation,
          affiliation: parseInt(itemAffiliation.id),
          purpose: parseInt(itemPurpose.id),
          storage: parseInt(itemStorage.id),
        }),
      }).then((res) => {
        if (res.status == 200) {
          toast({
            title: "Object Updated",
            status: "success",
            isClosable: true,
          });
          setIsModifying(false);
        } else {
          toast({
            title: "Submission Error",
            description: res.message,
            status: "error",
            isClosable: true,
          });
        }
      });
    } else {
      toast({
        title: "Validation Error",
        description: valid.message,
        status: "error",
        isClosable: true,
      });
    }
  }

  function handleDelete() {
    fetch("/api/dashboard/items/delete", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: itemObject.id,
      }),
    }).then((res) => {
      if (res.status == 200) {
        toast({
          title: "Object Deleted",
          status: "success",
          isClosable: true,
        });
        router.push('/dashboard');
      } else {
        toast({
          title: "Deletion Error",
          description: res.message,
          status: "error",
          isClosable: true,
        });
      }
    });
  }

  return (
    <>
      <Modal isOpen={isDelOpen} onClose={onDelClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete {itemName}?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={(e) => e.preventDefault()}>
              <FormControl>
                <FormLabel>
                  Are you sure you want to delete {itemName}?
                </FormLabel>
                <Input onInput={(e) => setDelete(e.target.value)}></Input>
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </form>
            <Text mt={2}>
              Please type{" "}
              <Code colorScheme={"red"} fontSize={"sm"}>
                {itemName}
              </Code>{" "}
              into the box above to confirm.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={itemName != deleteVal}
              colorScheme={"red"}
              onClick={(e) => {
                onClose();
                handleDelete();
              }}
            >
              Delete {itemName}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {handleCase} {itemName}?
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={(e) => e.preventDefault()}>
              <FormControl>
                <FormLabel>
                  Why are you {handleCase.toLowerCase()}ing {itemName}?
                </FormLabel>
                <Input onInput={(e) => setReason(e.target.value)}></Input>
                <FormErrorMessage></FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={!reason}
              colorScheme={handleCase == "Withdraw" ? "orange" : "blue"}
              onClick={(e) => {
                onClose();
                handleTransaction();
              }}
            >
              {handleCase} {itemName}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Card>
        <CardBody>
          <Stack spacing="3">
            {isModifying ? (
              <Input
                placeholder={"Item Name"}
                value={itemName}
                onInput={(e) => setItemName(e.target.value)}
                borderColor={"blue.500"}
                focusBorderColor={"blue.500"}
              ></Input>
            ) : (
              <Heading size="md">{itemName}</Heading>
            )}
            <HStack
              justifyContent={"space-between"}
              display={isModifying ? "none" : "flex"}
            >
              <Stat>
                <StatLabel>Quantity</StatLabel>
                <StatNumber>{itemQuantity}</StatNumber>
              </Stat>
              {itemPrice && (
                <Stat>
                  <StatLabel>Price</StatLabel>
                  <StatNumber>${(itemPrice / 100).toFixed(2)}</StatNumber>
                </Stat>
              )}
            </HStack>
            <HStack display={isModifying ? "flex" : "none"}>
              <Stack>
                <Text>Quantity</Text>
                <NumberInput
                  defaultValue={itemQuantity}
                  min={0}
                  onChange={(val) => setItemQuantity(val)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Stack>
              <Stack>
                <Text>Price</Text>
                <NumberInput
                  defaultValue={itemPrice / 100}
                  min={0}
                  onChange={(val) => setItemPrice(val * 100)}
                  precision={2}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Stack>
            </HStack>
            <Divider />
            <Breadcrumb
              pt="3"
              separator={<ChevronRightIcon />}
              display={isModifying ? "none" : "flex"}
            >
              <BreadcrumbItem>
                <VStack>
                  <Badge colorScheme={"green"} fontSize={"sm"}>
                    {itemAffiliation.name}
                  </Badge>
                  {itemPurpose.id != -1 && (
                    <Badge colorScheme={"orange"} fontSize={"sm"}>
                      {itemPurpose.name}
                    </Badge>
                  )}
                </VStack>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Text>{itemDescription}</Text>
              </BreadcrumbItem>
            </Breadcrumb>
            <VStack display={isModifying ? "flex" : "none"}>
              <Select
                borderColor={"green.500"}
                focusBorderColor={"green.500"}
                onChange={(e) =>
                  setItemAffiliation(
                    affiliations.find((item) => item.id == e.target.value)
                  )
                }
              >
                {affiliations
                  .sort((a, b) =>
                    a.id == itemAffiliation.id
                      ? -1
                      : b.id == itemAffiliation.id
                      ? 1
                      : b._count.items - a._count.items
                  )
                  .map((affiliation) => (
                    <option value={affiliation.id} key={affiliation.id}>
                      {affiliation.name}
                    </option>
                  ))}
              </Select>
              <Select
                borderColor={"orange.500"}
                focusBorderColor={"orange.500"}
                onChange={(e) =>
                  setItemPurpose(
                    purposes.find((item) => item.id == e.target.value)
                  )
                }
              >
                {purposes
                  .sort((a, b) =>
                    a.id == itemPurpose.id
                      ? -1
                      : b.id == itemPurpose.id
                      ? 1
                      : b._count.items - a._count.items
                  )
                  .map((purpose) => (
                    <option value={purpose.id} key={purpose.id}>
                      {purpose.name}
                    </option>
                  ))}
              </Select>
              <Textarea
                placeholder={"Please write a description here"}
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
              />
            </VStack>
            <Divider />
            <Breadcrumb
              pt="3"
              separator={<ChevronRightIcon />}
              display={isModifying ? "none" : "flex"}
            >
              <BreadcrumbItem>
                <Badge colorScheme={"purple"} fontSize={"sm"}>
                  {itemStorage.name}
                </Badge>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Text>{itemLocation}</Text>
              </BreadcrumbItem>
            </Breadcrumb>
            <VStack display={isModifying ? "flex" : "none"}>
              <Select
                borderColor={"purple.500"}
                focusBorderColor={"purple.500"}
                onChange={(e) =>
                  setItemStorage(
                    storages.find((item) => item.id == e.target.value)
                  )
                }
              >
                {storages
                  .sort((a, b) =>
                    a.id == itemStorage.id
                      ? -1
                      : b.id == itemStorage.id
                      ? 1
                      : b._count.items - a._count.items
                  )
                  .map((storage) => (
                    <option value={storage.id} key={storage.id}>
                      {storage.name}
                    </option>
                  ))}
              </Select>
              <Textarea
                placeholder={"Where is this item located within the Storage?"}
                value={itemLocation}
                onChange={(e) => setItemLocation(e.target.value)}
              />
            </VStack>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter justifyContent={"center"}>
          <VStack display={isModifying ? "none" : "flex"}>
            <HStack width={"100%"}>
              <Button
                size={"sm"}
                colorScheme="orange"
                leftIcon={<ArrowUpIcon />}
                onClick={(e) => {
                  setHandleCase("Withdraw");
                  onOpen();
                }}
              >
                Withdraw Item
              </Button>
              <Button
                size={"sm"}
                colorScheme="blue"
                leftIcon={<ArrowDownIcon />}
                onClick={(e) => {
                  setHandleCase("Deposit");
                  onOpen();
                }}
              >
                Deposit Item
              </Button>
            </HStack>
            {session.user.isAdmin && (
              <HStack>
                <Button
                  size={"sm"}
                  colorScheme="yellow"
                  leftIcon={<EditIcon />}
                  onClick={(e) => {
                    setIsModifying(session.user.isAdmin);
                  }}
                >
                  Modify Item
                </Button>
                <Button
                  size={"sm"}
                  colorScheme="red"
                  leftIcon={<SmallCloseIcon />}
                  onClick={onDelOpen}
                >
                  Delete Item
                </Button>
              </HStack>
            )}
          </VStack>
          <VStack display={isModifying ? "flex" : "none"}>
            <Button
              size={"sm"}
              colorScheme="green"
              leftIcon={<CheckIcon />}
              onClick={handleModify}
            >
              Save Changes
            </Button>
          </VStack>
        </CardFooter>
      </Card>
    </>
  );
}
