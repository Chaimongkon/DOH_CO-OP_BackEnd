"use client";
import { Typography } from "@mui/material";
import PageContainer from "@/app/components/container/PageContainer";
import DashboardCard from "@/app/components/shared/DashboardCard";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

const SamplePage = () => {
  const [no, setNo] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isSelectedimg, setIsSelectedimg] = useState(false);
  const [loading, setLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png'];
      if (!validImageTypes.includes(file.type)) {
        Swal.fire({
          icon: "error",
          title: "Invalid file type",
          text: "Please select a JPEG or PNG image.",
        });
        return;
      }

      setImage(file);
      setIsSelectedimg(true);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!base64Image) {
      Swal.fire({
        icon: "error",
        title: "No image selected",
        text: "Please select an image before submitting.",
      });
      return;
    }

    setLoading(true);

    const formdata = {
      no,
      image: base64Image,
      url
    };

    try {
      const result = await axios.post(`${API}SlideShow/Create`, formdata);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "CREATE SUCCESSFULLY",
        showConfirmButton: false,
        timer: 3500,
      });

      if (result.data.status === "OK") {
        window.location.href = "/SlideShow";
      }
    } catch (error) {
      console.error("error", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error creating slide",
        text: error.message,
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      setPreview(null);
      setBase64Image(null);
    }
  }, [image]);

  return (
    <PageContainer title="Add Slides" description="Add Slides Show For Web">
      <DashboardCard title="Add Slides">
        <Typography>
          <form className="forms-sample" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="no">ลำดับ</label>
              <input
                type="text"
                className="form-control"
                id="no"
                placeholder="ลำดับ"
                value={no}
                onChange={(e) => setNo(e.target.value)}
                required
              />
            </div>
            <div className="form-group file-input">
              <label>
                รูปภาพ{" "}
                <p style={{ color: "red" }}>ขนาดภาพสวยๆ 1671px X 686px</p>
              </label>
              {isSelectedimg ? (
                <div className="image-preview">
                  <center>
                    <img height="206px" src={preview as string} alt="Preview" />
                    <h6>Filename: {image?.name}</h6>
                    <button
                      type="button"
                      className="btn btn-danger btn-icon-text"
                      onClick={handleClick}
                    >
                      <i className="typcn typcn-arrow-sync btn-icon-prepend"></i>
                      Change Image
                    </button>
                  </center>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <center>
                    <input
                      type="image"
                      height="96px"
                      src={"/images/upload-image.png"}
                      onClick={handleClick}
                      alt="Upload"
                    />
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
                style={{ display: "none" }}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="url">URL</label>
              <input
                type="text"
                className="form-control"
                id="url"
                placeholder="Link URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary mr-2" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button type="button" className="btn btn-light" onClick={() => window.location.href = "/SlideShow"}>
              Cancel
            </button>
          </form>
        </Typography>
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;
