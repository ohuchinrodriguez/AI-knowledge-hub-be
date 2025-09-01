import { injectable } from 'tsyringe';
import type { LeadRepositoryPort } from '../../../domain/lead/repositories/LeadRepositoryPort';
import { Lead, LeadStatus } from '../../../domain/lead/entities/Lead';
import { ProjectType } from '../../../domain/lead/value-objects/ProjectType';
import { ProjectScheme } from '../../../domain/lead/value-objects/ProjectScheme';

@injectable()
export class InMemoryLeadRepository implements LeadRepositoryPort {
  private leads: Map<string, Lead> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Mock data para testing
    const mockLeads = [
      {
        id: '1',
        clientName: 'Crafty Creations Inc.',
        projectName: 'E-commerce for Artisans',
        projectType: 'E-commerce',
        projectScheme: 'Fixed Price',
        projectDescription: 'Online marketplace for handmade crafts and artisan products',
        quoteDeliveryDays: 3,
        estimatedQuoteDeliveryDate: new Date('2024-02-10'),
        progressStatus: 'In Progress',
        status: LeadStatus.PROJECT_DEVELOPMENT,
        createdAt: new Date('2024-01-15T10:30:00Z'),
        updatedAt: new Date('2024-01-20T14:45:00Z')
      },
      {
        id: '2',
        clientName: 'FitLife Solutions',
        projectName: 'Fitness Mobile App',
        projectType: 'Mobile App',
        projectScheme: 'Dedicated Team',
        projectDescription: 'Comprehensive fitness tracking and workout planning mobile application',
        quoteDeliveryDays: 5,
        estimatedQuoteDeliveryDate: new Date('2024-02-15'),
        progressStatus: 'In Progress',
        status: LeadStatus.TECHNICAL_MEETING,
        createdAt: new Date('2024-01-18T09:15:00Z'),
        updatedAt: new Date('2024-01-22T11:30:00Z')
      },
      {
        id: '3',
        clientName: 'Digital Edge Marketing',
        projectName: 'Marketing Agency Website Redesign',
        projectType: 'Web Design',
        projectScheme: 'Fixed Price',
        projectDescription: 'Complete website redesign with modern UI/UX and CMS integration',
        quoteDeliveryDays: 2,
        estimatedQuoteDeliveryDate: new Date('2024-02-08'),
        progressStatus: 'Completed',
        status: LeadStatus.PENDING_INFORMATION,
        createdAt: new Date('2024-01-20T16:20:00Z'),
        updatedAt: new Date('2024-01-25T13:10:00Z')
      },
      {
        id: '4',
        clientName: 'SalesBoost Corp.',
        projectName: 'CRM for Sales Team',
        projectType: 'Custom Software',
        projectScheme: 'Dedicated Team',
        projectDescription: 'Custom CRM system with advanced analytics and reporting features',
        quoteDeliveryDays: 4,
        estimatedQuoteDeliveryDate: new Date('2024-02-12'),
        progressStatus: 'In Progress',
        status: LeadStatus.ESTIMATION_PROCESS,
        createdAt: new Date('2024-01-22T08:45:00Z'),
        updatedAt: new Date('2024-01-26T10:20:00Z')
      },
      {
        id: '5',
        clientName: 'Data Insights LLC',
        projectName: 'Data Analysis Tool',
        projectType: 'Web Design',
        projectScheme: 'Fixed Price',
        projectDescription: 'Interactive dashboard for data visualization and business intelligence',
        quoteDeliveryDays: 6,
        estimatedQuoteDeliveryDate: new Date('2024-02-18'),
        progressStatus: 'Not Started',
        status: LeadStatus.CREATE_PRESENTATION,
        createdAt: new Date('2024-01-25T12:00:00Z'),
        updatedAt: new Date('2024-01-28T15:30:00Z')
      },
      {
        id: '6',
        clientName: 'EcoTech Innovations',
        projectName: 'Sustainability Tracker App',
        projectType: 'Mobile App',
        projectScheme: 'Fixed Price',
        projectDescription: 'Mobile app to track and gamify sustainable lifestyle choices',
        quoteDeliveryDays: 7,
        estimatedQuoteDeliveryDate: new Date('2024-02-20'),
        progressStatus: 'In Progress',
        status: LeadStatus.WAITING_FOR_FEEDBACK,
        createdAt: new Date('2024-01-28T14:15:00Z'),
        updatedAt: new Date('2024-01-30T09:45:00Z')
      },
      {
        id: '7',
        clientName: 'HealthCare Plus',
        projectName: 'Patient Management System',
        projectType: 'Custom Software',
        projectScheme: 'Dedicated Team',
        projectDescription: 'Comprehensive patient management and appointment scheduling system',
        quoteDeliveryDays: 8,
        estimatedQuoteDeliveryDate: new Date('2024-02-25'),
        progressStatus: 'On Hold',
        status: LeadStatus.START_PROJECT,
        createdAt: new Date('2024-01-30T11:30:00Z'),
        updatedAt: new Date('2024-02-01T16:20:00Z')
      },
      {
        id: '8',
        clientName: 'RetailMax Solutions',
        projectName: 'Inventory Management Portal',
        projectType: 'Web Design',
        projectScheme: 'Fixed Price',
        projectDescription: 'Web-based inventory management system with real-time tracking',
        quoteDeliveryDays: 5,
        estimatedQuoteDeliveryDate: new Date('2024-02-14'),
        progressStatus: 'Completed',
        status: LeadStatus.FINISH_PROJECT,
        createdAt: new Date('2024-01-10T13:45:00Z'),
        updatedAt: new Date('2024-02-02T10:15:00Z')
      },
      {
        id: '9',
        clientName: 'StartupHub Ventures',
        projectName: 'Investor Platform',
        projectType: 'Custom Software',
        projectScheme: 'Dedicated Team',
        projectDescription: 'Platform connecting startups with potential investors',
        quoteDeliveryDays: 10,
        estimatedQuoteDeliveryDate: new Date('2024-03-01'),
        progressStatus: 'Cancelled',
        status: LeadStatus.LOST_PROJECT,
        createdAt: new Date('2024-01-12T07:20:00Z'),
        updatedAt: new Date('2024-01-28T14:30:00Z')
      },
      {
        id: '10',
        clientName: 'EduTech Academy',
        projectName: 'Learning Management System',
        projectType: 'Web Design',
        projectScheme: 'Fixed Price',
        projectDescription: 'Online learning platform with course management and student tracking',
        quoteDeliveryDays: 9,
        estimatedQuoteDeliveryDate: new Date('2024-02-28'),
        progressStatus: 'In Progress',
        status: LeadStatus.GARANTIA,
        createdAt: new Date('2024-01-05T15:10:00Z'),
        updatedAt: new Date('2024-02-03T12:40:00Z')
      }
    ];

