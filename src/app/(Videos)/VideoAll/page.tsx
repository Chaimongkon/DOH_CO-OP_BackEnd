"use client";
import {  Paper, Typography } from "@mui/material";
import PageContainer from "@/app/(Dashboard)/components/container/PageContainer";
import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";
import {
  EditOutlined,
  VideoCameraOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Avatar, Card } from "antd";
import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import AddCircleIcon from "@mui/icons-material/AddCircle";
const { Meta } = Card;
import React, { useContext, useState } from "react";
import { Button, ConfigProvider, Modal, Space } from "antd";
import { createStyles, useTheme } from "antd-style";
import { css } from "@emotion/css";
import { CloseCircleOutlined, PlusCircleOutlined  } from "@ant-design/icons";
import type { ConfigProviderProps } from 'antd';

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
  type SizeType = ConfigProviderProps['componentSize'];
const SamplePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { styles } = useStyle();
  const token = useTheme();
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const [size, setSize] = useState<SizeType>('large');

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
  const showModal = () => {
    setIsModalOpen(false);
  };

  return (
    <PageContainer>
      <DashboardCard title="จัดการ Videos">
        <Container>
          <Paper>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Box></Box>
              <Link href="/VideoCreate">
                {/* <Button
                  variant="contained"
                  size="small"
                  color="success"
                  startIcon={<AddCircleIcon />}
                >
                  Add Videos
                </Button> */}
                <Button type="primary" shape="round"  green-10 icon={<PlusCircleOutlined />} size={size}>
            Download
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
              <Card
                style={{ width: 300 }}
                cover={
                  <iframe
                    width="100%"
                    height="200"
                    src="https://www.youtube.com/embed/B42gQyJMXLE"
                    title="YouTube Video"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                }
                actions={[
                  <VideoCameraOutlined
                    key="youtube"
                    onClick={() => setIsModalOpen(true)}
                  />,
                  <EditOutlined key="edit" />,
                  <DeleteOutlined key="delete" />,
                ]}
              >
                <Meta
                  avatar={
                    <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                  }
                  title="“กู้สหกรณ์ ทำไมต้องยื่นเครดิตบูโร”"
                  description="This is the description"
                  style={{ fontFamily: "Mitr" }}
                />
              </Card>
            </Box>
            <Space></Space>
            <Modal
              title=""
              open={isModalOpen}
              onOk={showModal}
              onCancel={showModal}
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
                      onClick={showModal}
                    >
                      ปิด
                    </Button> 
                  </ConfigProvider>
                </center>
              )}
            >
              <iframe
                width="100%"
                height="370"
                src="https://www.youtube.com/embed/B42gQyJMXLE"
                title="YouTube Video"
                frameBorder="0"
                allowFullScreen
              ></iframe>
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

export default SamplePage;
