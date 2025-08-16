// src/lib/ragAgent.ts
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { TavilySearch, TavilyCrawl, TavilyExtract } from "@langchain/tavily";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { createLocalDirectoryTool } from "./tools/localDirectoryTool";

interface SearchResult {
  url: string;
  title?: string;
  content?: string;
  snippet?: string;
}

interface DepartmentContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  services: string[];
  source?: string;
}

// Government service categories for dynamic contact discovery
const GOVERNMENT_SERVICE_CATEGORIES = {
  passport: {
    keywords: ["passport", "immigration", "emigration", "visa", "travel document"],
    searchTerms: ["Department of Immigration contact details Sri Lanka", "passport office Sri Lanka contact"]
  },
  business: {
    keywords: ["business registration", "company formation", "trade license", "commercial"],
    searchTerms: ["Registrar of Companies Sri Lanka contact", "business registration office Sri Lanka"]
  },
  marriage: {
    keywords: ["marriage certificate", "birth certificate", "death certificate", "civil registration"],
    searchTerms: ["Registrar General Sri Lanka contact", "civil registration office Sri Lanka"]
  },
  driving: {
    keywords: ["driving license", "vehicle registration", "motor traffic", "driving permit"],
    searchTerms: ["Department of Motor Traffic Sri Lanka contact", "driving license office Sri Lanka"]
  },
  tax: {
    keywords: ["income tax", "VAT", "tax registration", "inland revenue", "taxation"],
    searchTerms: ["Inland Revenue Department Sri Lanka contact", "tax office Sri Lanka"]
  },
  health: {
    keywords: ["health services", "medical certificate", "healthcare", "hospital", "clinic"],
    searchTerms: ["Ministry of Health Sri Lanka contact", "health department Sri Lanka"]
  },
  education: {
    keywords: ["school admission", "education certificate", "scholarship", "university"],
    searchTerms: ["Ministry of Education Sri Lanka contact", "education department Sri Lanka"]
  },
  agriculture: {
    keywords: ["farming permit", "agricultural subsidy", "land use", "agriculture"],
    searchTerms: ["Ministry of Agriculture Sri Lanka contact", "agriculture department Sri Lanka"]
  },
  finance: {
    keywords: ["government finance", "budget", "treasury", "public expenditure"],
    searchTerms: ["Ministry of Finance Sri Lanka contact", "treasury Sri Lanka"]
  },
  lands: {
    keywords: ["land title", "land registration", "property deed", "land permit"],
    searchTerms: ["Ministry of Lands Sri Lanka contact", "land registry Sri Lanka"]
  }
};

export class SriLankanGovRAGAgent {
  private model: ChatOpenAI;
  private tavilySearch: TavilySearch;
  private tavilyCrawl: TavilyCrawl;
  private tavilyExtract: TavilyExtract;
  private memorySaver: MemorySaver;
  private graph!: ReturnType<typeof createReactAgent>;

  constructor() {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const tavilyApiKey = process.env.TAVILY_API_KEY;

    if (!openaiApiKey || !tavilyApiKey) {
      throw new Error("API keys for OpenAI and Tavily must be set in environment variables.");
    }

    // Initialize OpenAI model
    this.model = new ChatOpenAI({
      modelName: "gpt-4o",
      openAIApiKey: openaiApiKey,
    });

    // Initialize Tavily tools
    this.tavilySearch = new TavilySearch({
      maxResults: 8,
      searchDepth: "advanced",
    });

    this.tavilyCrawl = new TavilyCrawl({
      maxDepth: 2,
      maxBreadth: 4,
    });

    this.tavilyExtract = new TavilyExtract({
      includeImages: false,
    });

    // Initialize memory saver for conversation context
    this.memorySaver = new MemorySaver();

    // Build the agent graph
    this.buildGraph();
  }

  private buildGraph() {
    // Define tools for the agent - LOCAL DIRECTORY FIRST, then external tools
    const tools = [
      createLocalDirectoryTool(), // PRIORITY: Use local government directory first
      this.tavilySearch,
      this.tavilyCrawl,
      this.tavilyExtract,
    ];

    // Create the react agent with tools enabled
    this.graph = createReactAgent({
      llm: this.model,
      tools,
      checkpointSaver: this.memorySaver,
      messageModifier: this.getSystemPrompt(),
    });
  }

