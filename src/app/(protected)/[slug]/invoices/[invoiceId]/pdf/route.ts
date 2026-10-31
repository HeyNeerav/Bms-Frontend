import { NextRequest, NextResponse } from "next/server";
import { getBusinessBySlug } from "@/lib/businesses";
import { api } from "@/lib/api";

type PageProps = {
  params: Promise<{ slug: string; invoiceId: string }>
}

export async function GET(
  req: NextRequest,
  { params }: PageProps,
) {
  const { slug, invoiceId } = await params;

  const business = await getBusinessBySlug(slug);
  
  if (!business) { 
    return NextResponse.redirect("/businesses");
  }

  const token = req.cookies.get("accessToken")?.value;

  try {
    const res: Blob = await api.get(`/invoices/${invoiceId}/pdf`, {
      resType: "blob",
      token,
      businessId: business._id,
    });

    const pdfBuffer = await res.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="invoice-${invoiceId}.pdf"`,
      },
    });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
