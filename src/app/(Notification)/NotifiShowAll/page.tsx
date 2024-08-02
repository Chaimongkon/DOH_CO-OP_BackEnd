"use client";
import DashboardCard from "@/app/components/shared/DashboardCard";
import { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Checkbox, Paper } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { pink, red } from "@mui/material/colors";

interface Notifi {
  id: number;
  image: string;
  url: string;
  status: boolean;
}
interface Notify {
  status: boolean;
  id: string;
}

interface Props {
  notify: Notify;
}

const SlideShowAll : React.FC<Props> = ({ notify }) => {
  const router = useRouter();
  const [checked, setChecked] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [notifi, setNotifi] = useState<Notifi[]>([]);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

console.log(checked)

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch(`${API}/Notifications/ShowAll`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Assuming the image data is base64 encoded
      const processedData = data.map((slide: any) => ({
        id: slide.Id,
        image: `data:;base64,${slide.Image}`,
        url: slide.URLLink,
        status: slide.IsActive,
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

  const hastatus = () => {
    // Add your hastatus logic here
  };

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
  }, [fetchImages]);

  return (
    <DashboardCard title="จัดการ Notifications ">
      <Container maxWidth="lg">
        <Paper>
          <Box display="flex">
            <Box sx={{ flexGrow: 1 }}> </Box>
            <Box>
              <Link href="/SlideCreate">
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  size="small"
                  color="success"
                  tabIndex={-1}
                  startIcon={<AddCircleIcon />}
                >
                  Add Notification
                </Button>
              </Link>
            </Box>
          </Box>
          <Box component="ul">
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
                <Card variant="outlined" sx={{ width: 320 }} key={notifiy.id}>
                  <CardMedia
                    component="img"
                    alt="green iguana"
                    height="318"
                    image={notifiy.image}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      URL Link : {notifiy.url}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      size="small"
                      color="warning"
                      tabIndex={-1}
                      startIcon={<DeleteIcon />}
                      onClick={() => router.push(`/SlideEdit/${notifiy.id}`)}
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
                    <Checkbox
                      size="large"
                      defaultChecked={Boolean(notifiy.status)}
                      onChange={handleCheck}
                      value={notifiy.id}
                      icon={<RadioButtonUncheckedIcon />}
                      checkedIcon={<CheckCircleIcon />}
                      sx={{
                        color: red[800],
                        "&.Mui-checked": {
                          color: red[600],
                        },
                      }}
                    />
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Box>
        </Paper>
      </Container>
    </DashboardCard>
  );
};

export default SlideShowAll;
