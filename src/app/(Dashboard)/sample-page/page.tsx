'use client';
import { Typography } from '@mui/material';
import PageContainer from '@/app/(Dashboard)/components/container/PageContainer';
import DashboardCard from '@/app/(Dashboard)/components/shared/DashboardCard';


const SamplePage = () => {
  return (
    <PageContainer title="Sample Page" description="this is Sample page">
      <DashboardCard title="Sample Page">
        <Typography>

        </Typography>
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;

