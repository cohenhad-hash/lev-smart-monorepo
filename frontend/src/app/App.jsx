import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../shared/components/layout/AppLayout.jsx";
import HomePage from "../features/home/pages/HomePage.jsx";
import ChatPage from "../features/ai-assistant/pages/ChatPage.jsx";
import StudentPicker from "../features/courses/components/StudentPicker.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/courses/student-picker" element={<StudentPicker />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}