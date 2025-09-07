"use client";

import Layout from "@/components/Layout";
import SubjectGrid from "@/components/SubjectGrid";

export default function Page() {
  return (
    <Layout>
      {/* Ensure the layout fills the entire viewport */}
      <div className="h-screen flex flex-col">
        {/* Scrollable Main Content */}
        <main className="w-full flex-grow overflow-y-auto space-y-6 scrollbar-hide">
          <SubjectGrid />
        </main>
      </div>
    </Layout>
  );
}
