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

interface App {
  id: number;
  imageNumber: number;
  imagePath: string;
  applicationMainType: string;
  applicationType: string;
}

interface Data {
  Id: number;
  ImageNumber: number;
  ImagePath: Buffer;
  ApplicationMainType: string;
  ApplicationType: string;
}

const InstallationAll = () => {
  const router = useRouter();
  const [apps, setApps] = useState<App[]>([]);

  const [rows, setRows] = useState<App[]>([]);
  console.log(rows)
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const URLFile = process.env.NEXT_PUBLIC_PICHER_BASE_URL;
  const isMobile = useMediaQuery("(max-width:768px)");
  const [value, setValue] = useState("");
  const typeForm = "ดูข้อมูลส่วนบุคคล";

  const fetchBoard = useCallback(async () => {
    if (!API || !URLFile) return;

    try {
      const response = await fetch(`${API}/Application/GetAll`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const processedData: App[] = data
        .map((app: any) => ({
          id: app.Id,
          imageNumber: app.ImageNumber,
          imagePath: `${URLFile}${app.ImagePath}`,
          applicationMainType: app.ApplicationMainType,
          applicationType: app.ApplicationType,
        }))
        .filter((app: App) => app.applicationMainType === typeForm);

      setApps(processedData);
      setRows(processedData); // ✅ ใช้ processedData ตรงๆ

      const uniqueTypes: string[] = Array.from(
        new Set(processedData.map((row) => row.applicationType))
      );

      if (uniqueTypes.length > 0) {
        setValue(uniqueTypes[0]);
      }
    } catch (error) {
      console.error("Failed to fetch Board:", error);
    }
  }, [API, URLFile, typeForm]);
  
  

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`${API}/Application/Delete`, {
        data: { id },
      });
      if (response.status === 200) {
        Swal.fire(
          "Deleted!",
          "The Organizational has been deleted.",
          "success"
        );
        setApps((prevApp) => prevApp.filter((apps) => apps.id !== id));
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
    () => Array.from(new Set(rows.map((row) => row.applicationType))),
    [rows]
  );

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <DashboardCard title={typeForm}>
      <Paper>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box></Box>
          <Link
            href={`/ApplicationCreate?typeForm=${encodeURIComponent(typeForm)}`}
          >
            <Button
              variant="contained"
              size="small"
              color="success"
              startIcon={<AddCircleIcon />}
            >
              Add {typeForm}
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
                  flexWrap: "wrap",
                  p: 2,
                  m: 0,
                  gap: 3,
                }}
              >
                {apps
                  .filter((b) => b.applicationType === value)
                  .map((b) => (
                    <Card
                      key={b.id}
                      hoverable
                      style={{
                        width: isMobile ? "100%" : 400,
                        maxWidth: 300,
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
                        title={`ลำดับที่ ${b.imageNumber}`}
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

export default InstallationAll;
