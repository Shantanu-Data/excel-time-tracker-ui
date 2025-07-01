
export interface TimeEntry {
  id: string;
  name: string;
  project: string;
  subProject: string;
  task: string;
  category: string;
  hours: number;
  startTime?: string;
  endTime?: string;
  comments?: string;
  timestamp: string;
}

export interface Project {
  name: string;
  subProjects: string[];
  tasks?: Task[];
}

export interface Task {
  name: string;
  subProject: string;
  categories: string[];
}

export interface MockExcelData {
  projects: Project[];
  timeEntries: TimeEntry[];
}
