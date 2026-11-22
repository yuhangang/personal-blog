import { buildResumeA4Pdf, RESUME_PDF_FILENAME } from "@/lib/resumePdf";

export const runtime = "nodejs";

export async function GET() {
  const pdfBytes = await buildResumeA4Pdf();

  return new Response(new Uint8Array(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${RESUME_PDF_FILENAME}"`,
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
