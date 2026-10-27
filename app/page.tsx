import { redirect } from "next/navigation";
import { hasSession } from "@/lib/auth/guard";
import Dashboard from "./Dashboard";
export const dynamic = "force-dynamic";
export default async function Page() {
  if (!(await hasSession())) redirect("/login");
  return <Dashboard />;
}
