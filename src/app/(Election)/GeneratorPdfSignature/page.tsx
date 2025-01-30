"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  Box,
  Container,
  Grid,
  LinearProgress,
} from "@mui/material";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
import OfflinePinOutlinedIcon from "@mui/icons-material/OfflinePinOutlined";
import DashboardCard from "@/app/components/shared/DashboardCard";

interface FileInfo {
  channel: string;
  fileURL: string;
  fileBlob: Blob;
}

interface Channel {
  FieldNumber: string;
}

const ChannelReportPage = () => {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const { data } = await axios.get(`${API}/Election/DataSignature`);
        setChannels(data);
      } catch (err) {
        setError("Error fetching channel data.");
        console.error(err);
      }
    };

    fetchChannels();
  }, [API]);

  const handleCheckboxChange = useCallback(
    (channel: string, checked: boolean) => {
      setSelectedChannels((prev) =>
        checked ? [...prev, channel] : prev.filter((item) => item !== channel)
      );
    },
    []
  );

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    setFiles([]);
    setProgress(0);

    try {
      const total = selectedChannels.length;
      let completed = 0;

      const promises = selectedChannels.map(async (channel) => {
        const response = await axios.post(
          `${API}/Election/JasperReportSignature`,
          { channel },
          { responseType: "blob" }
        );

        const fileBlob = new Blob([response.data], { type: "application/pdf" });
        const fileURL = window.URL.createObjectURL(fileBlob);

        completed += 1;
        setProgress((completed / total) * 100);

        return { channel, fileURL, fileBlob };
      });

      const filesData = await Promise.all(promises);
      setFiles(filesData);
    } catch (error) {
      setError("Error generating reports.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    files.forEach((file) => {
      zip.file(`${file.channel}.pdf`, file.fileBlob);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "DepartmentReports.zip");
  };

  const handleCheckAll = (checked: boolean) => {
    setSelectedChannels(
      checked ? channels.map((dept) => dept.FieldNumber) : []
    );
  };

  return (
    <DashboardCard title="พิมพ์รายชื่อผู้มีสิทธิ์เลือกตั้งตามหน่วยงาน">
      <Container fixed>
        <Box sx={{ bgcolor: "#FFEFD5", p: 3, borderRadius: 2, mt: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            สร้างรายงานรายชื่อผู้มีสิทธิ์เลือกตั้งตามหน่วยงาน
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Typography align="center">
            <FormControlLabel
              control={
                <Checkbox
                  icon={
                    <RadioButtonUncheckedOutlinedIcon
                      sx={{ fontSize: 32, color: "green" }}
                    />
                  }
                  checkedIcon={
                    <OfflinePinOutlinedIcon
                      sx={{ fontSize: 32, color: "green" }}
                    />
                  }
                  onChange={(e) => handleCheckAll(e.target.checked)}
                  checked={selectedChannels.length === channels.length}
                />
              }
              label="เลือกหน่วยงานทั้งหมด"
              sx={{ "& .MuiFormControlLabel-label": { fontSize: "1rem" } }}
            />
          </Typography>
          <Grid container spacing={2}>
            {channels.map((dept) => (
              <Grid item xs={12} sm={6} md={3} key={dept.FieldNumber}>
                <FormControlLabel
                  control={
                    <Checkbox
                      icon={
                        <RadioButtonUncheckedOutlinedIcon
                          sx={{ color: "green" }}
                        />
                      }
                      checkedIcon={
                        <OfflinePinOutlinedIcon sx={{ color: "green" }} />
                      }
                      checked={selectedChannels.includes(dept.FieldNumber)}
                      onChange={(e) =>
                        handleCheckboxChange(dept.FieldNumber, e.target.checked)
                      }
                    />
                  }
                  label={dept.FieldNumber}
                />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleDownload}
              disabled={loading || selectedChannels.length === 0}
            >
              {loading ? "Generating..." : "Generate PDFs"}
            </Button>
          </Box>

          {loading && (
            <Box sx={{ width: "100%", mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                color="success"
              />
            </Box>
          )}
        </Box>

        {files.length > 0 && (
          <Box sx={{ bgcolor: "#cfe8fc", p: 3, borderRadius: 2, mt: 4 }}>
            <Typography variant="h6" align="center" gutterBottom>
              ดาวน์โหลดรายงานรายชื่อผู้มีสิทธิ์เลือกตั้งตามหน่วยงาน
            </Typography>

            <Box
              sx={{ display: "flex", justifyContent: "center", mb: 2, mt: 2 }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={handleDownloadAll}
              >
                ดาวน์โหลดทั้งหมด เป็น Zip ไฟล์
              </Button>
            </Box>

            <Grid container spacing={2} justifyContent="center">
              {files.map((file) => (
                <Grid item xs={12} sm={6} md={3} key={file.channel}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{file.channel}</Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center" }}>
                      <Button
                        href={file.fileURL}
                        download={`${file.channel}.pdf`}
                        variant="outlined"
                        color="error"
                      >
                        Download
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          setPreviewFile(file.fileURL);
                          setOpenDialog(true);
                        }}
                      >
                        Preview
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Dialog
              open={openDialog}
              onClose={() => setOpenDialog(false)}
              maxWidth="lg"
              fullWidth
            >
              <DialogTitle>PDF Preview</DialogTitle>
              <DialogContent>
                {previewFile && (
                  <iframe
                    src={previewFile}
                    width="100%"
                    height="600px"
                    title="PDF Preview"
                  />
                )}
              </DialogContent>
            </Dialog>
          </Box>
        )}
      </Container>
    </DashboardCard>
  );
};

export default ChannelReportPage;
