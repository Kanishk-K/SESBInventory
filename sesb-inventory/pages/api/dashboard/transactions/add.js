import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import prisma from "../../../../lib/prismadb"

export default async (req, res) => {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (session && session.user.isActive) {
        const { itemId, action, reason } = req.body
        if (action == 1 && !session.user.isAdmin){
            return res.status(401).json({message:"Unauthorized, please sign in."}) 
        }
        try{
            const result = await prisma.transaction.create({
                data:{
                    reason: reason,
                    action: action,
                    item: {
                        connect: {id: itemId}
                    },
                    user: {
                        connect: {email: session.user.email}
                    },
                }
            })
            res.status(200).json(result)
        }
        catch (err){
            console.log(err);
            res.status(500).json({message: "Internal Error while Querying."})
        }
    } 
    else {
    // Not Signed in
        return res.status(401).json({message:"Unauthorized, please sign in."})
    }
}