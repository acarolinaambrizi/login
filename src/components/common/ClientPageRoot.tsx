"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

export default function ClientPageRoot() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/home");
      } else {
        router.push("/login");
      }
    });
  }, [router]);

  return null;
}