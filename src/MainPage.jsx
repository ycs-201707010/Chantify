import Header from "./components/Header";
import LiveMatchesSection from "./components/LiveMatchesSection";
import PopularPosts from "./components/PopularPosts";
import PointRanking from "./components/PointRanking";
import IntroCarousel from "./components/IntroCaroucel";

// export default function MainPage() {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <main className="flex-grow px-4 py-6 bg-gray-50"></main>
//     </div>
//   );
// }

export default function MainPage({ user }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow px-4 py-6 bg-gray-50 dark:bg-zinc-900">
        <IntroCarousel />

        <section className="max-w-6xl mx-auto p-4">
          <PopularPosts />
        </section>

        <section className="max-w-6xl mx-auto p-4">
          <PointRanking />
        </section>
      </main>
    </div>
  );
}
