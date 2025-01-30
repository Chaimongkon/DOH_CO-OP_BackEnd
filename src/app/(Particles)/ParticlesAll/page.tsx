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

interface Particle {
  id: string;
  category: string;
  imagePath: string;
  status: boolean;
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [particles, setParticles] = useState<Particle[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdate, setStatusUpdate] = useState<{
    id: string;
    status: string;
  }>({ id: "", status: "" });

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const URLFile = process.env.NEXT_PUBLIC_PICHER_BASE_URL;
  const [size, setSize] = useState<SizeType>("middle");

  const fetchParticles = useCallback(async () => {
    try {
      const response = await fetch(`${API}/Particles/GetAll`);
      if (!response.ok) throw new Error("Network response was not ok");

      const { data } = await response.json();

      const processedData = data.map((item: any) => {
        return {
          id: item.Id,
          imagePath: `${URLFile}${item.ImagePath}`,
          category: item.Category,
          status: item.IsActive,
        };
      });

      setParticles(processedData);
    } catch (error) {
      console.error("Failed to fetch Particles:", error);
    }
  }, [API, URLFile]);

  const handleStatusChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newStatus = event.target.checked ? "1" : "0";
    const id = event.target.value;
    setStatusUpdate({ id, status: newStatus });

    try {
      const response = await fetch(`${API}/Particles/UpdateStatus/${id}`, {
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
        setParticles((prev) =>
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

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`${API}/Particles/DeleteAll`, {
        data: { id },
      });
      if (response.status === 200) {
        Swal.fire("Deleted!", "The album has been deleted.", "success");
        setParticles((prevParticle) =>
          prevParticle.filter((particle) => particle.id !== id)
        );
      } else {
        Swal.fire("Error!", "Failed to delete the album.", "error");
      }
    } catch (error) {
      console.error("Failed to delete album:", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the album.",
        "error"
      );
    }
  };

  const handleCardClick = (id: string) => {
    router.push(`/ParticlesDetail/${id}`);
  };

  useEffect(() => {
    fetchParticles();
  }, [fetchParticles]);

  return (
    <DashboardCard title="Animations Home">
      <Container>
        <Paper>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box>
              {" "}
            </Box>
            <Link href="/ParticlesCreate">
              <Button
                type="primary"
                shape="round"
                icon={<PlusCircleOutlined />}
                size={size}
                style={{ background: "#4BD08B" }}
              >
                Add Particles
              </Button>
            </Link>
          </Box>
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
            {particles.map((particle) => {
              const cleanImagePath = particle.imagePath.replace(
                /[\s"\[\]]/g,
                ""
              );

              const imageArray =
                typeof cleanImagePath === "string" &&
                cleanImagePath.includes(",")
                  ? cleanImagePath.split(",")
                  : [cleanImagePath]; // Wrap a single string in an array if not comma-separated

              // Prepend the base URL if needed
              const completeImageArray = imageArray.map((path: string) =>
                path.startsWith("http") ? path : `${URLFile}${path}`
              );

              const randomImage =
                completeImageArray[
                  Math.floor(Math.random() * completeImageArray.length)
                ];

              return (
                <Card
                  key={particle.id}
                  hoverable
                  style={{ width: 220}}
                  cover={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        alt="Random Halloween Image"
                        src={`${randomImage}`}
                        style={{ width: 120 , height: 120}}
                        onClick={() => handleCardClick(particle.id)}
                      />
                    </div>
                  }
                  actions={[
                    <Button
                      icon={<DeleteOutlined />}
                      type="text"
                      danger
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(particle.id);
                      }}
                    >
                      Delete
                    </Button>,
                  ]}
                >
                  <Meta
                    style={{ fontFamily: "Mitr", textAlign: "center" }}
                    title={particle.category}
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
