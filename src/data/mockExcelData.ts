
import { MockExcelData } from '@/types/timeEntry';

export const mockExcelData: MockExcelData = {
  projects: [
    {
      name: "Website Development",
      subProjects: ["Frontend", "Backend", "Database"],
      tasks: [
        {
          name: "UI Design",
          subProject: "Frontend",
          categories: ["Research", "Design", "Implementation", "Testing"]
        },
        {
          name: "Component Development",
          subProject: "Frontend",
          categories: ["Development", "Testing", "Code Review"]
        },
        {
          name: "API Development",
          subProject: "Backend",
          categories: ["Planning", "Development", "Testing", "Documentation"]
        },
        {
          name: "Database Design",
          subProject: "Database",
          categories: ["Schema Design", "Migration", "Optimization", "Testing"]
        }
      ]
    },
    {
      name: "Mobile App",
      subProjects: ["iOS", "Android", "Cross-Platform"],
      tasks: [
        {
          name: "App Architecture",
          subProject: "iOS",
          categories: ["Planning", "Research", "Implementation"]
        },
        {
          name: "User Interface",
          subProject: "iOS",
          categories: ["Design", "Development", "Testing"]
        },
        {
          name: "Native Development",
          subProject: "Android",
          categories: ["Development", "Testing", "Performance"]
        },
        {
          name: "React Native Setup",
          subProject: "Cross-Platform",
          categories: ["Setup", "Development", "Testing", "Deployment"]
        }
      ]
    },
    {
      name: "Data Analytics",
      subProjects: ["Data Collection", "Processing", "Visualization"],
      tasks: [
        {
          name: "Data Mining",
          subProject: "Data Collection",
          categories: ["Research", "Implementation", "Validation"]
        },
        {
          name: "ETL Pipeline",
          subProject: "Processing",
          categories: ["Design", "Development", "Testing", "Monitoring"]
        },
        {
          name: "Dashboard Creation",
          subProject: "Visualization",
          categories: ["Design", "Development", "User Testing"]
        }
      ]
    }
  ],
  timeEntries: [
    {
      id: "1",
      name: "John Doe",
      project: "Website Development",
      subProject: "Frontend",
      task: "UI Design",
      category: "Research",
      hours: 4,
      startTime: "09:00",
      endTime: "13:00",
      comments: "Initial research on design patterns",
      timestamp: "2024-01-15T09:00:00Z"
    },
    {
      id: "2",
      name: "Jane Smith",
      project: "Mobile App",
      subProject: "iOS",
      task: "App Architecture",
      category: "Planning",
      hours: 2.5,
      startTime: "14:00",
      endTime: "16:30",
      comments: "Planned the overall app structure",
      timestamp: "2024-01-15T14:00:00Z"
    }
  ]
};
