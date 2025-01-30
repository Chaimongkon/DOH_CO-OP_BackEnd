"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Container,
  InputBase,
  Divider,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import DashboardCard from "@/app/components/shared/DashboardCard";
import { useRouter } from "next/navigation";

interface Column {
  id: "Image" | "DepartmentName"| "File" | "Actions";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
}

const columns: Column[] = [
  { id: "Image", label: "Image", minWidth: 170, align: "center" },
  { id: "DepartmentName", label: "DepartmentName", minWidth: 170, align: "left" },
  { id: "File", label: "File", minWidth: 170, align: "center" },
  { id: "Actions", label: "Actions", minWidth: 170, align: "center" },
];

interface Data {
  Id: number;
  DepartmentName: string;
  FilePath: string;
}

export default function NewAll() {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<Data[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [open, setOpen] = useState(false);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [search, setSearch] = useState(""); // State for search query
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const URLFile = process.env.NEXT_PUBLIC_PICHER_BASE_URL;
  const currentPage = useRef(0);
  const router = useRouter();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    currentPage.current = newPage;
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    currentPage.current = 0;
  };

  const getPaginatedData = useCallback(() => {
    let url = `${API}/ElectionDepartment/GetAll?page=${
      currentPage.current + 1
    }&per_page=${rowsPerPage}`;
    if (search) {
      url += `&search=${search}`;
    }
    fetch(url, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setTotalRows(data.total);
        setRows(data.data);
      });
  }, [API, rowsPerPage, search]);

  useEffect(() => {
    getPaginatedData();
  }, [page, rowsPerPage, getPaginatedData]);

  const handleClickOpen = (filePath: string) => {
    setFilePath(filePath); // Set the PDF path for preview
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFilePath(null);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`${API}/News/Delete`, {
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

  return (
    <DashboardCard title="จัดการ หน่วยงาน">
      <Container>
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: "10px",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: isMobile ? "100%" : 400,
              marginBottom: isMobile ? "10px" : "0",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              getPaginatedData();
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="ค้นหาหน่วยงาน"
              value={search}
              onChange={(e) => setSearch(e.target.value)} // Update search state
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton
              color="primary"
              sx={{ p: "10px" }}
              aria-label="search"
              onClick={() => getPaginatedData()} // Trigger search on click
            >
              <SearchIcon />
            </IconButton>
          </Paper>

          <Link href="/ElectionDepartmentCreate" passHref>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              size="small"
              color="success"
              tabIndex={-1}
              startIcon={<AddCircleIcon />}
            >
              Add ElectionDepartment
            </Button>
          </Link>
        </Paper>
        <Paper>
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
                {rows.map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.Id}>
                      {columns.map((column) => {
                        if (column.id === "Actions") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                  component="label"
                                  variant="contained"
                                  size="small"
                                  color="warning"
                                  startIcon={<EditIcon />}
                                  onClick={() =>
                                    router.push(`/NewEdit/${row.Id}`)
                                  }
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
                                >
                                  Delete
                                </Button>
                              </Box>
                            </TableCell>
                          );
                        } else {
                          const value = row[column.id as keyof Data];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.id === "Image" ? (
                                <img
                                  src={"/images/backgrounds/pdfdl.png"} // Image from path
                                  alt={row.DepartmentName}
                                  style={{ width: "50px" }}
                                />
                              ) : column.id === "File" ? (
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() =>
                                    handleClickOpen(`${URLFile}${row.FilePath}`)
                                  }
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
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <DialogTitle>PDF Preview</DialogTitle>
            <DialogContent>
              {filePath && (
                <iframe
                  src={filePath} // Direct PDF path
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
}
