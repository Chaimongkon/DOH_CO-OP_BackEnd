"use client";
import { Box, Button, Stack, TextField, LinearProgress, Typography } from "@mui/material";
import { useEffect, useRef, useState, useCallback } from "react";
import Swal from "sweetalert2";
import DashboardCard from "@/app/components/shared/DashboardCard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import { useRouter } from "next/navigation";

const IMAGE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
const PDF_SIZE_LIMIT = 100 * 1024 * 1024; // 20MB
const MAX_IMAGE_DIMENSIONS = { width: 322, height: 428 };

const BusinessReportCreate = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [pdf, setPDF] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileSize, setFileSize] = useState<number | null>(null);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const hiddenFileInput = useRef<HTMLInputElement | null>(null);
  const hiddenPDFFileInput = useRef<HTMLInputElement | null>(null);

  const handleClick = useCallback(() => {
    hiddenFileInput.current?.click();
  }, []);

  const handlePDFClick = useCallback(() => {
    hiddenPDFFileInput.current?.click();
  }, []);

  const validateFileSize = (file: File, limit: number) => {
    if (file.size > limit) {
      Swal.fire({
        icon: "error",
        title: "File is too large!",
        text: `Please select a file less than ${limit / (1024 * 1024)}MB.`,
      });
      return false;
    }
    return true;
  };

  const validateImageDimensions = (img: HTMLImageElement) => {
    if (img.width > MAX_IMAGE_DIMENSIONS.width || img.height > MAX_IMAGE_DIMENSIONS.height) {
      Swal.fire({
        icon: "error",
        title: "Image dimensions too large",
        html: `Please select an image with dimensions <b>${MAX_IMAGE_DIMENSIONS.width}px X ${MAX_IMAGE_DIMENSIONS.height}px</b> or smaller.`,
      });
      return false;
    }
    return true;
  };

  const handleImage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedImage = event.target.files[0];

      if (!validateFileSize(selectedImage, IMAGE_SIZE_LIMIT)) {
        setImage(null);
        setPreview(null);
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(selectedImage);

      img.onload = () => {
        if (!validateImageDimensions(img)) {
          setImage(null);
          setPreview(null);
        } else {
          setImage(selectedImage);
          setFileSize(selectedImage.size);
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result as string);
          };
          reader.readAsDataURL(selectedImage);
        }
      };
    }
  }, []);

  const handlePDF = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedPDF = event.target.files[0];

      if (!validateFileSize(selectedPDF, PDF_SIZE_LIMIT)) {
        setPDF(null);
        return;
      }

      const readerpdf = new FileReader();
      readerpdf.readAsDataURL(selectedPDF);
      readerpdf.onloadend = () => {
        const base64String = readerpdf.result?.toString().split(",")[1];
        if (base64String) {
          const blob = base64ToBlob(base64String, "application/pdf");
          const blobUrl = URL.createObjectURL(blob);
          setPdfPreviewUrl(blobUrl);
          setPDF(selectedPDF);
          setFileSize(selectedPDF.size);

          return () => URL.revokeObjectURL(blobUrl);
        }
      };
    }
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleUpload();
  }, [image, pdf, title]);

  const handleUpload = useCallback(() => {
    if (image && pdf) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", image);
      formData.append("pdf", pdf);
  
      const xhr = new XMLHttpRequest();
  
      xhr.upload.onprogress = (event: ProgressEvent) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(percentCompleted);
        }
      };
  
      xhr.onload = () => {
        if (xhr.status === 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "CREATE SUCCESSFULLY",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            router.push(`/BusinessReportAll`);
          });
          resetForm();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Failed to upload: ${xhr.responseText}`,
          });
          setUploadProgress(0);
        }
      };
  
      xhr.onerror = () => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "An error occurred during the upload. Please try again.",
        });
        setUploadProgress(0);
      };
  
      xhr.open("POST", `${API}/BusinessReport/Create`, true);
      xhr.send(formData);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Missing image or pdf",
        text: "Please select both an image and a pdf.",
      });
    }
  }, [image, pdf, title, API, router]);
  

  const resetForm = useCallback(() => {
    setImage(null);
    setPDF(null);
    setTitle("");
    setPreview(null);
    setPdfPreviewUrl("");
    setUploadProgress(0);
  }, []);

  const base64ToBlob = (base64: string, contentType: string = '') => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
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
    <DashboardCard title="Create BusinessReport">
      <form className="forms-sample" onSubmit={handleSubmit}>
        <Box component="section" sx={{ p: 2 }}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="หัวข้อหนังสือ"
            variant="outlined"
            size="small"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </Box>
        <FileUpload
          label="รูปภาพ"
          hint="ขนาดภาพสวยๆ 322px X 428px"
          isSelected={!!image}
          preview={preview}
          handleClick={handleClick}
          handleFileChange={handleImage}
          fileInputRef={hiddenFileInput}
          fileName={image?.name}
          fileSize={fileSize}
          changeLabel="Change Image"
          required
        />
        <FileUpload
          label="ไฟล์แนบ"
          hint="ไฟล์ PDF เท่านั้น!"
          isSelected={!!pdf}
          preview={pdfPreviewUrl}
          handleClick={handlePDFClick}
          handleFileChange={handlePDF}
          fileInputRef={hiddenPDFFileInput}
          fileName={pdf?.name}
          fileSize={fileSize}
          changeLabel="Change PDF File"
          required
          isPDF
        />
        {uploadProgress > 0 && (
          <Box component="section" sx={{ p: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Uploading: {uploadProgress}%
            </Typography>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}
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
              onClick={() => router.push(`/BusinessReportAll`)}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </form>
    </DashboardCard>
  );
};

export default BusinessReportCreate;

// Reusable FileUpload Component
const FileUpload = ({
  label,
  hint,
  isSelected,
  preview,
  handleClick,
  handleFileChange,
  fileInputRef,
  fileName,
  fileSize,
  changeLabel,
  required,
  isPDF = false,
}: {
  label: string;
  hint: string;
  isSelected: boolean;
  preview: string | null;
  handleClick: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  fileName?: string;
  fileSize?: number | null;
  changeLabel: string;
  required?: boolean;
  isPDF?: boolean;
}) => {
  return (
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
          {label} <span style={{ color: "red" }}>{hint}</span>
        </label>
        <br />
        <br />
        {isSelected && preview ? (
          <div>
            <center>
              {isPDF ? (
                <iframe
                  src={preview}
                  width="100%"
                  height="600px"
                  title="PDF Preview"
                />
              ) : (
                <img height="206px" src={preview} alt="Preview" />
              )}
              <br />
              <h6>
                Filename: {fileName} ({(fileSize! / 1024).toFixed(2)} KB)
              </h6>
              <br />
              <Button
                variant="contained"
                color="warning"
                endIcon={<FlipCameraAndroidIcon />}
                onClick={handleClick}
              >
                {changeLabel}
              </Button>
            </center>
          </div>
        ) : (
          <div>
            <center>
              <input
                type="image"
                height="96px"
                src={isPDF ? "/images/backgrounds/upload-pdf.png" : "/images/backgrounds/upload-image.png"}
                onClick={handleClick}
                alt="Upload"
              />
              <br />
              <br />
              <h6>{`Upload ${isPDF ? "PDF" : "Image"} File`}</h6>
            </center>
          </div>
        )}
        <input
          type="file"
          accept={isPDF ? "application/pdf" : "image/*"}
          name={isPDF ? "pdf" : "image"}
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{
            position: "absolute",
            top: "-1000px",
            left: "-1000px",
          }}
          required={required}
        />
      </div>
    </Box>
  );
};
