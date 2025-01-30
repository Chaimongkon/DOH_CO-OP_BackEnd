"use client";
import { useEffect, useState } from "react";
import { Card, Row, Col, Spin, Button } from "antd";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";
import Swal from "sweetalert2";
import { Box, Container, Paper } from "@mui/material";
import Link from "next/link";
import { PlusCircleOutlined } from "@ant-design/icons";
const { Meta } = Card;

interface Photo {
  Id: string;
  Title: string;
  Cover: string;
}
type SizeType = "large" | "middle" | "small";
interface Video {
  id: number;
  title: string;
  youTubeUrl: string;
  details: string;
}
const PhotoAllPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [photos, setPhotos] = useState<Photo[]>([]);
  console.log(photos)
  const [loading, setLoading] = useState(true);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const URLImg = process.env.NEXT_PUBLIC_PICHER_BASE_URL;
  const [size, setSize] = useState<SizeType>("middle");

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(`${API}/Photos/GetCover`);
        setPhotos(response.data.photos);
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`${API}/Photos/DeleteAll`, {
        data: { id },
      });
      if (response.status === 200) {
        Swal.fire("Deleted!", "The album has been deleted.", "success");
        setPhotos((prevPhotos) =>
          prevPhotos.filter((photo) => photo.Id !== id)
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
    router.push(`/PhotoDetails/${id}`);
  };

  if (loading) {
    return (
      <DashboardCard title="Photo Album">
        <Spin tip="Loading photos..." />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Photo Album">
      <Container>
        <Paper>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box></Box>
            <Link href="/PhotosCreate">
              <Button
                type="primary"
                shape="round"
                icon={<PlusCircleOutlined />}
                size={size}
                style={{ background: "#4BD08B" }}
              >
                Add Photo
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
            {photos.map((photo) => (
              <Card
                hoverable
                style={{ width: 320 }}
                cover={<img alt={photo.Title} src={`${URLImg}${photo.Cover}`} />}
                actions={[
                  <Button
                    type="link"
                    danger
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(photo.Id);
                    }}
                  >
                    Delete
                  </Button>,
                ]}
                onClick={() => handleCardClick(photo.Id)}
              >
                <Meta
                  style={{ fontFamily: "Mitr", textAlign: "center" }}
                  title={photo.Title}
                />
              </Card>
            ))}
          </Box>
        </Paper>
      </Container>
    </DashboardCard>
  );
};

export default PhotoAllPage;
