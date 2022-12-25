import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prismadb";

export default async function modifyAuth(req, res){
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session && session.user.isAdmin) {
    const { id, isActive, isAdmin } = req.body;
    if (id === session.user.id) {
      return res
        .status(401)
        .json({ message: "You are not authorized to modify your own admin permissions." });
    }
    // Signed in
    try {
      const result = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          isActive: isActive,
          isAdmin: isAdmin,
        },
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
