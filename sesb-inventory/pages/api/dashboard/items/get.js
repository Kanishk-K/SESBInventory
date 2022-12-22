import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import prisma from "../../../../lib/prismadb"

export default async (req, res) => {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (session && (session.user.isActive || session.user.isAdmin)) {
    // Signed in
        try{
            const result = await prisma.item.findMany({
                include :{
                    affiliation:true,
                    purpose:true,
                    storage:true,
                },
                take:10
                
            });
            console.log(result)
            res.status(200).json(result)
        }
        catch (err){
            console.log(err);
            res.status(500).json({message: "Internal Error while Querying."})
        }
    } 
    else {
    // Not Signed in
        res.status(401).json({message:"Unauthorized, please sign in."})
    }
}