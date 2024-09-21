"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import * as React from "react";
import { styled } from "@mui/material/styles";
import { Box, Stack } from "@mui/material";
import Table from "@mui/material/Table";
import MuiButton from "@mui/material/Button"; // Rename the Material-UI Button
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import TablePagination from "@mui/material/TablePagination";
import {
  Unstable_NumberInput as BaseNumberInput,
  NumberInputProps,
  numberInputClasses,
} from "@mui/base/Unstable_NumberInput";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import DescriptionIcon from "@mui/icons-material/Description";

const NumberInput = React.forwardRef(function CustomNumberInput(
  props: NumberInputProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <BaseNumberInput
      slots={{
        root: InputRoot,
        input: InputElement,
        incrementButton: Button,
        decrementButton: Button,
      }}
      slotProps={{
        incrementButton: {
          children: <span className="arrow">▴</span>,
        },
        decrementButton: {
          children: <span className="arrow">▾</span>,
        },
      }}
      {...props}
      ref={ref}
    />
  );
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const ExcelUpload = () => {
  const router = useRouter();
  const [excelData, setExcelData] = useState<any[]>([]);
  const [fieldNumber, setFieldNumber] = useState<number>(0);
  const [sequenceNumber, setSequenceNumber] = useState<number>(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const hiddenFileInput = React.useRef<HTMLInputElement | null>(null);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target?.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  // Function to generate fields and sequence dynamically
  const generateFieldsAndSequence = (totalRows: number) => {
    const result = [];

    let rowCount = 0;
    for (let field = 1; field <= fieldNumber; field++) {
      for (let sequence = 1; sequence <= sequenceNumber; sequence++) {
        if (rowCount >= totalRows) break; // Stop when we reach the number of rows in Excel
        result.push({
          FieldNumber: field,
          SequenceNumber: sequence,
        });
        rowCount++;
      }
      if (rowCount >= totalRows) break;
    }

    return result;
  };

  // Paginate the data based on the page and rowsPerPage
  const paginatedData = excelData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSubmit = async () => {
    // Combine FieldNumber and SequenceNumber with excelData
    const dataWithFieldsAndSequence = excelData.map((row, index) => {
      // Extract Member, IdCard, and FullName from the current row
      const { Member, IdCard, FullName, Department, MemberType } = row;

      // Calculate the FieldNumber and SequenceNumber based on index
      const fieldNumber = Math.floor(index / sequenceNumber) + 1;
      const sequence = (index % sequenceNumber) + 1;

      // Add FieldNumber and SequenceNumber to each row
      return {
        ...row, // Include original row data
        Member,
        IdCard,
        FullName,
        Department,
        MemberType,
        FieldNumber: "ช่อง " + fieldNumber, // Format FieldNumber
        SequenceNumber: "ลำดับที่ " + sequence, // Format SequenceNumber
      };
    });

    // Prepare the payload
    const payload = {
      data: dataWithFieldsAndSequence, // Modified data with FieldNumber and SequenceNumber
    };

    try {
      const response = await axios.post(`${API}/Election/Upload`, payload);

      // Check if the request was successful
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "CREATE SUCCESSFULLY",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          router.push(`/ElectionAll`); // Navigate after success
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Upload failed",
          text: "There was an issue with uploading the data.",
        });
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while uploading the data.",
      });
    }
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <DashboardCard title="Upload Excel File">
   <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <MuiButton
        component="a"
        href="/fileexample/election.xlsx"
        download
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<DescriptionIcon />}
        sx={{
          backgroundColor: "green",
          "&:hover": { backgroundColor: "darkgreen" },
          margin: "20px auto", // Add margin for space
        }}
      >
        ตัวอย่าง Excel
      </MuiButton>

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
            ไฟล์แนบ <p style={{ color: "red" }}>ไฟล์นามสกุล .xlsx เท่านั้น!</p>
          </label>
          {selectedFile ? (
            <div>
              <center>
                <img
                  height="106px"
                  src={"/images/backgrounds/excel.png"}
                  alt="Excel Icon"
                />
                <br />
                <h6>Filename: {selectedFile.name}</h6>{" "}
                {/* Display selected file name */}
                <br />
                <MuiButton
                  variant="contained"
                  color="success"
                  endIcon={<FlipCameraAndroidIcon />}
                  onClick={handleClick}
                >
                  Change Image
                </MuiButton>
              </center>
            </div>
          ) : (
            <div>
              <center>
                <input
                  type="image"
                  height="96px"
                  src={"/images/backgrounds/excelupload.png"}
                  onClick={handleClick}
                  alt="Upload Excel"
                ></input>
                <br />
                <h6>Upload Excel File</h6>
              </center>
            </div>
          )}
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            ref={hiddenFileInput}
            style={{ display: "none" }}
          />
        </div>
        <Box
          sx={{
            fontFamily: "Mitr",
            display: "flex",
            justifyContent: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            p: 2,
          }}
        >
          <NumberInput
            endAdornment={
              <InputAdornment
                sx={{
                  fontFamily: "Mitr",
                }}
              >
                จำนวนช่อง
              </InputAdornment>
            }
            value={fieldNumber}
            onChange={(_, value: number | null) => {
              if (value !== null) {
                setFieldNumber(value);
              }
            }}
          />

          <NumberInput
            endAdornment={
              <InputAdornment
                sx={{
                  fontFamily: "Mitr",
                }}
              >
                จำนวนลำดับ
              </InputAdornment>
            }
            value={sequenceNumber}
            onChange={(_, value: number | null) => {
              if (value !== null) {
                setSequenceNumber(value);
              }
            }}
          />
        </Box>
        {excelData.length > 0 && (
          <div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>ลำดับ</StyledTableCell>
                    <StyledTableCell align="center">เลขสมาชิก</StyledTableCell>
                    <StyledTableCell align="center">
                      เลขบัตรประชาชน
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      ชื่อ - นามสกุล
                    </StyledTableCell>
                    <StyledTableCell align="center">หน่วยงาน</StyledTableCell>
                    <StyledTableCell align="center">
                      ประเภทสมาชิก
                    </StyledTableCell>
                    <StyledTableCell align="center">ช่องที่</StyledTableCell>
                    <StyledTableCell align="center">ลำดับที่</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {generateFieldsAndSequence(paginatedData.length).map(
                    (sequenceRow, sequenceIndex) => (
                      <StyledTableRow key={sequenceIndex}>
                        <StyledTableCell>{sequenceIndex + 1}</StyledTableCell>
                        {/* Ensure no extra whitespace is present between table cells */}
                        {paginatedData[sequenceIndex] &&
                          Object.values(paginatedData[sequenceIndex]).map(
                            (value, colIndex) => (
                              <StyledTableCell key={colIndex}>
                                {String(value)}
                              </StyledTableCell>
                            )
                          )}
                        <StyledTableCell>
                          ช่อง {sequenceRow.FieldNumber}
                        </StyledTableCell>
                        <StyledTableCell>
                          ลำดับที่ {sequenceRow.SequenceNumber}
                        </StyledTableCell>
                      </StyledTableRow>
                    )
                  )}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={excelData.length} // Total number of rows
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 20, 30, 50, 100]}
              />
            </TableContainer>
            <Box component="section" sx={{ p: 2 }}>
              <Stack spacing={2} direction="row">
                <MuiButton
                  variant="contained"
                  endIcon={<CloudUploadIcon />}
                  type="submit"
                  onClick={handleSubmit}
                >
                  Submit
                </MuiButton>
                <MuiButton
                  variant="contained"
                  color="error"
                  endIcon={<CancelIcon />}
                  onClick={() => router.back()}
                >
                  Cancel
                </MuiButton>
              </Stack>
            </Box>
          </div>
        )}
      </div>
    </DashboardCard>
  );
};
const InputAdornment = styled("div")(
  ({ theme }) => `
  margin: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  grid-row: 1/3;
  color: ${theme.palette.mode === "dark" ? grey[500] : grey[700]};
`
);

