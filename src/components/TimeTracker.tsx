
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown, Plus, Minus, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

interface Employee {
  Name: string;
  GPN: number;
  'Updated Designation': string;
  Manager: string;
}

interface Client {
  Account: string;
  'BU Partner 2': string;
  'CAD Manager': string;
  Complexity: string;
  Location: string;
}

interface ClientRow {
  id: string;
  clientName: string;
  task: string;
  hours: string;
  remarks: string;
}

const TASK_OPTIONS = [
  'Annual Return Data Preparation',
  'Idle Time',
  'Automation',
  'Monthly Compliances',
  'MIS Working (Mention Client Wise)',
  'Litigation Support',
  'Support in Taking New Registration',
  'Support in Refund Filing / Working',
  'Amendments in the Existing Registration (Core / Non-core)',
  'Other Work - Any other please specify in Remarks Column',
  'Leave',
  'Trainings',
  'CAD Practice Set-Up'
];

const TimeTracker = () => {
  const { toast } = useToast();
  
  // Form state
  const [employeeName, setEmployeeName] = useState('');
  const [weekEnding, setWeekEnding] = useState<Date>();
  const [clientRows, setClientRows] = useState<ClientRow[]>([
    { id: '1', clientName: '', task: '', hours: '', remarks: '' }
  ]);

  // Derived values from selections
  const [employeeData, setEmployeeData] = useState({
    employeeGPN: null as number | null,
    designation: '',
    vertical: ''
  });

  const [clientData, setClientData] = useState<Record<string, {
    partner: string;
    cadManager: string;
    complexity: string;
    location: string;
  }>>({});

  // Data state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  // Dropdown open states
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const [clientDropdownOpen, setClientDropdownOpen] = useState<Record<string, boolean>>({});
  const [weekEndingOpen, setWeekEndingOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch employees
      const { data: employeeData, error: employeeError } = await supabase
        .from('employee')
        .select('Name, GPN, "Updated Designation", Manager');
      
      if (employeeError) {
        console.error('Error loading employees:', employeeError);
        toast({
          title: "Error",
          description: "Failed to load employees",
          variant: "destructive"
        });
      } else {
        setEmployees(employeeData || []);
      }

      // Fetch clients
      const { data: clientData, error: clientError } = await supabase
        .from('Client')
        .select('Account, "BU Partner 2", "CAD Manager", Complexity, Location');
      
      if (clientError) {
        console.error('Error loading clients:', clientError);
        toast({
          title: "Error",
          description: "Failed to load clients",
          variant: "destructive"
        });
      } else {
        setClients(clientData || []);
      }

    } catch (error) {
      console.error('Error loading initial data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSelection = (selectedEmployeeName: string) => {
    const selectedEmployee = employees.find(emp => emp.Name === selectedEmployeeName);
    
    setEmployeeName(selectedEmployeeName);
    
    if (selectedEmployee) {
      setEmployeeData({
        employeeGPN: selectedEmployee.GPN,
        designation: selectedEmployee['Updated Designation'] || '',
        vertical: selectedEmployee.Manager || ''
      });
    }
    setEmployeeDropdownOpen(false);
  };

  const handleClientSelection = (rowId: string, clientName: string) => {
    const selectedClient = clients.find(client => client.Account === clientName);
    
    // Update the specific row's client name
    setClientRows(prev => prev.map(row => 
      row.id === rowId ? { ...row, clientName } : row
    ));
    
    // Store client derived data
    if (selectedClient) {
      setClientData(prev => ({
        ...prev,
        [rowId]: {
          partner: selectedClient['BU Partner 2'] || '',
          cadManager: selectedClient['CAD Manager'] || '',
          complexity: selectedClient.Complexity || '',
          location: selectedClient.Location || ''
        }
      }));
    }
    
    setClientDropdownOpen(prev => ({ ...prev, [rowId]: false }));
  };

  const updateClientRow = (rowId: string, field: keyof ClientRow, value: string) => {
    setClientRows(prev => prev.map(row => 
      row.id === rowId ? { ...row, [field]: value } : row
    ));
  };

  const addClientRow = () => {
    const newId = Date.now().toString();
    setClientRows(prev => [...prev, { 
      id: newId, 
      clientName: '', 
      task: '', 
      hours: '', 
      remarks: '' 
    }]);
  };

  const removeClientRow = () => {
    if (clientRows.length > 1) {
      const lastRowId = clientRows[clientRows.length - 1].id;
      setClientRows(prev => prev.slice(0, -1));
      
      // Clean up client data for removed row
      setClientData(prev => {
        const newData = { ...prev };
        delete newData[lastRowId];
        return newData;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!employeeName) errors.push('Employee name is required');
    if (!weekEnding) errors.push('Week ending date is required');
    
    clientRows.forEach((row, index) => {
      if (!row.clientName) errors.push(`Client name is required for row ${index + 1}`);
      if (!row.task) errors.push(`Task is required for row ${index + 1}`);
      
      const hours = parseFloat(row.hours);
      if (!row.hours || isNaN(hours) || hours <= 0) {
        errors.push(`Valid hours required for row ${index + 1}`);
      }

      if (row.task === 'Other Work - Any other please specify in Remarks Column' && !row.remarks.trim()) {
        errors.push(`Remarks are required for "Other Work" in row ${index + 1}`);
      }
    });

    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(', '),
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Prepare bulk insert data
      const timesheetEntries = clientRows.map(row => {
        const rowClientData = clientData[row.id] || {};
        
        return {
          'Employee Name': employeeName,
          'Employee GPN': employeeData.employeeGPN,
          'Designation': employeeData.designation,
          'Vertical': employeeData.vertical,
          'Client Name': row.clientName,
          'Partner': rowClientData.partner,
          'CAD Manager': rowClientData.cadManager,
          'Complexity': rowClientData.complexity,
          'Location': rowClientData.location,
          'Task': row.task,
          'Hours': parseInt(row.hours),
          'Remarks': row.remarks,
          'Week Ending': weekEnding!.toISOString().split('T')[0],
          'Month': weekEnding!.toLocaleString('default', { month: 'long', year: 'numeric' })
        };
      });

      const { error } = await supabase
        .from('Timesheet')
        .insert(timesheetEntries);

      if (error) {
        console.error('Error submitting timesheet:', error);
        toast({
          title: "Error",
          description: `Failed to submit timesheet: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: `${clientRows.length} time entries submitted successfully!`,
      });

      // Reset form
      setEmployeeName('');
      setWeekEnding(undefined);
      setClientRows([{ id: '1', clientName: '', task: '', hours: '', remarks: '' }]);
      setEmployeeData({ employeeGPN: null, designation: '', vertical: '' });
      setClientData({});

    } catch (error) {
      console.error('Error submitting timesheet:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div>Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Excel Time Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fixed Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          {/* Employee Name */}
          <div className="space-y-2">
            <Label htmlFor="employeeName">Employee Name *</Label>
            <DropdownMenu open={employeeDropdownOpen} onOpenChange={setEmployeeDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={employeeDropdownOpen}
                  className="w-full justify-between"
                >
                  {employeeName || "Select employee..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search employees..." />
                  <CommandList>
                    <CommandEmpty>No employee found.</CommandEmpty>
                    <CommandGroup>
                      {employees.map((employee) => (
                        <CommandItem
                          key={employee.Name}
                          value={employee.Name}
                          onSelect={() => handleEmployeeSelection(employee.Name)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              employeeName === employee.Name ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {employee.Name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Week Ending */}
          <div className="space-y-2">
            <Label>Week Ending *</Label>
            <Popover open={weekEndingOpen} onOpenChange={setWeekEndingOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !weekEnding && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {weekEnding ? format(weekEnding, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={weekEnding}
                  onSelect={(date) => {
                    setWeekEnding(date);
                    setWeekEndingOpen(false);
                  }}
                  disabled={(date) =>
                    date < new Date("1980-01-01") || date > new Date("2050-12-31")
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-2 p-2 bg-gray-100 rounded-lg font-semibold text-sm">
          <div className="col-span-3">Client Name</div>
          <div className="col-span-2">Task</div>
          <div className="col-span-2">Hours</div>
          <div className="col-span-4">Remarks</div>
          <div className="col-span-1">Actions</div>
        </div>

        {/* Dynamic Client Rows */}
        <div className="space-y-2">
          {clientRows.map((row, index) => (
            <div key={row.id} className="grid grid-cols-12 gap-2 p-2 border rounded-lg">
              {/* Client Name */}
              <div className="col-span-3">
                <DropdownMenu 
                  open={clientDropdownOpen[row.id] || false} 
                  onOpenChange={(open) => setClientDropdownOpen(prev => ({ ...prev, [row.id]: open }))}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between text-sm"
                    >
                      {row.clientName || "Select client..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search clients..." />
                      <CommandList>
                        <CommandEmpty>No client found.</CommandEmpty>
                        <CommandGroup>
                          {clients.map((client) => (
                            <CommandItem
                              key={client.Account}
                              value={client.Account}
                              onSelect={() => handleClientSelection(row.id, client.Account)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  row.clientName === client.Account ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {client.Account}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Task */}
              <div className="col-span-2">
                <Select value={row.task} onValueChange={(value) => updateClientRow(row.id, 'task', value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select task" />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_OPTIONS.map((task) => (
                      <SelectItem key={task} value={task} className="text-sm">
                        {task}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Hours */}
              <div className="col-span-2">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={row.hours}
                  onChange={(e) => updateClientRow(row.id, 'hours', e.target.value)}
                  placeholder="Hours"
                  className="text-sm"
                />
              </div>

              {/* Remarks */}
              <div className="col-span-4">
                <Textarea
                  value={row.remarks}
                  onChange={(e) => updateClientRow(row.id, 'remarks', e.target.value)}
                  placeholder="Optional comments..."
                  className="text-sm min-h-[40px]"
                  rows={1}
                />
              </div>

              {/* Actions */}
              <div className="col-span-1 flex gap-1">
                {index === 0 && (
                  <Button
                    onClick={addClientRow}
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
                {index === clientRows.length - 1 && clientRows.length > 1 && (
                  <Button
                    onClick={removeClientRow}
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Display derived values for reference */}
        {(employeeName || clientRows.some(row => row.clientName)) && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-2">Auto-filled Information:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              {employeeName && (
                <>
                  <div><strong>GPN:</strong> {employeeData.employeeGPN}</div>
                  <div><strong>Designation:</strong> {employeeData.designation}</div>
                  <div><strong>Vertical:</strong> {employeeData.vertical}</div>
                </>
              )}
              {Object.entries(clientData).map(([rowId, data]) => {
                const row = clientRows.find(r => r.id === rowId);
                return row?.clientName ? (
                  <div key={rowId} className="col-span-full">
                    <div className="font-medium">{row.clientName}:</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-1 text-xs mt-1">
                      <div><strong>Partner:</strong> {data.partner}</div>
                      <div><strong>CAD Manager:</strong> {data.cadManager}</div>
                      <div><strong>Complexity:</strong> {data.complexity}</div>
                      <div><strong>Location:</strong> {data.location}</div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="w-full" size="lg">
          Submit {clientRows.length} Time {clientRows.length === 1 ? 'Entry' : 'Entries'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TimeTracker;
