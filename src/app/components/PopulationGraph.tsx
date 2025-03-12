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

const PopulationGraph: React.FC<PopulationGraphProps> = ({
  selectedPrefectures,
  prefectureNames,
}) => {
  const [populationData, setPopulationData] = useState<
    Record<number, PopulationResponse>
  >({});
  const [formattedData, setFormattedData] = useState<FormattedData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch population data for selected prefectures
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const newData: Record<number, PopulationResponse> = { ...populationData };

      // Fetch data for prefectures that haven't been loaded yet
      for (const prefCode of selectedPrefectures) {
        if (!populationData[prefCode]) {
          try {
            // 修正：型を PopulationResponse として明示的に指定
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
  }, [selectedPrefectures, populationData]); // 修正：依存配列に populationData を追加

  // Format data for recharts when populationData changes
  useEffect(() => {
    if (Object.keys(populationData).length === 0) {
      setFormattedData([]);
      return;
    }

    // Find total population data for each prefecture
    const prefTotalPopulation: Record<number, PopulationData[]> = {};

    for (const prefCode of Object.keys(populationData).map(Number)) {
      const prefData = populationData[prefCode];
      if (prefData && prefData.result) {
        // Find the "総人口" (total population) category
        const totalPopCategory = prefData.result.data.find(
          (category) => category.label === "総人口"
        );

        if (totalPopCategory) {
          prefTotalPopulation[prefCode] = totalPopCategory.data;
        }
      }
    }

    // Create formatted data for the chart
    const yearDataMap: Record<number, FormattedData> = {};

    // Initialize with years from all prefectures
    Object.entries(prefTotalPopulation).forEach(([, data]) => {
      // 修正：使用しない変数は空のデストラクチャリングで対応
      data.forEach((item) => {
        if (!yearDataMap[item.year]) {
          yearDataMap[item.year] = { year: item.year };
        }
      });
    });

    // Add population data for each prefecture
    Object.entries(prefTotalPopulation).forEach(([prefCodeStr, data]) => {
      const numPrefCode = Number(prefCodeStr);
      const prefName =
        prefectureNames[numPrefCode] || `Prefecture ${prefCodeStr}`;

      data.forEach((item) => {
        if (yearDataMap[item.year]) {
          yearDataMap[item.year][prefName] = item.value;
        }
      });
    });

    // Convert to array and sort by year
    const formattedArray = Object.values(yearDataMap).sort(
      (a, b) => a.year - b.year
    );
    setFormattedData(formattedArray);
  }, [populationData, prefectureNames]);

  if (selectedPrefectures.length === 0) {
    return <div className="mt-8 text-center">都道府県を選択してください</div>;
  }

  if (loading && formattedData.length === 0) {
    return <div className="mt-8 text-center">データを読み込み中...</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">都道府県別の人口推移</h2>
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
              // Only create a line if we have data for this prefecture
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
