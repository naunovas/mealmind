import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Recipes from './pages/Recipes';
import MealPlan from './pages/MealPlan';
import AdminPanel from './pages/AdminPanel';
import WhatIHave from './pages/WhatIHave';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/recipes" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/meal-plan" element={<MealPlan />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/what-i-have" element={<WhatIHave />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;