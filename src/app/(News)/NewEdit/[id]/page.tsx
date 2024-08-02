"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import DashboardCard from "@/app/components/shared/DashboardCard";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import CancelIcon from "@mui/icons-material/Cancel";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";

interface FormData {
  no: string;
  url: string;
  image: File | null;
  imageUrl: string;
}


const SlideEdit = () => {
  const router = useRouter();
  const { id } = useParams();
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [formData, setFormData] = useState<FormData>({
    no: "",
    url: "",
    image: null,
    imageUrl: "",
  });
  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch(`${API}/News/GetById/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const processedData = data.map((slide: any) => ({
        id: slide.Id,
        no: slide.No,
        image: `data:;base64,${slide.Image}`,
        url: slide.URLLink,
      }));

      if (processedData.length > 0) {
        setFormData({
          no: processedData[0].no,
          url: processedData[0].url,
          image: processedData[0].image,
          imageUrl: processedData[0].image,
        });
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  }, [API, id]);

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
        if (img.width > 1671 || img.height > 686) {
          Swal.fire({
            icon: "error",
            title: "ขนาดภาพใหญ่เกิ๊น",
            html: `กรุณาเลือกรูปภาพที่มีขนาด <font style="color:red"><b>1671px X 686px</b></font> <br />หรือ รูปที่เล็กกว่า`,
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { image, no, url } = formData;
    if (image) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const base64String = reader.result?.toString().split(",")[1];
  
        if (base64String) {
          const response = await fetch(`${API}/News/Edit/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              no: no,
              image: `data:;base64,${base64String}`,
              urllink: url,
            }),
          });
  
          if (response.ok) {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "UPDATE SUCCESSFULLY",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              router.push(`/SlideShowAll`);
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Failed to upload image.",
            });
          }
        }
      };
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
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);
  return (
    <DashboardCard title="Edit Slides">
      <form className="forms-sample" onSubmit={handleSubmit}>
        <Box component="section" sx={{ p: 2 }}>
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
                  <img height="256px" src={formData.imageUrl} alt="Preview" />
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
                  Chang Image
                </Button>
              </center>
            </div>
          </div>
        </Box>
        <Box component="section" sx={{ p: 2 }}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="ลำดับการแสดง"
            variant="outlined"
            size="small"
            name="no"
            onChange={handleInputChange}
            value={formData.no}
          />
        </Box>
        <Box component="section" sx={{ p: 2 }}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Link URL"
            variant="outlined"
            size="small"
            name="url"
            onChange={handleInputChange}
            value={formData.url}
          />
        </Box>
        <Box component="section" sx={{ p: 2 }}>
          <Stack spacing={2} direction="row">
            <Button
              variant="contained"
              endIcon={<PublishedWithChangesIcon />}
              type="submit"
            >
              Upadte
            </Button>
            <Button
              variant="contained"
              color="error"
              endIcon={<CancelIcon />}
              onClick={() => router.push(`/SlideShowAll`)}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </form>
    </DashboardCard>
  );
};

export default SlideEdit;
