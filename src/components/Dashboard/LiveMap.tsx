import { MapPin, Navigation } from 'lucide-react';

const LiveMap = () => {
  const markers = [
    { id: 1, x: 25, y: 30, type: 'alert' },
    { id: 2, x: 60, y: 45, type: 'normal' },
    { id: 3, x: 40, y: 70, type: 'warning' },
    { id: 4, x: 75, y: 25, type: 'normal' },
    { id: 5, x: 20, y: 80, type: 'alert' },
  ];

  return (
    <div className="dashboard-card h-96">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Live Map</h3>
        <button className="dashboard-button text-sm">
          <Navigation className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>
      
      <div className="relative w-full h-72 bg-muted rounded-lg overflow-hidden">
        {/* Map background pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Location markers */}
        {markers.map((marker) => (
          <div
            key={marker.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 ${
                marker.type === 'alert'
                  ? 'bg-red-500'
                  : marker.type === 'warning'
                  ? 'bg-yellow-500'
                  : 'bg-primary'
              }`}
            >
              <MapPin className="w-3 h-3 text-white" />
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {marker.type === 'alert' ? 'Alert Zone' : marker.type === 'warning' ? 'Warning Zone' : 'Normal Zone'}
            </div>
          </div>
        ))}
        
        {/* Route line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M 25 30 Q 40 20 60 45 Q 70 60 40 70"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            className="animate-pulse"
          />
        </svg>
      </div>
    </div>
  );
};

export default LiveMap;