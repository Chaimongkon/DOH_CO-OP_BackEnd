"use client";
import { useCallback, useEffect, useState } from "react";
import { Card, Row, Col, Spin, Button } from "antd";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";
import Swal from "sweetalert2";
import { Box, Container, Paper } from "@mui/material";
import Link from "next/link";
import { PlusCircleOutlined } from "@ant-design/icons";
import { styled } from "@mui/material/styles";
import Switch, { SwitchProps } from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DeleteOutlined } from "@ant-design/icons";

const { Meta } = Card;

interface HomeStatus {
  id: string;
  status: boolean;
  remark: string;
}

type SizeType = "large" | "middle" | "small";

// Styled switch component
const IOSSwitch = styled(Switch)<SwitchProps>(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#ae00ff" : "#e3b1fa",
        opacity: 1,
        border: 0,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 13,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const ParticlesAllPage = () => {
  const [homeStatus, setHomeStatus] = useState<HomeStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdate, setStatusUpdate] = useState<{
    id: string;
    status: string;
  }>({ id: "", status: "" });
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchHomeStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API}/HomeStatus/GetAll`);
      if (!response.ok) throw new Error("Network response was not ok");

      const { data } = await response.json();

      const processedData = data.map((item: any) => {
        return {
          id: item.Id,
          status: item.Status,
          remark: item.Remark,
        };
      });

      setHomeStatus(processedData);
    } catch (error) {
      console.error("Failed to fetch Particles:", error);
    }
  }, [API]);

  const handleStatusChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newStatus = event.target.checked ? "1" : "0";
    const id = event.target.value;
    setStatusUpdate({ id, status: newStatus });

    try {
      const response = await fetch(`${API}/HomeStatus/UpdateStatus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const result = await response.json();
      if (result.message === "OK") {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "UPDATE SUCCESSFULLY",
          showConfirmButton: false,
          timer: 1500,
        });
        setHomeStatus((prev) =>
          prev.map((Par) =>
            Par.id.toString() === id
              ? { ...Par, status: newStatus === "1" }
              : Par
          )
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  useEffect(() => {
    fetchHomeStatus();
  }, [fetchHomeStatus]);

  return (
    <DashboardCard title="Status Home">
      <Container>
        <Paper>
          <Box
            component="ul"
            sx={{
              display: "flex",
              gap: { xs: 1, sm: 2, md: 3 },
              flexWrap: "wrap",
              p: { xs: 1, sm: 2 },
              m: 0,
              listStyle: "none",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            {homeStatus.map((particle) => {
              return (
                <Card
                  key={particle.id}
                  hoverable
                  style={{ width: 220 }}
                  cover={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    ></div>
                  }
                >
                  <Meta
                    style={{ fontFamily: "Mitr", textAlign: "center" }}
                    title={particle.remark}
                  />
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: "center",
                      justifyContent: "center",
                      paddingTop: "20px",
                    }}
                  >
                    <Typography>Off</Typography>
                    <IOSSwitch
                      defaultChecked={particle.status}
                      onChange={handleStatusChange}
                      value={particle.id}
                    />
                    <Typography>On</Typography>
                  </Stack>
                </Card>
              );
            })}
          </Box>
        </Paper>
      </Container>
    </DashboardCard>
  );
};

export default ParticlesAllPage;
