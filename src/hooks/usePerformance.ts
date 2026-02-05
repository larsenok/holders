import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  timestamp: number;
}

interface UsePerformanceOptions {
  enabled?: boolean;
  onMetrics?: (metrics: PerformanceMetrics) => void;
  logToConsole?: boolean;
}

export function usePerformance(options: UsePerformanceOptions = {}) {
  const {
    enabled = process.env.NODE_ENV === 'development',
    onMetrics,
    logToConsole = false
  } = options;

  const renderStartTime = useRef<number>(0);
  const metricsRef = useRef<PerformanceMetrics[]>([]);

  const measureRender = useCallback(() => {
    if (!enabled) return;

    const renderTime = performance.now() - renderStartTime.current;
    
    const metrics: PerformanceMetrics = {
      renderTime,
      timestamp: Date.now()
    };

    // Add memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      metrics.memoryUsage = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }

    metricsRef.current.push(metrics);
    
    // Keep only last 100 metrics
    if (metricsRef.current.length > 100) {
      metricsRef.current = metricsRef.current.slice(-100);
    }

    if (logToConsole) {
      console.log('Performance Metrics:', metrics);
    }

    onMetrics?.(metrics);
  }, [enabled, onMetrics, logToConsole]);

  const startRender = useCallback(() => {
    if (enabled) {
      renderStartTime.current = performance.now();
    }
  }, [enabled]);

  const getAverageRenderTime = useCallback(() => {
    if (metricsRef.current.length === 0) return 0;
    
    const total = metricsRef.current.reduce((sum, metric) => sum + metric.renderTime, 0);
    return total / metricsRef.current.length;
  }, []);

  const getSlowestRender = useCallback(() => {
    if (metricsRef.current.length === 0) return null;
    
    return metricsRef.current.reduce((slowest, current) => 
      current.renderTime > slowest.renderTime ? current : slowest
    );
  }, []);

  const clearMetrics = useCallback(() => {
    metricsRef.current = [];
  }, []);

  // Measure initial render
  useEffect(() => {
    startRender();
    const timer = setTimeout(measureRender, 0);
    return () => clearTimeout(timer);
  }, [startRender, measureRender]);

  return {
    startRender,
    measureRender,
    getAverageRenderTime,
    getSlowestRender,
    clearMetrics,
    metrics: metricsRef.current,
    enabled
  };
}

// Hook for measuring specific operations
export function useOperationTimer(operationName: string, options: UsePerformanceOptions = {}) {
  const startTime = useRef<number>(0);
  const { enabled = process.env.NODE_ENV === 'development', logToConsole = false } = options;

  const startTimer = useCallback(() => {
    if (enabled) {
      startTime.current = performance.now();
    }
  }, [enabled]);

  const endTimer = useCallback(() => {
    if (!enabled || startTime.current === 0) return 0;

    const duration = performance.now() - startTime.current;
    
    if (logToConsole) {
      console.log(`${operationName} took ${duration.toFixed(2)}ms`);
    }

    startTime.current = 0;
    return duration;
  }, [enabled, operationName, logToConsole]);

  return { startTimer, endTimer };
}

// Hook for measuring component re-renders
export function useRenderCounter(componentName: string) {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} rendered ${renderCount.current} times`);
    }
  }, [componentName]);

  return renderCount.current;
}
