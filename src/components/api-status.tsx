"use client";

import { useEffect, useState } from "react";

type ApiState = "checking" | "healthy" | "unhealthy";
type HealthData = {
  status: string;
  timestamp: string;
  duration: number;
  checks: {
    backend: { status: string; responseTime: number; error: string | null };
    auth: { status: string; responseTime: number; error: string | null };
    database: { status: string; responseTime: number; error: string | null };
  };
  errors?: string[];
};

export function ApiStatus() {
  const [status, setStatus] = useState<ApiState>("checking");
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = async () => {
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: HealthData = await response.json();
      setHealthData(data);
      setStatus(data.status === 'healthy' ? 'healthy' : 'unhealthy');
      setLastChecked(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
      setStatus('unhealthy');
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    // Initial check
    checkHealth();

    // Set up periodic health checks every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (status === "healthy") return "bg-green-500";
    if (status === "unhealthy") return "bg-red-500";
    return "bg-yellow-500";
  };

  const getStatusLabel = () => {
    if (status === "healthy") return "API: Healthy";
    if (status === "unhealthy") return "API: Issues";
    return "API: Checking...";
  };

  const getTooltipText = () => {
    if (!healthData) return "Checking health status...";
    
    const { checks, duration, errors } = healthData;
    const parts = [
      `Backend: ${checks.backend.status} (${checks.backend.responseTime}ms)`,
      `Auth: ${checks.auth.status} (${checks.auth.responseTime}ms)`,
      `Database: ${checks.database.status} (${checks.database.responseTime}ms)`,
      `Total: ${duration}ms`
    ];
    
    if (errors && errors.length > 0) {
      parts.push(`Errors: ${errors.join(', ')}`);
    }
    
    return parts.join('\n');
  };

  return (
    <div 
      className="fixed top-4 right-4 inline-flex items-center gap-2 rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 shadow-sm bg-background/70 backdrop-blur cursor-help"
      title={getTooltipText()}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${getStatusColor()}`} />
      <span className="text-sm text-foreground/80">{getStatusLabel()}</span>
      {lastChecked && (
        <span className="text-xs text-foreground/60">
          {lastChecked.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}


