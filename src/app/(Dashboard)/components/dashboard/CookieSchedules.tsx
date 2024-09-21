import React, { useState, useEffect } from "react";
import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineOppositeContentClasses,
} from "@mui/lab";
import { Typography } from "@mui/material";

interface ConsentData {
  Id: number;
  UserId: string;
  ConsentStatus: number;
  ConsentDate: string;
  CookieCategories: string;
  IpAddress: string;
  UserAgent: string;
}

const CookieSchedules: React.FC = () => {
  const [consentData, setConsentData] = useState<ConsentData[]>([]);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetch(`${API}/CookieConsent/GetAll`)
      .then((response) => response.json())
      .then((data: ConsentData[]) => {
        const sortedData = data.sort(
          (a, b) =>
            new Date(b.ConsentDate).getTime() - new Date(a.ConsentDate).getTime()
        );
        const latestFive = sortedData.slice(0, 7);
        setConsentData(latestFive);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Array of colors to cycle through
  const colors: Array<
    "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
  > = ["primary", "secondary", "success", "warning", "error", "info"];

  return (
    <DashboardCard title="Cookie Schedules">
      <Timeline
        className="theme-timeline"
        sx={{
          p: 0,
          mb: { lg: "-40px" },
          "& .MuiTimelineConnector-root": {
            width: "1px",
            backgroundColor: "#efefef",
          },
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.5,
            paddingLeft: 0,
          },
        }}
      >
        {consentData.map((consent, index) => (
          <TimelineItem key={consent.Id}>
            <TimelineOppositeContent>
              {new Date(consent.ConsentDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                color={colors[index % colors.length]}
                variant="outlined"
              />
              {index !== consentData.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Typography>{consent.CookieCategories}</Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </DashboardCard>
  );
};

export default CookieSchedules;
