
// import { currentUser } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// export default async function DashboardPage() {
//   const user = await currentUser();

//   if (!user) redirect("/sign-in");

//   // Placeholder: Use metadata or DB to get role
//   const role = user.publicMetadata?.role;

//   if (role === "instructor") redirect("/dashboard/instructor");
//   if (role === "student") redirect("/dashboard/student");
//   if (role === "admin") redirect("/dashboard/admin");

//   return <p>Loading dashboard...</p>;
// }


import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function DashboardRedirect() {
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const dbUser = await db.user.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  if (!dbUser) {
    return redirect("/sign-in");
  }

  // Redirect based on role
  switch (dbUser.role) {
    case "STUDENT":
      return redirect("/student");
    case "INSTRUCTOR":
      return redirect("/instructor");
    case "ADMIN":
      return redirect("/admin");
    default:
      return redirect("/sign-in");
  }
}
