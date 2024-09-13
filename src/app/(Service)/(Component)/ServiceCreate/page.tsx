"use client";
import { Autocomplete, Box, Button, Stack, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import DashboardCard from "@/app/components/shared/DashboardCard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

interface MemberOption {
  data: string;
}

const ServiceCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeForm = searchParams.get("typeForm");
  const currentYear = new Date().getFullYear();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [titleMain, setTitleMain] = useState<MemberOption | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSelectedimg, setIsSelectedimg] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const Member: MemberOption[] = [
    { data: "สมาชิกสามัญประเภท ก" },
    { data: "สมาชิกสามัญประเภท ข" },
    { data: "สมาชิกสมทบ" },
  ];

  const Welfare: MemberOption[] = [
    { data: "สวัสดิการสมาชิกสามัญประเภท ก" },
    { data: "สวัสดิการสมาชิกสามัญประเภท ข" },
    { data: "สวัสดิการสมาชิกสมทบ" },
  ];

  const Insurance: MemberOption[] = [
    { data: "บริการทำประกัยรถยนต์" },
    { data: "บริการทำ พรบ. รถยนต์" },
  ];

  const Deposit: MemberOption[] = [
    { data: "ถอนเงินผ่านช่องทาง Online" },
    { data: "เงินฝากออมทรัพย์" },
    { data: "เงินฝากออมทรัพย์ยั่งยืน" },
    { data: "เงินฝากออมทรัพย์พิเศษ" },
    { data: "เงินฝากออมทรัพย์พิเศษเกษียณสุข" },
    { data: "เงินฝากประจำ 3 6 12 เดือน" },
    { data: "เงินฝากประจำ 24 เดือน" },
  ];

  const Loan: MemberOption[] = [
    { data: "เงินกู้เพื่อเหตุฉุกเฉิน" },
    { data: "เงินกู้สามัญ" },
    { data: "เงินกู้พิเศษ" },
  ];

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
        if (img.width > 1500 || img.height > 2800) {
          Swal.fire({
            icon: "error",
            title: "ขนาดภาพใหญ่เกิ๊น",
            html: `กรุณาเลือกรูปภาพที่มีขนาด <font style="color:red"><b>1500px X 2800px</b></font> <br />หรือ รูปที่เล็กกว่า`,
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
          const response = await fetch(`${API}/Services/Create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: title,
              maintype: typeForm,
              subcategories: titleMain?.data,
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
              router.back()
            });
            setImage(null);
            setTitleMain(null);
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
  
  // Function to dynamically set the options based on typeForm
  const getOptions = () => {
    if (typeForm === "สมัครสมาชิก") {
      return Member;
    } else if (typeForm === "สวัสดิการสมาชิก") {
      return Welfare;
    } else if (typeForm === "บริการทำประกัน") {
      return Insurance;
    } else if (typeForm === "บริการเงินฝาก") {
      return Deposit;
    } else if (typeForm === "บริการเงินกู้") {
      return Loan;
    }
    return [];
  };

  return (
    <DashboardCard title={`Create ${typeForm}`}>
      <form className="forms-sample" onSubmit={handleSubmit}>
        <Box component="section" sx={{ p: 2 }}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="ชื่อฟอร์ม"
            variant="outlined"
            size="small"
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>
        <Box component="section" sx={{ p: 2 }}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="ประเภทหลัก Read Only"
            size="small"
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            value={typeForm}
          />
        </Box>
        <Box component="section" sx={{ p: 2 }}>
          <Autocomplete
            fullWidth
            id="combo-box-demo"
            options={getOptions()}
            size="small"
            getOptionLabel={(option) => option.data}
            isOptionEqualToValue={(option, value) => option.data === value.data}
            onChange={(event: any, newValue: MemberOption | null) =>
              setTitleMain(newValue)
            }
            value={titleMain}
            renderInput={(params) => (
              <TextField {...params} label="ประเภทย่อย" />
            )}
          />
        </Box>
        {/* PDF File Select */}
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
              <span style={{ color: "red" }}>ขนาดภาพสวยๆ 1500px X 2800px</span>
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

export default ServiceCreate;
