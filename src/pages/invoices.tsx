import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { DownloadCloudIcon } from "lucide-react";
import { formatDateTime } from "@/utils/dateTime";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogCreate } from "@/components/dialog-create";
import { httpClient } from "@/services/httpClient";
import { toast } from "react-toastify";

interface ApiResponse {
  data: Array<{
    id: number;
    referenceMonthCode: string;
    referenceYear: number;
    createdAt: string;
    client: {
      clientNumber: string;
    };
    pdfFileName?: string;
  }>;
  filters: {
    clientNumbers: string[];
    years: string[];
  };
}

export default function Invoices() {
  const [clientNumber, setClientNumber] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<ApiResponse | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  async function getInvoices() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (clientNumber) params.append("clientNumber", clientNumber);
      if (year) params.append("year", year);

      const { data } = await httpClient.get(`/invoices?${params.toString()}`);
      setInvoices(data);
    } catch (error) {
      console.error("error", error);
      toast.error("Falha ao carregar faturas");
    } finally {
      setLoading(false);
    }
  }

  const handleDownload = async (invoiceId: number) => {
    try {
      setDownloadingId(invoiceId);

      const response = await httpClient.get(`/energy-bill/${invoiceId}/download`, {
        responseType: "blob",
      });

      const contentDisposition = response.headers["content-disposition"];
      let fileName = `fatura_${invoiceId}.pdf`;

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Falha ao baixar o PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  useEffect(() => {
    getInvoices();
  }, []);

  useEffect(() => {
    if (invoices?.filters) {
      if (!invoices.filters.clientNumbers.includes(clientNumber)) {
        setClientNumber("");
      }
      if (!invoices.filters.years.includes(year) && year !== "") {
        setYear("");
      }
    }
  }, [invoices, clientNumber, year]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Listagem de Faturas</h1>
        <DialogCreate disabled={loading} fetch={getInvoices}/>
      </div>

      <div className="w-full flex flex-row justify-between items-end">
        {/* Filtros (mantido igual) */}
        <div className="flex flex-row gap-6 items-end">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Nº do Cliente</label>
            <Select
              value={clientNumber}
              onValueChange={setClientNumber}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(null)}>Todos os clientes</SelectItem>
                {invoices?.filters.clientNumbers.map((number) => (
                  <SelectItem key={number} value={number}>
                    {number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Ano</label>
            <Select value={year} onValueChange={setYear} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">Todos os anos</SelectItem>
                {invoices?.filters.years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={getInvoices} disabled={loading}>
            Buscar
          </Button>
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={() => {
              setClientNumber("");
              setYear("");
            }}
            disabled={loading}
          >
            Limpar filtros
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Faturas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Cliente</TableHead>
                  <TableHead>Data de registro</TableHead>
                  <TableHead>Mês de referência</TableHead>
                  <TableHead>Download</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices?.data?.length ? (
                  invoices.data.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.client.clientNumber}</TableCell>
                      <TableCell>{formatDateTime(invoice.createdAt)}</TableCell>
                      <TableCell>{invoice.referenceMonthCode}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(invoice.id)}
                          disabled={downloadingId === invoice.id}
                        >
                          <DownloadCloudIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Nenhuma fatura encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
