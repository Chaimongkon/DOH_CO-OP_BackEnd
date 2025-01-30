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

const StatuteRegularityDeclareCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeForm = searchParams.get("typeForm");
  const [title, setTitle] = useState("");
  const [pdf, setPDF] = useState<File | null>(null);
  const [titleMember, setTitleMember] = useState<MemberOption | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const Member: MemberOption[] = [
    { data: "สมาชิกสามัญประเภท ก" },
    { data: "สมาชิกสามัญประเภท ข" },
    { data: "สมาชิกสมทบ" },
    { data: "สมาชิกประเภท ก ข สมทบ" },
    { data: "สหกรณ์ฯ" },
  ];

  const hiddenPDFFileInput = useRef<HTMLInputElement | null>(null);

  const handlePDFClick = () => {
    hiddenPDFFileInput.current?.click();
  };

  const handlePDF = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedPDF = event.target.files[0];
      setPDF(selectedPDF);

      // Create a preview URL for the selected PDF
      const pdfUrl = URL.createObjectURL(selectedPDF);
      setPdfPreviewUrl(pdfUrl);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Manually check if a PDF file is selected
    await handleUpload();
  };

  const handleUpload = async () => {
    if (pdf) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("typeForm", typeForm || "");
      formData.append("typeMember", titleMember?.data || "");
      formData.append("pdf", pdf);

      try {
        const response = await fetch(`${API}/SRD/Create`, {
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
            text: "Failed to upload file.",
          });
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to upload file. Check console for details.",
        });
      }
    }
  };

  return (
    <DashboardCard title={`Create ${typeForm}`}>
      <form className="forms-sample" onSubmit={handleSubmit}>
        <Box component="section" sx={{ p: 2 }}>
          <TextField
            fullWidth
            label="ชื่อฟอร์ม"
            variant="outlined"
            size="small"
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>
        <Box component="section" sx={{ p: 2 }}>
          <TextField
            fullWidth
            label="ประเภทฟอร์ม Read Only"
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
            options={Member}
            size="small"
            getOptionLabel={(option) => option.data}
            isOptionEqualToValue={(option, value) => option.data === value.data}
            onChange={(event: any, newValue: MemberOption | null) =>
              setTitleMember(newValue)
            }
            value={titleMember}
            renderInput={(params) => (
              <TextField {...params} label="ประเภทสมาชิก" />
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
              ไฟล์แนบ <span style={{ color: "red" }}>ไฟล์ PDF เท่านั้น!</span>
            </label>
            <br />
            <br />
            {pdfPreviewUrl ? (
              <div>
                <center>
                  {/* PDF Preview using iframe */}
                  <iframe
                    src={pdfPreviewUrl}
                    width="100%"
                    height="500px"
                    title="PDF Preview"
                  />
                  <br />
                  <h6>Filename: {pdf?.name}</h6>
                  <Button
                    variant="contained"
                    color="warning"
                    endIcon={<FlipCameraAndroidIcon />}
                    onClick={handlePDFClick}
                  >
                    Change PDF File
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
                  <h6>Upload PDF File</h6>
                </center>
              </div>
            )}
            <input
              type="file"
              accept="application/pdf"
              name="pdf"
              onChange={handlePDF}
              ref={hiddenPDFFileInput}
              style={{ display: "none" }}
            />
          </div>
        </Box>
        <Box component="section" sx={{ p: 2 }}>
          <Stack spacing={2} direction="row">
            <Button
              variant="contained"
              endIcon={<CloudUploadIcon />}
              type="submit"
              disabled={!title || !typeForm || !titleMember || !pdf}
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

export default StatuteRegularityDeclareCreate;
