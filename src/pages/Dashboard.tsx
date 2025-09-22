import { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Menu,
  Search,
  Bell,
  Settings,
  User,
  PieChart,
  Activity,
  MapPin,
  Eye,
  Download
} from 'lucide-react';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  // Dashboard stats matching the screenshot design
  const dashboardStats = [
    {
      title: 'Total Reports',
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: FileText,
      color: 'orange'
    },
    {
      title: 'Active Cases',
      value: '1,423',
      change: '+8.2%',
      changeType: 'positive',
      icon: Activity,
      color: 'grey'
    },
    {
      title: 'Resolved Issues',
      value: '1,324',
      change: '+15.3%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'orange'
    },
    {
      title: 'Response Time',
      value: '2.4h',
      change: '-12.8%',
      changeType: 'positive',
      icon: Clock,
      color: 'grey'
    }
  ];

  const recentReports = [
    {
      id: 1,
      title: 'Road Maintenance Request',
      location: 'Downtown Area',
      status: 'In Progress',
      priority: 'High',
      time: '2 hours ago'
    },
    {
      id: 2,
      title: 'Street Light Outage',
      location: 'Residential Zone',
      status: 'Pending',
      priority: 'Medium',
      time: '4 hours ago'
    },
    {
      id: 3,
      title: 'Waste Collection Issue',
      location: 'Commercial District',
      status: 'Resolved',
      priority: 'Low',
      time: '6 hours ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Menu className="w-6 h-6 text-gray-600" />
            <h1 className="text-2xl font-bold text-gray-900">Civil Service Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reports..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
            <Settings className="w-6 h-6 text-gray-600 cursor-pointer" />
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'analytics', label: 'Analytics', icon: PieChart },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'locations', label: 'Locations', icon: MapPin },
              { id: 'settings', label: 'System Settings', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Dynamic Header Based on Active Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {activeSection === 'overview' && 'Dashboard Overview'}
              {activeSection === 'reports' && 'Reports Management'}
              {activeSection === 'analytics' && 'Analytics Dashboard'}
              {activeSection === 'users' && 'User Management'}
              {activeSection === 'locations' && 'Location Management'}
              {activeSection === 'settings' && 'System Settings'}
            </h2>
            <p className="text-gray-600">
              {activeSection === 'overview' && 'Monitor and manage civil service reports and community issues'}
              {activeSection === 'reports' && 'View and manage all service reports'}
              {activeSection === 'analytics' && 'Analyze performance metrics and trends'}
              {activeSection === 'users' && 'Manage system users and permissions'}
              {activeSection === 'locations' && 'View and manage service locations'}
              {activeSection === 'settings' && 'Configure system preferences and settings'}
            </p>
          </div>

          {/* Stats Grid - Only show on Overview */}
          {activeSection === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {dashboardStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${
                        stat.color === 'orange' ? 'bg-orange-100' :
                        'bg-gray-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          stat.color === 'orange' ? 'text-orange-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Dynamic Content Based on Active Section */}
          {activeSection === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Chart Area */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Reports Trend</h3>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-orange-50 text-orange-600 rounded-lg">7D</button>
                      <button className="px-3 py-1 text-sm text-gray-600 rounded-lg">30D</button>
                      <button className="px-3 py-1 text-sm text-gray-600 rounded-lg">90D</button>
                    </div>
                  </div>
                  <div className="h-64 bg-gradient-to-br from-orange-50 to-yellow-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-16 h-16 text-orange-400" />
                    <span className="ml-4 text-orange-600 font-medium">Overview Chart Area</span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">94.2%</div>
                      <div className="text-sm text-gray-600">Resolution Rate</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">4.8</div>
                      <div className="text-sm text-gray-600">Avg Rating</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Recent Reports */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
                    <Eye className="w-5 h-5 text-gray-400 cursor-pointer" />
                  </div>
                  <div className="space-y-4">
                    {recentReports.map((report) => (
                      <div key={report.id} className="border-l-4 border-orange-500 pl-4 py-2">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900 text-sm">{report.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            report.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                            report.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{report.location}</p>
                        <p className="text-xs text-gray-500 mt-1">{report.time}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center space-x-3 p-3 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors">
                      <FileText className="w-5 h-5" />
                      <span>New Report</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                      <Download className="w-5 h-5" />
                      <span>Export Data</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'reports' && (
            <div className="space-y-6">
              {/* Reports Filter Bar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex space-x-4">
                    <select className="border border-gray-300 rounded-lg px-3 py-2">
                      <option>All Status</option>
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                    </select>
                    <select className="border border-gray-300 rounded-lg px-3 py-2">
                      <option>All Priority</option>
                      <option>Critical</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    + New Report
                  </button>
                </div>
              </div>

              {/* Reports Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { id: 1, title: 'Pothole Repair - Main Street', location: 'Downtown Area', priority: 'High', status: 'In Progress', date: '2024-01-15', assignee: 'John Smith' },
                        { id: 2, title: 'Traffic Light Malfunction', location: 'Oak Avenue', priority: 'Critical', status: 'Pending', date: '2024-01-14', assignee: 'Sarah Johnson' },
                        { id: 3, title: 'Park Maintenance Request', location: 'Central Park', priority: 'Low', status: 'Resolved', date: '2024-01-13', assignee: 'Mike Davis' },
                        { id: 4, title: 'Street Cleaning Schedule', location: 'Business District', priority: 'Medium', status: 'In Progress', date: '2024-01-12', assignee: 'Lisa Brown' },
                        { id: 5, title: 'Waste Collection Issue', location: 'Residential Zone', priority: 'Medium', status: 'Pending', date: '2024-01-11', assignee: 'John Smith' }
                      ].map((report) => (
                        <tr key={report.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{report.title}</div>
                            <div className="text-sm text-gray-500">Assigned to: {report.assignee}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              report.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                              report.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                              report.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {report.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              report.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                              report.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {report.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-orange-600 hover:text-orange-900 mr-3">View</button>
                            <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div className="space-y-6">
              {/* Analytics Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Resolution Trend</p>
                      <p className="text-2xl font-bold text-gray-900">+18.5%</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Avg Response</p>
                      <p className="text-2xl font-bold text-gray-900">2.1h</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Active Users</p>
                      <p className="text-2xl font-bold text-gray-900">47</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Types Distribution</h3>
                  <div className="h-64 bg-gradient-to-br from-orange-50 to-yellow-100 rounded-lg flex items-center justify-center">
                    <PieChart className="w-16 h-16 text-orange-400" />
                    <span className="ml-4 text-orange-600 font-medium">Pie Chart View</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-16 h-16 text-blue-400" />
                    <span className="ml-4 text-blue-600 font-medium">Line Chart View</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Total Reports</span>
                      <span className="font-bold text-gray-900">2,847</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="font-bold text-green-600">94.2%</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Customer Satisfaction</span>
                      <span className="font-bold text-orange-600">4.8/5</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Active Issues</span>
                      <span className="font-bold text-gray-900">47</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Public Works</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{width: '85%'}}></div>
                        </div>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Utilities</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div>
                        </div>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Sanitation</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '78%'}}></div>
                        </div>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div className="space-y-6">
              {/* User Management Header */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                    <p className="text-sm text-gray-600">Manage system users and permissions</p>
                  </div>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    + Add User
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { name: 'John Smith', email: 'john.smith@city.gov', role: 'Administrator', department: 'IT Services', status: 'Active', lastActive: '2 hours ago' },
                        { name: 'Sarah Johnson', email: 'sarah.j@city.gov', role: 'Supervisor', department: 'Public Works', status: 'Active', lastActive: '30 mins ago' },
                        { name: 'Mike Davis', email: 'mike.davis@city.gov', role: 'Field Worker', department: 'Utilities', status: 'Active', lastActive: '1 hour ago' },
                        { name: 'Lisa Brown', email: 'lisa.brown@city.gov', role: 'Analyst', department: 'Analytics', status: 'Inactive', lastActive: '2 days ago' },
                        { name: 'Tom Wilson', email: 'tom.wilson@city.gov', role: 'Technician', department: 'Maintenance', status: 'Active', lastActive: '45 mins ago' }
                      ].map((user, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.department}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.lastActive}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-orange-600 hover:text-orange-900 mr-3">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'locations' && (
            <div className="space-y-6">
              {/* Map Controls */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Interactive Service Map</h3>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm bg-orange-50 text-orange-600 rounded-lg">All Alerts</button>
                    <button className="px-3 py-1 text-sm text-gray-600 rounded-lg">Critical</button>
                    <button className="px-3 py-1 text-sm text-gray-600 rounded-lg">Resolved</button>
                  </div>
                </div>
              </div>

              {/* Interactive Map with Alert Pinpoints */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="relative h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden">
                  {/* Map Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50"></div>
                  
                  {/* Simulated Street Grid */}
                  <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-0 right-0 h-px bg-gray-300"></div>
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>
                    <div className="absolute top-3/4 left-0 right-0 h-px bg-gray-300"></div>
                    <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gray-300"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300"></div>
                    <div className="absolute left-3/4 top-0 bottom-0 w-px bg-gray-300"></div>
                  </div>

                  {/* Alert Pinpoints */}
                  {/* Critical Alert - Red */}
                  <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        Traffic Light Outage
                      </div>
                    </div>
                  </div>

                  {/* High Priority - Orange */}
                  <div className="absolute top-1/2 left-3/5 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="w-6 h-6 bg-orange-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        Pothole Repair
                      </div>
                    </div>
                  </div>

                  {/* Medium Priority - Yellow */}
                  <div className="absolute top-2/3 left-2/5 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-white shadow-lg"></div>
                      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        Street Cleaning
                      </div>
                    </div>
                  </div>

                  {/* Low Priority - Green */}
                  <div className="absolute top-1/4 left-3/4 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        Park Maintenance
                      </div>
                    </div>
                  </div>

                  {/* Additional Alert Points */}
                  <div className="absolute top-3/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                  </div>

                  <div className="absolute top-1/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 bg-orange-500 rounded-full border-2 border-white shadow-lg"></div>
                  </div>

                  <div className="absolute top-3/5 left-4/5 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 bg-yellow-500 rounded-full border-2 border-white shadow-lg"></div>
                  </div>

                  {/* Map Center Indicator */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 border-2 border-gray-400 rounded-full bg-white/50 flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Map Legend */}
                <div className="mt-4 flex items-center justify-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Critical</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">High</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Medium</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Low</span>
                  </div>
                </div>
              </div>

              {/* Location Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Active Alerts</p>
                      <p className="text-2xl font-bold text-gray-900">23</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <MapPin className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Service Areas</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Resolved Today</p>
                      <p className="text-2xl font-bold text-gray-900">8</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="space-y-6">
              {/* System Settings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">System Name</label>
                      <input type="text" value="Civil Service Dashboard" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option>UTC-5 (Eastern Time)</option>
                        <option>UTC-6 (Central Time)</option>
                        <option>UTC-7 (Mountain Time)</option>
                        <option>UTC-8 (Pacific Time)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Email Notifications</span>
                      <button className="w-12 h-6 bg-orange-500 rounded-full p-1 transition-colors">
                        <div className="w-4 h-4 bg-white rounded-full transform translate-x-6 transition-transform"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">SMS Alerts</span>
                      <button className="w-12 h-6 bg-gray-300 rounded-full p-1 transition-colors">
                        <div className="w-4 h-4 bg-white rounded-full transition-transform"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Critical Alerts</span>
                      <button className="w-12 h-6 bg-orange-500 rounded-full p-1 transition-colors">
                        <div className="w-4 h-4 bg-white rounded-full transform translate-x-6 transition-transform"></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>2 hours</option>
                        <option>4 hours</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Two-Factor Authentication</span>
                      <button className="w-12 h-6 bg-orange-500 rounded-full p-1 transition-colors">
                        <div className="w-4 h-4 bg-white rounded-full transform translate-x-6 transition-transform"></div>
                      </button>
                    </div>
                    <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors">
                      Change Password
                    </button>
                  </div>
                </div>

                {/* System Maintenance */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Maintenance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-700">Database Size</span>
                      <span className="text-sm font-medium text-gray-900">847 MB</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-700">Last Backup</span>
                      <span className="text-sm font-medium text-gray-900">2 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-700">System Version</span>
                      <span className="text-sm font-medium text-gray-900">v2.4.1</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        Export Data
                      </button>
                      <button className="bg-orange-100 text-orange-700 py-2 rounded-lg hover:bg-orange-200 transition-colors">
                        Run Backup
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Settings */}
              <div className="flex justify-end space-x-4">
                <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;