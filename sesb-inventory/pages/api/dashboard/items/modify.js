import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prismadb";

export default async function itemModify(req, res){
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session && session.user.isAdmin) {
    const {
      id,
      name,
      description,
      quantity,
      price,
      location,
      affiliation,
      purpose,
      storage,
    } = req.body;
    if (quantity <= 0){
      return res.status(500).json({ message: "Quantity must be greater than 0." });
    }
    if (price < 0){
      return res.status(500).json({ message: "Price cannot be negative." });
    }
    // Signed in
    try {
      const result = await prisma.item.update({
        where:{
            id: id
        },
        data: {
            name: name,
            description: description,
            quantity: quantity,
            price: price,
            location: location,
            affiliation: {
                connect:{id: affiliation}
            },
            purpose: purpose != -1 ? {
                connect: {
                    id: purpose
                }
            } : undefined,
            storage:{
                connect:{
                    id: storage
                }
            }
        }
      });
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Error while Querying." });
    }
  } else {
    // Not Signed in
    res.status(401).json({ message: "Unauthorized, please sign in." });
  }
};
