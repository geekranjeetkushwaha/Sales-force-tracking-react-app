import './App.css';
import { useAuth } from './auth/useAuth';
import Header from './components/Header';
import AppRoutes from './routes/AppRoutes';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div className="app-container">
        {isAuthenticated && <Header />}
        <main className="flex-1">
          <AppRoutes />
        </main>
      </div>
    </>
  );
}

export default App;
