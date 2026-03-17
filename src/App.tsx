import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ScrollyCanvas } from './components/ScrollyCanvas';
import { OverlayUI } from './components/OverlayUI';
import Philosophy from './pages/Philosophy';
import Immerse from './pages/Immerse';
import Connect from './pages/Connect';

function App() {
  return (
    <Router>
      <main className="relative w-full bg-black min-h-screen">
        <OverlayUI />
        <Routes>
          <Route path="/" element={<ScrollyCanvas />} />
          <Route path="/philosophy" element={<Philosophy />} />
          <Route path="/immerse" element={<Immerse />} />
          <Route path="/connect" element={<Connect />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
