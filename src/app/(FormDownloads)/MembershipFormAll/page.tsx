"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Container,
  Tab,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import DashboardCard from "@/app/components/shared/DashboardCard";
import { useRouter } from "next/navigation";
import { TabContext, TabList, TabPanel } from "@mui/lab";

interface Column {
  id: "Image" | "Title" | "TypeForm" | "TypeMember" | "PdfFile" | "Actions";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
}

const columns: Column[] = [
  { id: "Image", label: "Image", minWidth: 170, align: "center" },
  { id: "Title", label: "ชื่อแบบฟอร์ม", minWidth: 170, align: "left" },
  { id: "TypeForm", label: "ประเภทสวัสดิการ", minWidth: 100, align: "left" },
  { id: "TypeMember", label: "ประเภทสมาชิก", minWidth: 100, align: "left" },
  { id: "PdfFile", label: "PDF File", minWidth: 170, align: "center" },
  { id: "Actions", label: "Actions", minWidth: 170, align: "center" },
];

interface Data {
  Id: number;
  Title: string;
  TypeForm: string;
  TypeMember: string;
  PdfFile: string;
}

const base64ToBlobUrl = (base64: string, type: string) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type });
  return URL.createObjectURL(blob);
};

const MembershipFormAll = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [rows, setRows] = useState<Data[]>([]);
  const [open, setOpen] = useState(false);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const typeForm = "แบบฟอร์มสมัครสมาชิก";

  // Sorting order for TypeMember
  const typeMemberOrder = [
    "สมาชิกสามัญประเภท ก",
    "สมาชิกสามัญประเภท ข",
    "สมาชิกสมทบ",
  ];

  const getPaginatedData = useCallback(async () => {
    try {
      const res = await fetch(`${API}/FormDowsloads/GetAll`);
      const data = await res.json();
      const filteredData = data.data.filter(
        (row: Data) => row.TypeForm === typeForm
      );

      // Sort rows by TypeMember
      const sortedData = filteredData.sort((a: Data, b: Data) =>
        typeMemberOrder.indexOf(a.TypeMember) - typeMemberOrder.indexOf(b.TypeMember)
      );
      setRows(sortedData);

      if (sortedData.length > 0) {
        setValue(sortedData[0].TypeMember);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, [API]);

  useEffect(() => {
    getPaginatedData();
  }, [getPaginatedData]);

  const handleClickOpen = (base64: string) => {
    const blobUrl = base64ToBlobUrl(base64, "application/pdf");
    setPdfBase64(blobUrl);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPdfBase64(null);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`${API}/FormDowsloads/Delete`, {
        data: { id },
      });

      if (response.status === 200) {
        Swal.fire("Deleted!", "The news has been deleted.", "success");
        setRows((prevNews) => prevNews.filter((news) => news.Id !== id));
      } else {
        Swal.fire("Error!", "Failed to delete the news.", "error");
      }
    } catch (error) {
      console.error("Failed to delete news:", error);
      Swal.fire("Error!", "An error occurred while deleting the news.", "error");
    }
  };

  const [value, setValue] = useState("");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const uniqueMemberType = useMemo(
    () => Array.from(new Set(rows.map((row) => row.TypeMember))),
    [rows]
  );

  return (
    <DashboardCard title={`จัดการ ${typeForm}`}>
      <Container>
        <Paper>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box></Box>
            <Link href={`/FormDownloadsCreate?typeForm=${encodeURIComponent(typeForm)}`}>
              <Button
                variant="contained"
                size="small"
                color="success"
                startIcon={<AddCircleIcon />}
              >
                Add {typeForm}
              </Button>
            </Link>
          </Box>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                {uniqueMemberType.map((TypeMember) => (
                  <Tab label={TypeMember} value={TypeMember} key={TypeMember} />
                ))}
              </TabList>
            </Box>
            {uniqueMemberType.map((TypeMember, index) => (
              <TabPanel key={index} value={TypeMember}>
                <TableContainer>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ top: 5, minWidth: column.minWidth }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows
                        .filter((row) => row.TypeMember === TypeMember)
                        .map((row) => (
                          <TableRow hover role="checkbox" tabIndex={-1} key={row.Id}>
                            {columns.map((column) => {
                              const cellKey = `${row.Id}-${column.id}`;
                              if (column.id === "Actions") {
                                return (
                                  <TableCell key={column.id} align={column.align}>
                                    <Button
                                      component="label"
                                      variant="contained"
                                      size="small"
                                      color="warning"
                                      startIcon={<EditIcon />}
                                      onClick={() => router.push(`/FormDownloadsEdit/${row.Id}`)}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      component="label"
                                      variant="contained"
                                      size="small"
                                      color="error"
                                      startIcon={<DeleteIcon />}
                                      onClick={() => handleDelete(row.Id)}
                                      sx={{ ml: 1 }}
                                    >
                                      Delete
                                    </Button>
                                  </TableCell>
                                );
                              } else {
                                const value = row[column.id as keyof Data];
                                return (
                                  <TableCell key={column.id} align={column.align}>
                                    {column.id === "Image" ? (
                                      <img
                                        src={"/images/backgrounds/pdffile.png"}
                                        alt={row.TypeMember}
                                        style={{ width: "100px" }}
                                      />
                                    ) : column.id === "PdfFile" ? (
                                      <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleClickOpen(value as string)}
                                      >
                                        View PDF
                                      </Button>
                                    ) : (
                                      value
                                    )}
                                  </TableCell>
                                );
                              }
                            })}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
            ))}
          </TabContext>

          <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <DialogTitle>PDF Preview</DialogTitle>
            <DialogContent>
              {pdfBase64 && (
                <iframe src={pdfBase64} width="100%" height="600px" title="PDF Preview" />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </DashboardCard>
  );
};

export default MembershipFormAll;