  private getSystemPrompt(): string {
    return `You are a specialized AI assistant for Sri Lankan government services. Your role is to:

1. **Provide accurate and current information** about Sri Lankan government services, procedures, and requirements
2. **Find and verify current contact details** using available search and extraction tools
3. **Recommend relevant government departments** based on user queries
4. **Provide step-by-step guidance** for government procedures
5. **Include processing times, fees, and required documents** when available
6. **You are to avoid answering any other questions that are not related to requesting information about the government or government services**. You should politely decline that your purpose is not to answer on such a question but government related queries

**AVAILABLE TOOLS (USE IN ORDER OF PRIORITY):**
1. **local_government_directory** [HIGHEST PRIORITY] - Official verified government database with current departments and agents
2. **tavily_search** - External search for current web information
3. **tavily_crawl** - Deep crawl of government websites 
4. **tavily_extract** - Extract specific information from websites

**MANDATORY SEARCH STRATEGY:**
1. **ALWAYS START** with local_government_directory for ANY government-related query. If asked for the available departmets, services, and support agents or government personnel do the same as well.
2. **ONLY IF** local directory doesn't have sufficient information, then use external tools
3. When using external tools, prioritize official .gov.lk domains
4. **CLEARLY INDICATE** when information comes from verified local database vs external sources

**RESPONSE REQUIREMENTS:**
- **For Local Directory Results**: Present as authoritative, verified government information
- **For External Sources**: Add disclaimer: "⚠️ The following information is provided as a stop-gap measure during the development of the webservice and the government information database/knowledgebase/directory. Please verify with official sources."

**IMPORTANT GUIDELINES:**
- Always search local directory FIRST before any external tools
- For local directory results, indicate they are from "Official Government Database"
- Extract and provide accurate contact information including:
  - Phone numbers (format: +94 XX XXX XXXX)
  - Email addresses
  - Physical addresses
  - Office hours
  - Department types and services
- If local directory has partial info, supplement with external search but clearly distinguish sources
- Verify information from multiple sources when possible

**OUTPUT FORMAT:**
Structure your responses in markdown format with:
1. **Source Indicator** (Official Database vs External Web Search)
2. Direct answer to the query
3. Step-by-step procedures (if applicable)
4. Required documents
5. Fees and processing times
6. Current contact information (with source verification)
7. Relevant website links

**Data Source Labeling:**
- 🏛️ **Official Government Database**: For local_government_directory results
- 🌐 **External Web Search**: For tavily tool results (with disclaimer)

Always prioritize and clearly distinguish between verified local database information and external web sources.`;
  }

