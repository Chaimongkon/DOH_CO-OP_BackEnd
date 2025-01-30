"use client";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import DashboardCard from "@/app/components/shared/DashboardCard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import path from "path";

const ElectionDepartmentCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pdfs, setPDFs] = useState<File[]>([]);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const hiddenPDFFileInput = useRef<HTMLInputElement | null>(null);

  const handlePDFClick = () => {
    hiddenPDFFileInput.current?.click();
  };

  const handlePDF = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedPDFs = Array.from(event.target.files);
      setPDFs(selectedPDFs);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Upload all files
    await handleUpload();
  };

  const handleUpload = async () => {
    if (pdfs.length > 0) {
      const formData = new FormData();
      pdfs.forEach((file, index) => {
        // ส่งชื่อไฟล์โดยไม่มี .pdf
        const fileNameWithoutExt = path.parse(file.name).name;
        formData.append(`fileName_${index}`, fileNameWithoutExt); // ชื่อไฟล์ไม่มีนามสกุล
        formData.append(`pdf_${index}`, file); // ไฟล์ PDF
      });

      try {
        const response = await fetch(`${API}/ElectionDepartment/Create`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "CREATE SUCCESSFULLY",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            router.back();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to upload files.",
          });
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to upload files. Check console for details.",
        });
      }
    }
  };

  return (
    <DashboardCard >
      <form className="forms-sample" onSubmit={handleSubmit}>
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
              ไฟล์แนบ <span style={{ color: "red" }}>ไฟล์ PDF เท่านั้น!</span>
            </label>
            <br />
            <br />
            {pdfs.length > 0 ? (
              <div>
                <center>
                  <ul>
                    {pdfs.map((file, index) => (
                      <li key={index}>
                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="contained"
                    color="warning"
                    endIcon={<FlipCameraAndroidIcon />}
                    onClick={handlePDFClick}
                  >
                    Change Files
                  </Button>
                </center>
              </div>
            ) : (
              <div>
                <center>
                  <input
                    type="image"
                    height="96px"
                    src={"/images/backgrounds/upload-pdf.png"}
                    onClick={handlePDFClick}
                    alt="Upload"
                  />
                  <br />
                  <br />
                  <h6>Upload PDF Files</h6>
                </center>
              </div>
            )}
            <input
              type="file"
              accept="application/pdf"
              name="pdfs"
              onChange={handlePDF}
              ref={hiddenPDFFileInput}
              style={{ display: "none" }}
              multiple // Allow multiple file selection
            />
          </div>
        </Box>
        <Box component="section" sx={{ p: 2 }}>
          <Stack spacing={2} direction="row">
            <Button
              variant="contained"
              endIcon={<CloudUploadIcon />}
              type="submit"
              disabled={pdfs.length === 0}
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

export default ElectionDepartmentCreate;
