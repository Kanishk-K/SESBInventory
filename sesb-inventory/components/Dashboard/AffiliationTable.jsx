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
export default function AffiliationTable({ props }) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, isLoading } = useSWR(
    "/api/dashboard/affiliation/get",
    fetcher
  );
  const toast = useToast();

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
        <TableInput color={'green.500'} createEndpoint={'/api/dashboard/affiliation/add'} mutator={mutate}/>
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
