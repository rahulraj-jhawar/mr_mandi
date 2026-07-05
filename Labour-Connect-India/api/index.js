// Zero-dependency mock API for the ShramSetu demo.
// Serves the same routes as the Express backend (/api/*) with realistic
// in-memory seed data, so the frontend is fully populated WITHOUT a database.
// All /api/* requests are rewritten here (see vercel.json) with the real path
// forwarded as the __p query param. State persists only within a warm
// serverless instance — fine for a demo.

const brokers = [
  { id: 1, name: "Ramesh Yadav", agencyName: "Yadav Labour Suppliers", phone: "+91 98351 20034", city: "Patna", state: "Bihar", skillsCovered: ["mason", "carpenter", "unskilled_helper"], laborPoolSize: 120, availableCapacity: 45, rating: 4.7, verified: true },
  { id: 2, name: "Sunil Kumar", agencyName: "Kumar Manpower Services", phone: "+91 94150 88210", city: "Lucknow", state: "Uttar Pradesh", skillsCovered: ["electrician", "plumber", "fitter"], laborPoolSize: 80, availableCapacity: 30, rating: 4.5, verified: true },
  { id: 3, name: "Abdul Rahman", agencyName: "Rahman Contractors", phone: "+91 98300 45521", city: "Kolkata", state: "West Bengal", skillsCovered: ["painter", "mason", "general_labour"], laborPoolSize: 150, availableCapacity: 60, rating: 4.8, verified: true },
  { id: 4, name: "Vijay Singh", agencyName: "Singh Enterprises", phone: "+91 94140 33218", city: "Jaipur", state: "Rajasthan", skillsCovered: ["welder", "bar_bender", "fitter"], laborPoolSize: 90, availableCapacity: 20, rating: 4.3, verified: true },
  { id: 5, name: "Mahesh Patil", agencyName: "Patil Labour Co.", phone: "+91 98220 71190", city: "Mumbai", state: "Maharashtra", skillsCovered: ["mason", "carpenter", "electrician"], laborPoolSize: 200, availableCapacity: 75, rating: 4.6, verified: true },
  { id: 6, name: "Prakash Rao", agencyName: "Rao Workforce", phone: "+91 90000 55123", city: "Hyderabad", state: "Telangana", skillsCovered: ["plumber", "painter", "unskilled_helper"], laborPoolSize: 70, availableCapacity: 25, rating: 4.4, verified: true },
  { id: 7, name: "Karthik Reddy", agencyName: "Reddy Manpower", phone: "+91 98860 22014", city: "Bengaluru", state: "Karnataka", skillsCovered: ["electrician", "fitter", "welder"], laborPoolSize: 110, availableCapacity: 40, rating: 4.5, verified: true },
  { id: 8, name: "Sanjay Mishra", agencyName: "Mishra Labour Group", phone: "+91 94250 66710", city: "Bhopal", state: "Madhya Pradesh", skillsCovered: ["general_labour", "unskilled_helper", "mason"], laborPoolSize: 130, availableCapacity: 55, rating: 4.2, verified: true },
  { id: 9, name: "Deepak Munda", agencyName: "Munda Suppliers", phone: "+91 96170 44523", city: "Ranchi", state: "Jharkhand", skillsCovered: ["bar_bender", "welder", "general_labour"], laborPoolSize: 95, availableCapacity: 35, rating: 4.6, verified: true },
  { id: 10, name: "Anil Nayak", agencyName: "Nayak Contractors", phone: "+91 94370 11205", city: "Bhubaneswar", state: "Odisha", skillsCovered: ["mason", "painter", "unskilled_helper"], laborPoolSize: 85, availableCapacity: 30, rating: 4.4, verified: true },
  { id: 11, name: "Rakesh Sharma", agencyName: "Sharma Manpower", phone: "+91 99351 40012", city: "Kanpur", state: "Uttar Pradesh", skillsCovered: ["mason", "bar_bender", "general_labour"], laborPoolSize: 140, availableCapacity: 50, rating: 4.5, verified: true },
  { id: 12, name: "Imran Khan", agencyName: "Khan Labour Services", phone: "+91 98740 33218", city: "Howrah", state: "West Bengal", skillsCovered: ["welder", "fitter", "electrician"], laborPoolSize: 100, availableCapacity: 42, rating: 4.6, verified: true },
  { id: 13, name: "Santosh Gupta", agencyName: "Gupta Crew Suppliers", phone: "+91 96170 55234", city: "Gaya", state: "Bihar", skillsCovered: ["general_labour", "unskilled_helper", "painter"], laborPoolSize: 110, availableCapacity: 38, rating: 4.3, verified: true },
  { id: 14, name: "Naresh Meena", agencyName: "Meena Enterprises", phone: "+91 94140 66710", city: "Jodhpur", state: "Rajasthan", skillsCovered: ["mason", "carpenter", "unskilled_helper"], laborPoolSize: 75, availableCapacity: 28, rating: 4.4, verified: true },
  { id: 15, name: "Suresh Pawar", agencyName: "Pawar Workforce", phone: "+91 98220 11902", city: "Pune", state: "Maharashtra", skillsCovered: ["electrician", "plumber", "fitter"], laborPoolSize: 160, availableCapacity: 65, rating: 4.7, verified: true },
  { id: 16, name: "Ganesh Shetty", agencyName: "Shetty Manpower", phone: "+91 98860 45521", city: "Mangaluru", state: "Karnataka", skillsCovered: ["carpenter", "mason", "painter"], laborPoolSize: 90, availableCapacity: 33, rating: 4.5, verified: true },
  { id: 17, name: "Ravi Verma", agencyName: "Verma Labour Co.", phone: "+91 94250 77103", city: "Raipur", state: "Chhattisgarh", skillsCovered: ["general_labour", "bar_bender", "welder"], laborPoolSize: 120, availableCapacity: 48, rating: 4.2, verified: true },
  { id: 18, name: "Manoj Das", agencyName: "Das Suppliers", phone: "+91 98640 22019", city: "Guwahati", state: "Assam", skillsCovered: ["unskilled_helper", "general_labour", "mason"], laborPoolSize: 80, availableCapacity: 30, rating: 4.1, verified: true },
  { id: 19, name: "Balwinder Singh", agencyName: "Singh Crew Services", phone: "+91 98140 33217", city: "Ludhiana", state: "Punjab", skillsCovered: ["welder", "fitter", "electrician"], laborPoolSize: 95, availableCapacity: 40, rating: 4.6, verified: true },
  { id: 20, name: "Ashok Kumar", agencyName: "Kumar Contractors", phone: "+91 99991 20034", city: "Faridabad", state: "Haryana", skillsCovered: ["mason", "carpenter", "plumber"], laborPoolSize: 130, availableCapacity: 52, rating: 4.5, verified: true },
  { id: 21, name: "Vinod Jha", agencyName: "Jha Manpower", phone: "+91 96170 88112", city: "Muzaffarpur", state: "Bihar", skillsCovered: ["mason", "general_labour", "unskilled_helper"], laborPoolSize: 105, availableCapacity: 41, rating: 4.3, verified: true },
  { id: 22, name: "Prakash Sahoo", agencyName: "Sahoo Labour Group", phone: "+91 94370 55229", city: "Cuttack", state: "Odisha", skillsCovered: ["bar_bender", "welder", "fitter"], laborPoolSize: 88, availableCapacity: 34, rating: 4.4, verified: true },
  { id: 23, name: "Sunder Lal", agencyName: "Lal Workforce", phone: "+91 99351 66710", city: "Agra", state: "Uttar Pradesh", skillsCovered: ["painter", "mason", "carpenter"], laborPoolSize: 115, availableCapacity: 45, rating: 4.4, verified: true },
  { id: 24, name: "Dinesh Patel", agencyName: "Patel Enterprises", phone: "+91 98250 71190", city: "Surat", state: "Gujarat", skillsCovered: ["welder", "fitter", "electrician"], laborPoolSize: 175, availableCapacity: 70, rating: 4.7, verified: true },
  { id: 25, name: "Mohan Iyer", agencyName: "Iyer Manpower", phone: "+91 98410 22015", city: "Chennai", state: "Tamil Nadu", skillsCovered: ["carpenter", "mason", "plumber"], laborPoolSize: 140, availableCapacity: 58, rating: 4.6, verified: true },
  { id: 26, name: "Rajan Nair", agencyName: "Nair Crew Suppliers", phone: "+91 98950 33221", city: "Kochi", state: "Kerala", skillsCovered: ["plumber", "electrician", "painter"], laborPoolSize: 85, availableCapacity: 32, rating: 4.5, verified: true },
  { id: 27, name: "Venkatesh Rao", agencyName: "Rao Labour Services", phone: "+91 98480 45527", city: "Visakhapatnam", state: "Andhra Pradesh", skillsCovered: ["mason", "general_labour", "bar_bender"], laborPoolSize: 120, availableCapacity: 47, rating: 4.3, verified: true },
  { id: 28, name: "Gopal Chandra", agencyName: "Chandra Suppliers", phone: "+91 98300 88114", city: "Siliguri", state: "West Bengal", skillsCovered: ["general_labour", "unskilled_helper", "mason"], laborPoolSize: 100, availableCapacity: 39, rating: 4.2, verified: true },
  { id: 29, name: "Hari Prasad", agencyName: "Prasad Manpower", phone: "+91 96170 33225", city: "Dhanbad", state: "Jharkhand", skillsCovered: ["welder", "bar_bender", "fitter"], laborPoolSize: 92, availableCapacity: 36, rating: 4.5, verified: true },
  { id: 30, name: "Kishan Reddy", agencyName: "Reddy Crew Co.", phone: "+91 90000 77118", city: "Warangal", state: "Telangana", skillsCovered: ["electrician", "plumber", "unskilled_helper"], laborPoolSize: 78, availableCapacity: 29, rating: 4.4, verified: true },
];

