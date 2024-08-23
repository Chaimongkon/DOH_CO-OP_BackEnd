"use client";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Accept, useDropzone } from "react-dropzone"; // Import the correct useDropzone hook
import Swal from "sweetalert2"; // Assuming you're using SweetAlert2 for alerts
import { AutoComplete } from "antd";

const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-indexed in JavaScript
  const year = date.getFullYear();
  return `photo${day}${month}${year}`;
};

const PhotosCreate = () => {
  const router = useRouter();
  const [photos, setPhotos] = useState<File[]>([]);
  const [title, setTitle] = useState<string>("");
  const [coverIndex, setCoverIndex] = useState<string>("");
  const [datenow, setDateNow] = useState<string>("");
  const accept: Accept = {
    "image/*": [".jpeg", ".jpg", ".png", ".gif"],
  };
  const API =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_APIHOSTB_URL
      : process.env.REACT_APP_APIHOSTB_URL;

  const onDrop = (acceptedFiles: File[]) => {
    setPhotos(acceptedFiles);
  };
  const options = photos.map((_, index) => ({
    value: index.toString(),
    label: `Photo ${index + 1}`,
  }));
  useEffect(() => {
    const today = new Date();
    const formattedDate = formatDate(today);
    setDateNow(formattedDate);
  }, []);

  const uploadPhotos = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      photos.forEach((photo, index) => {
        formData.append("photos", photo);
      });
      formData.append("title", title);
      formData.append("coverIndex", coverIndex);
      formData.append("category", datenow);

      const result = await axios.post(`${API}/api/photoalbumupload`, formData);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "CREATE SUCCESSFULLY",
        showConfirmButton: false,
        timer: 3000,
      });

      if (result.data.message === "Upload successful") {
        router.push("/PhotoAlbum");
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
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
            value={coverIndex}
            onChange={(value) => setCoverIndex(value)}
            placeholder="Select cover photo"
            filterOption={(inputValue, option) =>
              option!.label.toLowerCase().indexOf(inputValue.toLowerCase()) !==
              -1
              
            }
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
