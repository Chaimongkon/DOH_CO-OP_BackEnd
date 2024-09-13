import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Stack, Typography, Avatar, Fab } from "@mui/material";
import {
  IconArrowDownRight,
  IconArrowUpLeft,
  IconUsers
} from "@tabler/icons-react";
import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";


const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
function sum(arr: number[]): number {
  return arr.reduce((total, num) => total + num, 0);
}
const NumberOfWebsiteVisitsToDay = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const errorlight = "#fdede8";
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [visitsData, setVisitsData] = useState<number[]>([]);
  const [todayCounts, setTodayCounts] = useState<number | null>(null);
  const [percentageChange, setPercentageChange] = useState<number | null>(null);

  // Fetch visits data
  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await fetch(`${API}/Visits/GetDay`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        const visitCounts = data.map(
          (entry: { TotalVisits: number }) => entry.TotalVisits
        );

        const totalVisitsToday = visitCounts.reduce(
          (sum: number, current: any) => sum + Number(current),
          0
        );
        setVisitsData(visitCounts);
        setTodayCounts(totalVisitsToday);

        // Calculate percentage change based on the last two hours
        if (visitCounts.length > 1) {
          const lastHourVisits = visitCounts[visitCounts.length - 1];
          const previousHourVisits = visitCounts[visitCounts.length - 2];
          const change =
            ((lastHourVisits - previousHourVisits) / previousHourVisits) * 100;
          setPercentageChange(change);
        }
      } catch (error) {
        console.error("Failed to fetch visits:", error);
      }
    };

    fetchVisits();
  }, [API]);

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: "area",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      colors: [primary],
      type: "solid",
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
    },
  };

  const seriescolumnchart: any = [
    {
      name: "จำนวน ",
      color: primary,
      data: visitsData,
    },
  ];

  return (
    <DashboardCard
      title="จำนวนเข้าชมเว็บไซต์ (วันนี้)"
      action={
        <Fab color="error" size="medium" sx={{ color: "#ffffff" }}>
          <IconUsers width={24} />
        </Fab>
      }
      footer={
        <Chart
          options={optionscolumnchart}
          series={seriescolumnchart}
          type="area"
          width={"100%"}
          height="60px"
        />
      }
    >
      <>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          {todayCounts !== null ? todayCounts : "Loading..."} ครั้ง
        </Typography>
        <Stack direction="row" spacing={1} my={1} alignItems="center">
          <Avatar sx={{ bgcolor: errorlight, width: 21, height: 21 }}>
            {percentageChange !== null && percentageChange >= 0 ? (
              <IconArrowUpLeft width={18} color="#39B69A" />
            ) : (
              <IconArrowDownRight width={18} color="#FA896B" />
            )}
          </Avatar>
          {percentageChange !== null ? (
            <Typography variant="subtitle2" fontWeight="600">
              {percentageChange.toFixed(0)}%
            </Typography>
          ) : (
            <Typography variant="subtitle2" fontWeight="600">
              Loading...
            </Typography>
          )}
          <Typography variant="subtitle2" color="textSecondary">
            last Hour
          </Typography>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default NumberOfWebsiteVisitsToDay;
