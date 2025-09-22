import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';

const AnalyticsChart = () => {
  const pieData = [
    { name: 'Resolved', value: 45, color: '#FF5722' },
    { name: 'Pending', value: 30, color: '#FFA726' },
    { name: 'In Progress', value: 25, color: '#FFD54F' },
  ];

  const barData = [
    { name: 'Jan', alerts: 24, resolved: 20 },
    { name: 'Feb', alerts: 32, resolved: 28 },
    { name: 'Mar', alerts: 28, resolved: 25 },
    { name: 'Apr', alerts: 35, resolved: 32 },
    { name: 'May', alerts: 29, resolved: 27 },
    { name: 'Jun', alerts: 31, resolved: 29 },
  ];

  const priorities = [
    { label: 'Lines of events per second per second', value: '15.2k' },
    { label: 'Smart lights are down and requiring data', value: '8.7k' },
  ];

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Analytics</h3>
        <TrendingUp className="w-5 h-5 text-primary" />
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-4">Progress Distribution</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-2">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-4">Monthly Trends</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="alerts" fill="#FF5722" radius={[2, 2, 0, 0]} />
                <Bar dataKey="resolved" fill="#FFA726" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Priorities */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-4">Priorities</h4>
        <div className="space-y-3">
          {priorities.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm text-foreground">{item.label}</span>
              <span className="widget-stat text-lg">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;