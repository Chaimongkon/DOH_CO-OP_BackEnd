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
  department: string;
  fileURL: string;
  fileBlob: Blob;
}

interface Department {
  Department: string;
}

const DepartmentReportPage = () => {
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await axios.get(`${API}/Election/DataDepartment`);
        setDepartments(data);
      } catch (err) {
        setError("Error fetching department data.");
        console.error(err);
      }
    };

    fetchDepartments();
  }, [API]);

  const handleCheckboxChange = useCallback(
    (department: string, checked: boolean) => {
      setSelectedDepartments((prev) =>
        checked
          ? [...prev, department]
          : prev.filter((item) => item !== department)
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
      const total = selectedDepartments.length;
      let completed = 0;

      const promises = selectedDepartments.map(async (department) => {
        const response = await axios.post(
          `${API}/Election/JasperReportDepartment`,
          { department },
          { responseType: "blob" }
        );

        const fileBlob = new Blob([response.data], { type: "application/pdf" });
        const fileURL = window.URL.createObjectURL(fileBlob);

        completed += 1;
        setProgress((completed / total) * 100);

        return { department, fileURL, fileBlob };
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
      zip.file(`${file.department}.pdf`, file.fileBlob);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "DepartmentReports.zip");
  };

  const handleCheckAll = (checked: boolean) => {
    setSelectedDepartments(
      checked ? departments.map((dept) => dept.Department) : []
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
                  checked={selectedDepartments.length === departments.length}
                />
              }
              label="เลือกหน่วยงานทั้งหมด"
              sx={{ "& .MuiFormControlLabel-label": { fontSize: "1rem" } }}
            />
          </Typography>
          <Grid container spacing={2}>
            {departments.map((dept) => (
              <Grid item xs={12} sm={6} md={3} key={dept.Department}>
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
                      checked={selectedDepartments.includes(dept.Department)}
                      onChange={(e) =>
                        handleCheckboxChange(dept.Department, e.target.checked)
                      }
                    />
                  }
                  label={dept.Department}
                />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleDownload}
              disabled={loading || selectedDepartments.length === 0}
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

            <Box sx={{ display: "flex", justifyContent: "center", mb: 2, mt: 2}}>
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
                <Grid item xs={12} sm={6} md={3} key={file.department}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{file.department}</Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center" }}>
                      <Button
                        href={file.fileURL}
                        download={`${file.department}.pdf`}
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

export default DepartmentReportPage;
