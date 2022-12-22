import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Text } from "@chakra-ui/react";

export default function Search({ props }) {
  return (
    <Card width={'100%'}>
      <CardBody>
        <Text>View a summary of all your customers over the last month.</Text>
      </CardBody>
    </Card>
  );
}
