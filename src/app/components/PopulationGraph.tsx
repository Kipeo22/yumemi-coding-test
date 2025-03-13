import React, { useEffect, useState } from "react";
import { fetchPopulationData } from "../../lib/api";
import { PopulationResponse, PopulationData } from "../../lib/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PopulationGraphProps {
  selectedPrefectures: number[];
  prefectureNames: Record<number, string>;
}

type FormattedData = {
  year: number;
  [key: string]: number | string;
};

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#a4de6c",
  "#d0ed57",
];

const CATEGORIES = ["総人口", "年少人口", "生産年齢人口", "老年人口"];

const PopulationGraph: React.FC<PopulationGraphProps> = ({
  selectedPrefectures,
  prefectureNames,
}) => {
  const [populationData, setPopulationData] = useState<
    Record<number, PopulationResponse>
  >({});
  const [formattedData, setFormattedData] = useState<FormattedData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("総人口"); // 追加

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const newData: Record<number, PopulationResponse> = { ...populationData };

      for (const prefCode of selectedPrefectures) {
        if (!populationData[prefCode]) {
          try {
            const response = (await fetchPopulationData(
              prefCode
            )) as unknown as PopulationResponse;
            newData[prefCode] = response;
          } catch (error) {
            console.error(
              `Failed to fetch data for prefecture ${prefCode}:`,
              error
            );
          }
        }
      }

      setPopulationData(newData);
      setLoading(false);
    };

    if (selectedPrefectures.length > 0) {
      fetchData();
    }
  }, [selectedPrefectures, populationData]);

  useEffect(() => {
    if (Object.keys(populationData).length === 0) {
      setFormattedData([]);
      return;
    }

    const prefPopulation: Record<number, PopulationData[]> = {};

    for (const prefCode of Object.keys(populationData).map(Number)) {
      const prefData = populationData[prefCode];
      if (prefData && prefData.result) {
        const categoryData = prefData.result.data.find(
          (category) => category.label === selectedCategory
        );

        if (categoryData) {
          prefPopulation[prefCode] = categoryData.data;
        }
      }
    }

    const yearDataMap: Record<number, FormattedData> = {};

    Object.entries(prefPopulation).forEach(([, data]) => {
      data.forEach((item) => {
        if (!yearDataMap[item.year]) {
          yearDataMap[item.year] = { year: item.year };
        }
      });
    });

    Object.entries(prefPopulation).forEach(([prefCodeStr, data]) => {
      const numPrefCode = Number(prefCodeStr);
      const prefName =
        prefectureNames[numPrefCode] || `Prefecture ${prefCodeStr}`;

      data.forEach((item) => {
        if (yearDataMap[item.year]) {
          yearDataMap[item.year][prefName] = item.value;
        }
      });
    });

    const formattedArray = Object.values(yearDataMap).sort(
      (a, b) => a.year - b.year
    );
    setFormattedData(formattedArray);
  }, [populationData, prefectureNames, selectedCategory]); // 依存配列に `selectedCategory` を追加

  if (selectedPrefectures.length === 0) {
    return (
      <div
        style={{ textAlign: "center", alignItems: "center", marginTop: "50px" }}
      >
        都道府県を選択してください
      </div>
    );
  }

  if (loading && formattedData.length === 0) {
    return (
      <div
        style={{ textAlign: "center", alignItems: "center", marginTop: "50px" }}
      >
        データを読み込み中...
      </div>
    );
  }

  return (
    <div style={{ margin: "20px 0" }}>
      <h2 style={{ textAlign: "center" }}>都道府県別の人口推移</h2>

      {/* カテゴリー選択用のドロップダウン */}
      <div>
        <label>人口区分:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {formattedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={formattedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              label={{
                value: "年度",
                position: "insideBottomRight",
                offset: -5,
              }}
            />
            <YAxis
              label={{ value: "人口", angle: -90, position: "insideLeft" }}
              width={80}
              tickFormatter={(value) =>
                (value / 10000).toLocaleString() + "万人"
              }
            />
            <Tooltip
              formatter={(value: number) => [value.toLocaleString() + "人"]}
              labelFormatter={(label) => `${label}年`}
            />
            <Legend />
            {selectedPrefectures.map((prefCode, index) => {
              const prefName =
                prefectureNames[prefCode] || `Prefecture ${prefCode}`;
              if (formattedData.some((item) => item[prefName] !== undefined)) {
                return (
                  <Line
                    key={prefCode}
                    type="monotone"
                    dataKey={prefName}
                    stroke={COLORS[index % COLORS.length]}
                    activeDot={{ r: 8 }}
                  />
                );
              }
              return null;
            })}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center">データがありません</div>
      )}
    </div>
  );
};

export default PopulationGraph;
