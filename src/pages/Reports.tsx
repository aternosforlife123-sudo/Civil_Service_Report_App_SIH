import { useState } from 'react';
import { FileText, Search, Filter, Calendar, MapPin, User, Clock, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Mock data for reports
  const reports = [
    {
      id: 'REP-001',
      title: 'Pothole on Main Street',
      category: 'Roads and Infrastructure',
      location: 'Main St & 1st Ave',
      status: 'Open',
      priority: 'High',
      submittedBy: 'John Doe',
      submittedDate: '2024-01-15',
      assignedTo: 'Public Works',
    },
    {
      id: 'REP-002',
      title: 'Street Light Outage',
      category: 'Utilities',
      location: 'Oak St & Pine St',
      status: 'In Progress',
      priority: 'Medium',
      submittedBy: 'Jane Smith',
      submittedDate: '2024-01-14',
      assignedTo: 'Utilities Dept',
    },
    {
      id: 'REP-003',
      title: 'Overflowing Garbage Bins',
      category: 'Sanitation',
      location: 'Central Park',
      status: 'Resolved',
      priority: 'Low',
      submittedBy: 'Robert Johnson',
      submittedDate: '2024-01-12',
      assignedTo: 'Sanitation Dept',
    },
    {
      id: 'REP-004',
      title: 'Broken Playground Equipment',
      category: 'Parks and Recreation',
      location: 'Riverside Park',
      status: 'Open',
      priority: 'Medium',
      submittedBy: 'Sarah Williams',
      submittedDate: '2024-01-10',
      assignedTo: 'Parks Dept',
    },
    {
      id: 'REP-005',
      title: 'Water Main Leak',
      category: 'Utilities',
      location: '5th St & Broadway',
      status: 'In Progress',
      priority: 'Urgent',
      submittedBy: 'Michael Brown',
      submittedDate: '2024-01-08',
      assignedTo: 'Utilities Dept',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-50 text-red-700 border border-red-200';
      case 'In Progress': return 'bg-primary/10 text-primary border border-primary/20';
      case 'Resolved': return 'bg-green-50 text-green-700 border border-green-200';
      default: return 'bg-muted text-muted-foreground border border-border';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Medium': return 'bg-secondary/10 text-secondary border border-secondary/20';
      case 'High': return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'Urgent': return 'bg-red-50 text-red-700 border border-red-200';
      default: return 'bg-muted text-muted-foreground border border-border';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [
    'Roads and Infrastructure',
    'Public Safety',
    'Environment',
    'Utilities',
    'Parks and Recreation',
    'Transportation',
    'Housing',
    'Sanitation',
  ];

  const statuses = ['Open', 'In Progress', 'Resolved'];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Civil Service Reports</h1>
            <p className="mt-2 text-muted-foreground">
              View and track all submitted reports in your community
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild className="civil-button">
              <a href="/reports/new">Submit New Report</a>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium text-foreground">No reports found</h3>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            filteredReports.map(report => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-foreground">{report.title}</h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="inline-flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 h-4 w-4" />
                              {report.location}
                            </span>
                            <span className="inline-flex items-center text-sm text-muted-foreground">
                              <User className="mr-1 h-4 w-4" />
                              {report.submittedBy}
                            </span>
                            <span className="inline-flex items-center text-sm text-muted-foreground">
                              <Calendar className="mr-1 h-4 w-4" />
                              {report.submittedDate}
                            </span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className={`status-badge ${getStatusColor(report.status)}`}>
                              {report.status}
                            </span>
                            <span className={`priority-badge ${getPriorityColor(report.priority)}`}>
                              {report.priority} Priority
                            </span>
                            <span className="px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full border border-border">
                              {report.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-4 md:text-right">
                      <p className="text-sm text-muted-foreground">Assigned to</p>
                      <p className="font-medium text-foreground">{report.assignedTo}</p>
                      <Button variant="outline" className="mt-2 w-full md:w-auto">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Stats Summary */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-muted/30 p-6 rounded-lg">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-foreground">24</p>
                <p className="text-muted-foreground">Open Reports</p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 p-6 rounded-lg">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-foreground">18</p>
                <p className="text-muted-foreground">In Progress</p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 p-6 rounded-lg">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-foreground">142</p>
                <p className="text-muted-foreground">Resolved This Month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;