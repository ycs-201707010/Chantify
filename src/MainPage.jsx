import Header from "./components/Header";
import LiveMatchesSection from "./components/LiveMatchesSection";

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
      <main className="flex-grow px-4 py-6 bg-gray-50">
        <LiveMatchesSection></LiveMatchesSection>
      </main>
    </div>
  );
}
