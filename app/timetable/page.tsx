"use client";

import { useEffect } from "react";
import Layout from "@/components/Layout";
import Timetable from "@/components/Timetable";
import { useStudentOnboarding } from "@/contexts/OnboardingContext";

export default function TimetablePage() {
  const { markStepComplete } = useStudentOnboarding();

  useEffect(() => {
    markStepComplete("view-timetable");
  }, [markStepComplete]);

  return (
    <Layout>
      <main>
        <Timetable />
      </main>
    </Layout>
  );
}
