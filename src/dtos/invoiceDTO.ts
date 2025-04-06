export interface InvoiceDTO {
  id: number;
  referenceMonthCode: string;
  referenceYear: string;
  createdAt: string;
  client: {
    clientNumber: string;
  };
}
