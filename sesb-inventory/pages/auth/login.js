import { signIn } from 'next-auth/react'
import { VStack, Heading, Button, Center } from '@chakra-ui/react'
import PageLayout from '../../components/Layout/PageLayout'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]";


export default function Home() {
  async function handleGoogleSignIn(){
    signIn('google',{callbackUrl:"/dashboard"})
  }

  return (
    <PageLayout title={"Login To Inventory"} description={"This is the Inventory Management Tool for the Science and Engineering Student Board."}>
      <Center>
        <VStack spacing={8}>
          <Heading size={'2xl'}>Login To Inventory</Heading>
          <Button fontSize={'2xl'} rightIcon={<ExternalLinkIcon/>} onClick={handleGoogleSignIn}>Login with x500</Button>
        </VStack>
      </Center>
    </PageLayout>
  )
}

export async function getServerSideProps(context){
  const session = await unstable_getServerSession(context.req,context.res, authOptions);
  if (session){
      return{
          redirect:{
              destination: '/dashboard',
              permanent: false
          }
      }
  }
  return {
      props: {}
  }
}