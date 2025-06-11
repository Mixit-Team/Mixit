import { authOptions } from "@/services/auth/authOptions";
import { getServerSession } from "next-auth";
import axios from "axios";

export async function GET() {
  // 1) 세션에서 액세스 토큰 가져오기
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) {
    return new Response(null, { status: 401 });
  }

  try {
    // 2) axios로 백엔드 알림 목록 요청
    const backendRes = await axios.get<{ data: unknown[] }>(
      `${process.env.BACKEND_URL}/api/v1/notifications`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      
      console.log("백엔드 알림 목록 응답:", backendRes.data);

    // 3) 받은 데이터를 그대로 리턴
    return new Response(
      JSON.stringify({ notifications: backendRes.data.data }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: unknown) {
    console.error("알림 목록 조회 오류:", err);
    let errorMessage = "Unknown error";
    let statusCode = 500;
    if (axios.isAxiosError(err)) {
      errorMessage = err.response?.data || err.message;
      statusCode = err.response?.status || 500;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: statusCode,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