const requirements = [
  { id: 1, builderName: "Rajesh Gupta", companyName: "Gupta Constructions", projectName: "Skyline Towers", siteCity: "Mumbai", siteState: "Maharashtra", skillType: "mason", laborTier: "skilled", workersNeeded: 25, startDate: "2026-07-20", durationDays: 90, wagePerDay: 750, notes: "Highrise residential block", status: "routed", routedBrokerId: 5 },
  { id: 2, builderName: "Neha Sharma", companyName: "Sharma Infra", projectName: "Metro Depot Line 3", siteCity: "Bengaluru", siteState: "Karnataka", skillType: "electrician", laborTier: "skilled", workersNeeded: 15, startDate: "2026-07-15", durationDays: 60, wagePerDay: 900, notes: "Metro electrical fitout", status: "accepted", routedBrokerId: 7 },
  { id: 3, builderName: "Amit Verma", companyName: "Verma Builders", projectName: "Green Villas", siteCity: "Jaipur", siteState: "Rajasthan", skillType: "welder", laborTier: "semi_skilled", workersNeeded: 12, startDate: "2026-08-01", durationDays: 45, wagePerDay: 680, notes: null, status: "routed", routedBrokerId: 4 },
  { id: 4, builderName: "Priya Nair", companyName: "Nair Developers", projectName: "Tech Park Phase 2", siteCity: "Hyderabad", siteState: "Telangana", skillType: "plumber", laborTier: "skilled", workersNeeded: 10, startDate: "2026-07-25", durationDays: 50, wagePerDay: 820, notes: "Commercial plumbing", status: "pending", routedBrokerId: null },
  { id: 5, builderName: "Suresh Iyer", companyName: "Iyer Projects", projectName: "Coastal Highway Pkg 4", siteCity: "Bhubaneswar", siteState: "Odisha", skillType: "general_labour", laborTier: "unskilled", workersNeeded: 40, startDate: "2026-07-10", durationDays: 120, wagePerDay: 520, notes: "Road construction", status: "fulfilled", routedBrokerId: 10 },
  { id: 6, builderName: "Kavita Joshi", companyName: "Joshi Realty", projectName: "Lake View Apartments", siteCity: "Bhopal", siteState: "Madhya Pradesh", skillType: "carpenter", laborTier: "skilled", workersNeeded: 18, startDate: "2026-08-05", durationDays: 75, wagePerDay: 700, notes: null, status: "pending", routedBrokerId: null },
  { id: 7, builderName: "Arjun Mehta", companyName: "Mehta Infra", projectName: "Riverside Mall", siteCity: "Pune", siteState: "Maharashtra", skillType: "electrician", laborTier: "skilled", workersNeeded: 20, startDate: "2026-07-18", durationDays: 80, wagePerDay: 860, notes: "Mall MEP works", status: "accepted", routedBrokerId: 15 },
  { id: 8, builderName: "Deepa Rao", companyName: "Rao Constructions", projectName: "IT Campus Block C", siteCity: "Bengaluru", siteState: "Karnataka", skillType: "carpenter", laborTier: "semi_skilled", workersNeeded: 22, startDate: "2026-07-22", durationDays: 65, wagePerDay: 720, notes: "Interior carpentry", status: "routed", routedBrokerId: 16 },
  { id: 9, builderName: "Farhan Ali", companyName: "Ali Builders", projectName: "Textile Hub", siteCity: "Surat", siteState: "Gujarat", skillType: "welder", laborTier: "skilled", workersNeeded: 16, startDate: "2026-07-28", durationDays: 55, wagePerDay: 780, notes: "Steel fabrication", status: "routed", routedBrokerId: 24 },
  { id: 10, builderName: "Meera Pillai", companyName: "Pillai Developers", projectName: "Seaside Resort", siteCity: "Kochi", siteState: "Kerala", skillType: "plumber", laborTier: "skilled", workersNeeded: 8, startDate: "2026-08-10", durationDays: 40, wagePerDay: 800, notes: null, status: "pending", routedBrokerId: null },
  { id: 11, builderName: "Rohit Malhotra", companyName: "Malhotra Infra", projectName: "Expressway Pkg 7", siteCity: "Faridabad", siteState: "Haryana", skillType: "general_labour", laborTier: "unskilled", workersNeeded: 50, startDate: "2026-07-12", durationDays: 150, wagePerDay: 540, notes: "Highway earthwork", status: "accepted", routedBrokerId: 20 },
  { id: 12, builderName: "Sneha Reddy", companyName: "Reddy Constructions", projectName: "Financial District Tower", siteCity: "Hyderabad", siteState: "Telangana", skillType: "mason", laborTier: "skilled", workersNeeded: 30, startDate: "2026-07-16", durationDays: 100, wagePerDay: 760, notes: null, status: "routed", routedBrokerId: 6 },
  { id: 13, builderName: "Vikram Desai", companyName: "Desai Builders", projectName: "Auto Plant Shed", siteCity: "Chennai", siteState: "Tamil Nadu", skillType: "fitter", laborTier: "semi_skilled", workersNeeded: 14, startDate: "2026-07-30", durationDays: 60, wagePerDay: 700, notes: "Industrial fitting", status: "fulfilled", routedBrokerId: 25 },
  { id: 14, builderName: "Anjali Menon", companyName: "Menon Realty", projectName: "Green Terraces", siteCity: "Bengaluru", siteState: "Karnataka", skillType: "painter", laborTier: "semi_skilled", workersNeeded: 12, startDate: "2026-08-03", durationDays: 45, wagePerDay: 620, notes: null, status: "pending", routedBrokerId: null },
  { id: 15, builderName: "Karan Singh", companyName: "Singh Infra", projectName: "Ring Road Flyover", siteCity: "Delhi", siteState: "Delhi", skillType: "bar_bender", laborTier: "skilled", workersNeeded: 24, startDate: "2026-07-14", durationDays: 90, wagePerDay: 820, notes: "RCC works", status: "routed", routedBrokerId: 20 },
  { id: 16, builderName: "Pooja Agarwal", companyName: "Agarwal Developers", projectName: "Smart City Sector 5", siteCity: "Pune", siteState: "Maharashtra", skillType: "mason", laborTier: "semi_skilled", workersNeeded: 28, startDate: "2026-07-26", durationDays: 85, wagePerDay: 720, notes: null, status: "accepted", routedBrokerId: 5 },
  { id: 17, builderName: "Rahul Nanda", companyName: "Nanda Constructions", projectName: "Airport Terminal Ext", siteCity: "Ahmedabad", siteState: "Gujarat", skillType: "electrician", laborTier: "skilled", workersNeeded: 18, startDate: "2026-08-08", durationDays: 70, wagePerDay: 880, notes: null, status: "pending", routedBrokerId: null },
  { id: 18, builderName: "Divya Krishnan", companyName: "Krishnan Builders", projectName: "Riverfront Housing", siteCity: "Chennai", siteState: "Tamil Nadu", skillType: "carpenter", laborTier: "skilled", workersNeeded: 15, startDate: "2026-07-24", durationDays: 60, wagePerDay: 740, notes: null, status: "routed", routedBrokerId: 25 },
  { id: 19, builderName: "Sameer Shah", companyName: "Shah Infra", projectName: "Logistics Park", siteCity: "Nagpur", siteState: "Maharashtra", skillType: "general_labour", laborTier: "unskilled", workersNeeded: 45, startDate: "2026-07-11", durationDays: 130, wagePerDay: 530, notes: "Warehouse slab", status: "fulfilled", routedBrokerId: 5 },
  { id: 20, builderName: "Nisha Rao", companyName: "Rao Realty", projectName: "Hilltop Villas", siteCity: "Bengaluru", siteState: "Karnataka", skillType: "plumber", laborTier: "semi_skilled", workersNeeded: 10, startDate: "2026-08-12", durationDays: 40, wagePerDay: 680, notes: null, status: "pending", routedBrokerId: null },
  { id: 21, builderName: "Aditya Kulkarni", companyName: "Kulkarni Constructions", projectName: "Data Center Phase 1", siteCity: "Hyderabad", siteState: "Telangana", skillType: "electrician", laborTier: "skilled", workersNeeded: 26, startDate: "2026-07-19", durationDays: 95, wagePerDay: 900, notes: "Critical MEP", status: "routed", routedBrokerId: 30 },
  { id: 22, builderName: "Ritu Bansal", companyName: "Bansal Developers", projectName: "Retail Plaza", siteCity: "Gurugram", siteState: "Haryana", skillType: "mason", laborTier: "semi_skilled", workersNeeded: 20, startDate: "2026-07-27", durationDays: 70, wagePerDay: 700, notes: null, status: "declined", routedBrokerId: 20 },
  { id: 23, builderName: "Manish Tiwari", companyName: "Tiwari Infra", projectName: "Steel Bridge Pkg 2", siteCity: "Raipur", siteState: "Chhattisgarh", skillType: "welder", laborTier: "skilled", workersNeeded: 14, startDate: "2026-08-06", durationDays: 55, wagePerDay: 760, notes: null, status: "routed", routedBrokerId: 17 },
  { id: 24, builderName: "Shreya Ghosh", companyName: "Ghosh Builders", projectName: "Township Block A", siteCity: "Kolkata", siteState: "West Bengal", skillType: "carpenter", laborTier: "semi_skilled", workersNeeded: 16, startDate: "2026-07-23", durationDays: 60, wagePerDay: 660, notes: null, status: "accepted", routedBrokerId: 3 },
  { id: 25, builderName: "Vivek Menon", companyName: "Menon Infra", projectName: "Port Expansion", siteCity: "Visakhapatnam", siteState: "Andhra Pradesh", skillType: "general_labour", laborTier: "unskilled", workersNeeded: 38, startDate: "2026-07-13", durationDays: 110, wagePerDay: 540, notes: null, status: "routed", routedBrokerId: 27 },
  { id: 26, builderName: "Tanvi Joshi", companyName: "Joshi Developers", projectName: "Eco Residency", siteCity: "Pune", siteState: "Maharashtra", skillType: "painter", laborTier: "semi_skilled", workersNeeded: 12, startDate: "2026-08-15", durationDays: 40, wagePerDay: 630, notes: null, status: "pending", routedBrokerId: null },
  { id: 27, builderName: "Harish Patel", companyName: "Patel Constructions", projectName: "Chemical Plant Unit 3", siteCity: "Vadodara", siteState: "Gujarat", skillType: "fitter", laborTier: "skilled", workersNeeded: 18, startDate: "2026-07-29", durationDays: 75, wagePerDay: 800, notes: null, status: "routed", routedBrokerId: 24 },
  { id: 28, builderName: "Lakshmi Iyer", companyName: "Iyer Realty", projectName: "Cultural Centre", siteCity: "Chennai", siteState: "Tamil Nadu", skillType: "mason", laborTier: "skilled", workersNeeded: 22, startDate: "2026-08-02", durationDays: 80, wagePerDay: 740, notes: null, status: "accepted", routedBrokerId: 25 },

  // --- Multi-crew-line projects (several requirements under one project) ---
  { id: 29, builderName: "Suresh Menon", companyName: "Metro Rail Corp", projectName: "Riverside Metro Depot", siteCity: "Mumbai", siteState: "Maharashtra", skillType: "mason", laborTier: "skilled", workersNeeded: 20, startDate: "2026-07-20", durationDays: 90, wagePerDay: 780, notes: "Platform civil works", status: "fulfilled", routedBrokerId: 5 },
  { id: 30, builderName: "Suresh Menon", companyName: "Metro Rail Corp", projectName: "Riverside Metro Depot", siteCity: "Mumbai", siteState: "Maharashtra", skillType: "bar_bender", laborTier: "skilled", workersNeeded: 15, startDate: "2026-07-20", durationDays: 90, wagePerDay: 820, notes: "RCC reinforcement", status: "accepted", routedBrokerId: 5 },
  { id: 31, builderName: "Suresh Menon", companyName: "Metro Rail Corp", projectName: "Riverside Metro Depot", siteCity: "Mumbai", siteState: "Maharashtra", skillType: "unskilled_helper", laborTier: "unskilled", workersNeeded: 40, startDate: "2026-07-25", durationDays: 90, wagePerDay: 520, notes: null, status: "pending", routedBrokerId: null },
  { id: 32, builderName: "Suresh Menon", companyName: "Metro Rail Corp", projectName: "Riverside Metro Depot", siteCity: "Mumbai", siteState: "Maharashtra", skillType: "electrician", laborTier: "skilled", workersNeeded: 10, startDate: "2026-07-22", durationDays: 60, wagePerDay: 900, notes: "Signalling power", status: "declined", routedBrokerId: 15 },

  { id: 33, builderName: "Rakesh Shah", companyName: "Highway Devcon", projectName: "Coastal Expressway Pkg 9", siteCity: "Surat", siteState: "Gujarat", skillType: "general_labour", laborTier: "unskilled", workersNeeded: 50, startDate: "2026-07-15", durationDays: 150, wagePerDay: 540, notes: "Earthwork", status: "fulfilled", routedBrokerId: 24 },
  { id: 34, builderName: "Rakesh Shah", companyName: "Highway Devcon", projectName: "Coastal Expressway Pkg 9", siteCity: "Surat", siteState: "Gujarat", skillType: "welder", laborTier: "skilled", workersNeeded: 18, startDate: "2026-07-18", durationDays: 120, wagePerDay: 800, notes: "Guardrail fabrication", status: "fulfilled", routedBrokerId: 24 },
  { id: 35, builderName: "Rakesh Shah", companyName: "Highway Devcon", projectName: "Coastal Expressway Pkg 9", siteCity: "Surat", siteState: "Gujarat", skillType: "fitter", laborTier: "skilled", workersNeeded: 12, startDate: "2026-07-20", durationDays: 100, wagePerDay: 780, notes: null, status: "routed", routedBrokerId: 24 },

  { id: 36, builderName: "Ananya Rao", companyName: "Prestige Group", projectName: "Tech Park Tower B", siteCity: "Bengaluru", siteState: "Karnataka", skillType: "electrician", laborTier: "skilled", workersNeeded: 14, startDate: "2026-07-16", durationDays: 80, wagePerDay: 880, notes: "MEP fitout", status: "accepted", routedBrokerId: 7 },
  { id: 37, builderName: "Ananya Rao", companyName: "Prestige Group", projectName: "Tech Park Tower B", siteCity: "Bengaluru", siteState: "Karnataka", skillType: "carpenter", laborTier: "semi_skilled", workersNeeded: 20, startDate: "2026-08-01", durationDays: 70, wagePerDay: 700, notes: null, status: "pending", routedBrokerId: null },
];

