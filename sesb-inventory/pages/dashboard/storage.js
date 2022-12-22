import { Center } from "@chakra-ui/react";
import { unstable_getServerSession } from "next-auth"
import StorageTable from "../../components/Dashboard/StorageTable";
import PageLayout from "../../components/Layout/PageLayout";
import { authOptions } from "../api/auth/[...nextauth]";

export default function Home({session, props}) {
    return (
        <PageLayout session={session}>
            <Center>
                <StorageTable/>
            </Center>
        </PageLayout>
    )
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