import { Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import { Home } from './Pages/Home.jsx';
import { UnivariateFunction } from './Pages/UnivariateFunction.jsx';
import { Contact } from './Pages/Contact.jsx';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="univariateFunction" element={<UnivariateFunction />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}