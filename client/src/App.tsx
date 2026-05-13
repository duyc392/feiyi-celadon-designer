import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import GuideFlow from './pages/GuideFlow'
import Gallery from './pages/Gallery'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guide" element={<GuideFlow />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </BrowserRouter>
  )
}
