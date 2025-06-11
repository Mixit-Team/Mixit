import { authOptions } from "@/services/auth/authOptions";
import { getServerSession } from "next-auth";
import axios from "axios";
import type { Readable } from "stream";

export const runtime = "nodejs";

export async function GET() {
  // 1) 세션에서 액세스 토큰 가져오기
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2) 백엔드 SSE 스트림에 연결 (axios로 responseType: 'stream' 설정)
  const backendRes = await axios.get(
    `${process.env.BACKEND_URL}/api/v1/notifications/subscribe`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "stream",
    }
  );

  const stream = backendRes.data as Readable; // Node.js Readable stream
  console.log("백엔드 SSE 스트림 응답:", backendRes.status);

  // Convert Node.js Readable to Web ReadableStream
  const webStream = new ReadableStream({
    start(controller) {
      stream.on("data", (chunk) => controller.enqueue(chunk));
      stream.on("end", () => controller.close());
      stream.on("error", (err) => controller.error(err));
    },
    cancel() {
      stream.destroy();
    },
  });

  // 3) 받은 스트림을 그대로 프론트로 내려주기
  return new Response(webStream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
