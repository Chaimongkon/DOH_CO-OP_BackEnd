"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import DashboardCard from "@/app/components/shared/DashboardCard";
import CancelIcon from "@mui/icons-material/Cancel";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface FormData {
  title: string;
  youTubeUrl: string;
  details: string;
}

const VideoEdit = () => {
  const router = useRouter();
  const { id } = useParams();
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [formData, setFormData] = useState<FormData>({
    title: "",
    youTubeUrl: "",
    details: "",
  });

  const fetchVideos = useCallback(async () => {
    try {
      const response = await fetch(`${API}/Videos/GetById/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      setFormData({
        title: data.Title,
        youTubeUrl: data.YouTubeUrl,
        details: data.Details,
      });
    } catch (error) {
      console.error("Failed to fetch video:", error);
    }
  }, [API, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, youTubeUrl, details } = formData;

    try {
      const response = await fetch(`${API}/Videos/Edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          youTubeUrl,
          details,
        }),
      });

      if (response.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "UPDATE SUCCESSFULLY",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          router.push(`/VideoAll`);
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to update video.",
        });
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  const handleYoutubeLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value;
    setFormData((prev) => ({ ...prev, youTubeUrl: inputUrl }));
  };

  const getYouTubeVideoId = (url: string) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|watch)\?.*v=|embed\/)|youtu\.be\/)([^\s&]+)/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Extract the video ID from the YouTube URL
  const videoId = getYouTubeVideoId(formData.youTubeUrl);

  return (
    <DashboardCard title="Edit Video">
      <form className="forms-sample" onSubmit={handleSubmit}>
        {/* Video Title Input */}
        <Box component="section" sx={{ p: 2 }}>
          <TextField
            fullWidth
            label="ชื่อวิดีโอ"
            variant="outlined"
            size="small"
            name="title"
            onChange={handleInputChange}
            value={formData.title}
            required
          />
        </Box>

        {/* YouTube Link Input and Preview */}
        <Box component="section" sx={{ p: 2 }}>
          <div
            className="form-group"
            style={{
              borderStyle: "dashed",
              borderWidth: 2,
              borderRadius: 4,
              borderColor: "grey",
              padding: "16px",
            }}
          >
            <label>
              วิดีโอ <span style={{ color: "red" }}>Link YouTube เท่านั้น</span>
            </label>
            <br />
            <br />
            {videoId ? (
              <div>
                <center>
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    width="560"
                    height="315"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </center>
              </div>
            ) : (
              <center>
                <input
                  type="image"
                  height="126px"
                  src={`/images/backgrounds/video.png`}
                  alt="Upload"
                />
              </center>
            )}

            <br />
            <br />
            <TextField
              fullWidth
              label="YouTube Link"
              variant="outlined"
              size="small"
              name="youTubeUrl"
              onChange={handleYoutubeLinkChange}
              value={formData.youTubeUrl}
              required
            />
          </div>
        </Box>

        {/* Video Description Input */}
        <Box component="section" sx={{ p: 2 }}>
          <TextField
            fullWidth
            label="รายละเอียด"
            variant="outlined"
            size="small"
            multiline
            rows={4}
            name="details"
            onChange={handleInputChange}
            value={formData.details}
          />
        </Box>

        {/* Submit and Cancel Buttons */}
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
              onClick={() => router.push(`/VideoAll`)}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </form>
    </DashboardCard>
  );
};

export default VideoEdit;
