
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
  const [formData, setFormData] = useState({
    employeeName: '',
    clientName: '',
    task: '',
    hours: '',
    remarks: ''
  });

  // Derived values from selections
  const [derivedData, setDerivedData] = useState({
    employeeGPN: null as number | null,
    designation: '',
    vertical: '',
    partner: '',
    cadManager: '',
    complexity: '',
    location: ''
  });

  // Data state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  // Dropdown open states
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);

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

  const handleEmployeeSelection = (employeeName: string) => {
    const selectedEmployee = employees.find(emp => emp.Name === employeeName);
    
    setFormData(prev => ({ ...prev, employeeName }));
    
    if (selectedEmployee) {
      setDerivedData(prev => ({
        ...prev,
        employeeGPN: selectedEmployee.GPN,
        designation: selectedEmployee['Updated Designation'] || '',
        vertical: selectedEmployee.Manager || ''
      }));
    }
    setEmployeeDropdownOpen(false);
  };

  const handleClientSelection = (clientName: string) => {
    const selectedClient = clients.find(client => client.Account === clientName);
    
    setFormData(prev => ({ ...prev, clientName }));
    
    if (selectedClient) {
      setDerivedData(prev => ({
        ...prev,
        partner: selectedClient['BU Partner 2'] || '',
        cadManager: selectedClient['CAD Manager'] || '',
        complexity: selectedClient.Complexity || '',
        location: selectedClient.Location || ''
      }));
    }
    setClientDropdownOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.employeeName) errors.push('Employee name is required');
    if (!formData.clientName) errors.push('Client name is required');
    if (!formData.task) errors.push('Task is required');
    
    const hours = parseFloat(formData.hours);
    if (!formData.hours || isNaN(hours) || hours <= 0) {
      errors.push('Hours must be a positive number');
    }

    if (formData.task === 'Other Work - Any other please specify in Remarks Column' && !formData.remarks.trim()) {
      errors.push('Remarks are required when selecting "Other Work - Any other please specify in Remarks Column"');
    }

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
      const timesheetEntry = {
        'Employee Name': formData.employeeName,
        'Employee GPN': derivedData.employeeGPN,
        'Designation': derivedData.designation,
        'Vertical': derivedData.vertical,
        'Client Name': formData.clientName,
        'Partner': derivedData.partner,
        'CAD Manager': derivedData.cadManager,
        'Complexity': derivedData.complexity,
        'Location': derivedData.location,
        'Task': formData.task,
        'Hours': parseInt(formData.hours),
        'Remarks': formData.remarks,
        'Week Ending': new Date().toISOString().split('T')[0], // Current date
        'Month': new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
      };

      const { error } = await supabase
        .from('Timesheet')
        .insert([timesheetEntry]);

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
        description: "Time entry submitted successfully!",
      });

      // Reset form
      setFormData({
        employeeName: '',
        clientName: '',
        task: '',
        hours: '',
        remarks: ''
      });

      setDerivedData({
        employeeGPN: null,
        designation: '',
        vertical: '',
        partner: '',
        cadManager: '',
        complexity: '',
        location: ''
      });

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
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div>Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Excel Time Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Employee Name Searchable Dropdown */}
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
                {formData.employeeName || "Select employee..."}
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
                            formData.employeeName === employee.Name ? "opacity-100" : "opacity-0"
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

        {/* Client Name Searchable Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name *</Label>
          <DropdownMenu open={clientDropdownOpen} onOpenChange={setClientDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={clientDropdownOpen}
                className="w-full justify-between"
              >
                {formData.clientName || "Select client..."}
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
                        onSelect={() => handleClientSelection(client.Account)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.clientName === client.Account ? "opacity-100" : "opacity-0"
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

        {/* Task Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="task">Task *</Label>
          <Select value={formData.task} onValueChange={(value) => handleInputChange('task', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a task" />
            </SelectTrigger>
            <SelectContent>
              {TASK_OPTIONS.map((task) => (
                <SelectItem key={task} value={task}>
                  {task}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Hours Input */}
        <div className="space-y-2">
          <Label htmlFor="hours">Hours *</Label>
          <Input
            id="hours"
            type="number"
            step="0.1"
            min="0"
            value={formData.hours}
            onChange={(e) => handleInputChange('hours', e.target.value)}
            placeholder="Enter hours (e.g., 2.5)"
          />
        </div>

        {/* Remarks */}
        <div className="space-y-2">
          <Label htmlFor="remarks">
            Remarks {formData.task === 'Other Work - Any other please specify in Remarks Column' && '*'}
          </Label>
          <Textarea
            id="remarks"
            value={formData.remarks}
            onChange={(e) => handleInputChange('remarks', e.target.value)}
            placeholder="Optional comments..."
            rows={3}
          />
        </div>

        {/* Display derived values for reference */}
        {(formData.employeeName || formData.clientName) && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-2">Auto-filled Information:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {formData.employeeName && (
                <>
                  <div><strong>GPN:</strong> {derivedData.employeeGPN}</div>
                  <div><strong>Designation:</strong> {derivedData.designation}</div>
                  <div><strong>Vertical:</strong> {derivedData.vertical}</div>
                </>
              )}
              {formData.clientName && (
                <>
                  <div><strong>Partner:</strong> {derivedData.partner}</div>
                  <div><strong>CAD Manager:</strong> {derivedData.cadManager}</div>
                  <div><strong>Complexity:</strong> {derivedData.complexity}</div>
                  <div><strong>Location:</strong> {derivedData.location}</div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="w-full">
          Submit Time Entry
        </Button>
      </CardContent>
    </Card>
  );
};

export default TimeTracker;
