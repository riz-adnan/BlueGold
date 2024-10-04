import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import ResetPassword from './components/reset-password/page';
import SignIn from './components/signin/page';
import VerifyEmail from './components/VerifyEmail';
import SignUp from './components/signup/page';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Wallet from './components/Wallet';

import Add from './components/Add';
import CaseBattle from './components/NewCase';
import ChestBattle from './components/Chest';

// Import Context
// import { AuthProvider } from './contexts/AuthContext';
import { AccountProvider } from './context/account';

function App() {
  return (
    <AccountProvider>
      <Router>

        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="wallet/:walletId" element={<Wallet />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path='/case-battle' element={<CaseBattle />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/add" element={<Add />} />
          <Route path="/case-battle/room/:roomId" element={<ChestBattle />} />

        </Routes>
      </Router>
    </AccountProvider>
  );
}

export default App;
