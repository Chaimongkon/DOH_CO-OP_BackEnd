import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Fab } from '@mui/material';
import { IconArrowDownRight, IconCurrencyDollar } from '@tabler/icons-react';
import DashboardCard from '@/app/(Dashboard)/components/shared/DashboardCard';

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ProductSales = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const errorlight = '#fdede8';
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  // State to hold the fetched data
  const [todayCounts, setTodayCounts] = useState<string | null>(null);

  // Fetch visits data
  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await fetch(`${API}/Visits/GetAll`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setTodayCounts(data.todayCount);

        
      } catch (error) {
        console.error("Failed to fetch visits:", error);
      }
    };

    fetchVisits();
  }, [API]);

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: 'sparklines',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      colors: [primary],
      type: 'solid',
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };

  const seriescolumnchart: any = [
    {
      name: '',
      color: primary,
      data: [25, 66, 20, 40, 12, 58, 20],
    },
  ];

  return (
    <DashboardCard
      title="จำนวนเข้าชมเว็บไซต์(วันนี้)"
      action={
        <Fab color="error" size="medium" sx={{ color: '#ffffff' }}>
          <IconCurrencyDollar width={24} />
        </Fab>
      }
      footer={
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="area" width={"100%"} height="60px" />
      }
    >
      <>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          {todayCounts !== null ? todayCounts : 'Loading...'} ครั้ง
        </Typography>
        <Stack direction="row" spacing={1} my={1} alignItems="center">
          <Avatar sx={{ bgcolor: errorlight, width: 21, height: 21 }}>
            <IconArrowDownRight width={18} color="#FA896B" />
          </Avatar>
          <Typography variant="subtitle2" fontWeight="600">
            +9%
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            last year
          </Typography>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default ProductSales;
