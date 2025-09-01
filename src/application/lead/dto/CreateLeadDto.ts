export interface CreateLeadDto {
  clientName: string;
  projectName: string;
  projectType: string;
  projectScheme: string;
  projectDescription?: string;
  quoteDeliveryDays?: number;
  estimatedQuoteDeliveryDate?: Date;
  progressStatus?: string;
}
