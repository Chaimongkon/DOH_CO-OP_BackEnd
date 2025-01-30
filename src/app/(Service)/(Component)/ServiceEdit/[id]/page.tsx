"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Autocomplete, Box, Button, Stack, TextField } from "@mui/material";
import DashboardCard from "@/app/components/shared/DashboardCard";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import CancelIcon from "@mui/icons-material/Cancel";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import { useSearchParams } from "next/navigation";

interface FormData {
  title: string;
  mainType: string;
  subcategories: string;
  urlLink: string;
  image: File | null;
  imageUrl: string;
}

interface TypeOption {
  data: string;
}

interface MemberOption {
  data: string;
}

const ServiceEdit: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [typeForm, setTypeForm] = useState<string>("");
  const [titleMain, setTitleMain] = useState<MemberOption | null>(null);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL as string;
  const URLFile = process.env.NEXT_PUBLIC_PICHER_BASE_URL;
  const [formData, setFormData] = useState<FormData>({
    title: "",
    mainType: "",
    subcategories: "",
    urlLink: "",
    image: null,
    imageUrl: "",
  });

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

  const Bank: MemberOption[] = [{ data: "บัญชีธนาคารสหกรณ์" }];

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch(`${API}/Services/GetById/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const processedData = data.map((service: any) => ({
        title: service.Title,
        mainType: service.MainType,
        subcategories: service.Subcategories,
        urlLink: service.URLLink,
        image: data[0].ImagePath
          ? `${URLFile}${data[0].ImagePath}` // Use the file path instead of base64
          : "",
      }));

      if (processedData.length > 0) {
        const service = data[0];
        setFormData({
          title: service.Title,
          mainType: service.MainType,
          subcategories: service.Subcategories,
          urlLink: service.URLLink,
          image: null, // Set null here if the file doesn't change
          imageUrl: service.ImagePath ? `${URLFile}${service.ImagePath}` : "",
        });
        setTypeForm(service.MainType);
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  }, [API, id]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

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
        if (img.width > 1700 || img.height > 3000) {
          Swal.fire({
            icon: "error",
            title: "ขนาดภาพใหญ่เกิ๊น",
            html: `กรุณาเลือกรูปภาพที่มีขนาด <font style="color:red"><b>1700px X 3000px</b></font> <br />หรือ รูปที่เล็กกว่า`,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { title, mainType, subcategories, urlLink, image } = formData;

    const formDataToSend = new FormData();
    formDataToSend.append("title", title);
    formDataToSend.append("mainType", mainType);
    formDataToSend.append("subcategories", subcategories);
    formDataToSend.append("urlLink", urlLink);

    // Append files only if they exist
    if (image) {
      formDataToSend.append("image", image);
    }

    try {
      const response = await fetch(`${API}/Services/Edit/${id}`, {
        method: "PUT",
        body: formDataToSend, // Send FormData directly
      });

      if (response.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "UPDATE SUCCESSFULLY",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          router.back();
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
    } else if (typeForm === "บัญชีธนาคารสหกรณ์") {
      return Bank;
    }

    return [];
  };

  return (
    <DashboardCard title="Edit Service">
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
              <span style={{ color: "red" }}>ขนาดภาพสวยๆ 1700px X 3000px</span>
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
                  accept="image/png, image/jpeg, image/webp, image/gif"
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
                {formData.urlLink && (
                  <iframe
                    src={formData.urlLink}
                    width="100%"
                    height="600px"
                    title="PDF Preview"
                  />
                )}
              </center>
            </div>
          </div>
        </Box>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            label="URL LINK"
            variant="outlined"
            size="small"
            name="urlLink"
            onChange={handleInputChange}
            value={formData.urlLink}
          />
        </Box>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            label="ชื่อฟอร์ม"
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
            label="ประเภทหลัก Read Only"
            size="small"
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            value={formData.mainType}
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
            onChange={(event: any, newValue: MemberOption | null) => {
              setTitleMain(newValue);
              setFormData((prevFormData) => ({
                ...prevFormData,
                subcategories: newValue ? newValue.data : "", // Update subcategories as a string
              }));
            }}
            value={
              formData.subcategories
                ? getOptions().find(
                    (option) => option.data === formData.subcategories
                  ) || null
                : null
            }
            renderInput={(params) => (
              <TextField {...params} label="ประเภทย่อย" />
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

export default ServiceEdit;
