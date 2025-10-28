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
import ResourceManagerPage from "./pages/ResourceManagerPage.jsx";
import CourseManagementPage from "./pages/CourseManagementPage.jsx";
import VideoManagementPage from "./pages/VideoManagementPage.jsx";
import ExamManagementPage from "./pages/ExamManagementPage.jsx";
import ExamsListPage from "./pages/ExamsListPage.jsx";
import QuestionManagementPage from "./pages/QuestionManagementPage.jsx";



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
          <Route path="/resource-management" element={<ResourceManagerPage />} />
          <Route path="/admin/courses" element={<CourseManagementPage />} />
          <Route path="/admin/videos" element={<VideoManagementPage />} />
          <Route path="/admin/exams" element={<ExamsListPage />} />
          <Route path="/admin/course/:courseId/exams" element={<ExamManagementPage />} />
          <Route path="/admin/exam/:examId/questions" element={<QuestionManagementPage />} />
        </Routes> 
    </Router>
      
    </>
  )
}

export default App
