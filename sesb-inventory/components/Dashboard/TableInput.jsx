import React from "react";
import { Input, Button, SimpleGrid, useToast } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

/*
 */

export default function TableInput({
  color,
  createEndpoint,
  mutator,
  tabletype,
  props,
}) {
  const [newAffiliation, setNewAffiliation] = React.useState("");
  const toast = useToast();
  function handleCreate(e) {
    e.preventDefault();
    if (newAffiliation.trim().length !== 0) {
      fetch(createEndpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newAffiliation }),
      })
        .then((res) => {
          mutator();
        })
        .then(setNewAffiliation(""))
        .then(
          toast({
            title: `${tabletype} created.`,
            status: "success",
            duration: 9000,
            isClosable: true,
          })
        );
    } else {
      toast({
        title: `Please provide a non-empty value`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setNewAffiliation("");
    }
  }

  return (
    <form onSubmit={handleCreate}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 2, md: 5 }}>
        <Input
          placeholder={"New Affiliation Name"}
          focusBorderColor={color}
          isRequired
          onChange={(e) => setNewAffiliation(e.target.value)}
          value={newAffiliation}
        ></Input>
        <Button leftIcon={<AddIcon />} _hover={{ bg: color }} type={"submit"}>
          Add New {tabletype}
        </Button>
      </SimpleGrid>
    </form>
  );
}
