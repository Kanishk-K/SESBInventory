import React from "react";
import {
  Alert,
  AlertTitle,
  AlertDescription,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Flex,
  AccordionPanel,
  Avatar,
  HStack,
  Text,
} from "@chakra-ui/react";

export default function Transaction({
  action,
  reason,
  user,
  time,
  itemName,
  props,
}) {
  const mapping_colors = {
    1: "success",
    2: "info",
    3: "warning",
  };
  const mapping_actions = {
    1: "added",
    2: "deposited",
    3: "withdrew",
  };
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return (
    <Alert status={mapping_colors[action]} rounded={4}>
      <Accordion width={"100%"} allowToggle>
        <AccordionItem borderTopWidth={0}>
          <AccordionButton as={Flex} justifyContent={"space-between"}>
            <HStack>
              <Avatar size={"sm"} name={user.name} src={user.image} />
              <Text fontWeight={"bold"}>{user.name}</Text>
              <Text>
                {mapping_actions[action]} {itemName} on{" "}
                {new Date(time).toLocaleDateString("en-US", options)}
              </Text>
            </HStack>
            {reason && <AccordionIcon />}
          </AccordionButton>
          {reason && <AccordionPanel pb={4}>{reason}</AccordionPanel>}
        </AccordionItem>
      </Accordion>
    </Alert>
  );
}
