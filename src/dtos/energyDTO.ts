export interface EnergyFinancialDTO {
  data: {
    period: string;
    year: number;
    clientNumber: string;
    energyResults: {
      electricKwh: number;
      compensatedKwh: number;
      netConsumption: number;
    };
    financialResults: {
      totalWithoutGD: number;
      gdSavings: number;
      netValue: number;
    };
  };
}
