"use client";
import DashboardCard from "@/app/components/shared/DashboardCard";
import { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { FormControlLabel, Paper, useMediaQuery } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Link from "next/link";
import { useRouter } from "next/navigation";
import theme from "@/utils/theme";
import { styled } from "@mui/material/styles";
import Switch, { SwitchProps } from "@mui/material/Switch";

interface Notifi {
  id: number;
  image: string;
  url: string;
  status: boolean;
}

const base64ToBlobUrl = (base64: string) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/webp' }); // adjust the type if necessary
  return URL.createObjectURL(blob);
};

const NotifyAll = () => {
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [checked, setChecked] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [notifi, setNotifi] = useState<Notifi[]>([]);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const IOSSwitch = styled((props: SwitchProps) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
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
          backgroundColor:
            theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch(`${API}/Notifications/GetAll`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Assuming the image data is base64 encoded
      const processedData = data.map((notify: any) => ({
        id: notify.Id,
        image: base64ToBlobUrl(notify.Image),
        url: notify.URLLink,
        status: notify.IsActive,
      }));

      setNotifi(processedData);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  }, [API]);

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    let updatedList = "";
    const updatedID = event.target.value;

    if (event.target.checked) {
      updatedList = "1";
    } else {
      updatedList = "0";
    }

    setChecked(updatedList);
    setId(updatedID);

    if (id.length > 0) {
      hastatus();
    }
  };

  const hastatus = useCallback(async () => {
    try {
      const response = await fetch(`${API}Notifications/UpdateStatus/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          status: checked,
        }),
      });
      const result = await response.json();
      console.log(result);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "UPDATE STATUS SUCCESSFULLY",
        showConfirmButton: false,
        timer: 1500,
      });

      if (result.status === "OK") {
        window.location.reload();
      }
    } catch (error) {
      console.error("error", error);
    }
  }, [API, id, checked]);

  const Delete = async (id: number) => {
    try {
      const response = await axios.delete(`${API}/Notifications/Delete`, {
        data: { id },
      });
      if (response.status === 200) {
        Swal.fire("Deleted!", "The slide has been deleted.", "success");
        setNotifi((prevSlides) =>
          prevSlides.filter((notifi) => notifi.id !== id)
        );
      } else {
        Swal.fire("Error!", "Failed to delete the slide.", "error");
      }
    } catch (error) {
      console.error("Failed to delete slide:", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the slide.",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchImages();
    if (Object.keys(id).length > 0) {
      hastatus();
    }
  }, [id, fetchImages, hastatus]);

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
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
              p: 2,
              m: 0,
            }}
          >
            {notifi.map((notifiy) => (
              <Card
                variant="outlined"
                sx={{
                  width: isMobile ? 240 : 345,
                  padding: isMobile ? 1 : 2,
                  margin: "auto",
                }}
                key={notifiy.id}
              >
                <CardMedia
                  component="img"
                  alt="green iguana"
                  sx={{
                    height: { xs: 220, sm: 240, md: 318 },
                  }}
                  image={notifiy.image}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    URL Link : {notifiy.url}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    flexDirection: { xs: "column", sm: "row" }, // Stack buttons vertically on small screens
                    alignItems: { xs: "stretch", sm: "center" }, // Stretch buttons on small screens
                    gap: { xs: 1, sm: 1 }, // Add some space between buttons
                    justifyContent: "space-between",
                  }}
                >
                  <Box></Box>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    size="small"
                    color="warning"
                    tabIndex={-1}
                    startIcon={<EditIcon />}
                    onClick={() => router.push(`/NotifyEdit/${notifiy.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    size="small"
                    color="error"
                    tabIndex={-1}
                    startIcon={<DeleteIcon />}
                    onClick={() => Delete(notifiy.id)}
                  >
                    Delete
                  </Button>

                  <Box flexGrow={1} />
                  <FormControlLabel
                    control={
                      <IOSSwitch
                        defaultChecked={Boolean(notifiy.status)}
                        onChange={handleCheck}
                        value={notifiy.id}
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
