import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import prisma from "../../../../lib/prismadb"

export default async function purposeAdd(req, res){
    const session = await unstable_getServerSession(req, res, authOptions)
    if (session && session.user.isAdmin) {
    // Signed in
        try{
            const { name } = req.body;
            if (name.trim().length === 0){
                return res.status(400).json({message: "Name cannot be empty."})
            }
            const result = await prisma.purpose.create({
                data:{
                    name:name
                }
            });
            return res.status(200).json(result)
        }
        catch (err){
            return res.status(500).json({message: "Internal Error while Querying."})
        }
    } 
    else {
    // Not Signed in
        return res.status(401).json({message:"Unauthorized, please sign in."})
    }
}