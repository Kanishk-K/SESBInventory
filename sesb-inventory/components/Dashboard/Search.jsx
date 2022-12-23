import React, { useState } from "react";
import {
  Card,
  CardBody,
  Text,
  VStack,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Badge,
  Heading,
  FormControl,
  FormLabel,
  HStack,
  Select,
} from "@chakra-ui/react";
import useSWR from "swr";
import { useRouter } from "next/router";

export default function Search({ afilliations, purposes, storages, props }) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const router = useRouter();

  const [nameInput, setNameInput] = useState("");
  const [affiliationInput, setAffiliationInput] = useState(-1);
  const [purposeInput, setPurposeInput] = useState(-1);
  const [storageInput, setStorageInput] = useState(-1);

  const { data, mutate, isLoading } = useSWR(
    `/api/dashboard/items/get?name=${nameInput}&affiliation=${affiliationInput}&purpose=${purposeInput}&storage=${storageInput}`,
    fetcher
  );

  function handleClick(e, id) {
    e.preventDefault();
    // router.push("/dashboard/affiliation");
    console.log(id);
  }

  return (
    <VStack>
      <Heading>Search</Heading>
      <VStack width={"100%"}>
        <Input
        autoComplete={"off"}
        onKeyUp={(e) => {
            if (e.key === "Enter") {
            e.target.blur();
            }
        }}
        placeholder={"Item Name"}
        onBlur={(e) => setNameInput(e.target.value)}
        />
        <HStack width={"100%"}>
          <Select
            placeholder={"Select Affiliation"}
            borderColor={"green.500"}
            focusBorderColor={"green.500"}
            onChange={(e) =>
              setAffiliationInput(e.target.value ? e.target.value : -1)
            }
          >
            {afilliations.map((afiliation) => (
              <option value={afiliation.id} key={afiliation.id}>
                {afiliation.name}
              </option>
            ))}
          </Select>
          <Select
            placeholder={"Select Purpose"}
            borderColor={"orange.500"}
            focusBorderColor={"orange.500"}
            onChange={(e) =>
                setPurposeInput(e.target.value ? e.target.value : -1)
              }
          >
            {purposes.map((purpose) => (
              <option value={purpose.id} key={purpose.id}>
                {purpose.name}
              </option>
            ))}
          </Select>
          <Select
            placeholder={"Select Storage"}
            borderColor={"purple.500"}
            focusBorderColor={"purple.500"}
            onChange={(e) =>
                setStorageInput(e.target.value ? e.target.value : -1)
              }
          >
            {storages.map((storage) => (
              <option value={storage.id} key={storage.id}>
                {storage.name}
              </option>
            ))}
          </Select>
        </HStack>
      </VStack>
      <Card width={"100%"} alignItems={isLoading ? "center" : "normal"}>
        <CardBody>
          {isLoading ? (
            <Spinner color="red.500" size={"xl"} />
          ) : (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Affiliation</Th>
                    <Th>Purpose</Th>
                    <Th>Storage</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {!data.message &&
                    data.map((item) => (
                      <Tr
                        _hover={{ bgColor: "gray.600", cursor: "pointer" }}
                        onClick={(e) => handleClick(e, item.id)}
                        key={item.id}
                      >
                        <Td>{item.name}</Td>
                        <Td>
                          <Badge colorScheme={"green"} fontSize={"sm"}>
                            {item.affiliation.name}
                          </Badge>
                        </Td>
                        <Td>
                          {item.purpose ? (
                            <Badge colorScheme={"orange"} fontSize={"sm"}>
                              {item.purpose.name}
                            </Badge>
                          ) : (
                            <Badge
                              variant={"solid"}
                              colorScheme={"red"}
                              fontSize={"sm"}
                            >
                              NOT PROVIDED
                            </Badge>
                          )}
                        </Td>
                        <Td>
                          <Badge colorScheme={"purple"} fontSize={"sm"}>
                            {item.storage.name}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </CardBody>
      </Card>
    </VStack>
  );
}
