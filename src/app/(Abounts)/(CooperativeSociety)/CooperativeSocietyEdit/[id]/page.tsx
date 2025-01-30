"use client"
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { Autocomplete, Box, Button, Stack, TextField } from "@mui/material";
import DashboardCard from "@/app/components/shared/DashboardCard";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import CancelIcon from "@mui/icons-material/Cancel";
import Swal from "sweetalert2";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";

interface FormData {
  societyType: string;
  image: File | null;
  imageUrl: string;
}

interface TypeOption {
  data: string;
}

const CooperativeSocietyEdit: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const API = process.env.NEXT_PUBLIC_API_BASE_URL as string;
  const URLFile = process.env.NEXT_PUBLIC_PICHER_BASE_URL;

  const [formData, setFormData] = useState<FormData>({
    societyType: "",
    image: null,
    imageUrl: "",
  });

  const [societyType, setSocietyType] = useState<TypeOption | null>(null);

  const TypeOptions: TypeOption[] = [
    { data: "ค่านิยม วิสัยทัศน์ พันธกิจ" },
    { data: "จรรยาบรรณสำหรับคณะกรมมการดำเนินการ" },
    { data: "จรรยาบรรณสำหรับเจ้าหน้าที่" },
    { data: "นโยบายสหกรณ์" },
    { data: "สารจากประธานกรรมการดำเนินการ" },
  ];

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch(`${API}/CooperativeSociety/GetById/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      if (data && data.length > 0) {
        const society = data[0];
        setFormData({
          societyType: society.SocietyType || "",
          image: null,
          imageUrl: society.ImagePath ? `${URLFile}${society.ImagePath}` : "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  }, [API, id]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0];
    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        if (img.width > 1500 || img.height > 1500) {
          Swal.fire({
            icon: "error",
            title: "ขนาดภาพใหญ่เกิ๊น",
            html: `กรุณาเลือกรูปภาพที่มีขนาด <font style="color:red"><b>1671px X 686px</b></font> <br />หรือ รูปที่เล็กกว่า`,
          });
        } else {
          setFormData((prevData) => ({
            ...prevData,
            image: imageFile,
            imageUrl,
          }));
        }
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { societyType, image } = formData;

    const formDataToSend = new FormData();
    formDataToSend.append("societyType", societyType);
    if (image) {
      formDataToSend.append("image", image);
    }

    try {
      const response = await fetch(`${API}/CooperativeSociety/Edit/${id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (response.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "UPDATE SUCCESSFULLY",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          router.push(`/CooperativeSocietyAll`);
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to upload image.",
        });
      }
    } catch (error) {
      console.error("Error updating:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating.",
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
          <Autocomplete
            fullWidth
            options={TypeOptions}
            size="small"
            getOptionLabel={(option) => option.data}
            isOptionEqualToValue={(option, value) => option.data === value.data}
            onChange={(event, newValue) => {
              setSocietyType(newValue);
              setFormData((prevData) => ({
                ...prevData,
                societyType: newValue ? newValue.data : "",
              }));
            }}
            value={
              TypeOptions.find(
                (option) => option.data === formData.societyType
              ) || null
            }
            renderInput={(params) => (
              <TextField {...params} label="Executives and Management" />
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

export default CooperativeSocietyEdit;
