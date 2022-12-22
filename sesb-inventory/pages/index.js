import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Home(){
  return (
    <h1>Index</h1>
  )
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
  if (!(session.user.isActive || session.user.isAdmin)){
      return{
          redirect:{
              destination: '/auth/error',
              permanent: false
          }
      }
  }
  return {
    redirect: {
      destination: "/dashboard",
      permanent: false,
    },
  };
}
