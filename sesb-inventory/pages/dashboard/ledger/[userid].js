import React, { useState } from "react";
import PageLayout from "../../../components/Layout/PageLayout";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { Grid, GridItem, VStack, Spinner, HStack, IconButton, Heading, Text, Alert, AlertTitle, AlertIcon } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import UserCard from "../../../components/Dashboard/UserCard";
import Transaction from '../../../components/Dashboard/Transaction';
import useSWR from "swr";
import prisma from '../../../lib/prismadb'

export default function UserPage({ session, userObject, props }) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const [currentNumber, setCurrentNumber] = useState(0);
  const { data, mutate, isLoading } = useSWR(
    `/api/dashboard/transactions/get?userId=${userObject.id}&skip=${currentNumber}&take=5`,
    fetcher
  );
  return (
    <PageLayout session={session}>
      <Grid
        templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(4, 1fr)" }}
        gap={6}
      >
        <GridItem colSpan={1}>
          <UserCard user={userObject} />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 3 }}>
          <VStack justifyContent={"center"} width={"100%"}>
            {isLoading ? (
              <Spinner size={"xl"} color={"blue.50"} />
            ) : (
              <VStack width={"100%"}>
                <HStack justifyContent={"space-between"} width={"100%"}>
                  <IconButton
                    colorScheme={"blue"}
                    size={{ base: "sm", md: "md" }}
                    hidden={currentNumber <= 0}
                    onClick={(e) => setCurrentNumber(currentNumber - 5)}
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                  <VStack
                    alignItems={
                      currentNumber <= 0
                        ? "flex-start"
                        : userObject._count.transactions <= currentNumber + 5
                        ? "flex-end"
                        : "center"
                    }
                  >
                    <Heading>Recent Transactions</Heading>
                    <Text>
                      Showing {currentNumber} -{" "}
                      {data.length < 5
                        ? currentNumber + data.length
                        : currentNumber + 5}{" "}
                      transactions out of {userObject._count.transactions}
                    </Text>
                  </VStack>
                  <IconButton
                    colorScheme={"blue"}
                    size={{ base: "sm", md: "md" }}
                    hidden={userObject._count.transactions <= currentNumber + 5}
                    onClick={(e) => setCurrentNumber(currentNumber + 5)}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                </HStack>
                {data.length ? (
                  data.map((transaction) => (
                    <Transaction
                      key={transaction.id}
                      action={transaction.action}
                      reason={transaction.reason}
                      user={transaction.user}
                      time={transaction.time}
                      itemName={transaction.item.name}
                      itemId={transaction.item.id}
                    />
                  ))
                ) : (
                  <Alert
                    status="warning"
                    variant="subtle"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    rounded={5}
                  >
                    <AlertIcon boxSize="40px" mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize="lg">
                      No additional transactions found!
                    </AlertTitle>
                  </Alert>
                )}
              </VStack>
            )}
          </VStack>
        </GridItem>
      </Grid>
    </PageLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  if (!(session.user.isActive || session.user.isAdmin)) {
    return {
      redirect: {
        destination: "/auth/error",
        permanent: false,
      },
    };
  }
  const userObject = await prisma.user.findFirst({
    where: { id: context.params.userid },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  });
  if (!userObject) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  return {
    props: { userObject, session },
  };
}
