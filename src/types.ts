export type CivicCategory = "Sanitation" | "Roads & Infrastructure" | "Water Supply" | "Electricity" | "Other";
export type CivicPriority = "Low" | "Medium" | "High";
export type CivicStatus = "Pending" | "In Progress" | "Resolved";

export interface TrackingStep {
  status: string;
  title: string;
  timestamp: string;
  completed: boolean;
  description: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: CivicCategory;
  priority: CivicPriority;
  isHazard: boolean;
  status: CivicStatus;
  reportedAt: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image: string | null;
  upvotes: number;
  hasUpvoted?: boolean;
  citizenId: string;
  citizenName: string;
  notes: string | null;
  trackingTimeline: TrackingStep[];
  assignedAuthority: string;
  assignedOfficer?: string;
  resolutionTimeEstimate?: string;
  aiExplanation?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "citizen" | "admin";
  city: string;
  avatar: string;
  points: number;
  resolvedCount: number;
  impactLevel: string;
  nextLevelPoints: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface CityHub {
  name: string;
  state: string;
  solvedCount: number;
  activeCount: number;
  citizenRating: number;
  image: string;
  lat: number;
  lng: number;
}