    mockLeads.forEach(mockLead => {
      const lead = new Lead(
        mockLead.id,
        mockLead.clientName,
        mockLead.projectName,
        ProjectType.fromString(mockLead.projectType),
        ProjectScheme.fromString(mockLead.projectScheme),
        mockLead.createdAt,
        mockLead.updatedAt,
        mockLead.projectDescription,
        mockLead.quoteDeliveryDays,
        mockLead.estimatedQuoteDeliveryDate,
        mockLead.progressStatus,
        mockLead.status
      );
      this.leads.set(mockLead.id, lead);
    });
  }

  public async save(lead: Lead): Promise<Lead> {
    this.leads.set(lead.id, lead);
    return lead;
  }

  public async findById(id: string): Promise<Lead | null> {
    return this.leads.get(id) || null;
  }

  public async findAll(): Promise<Lead[]> {
    return Array.from(this.leads.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  public async findByClientName(clientName: string): Promise<Lead[]> {
    const allLeads = Array.from(this.leads.values());
    return allLeads
      .filter(lead => lead.clientName.toLowerCase().includes(clientName.toLowerCase()))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public async delete(id: string): Promise<void> {
    this.leads.delete(id);
  }

  public async exists(id: string): Promise<boolean> {
    return this.leads.has(id);
  }

  // Métodos adicionales para desarrollo local
  public clear(): void {
    this.leads.clear();
  }

  public size(): number {
    return this.leads.size;
  }
}
