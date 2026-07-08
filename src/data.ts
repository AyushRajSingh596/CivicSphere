import { Complaint, UserProfile, CityHub } from "./types";

export const initialCitizen: UserProfile = {
  id: "USR-0824",
  name: "Arjun Sharma",
  email: "arjun.sharma@gmail.com",
  phone: "+91 98765 43210",
  role: "citizen",
  city: "Bengaluru",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  points: 1240,
  resolvedCount: 42,
  impactLevel: "Silver Guardian",
  nextLevelPoints: 1500
};

export const initialAdmin: UserProfile = {
  id: "ADM-9942",
  name: "Rajesh Kumar",
  email: "r.kumar@bbmp.gov.in",
  phone: "+91 94440 12345",
  role: "admin",
  city: "Bengaluru (South Zone)",
  avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150",
  points: 0,
  resolvedCount: 1894,
  impactLevel: "Superintendent Engineer",
  nextLevelPoints: 0
};

export const initialCities: CityHub[] = [
  {
    name: "Indore",
    state: "Madhya Pradesh",
    solvedCount: 14230,
    activeCount: 120,
    citizenRating: 4.9,
    image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=400",
    lat: 22.7196,
    lng: 75.8577
  },
  {
    name: "Bengaluru",
    state: "Karnataka",
    solvedCount: 12480,
    activeCount: 412,
    citizenRating: 4.7,
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=400",
    lat: 12.9716,
    lng: 77.5946
  },
  {
    name: "Pune",
    state: "Maharashtra",
    solvedCount: 9320,
    activeCount: 235,
    citizenRating: 4.6,
    image: "https://images.unsplash.com/photo-1601999109332-542b18dbec57?auto=format&fit=crop&q=80&w=400",
    lat: 18.5204,
    lng: 73.8567
  },
  {
    name: "Hyderabad",
    state: "Telangana",
    solvedCount: 11150,
    activeCount: 304,
    citizenRating: 4.7,
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=400",
    lat: 17.3850,
    lng: 78.4867
  }
];

