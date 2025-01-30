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
  Checkbox,
  FormGroup,
  FormControlLabel,
  Box,
  Container,
  InputBase,
  Divider,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import DashboardCard from "@/app/components/shared/DashboardCard";
import { useRouter } from "next/navigation";
import Delete from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

interface Column {
  id:
    | "No"
    | "Member"
    | "IdCard"
    | "FullName"
    | "Department"
    | "FieldNumber"
    | "SequenceNumber";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
}

const columns: Column[] = [
  { id: "No", label: "ลำดับ", minWidth: 70, align: "center" },
  { id: "Member", label: "เลขสมาชิก", minWidth: 170, align: "center" },
  { id: "IdCard", label: "เลขบัตรประชาชน", minWidth: 170, align: "left" },
  { id: "FullName", label: "ชื่อ - นามสกุล", minWidth: 100, align: "left" },
  { id: "Department", label: "หน่วยงาน", minWidth: 100, align: "left" },
  { id: "FieldNumber", label: "ช่อง", minWidth: 170, align: "center" },
  { id: "SequenceNumber", label: "ลำดับ", minWidth: 170, align: "center" },
];

interface Data {
  Id: number;
  Member: string;
  IdCard: string;
  FullName: string;
  Department: string;
  FieldNumber: string;
  SequenceNumber: string;
  MemberType: string;
}

export default function ElectionAll() {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<Data[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const [memberTypes, setMemberTypes] = useState<string[]>([]);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
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

  // Handle checkbox changes for member types
  const handleMemberTypeChange = (type: string) => {
    setMemberTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Fetch data from the API with memberTypes filtering
  const getPaginatedData = useCallback(() => {
    let url = `${API}/Election/GetAll?page=${
      currentPage.current + 1
    }&per_page=${rowsPerPage}`;

    if (search) {
      url += `&search=${search}`;
    }

    // Pass memberTypes to API if any are selected
    if (memberTypes.length > 0) {
      url += `&memberTypes=${memberTypes.join(",")}`;
    }

    fetch(url, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setTotalRows(data.total);
        setRows(data.data);
      });
  }, [API, rowsPerPage, search, memberTypes]);

  useEffect(() => {
    getPaginatedData();
  }, [page, rowsPerPage, getPaginatedData]);

  const handleDeleteAll = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover these records!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete all!",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`${API}/Election/Delete`);

        if (response.status === 200) {
          Swal.fire(
            "Deleted!",
            "All election records have been deleted.",
            "success"
          );

          setRows([]);
        } else {
          Swal.fire("Error!", "Failed to delete all records.", "error");
        }
      }
    } catch (error) {
      console.error("Failed to delete all records:", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting all records.",
        "error"
      );
    }
  };

  return (
    <DashboardCard title="จัดการ การเลือกตั้ง">
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
              placeholder="ค้นหา"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton
              color="primary"
              sx={{ p: "10px" }}
              aria-label="search"
              onClick={() => getPaginatedData()}
            >
              <SearchIcon />
            </IconButton>
          </Paper>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={memberTypes.includes("สามัญ ก")}
                  onChange={() => handleMemberTypeChange("สามัญ ก")}
                />
              }
              label="สามัญ ประเภท ก"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={memberTypes.includes("สามัญ ข")}
                  onChange={() => handleMemberTypeChange("สามัญ ข")}
                />
              }
              label="สามัญ ประเภท ข"
            />
          </FormGroup>
          <FormGroup>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              size="small"
              color="error"
              tabIndex={-1}
              startIcon={<Delete />}
              onClick={handleDeleteAll}
            >
              DeleteAll รายชื่อสมาชิก
            </Button>
          </FormGroup>
          <Link href="/ElectionCreate" passHref>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              size="small"
              color="success"
              tabIndex={-1}
              startIcon={<AddCircleIcon />}
            >
              Upload รายชื่อสมาชิก
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
                {rows.map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.Id}>
                    {columns.map((column) => {
                      let value;

                      // Check for the "No" column and set the value as the row index + 1
                      if (column.id === "No") {
                        value = index + 1 + page * rowsPerPage;
                      } else {
                        value = row[column.id as keyof Data];
                      }

                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
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
          <Paper
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: "10px",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <Box>
              {" "}
              <Link href="/GeneratorPdfDepartment">
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  size="small"
                  color="primary"
                  tabIndex={-1}
                  startIcon={<PictureAsPdfIcon />}
                >
                  รายชื่อเลือกตั้งรายสังกัด
                </Button>
              </Link>
            </Box>
            <Box>
              {" "}
              <Link href="/GeneratorPdfChannel">
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  size="small"
                  color="success"
                  tabIndex={-1}
                  startIcon={<PictureAsPdfIcon />}
                >
                  รายชื่อเลือกตั้งตามช่อง
                </Button>
              </Link>
            </Box>
            <Box>
              {" "}
              <Link href="/GeneratorPdfSignature">
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  size="small"
                  color="info"
                  tabIndex={-1}
                  startIcon={<PictureAsPdfIcon />}
                >
                  รายมือชื่อผู้เข้าร่าวมประชุมตามช่อง
                </Button>
              </Link>
            </Box>
          </Paper>
        </Paper>
      </Container>
    </DashboardCard>
  );
}
