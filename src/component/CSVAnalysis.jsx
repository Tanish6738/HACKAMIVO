import React, { useState, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.jsx';
// import { Button } from './ui/button';
import Input from './ui/Input';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  Upload, 
  FileText, 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon,
  Activity,
  TrendingUp,
  Download,
  Search,
  Filter,
  Zap,
  Brain,
  Table as TableIcon
} from 'lucide-react';
import Button from './ui/Button';

const CSVAnalysis = () => {
  const [csvData, setCsvData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [columns, setColumns] = useState([]);
  const [selectedChart, setSelectedChart] = useState('bar');
  const [selectedColumns, setSelectedColumns] = useState({ x: '', y: '' });
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [timeFilter, setTimeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const fileInputRef = useRef(null);

  const chartConfig = {
    bar: {
      label: "Bar Chart",
      icon: BarChart3,
      color: "hsl(var(--chart-1))"
    },
    line: {
      label: "Line Chart", 
      icon: LineChartIcon,
      color: "hsl(var(--chart-2))"
    },
    pie: {
      label: "Pie Chart",
      icon: PieChartIcon,
      color: "hsl(var(--chart-3))"
    },
    area: {
      label: "Area Chart",
      icon: Activity,
      color: "hsl(var(--chart-4))"
    },
    radar: {
      label: "Radar Chart",
      icon: TrendingUp,
      color: "hsl(var(--chart-5))"
    }
  };

  const colors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ];

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return { data: [], columns: [] };

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row = { id: index };
      headers.forEach((header, i) => {
        const value = values[i] || '';
        // Try to parse as number, otherwise keep as string
        row[header] = isNaN(value) || value === '' ? value : parseFloat(value);
      });
      return row;
    });

    return { data, columns: headers };
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target.result;
      const { data, columns } = parseCSV(text);
      
      setCsvData(data);
      setOriginalData(data);
      setFilteredData(data);
      setColumns(columns);
      
      // Auto-select first two columns
      if (columns.length >= 2) {
        setSelectedColumns({ x: columns[0], y: columns[1] });
      }
    };
    
    reader.readAsText(file);
  };

  const processAIQuery = async (userQuery) => {
    setIsLoading(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerQuery = userQuery.toLowerCase();
    let response = '';
    let newData = [...originalData];

    // Simple AI query processing simulation
    if (lowerQuery.includes('filter') || lowerQuery.includes('where')) {
      if (lowerQuery.includes('greater than') || lowerQuery.includes('>')) {
        const numbers = userQuery.match(/\d+/g);
        if (numbers) {
          const threshold = parseInt(numbers[0]);
          newData = originalData.filter(row => 
            Object.values(row).some(val => typeof val === 'number' && val > threshold)
          );
          response = `Filtered data to show records with values greater than ${threshold}. Found ${newData.length} matching records.`;
        }
      } else if (lowerQuery.includes('less than') || lowerQuery.includes('<')) {
        const numbers = userQuery.match(/\d+/g);
        if (numbers) {
          const threshold = parseInt(numbers[0]);
          newData = originalData.filter(row => 
            Object.values(row).some(val => typeof val === 'number' && val < threshold)
          );
          response = `Filtered data to show records with values less than ${threshold}. Found ${newData.length} matching records.`;
        }
      }
    } else if (lowerQuery.includes('sum') || lowerQuery.includes('total')) {
      const numericColumns = columns.filter(col => 
        originalData.some(row => typeof row[col] === 'number')
      );
      if (numericColumns.length > 0) {
        const sums = numericColumns.map(col => {
          const sum = originalData.reduce((acc, row) => acc + (row[col] || 0), 0);
          return `${col}: ${sum.toFixed(2)}`;
        });
        response = `Calculated sums for numeric columns:\n${sums.join('\n')}`;
      }
    } else if (lowerQuery.includes('average') || lowerQuery.includes('mean')) {
      const numericColumns = columns.filter(col => 
        originalData.some(row => typeof row[col] === 'number')
      );
      if (numericColumns.length > 0) {
        const averages = numericColumns.map(col => {
          const values = originalData.map(row => row[col]).filter(val => typeof val === 'number');
          const avg = values.reduce((acc, val) => acc + val, 0) / values.length;
          return `${col}: ${avg.toFixed(2)}`;
        });
        response = `Calculated averages for numeric columns:\n${averages.join('\n')}`;
      }
    } else if (lowerQuery.includes('max') || lowerQuery.includes('maximum')) {
      const numericColumns = columns.filter(col => 
        originalData.some(row => typeof row[col] === 'number')
      );
      if (numericColumns.length > 0) {
        const maxValues = numericColumns.map(col => {
          const values = originalData.map(row => row[col]).filter(val => typeof val === 'number');
          const max = Math.max(...values);
          return `${col}: ${max}`;
        });
        response = `Maximum values for numeric columns:\n${maxValues.join('\n')}`;
      }
    } else if (lowerQuery.includes('chart') || lowerQuery.includes('visualize')) {
      if (lowerQuery.includes('pie')) {
        setSelectedChart('pie');
        response = 'Switched to pie chart visualization.';
      } else if (lowerQuery.includes('line')) {
        setSelectedChart('line');
        response = 'Switched to line chart visualization.';
      } else if (lowerQuery.includes('bar')) {
        setSelectedChart('bar');
        response = 'Switched to bar chart visualization.';
      } else if (lowerQuery.includes('area')) {
        setSelectedChart('area');
        response = 'Switched to area chart visualization.';
      } else if (lowerQuery.includes('radar')) {
        setSelectedChart('radar');
        response = 'Switched to radar chart visualization.';
      }
    } else {
      response = `I found ${originalData.length} records with ${columns.length} columns: ${columns.join(', ')}. You can ask me to filter data, calculate statistics, or change chart types.`;
    }

    setFilteredData(newData);
    setAiResponse(response);
    setIsLoading(false);
  };

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    if (query.trim() && csvData.length > 0) {
      processAIQuery(query);
    }
  };

  const getChartData = () => {
    if (!selectedColumns.x || !selectedColumns.y || filteredData.length === 0) {
      return [];
    }

    if (selectedChart === 'pie') {
      // For pie chart, group by x-axis and sum y-axis values
      const grouped = {};
      filteredData.forEach(item => {
        const key = item[selectedColumns.x];
        if (!grouped[key]) {
          grouped[key] = 0;
        }
        grouped[key] += typeof item[selectedColumns.y] === 'number' ? item[selectedColumns.y] : 1;
      });
      
      return Object.entries(grouped).map(([name, value]) => ({ name, value }));
    }

    return filteredData.map(item => ({
      [selectedColumns.x]: item[selectedColumns.x],
      [selectedColumns.y]: item[selectedColumns.y]
    }));
  };

  const renderChart = () => {
    const data = getChartData();
    if (data.length === 0) return <div className="flex items-center justify-center h-64 text-muted-foreground">No data to display</div>;

    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (selectedChart) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={selectedColumns.x} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey={selectedColumns.y} fill={colors[0]} />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={selectedColumns.x} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey={selectedColumns.y} stroke={colors[1]} strokeWidth={2} />
          </LineChart>
        );

      case 'pie':
        return (
          <PieChart width={400} height={300}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <ChartTooltip />
            <Legend />
          </PieChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={selectedColumns.x} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area type="monotone" dataKey={selectedColumns.y} stroke={colors[3]} fill={colors[3]} />
          </AreaChart>
        );

      case 'radar':
        const radarData = data.slice(0, 6); // Limit for readability
        return (
          <RadarChart width={400} height={300} data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey={selectedColumns.x} />
            <PolarRadiusAxis />
            <Radar dataKey={selectedColumns.y} stroke={colors[4]} fill={colors[4]} fillOpacity={0.6} />
            <ChartTooltip />
          </RadarChart>
        );

      default:
        return null;
    }
  };

  const quickActions = [
    { label: 'Show summary', query: 'Show me a summary of this data' },
    { label: 'Calculate averages', query: 'Calculate average for all numeric columns' },
    { label: 'Find maximums', query: 'Find maximum values in each column' },
    { label: 'Filter high values', query: 'Filter records with values greater than 100' }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">CSV Data Analysis</h1>
          <p className="text-muted-foreground">Upload your CSV files and explore data with AI-powered queries</p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload CSV File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div 
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Click to upload CSV file</p>
                <p className="text-muted-foreground">Or drag and drop your file here</p>
                {fileName && (
                  <p className="text-primary font-medium mt-2">Selected: {fileName}</p>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {csvData.length > 0 && (
          <>
            {/* AI Query Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Powered Query
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleQuerySubmit} className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask anything about your data... (e.g., 'Show me records where value > 50' or 'Calculate average sales')"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setQuery(action.query);
                          processAIQuery(action.query);
                        }}
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        {action.label}
                      </Button>
                    ))}
                  </div>

                  {aiResponse && (
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">AI Response:</h4>
                      <p className="whitespace-pre-line text-sm">{aiResponse}</p>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Chart Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Visualization Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Chart Type Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chart Type</label>
                    <div className="grid grid-cols-3 gap-1">
                      {Object.entries(chartConfig).map(([key, config]) => {
                        const Icon = config.icon;
                        return (
                          <Button
                            key={key}
                            variant={selectedChart === key ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedChart(key)}
                            className="h-12 flex flex-col gap-1"
                          >
                            <Icon className="h-4 w-4" />
                            <span className="text-xs">{config.label.split(' ')[0]}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column Selectors */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">X-Axis</label>
                    <select
                      value={selectedColumns.x}
                      onChange={(e) => setSelectedColumns(prev => ({ ...prev, x: e.target.value }))}
                      className="input-theme h-10 w-full"
                    >
                      <option value="">Select column</option>
                      {columns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Y-Axis</label>
                    <select
                      value={selectedColumns.y}
                      onChange={(e) => setSelectedColumns(prev => ({ ...prev, y: e.target.value }))}
                      className="input-theme h-10 w-full"
                    >
                      <option value="">Select column</option>
                      {columns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>

                  {/* View Toggle */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">View Mode</label>
                    <div className="flex gap-1">
                      <Button
                        variant={!showTable ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowTable(false)}
                        className="flex-1"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={showTable ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowTable(true)}
                        className="flex-1"
                      >
                        <TableIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {showTable ? <TableIcon className="h-5 w-5" /> : <BarChart3 className="h-5 w-5" />}
                    {showTable ? 'Data Table' : 'Chart Visualization'}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showTable ? (
                  <div className="overflow-auto max-h-96">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted">
                          {columns.map(col => (
                            <th key={col} className="border border-border p-2 text-left font-medium">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.slice(0, 100).map((row, index) => (
                          <tr key={index} className="hover:bg-muted/50">
                            {columns.map(col => (
                              <td key={col} className="border border-border p-2">
                                {row[col]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredData.length > 100 && (
                      <p className="text-muted-foreground text-sm mt-2">
                        Showing first 100 rows of {filteredData.length} total records
                      </p>
                    )}
                  </div>
                ) : (
                  <ChartContainer config={chartConfig} className="min-h-[400px]">
                    {renderChart()}
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* Data Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Data Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{filteredData.length}</div>
                    <div className="text-sm text-muted-foreground">Records</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{columns.length}</div>
                    <div className="text-sm text-muted-foreground">Columns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {columns.filter(col => originalData.some(row => typeof row[col] === 'number')).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Numeric</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {columns.filter(col => originalData.some(row => typeof row[col] === 'string')).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Text</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default CSVAnalysis;