const regions = [
  { state: "Bihar", historicalOutflow: 450000, predictedOutflow: 470000, demandIndex: 0.30, supplyIndex: 0.90, stabilityScore: 0.72, trend: "net_source", topSkills: ["mason", "general_labour", "unskilled_helper"] },
  { state: "Uttar Pradesh", historicalOutflow: 520000, predictedOutflow: 540000, demandIndex: 0.40, supplyIndex: 0.88, stabilityScore: 0.68, trend: "net_source", topSkills: ["carpenter", "mason", "electrician"] },
  { state: "West Bengal", historicalOutflow: 380000, predictedOutflow: 390000, demandIndex: 0.45, supplyIndex: 0.82, stabilityScore: 0.70, trend: "net_source", topSkills: ["painter", "mason", "fitter"] },
  { state: "Odisha", historicalOutflow: 290000, predictedOutflow: 300000, demandIndex: 0.35, supplyIndex: 0.80, stabilityScore: 0.66, trend: "net_source", topSkills: ["mason", "bar_bender", "welder"] },
  { state: "Jharkhand", historicalOutflow: 210000, predictedOutflow: 220000, demandIndex: 0.33, supplyIndex: 0.78, stabilityScore: 0.64, trend: "net_source", topSkills: ["bar_bender", "welder", "general_labour"] },
  { state: "Madhya Pradesh", historicalOutflow: 240000, predictedOutflow: 245000, demandIndex: 0.50, supplyIndex: 0.70, stabilityScore: 0.69, trend: "net_source", topSkills: ["general_labour", "mason", "unskilled_helper"] },
  { state: "Rajasthan", historicalOutflow: 180000, predictedOutflow: 175000, demandIndex: 0.55, supplyIndex: 0.60, stabilityScore: 0.75, trend: "balanced", topSkills: ["welder", "fitter", "mason"] },
  { state: "Maharashtra", historicalOutflow: 90000, predictedOutflow: 85000, demandIndex: 0.92, supplyIndex: 0.30, stabilityScore: 0.80, trend: "net_destination", topSkills: ["mason", "carpenter", "electrician"] },
  { state: "Gujarat", historicalOutflow: 70000, predictedOutflow: 68000, demandIndex: 0.90, supplyIndex: 0.35, stabilityScore: 0.82, trend: "net_destination", topSkills: ["welder", "fitter", "plumber"] },
  { state: "Karnataka", historicalOutflow: 80000, predictedOutflow: 78000, demandIndex: 0.88, supplyIndex: 0.40, stabilityScore: 0.79, trend: "net_destination", topSkills: ["electrician", "fitter", "painter"] },
  { state: "Tamil Nadu", historicalOutflow: 95000, predictedOutflow: 92000, demandIndex: 0.85, supplyIndex: 0.42, stabilityScore: 0.81, trend: "net_destination", topSkills: ["carpenter", "mason", "plumber"] },
  { state: "Telangana", historicalOutflow: 60000, predictedOutflow: 62000, demandIndex: 0.87, supplyIndex: 0.38, stabilityScore: 0.78, trend: "net_destination", topSkills: ["plumber", "painter", "electrician"] },
  { state: "Delhi", historicalOutflow: 40000, predictedOutflow: 38000, demandIndex: 0.95, supplyIndex: 0.25, stabilityScore: 0.76, trend: "net_destination", topSkills: ["mason", "carpenter", "painter"] },
  { state: "Chhattisgarh", historicalOutflow: 160000, predictedOutflow: 168000, demandIndex: 0.42, supplyIndex: 0.74, stabilityScore: 0.67, trend: "net_source", topSkills: ["general_labour", "bar_bender", "welder"] },
  { state: "Assam", historicalOutflow: 130000, predictedOutflow: 138000, demandIndex: 0.38, supplyIndex: 0.72, stabilityScore: 0.63, trend: "net_source", topSkills: ["unskilled_helper", "general_labour", "mason"] },
  { state: "Uttarakhand", historicalOutflow: 70000, predictedOutflow: 72000, demandIndex: 0.48, supplyIndex: 0.66, stabilityScore: 0.71, trend: "net_source", topSkills: ["carpenter", "mason", "painter"] },
  { state: "Himachal Pradesh", historicalOutflow: 45000, predictedOutflow: 46000, demandIndex: 0.44, supplyIndex: 0.64, stabilityScore: 0.70, trend: "net_source", topSkills: ["carpenter", "mason", "unskilled_helper"] },
  { state: "Tripura", historicalOutflow: 28000, predictedOutflow: 29000, demandIndex: 0.36, supplyIndex: 0.68, stabilityScore: 0.61, trend: "net_source", topSkills: ["unskilled_helper", "general_labour", "mason"] },
  { state: "Punjab", historicalOutflow: 90000, predictedOutflow: 88000, demandIndex: 0.62, supplyIndex: 0.58, stabilityScore: 0.77, trend: "balanced", topSkills: ["welder", "fitter", "electrician"] },
  { state: "Andhra Pradesh", historicalOutflow: 140000, predictedOutflow: 142000, demandIndex: 0.60, supplyIndex: 0.62, stabilityScore: 0.73, trend: "balanced", topSkills: ["mason", "general_labour", "bar_bender"] },
  { state: "Jammu & Kashmir", historicalOutflow: 35000, predictedOutflow: 36000, demandIndex: 0.40, supplyIndex: 0.60, stabilityScore: 0.62, trend: "balanced", topSkills: ["mason", "carpenter", "general_labour"] },
  { state: "Haryana", historicalOutflow: 55000, predictedOutflow: 54000, demandIndex: 0.86, supplyIndex: 0.34, stabilityScore: 0.78, trend: "net_destination", topSkills: ["mason", "carpenter", "plumber"] },
  { state: "Kerala", historicalOutflow: 65000, predictedOutflow: 66000, demandIndex: 0.83, supplyIndex: 0.44, stabilityScore: 0.80, trend: "net_destination", topSkills: ["plumber", "electrician", "painter"] },
  { state: "Goa", historicalOutflow: 20000, predictedOutflow: 19500, demandIndex: 0.80, supplyIndex: 0.36, stabilityScore: 0.79, trend: "net_destination", topSkills: ["carpenter", "mason", "painter"] },
];

