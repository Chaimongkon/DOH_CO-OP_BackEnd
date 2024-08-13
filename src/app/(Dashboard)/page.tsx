'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(Dashboard)/components/container/PageContainer';
// components
import TrafficDistribution from '@/app/(Dashboard)/components/dashboard/TrafficDistribution';
import UpcomingSchedules from '@/app/(Dashboard)/components/dashboard/UpcomingSchedules';
import TopPayingClients from '@/app/(Dashboard)/components/dashboard/TopPayingClients';


import NumberOfWebsiteVisitsPerDay from './components/dashboard/NumberOfWebsiteVisitsPerDay';
import NumberOfWebsiteVisitsToDay from './components/dashboard/NumberOfWebsiteVisitsToDay';

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <NumberOfWebsiteVisitsPerDay />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <NumberOfWebsiteVisitsToDay />
              </Grid>
              <Grid item xs={12}>
                <TrafficDistribution />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <UpcomingSchedules />
          </Grid>
          <Grid item xs={12} lg={8}>
            <TopPayingClients />
          </Grid>
          <Grid item xs={12}>
    
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  )
}

export default Dashboard;
