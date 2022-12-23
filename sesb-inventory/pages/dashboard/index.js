import { unstable_getServerSession } from "next-auth";
import PageLayout from "../../components/Layout/PageLayout";
import { authOptions } from "../api/auth/[...nextauth]";
import { Grid, GridItem } from "@chakra-ui/react";
import Search from "../../components/Dashboard/Search";
import prisma from "../../lib/prismadb";

export default function Home({ session, afilliations, purposes, storages, props }) {
  return (
    <PageLayout session={session}>
      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(12, 1fr)"
        gap={4}
      >
        <GridItem colSpan={12}>
            <Search afilliations={afilliations} purposes={purposes} storages={storages} />
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
  const afilliations = await prisma.affiliation.findMany();
  const purposes = await prisma.purpose.findMany();
  const storages = await prisma.storage.findMany();
  return {
    props: { session, afilliations, purposes, storages },
  };
}
