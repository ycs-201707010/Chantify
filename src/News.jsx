import { useEffect, useState } from "react";
import Header from "./components/Header";

export default function News() {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    fetch("/checksum/get_news_naver.jsp")
      .then((res) => res.json())
      .then((data) => {
        setNewsList(data.items || []);
      });
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen">
      <Header></Header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4">해외 축구 뉴스 (네이버)</h2>
        {newsList.map((news, i) => (
          <>
            <div
              key={i}
              className="mt-5 mb-5 pb-4 rounded-lg hover:bg-gray-200 text-gray-500 dark:text-white dark:hover:bg-gray-600 translate"
            >
              <a
                href={news.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-green-600 hover:underline"
              >
                {news.title.replace(/<[^>]*>/g, "")}
              </a>
              <p
                className="text-sm  mt-1"
                dangerouslySetInnerHTML={{ __html: news.description }}
              />
              <p className="text-xs mt-1">{news.pubDate}</p>
            </div>
            <hr />
          </>
        ))}
      </main>
    </div>
  );
}
