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
  TableFooter,
  TablePagination,
  CircularProgress,  // Material UI loading spinner
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
  FilePath: string;
}

const WelfareFormAll = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [rows, setRows] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);  // Loading state
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [value, setValue] = useState("");
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const URLFile = process.env.NEXT_PUBLIC_PICHER_BASE_URL;
  const router = useRouter();
  const typeForm = "แบบฟอร์มหนังสือร้องทุกข์ / ร้องเรียน";

  const typeMemberOrder = [
    "สมาชิกสามัญประเภท ก",
    "สมาชิกสามัญประเภท ข",
    "สมาชิกสมทบ",
  ];

  const getPaginatedData = useCallback(async () => {
    setLoading(true);  // Set loading to true before fetching data
    try {
      const res = await fetch(`${API}/FormDowsloads/GetAll`);
      const data = await res.json();
      const filteredData = data.data.filter(
        (row: Data) => row.TypeForm === typeForm
      );

      const sortedData = filteredData.sort(
        (a: Data, b: Data) =>
          typeMemberOrder.indexOf(a.TypeMember) -
          typeMemberOrder.indexOf(b.TypeMember)
      );
      setRows(sortedData);

      if (sortedData.length > 0) {
        setValue(sortedData[0].TypeMember);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);  // Set loading to false once data is fetched
    }
  }, [API]);

  useEffect(() => {
    getPaginatedData();
  }, [getPaginatedData]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpen = (pdfPath: string) => {
    setPdfUrl(`${URLFile}${pdfPath}`);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPdfUrl(null);
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
      Swal.fire(
        "Error!",
        "An error occurred while deleting the news.",
        "error"
      );
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setPage(0);
  };

  const uniqueMemberType = useMemo(
    () => Array.from(new Set(rows.map((row) => row.TypeMember))),
    [rows]
  );

  const paginatedRows = useMemo(
    () =>
      rows
        .filter((row) => row.TypeMember === value)
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [rows, value, page, rowsPerPage]
  );

  return (
    <DashboardCard title={`จัดการ ${typeForm}`}>
      <Container>
        <Paper>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box></Box>
            <Link
              href={`/FormDownloadsCreate?typeForm=${encodeURIComponent(
                typeForm
              )}`}
            >
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
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="400px"
            >
              <CircularProgress />
            </Box>
          ) : (
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleTabChange}
                  aria-label="tabs for form downloads"
                >
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
                        {paginatedRows.map((row) => (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.Id}
                          >
                            {columns.map((column) => {
                              const value = row[column.id as keyof Data];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.id === "Image" ? (
                                    <img
                                      src={"/images/backgrounds/pdffile.png"}
                                      alt={row.TypeMember}
                                      style={{
                                        width: "100px",
                                        filter:
                                          "drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.5))",
                                      }}
                                    />
                                  ) : column.id === "PdfFile" ? (
                                    <Button
                                      variant="contained"
                                      size="small"
                                      onClick={() =>
                                        handleClickOpen(row.FilePath)
                                      }
                                    >
                                      View PDF
                                    </Button>
                                  ) : column.id === "Actions" ? (
                                    <Box display="flex" justifyContent="center">
                                      <Button
                                        variant="contained"
                                        size="small"
                                        color="warning"
                                        startIcon={<EditIcon />}
                                        onClick={() =>
                                          router.push(
                                            `/FormDownloadsEdit/${row.Id}`
                                          )
                                        }
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        variant="contained"
                                        size="small"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDelete(row.Id)}
                                        sx={{ ml: 1 }}
                                      >
                                        Delete
                                      </Button>
                                    </Box>
                                  ) : (
                                    value
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            count={
                              rows.filter((row) => row.TypeMember === TypeMember)
                                .length
                            }
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Rows per page"
                          />
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TableContainer>
                </TabPanel>
              ))}
            </TabContext>
          )}

          <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <DialogTitle>PDF Preview</DialogTitle>
            <DialogContent>
              {pdfUrl && (
                <iframe
                  src={pdfUrl}
                  width="100%"
                  height="600px"
                  title="PDF Preview"
                />
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

export default WelfareFormAll;
