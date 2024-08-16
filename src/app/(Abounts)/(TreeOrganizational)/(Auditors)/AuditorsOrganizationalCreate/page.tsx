"use client";
import { Autocomplete, Box, Button, Stack, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import DashboardCard from "@/app/components/shared/DashboardCard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import { useRouter } from "next/navigation";

const OrganizationalCreate = () => {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [isSelectedimg, setIsSelectedimg] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedImage = event.target.files[0];
      const img = new Image();
      img.src = URL.createObjectURL(selectedImage);

      img.onload = () => {
        if (img.width > 300 || img.height > 300) {
          Swal.fire({
            icon: "error",
            title: "ขนาดภาพใหญ่เกิ๊น",
            html: `กรุณาเลือกรูปภาพที่มีขนาด <font style="color:red"><b>300px X 300px</b></font> <br />หรือ รูปที่เล็กกว่า`,
          });
          setImage(null);
          setIsSelectedimg(false);
          setPreview(null);
        } else {
          setImage(selectedImage);
          setIsSelectedimg(true);
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result as string);
          };
          reader.readAsDataURL(selectedImage);
        }
      };
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleUpload();
  };

  const handleUpload = async () => {
    if (image) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const base64String = reader.result?.toString().split(",")[1];

        if (base64String) {
          const imageType = image.type;
          const response = await fetch(`${API}TreeOrganizational/Create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name,
              position: position,
              priority: "1",
              type: "ผู้ตรวจสอบบัญชีและผู้ตรวจสอบกิจการ",
              image: `data:${imageType};base64,${base64String}`,
            }),
          });

          if (response.ok) {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "CREATE SUCCESSFULLY",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              router.push(`/AuditorsOrganizational`);
            });
            setImage(null);
            setName("");
            setPosition("");
            setIsSelectedimg(false);
            setPreview(null);
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

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      setPreview(null);
    }
  }, [image]);

  return (
    <DashboardCard title="Create Notification">
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
              <span style={{ color: "red" }}>ขนาดภาพสวยๆ 300px X 300px</span>
            </label>
            <br />
            <br />
            {isSelectedimg ? (
              <div>
                <center>
                  <img height="206px" src={preview ?? ""} alt="Preview" />
                  <br />

                  <h6>Filename: {image?.name}</h6>

                  <br />
                  <Button
                    variant="contained"
                    color="warning"
                    endIcon={<FlipCameraAndroidIcon />}
                    onClick={handleClick}
                  >
                    Chang Image
                  </Button>
                </center>
              </div>
            ) : (
              <div>
                <center>
                  <input
                    type="image"
                    height="96px"
                    src={"/images/backgrounds/upload-image.png"}
                    onClick={handleClick}
                    alt="Upload"
                  />
                  <br />
                  <br />
                  <h6>Upload Image File</h6>
                </center>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleImage}
              ref={hiddenFileInput}
              style={{
                position: "absolute",
                top: "-1000px",
                left: "-1000px",
              }}
              required
            />
          </div>
        </Box>
        <Box component="section" sx={{ p: 2 }}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="ชื่อ - สกุล"
            variant="outlined"
            size="small"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </Box>
        <Box component="section" sx={{ p: 2 }}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="ตำแหน่ง"
            variant="outlined"
            size="small"
            onChange={(e) => setPosition(e.target.value)}
            value={position}
          />
        </Box>
        <Box component="section" sx={{ p: 2 }}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="ประเภท Read Only"
            size="small"
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            value={"ผู้ตรวจสอบบัญชีและผู้ตรวจสอบกิจการ"}
          />
        </Box>
        <Box component="section" sx={{ p: 2 }}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="ลำดับความสำคัญ Read Only"
            size="small"
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            value={"1"}
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
              onClick={() => router.push(`/NotifyAll`)}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </form>
    </DashboardCard>
  );
};

export default OrganizationalCreate;
