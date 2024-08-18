"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import DashboardCard from "@/app/components/shared/DashboardCard";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import CancelIcon from "@mui/icons-material/Cancel";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";

interface FormData {
  title: string;
  details: string;
  image: File | null;
  imageUrl: string;
  pdf: File | null;
  pdfUrl: string;
}

const NewEdit = () => {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    details: "",
    image: null,
    imageUrl: "",
    pdf: null,
    pdfUrl: "",
  });
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch(`${API}/News/GetById/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const processedData = {
        title: data[0].Title || "",
        details: data[0].Details || "",
        imageUrl: data[0].Image ? `data:;base64,${data[0].Image}` : "",
        pdfUrl: data[0].File
          ? `data:application/pdf;base64,${data[0].File}`
          : "",
      };

      setFormData({
        ...formData,
        ...processedData,
      });
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  }, [API, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        if (img.width > 512 || img.height > 512) {
          Swal.fire({
            icon: "error",
            title: "ขนาดภาพใหญ่เกิ๊น",
            html: `กรุณาเลือกรูปภาพที่มีขนาด <font style="color:red"><b>512px X 512px</b></font> <br />หรือ รูปที่เล็กกว่า`,
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

  const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const PDFFile = e.target.files?.[0];
    if (PDFFile) {
      const PDFUrl = URL.createObjectURL(PDFFile);
      setFormData({
        ...formData,
        pdf: PDFFile,
        pdfUrl: PDFUrl,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { image, pdf, title, details } = formData;
    let base64Stringimg = null;
    let base64Stringpdf = null;

    const handleFileRead = (file: File, fileType: string) => {
      return new Promise<string | null>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const base64String = reader.result?.toString().split(",")[1];
          resolve(
            base64String ? `data:${fileType};base64,${base64String}` : null
          );
        };
        reader.onerror = reject;
      });
    };

    try {
      if (image) {
        base64Stringimg = await handleFileRead(image, "image/png"); // assuming image type is PNG, change if necessary
      }
      if (pdf) {
        base64Stringpdf = await handleFileRead(pdf, "application/pdf");
      }

      const payload: {
        title: string;
        details: string;
        image?: string;
        pdf?: string;
      } = {
        title: title,
        details: details,
      };

      if (base64Stringimg) {
        payload.image = base64Stringimg;
      }
      if (base64Stringpdf) {
        payload.pdf = base64Stringpdf;
      }

      const response = await fetch(`${API}/News/Edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "UPDATE SUCCESSFULLY",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          router.push(`/NewAll`);
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

  const triggerPDFFileInputClick = () => {
    const fileInput = document.getElementById(
      "PDFUpload"
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
          <TextField
            fullWidth
            id="outlined-basic"
            label="หัวข้อข่าวประชาสัมพันธ์"
            variant="outlined"
            size="small"
            name="title"
            onChange={handleInputChange}
            value={formData.title}
          />
        </Box>
        <Box component="section" sx={{ p: 2 }}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="รายละเอียดข่าวประชาสัมพันธ์"
            variant="outlined"
            size="small"
            name="details"
            onChange={handleInputChange}
            value={formData.details}
          />
        </Box>
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
              <span style={{ color: "red" }}>ขนาดภาพสวยๆ 206px X 198px</span>
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
                  Change Image
                </Button>
                <br />
              </center>
            </div>
          </div>
        </Box>
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
              PDF File <span style={{ color: "red" }}>Preview</span>
            </label>
            <br />
            <br />
            <div className="form-group">
              <center>
                {formData.pdfUrl && (
                  <iframe
                    src={formData.pdfUrl}
                    width="100%"
                    height="600px"
                    title="PDF Preview"
                  />
                )}
                <br />
                <br />
                <input
                  type="file"
                  id="PDFUpload"
                  name="pdf"
                  accept="application/pdf"
                  style={{ display: "none" }}
                  onChange={handlePDFChange}
                />
                <Button
                  variant="contained"
                  color="warning"
                  endIcon={<FlipCameraAndroidIcon />}
                  onClick={triggerPDFFileInputClick}
                >
                  Change PDF
                </Button>
              </center>
            </div>
          </div>
        </Box>

        <Box component="section" sx={{ p: 2 }}>
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
              onClick={() => router.push(`/NewAll`)}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </form>
    </DashboardCard>
  );
};

export default NewEdit;
