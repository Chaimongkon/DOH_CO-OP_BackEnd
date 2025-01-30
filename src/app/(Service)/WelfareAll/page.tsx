"use client";
import {
  Box,
  Paper,
  Tab,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Button from "@mui/material/Button";
import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { TabContext, TabList, TabPanel } from "@mui/lab";

const { Meta } = Card;

interface Service {
  id: number;
  title: string;
  mainType: string;
  subcategories: string;
  imagePath: string;
  urlLink: string;
}

interface Data {
  Id: number;
  Title: string;
  MainType: string;
  Subcategories: string;
  ImagePath: string;
  URLLink: string;
}

const ServiceCard = ({
  service,
  isMobile,
  onDelete,
  onEdit,
  onPreview,
}: {
  service: Service;
  isMobile: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onPreview: () => void;
}) => (
  <Card
    hoverable
    style={{
      width: isMobile ? "100%" : 400,
      maxWidth: 400,
      textAlign: "center",
      margin: isMobile ? "0 auto" : undefined,
    }}
    cover={<img alt="service" src={service.imagePath} />}
    actions={[
      <EyeOutlined key="preview" onClick={onPreview} />,
      <EditOutlined key="edit" onClick={onEdit} />,
      <DeleteOutlined key="delete" onClick={onDelete} />,
    ]}
  >
    <Meta
      style={{ fontFamily: "Mitr" }}
      title={service.subcategories}
      description={service.urlLink}
    />
  </Card>
);

const WelfareAllPage = () => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:768px)");
  const [services, setServices] = useState<Service[]>([]);
  const [rows, setRows] = useState<Data[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const URLFile = process.env.NEXT_PUBLIC_PICHER_BASE_URL;
  const typeForm = "สวัสดิการสมาชิก";

  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch(`${API}/Services/GetAll`);
      if (!response.ok) throw new Error("Network response was not ok");

      const data: Data[] = await response.json();

      const filteredData = data.filter((item) => item.MainType === typeForm);

      setRows(filteredData);

      const processedData = filteredData.map((item: Data) => ({
        id: item.Id,
        title: item.Title,
        mainType: item.MainType,
        subcategories: item.Subcategories,
        imagePath: `${URLFile}${item.ImagePath}`,
        urlLink: item.URLLink,
      }));

      setServices(processedData);

      const uniqueTypes = Array.from(
        new Set(filteredData.map((item) => item.Subcategories))
      ).sort((a, b) => {
        const order = [
          "สมาชิกสามัญประเภท ก",
          "สมาชิกสามัญประเภท ข",
          "สมาชิกสมทบ",
        ];
        return order.indexOf(a) - order.indexOf(b);
      });

      if (uniqueTypes.length > 0) setSelectedTab(uniqueTypes[0]);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    }
  }, [API, typeForm]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`${API}/Services/Delete`, {
        data: { id },
      });
      if (response.status === 200) {
        Swal.fire("Deleted!", "The service has been deleted.", "success");
        setServices((prev) => prev.filter((service) => service.id !== id));
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      console.error("Failed to delete service:", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the service.",
        "error"
      );
    }
  };

  const handlePreview = (url: string) => {
    setPdfUrl(url);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPdfUrl(null);
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  const filteredServices = useMemo(
    () =>
      services.filter(
        (service) =>
          service.subcategories === selectedTab && service.mainType === typeForm
      ),
    [services, selectedTab, typeForm]
  );

  const uniqueTypes = useMemo(
    () =>
      Array.from(new Set(rows.map((item) => item.Subcategories))).sort(
        (a, b) => {
          const order = [
            "สมาชิกสามัญประเภท ก",
            "สมาชิกสามัญประเภท ข",
            "สมาชิกสมทบ",
          ];
          return order.indexOf(a) - order.indexOf(b);
        }
      ),
    [rows]
  );

  return (
    <DashboardCard title={`จัดการ ${typeForm}`}>
      <Box>
        <Paper>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box></Box>
            <Link
              href={`/ServiceCreate?typeForm=${encodeURIComponent(typeForm)}`}
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
          <TabContext value={selectedTab}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChangeTab} aria-label="service tabs">
                {uniqueTypes.map((type) => (
                  <Tab label={type} value={type} key={type} />
                ))}
              </TabList>
            </Box>
            {uniqueTypes.map((type) => (
              <TabPanel key={type} value={type}>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 3,
                    p: 2,
                  }}
                >
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      isMobile={isMobile}
                      onDelete={() => handleDelete(service.id)}
                      onEdit={() => router.push(`/ServiceEdit/${service.id}`)}
                      onPreview={() => handlePreview(service.urlLink)}
                    />
                  ))}
                </Box>
              </TabPanel>
            ))}
          </TabContext>
        </Paper>

        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
          <DialogTitle>PDF Preview</DialogTitle>
          <DialogContent>
            {pdfUrl && (
              <iframe
                src={pdfUrl}
                width="100%"
                height="600px"
                title="PDF Preview"
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardCard>
  );
};

export default WelfareAllPage;
