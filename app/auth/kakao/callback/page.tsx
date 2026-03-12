"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function KakaoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/kakao?code=${code}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("accessToken", data.accessToken);
          router.push("/");
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
