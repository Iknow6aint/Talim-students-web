import Layout from '@/components/Layout'
import { Header } from '@/components/header';
import Timetable from "@/components/Timetable";
import React from 'react'

function page() {
  return (
    <Layout><main>
        <Header/>
    <Timetable />
  </main></Layout>
  )
}

export default page


