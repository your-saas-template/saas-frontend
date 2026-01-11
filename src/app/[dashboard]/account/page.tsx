import { redirect } from "next/navigation";

export default function DashboardAccountRedirectPage() {
  redirect("/dashboard/account/profile");
}
