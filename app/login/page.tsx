"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;

  useEffect(() => {
    if (isLoggedIn()) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Linkst</h1>
        <p className="text-gray-500">긴 URL을 짧게 줄여보세요</p>
      </div>
      <a
        href={KAKAO_AUTH_URL}
        className="flex items-center gap-2 bg-[#FEE500] text-[#191919] px-6 py-3 rounded-lg font-medium hover:bg-[#FDD800] transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 3C5.58172 3 2 5.90391 2 9.5C2 11.7269 3.38776 13.6844 5.48992 14.8321L4.58682 17.8986C4.53439 18.0729 4.72992 18.2133 4.88112 18.1106L8.36039 15.8115C8.89348 15.9344 9.44092 16 10 16C14.4183 16 18 13.0961 18 9.5C18 5.90391 14.4183 3 10 3Z"
            fill="#191919"
          />
        </svg>
        카카오로 시작하기
      </a>
    </main>
  );
}
