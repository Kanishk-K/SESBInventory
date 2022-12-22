import { signIn } from 'next-auth/react'


export default function Home() {
  async function handleGoogleSignIn(){
    signIn('google',{callbackUrl:"/dashboard"})
  }

  return (
    <button onClick={handleGoogleSignIn}>Sign In With Google</button>
  )
}
