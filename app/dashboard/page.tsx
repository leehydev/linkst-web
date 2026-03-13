"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { linkApi, Link, PageResponse } from "@/lib/api";
import { isLoggedIn, logout } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    fetchLinks();
  }, [router]);

  const fetchLinks = async () => {
    try {
      const response = await linkApi.getMyLinks();
      setLinks(response.content);
    } catch (error) {
      console.error("링크 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newUrl.trim()) return;

    setCreating(true);
    try {
      const link = await linkApi.createLink({
        originUrl: newUrl,
        title: newTitle || undefined,
      });
      setLinks([link, ...links]);
      setShowCreateModal(false);
      setNewUrl("");
      setNewTitle("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "링크 생성 실패");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await linkApi.deleteLink(id);
      setLinks(links.filter((link) => link.id !== id));
    } catch (error) {
      alert("삭제 실패");
    }
  };

  const handleCopy = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    alert("복사되었습니다!");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Linkst</h1>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* 메인 */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* 생성 버튼 */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            + 새 링크 만들기
          </button>
        </div>

        {/* 링크 목록 */}
        {links.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>아직 생성된 링크가 없습니다.</p>
            <p className="mt-2">첫 번째 링크를 만들어보세요!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {links.map((link) => (
              <div
                key={link.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {link.title || link.originUrl}
                    </p>
                    <p className="text-sm text-blue-500 mt-1">{link.shortUrl}</p>
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      {link.originUrl}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <span className="text-sm text-gray-500">
                      {link.clickCount} 클릭
                    </span>
                    <button
                      onClick={() => handleCopy(link.shortUrl)}
                      className="text-sm text-blue-500 hover:text-blue-600"
                    >
                      복사
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="text-sm text-red-500 hover:text-red-600"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 생성 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4">새 링크 만들기</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">URL *</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com/long-url"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  제목 (선택)
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="링크 제목"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700"
              >
                취소
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !newUrl.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {creating ? "생성 중..." : "생성"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
