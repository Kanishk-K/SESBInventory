import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Text,
  Button,
  Avatar,
  VStack,
  Divider,
  HStack,
  Switch,
} from "@chakra-ui/react";
import { EmailIcon, CalendarIcon } from "@chakra-ui/icons";

export default function UserCard({ user, toast, userSelector, modalControl, props }) {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  const [userVal, updateUserVal] = useState(user);

  function handleActive(e) {
    const changingVal = {
      ...userVal,
      isActive: e.target.checked,
    };

    fetch("/api/dashboard/users/modify_auth", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changingVal),
    }).then((res) => {
      if (res.status != 200) {
        if (toast) {
          toast({
            title: "Update Failed",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      }
      return;
    });
    updateUserVal(changingVal);
  }

  return (
    <Card>
      <CardBody>
        <VStack justifyContent={"center"}>
          <Avatar name={user.name} src={user.image}></Avatar>
          <Text>{user.name}</Text>
        </VStack>
        <Divider my={2} />
        <VStack>
          <HStack width={"100%"} justifyContent={"space-between"}>
            <Text>
              <EmailIcon /> :
            </Text>
            <Text>{user.email}</Text>
          </HStack>
          <HStack width={"100%"} justifyContent={"space-between"}>
            <Text>
              <CalendarIcon /> :
            </Text>
            <Text>
              {new Date(user.dateCreated).toLocaleDateString("en-US", options)}
            </Text>
          </HStack>
        </VStack>
        {userSelector && (
          <>
            <Divider my={2} />
            <VStack>
              <HStack justifyContent={"space-between"} width={"100%"}>
                <Text>Active</Text>
                <Switch
                  colorScheme={"green"}
                  size={"lg"}
                  isChecked={userVal.isActive}
                  onChange={handleActive}
                />
              </HStack>
              <HStack justifyContent={"space-between"} width={"100%"}>
                <Text>Admin</Text>
                <Switch
                  colorScheme={"green"}
                  size={"lg"}
                  isChecked={userVal.isAdmin}
                  onChange={(e) => {userSelector({...userVal, recall:updateUserVal}); modalControl()}}
                />
              </HStack>
            </VStack>
          </>
        )}
      </CardBody>
      <Divider />
      <CardFooter justifyContent={"center"}>
        <Button
          as={"a"}
          href={`/dashboard/ledger/${user.id}`}
          target={"_blank"}
          colorScheme={"facebook"}
        >
          {"User's Transactions"}
        </Button>
      </CardFooter>
    </Card>
  );
}