const BASE_TS = "2026-07-01T09:00:00.000Z";
let nextReqId = 100;
let nextBrokerId = 100;

function brokerName(id) {
  const b = brokers.find((x) => x.id === id);
  return b ? b.name : null;
}

function brokerPhone(id) {
  const b = brokers.find((x) => x.id === id);
  return b ? b.phone : null;
}

// Deterministic, stable demo contact details for the builder who posted a requirement.
function builderPhone(id) {
  const n = String(9800000000 + id * 54321).slice(0, 10);
  return `+91 ${n.slice(0, 5)} ${n.slice(5)}`;
}

function builderEmail(name, company) {
  const local = name.trim().toLowerCase().split(/\s+/).join(".");
  const domain = company.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${local}@${domain}.in`;
}

function serializeBroker(b) {
  const routed = requirements.filter((r) => r.routedBrokerId === b.id);
  return {
    id: String(b.id),
    name: b.name,
    agencyName: b.agencyName,
    phone: b.phone,
    city: b.city,
    state: b.state,
    skillsCovered: b.skillsCovered,
    laborPoolSize: b.laborPoolSize,
    availableCapacity: b.availableCapacity,
    rating: b.rating,
    verified: b.verified,
    activeRequirements: routed.filter((r) => ["routed", "accepted"].includes(r.status)).length,
    fulfilledRequirements: routed.filter((r) => r.status === "fulfilled").length,
    createdAt: BASE_TS,
  };
}

function serializeRequirement(r) {
  return {
    id: String(r.id),
    builderName: r.builderName,
    companyName: r.companyName,
    projectName: r.projectName,
    siteAddress: r.siteAddress ?? null,
    siteCity: r.siteCity,
    siteState: r.siteState,
    skillType: r.skillType,
    laborTier: r.laborTier,
    workersNeeded: r.workersNeeded,
    startDate: r.startDate,
    durationDays: r.durationDays,
    wagePerDay: r.wagePerDay,
    notes: r.notes ?? null,
    status: r.status,
    routedBrokerId: r.routedBrokerId != null ? String(r.routedBrokerId) : null,
    routedBrokerName: r.routedBrokerId != null ? brokerName(r.routedBrokerId) : null,
    routedBrokerPhone: r.routedBrokerId != null ? brokerPhone(r.routedBrokerId) : null,
    builderPhone: builderPhone(r.id),
    builderEmail: builderEmail(r.builderName, r.companyName),
    createdAt: BASE_TS,
  };
}

// Mirror the backend's auto-routing: same state+skill+capacity, then same state, then any.
function findBestBroker(siteState, skillType, workersNeeded) {
  const byCapacity = (a, b) => b.availableCapacity - a.availableCapacity;
  return (
    brokers.filter((b) => b.state === siteState && b.availableCapacity >= workersNeeded && b.skillsCovered.includes(skillType)).sort(byCapacity)[0] ||
    brokers.filter((b) => b.state === siteState && b.availableCapacity >= workersNeeded).sort(byCapacity)[0] ||
    brokers.filter((b) => b.availableCapacity >= workersNeeded && b.availableCapacity !== 0).sort(byCapacity)[0] ||
    null
  );
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.end(body === undefined ? "" : JSON.stringify(body));
}

function readBody(req) {
  if (req.body && typeof req.body === "object") return Promise.resolve(req.body);
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); }
    });
  });
}

module.exports = async function handler(req, res) {
  const url = new URL(req.url, "http://localhost");
  // The real path is forwarded by the vercel.json rewrite as ?__p=/...
  // Fall back to stripping "/api" from the pathname for direct hits.
  let p = url.searchParams.get("__p");
  if (!p) {
    p = url.pathname;
    const apiIdx = p.indexOf("/api");
    if (apiIdx >= 0) p = p.slice(apiIdx + 4);
  }
  p = p.replace(/\/+$/, "") || "/";
  const method = req.method || "GET";

  if (method === "OPTIONS") return send(res, 204);

  if (p === "/healthz" || p === "/health" || p === "/") return send(res, 200, { status: "ok" });

  if (p === "/requirements") {
    if (method === "GET") {
      const status = url.searchParams.get("status");
      const brokerId = url.searchParams.get("brokerId");
      let rows = requirements.slice();
      if (status) rows = rows.filter((r) => r.status === status);
      if (brokerId) rows = rows.filter((r) => String(r.routedBrokerId) === String(brokerId));
      return send(res, 200, rows.map(serializeRequirement).reverse());
    }
    if (method === "POST") {
      const b = await readBody(req);
      const match = findBestBroker(b.siteState, b.skillType, Number(b.workersNeeded));
      const row = {
        id: nextReqId++,
        builderName: b.builderName, companyName: b.companyName, projectName: b.projectName,
        siteAddress: b.siteAddress ?? null, siteCity: b.siteCity, siteState: b.siteState, skillType: b.skillType, laborTier: b.laborTier,
        workersNeeded: Number(b.workersNeeded), startDate: b.startDate, durationDays: Number(b.durationDays),
        wagePerDay: Number(b.wagePerDay), notes: b.notes ?? null,
        status: match ? "routed" : "pending", routedBrokerId: match ? match.id : null,
      };
      requirements.push(row);
      if (match) match.availableCapacity -= row.workersNeeded;
      return send(res, 201, serializeRequirement(row));
    }
  }

  let m = p.match(/^\/requirements\/([^/]+)$/);
  if (m) {
    const id = Number(m[1]);
    const row = requirements.find((r) => r.id === id);
    if (!row) return send(res, 404, { error: "Requirement not found" });
    if (method === "GET") return send(res, 200, serializeRequirement(row));
    if (method === "PATCH") {
      const b = await readBody(req);
      if (b.status === "declined" && row.status !== "declined" && row.routedBrokerId != null) {
        const br = brokers.find((x) => x.id === row.routedBrokerId);
        if (br) br.availableCapacity += row.workersNeeded;
      }
      row.status = b.status;
      return send(res, 200, serializeRequirement(row));
    }
  }

  if (p === "/brokers") {
    if (method === "GET") {
      const state = url.searchParams.get("state");
      let rows = brokers.slice();
      if (state) rows = rows.filter((b) => b.state === state);
      rows.sort((a, b) => a.name.localeCompare(b.name));
      return send(res, 200, rows.map(serializeBroker));
    }
    if (method === "POST") {
      const b = await readBody(req);
      const row = {
        id: nextBrokerId++, name: b.name, agencyName: b.agencyName, phone: b.phone,
        city: b.city, state: b.state, skillsCovered: b.skillsCovered || [],
        laborPoolSize: Number(b.laborPoolSize), availableCapacity: Number(b.availableCapacity),
        rating: 4.5, verified: true,
      };
      brokers.push(row);
      return send(res, 201, serializeBroker(row));
    }
  }

  m = p.match(/^\/brokers\/([^/]+)$/);
  if (m && method === "GET") {
    const row = brokers.find((b) => b.id === Number(m[1]));
    if (!row) return send(res, 404, { error: "Broker not found" });
    return send(res, 200, serializeBroker(row));
  }

  if (p === "/labor-flow" && method === "GET") {
    const counts = {};
    for (const b of brokers) counts[b.state] = (counts[b.state] || 0) + 1;
    return send(res, 200, regions.slice().sort((a, b) => a.state.localeCompare(b.state)).map((r) => ({
      state: r.state, historicalOutflow: r.historicalOutflow, predictedOutflow: r.predictedOutflow,
      demandIndex: r.demandIndex, supplyIndex: r.supplyIndex, stabilityScore: r.stabilityScore,
      trend: r.trend, topSkills: r.topSkills, activeBrokers: counts[r.state] || 0,
    })));
  }

  if (p === "/dashboard/summary" && method === "GET") {
    return send(res, 200, {
      totalRequirements: requirements.length,
      pendingRequirements: requirements.filter((r) => r.status === "pending").length,
      fulfilledRequirements: requirements.filter((r) => r.status === "fulfilled").length,
      totalBrokers: brokers.length,
      totalLaborPool: brokers.reduce((s, b) => s + b.laborPoolSize, 0),
      totalAvailableCapacity: brokers.reduce((s, b) => s + b.availableCapacity, 0),
      avgRoutingMinutes: 4.5,
    });
  }

  return send(res, 404, { error: "Not found", path: p, method });
};
