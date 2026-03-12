export default function LoginPage() {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;

    return (
      <main className="flex min-h-screen items-center justify-center">
        <a
          href={KAKAO_AUTH_URL}
          className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-500"
        >
          카카오로 로그인
        </a>
      </main>
    );
  }

