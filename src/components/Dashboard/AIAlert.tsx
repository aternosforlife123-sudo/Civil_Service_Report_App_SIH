import { AlertTriangle, Bell, CheckCircle } from 'lucide-react';

const AIAlert = () => {
  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Tag logger only road condemned near Gym Depot 5',
      time: '2 mins ago',
    },
    {
      id: 2,
      type: 'info',
      message: 'Smart light damaged at Intersection RSP',
      time: '5 mins ago',
    },
    {
      id: 3,
      type: 'success',
      message: 'Configure an automated vehicle',
      time: '8 mins ago',
    },
    {
      id: 4,
      type: 'warning',
      message: 'Install damaged and disabled hospital',
      time: '12 mins ago',
    },
    {
      id: 5,
      type: 'info',
      message: 'Alert system damage to drive',
      time: '15 mins ago',
    },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="dashboard-card h-96">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">AI Alert</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live</span>
        </div>
      </div>
      
      <div className="space-y-3 max-h-72 overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-200 cursor-pointer group"
          >
            <div className="mt-1 group-hover:scale-110 transition-transform duration-200">
              {getAlertIcon(alert.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground leading-relaxed">
                {alert.message}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <button className="dashboard-button w-full">
          View All Alerts
        </button>
      </div>
    </div>
  );
};

export default AIAlert;