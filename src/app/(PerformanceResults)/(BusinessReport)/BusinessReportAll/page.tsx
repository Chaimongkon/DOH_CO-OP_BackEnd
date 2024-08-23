"use client";
import { Paper } from "@mui/material";
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
import Meta from "antd/es/card/Meta";

const avatarImages = [
  "/images/Icon/bottts-1.png",
  "/images/Icon/bottts-2.png",
  "/images/Icon/bottts-3.png",
  "/images/Icon/bottts-4.png",
  "/images/Icon/bottts-5.png",
];

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

interface Business {
  id: number;
  title: string;
  image: string;
  fileUrl: string;  // URL to the PDF file
}

const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * avatarImages.length);
  return avatarImages[randomIndex];
};

const BusinessReportPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [business, setBusiness] = useState<Business[]>([]);
  const [selectedPDFUrl, setSelectedPDFUrl] = useState<string | null>(null);
  const { styles } = useStyle();
  const token = useTheme();
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const [size, setSize] = useState<SizeType>("middle");
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchReports = useCallback(async () => {
    try {
      const response = await fetch(`${API}/BusinessReport/GetAll`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const { data } = await response.json();

      const processedData = data.map((report: any) => ({
        id: report.Id,
        title: report.Title,
        image: `data:image/webp;base64,${report.Image}`,  // Assuming the image is still base64
        fileUrl: `${API}/BusinessReport/GetAll/File/${report.Id}`,  // URL to fetch the PDF
      }));

      setBusiness(processedData);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  }, [API]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

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
        );
      }
    }
  `;

  const showModal = (fileUrl: string) => {
    setSelectedPDFUrl(fileUrl);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPDFUrl(null);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`${API}/BusinessReport/Delete`, {
        data: { id },
      });
      if (response.status === 200) {
        Swal.fire("Deleted!", "The report has been deleted.", "success");
        setBusiness((prevBusiness) =>
          prevBusiness.filter((report) => report.id !== id)
        );
      } else {
        Swal.fire("Error!", "Failed to delete the report.", "error");
      }
    } catch (error) {
      console.error("Failed to delete report:", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the report.",
        "error"
      );
    }
  };

  return (
    <PageContainer>
      <DashboardCard title="Manage BusinessReport">
        <Container>
          <Paper>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Box></Box>
              <Link href="/BusinessReportCreate">
                <Button
                  type="primary"
                  shape="round"
                  icon={<PlusCircleOutlined />}
                  size={size}
                  style={{ background: "#4BD08B" }}
                >
                  Add BusinessReport
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
              {business.map((report) => (
                <Card
                  key={report.id}
                  style={{ width: 300 }}
                  cover={
                    <div style={{ position: "relative", cursor: "pointer" }}>
                      <img
                        width="100%"
                        height="400"
                        src={report.image}
                        alt="Report Thumbnail"
                        style={{ objectFit: "cover" }}
                        onClick={() => showModal(report.fileUrl)}
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
                      key="view"
                      onClick={() => showModal(report.fileUrl)}
                    />,
                    <EditOutlined
                      key="edit"
                      onClick={() => router.push(`/BusinessReportEdit/${report.id}`)}
                    />,
                    <DeleteOutlined
                      key="delete"
                      onClick={() => handleDelete(report.id)}
                    />,
                  ]}
                >
                  <Meta
                    avatar={<Avatar src={getRandomAvatar()} />}
                    title={report.title}
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
              className={classNames.content}
              style={modalStyles.content}
              width={700}
              footer={
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
                      Close
                    </Button>
                  </ConfigProvider>
                </center>
              }
            >
              {selectedPDFUrl && (
                <iframe
                  src={selectedPDFUrl}
                  width="100%"
                  height="600px"
                  title="PDF Preview"
                />
              )}
            </Modal>
          </Paper>
        </Container>
      </DashboardCard>
    </PageContainer>
  );
};

export default BusinessReportPage;
