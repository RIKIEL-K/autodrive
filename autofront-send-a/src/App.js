import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChooseRole from "./pages/ChooseRole";
import Register from "./pages/Register";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ValidateToken from "./pages/ValidateToken";
import UpdatePassword from "./pages/UpdatePassword";
import AccountSettings from "./pages/AccountSettings";
import NotFound from "./pages/NotFound";
import UserDashboard from "./pages/UserDashboard";
import FinanceLayout from "./pages/FinanceLayout";
import DriverFinanceLayout from "./pages/DriverFinanceLayout";
import AddCard from "./pages/AddCard";
import CarManagement from "./pages/CarManagement";
import AddCar from "./pages/AddCar";
import OrdersPage from "./pages/OrdersPage";
import OrderDetails from "./pages/OrderDetails";
import TaxiDashboard from "./pages/TaxiDashboard";
import CourseEnCours from "./pages/CourseEnCours";
import EditCar from "./pages/EditCar";
import CoursList from "./pages/CoursList";
import ChatCoursePage from "./pages/ChatCoursePage";
import DriverDashboard from "./pages/DriverDashboard";
import CourseInteractionPage from "./pages/CourseInteractionPage";
import Contact from "./pages/Contact";
import ArriveeCourse from "./pages/ArriveeCourse";
import UserTransactionsList from "./pages/UserTransactionsList";
import CourseRequestPage from "./pages/User/CourseRequestPage";
import UserComments from "./pages/User/UserComments";
import CommentPage from "./pages/CommentPage";
import ContactDriverPage from "./pages/ContactDriverPage";
import ChatAi from './pages/ChatAi';

function App() {
  return (
    <>
      <Router>
        <Routes>
           {/* <Route path="/" element={<ChooseRole/>} /> */}
           <Route path="/chat-ia/:id" element={<ChatAi />} />
           <Route path="/comments/:userId" element={<UserComments/>} />
           <Route path="/comment/:id" element={<CommentPage/>} />
           <Route path="/contact-driver/:id" element={<ContactDriverPage/>} />
            <Route path="/course-request/:id" element={<CourseRequestPage />} />
            <Route path="/user-transaction-list/:id" element={<UserTransactionsList />} />
           <Route path="/list-course-disponible/:id" element={< TaxiDashboard/>} />
           <Route path="/arrivee-course/:id" element={<ArriveeCourse />} />
           <Route path="/driver-dashboard/:id" element={< DriverDashboard/>} />
           <Route path="/cours-list" element={< CoursList/>} />
           <Route path="/chat-course" element={< ChatCoursePage/>} />
           <Route path="/course-en-cours/:id" element={<CourseEnCours />} />
          <Route path="/facturation" element={<FinanceLayout />} />
           <Route path="/commandes/:id" element={<OrdersPage />} />
           <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/addcar/:id" element={<AddCar />} />
          <Route path="/editcar/:driverId/:id" element={<EditCar />} />
          <Route path="/car/:id" element={<CarManagement />} />
           <Route path="/addCard" element={<AddCard />} />
          <Route path="/" element={<Register />} />
          <Route path="/index/:id" element={<Index />} />
          <Route path="/login/:role" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/validate-token" element={<ValidateToken />} />
          <Route path="/reset-password" element={<UpdatePassword />} />
          <Route path="/account-settings/:id" element={<AccountSettings />} />
          <Route path="/user-dashboard/:id" element={<UserDashboard />} />
          <Route path="/CourseInteractionPage/:id" element={<CourseInteractionPage />} />
          <Route path="/contact/:id" element={<Contact />} />
          <Route path="/finance/:id" element={<FinanceLayout />} />
          <Route path="/driver/finance/:id" element={<DriverFinanceLayout />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
