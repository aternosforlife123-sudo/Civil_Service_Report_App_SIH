import { Plus, Settings, Bell, Users } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      icon: Plus,
      label: 'Add Report',
      description: 'Create new incident report',
      color: 'bg-primary',
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Manage alert settings',
      color: 'bg-blue-500',
    },
    {
      icon: Users,
      label: 'User Roles',
      description: 'Configure user permissions',
      color: 'bg-green-500',
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'System configuration',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="dashboard-card">
      <h3 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className="flex flex-col items-center p-6 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all duration-200 hover:scale-105 group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-foreground text-sm mb-1">{action.label}</h4>
              <p className="text-xs text-muted-foreground text-center">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;