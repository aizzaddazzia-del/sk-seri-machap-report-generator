export enum UnitType {
  KURIKULUM = 'Unit Kurikulum',
  HEM = 'Unit Hal Ehwal Murid',
  KOKURIKULUM = 'Unit Kokurikulum'
}

export interface ReportData {
  programName: string;
  organizerCustom: string;
  organizerUnit: UnitType | '';
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  target: string;
  objectives: string;
  activities: string;
  strengths: string;
  weaknesses: string;
  preparedBy: {
    name: string;
    position: string;
  };
  verifiedBy: {
    name: string;
    position: string;
  };
  images: string[];
}