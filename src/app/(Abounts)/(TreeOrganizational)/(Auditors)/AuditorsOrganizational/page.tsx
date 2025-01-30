"use client";
import { Box, Paper, Typography, useMediaQuery } from "@mui/material";
import Button from "@mui/material/Button";
import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const { Meta } = Card;

interface Auditor {
  id: number;
  name: string;
  position: string;
  priority: string;
  type: string;
  imagePath: string;
}


const AuditorsOrganizational = () => {
  const router = useRouter();
  const [board, setBoard] = useState<Auditor[]>([]);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const URLFile = process.env.NEXT_PUBLIC_PICHER_BASE_URL;
  const isMobile = useMediaQuery("(max-width:768px)");

  const fetchBoard = useCallback(async () => {
    try {
      const response = await fetch(`${API}/TreeOrganizational/GetAuditorsAll`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const processedData = data.map((auditor: any) => ({
        id: auditor.Id,
        name: auditor.Name,
        position: auditor.Position,
        priority: auditor.Priority,
        type: auditor.Type,
        imagePath: `${URLFile}${auditor.ImagePath}`,
      }));
      setBoard(processedData);
    } catch (error) {
      console.error("Failed to fetch Board:", error);
    }
  }, [API]);

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`${API}/TreeOrganizational/Delete`, {
        data: { id },
      });
      if (response.status === 200) {
        Swal.fire("Deleted!", "The Organizational has been deleted.", "success");
        setBoard((prevBoard) =>
          prevBoard.filter((board) => board.id !== id)
        );
      } else {
        Swal.fire("Error!", "Failed to delete the Organizational.", "error");
      }
    } catch (error) {
      console.error("Failed to delete Organizational:", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the Organizational.",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  const renderBoardByPriority = (priority: string) => {
    const filteredBoard = board.filter((b) => b.priority === priority);

    return (
      <Box
        sx={{
          justifyContent: "center",
          display: "flex",
          flexWrap: "wrap", // Enable wrapping on small screens
          p: 2,
          m: 0,
          gap: 3,
        }}
      >
        {filteredBoard.map((b) => (
          <Card
            key={b.id}
            hoverable
            style={{
              width: isMobile ? "80%" : "15%", // Adjust width for mobile devices
              textAlign: "center",
            }}
            cover={<img alt="example" src={b.imagePath} />}
            actions={[
              <EditOutlined key="edit" onClick={() => router.push(`/AuditorsOrganizationalEdit/${b.id}`)} />,
              <DeleteOutlined key="delete" onClick={() => handleDelete(b.id)} />,
            ]}
          >
            <Meta style={{fontFamily: 'Mitr'}} title={b.name} description={b.position} />
          </Card>
        ))}
      </Box>
    );
  };

  return (
    <DashboardCard title="ผู้ตรวจสอบบัญชีและผู้ตรวจสอบกิจการ">
      <Paper>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box></Box>
          <Link href="/AuditorsOrganizationalCreate">
            <Button
              variant="contained"
              size="small"
              color="success"
              startIcon={<AddCircleIcon />}
            >
              Add Board
            </Button>
          </Link>
        </Box>
        <Box>
          {["1", "2", "3", "4", "5"].map((priority) =>
            renderBoardByPriority(priority)
          )}
        </Box>
      </Paper>
    </DashboardCard>
  );
};

export default AuditorsOrganizational;
