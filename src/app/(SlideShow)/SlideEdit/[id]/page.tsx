"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import DashboardCard from "@/app/components/shared/DashboardCard";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import CancelIcon from "@mui/icons-material/Cancel";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import { useParams, useRouter } from "next/navigation";

const SlideEdit = () => {
  const router = useRouter();
  const { id } = useParams();
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [slides, setSlides] = useState([]);
  const [formData, setFormData] = useState({ no: "", url: "",  imageUrl: "" });
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);
  console.log(formData)
  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch(`${API}/Slides/ShowById/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const processedData = data.map((slide: any) => ({
        id: slide.Id,
        no: slide.No,
        image: slide.Image,
        url: slide.URLLink,
      }));

      if (processedData.length > 0) {
        setFormData({
          no: processedData[0].no,
          url: processedData[0].url,
          imageUrl: processedData[0].image,
        });
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  }, [API, id]);


  const handleInputChange = (e:any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e:any) => {
    const imageFile = e.target.files[0];
    const imageUrl = URL.createObjectURL(imageFile);
    setFormData({
      ...formData,

      imageUrl: imageUrl,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}/Slides/Edit/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Update successful:", result);
    } catch (error) {
      console.error("Failed to update slide:", error);
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
                <label
                  htmlFor="imageUpload"
                  className="form-control btn btn-danger btn-icon-text"
                >
                  เปลี่ยนรูปตรงนี้
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  name="image"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
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
