export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    status: "ok",
    service: "hazenco-nl",
    timestamp: new Date().toISOString()
  });
}
