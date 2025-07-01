export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Client: {
        Row: {
          Account: string
          "Active/ Left": string | null
          "Activity Code": number | null
          "Bu Manager": string | null
          "BU Partner 2": string | null
          "CAD Manager": string | null
          Complexity: string | null
          Complexity2: string | null
          Location: string | null
          "Updated BU Partner": string | null
          Vertical: string | null
          "Vertical 2": string | null
        }
        Insert: {
          Account: string
          "Active/ Left"?: string | null
          "Activity Code"?: number | null
          "Bu Manager"?: string | null
          "BU Partner 2"?: string | null
          "CAD Manager"?: string | null
          Complexity?: string | null
          Complexity2?: string | null
          Location?: string | null
          "Updated BU Partner"?: string | null
          Vertical?: string | null
          "Vertical 2"?: string | null
        }
        Update: {
          Account?: string
          "Active/ Left"?: string | null
          "Activity Code"?: number | null
          "Bu Manager"?: string | null
          "BU Partner 2"?: string | null
          "CAD Manager"?: string | null
          Complexity?: string | null
          Complexity2?: string | null
          Location?: string | null
          "Updated BU Partner"?: string | null
          Vertical?: string | null
          "Vertical 2"?: string | null
        }
        Relationships: []
      }
      employee: {
        Row: {
          GPN: number | null
          Manager: string | null
          Name: string
          "Updated Designation": string | null
        }
        Insert: {
          GPN?: number | null
          Manager?: string | null
          Name: string
          "Updated Designation"?: string | null
        }
        Update: {
          GPN?: number | null
          Manager?: string | null
          Name?: string
          "Updated Designation"?: string | null
        }
        Relationships: []
      }
      Timesheet: {
        Row: {
          "CAD Manager": string | null
          "Client Name": string
          Complexity: string | null
          Cost2: number | null
          Designation: string | null
          "Employee GPN": number | null
          "Employee Name": string
          Hours: number | null
          Location: string | null
          "Location-2": string | null
          Month: string | null
          Partner: string | null
          "Partner-2": string | null
          Percentage2: number | null
          Remarks: string | null
          "Sent by": string | null
          Status: string | null
          Task: string | null
          Vertical: string | null
          "Week Ending": string | null
        }
        Insert: {
          "CAD Manager"?: string | null
          "Client Name": string
          Complexity?: string | null
          Cost2?: number | null
          Designation?: string | null
          "Employee GPN"?: number | null
          "Employee Name": string
          Hours?: number | null
          Location?: string | null
          "Location-2"?: string | null
          Month?: string | null
          Partner?: string | null
          "Partner-2"?: string | null
          Percentage2?: number | null
          Remarks?: string | null
          "Sent by"?: string | null
          Status?: string | null
          Task?: string | null
          Vertical?: string | null
          "Week Ending"?: string | null
        }
        Update: {
          "CAD Manager"?: string | null
          "Client Name"?: string
          Complexity?: string | null
          Cost2?: number | null
          Designation?: string | null
          "Employee GPN"?: number | null
          "Employee Name"?: string
          Hours?: number | null
          Location?: string | null
          "Location-2"?: string | null
          Month?: string | null
          Partner?: string | null
          "Partner-2"?: string | null
          Percentage2?: number | null
          Remarks?: string | null
          "Sent by"?: string | null
          Status?: string | null
          Task?: string | null
          Vertical?: string | null
          "Week Ending"?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
