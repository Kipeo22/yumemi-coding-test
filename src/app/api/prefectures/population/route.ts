import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL: string = process.env.RESAS_BASE_URL || "";
const API_KEY: string = process.env.API_KEY || "";

export async function GET(req: Request) {
  try {
    // クエリパラメータから prefCode を取得
    const { searchParams } = new URL(req.url);
    const prefCode = searchParams.get("prefCode");

    if (!prefCode) {
      return NextResponse.json(
        { error: "Missing prefCode parameter" },
        { status: 400 }
      );
    }

    // RESAS API で都道府県の人口データを取得
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/population/composition/perYear`,
      {
        headers: { "X-API-KEY": API_KEY },
        params: { prefCode, cityCode: "-" },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to fetch population data:", error);
    return NextResponse.json(
      { error: "Failed to fetch population data" },
      { status: 500 }
    );
  }
}
