export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export function setAccessToken(token: string): void {
  localStorage.setItem("accessToken", token);
}

export function removeAccessToken(): void {
  localStorage.removeItem("accessToken");
}

export function isLoggedIn(): boolean {
  return !!getAccessToken();
}

export function logout(): void {
  removeAccessToken();
  window.location.href = "/login";
}
