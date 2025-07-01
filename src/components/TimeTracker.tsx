
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { mockExcelData } from '@/data/mockExcelData';
import { TimeEntry } from '@/types/timeEntry';

const TimeTracker = () => {
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    project: '',
    subProject: '',
    task: '',
    category: '',
    hours: '',
    startTime: '',
    endTime: '',
    comments: ''
  });

  // Dropdown options state
  const [dropdownOptions, setDropdownOptions] = useState({
    projects: [] as string[],
    subProjects: [] as string[],
    tasks: [] as string[],
    categories: [] as string[]
  });

  // Initialize dropdown options
  useEffect(() => {
    setDropdownOptions({
      projects: mockExcelData.projects.map(p => p.name),
      subProjects: [],
      tasks: [],
      categories: []
    });
  }, []);

  // Update sub-projects when project changes
  useEffect(() => {
    if (formData.project) {
      const selectedProject = mockExcelData.projects.find(p => p.name === formData.project);
      setDropdownOptions(prev => ({
        ...prev,
        subProjects: selectedProject?.subProjects || [],
        tasks: [],
        categories: []
      }));
      setFormData(prev => ({ ...prev, subProject: '', task: '', category: '' }));
    }
  }, [formData.project]);

  // Update tasks when sub-project changes
  useEffect(() => {
    if (formData.project && formData.subProject) {
      const selectedProject = mockExcelData.projects.find(p => p.name === formData.project);
      const tasks = selectedProject?.tasks?.filter(t => t.subProject === formData.subProject).map(t => t.name) || [];
      setDropdownOptions(prev => ({
        ...prev,
        tasks,
        categories: []
      }));
      setFormData(prev => ({ ...prev, task: '', category: '' }));
    }
  }, [formData.project, formData.subProject]);

  // Update categories when task changes
  useEffect(() => {
    if (formData.project && formData.subProject && formData.task) {
      const selectedProject = mockExcelData.projects.find(p => p.name === formData.project);
      const selectedTask = selectedProject?.tasks?.find(t => t.name === formData.task && t.subProject === formData.subProject);
      setDropdownOptions(prev => ({
        ...prev,
        categories: selectedTask?.categories || []
      }));
      setFormData(prev => ({ ...prev, category: '' }));
    }
  }, [formData.project, formData.subProject, formData.task]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.project) errors.push('Project is required');
    if (!formData.subProject) errors.push('Sub Project is required');
    if (!formData.task) errors.push('Task is required');
    if (!formData.category) errors.push('Category is required');
    
    const hours = parseFloat(formData.hours);
    if (!formData.hours || isNaN(hours) || hours <= 0) {
      errors.push('Hours must be a positive number');
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(`1970-01-01T${formData.startTime}`);
      const end = new Date(`1970-01-01T${formData.endTime}`);
      if (start >= end) {
        errors.push('End time must be after start time');
      }
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

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      name: formData.name,
      project: formData.project,
      subProject: formData.subProject,
      task: formData.task,
      category: formData.category,
      hours: parseFloat(formData.hours),
      startTime: formData.startTime,
      endTime: formData.endTime,
      comments: formData.comments,
      timestamp: new Date().toISOString()
    };

    // Add to mock data (simulating Excel write)
    mockExcelData.timeEntries.push(newEntry);

    toast({
      title: "Success",
      description: `Time entry saved successfully! Entry ID: ${newEntry.id}`,
    });

    // Reset form
    setFormData({
      name: '',
      project: '',
      subProject: '',
      task: '',
      category: '',
      hours: '',
      startTime: '',
      endTime: '',
      comments: ''
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Excel Time Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Name Input */}
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        {/* Project Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="project">Project *</Label>
          <Select value={formData.project} onValueChange={(value) => handleInputChange('project', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {dropdownOptions.projects.map((project) => (
                <SelectItem key={project} value={project}>
                  {project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sub Project Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="subProject">Sub Project *</Label>
          <Select 
            value={formData.subProject} 
            onValueChange={(value) => handleInputChange('subProject', value)}
            disabled={!formData.project}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a sub project" />
            </SelectTrigger>
            <SelectContent>
              {dropdownOptions.subProjects.map((subProject) => (
                <SelectItem key={subProject} value={subProject}>
                  {subProject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Task Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="task">Task *</Label>
          <Select 
            value={formData.task} 
            onValueChange={(value) => handleInputChange('task', value)}
            disabled={!formData.subProject}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a task" />
            </SelectTrigger>
            <SelectContent>
              {dropdownOptions.tasks.map((task) => (
                <SelectItem key={task} value={task}>
                  {task}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => handleInputChange('category', value)}
            disabled={!formData.task}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {dropdownOptions.categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
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
            step="0.25"
            min="0"
            value={formData.hours}
            onChange={(e) => handleInputChange('hours', e.target.value)}
            placeholder="Enter hours (e.g., 2.5)"
          />
        </div>

        {/* Time Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
            />
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-2">
          <Label htmlFor="comments">Comments</Label>
          <Textarea
            id="comments"
            value={formData.comments}
            onChange={(e) => handleInputChange('comments', e.target.value)}
            placeholder="Optional comments..."
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="w-full">
          Submit Time Entry
        </Button>
      </CardContent>
    </Card>
  );
};

export default TimeTracker;
