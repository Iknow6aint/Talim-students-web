'use client';

import Layout from '@/components/Layout';
import { Header } from '@/components/header';
import { ProfileSettings } from '@/components/settings/ProfileSettings';

export default function SettingsPage() {
  return (
    <Layout>
      <div className="relative w-full h-full bg-[#F8F8F8] px-4 overflow-auto">
        <div className="h-full mx-auto flex flex-col space-y-5">
          <Header />
          <ProfileSettings />
        </div>
      </div>
    </Layout>
  );
}
