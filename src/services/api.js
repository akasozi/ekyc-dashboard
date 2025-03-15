import axios from 'axios';

// Create an axios instance with default config
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock KYC data including Kenyan ID details
const mockKYCData = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    status: "pending",
    userName: "John Kimani",
    userEmail: "john@example.com",
    userPhone: "+254722123456",
    verificationType: "idCard",
    remarks: "",
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-01T12:00:00Z",
    nationalId: {
      idNumber: "12345678",
      serialNumber: "A123456",
      fullName: "JOHN KIMANI NDEGWA",
      dateOfBirth: "1990-01-01",
      gender: "MALE",
      districtOfBirth: "NAIROBI",
      placeOfIssue: "NAIROBI",
      dateOfIssue: "2015-01-01",
      extractedText: "REPUBLIC OF KENYA\nNATIONAL IDENTITY CARD\nSerial No: A123456\nID No: 12345678\nFull Names: JOHN KIMANI NDEGWA\nSex: MALE\nDate of Birth: 01.01.1990\nDistrict of Birth: NAIROBI\nPlace of Issue: NAIROBI\nDate of Issue: 01.01.2015\nSignature: [Signature]",
    },
    documents: [
      {
        documentType: "ID Front",
        imageUrl: "https://via.placeholder.com/400x250?text=Kenya+ID+Front"
      },
      {
        documentType: "ID Back",
        imageUrl: "https://via.placeholder.com/400x250?text=Kenya+ID+Back"
      }
    ],
    livenessCheck: {
      status: "passed",
      confidence: 0.95,
      frames: [
        {
          imageUrl: "https://via.placeholder.com/300x300?text=Liveness+Frame+1",
          timestamp: "2023-10-01T12:00:10Z"
        },
        {
          imageUrl: "https://via.placeholder.com/300x300?text=Liveness+Frame+2",
          timestamp: "2023-10-01T12:00:15Z"
        }
      ]
    }
  },
  {
    id: "223e4567-e89b-12d3-a456-426614174001",
    status: "approved",
    userName: "Mary Wanjiru",
    userEmail: "mary@example.com",
    userPhone: "+254733987654",
    verificationType: "idCard",
    remarks: "All documents verified successfully",
    createdAt: "2023-09-28T10:30:00Z",
    updatedAt: "2023-09-29T14:15:00Z",
    nationalId: {
      idNumber: "87654321",
      serialNumber: "B654321",
      fullName: "MARY WANJIRU KAMAU",
      dateOfBirth: "1985-05-15",
      gender: "FEMALE",
      districtOfBirth: "KIAMBU",
      placeOfIssue: "NAIROBI",
      dateOfIssue: "2012-06-20",
      extractedText: "REPUBLIC OF KENYA\nNATIONAL IDENTITY CARD\nSerial No: B654321\nID No: 87654321\nFull Names: MARY WANJIRU KAMAU\nSex: FEMALE\nDate of Birth: 15.05.1985\nDistrict of Birth: KIAMBU\nPlace of Issue: NAIROBI\nDate of Issue: 20.06.2012\nSignature: [Signature]",
    },
    documents: [
      {
        documentType: "ID Front",
        imageUrl: "https://via.placeholder.com/400x250?text=Kenya+ID+Front+Mary"
      },
      {
        documentType: "ID Back",
        imageUrl: "https://via.placeholder.com/400x250?text=Kenya+ID+Back+Mary"
      }
    ],
    livenessCheck: {
      status: "passed",
      confidence: 0.98,
      frames: [
        {
          imageUrl: "https://via.placeholder.com/300x300?text=Liveness+Frame+1+Mary",
          timestamp: "2023-09-28T10:31:00Z"
        },
        {
          imageUrl: "https://via.placeholder.com/300x300?text=Liveness+Frame+2+Mary",
          timestamp: "2023-09-28T10:31:05Z"
        },
        {
          imageUrl: "https://via.placeholder.com/300x300?text=Liveness+Frame+3+Mary",
          timestamp: "2023-09-28T10:31:10Z"
        }
      ]
    }
  },
  {
    id: "323e4567-e89b-12d3-a456-426614174002",
    status: "rejected",
    userName: "Peter Ochieng",
    userEmail: "peter@example.com",
    userPhone: "+254711456789",
    verificationType: "idCard",
    remarks: "ID appears to be tampered with. Liveness check failed.",
    createdAt: "2023-09-25T09:15:00Z",
    updatedAt: "2023-09-26T11:20:00Z",
    nationalId: {
      idNumber: "23456789",
      serialNumber: "C789012",
      fullName: "PETER OCHIENG OMONDI",
      dateOfBirth: "1992-11-30",
      gender: "MALE",
      districtOfBirth: "KISUMU",
      placeOfIssue: "KISUMU",
      dateOfIssue: "2017-03-15",
      extractedText: "REPUBLIC OF KENYA\nNATIONAL IDENTITY CARD\nSerial No: C789012\nID No: 23456789\nFull Names: PETER OCHIENG OMONDI\nSex: MALE\nDate of Birth: 30.11.1992\nDistrict of Birth: KISUMU\nPlace of Issue: KISUMU\nDate of Issue: 15.03.2017\nSignature: [Signature]",
    },
    documents: [
      {
        documentType: "ID Front",
        imageUrl: "https://via.placeholder.com/400x250?text=Kenya+ID+Front+Peter"
      },
      {
        documentType: "ID Back",
        imageUrl: "https://via.placeholder.com/400x250?text=Kenya+ID+Back+Peter"
      }
    ],
    livenessCheck: {
      status: "failed",
      confidence: 0.45,
      frames: [
        {
          imageUrl: "https://via.placeholder.com/300x300?text=Liveness+Frame+1+Peter",
          timestamp: "2023-09-25T09:16:00Z"
        },
        {
          imageUrl: "https://via.placeholder.com/300x300?text=Liveness+Frame+2+Peter",
          timestamp: "2023-09-25T09:16:05Z"
        }
      ]
    }
  },
  {
    id: "423e4567-e89b-12d3-a456-426614174003",
    status: "pending",
    userName: "Sarah Njeri",
    userEmail: "sarah@example.com",
    userPhone: "+254700123456",
    verificationType: "idCard",
    remarks: "",
    createdAt: "2023-10-02T14:20:00Z",
    updatedAt: "2023-10-02T14:20:00Z",
    nationalId: {
      idNumber: "34567890",
      serialNumber: "D890123",
      fullName: "SARAH NJERI MWANGI",
      dateOfBirth: "1988-07-22",
      gender: "FEMALE",
      districtOfBirth: "NYERI",
      placeOfIssue: "NYERI",
      dateOfIssue: "2014-09-10",
      extractedText: "REPUBLIC OF KENYA\nNATIONAL IDENTITY CARD\nSerial No: D890123\nID No: 34567890\nFull Names: SARAH NJERI MWANGI\nSex: FEMALE\nDate of Birth: 22.07.1988\nDistrict of Birth: NYERI\nPlace of Issue: NYERI\nDate of Issue: 10.09.2014\nSignature: [Signature]",
    },
    documents: [
      {
        documentType: "ID Front",
        imageUrl: "https://via.placeholder.com/400x250?text=Kenya+ID+Front+Sarah"
      },
      {
        documentType: "ID Back",
        imageUrl: "https://via.placeholder.com/400x250?text=Kenya+ID+Back+Sarah"
      }
    ],
    livenessCheck: {
      status: "passed",
      confidence: 0.92,
      frames: [
        {
          imageUrl: "https://via.placeholder.com/300x300?text=Liveness+Frame+1+Sarah",
          timestamp: "2023-10-02T14:21:00Z"
        },
        {
          imageUrl: "https://via.placeholder.com/300x300?text=Liveness+Frame+2+Sarah",
          timestamp: "2023-10-02T14:21:05Z"
        }
      ]
    }
  },
  {
    id: "523e4567-e89b-12d3-a456-426614174004",
    status: "pending",
    userName: "David Mutua",
    userEmail: "david@example.com",
    userPhone: "+254755789012",
    verificationType: "idCard",
    remarks: "",
    createdAt: "2023-10-03T09:45:00Z",
    updatedAt: "2023-10-03T09:45:00Z",
    nationalId: {
      idNumber: "45678901",
      serialNumber: "E901234",
      fullName: "DAVID MUTUA MUSYOKA",
      dateOfBirth: "1995-03-18",
      gender: "MALE",
      districtOfBirth: "MACHAKOS",
      placeOfIssue: "MACHAKOS",
      dateOfIssue: "2019-02-05",
      extractedText: "REPUBLIC OF KENYA\nNATIONAL IDENTITY CARD\nSerial No: E901234\nID No: 45678901\nFull Names: DAVID MUTUA MUSYOKA\nSex: MALE\nDate of Birth: 18.03.1995\nDistrict of Birth: MACHAKOS\nPlace of Issue: MACHAKOS\nDate of Issue: 05.02.2019\nSignature: [Signature]",
    },
    documents: [
      {
        documentType: "ID Front",
        imageUrl: "https://via.placeholder.com/400x250?text=Kenya+ID+Front+David"
      },
      {
        documentType: "ID Back",
        imageUrl: "https://via.placeholder.com/400x250?text=Kenya+ID+Back+David"
      }
    ],
    livenessCheck: {
      status: "passed",
      confidence: 0.96,
      frames: [
        {
          imageUrl: "https://via.placeholder.com/300x300?text=Liveness+Frame+1+David",
          timestamp: "2023-10-03T09:46:00Z"
        },
        {
          imageUrl: "https://via.placeholder.com/300x300?text=Liveness+Frame+2+David",
          timestamp: "2023-10-03T09:46:05Z"
        }
      ]
    }
  }
];

