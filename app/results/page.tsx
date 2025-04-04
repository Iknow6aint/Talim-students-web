import Layout from "@/components/Layout";
import ResultsDashboard from "@/components/results/results-dashboard";
import React from "react";

function page() {
  return (
    <Layout>
      <main>
        <ResultsDashboard />
      </main>
    </Layout>
  );
}

export default page;
