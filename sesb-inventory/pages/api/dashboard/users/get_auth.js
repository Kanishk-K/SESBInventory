import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import prisma from "../../../../lib/prismadb"

export default async (req, res) => {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (session && session.user.isAdmin) {
    const { name, active, admin, skip } = req.query
    // Signed in
        try{
            const result = await prisma.user.findMany({
                where:{
                    name: {contains: name},
                    isActive: (active === 'true') || undefined,
                    isAdmin: (admin === 'true') || undefined
                },
                take:10,
                skip: +skip || 0
            });
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