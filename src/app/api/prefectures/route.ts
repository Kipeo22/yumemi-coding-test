import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL: string = process.env.RESAS_BASE_URL || "";
const API_KEY: string = process.env.API_KEY || "";

// サーバーサイドでAPIを呼び出す
export async function GET() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/prefectures`, {
      headers: {
        "X-API-KEY": API_KEY,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to fetch prefectures:", error);
    return NextResponse.json(
      { error: "Failed to fetch prefectures" },
      { status: 500 }
    );
  }
}
