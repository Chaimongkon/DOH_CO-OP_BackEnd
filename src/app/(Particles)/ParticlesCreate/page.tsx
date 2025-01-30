"use client";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
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
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch, { SwitchProps } from "@mui/material/Switch";

const ParticlesCreate = () => {
  const router = useRouter();
  const [photos, setPhotos] = useState<File[]>([]);
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<number>(0); // Set default status to false
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
  const validateForm = (): boolean => {
    if (!category) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Validation Error",
        text: "Title is required.",
        showConfirmButton: true,
      });
      return false;
    }
    if (!photos) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Validation Error",
        text: "Title is required.",
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
      photos.forEach((photo) => {
        formData.append("photos", photo);
      });
      formData.append("category", category);
      formData.append("status", status.toString()); // Convert boolean to string

      const response = await fetch(`${API}/Particles/Create`, {
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
        router.push("/ParticlesAll");
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

  const IOSSwitch = styled((props: SwitchProps) => <Switch {...props} />)(
    ({ theme }) => ({
      width: 42,
      height: 26,
      padding: 0,
      '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
          transform: 'translateX(16px)',
          color: '#fff',
          '& + .MuiSwitch-track': {
            backgroundColor: '#65C466',
            opacity: 1,
            border: 0,
            ...theme.applyStyles('dark', {
              backgroundColor: '#2ECA45',
            }),
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.5,
          },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
          color: '#33cf4d',
          border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
          color: theme.palette.grey[100],
          ...theme.applyStyles('dark', {
            color: theme.palette.grey[600],
          }),
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.7,
          ...theme.applyStyles('dark', {
            opacity: 0.3,
          }),
        },
      },
      '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
      },
      '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: '#E9E9EA',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
          duration: 500,
        }),
        ...theme.applyStyles('dark', {
          backgroundColor: '#39393D',
        }),
      },
    })
  );

const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setStatus(event.target.checked ? 1 : 0); // Set to 1 for true, 0 for false
}

  return (
    <DashboardCard title="Create Photos">
      <form className="forms-sample" onSubmit={uploadPhotos}>
        <Box component="section" sx={{ p: 2 }}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="ชื่อกิจกรรม"
            variant="outlined"
            size="small"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
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
              <p style={{ color: "red" }}>ขนาดภาพสวยๆ 120px X 120px</p>
            </label>
            <div {...getRootProps()}>
  <center>
    {/* Replace this line */}
    {/* <input type="image" height="96px" src="/images/backgrounds/upload-image.png" alt="Upload" /> */}

    {/* With this line */}
    <img height="96px" src="/images/backgrounds/upload-image.png" alt="Upload" />
    
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
          <FormControl component="fieldset">
            <FormLabel component="legend">สถานะการทำงาน</FormLabel>
            <FormGroup aria-label="position" row>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Typography>ปิดใช้งาน</Typography>
                <IOSSwitch
                  checked={Boolean(status)}
                  onChange={handleStatusChange}
                  sx={{ m: 1 }}
                  inputProps={{ "aria-label": "ant design" }}
                />
                <Typography>เปิดใช้งาน</Typography>
              </Stack>
            </FormGroup>
          </FormControl>
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

export default ParticlesCreate;
