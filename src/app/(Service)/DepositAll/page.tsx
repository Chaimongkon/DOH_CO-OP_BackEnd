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
interface Service {
  id: number;
  title: string;
  mainType: string;
  subcategories: string;
  image: string;
}

interface Data {
  Id: number;
  Title: string;
  MainType: string;
  Subcategories: string;
  Image: string;
}

const base64ToBlobUrl = (base64: string) => {
  const byteCharacters = atob(base64);
  const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/webp" });
  return URL.createObjectURL(blob);
};

const ServiceCard = ({
  service,
  isMobile,
  onDelete,
  onEdit,
}: {
  service: Service;
  isMobile: boolean;
  onDelete: () => void;
  onEdit: () => void;
}) => (
  <Card
    hoverable
    style={{
      width: isMobile ? "100%" : 400,
      maxWidth: 400,
      textAlign: "center",
      margin: isMobile ? "0 auto" : undefined,
    }}
    cover={<img alt="service" src={service.image} />}
    actions={[
      <EditOutlined key="edit" onClick={onEdit} />,
      <DeleteOutlined key="delete" onClick={onDelete} />,
    ]}
  >
    <Meta style={{ fontFamily: "Mitr" }} title={service.subcategories} />
  </Card>
);

const DepositAll = () => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:768px)");
  const [services, setServices] = useState<Service[]>([]);
  const [rows, setRows] = useState<Data[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("");
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const typeForm = "บริการเงินฝาก";

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
        image: base64ToBlobUrl(item.Image),
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
            "Ordinary member type A",
            "Ordinary member type B",
            "Associate member",
          ];
          return order.indexOf(a) - order.indexOf(b);
        }
      ),
    [rows]
  );

  return (
    <DashboardCard title={`จัดการ ${typeForm}`}>
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
                  />
                ))}
              </Box>
            </TabPanel>
          ))}
        </TabContext>
      </Paper>
    </DashboardCard>
  );
};

export default DepositAll;
