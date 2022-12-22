import { unstable_getServerSession } from "next-auth"
import PageLayout from "../../components/Layout/PageLayout";
import { authOptions } from "../api/auth/[...nextauth]";

export default function Home({session, props}) {
  return (
    <PageLayout session={session}>
        <h1>Welcome to the Dashboard</h1>
    </PageLayout>
  )
}

export async function getServerSideProps(context){
    const session = await unstable_getServerSession(context.req,context.res, authOptions);
    if (!session){
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