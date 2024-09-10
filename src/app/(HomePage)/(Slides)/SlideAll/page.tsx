"use client";
import DashboardCard from "@/app/components/shared/DashboardCard";
import PageContainer from '@/app/(Dashboard)/components/container/PageContainer';
import { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Paper, useMediaQuery } from "@mui/material";
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
import theme from "@/utils/theme";

interface Image {
  id: number;
  no: number;
  image: string;
  url: string;
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

const SlideAll = () => {
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [slides, setSlides] = useState<Image[]>([]);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch(`${API}/Slides/GetAll?_=${new Date().getTime()}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const processedData = data.map((slide: any) => ({
        id: slide.Id,
        no: slide.No,
        image: base64ToBlobUrl(slide.Image),
        url: slide.URLLink,
      }));

      setSlides(processedData);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  }, [API]);

  const handleDelete = async (id: number) => {
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
    <PageContainer>
      <DashboardCard title="จัดการ Slides">
        <Container >
          <Paper>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Box></Box>
              <Link href="/SlideCreate">
                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  startIcon={<AddCircleIcon />}
                >
                  Add Slides
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
              {slides.map((slide) => (
                <Box component="li" key={slide.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      width: isMobile ? 240 : 320,
                      padding: isMobile ? 1 : 2,
                      margin: "auto",
                    }}
                  >
                    <CardMedia
                      component="img"
                      alt="Slide Image"
                      height="140"
                      image={slide.image}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        URL Link: {slide.url}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ลำดับการแสดง: {slide.no}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        size="small"
                        color="warning"
                        startIcon={<DeleteIcon />}
                        aria-label={`Edit slide ${slide.id}`}
                        onClick={() => router.push(`/SlideEdit/${slide.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        aria-label={`Delete slide ${slide.id}`}
                        onClick={() => handleDelete(slide.id)}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              ))}
            </Box>
          </Paper>
        </Container>
      </DashboardCard>
    </PageContainer>
  );
};

export default SlideAll;
