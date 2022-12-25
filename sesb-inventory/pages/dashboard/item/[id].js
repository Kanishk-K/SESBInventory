import React, { useState } from "react";
import PageLayout from "../../../components/Layout/PageLayout";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import prisma from "../../../lib/prismadb";
import { Grid, GridItem, Heading, VStack, Spinner, HStack, IconButton, Text, Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import useSWR from "swr";
import Transaction from "../../../components/Dashboard/Transaction";
import ItemCard from "../../../components/Dashboard/ItemCard";

export default function Item({ itemObject, transactionCount, session, props }) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const [currentNumber, setCurrentNumber] = useState(0);
  const { data, mutate, isLoading } = useSWR(
    `/api/dashboard/transactions/get?skip=${currentNumber}&take=5`,
    fetcher
  );

  return (
    <PageLayout session={session}>
      <Grid
        templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(3, 1fr)" }}
        gap={6}
      >
        <GridItem colSpan={1}>
          <ItemCard
            itemObject={itemObject}
            session={session}
            mutator={mutate}
            add={false}
          />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <VStack justifyContent={"center"} width={'100%'}>
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
                        : transactionCount <= currentNumber + 5
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
                      transactions out of {transactionCount}
                    </Text>
                  </VStack>
                  <IconButton
                    colorScheme={"blue"}
                    size={{ base: "sm", md: "md" }}
                    hidden={transactionCount <= currentNumber + 5}
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
                      itemName={itemObject.name}
                      itemId={itemObject.id}
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
  const itemObject = await prisma.item.findFirst({
    where: {
      id: +context.params.id,
    },
    include: {
      purpose: true,
      affiliation: true,
      storage: true,
    },
  });
  if (!itemObject) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  const transactionCount = (
    await prisma.transaction.aggregate({
      where: {
        itemId: itemObject.id,
      },
      _count: {
        id: true,
      },
    })
  )._count.id;
  return {
    props: { itemObject, transactionCount, session },
  };
}
