"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  AlertCircle,
  UserCog,
  FileText,
  Clock,
  // CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";
import { useAdminAuth } from '@/lib/auth/AdminAuthContext';


// Enhanced Dashboard Stats Component (following agent dashboard design)
const DashboardStats = () => {
  const { getAuthHeaders } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Array<{ title: string; value: string; change: string; trend: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; color: string; bgColor: string }>>([]);

  const fetchStats = React.useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, agentsRes, pendingRes] = await Promise.all([
        fetch('/api/admin/users?limit=1', { credentials: 'include', headers: getAuthHeaders() }),
        fetch('/api/admin/agents?limit=1', { credentials: 'include', headers: getAuthHeaders() }),
        fetch('/api/admin/users?status=pending&limit=1', { credentials: 'include', headers: getAuthHeaders() }),
      ]);

      const [usersJson, agentsJson, pendingJson] = await Promise.all([
        usersRes.ok ? usersRes.json() : Promise.resolve({ total: 0 }),
        agentsRes.ok ? agentsRes.json() : Promise.resolve({ total: 0 }),
        pendingRes.ok ? pendingRes.json() : Promise.resolve({ total: 0 }),
      ]);

      const totalUsers = usersJson.total ?? 0;
      const totalAgents = agentsJson.total ?? 0;
      const pendingVerifications = pendingJson.total ?? 0;

      let systemAlerts = 0;
      try {
        const alertsRes = await fetch('/api/debug/alerts', { credentials: 'include', headers: getAuthHeaders() });
        if (alertsRes.ok) {
          const a = await alertsRes.json();
          systemAlerts = Array.isArray(a?.alerts) ? a.alerts.length : (a?.count ?? 0);
        }
      } catch {
        // ignore missing endpoint
      }

      const computed = [
        {
          title: 'Total Users',
          value: totalUsers.toLocaleString(),
          change: '',
          trend: 'up',
          icon: Users,
          color: '#8D153A',
          bgColor: 'from-[#8D153A]/10 to-[#8D153A]/5',
        },
        {
          title: 'Active Agents',
          value: totalAgents.toLocaleString(),
          change: '',
          trend: 'up',
          icon: UserCog,
          color: '#008060',
          bgColor: 'from-[#008060]/10 to-[#008060]/5',
        },
        {
          title: 'Pending Verifications',
          value: pendingVerifications.toLocaleString(),
          change: '',
          trend: pendingVerifications > 0 ? 'down' : 'up',
          icon: UserCheck,
          color: '#FFC72C',
          bgColor: 'from-[#FFC72C]/10 to-[#FFC72C]/5',
        },
        {
          title: 'System Alerts',
          value: systemAlerts.toString(),
          change: '',
          trend: systemAlerts > 0 ? 'up' : 'down',
          icon: AlertCircle,
          color: '#FF5722',
          bgColor: 'from-[#FF5722]/10 to-[#FF5722]/5',
        },
      ];

      setStats(computed);
    } catch (error) {
      console.error('Failed to load dashboard stats', error);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchStats();
    const id = setInterval(fetchStats, 120000);
    return () => clearInterval(id);
  }, [fetchStats]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow transition-all duration-500 hover:shadow-2xl hover-lift animate-fade-in-up modern-card relative overflow-hidden"
          style={{ animationDelay: `${0.1 * (index + 1)}s` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`relative p-3 rounded-xl bg-gradient-to-r ${stat.bgColor} transition-all duration-500 group-hover:scale-110`}
              style={{ border: `2px solid ${stat.color}30` }}
            >
              <stat.icon
                className="w-6 h-6 transition-all duration-300 group-hover:scale-110"
                style={{ color: stat.color }}
              />
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div
                  className="absolute inset-0 rounded-xl blur-xl"
                  style={{ background: `radial-gradient(circle, ${stat.color}20 0%, transparent 70%)` }}
                ></div>
              </div>
            </div>

            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition-all duration-300 hover:scale-105 ${
              stat.trend === 'up' ? 'text-[#008060] bg-[#008060]/10 border-[#008060]/20' : 'text-[#FF5722] bg-[#FF5722]/10 border-[#FF5722]/20'
            }`}>
              {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {stat.change}
            </div>
          </div>

          <div className="mb-2">
            <div className="text-2xl font-bold transition-all duration-500 group-hover:scale-105" style={{ color: stat.color }}>
              {loading ? '—' : stat.value}
            </div>
          </div>
          <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-tight">{stat.title}</div>

          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 rounded-2xl" style={{ background: `radial-gradient(circle at center, ${stat.color}05 0%, transparent 70%)` }}></div>
          </div>

          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" style={{ boxShadow: `0 0 30px ${stat.color}30` }}></div>
        </motion.div>
      ))}
    </div>
  );
};

// Admin analytics panel: users, agents, departments, appointments
interface ApptOverview {
  total?: number;
  pending?: number;
  confirmed?: number;
  completed?: number;
  cancelled?: number;
}

const AdminAnalytics = () => {
  const { getAuthHeaders } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({ users: 0, agents: 0, departments: 0 });
  const [apptOverview, setApptOverview] = useState<ApptOverview | null>(null);
  const [dailyAppts, setDailyAppts] = useState<Array<{ date: string; count: number }>>([]);

  const fetchAnalytics = React.useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, agentsRes, deptsRes, apptRes] = await Promise.all([
        fetch('/api/admin/users?limit=1', { credentials: 'include', headers: getAuthHeaders() }),
        fetch('/api/admin/agents?limit=1', { credentials: 'include', headers: getAuthHeaders() }),
        fetch('/api/admin/departments?limit=1', { credentials: 'include', headers: getAuthHeaders() }),
        fetch('/api/agent/appointments', { method: 'POST', credentials: 'include', headers: { ...getAuthHeaders() }, body: JSON.stringify({ action: 'getStats' }) }),
      ]);

      const [usersJson, agentsJson, deptsJson, apptJson] = await Promise.all([
        usersRes.ok ? usersRes.json() : Promise.resolve({ total: 0 }),
        agentsRes.ok ? agentsRes.json() : Promise.resolve({ total: 0 }),
        deptsRes.ok ? deptsRes.json() : Promise.resolve({ data: { pagination: { total: 0 } } }),
        apptRes.ok ? apptRes.json() : Promise.resolve({ data: null }),
      ]);

      const usersTotal = usersJson.total ?? 0;
      const agentsTotal = agentsJson.total ?? 0;
      const deptsTotal = deptsJson?.data?.pagination?.total ?? 0;

      setCounts({ users: usersTotal, agents: agentsTotal, departments: deptsTotal });

      if (apptJson?.data) {
        setApptOverview(apptJson.data.overview ?? null);
        setDailyAppts(Array.isArray(apptJson.data.dailyStats) ? apptJson.data.dailyStats : []);
      } else {
        setApptOverview(null);
        setDailyAppts([]);
      }
    } catch (error) {
      console.error('Failed to load admin analytics', error);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Small SVG bar chart for daily appointments
  const DailyBarChart = ({ data }: { data: Array<{ date: string; count: number }> }) => {
    if (!data || data.length === 0) return <div className="text-xs text-muted-foreground">No data</div>;
    const max = Math.max(...data.map(d => d.count), 1);
    const width = 160;
    const height = 48;
    const barWidth = Math.floor(width / data.length) - 4;

    return (
      <svg width={width} height={height} className="block">
        {data.map((d, i) => {
          const h = Math.round((d.count / max) * (height - 8));
          const x = i * (barWidth + 4) + 4;
          const y = height - h - 4;
          return <rect key={d.date} x={x} y={y} width={barWidth} height={h} rx={2} fill="#008060" />;
        })}
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-fade-in-up">
      <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card/90 p-5 rounded-2xl border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-[#8D153A]/10 to-[#8D153A]/5" style={{ border: '2px solid #8D153A30' }}>
                <Users className="w-5 h-5" style={{ color: '#8D153A' }} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Users</div>
                <div className="text-2xl font-bold">{loading ? '—' : counts.users.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card/90 p-5 rounded-2xl border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-[#008060]/10 to-[#008060]/5" style={{ border: '2px solid #00806030' }}>
                <UserCog className="w-5 h-5" style={{ color: '#008060' }} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Active Agents</div>
                <div className="text-2xl font-bold">{loading ? '—' : counts.agents.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card/90 p-5 rounded-2xl border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-[#FFC72C]/10 to-[#FFC72C]/5" style={{ border: '2px solid #FFC72C30' }}>
                <FileText className="w-5 h-5" style={{ color: '#FFC72C' }} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Departments</div>
                <div className="text-2xl font-bold">{loading ? '—' : counts.departments.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card/90 p-5 rounded-2xl border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-[#FF5722]/10 to-[#FF5722]/5" style={{ border: '2px solid #FF572230' }}>
                <Clock className="w-5 h-5" style={{ color: '#FF5722' }} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Appointments</div>
                <div className="text-2xl font-bold">{loading ? '—' : apptOverview?.total?.toLocaleString() ?? '—'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card/90 p-5 rounded-2xl border border-border/50 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold">Appointments (7d)</div>
            <div className="text-xs text-muted-foreground">Daily counts</div>
          </div>
          <button onClick={fetchAnalytics} className="text-sm text-muted-foreground hover:text-foreground">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="mt-2">
          <DailyBarChart data={dailyAppts} />
        </div>

        <div className="mt-3 flex gap-3 text-sm text-muted-foreground">
          <div>Pending: <span className="text-foreground font-medium">{apptOverview?.pending ?? '—'}</span></div>
          <div>Confirmed: <span className="text-foreground font-medium">{apptOverview?.confirmed ?? '—'}</span></div>
          <div>Completed: <span className="text-foreground font-medium">{apptOverview?.completed ?? '—'}</span></div>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { getAuthHeaders } = useAdminAuth();
  const [activities, setActivities] = useState<Array<{ id: string; message: string; time: string; type?: string }>>([]);
  const [actLoading, setActLoading] = useState(false);

  interface SimpleUser { _id: string; fullName?: string; createdAt?: string }
  interface SimpleAgent { _id: string; fullName?: string; createdAt?: string }

  const fetchActivities = React.useCallback(async () => {
    setActLoading(true);
    try {
      // Get the latest users and agents created in last 24 hours as activity
      const [usersRes, agentsRes] = await Promise.all([
        fetch('/api/admin/users?limit=5', { credentials: 'include', headers: getAuthHeaders() }),
        fetch('/api/admin/agents?limit=5', { credentials: 'include', headers: getAuthHeaders() }),
      ]);

      const [usersJson, agentsJson] = await Promise.all([
        usersRes.ok ? usersRes.json() : Promise.resolve({ data: [] }),
        agentsRes.ok ? agentsRes.json() : Promise.resolve({ data: [] }),
      ]);

  const userActs = (usersJson.data || []).slice(0, 5).map((u: SimpleUser) => ({ id: `u-${u._id}`, message: `New user registration: ${u.fullName}`, time: u.createdAt || new Date().toISOString(), type: 'user' }));
  const agentActs = (agentsJson.data || []).slice(0, 5).map((a: SimpleAgent) => ({ id: `a-${a._id}`, message: `New agent added: ${a.fullName}`, time: a.createdAt || new Date().toISOString(), type: 'agent' }));

      const merged = [...userActs, ...agentActs].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6);
      setActivities(merged);
    } catch (error) {
      console.error('Failed loading activities', error);
      setActivities([]);
    } finally {
      setActLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return (
    <div className="relative min-h-full">
      {/* Main content */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Enhanced header keeping original sizes */}
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              <span className="text-foreground">Admin</span>{' '}
              <span className="bg-gradient-to-r from-[#8D153A] to-[#FF5722] bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-muted-foreground">
              Welcome to the GovLink administration panel. Monitor system status and manage users.
            </p>
          </div>

          <div className="flex items-start justify-between gap-6 flex-col lg:flex-row">
            <div className="flex-1">
              <DashboardStats />
            </div>
          </div>

          {/* Admin analytics block */}
          <AdminAnalytics />

          {/* Enhanced Recent Activity following agent dashboard style */}
          <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group relative overflow-hidden animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            {/* Section header with Sri Lankan accent */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gradient-to-r from-[#8D153A] to-[#FF5722] rounded-full animate-pulse"></div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-[#8D153A] transition-colors duration-300">
                  Recent Activity
                </h3>
              </div>
              <button onClick={() => { fetchActivities(); /* also refresh stats via dispatching a custom event or rely on DashboardStats interval */ }} className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-all duration-300 group/btn">
                <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${actLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
            
            {/* Enhanced activity list */}
            <div className="space-y-3">
              {actLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-3 p-3 bg-muted/20 rounded-lg" />
                  ))}
                </div>
              ) : activities.length > 0 ? (
                activities.map((act, idx) => (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="flex items-center gap-3 p-3 bg-muted/20 hover:bg-muted/30 rounded-lg transition-all duration-300 hover:shadow-md group/item"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-[#008060]/10 to-[#008060]/5 rounded-full flex items-center justify-center">
                      {act.type === 'agent' ? <UserCog className="w-4 h-4 text-[#008060]" /> : <UserCheck className="w-4 h-4 text-[#008060]" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{act.message}</p>
                      <p className="text-xs text-muted-foreground">{new Date(act.time).toLocaleString()}</p>
                    </div>
                    <div className="w-2 h-2 bg-[#008060] rounded-full animate-pulse opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-border/30 rounded-lg">
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              )}
            </div>
            
            {/* Card hover effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8D153A]/5 via-transparent to-[#FF5722]/5 rounded-2xl"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
