import React, { useState, useEffect, useCallback } from "react";
import { MenuItem, Box, IconButton, Menu } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./TooltipStyles.css";

const options = ["Action", "Another Action", "Something else here"];

const NumberOfWebsiteVisitsPerDay = () => {
  // menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.error.main;

  // state for chart data and categories
  const [chartData, setChartData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [tooltipData, setTooltipData] = useState<string[]>([]);

  const fetchWeek = useCallback(async () => {
    try {
      const response = await fetch(`${API}/Visits/GetWeek`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Initialize arrays for each day of the week
      const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const dataMap: { [key: string]: number } = {
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
        Sun: 0,
      };
      const tooltipMap: { [key: string]: string } = {
        Mon: "",
        Tue: "",
        Wed: "",
        Thu: "",
        Fri: "",
        Sat: "",
        Sun: "",
      };

      // Populate the maps with the actual data
      data.forEach((d: any) => {
        const dayName = d.DayName;
        if (dayName in dataMap) {
          dataMap[dayName] = d.TotalDayCount;
          const date = new Date(d.Date);
          tooltipMap[dayName] = `${date.toLocaleDateString(
            "th-TH"
          )} (${dayName})`;
        }
      });

      // Map the data to the day names
      const processedData = dayNames.map((day) => dataMap[day]);
      const processedTooltipData = dayNames.map((day) => tooltipMap[day]);

      setChartData(processedData);
      setTooltipData(processedTooltipData);
    } catch (error) {
      console.error("Failed to fetch weekly data:", error);
    }
  }, [API]);

  useEffect(() => {
    fetchWeek();
  }, [fetchWeek]);

  // chart options and series
  const optionscolumnchart: any = {
    chart: {
      type: "bar",
      fontFamily: "'Mitr', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: true,
      },
      height: 370,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "60%",
        columnWidth: "42%",
        borderRadius: [6],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
        colors: {
          ranges: [
            {
              from: 0,
              to: 40,
              color: secondary,
            },
            {
              from: 41,
              to: 10000,
              color: primary,
            },
          ],
        },
      },
    },
    stroke: {
      show: true,
      width: 5,
      lineCap: "butt",
      colors: ["transparent"],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      tickAmount: 4,
    },
    xaxis: {
      categories: [
        "วันจันทร์",
        "วันอังคาร",
        "วันพุธ",
        "วันพฤหัสบดี",
        "วันศุกร์",
        "วันเสาร์",
        "วันอาทิตย์",
      ],
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      custom: function ({
        series,
        seriesIndex,
        dataPointIndex,
      }: {
        series: number[][];
        seriesIndex: number;
        dataPointIndex: number;
      }) {
        const color = "#1E90FF";
        return `
          <div class="arrow_box">
            <div style="background-color: #f5f5f5; padding: 5px 10px; border-bottom: 1px solid #e3e3e3;">
              <span>${tooltipData[dataPointIndex]}</span> <!-- Gray header with date -->
            </div>
            <div style="display: flex; align-items: center; padding: 5px 10px;">
              <span style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; display: inline-block; margin-right: 8px;"></span>
              <span>จำนวน: ${series[seriesIndex][dataPointIndex]}</span> <!-- Data value with dot -->
            </div>
          </div>
        `;
      },
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  };

  const seriescolumnchart: any = [
    {
      name: "จำนวน",
      data: chartData,
    },
  ];

  return (
    <DashboardCard
      title="จำนวนเข้าชมเว็บไซต์ (ต่อวัน)"
      action={
        <>
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            {options.map((option) => (
              <MenuItem
                key={option}
                selected={option === "Pyxis"}
                onClick={handleClose}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </>
      }
    >
      <Box className="rounded-bars">
        <Chart
          options={optionscolumnchart}
          series={seriescolumnchart}
          type="bar"
          width={"100%"}
          height="370px"
        />
      </Box>
    </DashboardCard>
  );
};

export default NumberOfWebsiteVisitsPerDay;
