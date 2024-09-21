import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import DashboardCard from "@/app/(Dashboard)//components/shared/DashboardCard";

interface ConsentData {
  Id: number;
  UserId: string;
  ConsentStatus: number;
  ConsentDate: string;
  CookieCategories: string;
  IpAddress: string;
  UserAgent: string;
}

const LatestCookieConsents: React.FC = () => {
  const [consentData, setConsentData] = useState<ConsentData[]>([]);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    fetch(`${API}/CookieConsent/GetAll`)
      .then((response) => response.json())
      .then((data: ConsentData[]) => {
        // Sort data by ConsentDate in descending order and get the latest 5 entries
        const sortedData = data.sort(
          (a, b) =>
            new Date(b.ConsentDate).getTime() -
            new Date(a.ConsentDate).getTime()
        );
        const latestFive = sortedData.slice(0, 7);
        setConsentData(latestFive);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <DashboardCard title="Latest Cookie Consents">
      <Box sx={{ overflow: "auto" }}>
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
          <Table
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Id
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    UserId
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    IpAddress
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Categories
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consentData.map((consent) => (
                <TableRow key={consent.Id}>
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: "500",
                      }}
                    >
                      {consent.Id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={600}>
                        {consent.UserId}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      sx={{
                        px: "4px",
                        backgroundColor: "#1976d2",
                        color: "#fff",
                      }}
                      size="small"
                      label={consent.IpAddress}
                    ></Chip>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                      fontWeight={400}
                    >
                      {consent.CookieCategories}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </DashboardCard>
  );
};

export default LatestCookieConsents;
