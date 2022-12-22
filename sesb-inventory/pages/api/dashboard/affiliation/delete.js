import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import prisma from "../../../../lib/prismadb"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime"

export default async (req, res) => {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (session && session.user.isAdmin) {
    // Signed in
        try{
            const { id } = req.body;
            const result = await prisma.affiliation.delete({
                where:{
                    id:id
                }
            });
            res.status(200).json(result)
        }
        catch (err){
            if (err instanceof PrismaClientKnownRequestError){
                res.status(400).json({message:"Please delete or reassign all items associated with this Affiliation."})
            }
            res.status(500).json({message: "Internal Error while Querying."})
        }
    } 
    else {
    // Not Signed in
        res.status(401).json({message:"Unauthorized, please sign in."})
    }
}