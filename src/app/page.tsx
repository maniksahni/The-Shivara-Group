import { redirect } from "next/navigation";

/**
 * Default app root — redirects to the public website homepage.
 * The website is served at (website)/page.tsx via the route group.
 */
export default function AppRoot() {
  redirect("/");
}
