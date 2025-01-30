"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  FormControlLabel,
  Paper,
  useMediaQuery,
  Button,
  Typography,
  Card,
  CardActions,
  CardContent,
  CardMedia,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import DashboardCard from "@/app/components/shared/DashboardCard";
import theme from "@/utils/theme";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Switch, { SwitchProps } from "@mui/material/Switch";

interface Notifi {
  id: number;
  imagePath: string;
  url: string;
  status: boolean;
}

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
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
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

const NotifyAll = () => {
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [notifications, setNotifications] = useState<Notifi[]>([]);
  const [statusUpdate, setStatusUpdate] = useState<{
    id: string;
    status: string;
  }>({ id: "", status: "" });
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const URLFile = process.env.NEXT_PUBLIC_PICHER_BASE_URL;

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch(`${API}/Notifications/GetAll`);
      if (!response.ok) throw new Error("Network response was not ok");

      const { data } = await response.json();
      const processedData = data.map((item: any) => ({
        id: item.Id,
        imagePath: `${URLFile}${item.ImagePath}`,
        url: item.URLLink,
        status: item.IsActive,
      }));

      setNotifications(processedData);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [API, URLFile]);

  // Handle status update
  const handleStatusChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newStatus = event.target.checked ? "1" : "0";
    const id = event.target.value;
    setStatusUpdate({ id, status: newStatus });

    try {
      const response = await fetch(`${API}/Notifications/UpdateStatus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const result = await response.json();
      if (result.message === "OK") {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "UPDATE STATUS SUCCESSFULLY",
          showConfirmButton: false,
          timer: 1500,
        });
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id.toString() === id
              ? { ...notif, status: newStatus === "1" }
              : notif
          )
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // Handle delete notification
  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`${API}/Notifications/Delete`, {
        data: { id },
      });
      if (response.status === 200) {
        Swal.fire("Deleted!", "The notification has been deleted.", "success");
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      } else {
        Swal.fire("Error!", "Failed to delete the notification.", "error");
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the notification.",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <DashboardCard title="จัดการ Notifications ">
      <Container maxWidth="lg">
        <Paper>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box></Box>
            <Link href="/NotifyCreate">
              <Button
                variant="contained"
                size="small"
                color="success"
                startIcon={<AddCircleIcon />}
              >
                Add Notification
              </Button>
            </Link>
          </Box>
          <Box
            component="ul"
            sx={{ display: "flex", gap: 3, flexWrap: "wrap", p: 2, m: 0 }}
          >
            {notifications.map((notif) => (
              <Card
                variant="outlined"
                sx={{
                  width: isMobile ? 240 : 345,
                  padding: isMobile ? 1 : 2,
                  margin: "auto",
                }}
                key={notif.id}
              >
                <CardMedia
                  component="img"
                  alt="Notification Image"
                  sx={{ height: { xs: 220, sm: 240, md: 318 } }}
                  image={notif.imagePath}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    URL Link: {notif.url}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{ flexDirection: { xs: "column", sm: "row" }, gap: 1 }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    color="warning"
                    startIcon={<EditIcon />}
                    onClick={() => router.push(`/NotifyEdit/${notif.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(notif.id)}
                  >
                    Delete
                  </Button>
                  <FormControlLabel
                    control={
                      <IOSSwitch
                        defaultChecked={notif.status}
                        onChange={handleStatusChange}
                        value={notif.id}
                      />
                    }
                    label=""
                  />
                </CardActions>
              </Card>
            ))}
          </Box>
        </Paper>
      </Container>
    </DashboardCard>
  );
};

export default NotifyAll;
