import React from "react";
import { Input, Button, SimpleGrid } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

/*
 */

export default function TableInput({ color, createEndpoint, mutator}) {
  const [newAffiliation, setNewAffiliation] = React.useState("");
  function handleCreate(e) {
    e.preventDefault();
    fetch(createEndpoint,{
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name:newAffiliation}),
    }).then(res => {mutator()}).then(setNewAffiliation(''))
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
          Add New Affiliation
        </Button>
      </SimpleGrid>
    </form>
  );
}