const blue = {
  100: "#DAECFF",
  200: "#B6DAFF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0059B2",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const InputRoot = styled("div")(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  border-radius: 8px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  box-shadow: 0px 2px 4px ${
    theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"
  };
  display: grid;
  grid-template-columns: auto 1fr auto 19px;
  grid-template-rows: 1fr 1fr;
  overflow: hidden;
  padding: 4px;

  &.${numberInputClasses.focused} {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${
      theme.palette.mode === "dark" ? blue[700] : blue[200]
    };
  }

  &:hover {
    border-color: ${blue[400]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);

const InputElement = styled("input")(
  ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  grid-row: 1/3;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: inherit;
  border: none;
  border-radius: inherit;
  padding: 8px 12px;
  outline: 0;
`
);

const Button = styled("button")(
  ({ theme }) => `
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  appearance: none;
  padding: 0;
  width: 19px;
  height: 20px;
  font-family: system-ui, sans-serif;
  font-size: 0.875rem;
  line-height: 1;
  box-sizing: border-box;
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 0;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    background: ${theme.palette.mode === "dark" ? grey[800] : grey[50]};
    border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
    cursor: pointer;
  }

  &.${numberInputClasses.incrementButton} {
    grid-column: 4/5;
    grid-row: 1/2;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: 1px solid;
    border-bottom: 0;
    border-color: ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    background: ${theme.palette.mode === "dark" ? grey[900] : grey[50]};
    color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};

    &:hover {
      cursor: pointer;
      color: #FFF;
      background: ${theme.palette.mode === "dark" ? blue[600] : blue[500]};
      border-color: ${theme.palette.mode === "dark" ? blue[400] : blue[600]};
    }
  }

  &.${numberInputClasses.decrementButton} {
    grid-column: 4/5;
    grid-row: 2/3;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border: 1px solid;
    border-color: ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    background: ${theme.palette.mode === "dark" ? grey[900] : grey[50]};
    color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};

    &:hover {
      cursor: pointer;
      color: #FFF;
      background: ${theme.palette.mode === "dark" ? blue[600] : blue[500]};
      border-color: ${theme.palette.mode === "dark" ? blue[400] : blue[600]};
    }
  }

  & .arrow {
    transform: translateY(-1px);
  }

  & .arrow {
    transform: translateY(-1px);
  }
`
);
export default ExcelUpload;