export const initialComplaints: Complaint[] = [
  {
    id: "CIV-8842",
    title: "Large Sinkhole on Main Access Road",
    description: "A huge sinkhole has developed right in the middle of the main access road near Sector 4. It's about 4 feet deep and posing an extreme danger to commuters, especially two-wheelers at night. Local residents have placed a few branches to warn vehicles, but it requires immediate municipal action before an accident occurs.",
    category: "Roads & Infrastructure",
    priority: "High",
    isHazard: true,
    status: "In Progress",
    reportedAt: "2026-07-06T10:30:00.000Z",
    address: "Outer Ring Road, Block C, Sector 4, HSR Layout, Bengaluru, Karnataka 560102",
    coordinates: { lat: 12.9121, lng: 77.6445 },
    image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600",
    upvotes: 36,
    hasUpvoted: true,
    citizenId: "USR-0824",
    citizenName: "Arjun Sharma",
    notes: "Assigned to BBMP South Zone Road Maintenance department. Sub-contractor dispatched.",
    assignedAuthority: "BBMP Road Infrastructure Division",
    assignedOfficer: "Srinivas Reddy (Executive Engineer)",
    resolutionTimeEstimate: "18.4 hrs remaining",
    aiExplanation: "AI Classifier prioritized this as HIGH due to 'sinkhole' posing immediate safety risk to two-wheelers & active heavy traffic.",
    trackingTimeline: [
      {
        status: "Reported",
        title: "Complaint Lodged",
        timestamp: "July 6, 10:30 AM",
        completed: true,
        description: "Citizen reported via CivicSphere App with visual evidence."
      },
      {
        status: "AI Analysis Complete",
        title: "AI Analysis & Categorization",
        timestamp: "July 6, 10:31 AM",
        completed: true,
        description: "AI automatically classified under 'Roads & Infrastructure' and flag priority as High."
      },
      {
        status: "Assigned to BBMP",
        title: "Department Assigned",
        timestamp: "July 6, 2:15 PM",
        completed: true,
        description: "Assigned to BBMP South Zone Road Division. Officer Srinivas Reddy designated."
      },
      {
        status: "Team Dispatched",
        title: "Team Dispatched",
        timestamp: "July 7, 9:00 AM",
        completed: true,
        description: "Field squad dispatched with temporary sandbags and barricades."
      },
      {
        status: "Resolved",
        title: "Resolution Verified",
        timestamp: "In Progress",
        completed: false,
        description: "Awaiting final asphalt patching work to complete road restoration."
      }
    ]
  },
  {
    id: "CIV-2481",
    title: "Overflowing Open Drain near Sector 15 Market",
    description: "The main stormwater drain (nala) adjacent to the central vegetable market has completely clogged up. Garbage and plastic bags are blocking the flow, and dirty water has overflowed onto the footpaths, creating an unbearable stench and high dengue risk. Over 100 shopkeepers are affected.",
    category: "Sanitation",
    priority: "High",
    isHazard: true,
    status: "Pending",
    reportedAt: "2026-07-07T14:20:00.000Z",
    address: "Municipal Market Road, Sector 15, HSR Layout, Bengaluru, Karnataka 560102",
    coordinates: { lat: 12.9150, lng: 77.6410 },
    image: "https://images.unsplash.com/photo-1545258122-4792c68f2f21?auto=format&fit=crop&q=80&w=600",
    upvotes: 18,
    citizenId: "USR-0931",
    citizenName: "Preeti Patel",
    notes: null,
    assignedAuthority: "BBMP Solid Waste Management Division",
    assignedOfficer: "Manjunath Swamy",
    resolutionTimeEstimate: "Awaiting Schedule",
    aiExplanation: "AI Classifier flagged this as Sanitation / Dengue Risk - High Urgency due to food marketplace proximity.",
    trackingTimeline: [
      {
        status: "Reported",
        title: "Complaint Lodged",
        timestamp: "July 7, 2:20 PM",
        completed: true,
        description: "Citizen reported overflowing drain with location verification."
      },
      {
        status: "AI Analysis Complete",
        title: "AI Analysis Complete",
        timestamp: "July 7, 2:21 PM",
        completed: true,
        description: "AI flagged public health hazard due to sewage near marketplace."
      },
      {
        status: "Assigned",
        title: "Department Assignment",
        timestamp: "Awaiting",
        completed: false,
        description: "SWM engineer review in progress."
      }
    ]
  },
  {
    id: "CIV-1052",
    title: "Broken Streetlight on 14th Main Road",
    description: "Three consecutive streetlights are out since last Friday on the dark corner of 14th Main Road. This has turned the entire lane extremely dark, making it unsafe for women walking from the nearby metro station. Safety concern is high.",
    category: "Electricity",
    priority: "Medium",
    isHazard: false,
    status: "Resolved",
    reportedAt: "2026-07-03T20:10:00.000Z",
    address: "14th Main Road, Sector 3, HSR Layout, Bengaluru, Karnataka 560102",
    coordinates: { lat: 12.9105, lng: 77.6480 },
    image: null,
    upvotes: 12,
    hasUpvoted: false,
    citizenId: "USR-0824",
    citizenName: "Arjun Sharma",
    notes: "Bulbs replaced with 40W LED units on standard municipal poles. Issue closed.",
    assignedAuthority: "BESCOM Ward Maintenance Unit",
    assignedOfficer: "Anwar Pasha",
    resolutionTimeEstimate: "Resolved in 24 hrs",
    aiExplanation: "Classified as Electricity. Priority: Medium. Safety concern noted but no active electrocution risk.",
    trackingTimeline: [
      {
        status: "Reported",
        title: "Complaint Lodged",
        timestamp: "July 3, 8:10 PM",
        completed: true,
        description: "Streetlight outage logged."
      },
      {
        status: "Assigned",
        title: "Assigned to BESCOM",
        timestamp: "July 4, 8:00 AM",
        completed: true,
        description: "Ward electrical maintenance team assigned."
      },
      {
        status: "Resolved",
        title: "Bulbs Replaced & Closed",
        timestamp: "July 4, 4:30 PM",
        completed: true,
        description: "Field unit replaced the damaged LED lamps and confirmed operation."
      }
    ]
  },
  {
    id: "CIV-9931",
    title: "Low Water Pressure and Turbidity in Sector 7",
    description: "The municipal water supply has been extremely muddy and at very low pressure for the past 3 days. We cannot even filter this water for daily drinking purposes. Highly urgent to avoid contamination epidemics.",
    category: "Water Supply",
    priority: "High",
    isHazard: false,
    status: "In Progress",
    reportedAt: "2026-07-05T07:45:00.000Z",
    address: "Sector 7 Main Road, HSR Layout, Bengaluru, Karnataka 560102",
    coordinates: { lat: 12.9080, lng: 77.6390 },
    image: null,
    upvotes: 27,
    hasUpvoted: false,
    citizenId: "USR-0112",
    citizenName: "Rohan Das",
    notes: "Main supply pipeline leak discovered. Repair works ongoing near HSR Water Tank.",
    assignedAuthority: "BWSSB Water Supply Division",
    assignedOfficer: "Muralidharan K.",
    resolutionTimeEstimate: "12 hrs remaining",
    aiExplanation: "Classified as Water Supply. Priority: High due to muddy quality indicating potential sewer leak ingress.",
    trackingTimeline: [
      {
        status: "Reported",
        title: "Complaint Lodged",
        timestamp: "July 5, 7:45 AM",
        completed: true,
        description: "Logged water quality & pressure drop."
      },
      {
        status: "Inspected",
        title: "Inspected & Leak Identified",
        timestamp: "July 6, 11:00 AM",
        completed: true,
        description: "BWSSB team excavated site and discovered a pipeline fissure."
      },
      {
        status: "Repairs",
        title: "Fissure Repair in Progress",
        timestamp: "July 7, 2:00 PM",
        completed: true,
        description: "Pipe sealing and flushing of line underway."
      },
      {
        status: "Resolved",
        title: "Completed Water Supply",
        timestamp: "In Progress",
        completed: false,
        description: "Awaiting quality test check before full pressure release."
      }
    ]
  }
];

export const mockFieldUnits = [
  { id: "UNIT-1", name: "HSR South Road Patrol", members: 3, vehicle: "Tata Ace (KA-05-MD-1192)", currentTask: "Barricading HSR Main Road" },
  { id: "UNIT-2", name: "SWM Quick Response Group 4", members: 4, vehicle: "Eicher Tipper (KA-01-HL-3982)", currentTask: "Idle - Sector 12 Yard" },
  { id: "UNIT-3", name: "BWSSB Leak Repair Team South", members: 5, vehicle: "JCB Excavator (KA-51-MM-8924)", currentTask: "Water tank pipeline repair" },
  { id: "UNIT-4", name: "BESCOM Ward Electricians 3", members: 2, vehicle: "Mahindra Bolero (KA-03-JK-2831)", currentTask: "Routine lamp replacement" }
];
