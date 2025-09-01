import type { Lead } from '../entities/Lead';

export interface LeadRepositoryPort {
  save(lead: Lead): Promise<Lead>;
  findById(id: string): Promise<Lead | null>;
  findAll(): Promise<Lead[]>;
  findByClientName(clientName: string): Promise<Lead[]>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