  public async processQuery(
    query: string,
    sessionId: string = "default"
  ): Promise<{
    response: string;
    searchResults: SearchResult[];
    departmentContacts: DepartmentContact[];
    sources: string[];
    sessionId: string;
  }> {
    try {
      // Enhance query with Sri Lankan government context
      const enhancedQuery = this.enhanceQueryForSriLanka(query);

      // Collect search results and sources during the process
      const searchResults: SearchResult[] = [];
      const sources: string[] = [];

      
      let result;
      try {
        result = await this.graph.invoke(
          {
            messages: [new HumanMessage(enhancedQuery)],
          },
          {
            configurable: { thread_id: sessionId },
            recursionLimit: 20
          }
        );
      } catch (error) {
        // If recursion limit is hit, handle below
        throw error;
      }

      // Extract relevant department contacts based on query using dynamic search
      const { contacts: relevantContacts, searchResults: contactSearchResults } = 
        await this.findRelevantDepartmentsDynamically(query);

      // Add contact search results to our collection
      searchResults.push(...contactSearchResults);

      // Add some relevant Sri Lankan government websites as sources
      // const governmentSources = this.getRelevantGovernmentSources(query);
      // sources.push(...governmentSources);

      // Extract sources from search results
      const extractedSources = this.extractSources(searchResults);
      sources.push(...extractedSources);

      // Remove duplicates from sources
      const uniqueSources = Array.from(new Set(sources));

      // Get the last AI message
      const lastMessage = result.messages[result.messages.length - 1];
      const response = typeof lastMessage.content === 'string' ? lastMessage.content : 'Unable to process response';

      return {
        response,
        searchResults,
        departmentContacts: relevantContacts,
        sources: uniqueSources,
        sessionId,
      };
    } catch (error) {
      console.error("Error processing query:", error);
      
      // Handle recursion errors gracefully
      if (error instanceof Error && error.message.includes('Recursion limit')) {
        console.log("Falling back to partial results due to recursion limit");

        // Try to use whatever tool results and sources were collected so far
        let partialResponse = "";

        // Try to get any search results and department contacts
        const { contacts: relevantContacts, searchResults: contactSearchResults } = 
          await this.findRelevantDepartmentsDynamically(query);

        // Add relevant government sources even in fallback mode
        // const governmentSources = this.getRelevantGovernmentSources(query);
        const extractedSources = this.extractSources(contactSearchResults);
        const uniqueSources = Array.from(new Set([...extractedSources])); // ...governmentSources

        // Add department contacts if any
        if (relevantContacts.length > 0) {
          partialResponse += "**Relevant Department Contacts:**\n";
          relevantContacts.forEach(contact => {
            partialResponse += `- ${contact.name} | Phone: ${contact.phone} | Email: ${contact.email} | Website: ${contact.website}\n`;
          });
          partialResponse += "\n";
        }

        // Add sources if any
        if (uniqueSources.length > 0) {
          partialResponse += "**Sources:**\n";
          uniqueSources.forEach(src => {
            partialResponse += `- ${src}\n`;
          });
        }

        // Add a general fallback LLM response for context
        const fallbackResponse = await this.getFallbackResponse(query);
        partialResponse += `\n${fallbackResponse}`;

        return {
          response: partialResponse,
          searchResults: contactSearchResults,
          departmentContacts: relevantContacts,
          sources: uniqueSources,
          sessionId,
        };
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to process query: ${errorMessage}`);
    }
  }

  private async getFallbackResponse(query: string): Promise<string> {
    try {
      // Use OpenAI directly without tools for fallback
      const fallbackModel = new ChatOpenAI({
        modelName: "gpt-4o",
        
        openAIApiKey: process.env.OPENAI_API_KEY,
      });

      const response = await fallbackModel.invoke([
        new HumanMessage(`You are a helpful assistant for Sri Lankan government services. 
        Please provide information about: ${query}
        
        If you don't have specific current information, provide general guidance and suggest contacting relevant government departments.
        Keep your response helpful and informative.`)
      ]);

      return typeof response.content === 'string' ? response.content : 'Please contact the relevant government department for assistance.';
    } catch (error) {
      console.error("Error in fallback response:", error);
      return `I apologize, but I'm experiencing technical difficulties. For information about "${query}", please visit the official Sri Lanka government portal at https://gov.lk or call 1919 for government information services.`;
    }
  }

  private enhanceQueryForSriLanka(query: string): string {
    return `${query}`;
  }

  private getRelevantGovernmentSources(query: string): string[] {
    const lowercaseQuery = query.toLowerCase();
    const sources: string[] = [];

    // Add general Sri Lankan government portal
    sources.push("https://gov.lk");

    // Add specific government websites based on query content
    if (lowercaseQuery.includes('passport') || lowercaseQuery.includes('immigration') || lowercaseQuery.includes('visa')) {
      sources.push("https://immigration.gov.lk");
    }

    if (lowercaseQuery.includes('business') || lowercaseQuery.includes('company') || lowercaseQuery.includes('registration')) {
      sources.push("https://registrar-companies.gov.lk");
      sources.push("https://doc.gov.lk");
    }

    if (lowercaseQuery.includes('tax') || lowercaseQuery.includes('revenue') || lowercaseQuery.includes('vat')) {
      sources.push("https://ird.gov.lk");
      sources.push("https://ird.gov.lk/en/publications/Pages/Tax-Guides.aspx");
    }

    if (lowercaseQuery.includes('marriage') || lowercaseQuery.includes('birth') || lowercaseQuery.includes('death') || lowercaseQuery.includes('certificate')) {
      sources.push("https://rgd.gov.lk");
    }

    if (lowercaseQuery.includes('driving') || lowercaseQuery.includes('license') || lowercaseQuery.includes('vehicle')) {
      sources.push("https://transport.gov.lk");
      sources.push("https://dmt.gov.lk");
    }

    if (lowercaseQuery.includes('health') || lowercaseQuery.includes('medical')) {
      sources.push("https://health.gov.lk");
      sources.push("https://epid.gov.lk"); // Epidemiology Unit
    }

    if (lowercaseQuery.includes('education') || lowercaseQuery.includes('school') || lowercaseQuery.includes('university')) {
      sources.push("https://moe.gov.lk");
      sources.push("https://nie.lk"); // National Institute of Education
    }

    if (lowercaseQuery.includes('agriculture') || lowercaseQuery.includes('farming') || lowercaseQuery.includes('land')) {
      sources.push("https://agrimin.gov.lk");
      sources.push("https://doa.gov.lk"); // Department of Agriculture
    }

    if (lowercaseQuery.includes('finance') || lowercaseQuery.includes('budget') || lowercaseQuery.includes('treasury')) {
      sources.push("https://treasury.gov.lk");
      sources.push("https://cbsl.gov.lk"); // Central Bank
    }

    if (lowercaseQuery.includes('land') || lowercaseQuery.includes('property') || lowercaseQuery.includes('deed')) {
      sources.push("https://landmin.gov.lk");
      sources.push("https://survey.gov.lk"); // Survey Department
    }

    // Add Parliament and legal information for general governance queries
    if (lowercaseQuery.includes('law') || lowercaseQuery.includes('legal') || lowercaseQuery.includes('parliament')) {
      sources.push("https://parliament.lk");
      sources.push("https://lawnet.gov.lk");
    }

    // Add general information sources
    sources.push("https://www.news.lk"); // Government News Portal
    sources.push("https://www.gov.lk/welcome.html");

    return sources;
  }

  private async findRelevantDepartmentsDynamically(query: string): Promise<{
    contacts: DepartmentContact[];
    searchResults: SearchResult[];
  }> {
    const lowercaseQuery = query.toLowerCase();
    const relevantContacts: DepartmentContact[] = [];
    const searchResults: SearchResult[] = [];

    try {
      // Check if TAVILY_API_KEY is available
      if (!process.env.TAVILY_API_KEY) {
        console.warn("TAVILY_API_KEY not found, using fallback contacts");
        return {
          contacts: this.getFallbackContacts(query),
          searchResults: []
        };
      }

      // Determine which service category this query falls into
      const serviceCategory = this.categorizeQuery(lowercaseQuery);
      
      if (serviceCategory) {
        // Search for current contact information for this service category
        for (const searchTerm of serviceCategory.searchTerms.slice(0, 3)) { // Limit to first 3 search terms
          try {
            console.log(`Searching for: ${searchTerm}`);
            const searchResult = await this.tavilySearch.invoke({ query: searchTerm });
            
            if (searchResult && Array.isArray(searchResult)) {
              // Add search results to our collection
              searchResults.push(...searchResult.map(result => ({
                url: result.url || '',
                title: result.title || '',
                content: result.content || result.snippet || '',
                snippet: result.snippet || ''
              })));

              for (const result of searchResult) {
                // Extract contact information from search results
                const contact = this.extractContactFromSearchResult(result, serviceCategory);
                if (contact) {
                  relevantContacts.push(contact);
                  break; // Found a contact for this category, move to next
                }
              }
            }
            break; // Only try first search term to avoid API rate limits
          } catch (error) {
            console.error(`Error searching for ${searchTerm}:`, error);
            // Don't continue with more searches if API is failing
            break;
          }
        }
      }

      // If no specific contacts found or API failed, use fallback
      if (relevantContacts.length === 0) {
        return {
          contacts: this.getFallbackContacts(query),
          searchResults
        };
      }

    } catch (error) {
      console.error("Error in dynamic contact discovery:", error);
      return {
        contacts: this.getFallbackContacts(query),
        searchResults
      };
    }

    return {
      contacts: relevantContacts,
      searchResults
    };
  }

  private getFallbackContacts(query: string): DepartmentContact[] {
    const lowercaseQuery = query.toLowerCase();
    
    // Provide relevant fallback contacts based on query keywords
    if (lowercaseQuery.includes('passport') || lowercaseQuery.includes('immigration')) {
      return [{
        id: "immigration",
        name: "Department of Immigration and Emigration",
        phone: "+94 11 532 9200",
        email: "info@immigration.gov.lk",
        website: "https://immigration.gov.lk",
        address: "41, Ananda Rajakaruna Mawatha, Colombo 10",
        services: ["passport services", "visa services", "immigration"],
      }];
    }
    
    if (lowercaseQuery.includes('business') || lowercaseQuery.includes('company')) {
      return [{
        id: "roc",
        name: "Registrar of Companies",
        phone: "+94 11 234 7891",
        email: "info@registrar-companies.gov.lk",
        website: "https://registrar-companies.gov.lk",
        address: "P.O. Box 596, Colombo",
        services: ["business registration", "company formation"],
      }];
    }
    
    if (lowercaseQuery.includes('tax') || lowercaseQuery.includes('revenue')) {
      return [{
        id: "ird",
        name: "Inland Revenue Department",
        phone: "+94 11 247 8200",
        email: "info@ird.gov.lk",
        website: "https://ird.gov.lk",
        address: "P.O. Box 515, Colombo",
        services: ["income tax", "VAT", "tax registration"],
      }];
    }
    
    // Default fallback
    return [{
      id: "general",
      name: "Sri Lanka Government Information Center",
      phone: "1919",
      email: "info@gov.lk",
      website: "https://gov.lk",
      address: "Government Information Center, Sri Lanka",
      services: ["general government information", "directory services"],
    }];
  }

  private categorizeQuery(query: string): { keywords: string[], searchTerms: string[] } | null {
    for (const category of Object.values(GOVERNMENT_SERVICE_CATEGORIES)) {
      if (category.keywords.some(keyword => query.includes(keyword.toLowerCase()))) {
        return category;
      }
    }
    return null;
  }

  private extractContactFromSearchResult(
    result: SearchResult, 
    serviceCategory: { keywords: string[], searchTerms: string[] } | null
  ): DepartmentContact | null {
    try {
      if (!result || typeof result !== 'object') return null;

      // Extract information from the search.
      const title = result.title || "";
      const content = result.content || result.snippet || "";
      const url = result.url || "";

      // Try to extract contact information from the content
      const phoneMatch = content.match(/\+94[\s\d\-()]+/g)?.[0];
      const emailMatch = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)?.[0];
      
      // Determine department name
      let departmentName = title;
      if (serviceCategory) {
        const categoryName = serviceCategory.keywords[0];
        if (!departmentName.toLowerCase().includes(categoryName)) {
          departmentName = `${title} (${categoryName} services)`;
        }
      }

      return {
        id: this.generateContactId(departmentName),
        name: departmentName,
        phone: phoneMatch || "Contact via website",
        email: emailMatch || "Contact via website",
        website: url,
        address: "Contact department for address details",
        services: serviceCategory ? serviceCategory.keywords : ["government services"],
      };
    } catch (error) {
      console.error("Error extracting contact from search result:", error);
      return null;
    }
  }

