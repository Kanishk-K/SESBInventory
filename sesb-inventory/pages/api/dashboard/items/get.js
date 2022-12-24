import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import prisma from "../../../../lib/prismadb"

export default async (req, res) => {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (session && session.user.isActive) {
    const { name, affiliation, purpose, storage, take, skip, count } = req.query
    // Signed in
        try{
            const result = await prisma.item.findMany({
                where:{
                    name:{
                        contains: name
                    },
                    affiliationid: +affiliation != -1 ? +affiliation : undefined,
                    purposeid: +purpose != -1 ? +purpose : undefined,
                    storageid: +storage != -1 ? +storage : undefined
                },
                include :{
                    affiliation:true,
                    purpose:true,
                    storage:true,
                },
                take:10,
                skip: +skip || 0,
            });
            res.status(200).json({result:result, count:count ? (await prisma.item.count()) : null})
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