export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    status: "ok",
    service: "hazenco-toolshub",
    timestamp: new Date().toISOString()
  });
}
