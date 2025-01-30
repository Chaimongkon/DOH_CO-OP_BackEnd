import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Named export for the POST method
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { channel } = data;

    const url =
      "http://192.168.100.8:8080/jasperserver/rest_v2/reports/reports/ChannelElectionReport.pdf";
    const params = { MainParam: channel };

    // Fetch the PDF stream from the JasperReports server
    const response = await axios.get(url, {
      params,
      responseType: "arraybuffer", // arraybuffer to handle binary data
      auth: {
        username: "jasperadmin",
        password: "jasperadmin",
      },
    });

    // Set response headers for binary PDF data
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");

    // Return the PDF data in the response
    return new NextResponse(response.data, { headers });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Error generating report" },
      { status: 500 }
    );
  }
}
