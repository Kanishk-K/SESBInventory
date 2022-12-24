import React from "react";
import PageLayout from "../../../components/Layout/PageLayout";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import prisma from "../../../lib/prismadb";
import {
  Grid,
  GridItem,
  Heading,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import useSWR from "swr";
import Transaction from "../../../components/Dashboard/Transaction";
import ItemCard from "../../../components/Dashboard/ItemCard";

export default function Item({ itemObject, session, props }) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, isLoading } = useSWR(
    `/api/dashboard/transactions/get?itemId=${itemObject.id}`,
    fetcher
  );

  return (
    <PageLayout session={session}>
      <Grid
        templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(3, 1fr)" }}
        gap={6}
      >
        <GridItem colSpan={1}>
          <ItemCard itemObject={itemObject} session={session} mutator={mutate} add={false}/>
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <VStack justifyContent={"center"}>
            {isLoading ? (
              <Spinner size={"xl"} color={"blue.200"} />
            ) : data.length ? (
              data.map((transaction) => (
                <Transaction
                  key={transaction.id}
                  action={transaction.action}
                  reason={transaction.reason}
                  user={transaction.user}
                  time={transaction.time}
                  itemName={itemObject.name}
                />
              ))
            ) : (
              <Heading>No Recent Transactions Found</Heading>
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
  return {
    props: { itemObject, session },
  };
}
