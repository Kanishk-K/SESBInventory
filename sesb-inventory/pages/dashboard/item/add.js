import { Center } from "@chakra-ui/react";
import React from "react";
import ItemCard from "../../../components/Dashboard/ItemCard";
import PageLayout from "../../../components/Layout/PageLayout";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";

export default function Add({ session, props }) {
  return (
    <PageLayout session={session}>
      <Center>
        <ItemCard session={session} add={true}/>
      </Center>
    </PageLayout>
  );
}

export async function getServerSideProps(context){
    const session = await unstable_getServerSession(context.req,context.res, authOptions);
    if (!session || !session.user.isAdmin){
        return{
            redirect:{
                destination: '/auth/login',
                permanent: false
            }
        }
    }
    return {
        props: {session}
    }
}