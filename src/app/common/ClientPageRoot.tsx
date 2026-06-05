"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

export default function ClientPageRoot() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );

    const session = supabase.auth.getSession();
    session.then(({ data: { session } }) => {
      if (session) {
        router.push("/home");
      } else {
        router.push("/login");
      }
    });
  }, [router]);

  return null;
}
