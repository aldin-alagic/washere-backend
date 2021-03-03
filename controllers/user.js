import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient({ log: ["query", "info", `warn`, `error`] });

const getAll = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    console.log(users);
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

const create = async (req, res) => {
  try {
    console.log("NESTO");
    const user = await prisma.user.create({
      data: {
        ...req.body,
      },
    });
    console.log("USER", user);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

export { getAll, create };
