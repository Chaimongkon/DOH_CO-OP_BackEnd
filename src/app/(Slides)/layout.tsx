"use client";
import { styled, Container, Box, useMediaQuery, Theme } from "@mui/material";
import React, { useState } from "react";
import Header from "@/app/layout/header/Header";
import Sidebar from "@/app/layout/sidebar/Sidebar";
import theme from "@/utils/theme"; // Import your theme if necessary

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
  padding: "20px",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  return (
    <MainWrapper className="mainwrapper">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />
      {/* Main Wrapper */}
      <PageWrapper className="page-wrapper">
        {/* Header */}
        <Container
          sx={{
            maxWidth: isMobile ? "100%" : "1300px",
          }}
        >
          <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />
          {/* Page Route */}
          <Box sx={{ minHeight: "calc(100vh - 170px)", py: 3 }}>
            {children}
          </Box>
          {/* End Page */}
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
}
