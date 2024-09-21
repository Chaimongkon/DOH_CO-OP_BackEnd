"use client";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import NumberOfWebsiteVisitsPerDay from "./components/dashboard/NumberOfWebsiteVisitsPerDay";
import NumberOfWebsiteVisitsToDay from "./components/dashboard/NumberOfWebsiteVisitsToDay";
import CookieSchedules from "./components/dashboard/CookieSchedules";
import LatestCookieConsents from "./components/dashboard/LatestCookieConsents";
import NumberOfWebsiteVisitsWeek from "./components/dashboard/NumberOfWebsiteVisitsWeek";

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
                <NumberOfWebsiteVisitsWeek />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <CookieSchedules />
          </Grid>
          <Grid item xs={12} lg={8}>
            <LatestCookieConsents />
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
