"use client";
import { Autocomplete, Box, Button, Stack, TextField } from "@mui/material";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import DashboardCard from "@/app/components/shared/DashboardCard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import { useRouter } from "next/navigation";

interface MonthOption {
  label: string;
}

const AssetsLiabilitiesCreate = () => {
  const router = useRouter();
  const [year, setYear] = useState("");
  const [pdf, setPDF] = useState<File | null>(null);
  const [titleMonth, setTitleMonth] = useState<MonthOption | null>(null);
  const [pdfpreview, setPdfpreview] = useState<any>(null);
  const [isSelectedPDF, setIsSelectedPDF] = useState(false);
  console.log(year);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const Month: MonthOption[] = [
    { label: "เดือน มกราคม" },
    { label: "เดือน กุมภาพันธ์" },
    { label: "เดือน มีนาคม" },
    { label: "April" },
    { label: "May" },
    { label: "June" },
    { label: "July" },
    { label: "August" },
    { label: "September" },
    { label: "October" },
    { label: "November" },
    { label: "December" },
  ];
  const hiddenPDFFileInput = useRef<HTMLInputElement | null>(null);

  const handlePDFClick = () => {
    hiddenPDFFileInput.current?.click();
  };

  const handlePDF = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedPDF = event.target.files[0];
      const readerpdf = new FileReader();
      readerpdf.readAsDataURL(selectedPDF);
      readerpdf.onloadend = async () => {
        const base64Stringpdf = readerpdf.result?.toString().split(",")[1];

        setPdfpreview(base64Stringpdf);
        setPDF(selectedPDF);
        setIsSelectedPDF(true);
      };
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleUpload();
  };

  const handleUpload = async () => {
    if (pdf) {
      const readerpdf = new FileReader();
      readerpdf.readAsDataURL(pdf);
      readerpdf.onloadend = async () => {
        const base64Stringpdf = readerpdf.result?.toString().split(",")[1];

        if (base64Stringpdf) {
          const response = await fetch(`${API}AssetsLiabilities/Create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              year: year,
              titleMonth: titleMonth,
              pdf: `data:application/pdf;base64,${base64Stringpdf}`,
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
              router.push(`/NewAll`);
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Failed to upload image.",
            });
          }
        }
      };
    } else {
      Swal.fire({
        icon: "warning",
        title: "Missing image or pdf",
        text: "Please select both an image and a pdf.",
      });
    }
  };

  return (
    <DashboardCard title="Create News">
      <form className="forms-sample" onSubmit={handleSubmit}>
        <Box component="section" sx={{ p: 2 }}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="ประจำปี"
            variant="outlined"
            size="small"
            onChange={(e) => setYear(e.target.value)}
            value={year}
          />
        </Box>
        <Box component="section" sx={{ p: 2 }}>
        <Autocomplete
      fullWidth
      id="combo-box-demo"
      options={Month}
      size="small"
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      onChange={(event: any, newValue: MonthOption | null) => setTitleMonth(newValue)}
      value={titleMonth}
      renderInput={(params) => (
        <TextField
          {...params}
          label="ประจำเดือน"
        />
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
            {isSelectedPDF ? (
              <div>
                <center>
                  <iframe
                    src={`data:application/pdf;base64,${pdfpreview}`}
                    width="100%"
                    height="600px"
                    title="PDF Preview"
                  />
                  <br />

                  <h6>Filename: {pdf?.name}</h6>

                  <br />
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
                  <h6>Upload Image File</h6>
                </center>
              </div>
            )}
            <input
              type="file"
              accept="application/pdf"
              name="image"
              onChange={handlePDF}
              ref={hiddenPDFFileInput}
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
              onClick={() => router.push(`/NewAll`)}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </form>
    </DashboardCard>
  );
};

export default AssetsLiabilitiesCreate;
