"use client";
import { useSession } from "next-auth/react";
import Header from "./header";
import Loader from "./loader";
import Login from "./login";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loader />;
  }

  if (!session) {
    return <Login />;
  }

  return (
    <div className="w-screen h-screen flex flex-col">
      <Header />
      {children}
    </div>
  );
}
