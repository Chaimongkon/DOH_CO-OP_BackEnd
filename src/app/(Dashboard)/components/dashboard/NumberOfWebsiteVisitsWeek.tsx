import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Grid, Stack, Typography, Avatar } from "@mui/material";
import { IconArrowUpLeft } from "@tabler/icons-react";

import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";

interface VisitsData {
  todayCount: string;
  weekCount: string;
  monthCount: string;
  yearCount: string;
}

const NumberOfWebsiteVisitsWeek: React.FC = () => {
  const [visitsData, setVisitsData] = useState<VisitsData | null>(null);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetch(`${API}/Visits/GetAll`)
      .then((response) => response.json())
      .then((data: VisitsData) => {
        setVisitsData(data);
      })
      .catch((error) => {
        console.error("Error fetching visits data:", error);
      });
  }, []);

  // Chart colors
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const error = theme.palette.error.main;
  const secondary = theme.palette.secondary.light;
  const successlight = theme.palette.success.light;

  // Chart options
  const optionscolumnchart: any = {
    chart: {
      type: "donut",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 170,
    },
    colors: [primary, error, secondary],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "75%",
          background: "transparent",
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };

  const seriescolumnchart: number[] = visitsData
    ? [
        parseInt(visitsData.todayCount),
        parseInt(visitsData.weekCount),
        parseInt(visitsData.monthCount),
        parseInt(visitsData.yearCount),
      ]
    : [0, 0, 0];

  // Calculate percentage increase (placeholder logic)
  const calculatePercentage = (): number => {
    if (visitsData) {
      // Assuming we compare this week's count to last week's count
      // Since we don't have last week's data, we'll return a placeholder value
      return 9; // Replace with actual calculation if data is available
    }
    return 0;
  };

  return (
    <DashboardCard title="จำนวนเข้าชมเว็บไซต์ (ทั้งหมด)">
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} sm={7}>
          <Typography variant="h3" fontWeight="700">
            {visitsData ? visitsData.yearCount : "Loading..."} ครั้ง
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            mt={1}
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Avatar sx={{ bgcolor: successlight, width: 21, height: 21 }}>
                <IconArrowUpLeft width={18} color="#39B69A" />
              </Avatar>
              <Typography variant="subtitle2" fontWeight="600">
                +{calculatePercentage()}%
              </Typography>
            </Stack>
            <Typography variant="subtitle2" color="textSecondary">
              สัปดาห์ที่แล้ว
            </Typography>
          </Stack>
          <Stack spacing={3} mt={3} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 9,
                  height: 9,
                  bgcolor: primary,
                  svg: { display: "none" },
                }}
              ></Avatar>
              <Typography
                variant="subtitle2"
                fontSize="12px"
                color="textSecondary"
              >
                Day
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 9,
                  height: 9,
                  bgcolor: error,
                  svg: { display: "none" },
                }}
              ></Avatar>
              <Typography
                variant="subtitle2"
                fontSize="12px"
                color="textSecondary"
              >
                Week
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 9,
                  height: 9,
                  bgcolor: secondary,
                  svg: { display: "none" },
                }}
              ></Avatar>
              <Typography
                variant="subtitle2"
                fontSize="12px"
                color="textSecondary"
              >
                Month
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        {/* Right Column */}
        <Grid item xs={12} sm={5}>
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="donut"
            width={"100%"}
            height="150px"
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default NumberOfWebsiteVisitsWeek;
