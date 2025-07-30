"use client";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";
import DashboardCard from "@/app/components/shared/DashboardCard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import { useRouter } from "next/navigation";

const VideoCreate = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [videoId, setVideoId] = useState("");

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Function to extract YouTube Video ID from URL, supporting both standard URLs and YouTube Shorts
  const getYouTubeVideoId = (url: string) => {
    // Check for YouTube Shorts URL pattern
    const shortsRegex = /youtube\.com\/shorts\/([^\s/?&]+)/;
    const shortsMatch = url.match(shortsRegex);
    if (shortsMatch && shortsMatch[1]) {
      return shortsMatch[1];
    }

    // Fallback for standard YouTube URLs
    const normalRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|watch)\?.*v=|embed\/)|youtu\.be\/)([^\s&]+)/;
    const match = url.match(normalRegex);
    return match && match[1] ? match[1] : null;
  };

  // Handle changes in the YouTube link input
  const handleYoutubeLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value;
    setYoutubeLink(inputUrl);
    const id = getYouTubeVideoId(inputUrl);
    if (id) {
      setVideoId(id);
    } else {
      setVideoId("");
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title || !youtubeLink) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Information",
        text: "Please provide both the title and a valid YouTube link.",
      });
      return;
    }

    try {
      const response = await fetch(`${API}/ElectionVideos/Create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          details: description,
          youTubeUrl: youtubeLink,
        }),
      });

      if (response.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Video Created Successfully",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          router.push(`/ElectionVideoAll`);
        });

        // Reset form fields
        setTitle("");
        setDescription("");
        setYoutubeLink("");
        setVideoId("");
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: `Error: ${errorData.error}`,
        });
      }
    } catch (error) {
      console.error("Error during creation:", error);
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: "An error occurred while creating the video.",
      });
    }
  };

  return (
    <DashboardCard title="Create Video Election">
      <form className="forms-sample" onSubmit={handleSubmit}>
        {/* Video Title Input */}
        <Box component="section" sx={{ p: 2 }}>
          <TextField
            fullWidth
            label="ชื่อวิดีโอ"
            variant="outlined"
            size="small"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
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
                  src={"/images/backgrounds/video.png"}
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
              onChange={handleYoutubeLinkChange}
              value={youtubeLink}
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
            onChange={(e) => setDescription(e.target.value)}
            value={description}
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

export default VideoCreate;
