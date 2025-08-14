// Agent Authentication Exports
export { default as AgentAuthService } from './agent-auth-service';
export type { AgentLoginData, AgentTokens, AgentAuthResult } from './agent-auth-service';

export {
  agentAuthRateLimit,
  authenticateAgent,
  authorizeAgentDepartment,
  authorizeAgentDistrict
} from './agent-middleware';

export {
  useAgentAuth,
  useAgentDepartmentAuth,
  useAgentDistrictAuth
} from './useAgentAuthUtils';
