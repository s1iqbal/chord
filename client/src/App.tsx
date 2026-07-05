import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { TestConsole } from './pages/TestConsole.tsx';
import { SearchPage } from './pages/SearchPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <nav className="border-b border-slate-700 bg-slate-800 p-4 flex justify-center gap-6">
          <Link to="/" className="font-bold hover:text-blue-400">Test Console</Link>
          <Link to="/search" className="hover:text-blue-400">Search</Link>
        </nav>
        
        {/* Added flex and items-center to align all child components */}
        <main className="p-6 max-w-full mx-auto flex flex-col items-center">
          <Routes>
            <Route path="/" element={<TestConsole />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
export default App;