import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../shared/components/layout/AppLayout.jsx";
import HomePage from "../features/home/pages/HomePage.jsx";
import ChatPage from "../features/ai-assistant/pages/ChatPage.jsx";
import CreateCoursePage from "../features/courses/pages/CreateCoursePage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/courses/create" element={<CreateCoursePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
