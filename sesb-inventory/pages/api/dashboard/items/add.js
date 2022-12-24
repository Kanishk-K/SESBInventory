import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prismadb";

export default async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session && session.user.isAdmin) {
    const {
      name,
      description,
      quantity,
      price,
      location,
      affiliation,
      purpose,
      storage,
    } = req.body;
    // Signed in
    try {
      const result = await prisma.item.create({
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
      await prisma.transaction.create({
        data:{
          action: 1,
          item: {
              connect: {id: result.id}
          },
          user: {
              connect: {email: session.user.email}
          },
        }
      })
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