  private generateContactId(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 20);
  }

  private extractSources(searchResults: SearchResult[]): string[] {
    const sources = new Set<string>();
    
    searchResults.forEach(result => {
      if (result.url) {
        sources.add(result.url);
      }
    });

    return Array.from(sources);
  }

  public async getChatHistory(sessionId: string): Promise<BaseMessage[]> {
    try {
      const config = { configurable: { thread_id: sessionId } };
      const checkpoint = await this.memorySaver.get(config);
      
      if (checkpoint && checkpoint.channel_values && Array.isArray(checkpoint.channel_values.messages)) {
        return checkpoint.channel_values.messages as BaseMessage[];
      }
      
      return [];
    } catch (error) {
      console.error("Error retrieving chat history:", error);
      return [];
    }
  }

  public async clearChatHistory(sessionId: string): Promise<void> {
    // For now, we'll create a new session for clearing history
    // This is a limitation of the current MemorySaver implementation
    console.log(`Chat history for session ${sessionId} will be cleared on next interaction`);
  }
}

// Lazy singleton pattern - only create instance when needed
let agentInstance: SriLankanGovRAGAgent | null = null;

// Export a function that returns the shared instance (lazy initialization)
export function getSriLankanGovRAGAgent() {
  if (!agentInstance) {
    agentInstance = new SriLankanGovRAGAgent();
  }
  return agentInstance;
}
