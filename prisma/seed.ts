import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
    const password = await hash("test", 12);
    await prisma.user.upsert({
        where: { email: "test@student.com" },
        update: {},
        create: {
            email: "test@student.com",
            username: "Kqan",
            password,
            role: "STUDENT"
        },
    });

    await prisma.user.upsert({
        where: { email: "test@teacher.com" },
        update: {},
        create: {
            email: "test@teacher.com",
            username: "Kqan",
            password,
            role: "TEACHER"
        },
    });
    console.log(`Database has been seeded. 🌱`);
}
seed()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });