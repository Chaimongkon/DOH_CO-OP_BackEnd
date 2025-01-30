"use client";
import { Autocomplete, Box, Button, Stack, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import DashboardCard from "@/app/components/shared/DashboardCard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import { useRouter } from "next/navigation";

interface TypeOption {
  data: string;
}

const CooperativeSocietyCreate = () => {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [titleType, setTitleType] = useState<TypeOption | null>(null);
  const [isSelectedimg, setIsSelectedimg] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const hiddenFileInput = useRef<HTMLInputElement | null>(null);
  const Type: TypeOption[] = [
    { data: "ค่านิยม วิสัยทัศน์ พันธกิจ" },
    { data: "จรรยาบรรณสำหรับคณะกรมมการดำเนินการ" },
    { data: "จรรยาบรรณสำหรับเจ้าหน้าที่" },
    { data: "นโยบายสหกรณ์" },
    { data: "สารจากประธานกรรมการดำเนินการ" },
  ];
  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedImage = event.target.files[0];
      const img = new Image();
      img.src = URL.createObjectURL(selectedImage);

      img.onload = () => {
        if (img.width > 1500 || img.height > 1500) {
          Swal.fire({
            icon: "error",
            title: "ขนาดภาพใหญ่เกิ๊น",
            html: `กรุณาเลือกรูปภาพที่มีขนาด <font style="color:red"><b>1500px X 1500px</b></font> <br />หรือ รูปที่เล็กกว่า`,
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
    if (image && titleType) {
      const formData = new FormData();
      formData.append("image", image); // Append the image file
      formData.append("societyType", titleType.data); // Append the society type

      try {
        const response = await fetch(`${API}/CooperativeSociety/Create`, {
          method: "POST",
          body: formData, // Send form data including the image
        });

        if (response.ok) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "CREATE SUCCESSFULLY",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            router.push(`/CooperativeSocietyAll`);
          });
          setImage(null);
          setTitleType(null);
          setIsSelectedimg(false);
          setPreview(null);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to upload image.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while uploading the image.",
        });
      }
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
    <DashboardCard title="Create CooperativeSociety">
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
              <span style={{ color: "red" }}>ขนาดภาพสวยๆ 1500px X 1500px</span>
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
          <Autocomplete
            fullWidth
            id="combo-box-demo"
            options={Type}
            size="small"
            getOptionLabel={(option) => option.data}
            isOptionEqualToValue={(option, value) => option.data === value.data}
            onChange={(event: any, newValue: TypeOption | null) =>
              setTitleType(newValue)
            }
            value={titleType}
            renderInput={(params) => (
              <TextField {...params} label="เลือก ประเภท" />
            )}
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
              onClick={() => router.push(`/CooperativeSocietyAll`)}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </form>
    </DashboardCard>
  );
};

export default CooperativeSocietyCreate;
