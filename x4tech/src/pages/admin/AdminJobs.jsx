import React from 'react';
import AdminTeam from './AdminTeam';

// Jobs is managed inside Team page via tabs
// This component simply redirects to the team page at the jobs tab
// You can also render it standalone if needed
export default function AdminJobs() {
  return <AdminTeam defaultTab="jobs" />;
}
