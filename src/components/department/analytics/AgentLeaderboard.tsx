// src/components/department/analytics/AgentLeaderboard.tsx
"use client";
import React from 'react';
import { Trophy, Star, Target, Award, Users } from 'lucide-react';

export default function AgentLeaderboard() {

  // Dummy leaderboard data
  const leaderboardData = [
    {
      id: '1',
      name: 'Sapumal Rana',
      email: 'sapumal@gmail.com',
      specialization: ['Project Accept'],
      completed: 5,
      performanceScore: 83.0,
      avgRating: 4.5,
      totalAssigned: 6,
      responseTime: 2,
      workload: '83%',
      status: 'ACTIVE',
      joined: '8/16/2025',
    },
    {
      id: '2', 
      name: 'Nimali Gunaratne',
      email: 'nimali.g@govlink.lk',
      specialization: ['Birth Certificates', 'Marriage Certificates'],
      completed: 42,
      performanceScore: 95.5,
      avgRating: 4.8,
      totalAssigned: 44,
      responseTime: 3,
      workload: '95%',
      status: 'ACTIVE',
      joined: '7/15/2025',
    },
    {
      id: '3',
      name: 'Bhanuka Rajapaksa', 
      email: 'bhanuka.r@govlink.lk',
      specialization: ['Business Licenses', 'Property Services'],
      completed: 38,
      performanceScore: 92.1,
      avgRating: 4.7,
      totalAssigned: 42,
      responseTime: 4,
      workload: '88%',
      status: 'ACTIVE',
      joined: '6/22/2025',
    },
    {
      id: '4',
      name: 'Priya De Silva',
      email: 'priya.ds@govlink.lk', 
      specialization: ['Tax Assessment', 'Property Services'],
      completed: 35,
      performanceScore: 89.8,
      avgRating: 4.6,
      totalAssigned: 39,
      responseTime: 5,
    },
    {
      id: '5',
      name: 'Sanduni Fernando',
      email: 'sanduni.f@govlink.lk',
      specialization: ['Birth Certificates', 'Business Services'],
      completed: 32,
      performanceScore: 87.3, 
      avgRating: 4.5,
      totalAssigned: 37,
      responseTime: 6,
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Award className="w-5 h-5 text-gray-400" />;
      case 3: return <Star className="w-5 h-5 text-orange-500" />;
      default: return <Target className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
      case 2: return 'from-gray-400/20 to-gray-500/10 border-gray-400/30';
      case 3: return 'from-orange-500/20 to-orange-600/10 border-orange-500/30';
      default: return 'from-muted/20 to-muted/10 border-border/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card/90 modern-card rounded-xl p-6 shadow-glow">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-[#008060]" />
            <span className="text-sm font-medium text-muted-foreground">Total Agents</span>
          </div>
          <div className="text-2xl font-bold text-foreground">5</div>
        </div>
        
        <div className="bg-card/90 modern-card rounded-xl p-6 shadow-glow">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-[#FFC72C]" />
            <span className="text-sm font-medium text-muted-foreground">Avg Performance</span>
          </div>
          <div className="text-2xl font-bold text-foreground">93.8%</div>
        </div>
        
        <div className="bg-card/90 modern-card rounded-xl p-6 shadow-glow">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-5 h-5 text-[#8D153A]" />
            <span className="text-sm font-medium text-muted-foreground">Top Performer</span>
          </div>
          <div className="text-2xl font-bold text-foreground">Nimali</div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-card/90 modern-card rounded-xl shadow-glow overflow-hidden">
        <div className="p-6 border-b border-border/30">
          <h3 className="text-lg font-semibold text-foreground">Agent Performance Leaderboard</h3>
          <p className="text-sm text-muted-foreground mt-1">Based on submissions completed in the last 30 days</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {leaderboardData.length > 0 ? (
              leaderboardData.map((agent, index) => (
                <div 
                  key={agent.id} 
                  className={`p-4 rounded-xl bg-gradient-to-r border ${getRankColor(index + 1)} hover:shadow-lg transition-all duration-300`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(index + 1)}
                        <span className="font-bold text-lg text-foreground">#{index + 1}</span>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground">{agent.name}</h4>
                        <p className="text-sm text-muted-foreground">{agent.email}</p>
                        {agent.specialization.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {agent.specialization.slice(0, 2).map((spec: string, i: number) => (
                              <span 
                                key={i} 
                                className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#008060]">
                        {agent.performanceScore.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {agent.completed}/{agent.totalAssigned} completed
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Avg: {agent.responseTime}h response
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Performance Score</span>
                      <span>{agent.performanceScore.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#008060] to-[#FFC72C] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${agent.performanceScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold mb-2">No Performance Data</h3>
                <p>Agent performance data will appear here once submissions are processed.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
