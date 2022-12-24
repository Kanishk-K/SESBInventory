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
  useToast
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import TableInput from "./TableInput";

export default function StorageTable({ props }) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, isLoading } = useSWR(
    "/api/dashboard/storage/get",
    fetcher
  );
  const toast = useToast();

  function handleDelete(id){
    fetch('/api/dashboard/storage/delete',{
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id:id}),
    })
    .then(res => {res.status == 400 && toast({
        title: 'Error Deleting',
        description: "Please remove or re-assign all child items before deleting.",
        status:'error',
        position:'top',
    })})
    .then(res => mutate())
  }

  if (isLoading)
    return (
      <Card width={"100%"} alignItems={"center"}>
        <CardBody>
          <Spinner color="purple.500" size={"xl"} />
        </CardBody>
      </Card>
    );

  return (
    <Card width={"100%"}>
      <CardHeader>
        <TableInput color={'purple.500'} createEndpoint={'/api/dashboard/storage/add'} mutator={mutate} />
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
              {!data.message && data
                .sort((a, b) => (a._count.items < b._count.items ? 1 : -1))
                .map((storage) => (
                  <Tr key={storage.id}>
                    <Td>
                      <Badge colorScheme={"purple"} fontSize={"sm"}>
                        {storage.name}
                      </Badge>
                    </Td>
                    <Td>{storage._count.items}</Td>
                    <Td><IconButton size={'sm'} _hover={{bg:'red.500'}} icon={<CloseIcon/>} onClick={() => handleDelete(storage.id)}/></Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
}
