import { authOptions } from "@/services/auth/authOptions";
import axios from "axios";
import { getServerSession } from "next-auth";

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
    return new Response("Unauthorized", { status: 401 });
    }
    const { id } = (await request.json()) as { id: number };

    const url = `${process.env.BACKEND_URL}/api/v1/notifications/${id}/read`;
    console.log("알림 읽음 처리 URL:", url);
    try {
      
      console.log('token',token)
    const backendRes = await axios.patch(
      url,
        {},
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        responseType: "stream",
        }
    );

    if (backendRes.status !== 200) {
      throw new Error(`백엔드 API 호출 실패: ${backendRes.status}`);
    }
      
    return new Response(JSON.stringify({ message: "알림이 읽음 처리되었습니다." }), {   
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });

 
  } catch (error) {
    console.error('알림 읽음 처리 중 오류:', error);
    
    return new Response("알림 읽음 처리 중 오류가 발생했습니다.", {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}