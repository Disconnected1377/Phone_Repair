const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting database cleanup...");
  
  // 1. Delete all booking services
  await prisma.bookingService.deleteMany();
  console.log("Wiped all booking services.");

  // 2. Delete all bookings
  await prisma.booking.deleteMany();
  console.log("Wiped all bookings.");

  // 3. Delete all CUSTOMER users (Keep ADMIN)
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      role: "CUSTOMER"
    }
  });
  console.log(`Wiped ${deletedUsers.count} customer accounts.`);

  console.log("Cleanup complete! Admin account remains untouched.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
