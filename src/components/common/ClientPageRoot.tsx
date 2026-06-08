"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

export default function ClientPageRoot() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      
      if (session) {
        router.push("/home");
      } else {
        router.push("/login");
      }
    }).catch((error) => {
      if (!isMounted) return;
      
      console.error("Error getting session:", error);
      router.push("/login");
    });

    return () => {
      isMounted = false;
    };
  }, [router]);

  return null;
}
