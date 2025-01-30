"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Autocomplete, Box, Button, Stack, TextField } from "@mui/material";
import DashboardCard from "@/app/components/shared/DashboardCard";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import CancelIcon from "@mui/icons-material/Cancel";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";

interface FormData {
  name: string;
  position: string;
  priority: string;
  type: string;
  image: File | null;
  imageUrl: string;
}

interface TypeOption {
  data: string;
}

interface PriorityOption {
  data: string;
}

const OrganizationalEdit: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const API = process.env.NEXT_PUBLIC_API_BASE_URL as string;
  const URLFile = process.env.NEXT_PUBLIC_PICHER_BASE_URL;
  const [formData, setFormData] = useState<FormData>({
    name: "",
    position: "",
    priority: "",
    type: "",
    image: null,
    imageUrl: "",
  });
  const [titleType, setTitleType] = useState<TypeOption | null>(null);
  const [titlePriority, setTitlePriority] = useState<PriorityOption | null>(
    null
  );

  const TypeOptions: TypeOption[] = [
    { data: "คณะกรรมการดำเนินการ" },
    { data: "ผู้ตรวจสอบบัญชีและผู้ตรวจสอบกิจการ" },
    { data: "ผู้จัดการใหญ่และรองผู้จัดการฯ" },
    { data: "ฝ่ายสินเชื่อ" },
    { data: "ฝ่ายการเงินและการลงทุน" },
    { data: "ฝ่ายสมาชิกสัมพันธ์และสวัสดิการ" },
    { data: "ฝ่ายทะเบียนหุ้นและติดตามหนี้สิน" },
    { data: "ฝ่ายบริหารทั่วไป" },
    { data: "ฝ่ายบัญชี" },
    { data: "ฝ่ายสารสนเทศ" },
  ];

  const PriorityOptions: PriorityOption[] = [
    { data: "1" },
    { data: "2" },
    { data: "3" },
    { data: "4" },
    { data: "5" },
  ];

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch(
        `${API}/TreeOrganizational/GetBoardById/${id}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const processedData = data.map((officer: any) => ({
        name: officer.Name,
        position: officer.Position,
        priority: officer.Priority,
        type: officer.Type,
        image: data[0].ImagePath
          ? `${URLFile}${data[0].ImagePath}` // Use the file path instead of base64
          : "",
      }));
      if (processedData.length > 0) {
        const officer = data[0];
        setFormData({
          name: officer.Name,
          position: officer.Position,
          priority: officer.Priority,
          type: officer.Type,
          image: null, // Set null here if the file doesn't change
          imageUrl: officer.ImagePath ? `${URLFile}${officer.ImagePath}` : "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  }, [API, id]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0];
    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);

      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        if (img.width > 300 || img.height > 300) {
          Swal.fire({
            icon: "error",
            title: "ขนาดภาพใหญ่เกิ๊น",
            html: `กรุณาเลือกรูปภาพที่มีขนาด <font style="color:red"><b>300px X 300px</b></font> <br />หรือ รูปที่เล็กกว่า`,
          });
        } else {
          setFormData({
            ...formData,
            image: imageFile,
            imageUrl: imageUrl,
          });
        }
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, position, priority, type, image } = formData;

    const formDataToSend = new FormData();
    formDataToSend.append("name", name);
    formDataToSend.append("position", position);
    formDataToSend.append("priority", priority);
    formDataToSend.append("type", type);

    // Append files only if they exist
    if (image) {
      formDataToSend.append("image", image);
    }

    try {
      const response = await fetch(`${API}/TreeOrganizational/Edit/${id}`, {
        method: "PUT",
        body: formDataToSend, // Send FormData directly
      });

      if (response.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "UPDATE SUCCESSFULLY",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          router.back();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to upload image.",
        });
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to submit form. Check the console for more details.",
      });
    }
  };

  const triggerFileInputClick = () => {
    const fileInput = document.getElementById(
      "imageUpload"
    ) as HTMLInputElement | null;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <DashboardCard title="Edit Slides">
      <form onSubmit={handleSubmit}>
        <Box sx={{ p: 2 }}>
          <div
            className="form-group"
            style={{
              borderStyle: "dashed",
              borderWidth: 2,
              borderRadius: 1,
              borderColor: "grey",
            }}
          >
            <label>
              รูปภาพ{" "}
              <span style={{ color: "red" }}>ขนาดภาพสวยๆ 1671px X 686px</span>
            </label>
            <br />
            <br />
            <div className="form-group">
              <center>
                {formData.imageUrl && (
                  <img
                    height="256px"
                    src={
                      formData.imageUrl ||
                      "/images/backgrounds/upload-image.png"
                    }
                    alt="Preview"
                  />
                )}
                <br />
                <br />
                <input
                  type="file"
                  id="imageUpload"
                  name="image"
                  accept="image/png, image/jpeg"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <Button
                  variant="contained"
                  color="warning"
                  endIcon={<FlipCameraAndroidIcon />}
                  onClick={triggerFileInputClick}
                >
                  Change Image
                </Button>
              </center>
            </div>
          </div>
        </Box>

        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            label="ชื่อ - สกุล"
            variant="outlined"
            size="small"
            name="name"
            onChange={handleInputChange}
            value={formData.name}
          />
        </Box>

        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            label="ตำแหน่ง"
            variant="outlined"
            size="small"
            name="position"
            onChange={handleInputChange}
            value={formData.position}
          />
        </Box>

        <Box sx={{ p: 2 }}>
          <Autocomplete
            fullWidth
            options={TypeOptions}
            size="small"
            getOptionLabel={(option) => option.data}
            isOptionEqualToValue={(option, value) => option.data === value.data}
            onChange={(event, newValue) => {
              setTitleType(newValue);
              setFormData((prevData) => ({
                ...prevData,
                type: newValue ? newValue.data : "",
              }));
            }}
            value={
              TypeOptions.find((option) => option.data === formData.type) ||
              null
            }
            renderInput={(params) => (
              <TextField {...params} label="Executives and Management" />
            )}
          />
        </Box>

        <Box sx={{ p: 2 }}>
          <Autocomplete
            fullWidth
            options={PriorityOptions}
            size="small"
            getOptionLabel={(option) => option.data}
            isOptionEqualToValue={(option, value) => option.data === value.data}
            onChange={(event, newValue) => {
              setTitlePriority(newValue);
              setFormData((prevData) => ({
                ...prevData,
                priority: newValue ? newValue.data : "",
              }));
            }}
            value={
              PriorityOptions.find(
                (option) => option.data === formData.priority
              ) || null
            }
            renderInput={(params) => (
              <TextField {...params} label="ลำดับความสำคัญ" />
            )}
          />
        </Box>

        <Box sx={{ p: 2 }}>
          <Stack spacing={2} direction="row">
            <Button
              variant="contained"
              endIcon={<PublishedWithChangesIcon />}
              type="submit"
            >
              Update
            </Button>
            <Button
              variant="contained"
              color="error"
              endIcon={<CancelIcon />}
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </form>
    </DashboardCard>
  );
};

export default OrganizationalEdit;
