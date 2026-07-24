import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import AgencyXView from "./components/AgencyXView";
import CommunityView from "./components/CommunityView";
import MicedUpView from "./components/MicedUpView";
import Home, { Header } from "./pages/Home";

function PropertyPage({ children }) {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <main className="property-page">
        {children(() => navigate("/"))}
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agency-x" element={<PropertyPage>{(onBack) => <AgencyXView onBack={onBack} />}</PropertyPage>} />
        <Route path="/miced-up" element={<PropertyPage>{(onBack) => <MicedUpView onBack={onBack} />}</PropertyPage>} />
        <Route path="/community" element={<PropertyPage>{(onBack) => <CommunityView onBack={onBack} />}</PropertyPage>} />
      </Routes>
    </BrowserRouter>
  );
}
