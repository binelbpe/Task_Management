import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import './index.css'
import AgentList from './components/AgentList';
import PrivateRoute from './components/private/PrivateRoute';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<PrivateRoute />}>

            <Route path="/dashboard" element={<AgentList />} />

          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
