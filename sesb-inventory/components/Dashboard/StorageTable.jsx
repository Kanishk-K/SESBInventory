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
  SimpleGrid,
  useToast
} from "@chakra-ui/react";
import { CloseIcon, AddIcon } from "@chakra-ui/icons";
import { useState } from "react";

export default function StorageTable({ props }) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const [newStorage, setNewStorage] = React.useState("");
  const { data, mutate, isLoading } = useSWR(
    "/api/dashboard/storage/get",
    fetcher
  );
  const toast = useToast();

  function handleCreate(e) {
    e.preventDefault();
    fetch('/api/dashboard/storage/add',{
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name:newStorage}),
    }).then(res => {mutate()}).then(setNewStorage(''))
  }

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
    .then(setNewStorage(''))
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
        <form onSubmit={handleCreate}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 2, md: 5 }}>
                <Input
                placeholder={"New Affiliation Name"}
                focusBorderColor={"purple.500"}
                isRequired
                onChange={e => setNewStorage(e.target.value)}
                value={newStorage}
                ></Input>
                <Button leftIcon={<AddIcon />} _hover={{ bg: "purple.500" }} type={'submit'}>
                Add New Storage Location
                </Button>
            </SimpleGrid>
        </form>
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
              {data
                .sort((a, b) => (a._count.items < b._count.items ? 1 : -1))
                .map((affiliation) => (
                  <Tr key={affiliation.id}>
                    <Td>
                      <Badge colorScheme={"purple"} fontSize={"sm"}>
                        {affiliation.name}
                      </Badge>
                    </Td>
                    <Td>{affiliation._count.items}</Td>
                    <Td><IconButton size={'sm'} _hover={{bg:'red.500'}} icon={<CloseIcon/>} onClick={() => handleDelete(affiliation.id)}/></Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
}
