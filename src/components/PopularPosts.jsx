import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PopularPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/checksum/community/get_popular_posts.jsp")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPosts(data.posts);
        else console.error("❌ 인기 글 조회 실패:", data.error);
      });
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        🔥 인기 게시글
      </h2>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.post_id}>
            <Link
              to={`/postview/${post.post_id}`}
              className="flex justify-between items-center hover:underline"
            >
              <span className="truncate text-gray-800 dark:text-gray-200">
                {post.title}
              </span>
              <span className="text-sm text-gray-500">추천 {post.upvote}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
