import React from "react";
import {
  Alert,
  Link,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Flex,
  AccordionPanel,
  Avatar,
  HStack,
  Text,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";

export default function Transaction({
  action,
  reason,
  user,
  time,
  itemName,
  itemId,
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
        <AccordionItem borderTopWidth={0} borderStyle={ reason ? 'solid' :'none'}>
          <AccordionButton as={Flex} justifyContent={"space-between"}>
            <HStack>
              <LinkBox>
                <LinkOverlay
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  href={`/dashboard/ledger/${user.id}`}
                  target={"_blank"}
                >
                  <Avatar size={"sm"} name={user.name} src={user.image} />
                  <Text fontWeight={"bold"}>{user.name}</Text>
                </LinkOverlay>
              </LinkBox>

              <Text>
                {mapping_actions[action]} <Link href={`/dashboard/item/${itemId}`} target={'_blank'}>{itemName}</Link> on{" "}
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
