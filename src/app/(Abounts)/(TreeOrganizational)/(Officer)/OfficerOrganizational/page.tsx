"use client";
import { Box, Paper, Tab, Typography, useMediaQuery } from "@mui/material";
import Button from "@mui/material/Button";
import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { TabContext, TabList, TabPanel } from "@mui/lab";

const { Meta } = Card;

interface Board {
  id: number;
  name: string;
  position: string;
  priority: string;
  type: string;
  imagePath: string;
}

interface Data {
  Id: number;
  Name: string;
  Position: string;
  Priority: string;
  Type: string;
  ImagePath: string;
}

const OfficerOrganizational = () => {
  const router = useRouter();
  const [board, setBoard] = useState<Board[]>([]);
  const [rows, setRows] = useState<Data[]>([]);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const URLFile = process.env.NEXT_PUBLIC_PICHER_BASE_URL;
  const isMobile = useMediaQuery("(max-width:768px)");
  const [value, setValue] = useState("");

  const fetchBoard = useCallback(async () => {
  try {
    const response = await fetch(`${API}/TreeOrganizational/GetOfficerAll`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const { data } = await response.json();
      const processedData = data.map((officer: any) => ({
        id: officer.Id,
        name: officer.Name,
        position: officer.Position,
        priority: officer.Priority,
        type: officer.Type,
        imagePath: `${URLFile}${officer.ImagePath}`,
    }));

    setBoard(processedData);
    setRows(data);
  } catch (error) {
    console.error("Failed to fetch images:", error);
  }
}, [API]);

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`${API}/TreeOrganizational/Delete`, {
        data: { id },
      });
      if (response.status === 200) {
        Swal.fire(
          "Deleted!",
          "The Organizational has been deleted.",
          "success"
        );
        setBoard((prevBoard) => prevBoard.filter((board) => board.id !== id));
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

  const uniqueType = useMemo(
    () => Array.from(new Set(rows.map((row) => row.Type))),
    [rows]
  );

  // Set initial tab value after uniqueType is computed
  useEffect(() => {
    if (uniqueType.length > 0) {
      setValue(uniqueType[0]);
    }
  }, [uniqueType]);

  const renderBoardByPriority = (priority: string) => {
    const filteredBoard = board.filter(
      (b) => b.priority === priority && b.type === value
    );

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
              <EditOutlined
                key="edit"
                onClick={() =>
                  router.push(`/OfficerOrganizationalEdit/${b.id}`)
                }
              />,
              <DeleteOutlined
                key="delete"
                onClick={() => handleDelete(b.id)}
              />,
            ]}
          >
            <Meta
              style={{ fontFamily: "Mitr" }}
              title={b.name}
              description={b.position}
            />
          </Card>
        ))}
      </Box>
    );
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <DashboardCard title="เจ้าหน้าที่สหกรณ์ฯ">
      <Paper>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box></Box>
          <Link href="/OfficerOrganizationalCreate">
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
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              {uniqueType.map((type) => (
                <Tab label={type} value={type} key={type} />
              ))}
            </TabList>
          </Box>
          {uniqueType.map((type, index) => (
            <TabPanel key={index} value={type}>
              <Box>
                {["1", "2", "3", "4", "5"].map((priority) =>
                  renderBoardByPriority(priority)
                )}
              </Box>
            </TabPanel>
          ))}
        </TabContext>
      </Paper>
    </DashboardCard>
  );
};

export default OfficerOrganizational;
