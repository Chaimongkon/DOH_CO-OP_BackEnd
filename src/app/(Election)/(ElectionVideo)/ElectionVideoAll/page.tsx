"use client";
import { Paper, Typography } from "@mui/material";
import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";
import {
  EditOutlined,
  VideoCameraOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Button, ConfigProvider, Modal, Space } from "antd";
import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import React, { useContext, useState, useCallback, useEffect } from "react";
import { createStyles, useTheme } from "antd-style";
import { css } from "@emotion/css";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const avatarImages = [
  "/images/Icon/bottts-1.png",
  "/images/Icon/bottts-2.png",
  "/images/Icon/bottts-3.png",
  "/images/Icon/bottts-4.png",
  "/images/Icon/bottts-5.png",
];
const { Meta } = Card;

const useStyle = createStyles(({ token }) => ({
  "my-modal-body": {
    background: token.blue1,
    padding: token.paddingSM,
  },
  "my-modal-mask": {
    boxShadow: `inset 0 0 15px #fff`,
  },
  "my-modal-header": {
    borderBottom: `1px dotted ${token.colorPrimary}`,
  },
  "my-modal-footer": {
    color: token.colorPrimary,
  },
  "my-modal-content": {
    border: "1px solid #333",
  },
}));

type SizeType = "large" | "middle" | "small";
interface Video {
  id: number;
  title: string;
  youTubeUrl: string;
  details: string;
}

const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * avatarImages.length);
  return avatarImages[randomIndex];
};

const VideoPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const { styles } = useStyle();
  const token = useTheme();
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const [size, setSize] = useState<SizeType>("middle");
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [search, setSearch] = useState(""); // State for search query
  
  const getYouTubeVideoId = (url: string) => {
    const shortsRegex = /youtube\.com\/shorts\/([^\s/?&]+)/;
    const shortsMatch = url.match(shortsRegex);
    if (shortsMatch && shortsMatch[1]) {
      return shortsMatch[1];
    }
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|watch)\?.*v=|embed\/)|youtu\.be\/)([^\s&]+)/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
  };

  const fetchVideos = useCallback(async () => {
    try {
      let url = `${API}/ElectionVideos/GetAll`;
      if (search) {
        url += `?search=${encodeURIComponent(search)}`;
      }
  
      const response = await fetch(url, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
  
      const processedData = data.map((video: any) => ({
        id: video.Id,
        title: video.Title,
        youTubeUrl: video.YouTubeUrl,
        details: video.Details,
      }));
  
      setVideos(processedData);
    } catch (error) {
      console.error("Failed to fetch Videos:", error);
    }
  }, [API, search]);
  

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const classNames = {
    body: styles["my-modal-body"],
    mask: styles["my-modal-mask"],
    header: styles["my-modal-header"],
    content: styles["my-modal-content"],
  };

  const modalStyles = {
    header: {
      borderLeft: `5px solid ${token.colorPrimary}`,
      borderRadius: 0,
      paddingInlineStart: 5,
    },
    body: {
      boxShadow: "inset 0 0 5px #999",
      borderRadius: 5,
    },
    mask: {
      backdropFilter: "blur(2px)",
    },
    content: {
      boxShadow: "0 0 30px #999",
    },
  };

  const linearGradientButton = css`
    &.${rootPrefixCls}-btn-primary:not([disabled]):not(
        .${rootPrefixCls}-btn-dangerous
      ) {
      border-width: 0;
      background: linear-gradient(135deg, #1d976c, #93f9b9);
      transition: background 0.3s;
      position: relative;
      overflow: hidden;

      > span {
        position: relative;
      }

      &:hover {
        background: linear-gradient(
          135deg,
          #1a2980,
          #26d0ce
        ); /* Change to your desired hover gradient */
      }
    }
  `;

  const showModal = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`${API}/ElectionVideos/Delete`, {
        data: { id },
      });
      if (response.status === 200) {
        Swal.fire("Deleted!", "The slide has been deleted.", "success");
        setVideos((prevVideos) =>
          prevVideos.filter((Video) => Video.id !== id)
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

  return (
    <PageContainer>
      <DashboardCard title="จัดการ Videos คณะกรรมการเลือกตั้ง">
        <Container>
          <Paper>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Box></Box>
              <Link href="/ElectionVideoCreate">
                <Button
                  type="primary"
                  shape="round"
                  icon={<PlusCircleOutlined />}
                  size={size}
                  style={{ background: "#4BD08B" }}
                >
                  Add Video
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
              {videos.map((video) => (
                <Card
                  key={video.id}
                  style={{ width: 300 }}
                  cover={
                    <div style={{ position: "relative", cursor: "pointer" }}>
                      <img
                        width="100%"
                        height="200"
                        src={`https://img.youtube.com/vi/${getYouTubeVideoId(
                          video.youTubeUrl
                        )}/hqdefault.jpg`}
                        alt="Video Thumbnail"
                        style={{ objectFit: "cover" }}
                        onClick={() => showModal(video)}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          fontSize: "3rem",
                          color: "#fff",
                          pointerEvents: "none",
                        }}
                      ></div>
                    </div>
                  }
                  actions={[
                    <VideoCameraOutlined
                      key="youtube"
                      onClick={() => showModal(video)}
                    />,
                    <EditOutlined key="edit" onClick={() => router.push(`/VideoEdit/${video.id}`)}/>,
                    <DeleteOutlined
                      key="delete"
                      onClick={() => handleDelete(video.id)}
                    />,
                  ]}
                >
                  <Meta
                    avatar={<Avatar src={getRandomAvatar()} />}
                    title={video.title}
                    description={video.details}
                    style={{ fontFamily: "Mitr" }}
                  />
                </Card>
              ))}
            </Box>
            <Space></Space>
            <Modal
              title=""
              open={isModalOpen}
              onOk={handleModalClose}
              onCancel={handleModalClose}
              classNames={classNames}
              styles={modalStyles}
              width={700}
              footer={(_) => (
                <center>
                  <ConfigProvider
                    button={{
                      className: linearGradientButton,
                    }}
                  >
                    <Button
                      type="primary"
                      size="large"
                      icon={<CloseCircleOutlined />}
                      onClick={handleModalClose}
                    >
                      ปิด
                    </Button>
                  </ConfigProvider>
                </center>
              )}
            >
              {selectedVideo && (
                <iframe
                  width="100%"
                  height="370"
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                    selectedVideo.youTubeUrl
                  )}`}
                  title="YouTube Video"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              )}
            </Modal>
            <ConfigProvider
              modal={{
                classNames,
                styles: modalStyles,
              }}
            ></ConfigProvider>
          </Paper>
        </Container>
      </DashboardCard>
    </PageContainer>
  );
};

export default VideoPage;
