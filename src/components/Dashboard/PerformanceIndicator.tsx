import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const PerformanceIndicator = () => {
  const metrics = [
    {
      label: 'Response Time',
      value: '94%',
      change: '+5.2%',
      trend: 'up',
      description: 'more reports than previous month',
    },
    {
      label: 'System Efficiency',
      value: '88.5%',
      change: '+12.3%',
      trend: 'up',
      description: 'Regular alerts decreased by 20%',
    },
    {
      label: 'Alert Resolution',
      value: '76.2%',
      change: '-2.1%',
      trend: 'down',
      description: 'Response time improved',
    },
  ];

  return (
    <div className="dashboard-card h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-foreground">Performance Overview</h3>
        <Activity className="w-6 h-6 text-primary" />
      </div>
      
      <div className="space-y-8">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-4">
            {/* Metric Header */}
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-foreground">{metric.label}</h4>
              <div className={`flex items-center text-lg font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-500'
              }`}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-5 h-5 mr-2" />
                ) : (
                  <TrendingDown className="w-5 h-5 mr-2" />
                )}
                {metric.change}
              </div>
            </div>
            
            {/* Large Progress Circle */}
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24">
                <div className="relative w-full h-full">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      strokeDasharray={`${parseFloat(metric.value)}, 100`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-foreground">{metric.value}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <p className="text-base text-muted-foreground leading-relaxed">{metric.description}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-primary h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: metric.value }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceIndicator;