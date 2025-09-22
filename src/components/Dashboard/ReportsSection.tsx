import { FileText, Download, Calendar } from 'lucide-react';

const ReportsSection = () => {
  const reports = [
    {
      title: 'Report from area of Chitrakoot',
      type: 'Area Report',
      date: '2024-01-15',
      status: 'completed',
    },
    {
      title: 'Report from area of RDC',
      type: 'Area Report', 
      date: '2024-01-14',
      status: 'completed',
    },
    {
      title: 'Performance Dashboard',
      type: 'Performance',
      date: '2024-01-13',
      status: 'pending',
    },
    {
      title: 'Facebook Analytics',
      type: 'Analytics',
      date: '2024-01-12', 
      status: 'completed',
    },
  ];

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Reports</h3>
        <button className="dashboard-button text-sm">
          <FileText className="w-4 h-4 mr-2" />
          Generate New
        </button>
      </div>
      
      <div className="space-y-3">
        {reports.map((report, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">
                  {report.title}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-muted-foreground">{report.type}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {report.date}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                report.status === 'completed' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {report.status}
              </div>
              <button className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          <button className="dashboard-button">
            Manage Departments
          </button>
          <button className="dashboard-button">
            Configure AI Thresholds
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;