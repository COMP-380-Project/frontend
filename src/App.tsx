import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
  } from "react-router-dom";
import {EventsPage} from "../pages/EventsPage";
import {MyEventsPage} from "../pages/MyEventsPage";
import {LoginPage} from "../pages/LoginPage";
import {RegisterPage} from "../pages/RegisterPage";
import {EventDetailsPage} from "../pages/EventDetailsPage";
import {EditEventsPage} from "../pages/EditEventsPage";
import {Header} from "../components/header/Header";
import {AuthProvider} from "../contexts/AuthProvider";
import {ProtectedRoute} from "../components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
        <div className="min-h-screen bg-gray-50">
            <Router>
                <Header />
                <main className="container mx-auto p-8">
                    <Routes>
                        <Route path="/" element={<EventsPage />} />
                        <Route path="/my-events" 
                        element={
                        <ProtectedRoute>
                            <MyEventsPage />
                        </ProtectedRoute>
                    }
                />
                        <Route path="/events/:eventId" element={<EventDetailsPage />} />
                        <Route path="/events/:eventId/edit"
                         element={
                            <ProtectedRoute>
                                <EditEventsPage />
                            </ProtectedRoute>
                        }
                    />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </Router>
        </div>
    </AuthProvider>
  );
}

export default App