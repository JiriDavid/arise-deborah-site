import { currentUser } from "@clerk/nextjs/server";

const ADMIN_EMAILS = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  : [];

export async function getAdminUser() {
  try {
    const user = await currentUser();
    if (!user) {
      return { user: null, isAdmin: false };
    }

    const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase() || "";

    const isMetadataAdmin =
      user?.publicMetadata?.role === "admin" ||
      user?.publicMetadata?.isAdmin === true;
    const isEnvAdmin = email && ADMIN_EMAILS.includes(email);

    return { user, isAdmin: isMetadataAdmin || isEnvAdmin };
  } catch (error) {
    console.error("Failed to resolve admin user:", error);
    return { user: null, isAdmin: false };
  }
}
