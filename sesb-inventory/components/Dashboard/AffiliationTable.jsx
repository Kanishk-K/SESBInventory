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
export default function AffiliationTable({ props }) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const [newAffiliation, setNewAffiliation] = React.useState("");
  const { data, mutate, isLoading } = useSWR(
    "/api/dashboard/affiliation/get",
    fetcher
  );
  const toast = useToast();

  function handleCreate(e) {
    e.preventDefault();
    fetch('/api/dashboard/affiliation/add',{
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name:newAffiliation}),
    }).then(res => {mutate()}).then(setNewAffiliation(''))
  }

  function handleDelete(id){
    fetch('/api/dashboard/affiliation/delete',{
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
    .then(setNewAffiliation(''))
  }

  if (isLoading)
    return (
      <Card width={"100%"} alignItems={"center"}>
        <CardBody>
          <Spinner color="green.500" size={"xl"} />
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
                focusBorderColor={"green.500"}
                isRequired
                onChange={e => setNewAffiliation(e.target.value)}
                value={newAffiliation}
                ></Input>
                <Button leftIcon={<AddIcon />} _hover={{ bg: "green.500" }} type={'submit'}>
                Add New Affiliation
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
              {!data.message && data
                .sort((a, b) => (a._count.items < b._count.items ? 1 : -1))
                .map((affiliation) => (
                  <Tr key={affiliation.id}>
                    <Td>
                      <Badge colorScheme={"green"} fontSize={"sm"}>
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
