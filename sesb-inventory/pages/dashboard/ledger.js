import PageLayout from "../../components/Layout/PageLayout";
import {
  Heading,
  HStack,
  Spinner,
  VStack,
  IconButton,
  Alert,
  AlertIcon,
  AlertTitle,
  Text,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Transaction from "../../components/Dashboard/Transaction";
import useSWR from "swr";
import React, { useState } from "react";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import prisma from "../../lib/prismadb";

export default function Home({ session, transactionCount, props }) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const [currentNumber, setCurrentNumber] = useState(0);
  const { data, mutate, isLoading } = useSWR(
    `/api/dashboard/transactions/get?skip=${currentNumber}&take=20`,
    fetcher
  );

  return (
    <PageLayout session={session}>
      {isLoading ? (
        <VStack>
          <Heading>Loading Transactions</Heading>
          <Spinner size={"xl"}></Spinner>
        </VStack>
      ) : (
        <VStack>
          <HStack justifyContent={"space-between"} width={"100%"}>
            <IconButton
              colorScheme={"blue"}
              size={{ base: "sm", md: "md" }}
              hidden={currentNumber <= 0}
              onClick={(e) => setCurrentNumber(currentNumber - 20)}
            >
              <ChevronLeftIcon />
            </IconButton>
            <VStack alignItems={currentNumber <= 0 ? 'flex-start' : transactionCount <= currentNumber + 20 ? 'flex-end' : 'center'}>
              <Heading>Recent Transactions</Heading>
              <Text>Showing {currentNumber} - {data.length < 20 ? currentNumber + data.length : currentNumber + 20} transactions out of {transactionCount}</Text>
            </VStack>
            <IconButton
              colorScheme={"blue"}
              size={{ base: "sm", md: "md" }}
              hidden={transactionCount <= currentNumber + 20}
              onClick={(e) => setCurrentNumber(currentNumber + 20)}
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
  const transactionCount = (
    await prisma.transaction.aggregate({
      _count: {
        id: true,
      },
    })
  )._count.id;
  return {
    props: { session, transactionCount },
  };
}
