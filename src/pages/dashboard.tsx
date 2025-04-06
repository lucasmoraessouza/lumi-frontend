import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/utils/formatCurrency";
import { httpClient } from "@/services/httpClient";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [summaryData, setSummaryData] = useState<any>(null);
  const [resultsData, setResultsData] = useState<any>(null);
  async function getSummary() {
    try {
      const { data } = await httpClient.get("/energy/summary");
      setSummaryData(data.data);
    } catch (error) {
      console.error("error", error);
    }
  }

  async function getResults() {
    try {
      const { data }: any = await httpClient.get("/energy/results");
      setResultsData(data);
    } catch (error) {
      console.error("error", error);
    }
  }

  useEffect(() => {
    getSummary();
    getResults();
  }, []);

  const EnergyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-bold text-gray-600">{label}</p>
          <p className="text-[#3b82f6]">
            Consumo Elétrico: <strong>{payload[0].value} kWh</strong>
          </p>
          <p className="text-[#10b981]">
            Energia Compensada: <strong>{payload[1].value} kWh</strong>
          </p>
          <p className="text-gray-600 mt-1">
            Saldo: <strong>{payload[0].value - payload[1].value} kWh</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  const FinancialTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-bold text-gray-600">{label}</p>
          <p className="text-[#6366f1]">
            Valor sem GD: <strong>{formatCurrency(payload[0].value)}</strong>
          </p>
          <p className="text-[#f59e0b]">
            Economia GD: <strong>{formatCurrency(payload[1].value)}</strong>
          </p>
          <p className="text-gray-600 mt-1">
            Valor líquido:{" "}
            <strong>
              {formatCurrency(payload[0].value - payload[1].value)}
            </strong>
          </p>
        </div>
      );
    }
    return null;
  };
  const energyChartData = resultsData?.map((item: any) => ({
    period: item.period,
    "Consumo Elétrico (kWh)": item.energyResults.electricKwh,
    "Energia Compensada (kWh)": item.energyResults.compensatedKwh,
  }));

  const financialChartData = resultsData?.map((item: any) => ({
    period: item.period,
    "Valor sem GD (R$)": item.financialResults.totalWithoutGD,
    "Economia GD (R$)": item.financialResults.gdSavings,
  }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Total Energia Elétrica consumida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {summaryData?._sum?.energyElectricKwh} (kWh)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Total de energia compensada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {summaryData?._sum?.energyCompensatedKwh}(kWh)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Economia por GD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {formatCurrency(summaryData?._sum?.gdSavings)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Valores sem GD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {formatCurrency(summaryData?._sum?.totalValueWithoutGD)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Resultados de Energia */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Resultados de Energia (kWh)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={energyChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barGap={0}
              barCategoryGap={20}
            >
              <XAxis
                dataKey="period"
                tick={{ fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                tick={{ fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <Tooltip content={<EnergyTooltip />} />
              <Legend />
              <Bar
                dataKey="Consumo Elétrico (kWh)"
                fill="#3b82f6"
                name="Consumo Elétrico"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Energia Compensada (kWh)"
                fill="#10b981"
                name="Energia Compensada"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Resultados Financeiros (R$)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={financialChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barGap={0}
              barCategoryGap={20}
            >
              <XAxis dataKey="period" tick={{ fill: "#6b7280" }} />
              <YAxis tick={{ fill: "#6b7280" }} />
              <Tooltip content={<FinancialTooltip />} />
              <Legend />
              <Bar
                dataKey="Valor sem GD (R$)"
                fill="#6366f1"
                name="Valor sem GD"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Economia GD (R$)"
                fill="#f59e0b"
                name="Economia GD"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
