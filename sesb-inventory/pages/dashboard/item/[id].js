import React from "react";
import PageLayout from "../../../components/Layout/PageLayout";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import prisma from "../../../lib/prismadb";
import {
  Grid,
  GridItem,
  Card,
  CardBody,
  CardFooter,
  Stack,
  Heading,
  Text,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  HStack,
  Breadcrumb,
  BreadcrumbItem,
  Badge,
  VStack,
  Button,
  Wrap,
  Spinner,
} from "@chakra-ui/react";
import { ChevronRightIcon, ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import useSWR from "swr";
import Transaction from "../../../components/Dashboard/Transaction";

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
          <Card>
            <CardBody>
              <Stack spacing="3">
                <Heading size="md">{itemObject.name}</Heading>
                <HStack justifyContent={"space-between"}>
                  <Stat>
                    <StatLabel>Quantity</StatLabel>
                    <StatNumber>{itemObject.quantity}</StatNumber>
                  </Stat>
                  {itemObject.price && (
                    <Stat>
                      <StatLabel>Price</StatLabel>
                      <StatNumber>${itemObject.price / 100}</StatNumber>
                    </Stat>
                  )}
                </HStack>
                <Divider />
                <Breadcrumb pt="3" separator={<ChevronRightIcon />}>
                  <BreadcrumbItem>
                    <VStack>
                      <Badge colorScheme={"green"} fontSize={"sm"}>
                        {itemObject.affiliation.name}
                      </Badge>
                      {itemObject.purpose && (
                        <Badge colorScheme={"orange"} fontSize={"sm"}>
                          {itemObject.purpose.name}
                        </Badge>
                      )}
                    </VStack>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <Text>{itemObject.description}</Text>
                  </BreadcrumbItem>
                </Breadcrumb>
                <Divider />
                <Breadcrumb pt="3" separator={<ChevronRightIcon />}>
                  <BreadcrumbItem>
                    <Badge colorScheme={"purple"} fontSize={"sm"}>
                      {itemObject.storage.name}
                    </Badge>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <Text>{itemObject.location}</Text>
                  </BreadcrumbItem>
                </Breadcrumb>
              </Stack>
            </CardBody>
            <Divider />
            <CardFooter justifyContent={"center"}>
              <VStack>
                <HStack width={"100%"}>
                  <Button
                    size={"sm"}
                    colorScheme="orange"
                    leftIcon={<ArrowUpIcon />}
                  >
                    Withdraw Item
                  </Button>
                  <Button
                    size={"sm"}
                    colorScheme="blue"
                    leftIcon={<ArrowDownIcon />}
                  >
                    Deposit Item
                  </Button>
                </HStack>
                <Button size={"sm"} colorScheme="red">
                  Delete Item
                </Button>
              </VStack>
            </CardFooter>
          </Card>
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