// Add a request interceptor to add the auth token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email, password) => {
    try {
      // Mock login for development without backend
      if (email === 'user' && password === 'password') {
        const mockResponse = {
          token: 'mock-jwt-token',
          user: {
            id: '1',
            name: 'Test User',
            email: 'user',
            role: 'admin'
          }
        };
        localStorage.setItem('token', mockResponse.token);
        localStorage.setItem('user', JSON.stringify(mockResponse.user));
        return mockResponse;
      }
      
      // If credentials don't match the hardcoded ones, throw an error
      throw {
        response: {
          data: {
            message: 'Invalid credentials. Use username "user" and password "password".'
          }
        }
      };
      
      // This code will run when you have a backend
      // const response = await API.post('/auth/login', { email, password });
      // if (response.data.token) {
      //   localStorage.setItem('token', response.data.token);
      // }
      // return response.data;
    } catch (error) {
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: async () => {
    try {
      // Mock user data for development without backend
      const user = localStorage.getItem('user');
      if (user) {
        return JSON.parse(user);
      }
      
      // This code will run when you have a backend
      // const response = await API.get('/auth/me');
      // return response.data;
      
      throw new Error('Not authenticated');
    } catch (error) {
      throw error;
    }
  },
};

// KYC services
export const kycService = {
  getAll: async (params = {}) => {
    try {
      // For mock implementation
      // Process filters from params if provided
      let filteredData = [...mockKYCData];
      
      if (params.status) {
        filteredData = filteredData.filter(item => item.status === params.status);
      }
      
      if (params.verificationType) {
        filteredData = filteredData.filter(item => item.verificationType === params.verificationType);
      }
      
      if (params.searchTerm) {
        const term = params.searchTerm.toLowerCase();
        filteredData = filteredData.filter(item => 
          item.id.toLowerCase().includes(term) || 
          item.userName.toLowerCase().includes(term) || 
          item.userEmail.toLowerCase().includes(term) ||
          (item.nationalId?.idNumber || '').toLowerCase().includes(term)
        );
      }
      
      if (params.dateFrom) {
        const fromDate = new Date(params.dateFrom);
        filteredData = filteredData.filter(item => new Date(item.createdAt) >= fromDate);
      }
      
      if (params.dateTo) {
        const toDate = new Date(params.dateTo);
        toDate.setHours(23, 59, 59, 999); // Set to end of day
        filteredData = filteredData.filter(item => new Date(item.createdAt) <= toDate);
      }
      
      // Sort data
      if (params.sort) {
        const [field, direction] = params.sort.split(':');
        filteredData.sort((a, b) => {
          if (direction === 'desc') {
            return new Date(b[field]) - new Date(a[field]);
          }
          return new Date(a[field]) - new Date(b[field]);
        });
      }
      
      // Paginate data
      const page = parseInt(params.page) || 1;
      const limit = parseInt(params.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      // Return mock response structure
      return {
        results: paginatedData,
        totalPages: Math.ceil(filteredData.length / limit),
        totalResults: filteredData.length,
        page: page,
        limit: limit
      };
      
      // For actual implementation
      // const response = await API.get('/kyc', { params });
      // return response.data;
    } catch (error) {
      throw error;
    }
  },
  getById: async (id) => {
    try {
      // For mock implementation
      const result = mockKYCData.find(item => item.id === id);
      if (!result) throw new Error('KYC record not found');
      return result;
      
      // For actual implementation
      // const response = await API.get(`/kyc/${id}`);
      // return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateStatus: async (id, status, remarks) => {
    try {
      // For mock implementation
      const itemIndex = mockKYCData.findIndex(item => item.id === id);
      if (itemIndex === -1) throw new Error('KYC record not found');
      
      mockKYCData[itemIndex] = {
        ...mockKYCData[itemIndex],
        status,
        remarks,
        updatedAt: new Date().toISOString()
      };
      
      return mockKYCData[itemIndex];
      
      // For actual implementation
      // const response = await API.patch(`/kyc/${id}/status`, { status, remarks });
      // return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Analytics services
export const analyticsService = {
  getDashboardStats: async () => {
    try {
      // For mock implementation
      // Calculate stats based on mockKYCData
      const pendingRequests = mockKYCData.filter(item => item.status === 'pending').length;
      const approvedRequests = mockKYCData.filter(item => item.status === 'approved').length;
      const rejectedRequests = mockKYCData.filter(item => item.status === 'rejected').length;
      
      // Count verification types
      const verificationTypes = {
        idCard: mockKYCData.filter(item => item.verificationType === 'idCard').length,
        passport: 0,
        drivingLicense: 0,
        other: 0
      };
      
      // Generate mock trends data for the last 7 days
      const verificationTrends = [];
      const dailyTrends = []; // Add this for the Analytics component
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0];
        
        // Generate random count between 1-10 for each day
        const count = Math.floor(Math.random() * 10) + 1;
        verificationTrends.push({ date: formattedDate, count });
        
        // For dailyTrends
        const total = Math.floor(Math.random() * 30) + 10;
        const approved = Math.floor(Math.random() * total * 0.7);
        const rejected = Math.floor(Math.random() * (total - approved) * 0.5);
        const pending = total - approved - rejected;
        
        dailyTrends.push({ 
          date: formattedDate, 
          total,
          approved,
          rejected,
          pending
        });
      }
      
      // Calculate age distribution from mockKYCData
      const ageDistribution = {
        "18-25": 0,
        "26-35": 0,
        "36-45": 0,
        "46+": 0
      };
      
      mockKYCData.forEach(item => {
        if (item.nationalId && item.nationalId.dateOfBirth) {
          const birthDate = new Date(item.nationalId.dateOfBirth);
          const age = today.getFullYear() - birthDate.getFullYear();
          
          if (age >= 18 && age <= 25) ageDistribution["18-25"]++;
          else if (age >= 26 && age <= 35) ageDistribution["26-35"]++;
          else if (age >= 36 && age <= 45) ageDistribution["36-45"]++;
          else if (age >= 46) ageDistribution["46+"]++;
        }
      });
      
      // Calculate gender distribution
      const genderDistribution = {
        male: mockKYCData.filter(item => item.nationalId?.gender === 'MALE').length,
        female: mockKYCData.filter(item => item.nationalId?.gender === 'FEMALE').length,
        other: 0
      };
      
      // Calculate district distribution
      const districtData = {};
      mockKYCData.forEach(item => {
        const district = item.nationalId?.districtOfBirth;
        if (district) {
          if (districtData[district]) {
            districtData[district]++;
          } else {
            districtData[district] = 1;
          }
        }
      });
      
      // Calculate average verification time (mocked)
      const avgVerificationTime = "2.5"; // in minutes
      
      // Calculate failure reasons (mocked)
      const failureReasons = {
        "ID mismatch": 30,
        "Poor image quality": 25,
        "Fake ID detected": 15, 
        "Liveness check failed": 20,
        "Other": 10
      };
      
      // Generate monthly conversion rate for Analytics component
      const monthlyConversionRate = Array.from(Array(6).keys()).map(i => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return {
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          rate: Math.floor(Math.random() * 30) + 40 // 40-70% conversion rate
        };
      }).reverse();
      
      // Add insights for Analytics component
      const insights = [
        'Verification success rate has increased by 12% in the last 30 days',
        'Mobile devices account for 65% of all verification attempts',
        'Peak verification times are between 11:00 AM and 1:00 PM',
        'Average time to complete verification has decreased from 4.2 to 3.1 minutes'
      ];
      
      return {
        totalRequests: mockKYCData.length,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        verificationTypes,
        verificationTrends,
        dailyTrends, // Add this for the Analytics component
        monthlyConversionRate, // Add this for the Analytics component
        ageDistribution,
        genderDistribution,
        districtData,
        avgVerificationTime,
        failureReasons,
        insights // Add this for the Analytics component
      };
      
      // For actual implementation
      // const response = await API.get('/analytics/dashboard');
      // return response.data;
    } catch (error) {
      throw error;
    }
  },
  getVerificationStats: async (params = {}) => {
    try {
      // For mock implementation - adding more comprehensive analytics data
      const dashboardStats = await analyticsService.getDashboardStats();
      
      // Generate funnel data
      const funnelStepCounts = [250, 200, 180, 150, 120]; // Started, ID Uploaded, ID Verified, Liveness Check, Completed
      const verificationFunnel = [
        { step: 'Started', count: funnelStepCounts[0] },
        { step: 'ID Uploaded', count: funnelStepCounts[1] },
        { step: 'ID Verified', count: funnelStepCounts[2] },
        { step: 'Liveness Check', count: funnelStepCounts[3] },
        { step: 'Completed', count: funnelStepCounts[4] }
      ];
      
      // Time per step
      const stepTimes = [
        { step: 'ID Upload', avgTimeSeconds: 45 },
        { step: 'ID Verification', avgTimeSeconds: 120 },
        { step: 'Liveness Check', avgTimeSeconds: 60 },
        { step: 'Final Verification', avgTimeSeconds: 90 }
      ];
      
      // Generate hourly distribution data
      const hourlyDistribution = Array.from(Array(24).keys()).map(hour => ({
        hour: `${hour}:00`,
        count: Math.floor(Math.random() * 50) + (hour >= 8 && hour <= 17 ? 50 : 10) // Higher during business hours
      }));
      
      // Abandonment info
      const abandonmentReasons = [
        { reason: 'Session timeout', percentage: 35 },
        { reason: 'ID scan failed', percentage: 25 },
        { reason: 'Liveness check issues', percentage: 20 },
        { reason: 'User canceled', percentage: 15 },
        { reason: 'Other', percentage: 5 }
      ];
      
      // Rural vs urban count
      const urbanCount = 180;
      const ruralCount = 120;
      
      // Geographic insights
      const geographicInsights = [
        'Highest verification rates come from Nairobi County with 45% of all verifications',
        'Rural areas show 25% lower completion rates compared to urban centers',
        'Verification attempts in Mombasa peak during evening hours, unlike other regions'
      ];
      
      // ID document age
      const idDocumentAge = [45, 120, 80, 55]; // 0-1, 1-3, 3-5, 5+ years
      
      // Processing time trend
      const processingTimeTrend = Array.from(Array(10).keys()).map(i => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toISOString().split('T')[0],
          avgMinutes: Math.random() * 2 + 1 // Random between 1-3 minutes
        };
      }).reverse();
      
      // Agent performance data
      const agentPerformance = [
        { name: 'Agent 1', avgTime: 1.8, accuracy: 95 },
        { name: 'Agent 2', avgTime: 2.5, accuracy: 92 },
        { name: 'Agent 3', avgTime: 1.5, accuracy: 88 },
        { name: 'Agent 4', avgTime: 2.1, accuracy: 97 }
      ];
      
      // System performance data
      const systemPerformance = Array.from(Array(24).keys()).map(hour => ({
        hour: `${hour}:00`,
        responseTime: Math.floor(Math.random() * 100) + 200, // 200-300ms
        requestsPerMinute: Math.floor(Math.random() * 20) + (hour >= 8 && hour <= 17 ? 20 : 5) // Higher during business hours
      }));
      
      // Operational recommendations
      const operationalRecommendations = [
        'Increase server capacity during peak hours (10AM-2PM) to reduce response times',
        'Optimize the ID verification step which is currently the longest part of the process',
        'Consider implementing a queue system during high traffic periods to maintain performance'
      ];
      
      // Fraud detection data
      const fraudDetectionData = {
        potentialFraudCount: 35,
        falsePositiveRate: '18%',
        livenessCheckFailures: 28,
        documentTamperingCount: 15,
        multipleAttemptCount: 22,
        suspiciousPatterns: [
          { type: 'Multiple attempts with different IDs', count: 12 },
          { type: 'Document tampering detected', count: 15 },
          { type: 'Liveness check spoofing', count: 8 },
          { type: 'Suspicious IP patterns', count: 6 }
        ],
        geographicRisk: [
          { location: 'Region A', riskScore: 72 },
          { location: 'Region B', riskScore: 45 },
          { location: 'Region C', riskScore: 63 },
          { location: 'Region D', riskScore: 28 }
        ],
        fraudAlerts: [
          { 
            title: 'Multiple verification attempts detected',
            severity: 'High',
            description: 'Same device used for 5 different verification attempts with different IDs in the last 24 hours',
            timestamp: '2023-10-03 14:25:12'
          },
          { 
            title: 'Potential document tampering',
            severity: 'Medium',
            description: 'Image analysis detected potential modifications to ID number field',
            timestamp: '2023-10-03 11:18:45'
          },
          { 
            title: 'Unusual geographic pattern',
            severity: 'Low',
            description: 'User location changed significantly during verification process',
            timestamp: '2023-10-02 19:36:22'
          }
        ]
      };
      
      // Return comprehensive analytics data
      return {
        totalRequests: dashboardStats.totalRequests,
        approvedRequests: dashboardStats.approvedRequests,
        rejectedRequests: dashboardStats.rejectedRequests,
        pendingRequests: dashboardStats.pendingRequests,
        avgVerificationTime: dashboardStats.avgVerificationTime,
        avgProcessingTime: '2.3', // in hours
        
        // Verification trends
        verificationTrends: dashboardStats.verificationTrends,
        hourlyDistribution,
        
        // Conversion and funnel data
        verificationFunnel,
        stepTimes,
        biggestDropoffStep: 'Liveness Check → Completion',
        avgCompletionTime: '3m 15s',
        abandonmentRate: '52%',
        commonAbandonmentPoint: 'Liveness Check',
        abandonmentReasons,
        monthlyConversionRate: Array.from(Array(6).keys()).map(i => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          return {
            month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            rate: Math.floor(Math.random() * 30) + 40 // 40-70% conversion rate
          };
        }).reverse(),
        
        // Document data
        verificationTypes: dashboardStats.verificationTypes,
        
        // Demographics
        ageDistribution: dashboardStats.ageDistribution,
        genderDistribution: dashboardStats.genderDistribution,
        deviceDistribution: {
          mobile: 280,
          desktop: 120,
          tablet: 40
        },
        mostCommonAgeGroup: '26-35',
        genderRatio: 'M:F 1.2:1',
        idDocumentAge,
        
        // Geographic data
        districtData: dashboardStats.districtData,
        urbanCount,
        ruralCount,
        geographicInsights,
        
        // Operational data
        processingTimeTrend,
        agentPerformance,
        systemPerformance,
        systemUptime: '99.8%',
        peakHour: '11:00 - 13:00',
        avgQueueTime: '48s',
        operationalRecommendations,
        
        // Fraud detection
        failureReasons: dashboardStats.failureReasons,
        ...fraudDetectionData,
        
        // Insights
        insights: [
          'Verification success rate has increased by 12% in the last 30 days',
          'Mobile devices account for 65% of all verification attempts',
          'Peak verification times are between 11:00 AM and 1:00 PM',
          'Average time to complete verification has decreased from 4.2 to 3.1 minutes'
        ]
      };
      
      // For actual implementation
      // const response = await API.get('/analytics/verifications', { params });
      // return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default {
  authService,
  kycService,
  analyticsService,
};