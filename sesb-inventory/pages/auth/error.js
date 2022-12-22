import { Center, Alert, AlertIcon, AlertTitle, AlertDescription, Divider } from "@chakra-ui/react";
import PageLayout from "../../components/Layout/PageLayout";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

export default function Home({ props }) {
  return (
    <PageLayout
      title={"Login To Inventory"}
      description={
        "This is the Inventory Management Tool for the Science and Engineering Student Board."
      }
    >
      <Center>
        <Alert
          status="warning"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          paddingY={5}
          rounded={10}
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} fontSize="2xl">
            Account Pending Verification!
          </AlertTitle>
          <Divider my={2} maxWidth={'85%'}/>
          <AlertDescription maxWidth={'85%'}>
            Your account has been created and is currently waiting to be verified by one of our admins. 
            If you want to know the status of your account verification contact your committee director or reach
            out to a member of the Executive Team. Once your account has been activated you will have access to the inventory system.
          </AlertDescription>
        </Alert>
      </Center>
    </PageLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
