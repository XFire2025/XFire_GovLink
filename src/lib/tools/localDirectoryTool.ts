// src/lib/tools/localDirectoryTool.ts
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

interface Department {
  departmentId: string;
  name: string;
  type: string;
  email: string;
  phone: string;
  address: {
    district: string;
    [key: string]: unknown;
  };
  totalAgents: number;
  activeAgents: number;
  services: string[];
  createdAt: string;
}

interface Agent {
  agentId: string;
  name: string;
  email: string;
  department: string;
  specialization: string;
  languages: string[];
  availableHours: string;
  createdAt: string;
}

interface DirectoryData {
  departments?: Department[];
  agents?: Agent[];
  summary?: {
    totalDepartments: number;
    totalAgents: number;
    activeDepartments: number;
    activeAgents: number;
  };
}

export class LocalDirectoryTool extends DynamicStructuredTool {
  constructor() {
    super({
      name: "local_government_directory",
      description: `Search the official Sri Lankan government directory database containing verified departments and agents.
      USE THIS TOOL FIRST before external searches for any government-related queries.
      This contains current, verified contact information and services from the official government database.
      Perfect for finding department contacts, services, agent information, and district-specific queries.`,
      schema: z.object({
        search: z.string().optional().describe("Search term for departments/agents (name, type, service, district)"),
        district: z.string().optional().describe("Filter by specific district"),
        departmentType: z.string().optional().describe("Filter by department type"),
        includeDepartments: z.boolean().default(true).describe("Include departments in search"),
        includeAgents: z.boolean().default(true).describe("Include agents in search")
      }),
      func: async ({ search, district, departmentType, includeDepartments, includeAgents }) => {
        try {
          const data = await this.fetchDirectoryData(search, district, departmentType, includeDepartments, includeAgents);
          
          if (!data || (!data.departments?.length && !data.agents?.length)) {
            return JSON.stringify({
              success: true,
              source: 'local_government_directory',
              found: false,
              message: `No entries found in the official government directory${search ? ` for "${search}"` : ''}. External search tools may be needed for current web information.`,
              data: null
            });
          }

          // Format the response for the LLM
          const formattedData = this.formatDirectoryData(data);
          
          return JSON.stringify({
            success: true,
            source: 'local_government_directory',
            found: true,
            message: `Found verified government directory information${search ? ` for "${search}"` : ''}. This is official, current data from the government database.`,
            data: formattedData,
            summary: data.summary
          });
        } catch (error) {
          console.error("Error accessing government directory:", error);
          return JSON.stringify({
            success: false,
            source: 'local_government_directory',
            error: "Failed to access government directory",
            message: "Local directory is temporarily unavailable. Please use external search tools as fallback."
          });
        }
      }
    });
  }

  private async fetchDirectoryData(
    search?: string, 
    district?: string, 
    departmentType?: string,
    includeDepartments = true,
    includeAgents = true
  ): Promise<DirectoryData | null> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
      const params = new URLSearchParams();
      
      if (search) params.append('search', search);
      if (district) params.append('district', district);
      if (departmentType) params.append('type', departmentType);
      if (!includeDepartments) params.append('departments', 'false');
      if (!includeAgents) params.append('agents', 'false');

      const url = `${baseUrl}/api/public/directory?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch from government directory API");
        return null;
      }

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error("Error fetching directory data:", error);
      return null;
    }
  }

  private formatDirectoryData(data: DirectoryData): {
    departments: Array<{
      name: string;
      type: string;
      contact: string;
      services: string[];
      location: string;
      agents: number;
    }>;
    agents: Array<{
      name: string;
      department: string;
      specialization: string;
      contact: string;
      languages: string[];
    }>;
  } {
    const formattedDepartments = (data.departments || []).map(dept => ({
      name: dept.name,
      type: dept.type,
      contact: `Phone: ${dept.phone}, Email: ${dept.email}`,
      services: dept.services || [],
      location: dept.address?.district || 'Not specified',
      agents: dept.activeAgents || 0
    }));

    const formattedAgents = (data.agents || []).map(agent => ({
      name: agent.name,
      department: agent.department,
      specialization: agent.specialization,
      contact: `Email: ${agent.email}`,
      languages: agent.languages || []
    }));

    return {
      departments: formattedDepartments,
      agents: formattedAgents
    };
  }
}

export function createLocalDirectoryTool(): LocalDirectoryTool {
  return new LocalDirectoryTool();
}
