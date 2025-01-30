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

interface CoopSociety {
  id: number;
  imagePath: string;
  societyType: string;
}

interface Data {
  Id: number;
  ImagePath: string;
  SocietyType: string;
}

const CooperativeSocietyAll = () => {
  const router = useRouter();
  const [coopSociety, setCoopSociety] = useState<CoopSociety[]>([]);
  const [rows, setRows] = useState<Data[]>([]);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const URLFile = process.env.NEXT_PUBLIC_PICHER_BASE_URL;
  const isMobile = useMediaQuery("(max-width:768px)");
  const [value, setValue] = useState("");

  const fetchCoopSociety = useCallback(async () => {
    try {
      const response = await fetch(`${API}/CooperativeSociety/GetAll`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      // Access the 'data' property from the result if your API response is structured like { data: [...] }
      const processedData = result.data.map((society: any) => ({
        id: society.Id,
        imagePath: `${URLFile}${society.ImagePath}`,
        societyType: society.SocietyType,
      }));

      setCoopSociety(processedData);
      setRows(result.data);
      console.log(processedData);
      // Explicitly type uniqueTypes as string[]
      const uniqueTypes: string[] = Array.from(
        new Set(result.data.map((row: any) => row.SocietyType))
      );
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
        setCoopSociety((prevCoopSociety) =>
          prevCoopSociety.filter((coopSociety) => coopSociety.id !== id)
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
    fetchCoopSociety();
  }, [fetchCoopSociety]);

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
                {coopSociety
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
                      cover={<img alt="example" src={b.imagePath} />}
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
