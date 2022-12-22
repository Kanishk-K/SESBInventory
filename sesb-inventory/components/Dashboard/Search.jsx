import React from "react";
import {
  Card,
  CardBody,
  Text,
  VStack,
  Input,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  LinkOverlay,
  LinkBox,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import useSWR from "swr";
import { useRouter } from "next/router";

export default function Search({ props }) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const router = useRouter();
  const { data, mutate, isLoading } = useSWR(
    "/api/dashboard/items/get",
    fetcher
  );

  function handleClick(e, id) {
    e.preventDefault();
    // router.push("/dashboard/affiliation");
    console.log(id);
  }

  return (
    <VStack>
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
                        onClick={e => handleClick(e,item.id)} key={item.id}
                      >
                        <Td>{item.name}</Td>
                        <Td><Badge colorScheme={'green'} fontSize={'sm'}>{item.affiliation.name}</Badge></Td>
                        <Td>{item.purpose ? <Badge colorScheme={'orange'} fontSize={'sm'}>{item.purpose.name}</Badge> : <Badge variant={'solid'} colorScheme={'red'} fontSize={'sm'}>NOT PROVIDED</Badge>}</Td>
                        <Td><Badge colorScheme={'purple'} fontSize={'sm'}>{item.storage.name}</Badge></Td>
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
