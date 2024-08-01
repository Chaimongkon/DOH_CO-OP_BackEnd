"use client";
import DashboardCard from "@/app/components/shared/DashboardCard";
import { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Paper } from "@mui/material";
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

interface Image {
  id: number;
  no: number;
  image: string;
  url: string;
}

const SlideShowAll = () => {
  const router = useRouter();
  const [slides, setSlides] = useState<Image[]>([]);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch(`${API}/Slides/ShowAll`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Assuming the image data is base64 encoded
      const processedData = data.map((slide: any) => ({
        id: slide.Id,
        no: slide.No,
        image: `data:;base64,${slide.Image}`,
        url: slide.URLLink,
      }));

      setSlides(processedData);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  }, [API]);

  const Delete = async (id: number) => {
    try {
      const response = await axios.delete(`${API}/Slides/Delete`, {
        data: { id },
      });
      if (response.status === 200) {
        Swal.fire("Deleted!", "The slide has been deleted.", "success");
        setSlides((prevSlides) =>
          prevSlides.filter((slide) => slide.id !== id)
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
    <DashboardCard title="จัดการ Slides ">
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
                  Add Slides
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
              {slides.map((slide) => (
                <Card variant="outlined" sx={{ width: 320 }} key={slide.id}>
                  <CardMedia
                    component="img"
                    alt="green iguana"
                    height="140"
                    image={slide.image}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      URL Link : {slide.url}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ลำดับการแสดง : {slide.no}
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
                      onClick={() => router.push(`/SlideEdit/${slide.id}`)}
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
                      onClick={() => Delete(slide.id)}
                    >
                      Delete
                    </Button>
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
