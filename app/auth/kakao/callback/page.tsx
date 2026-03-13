"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAccessToken } from "@/lib/auth";

function KakaoCallbackContent() {
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

  return <p>로그인 처리 중...</p>;
}

export default function KakaoCallbackPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<p>로딩 중...</p>}>
        <KakaoCallbackContent />
      </Suspense>
    </main>
  );
}
