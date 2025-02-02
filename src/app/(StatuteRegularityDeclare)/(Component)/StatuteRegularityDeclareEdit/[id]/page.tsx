"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Autocomplete, Box, Button, Stack, TextField } from "@mui/material";
import DashboardCard from "@/app/components/shared/DashboardCard";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import CancelIcon from "@mui/icons-material/Cancel";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import { title } from "process";
//Year, TitleMonth, PdfFile
interface FormData {
  title: string;
  typeForm: string;
  typeMember: string;
  pdf: File | null;
  pdfUrl: string;
}
interface MemberOption {
  data: string;
}
const StatuteRegularityDeclareEdit = () => {
  const router = useRouter();
  const { id } = useParams();
  const [titleMember, setTitleMember] = useState<MemberOption | null>(null);
  const [typeForm, sertTypeForm] = useState("");
  const [formData, setFormData] = useState<FormData>({
    title: "",
    typeForm: "",
    typeMember: "",
    pdf: null,
    pdfUrl: "",
  });
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const URLFile = process.env.NEXT_PUBLIC_PICHER_BASE_URL;

  const Member: MemberOption[] = [
    { data: "สมาชิกสามัญประเภท ก" },
    { data: "สมาชิกสามัญประเภท ข" },
    { data: "สมาชิกสมทบ" },
    { data: "สมาชิกประเภท ก ข สมทบ" },
    { data: "สหกรณ์ฯ" },
  ];
  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch(`${API}/SRD/GetById/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const processedData = {
        title: data[0].Title || "",
        typeForm: data[0].TypeForm || "",
        typeMember: data[0].TypeMember || "",
        pdfUrl: data[0].FilePath ? `${URLFile}${data[0].FilePath}` : "", // Use the file path instead of base64
      };

      setFormData({
        ...formData,
        ...processedData,
      });
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  }, [API, id, URLFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    const { title, typeForm, typeMember, pdf } = formData;

    const formDataToSend = new FormData();
    formDataToSend.append("title", title);
    formDataToSend.append("typeForm", typeForm);
    formDataToSend.append("typeMember", typeMember);

    // Append files only if they exist
    if (pdf) {
      formDataToSend.append("pdf", pdf);
    }

    try {
      const response = await fetch(`${API}/SRD/Edit/${id}`, {
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
    <DashboardCard title={`Edit ${formData.typeForm}`}>
      <form className="forms-sample" onSubmit={handleSubmit}>
        <Box component="section" sx={{ p: 2 }}>
          <TextField
            fullWidth
            id="outlined-basic"
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
            label="ประเภทฟอร์ม Read Only"
            size="small"
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            value={formData.typeForm}
          />
        </Box>
        <Box sx={{ p: 2 }}>
          <Autocomplete
            fullWidth
            options={Member}
            size="small"
            getOptionLabel={(option) => option.data}
            isOptionEqualToValue={(option, value) => option.data === value.data}
            onChange={(event, newValue) => {
              setTitleMember(newValue);
              setFormData((prevData) => ({
                ...prevData,
                typeMember: newValue ? newValue.data : "",
              }));
            }}
            value={
              Member.find((option) => option.data === formData.typeMember) ||
              null
            }
            renderInput={(params) => (
              <TextField {...params} label="ประเภทสมาชิก" />
            )}
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

export default StatuteRegularityDeclareEdit;
