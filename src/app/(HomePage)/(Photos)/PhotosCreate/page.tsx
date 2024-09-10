"use client";
import { Box, Button, Stack, TextField } from "@mui/material";
import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";
import { AutoComplete } from "antd";
import imageCompression from "browser-image-compression";

const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `photo${day}${month}${year}`;
};

const PhotosCreate = () => {
  const router = useRouter();
  const [photos, setPhotos] = useState<File[]>([]);
  const [title, setTitle] = useState<string>("");
  const [coverIndex, setCoverIndex] = useState<string>("");
  const [datenow, setDateNow] = useState<string>("");
  const accept = {
    "image/*": [".jpeg", ".jpg", ".png", ".gif"],
  };
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const onDrop = async (acceptedFiles: File[]) => {
    const compressedFiles = await Promise.all(
      acceptedFiles.map(async (file) => {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        };
        try {
          const compressedFile = await imageCompression(file, options);
          return compressedFile;
        } catch (error) {
          console.error("Error compressing file:", error);
          return file; // fallback to the original file if compression fails
        }
      })
    );
    setPhotos(compressedFiles);
  };

  const options = photos.map((_, index) => ({
    value: (index + 1).toString(), // Start at 1 instead of 0
    label: `Photo ${index + 1}`,
  }));
  const handleCoverIndexChange = (value: string) => {
    // Ensure the value is a number and within the range of photos array length
    const index = parseInt(value) - 1;
    if (index >= 0 && index < photos.length) {
      setCoverIndex(index.toString());
    } else {
      setCoverIndex("");
    }
  };
  useEffect(() => {
    const today = new Date();
    const formattedDate = formatDate(today);
    setDateNow(formattedDate);
  }, []);

  // Define the validateForm function
  const validateForm = (): boolean => {
    if (!title) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Validation Error",
        text: "Title is required.",
        showConfirmButton: true,
      });
      return false;
    }



    if (!coverIndex) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Validation Error",
        text: "Please select a cover image.",
        showConfirmButton: true,
      });
      return false;
    }

    if (!datenow) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Validation Error",
        text: "Date is required.",
        showConfirmButton: true,
      });
      return false;
    }

    return true;
  };

  const uploadPhotos = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      // If validation fails, stop the submission
      return;
    }
    try {
      const formData = new FormData();
      photos.forEach((photo, index) => {
        formData.append("photos", photo);
      });
      formData.append("title", title);
      formData.append("coverIndex", coverIndex);
      formData.append("category", datenow);

      const response = await fetch(`${API}/Photos/Create`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "CREATE SUCCESSFULLY",
          showConfirmButton: false,
          timer: 3000,
        });
        router.push("/PhotoAll");
      } else {
        console.error("Error uploading photos:", result);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Upload Failed",
          text: result.message || "An error occurred during upload.",
          showConfirmButton: true,
        });
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Upload Failed",
        text: "An unexpected error occurred.",
        showConfirmButton: true,
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
  });

  return (
    <DashboardCard title="Create Photos">
      <form className="forms-sample" onSubmit={uploadPhotos}>
        <Box component="section" sx={{ p: 2 }}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="ชื่อปกรูปภาพกิจกรรม"
            variant="outlined"
            size="small"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
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
              รูปภาพ
              <p style={{ color: "red" }}>ขนาดภาพสวยๆ 1671px X 686px</p>
            </label>
            <div {...getRootProps()}>
              <center>
                <input
                  type="image"
                  height="96px"
                  src="/images/backgrounds/upload-image.png"
                  alt="Upload"
                />
                <input {...getInputProps()} />
                <br />
                <br />
                <h6>Upload Images</h6>
              </center>
            </div>
          </div>
          <br />
          {photos.length > 0 && (
            <div
              className="form-group"
              style={{
                borderStyle: "dashed",
                borderWidth: 2,
                borderRadius: 1,
                borderColor: "grey",
              }}
            >
              <center>
                <h4>Photos Preview:</h4>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {photos.map((photo, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(photo)}
                      alt={`Uploaded ${index}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  ))}
                </div>
              </center>
            </div>
          )}
        </Box>
        <Box component="section" sx={{ p: 2 }}>
          <label>เลือกภาพหน้าปก:</label>
          <AutoComplete
            style={{ width: "100%" }}
            options={options}
            value={coverIndex ? (parseInt(coverIndex) + 1).toString() : ""} // Only parse coverIndex if it is not empty
            onChange={(value) => handleCoverIndexChange(value)}
            placeholder="Select cover photo"
            filterOption={(inputValue, option) =>
              option!.label.toLowerCase().indexOf(inputValue.toLowerCase()) !==
              -1
            }
            disabled={photos.length === 0} // Disable until photos are uploaded
          />
        </Box>
        <Box component="section" sx={{ p: 2 }}>
          <Stack spacing={2} direction="row">
            <Button
              variant="contained"
              endIcon={<CloudUploadIcon />}
              type="submit"
            >
              Submit
            </Button>
            <Button
              variant="contained"
              color="error"
              endIcon={<CancelIcon />}
              onClick={() => router.push(`/SlideAll`)}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </form>
    </DashboardCard>
  );
};

export default PhotosCreate;
