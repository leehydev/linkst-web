"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAccessToken } from "@/lib/auth";

export default function KakaoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isProcessing = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");

    if (code && !isProcessing.current) {
      isProcessing.current = true;

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/kakao?code=${code}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          setAccessToken(data.accessToken);
          router.push("/dashboard");
        })
        .catch((error) => {
          console.error("로그인 실패:", error);
          router.push("/login");
        });
    }
  }, [searchParams, router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p>로그인 처리 중...</p>
    </main>
  );
}
