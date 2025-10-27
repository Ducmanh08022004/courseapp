import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"
import ProfilePage from "./pages/ProfilePage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import MyCoursesPage from "./pages/MyCoursesPage.jsx";
import VideoListPage from "./pages/VideoListPage.jsx";
import ExamPage from "./pages/ExamPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";



function App() {

  return (
    <>
    <Router>
        <Routes>
          <Route path="/" element={<Homepage></Homepage>}></Route>
          <Route path="/LoginPage" element={<LoginPage></LoginPage>}></Route>
          <Route path="/RegisterPage" element={<RegisterPage></RegisterPage>}></Route>
          <Route path="/ProfilePage" element={<ProfilePage></ProfilePage>}></Route>
          <Route path="/course/:id" element={<CourseDetailPage />} />
          <Route path="/my-courses" element={<MyCoursesPage />} />
          <Route path="/course/:courseId/videos" element={<VideoListPage />} />
          <Route path="/course/:courseId/exam/:examId" element={<ExamPage />} />
          <Route path="/payment/:courseId" element={<PaymentPage />} />
        </Routes> 
    </Router>
      
    </>
  )
}

export default App
