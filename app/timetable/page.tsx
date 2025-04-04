import Layout from "@/components/Layout";
import Timetable from "@/components/Timetable";
import React from "react";

function page() {
  return (
    <Layout>
      <main>
        <Timetable buttonText="Download" />
      </main>
    </Layout>
  );
}

export default page;
