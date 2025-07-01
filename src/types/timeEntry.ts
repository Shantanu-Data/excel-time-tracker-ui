
export interface TimeEntry {
  'Employee Name': string;
  'Employee GPN': number | null;
  'Designation': string | null;
  'Vertical': string | null;
  'Client Name': string;
  'Partner': string | null;
  'CAD Manager': string | null;
  'Complexity': string | null;
  'Location': string | null;
  'Task': string | null;
  'Hours': number | null;
  'Remarks': string | null;
  'Week Ending': string | null;
  'Month': string | null;
  'Status': string | null;
  'Sent by': string | null;
  'Cost2': number | null;
  'Percentage2': number | null;
  'Partner-2': string | null;
  'Location-2': string | null;
}

export interface Employee {
  Name: string;
  GPN: number | null;
  'Updated Designation': string | null;
  Manager: string | null;
}

export interface Client {
  Account: string;
  'Updated BU Partner': string | null;
  'Activity Code': number | null;
  'Active/ Left': string | null;
  Location: string | null;
  'Vertical 2': string | null;
  'Complexity2': string | null;
  Complexity: string | null;
  'Bu Manager': string | null;
  'BU Partner 2': string | null;
  'CAD Manager': string | null;
  Vertical: string | null;
}
