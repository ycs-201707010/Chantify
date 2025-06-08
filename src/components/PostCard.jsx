import { Link } from "react-router-dom";

export default function PostCard({
  postId,
  title,
  thumbnail,
  boardName,
  nickname,
  createdAt,
  views,
  comment_count,
  votes,
}) {
  return (
    <div className="flex justify-between items-center border px-4 py-3 rounded dark:bg-zinc-800">
      <div className="flex gap-3 items-center">
        <div className="text-center">
          <button>👍</button>
          <div className="text-xs">{votes}</div>
        </div>
        {/* 썸네일 */}
        <div className="w-12 h-12 bg-gray-300 dark:bg-zinc-700 rounded-md overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt="썸네일"
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
        <div>
          <Link to={`/postview/${postId}`}>
            <div
              onClick={() => console.log("🔁 이동 시도됨")}
              className="font-semibold"
            >
              {title}
            </div>
          </Link>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {boardName} / {nickname} / {createdAt}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col justify-center items-center text-sm text-gray-500 dark:text-gray-400">
          <span>🔍</span>
          {views}
        </div>
        <div className="flex flex-col justify-center items-center text-sm text-gray-500 dark:text-gray-400">
          <span>💬</span>
          {comment_count}
        </div>
      </div>
    </div>
  );
}
