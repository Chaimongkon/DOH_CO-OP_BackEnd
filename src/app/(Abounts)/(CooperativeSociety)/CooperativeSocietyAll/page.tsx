"use client";
import { Box, Paper, Tab, useMediaQuery } from "@mui/material";
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
  image: string;
  societyType: string;
}

interface Data {
  Id: number;
  Image: string;
  SocietyType: string;
}

const base64ToBlobUrl = (base64: string) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/webp" }); // adjust the type if necessary
  return URL.createObjectURL(blob);
};

const CooperativeSocietyAll = () => {
  const router = useRouter();
  const [board, setBoard] = useState<Board[]>([]);
  const [rows, setRows] = useState<Data[]>([]);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const isMobile = useMediaQuery("(max-width:768px)");
  const [value, setValue] = useState("");

  const fetchBoard = useCallback(async () => {
    try {
      const response = await fetch(`${API}/CooperativeSociety/GetAll`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
  
      const processedData = data.map((society: any) => ({
        id: society.Id,
        image: base64ToBlobUrl(society.Image),
        societyType: society.SocietyType,
      }));
      setBoard(processedData);
      setRows(data);
  
      // Explicitly type uniqueTypes as string[]
      const uniqueTypes: string[] = Array.from(new Set(data.map((row: any) => row.SocietyType)));
      if (uniqueTypes.length > 0) {
        setValue(uniqueTypes[0]);
      }
    } catch (error) {
      console.error("Failed to fetch Board:", error);
    }
  }, [API]);
  

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`${API}/CooperativeSociety/Delete`, {
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
    () => Array.from(new Set(rows.map((row) => row.SocietyType))),
    [rows]
  );

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <DashboardCard title="รู้จักสหกรณ์ฯ">
      <Paper>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box></Box>
          <Link href="/CooperativeSocietyCreate">
            <Button
              variant="contained"
              size="small"
              color="success"
              startIcon={<AddCircleIcon />}
            >
              Add CooperativeSociety
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
                {board
                  .filter((b) => b.societyType === value)
                  .map((b) => (
                    <Card
                      key={b.id}
                      hoverable
                      style={{
                        width: isMobile ? "100%" : 400,
                        maxWidth: 400,
                        textAlign: "center",
                        margin: isMobile ? "0 auto" : undefined,
                      }}
                      cover={<img alt="example" src={b.image} />}
                      actions={[
                        <EditOutlined
                          key="edit"
                          onClick={() =>
                            router.push(`/CooperativeSocietyEdit/${b.id}`)
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
                        title={b.societyType}
                      />
                    </Card>
                  ))}
              </Box>
            </TabPanel>
          ))}
        </TabContext>
      </Paper>
    </DashboardCard>
  );
};

export default CooperativeSocietyAll;
