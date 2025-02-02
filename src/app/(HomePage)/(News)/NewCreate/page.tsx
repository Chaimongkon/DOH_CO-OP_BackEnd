"use client";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import DashboardCard from "@/app/components/shared/DashboardCard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import { useRouter } from "next/navigation";

const NewCreate = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [pdf, setPDF] = useState<File | null>(null);
  const [details, setDetails] = useState("");
  const [preview, setPreview] = useState<string | null>(null); // Image preview
  const [pdfPreview, setPdfPreview] = useState<string | null>(null); // PDF preview
  const [isSelectedImg, setIsSelectedImg] = useState(false);
  const [isSelectedPDF, setIsSelectedPDF] = useState(false);
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);
  const hiddenPDFFileInput = useRef<HTMLInputElement | null>(null);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleClick = () => hiddenFileInput.current?.click();
  const handlePDFClick = () => hiddenPDFFileInput.current?.click();

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedImage = event.target.files[0];
      const img = new Image();
      img.src = URL.createObjectURL(selectedImage);

      img.onload = () => {
        if (img.width > 512 || img.height > 512) {
          Swal.fire({
            icon: "error",
            title: "ขนาดภาพใหญ่เกิ๊น",
            html: `กรุณาเลือกรูปภาพที่มีขนาด <font style="color:red"><b>512px X 512px</b></font> <br />หรือ รูปที่เล็กกว่า`,
          });
          setImage(null);
          setIsSelectedImg(false);
          setPreview(null);
        } else {
          setImage(selectedImage);
          setIsSelectedImg(true);
          setPreview(URL.createObjectURL(selectedImage)); // Set image preview URL
        }
      };
    }
  };

  const handlePDF = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedPDF = event.target.files[0];
      setPDF(selectedPDF);
      setPdfPreview(URL.createObjectURL(selectedPDF)); // Set PDF preview URL
      setIsSelectedPDF(true);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleUpload();
  };

  const handleUpload = async () => {
    if (image && pdf) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("details", details || ""); // Allow empty details
      formData.append("image", image);
      formData.append("pdf", pdf);

      // Log the FormData keys and values for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      try {
        const response = await fetch(`${API}/News/Create`, {
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
          }).then(() => router.push(`/NewAll`));

          setImage(null);
          setPDF(null);
          setTitle("");
          setDetails("");
          setIsSelectedImg(false);
          setIsSelectedPDF(false);
          setPreview(null);
          setPdfPreview(null); // Reset previews
        } else {
          try {
            const errorData = await response.json();
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `Failed to upload: ${errorData.error || "Unknown error"}`,
            });
          } catch (err) {
            const errorText = await response.text();
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `Failed to upload: ${errorText || "Unknown error"}`,
            });
          }
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "There was a problem with your request. Please try again.",
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Missing image or PDF",
        text: "Please select both an image and a PDF.",
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
            label="หัวข้อข่าวประชาสัมพันธ์"
            variant="outlined"
            size="small"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </Box>
        <Box component="section" sx={{ p: 2 }}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="รายละเอียดข่าวประชาสัมพันธ์"
            variant="outlined"
            size="small"
            onChange={(e) => setDetails(e.target.value)}
            value={details}
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
              รูปภาพ{" "}
              <span style={{ color: "red" }}>ขนาดภาพสวยๆ 512px X 512px</span>
            </label>
            <br />
            <br />
            {isSelectedImg ? (
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
                    Change Image
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
            {isSelectedPDF && pdfPreview ? (
              <div>
                <center>
                  <iframe
                    src={pdfPreview}
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

export default NewCreate;
