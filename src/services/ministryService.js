// Mock Ministry Service for eKYC Dashboard
// This service handles all ministry and staff management operations

export const ministryService = {
  // Get all ministries
  getAllMinistries: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: 'Ministry of Education',
            code: 'MOE',
            type: 'ministry',
            contactPerson: 'John Kamau',
            email: 'info@education.go.ke',
            phone: '+254-20-318681',
            address: 'Jogoo House B, Harambee Avenue',
            description: 'Ministry responsible for education policies and implementation',
            staffCount: 2450,
            verifiedStaff: 1890,
            createdAt: '2024-01-15'
          },
          {
            id: 2,
            name: 'Ministry of Health',
            code: 'MOH',
            type: 'ministry',
            contactPerson: 'Mary Wanjiku',
            email: 'info@health.go.ke',
            phone: '+254-20-2717077',
            address: 'Afya House, Cathedral Road',
            description: 'Ministry responsible for health policies and healthcare delivery',
            staffCount: 3200,
            verifiedStaff: 2100,
            createdAt: '2024-01-10'
          },
          {
            id: 3,
            name: 'Kenya Revenue Authority',
            code: 'KRA',
            type: 'parastatal',
            contactPerson: 'Peter Mwangi',
            email: 'info@kra.go.ke',
            phone: '+254-20-4999999',
            address: 'Times Tower, Haile Selassie Avenue',
            description: 'Tax collection and administration authority',
            staffCount: 1800,
            verifiedStaff: 1650,
            createdAt: '2024-01-20'
          },
          {
            id: 4,
            name: 'National Social Security Fund',
            code: 'NSSF',
            type: 'parastatal',
            contactPerson: 'Grace Mutua',
            email: 'info@nssf.or.ke',
            phone: '+254-20-2729000',
            address: 'NSSF Building, Eastern Wing',
            description: 'Social security and pension fund management',
            staffCount: 950,
            verifiedStaff: 820,
            createdAt: '2024-01-12'
          },
          {
            id: 5,
            name: 'Ministry of Interior and National Administration',
            code: 'MINA',
            type: 'ministry',
            contactPerson: 'Samuel Kiprotich',
            email: 'info@interior.go.ke',
            phone: '+254-20-2227411',
            address: 'Harambee House, Harambee Avenue',
            description: 'Internal security and national administration',
            staffCount: 4500,
            verifiedStaff: 3200,
            createdAt: '2024-01-08'
          }
        ]);
      }, 500);
    });
  },

  // Get ministry by ID
  getMinistryById: async (id) => {
    const ministries = await ministryService.getAllMinistries();
    return ministries.find(m => m.id === parseInt(id));
  },

  // Create new ministry
  createMinistry: async (ministryData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now(),
          ...ministryData,
          staffCount: 0,
          verifiedStaff: 0,
          createdAt: new Date().toISOString().split('T')[0]
        });
      }, 800);
    });
  },

  // Update ministry
  updateMinistry: async (id, ministryData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: parseInt(id),
          ...ministryData,
          updatedAt: new Date().toISOString().split('T')[0]
        });
      }, 800);
    });
  },

  // Delete ministry
  deleteMinistry: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Ministry deleted successfully' });
      }, 500);
    });
  }
};

export const staffService = {
  // Get all staff with optional filtering
  getAllStaff: async (filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let staff = [
          {
            id: 1,
            nationalId: '12345678',
            payrollNumber: 'MOE001234',
            kraPin: 'A012345678X',
            nssfNumber: 'NS001234567',
            shifNumber: 'SH001234567',
            firstName: 'John',
            lastName: 'Kamau',
            email: 'john.kamau@education.go.ke',
            phone: '+254712345678',
            jobTitle: 'Senior Education Officer',
            department: 'Policy Development',
            ministryId: 1,
            ministryName: 'Ministry of Education',
            eKycStatus: 'completed',
            invitationSent: true,
            invitationDate: '2024-08-15',
            verificationDate: '2024-08-18',
            documentsUploaded: true,
            livenessCheck: 'passed',
            createdAt: '2024-08-10'
          },
          {
            id: 2,
            nationalId: '23456789',
            payrollNumber: 'MOH002345',
            kraPin: 'A023456789Y',
            nssfNumber: 'NS002345678',
            shifNumber: 'SH002345678',
            firstName: 'Mary',
            lastName: 'Wanjiku',
            email: 'mary.wanjiku@health.go.ke',
            phone: '+254723456789',
            jobTitle: 'Medical Officer',
            department: 'Clinical Services',
            ministryId: 2,
            ministryName: 'Ministry of Health',
            eKycStatus: 'pending',
            invitationSent: true,
            invitationDate: '2024-08-20',
            verificationDate: null,
            documentsUploaded: false,
            livenessCheck: null,
            createdAt: '2024-08-15'
          },
          {
            id: 3,
            nationalId: '34567890',
            payrollNumber: 'KRA003456',
            kraPin: 'A034567890Z',
            nssfNumber: 'NS003456789',
            shifNumber: 'SH003456789',
            firstName: 'Peter',
            lastName: 'Mwangi',
            email: 'peter.mwangi@kra.go.ke',
            phone: '+254734567890',
            jobTitle: 'Tax Officer',
            department: 'Domestic Taxes',
            ministryId: 3,
            ministryName: 'Kenya Revenue Authority',
            eKycStatus: 'failed',
            invitationSent: true,
            invitationDate: '2024-08-12',
            verificationDate: '2024-08-14',
            documentsUploaded: true,
            livenessCheck: 'failed',
            createdAt: '2024-08-08'
          },
          {
            id: 6,
            nationalId: '12345678',
            payrollNumber: 'MOH004567',
            kraPin: 'A012345678X',
            nssfNumber: 'NS001234567',
            shifNumber: 'SH001234567',
            firstName: 'John',
            lastName: 'Kamau',
            email: 'john.kamau.health@health.go.ke',
            phone: '+254722345678',
            jobTitle: 'Health Records Officer',
            department: 'Data Management',
            ministryId: 2,
            ministryName: 'Ministry of Health',
            eKycStatus: 'completed',
            invitationSent: true,
            invitationDate: '2024-08-16',
            verificationDate: '2024-08-19',
            documentsUploaded: true,
            livenessCheck: 'passed',
            systemVerification: {
              iprs: { status: 'verified', lastChecked: '2024-08-19T10:30:00Z', details: 'Same identity as MOE staff' },
              kra: { status: 'warning', lastChecked: '2024-08-19T10:31:00Z', details: 'Multiple employer records detected' },
              nssf: { status: 'warning', lastChecked: '2024-08-19T10:32:00Z', details: 'Contributions from multiple sources' },
              ecitizen: { status: 'verified', lastChecked: '2024-08-19T10:33:00Z', details: 'Digital ID verified' }
            },
            riskScore: 85,
            riskLevel: 'high',
            duplicateEmployment: true,
            duplicateMinistries: ['Ministry of Education', 'Ministry of Health'],
            createdAt: '2024-08-12'
          },
          // Add more mock staff data...
        ];

        // Apply filters
        if (filters.ministryId) {
          staff = staff.filter(s => s.ministryId === parseInt(filters.ministryId));
        }
        if (filters.status) {
          staff = staff.filter(s => s.eKycStatus === filters.status);
        }
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          staff = staff.filter(s => 
            s.firstName.toLowerCase().includes(searchTerm) ||
            s.lastName.toLowerCase().includes(searchTerm) ||
            s.nationalId.includes(searchTerm) ||
            s.payrollNumber.toLowerCase().includes(searchTerm) ||
            s.email.toLowerCase().includes(searchTerm)
          );
        }

        resolve({
          results: staff,
          total: staff.length,
          page: filters.page || 1,
          limit: filters.limit || 20
        });
      }, 600);
    });
  },

  // Get staff by ID
  getStaffById: async (id) => {
    const staffData = await staffService.getAllStaff();
    return staffData.results.find(s => s.id === parseInt(id));
  },

  // Create staff member
  createStaff: async (staffData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now(),
          ...staffData,
          eKycStatus: 'not_invited',
          invitationSent: false,
          documentsUploaded: false,
          livenessCheck: null,
          createdAt: new Date().toISOString().split('T')[0]
        });
      }, 800);
    });
  },

  // Update staff member
  updateStaff: async (id, staffData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: parseInt(id),
          ...staffData,
          updatedAt: new Date().toISOString().split('T')[0]
        });
      }, 800);
    });
  },

  // Delete staff member
  deleteStaff: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Staff member deleted successfully' });
      }, 500);
    });
  },

  // Send invitation to staff member
  sendInvitation: async (staffId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Invitation sent successfully',
          invitationDate: new Date().toISOString().split('T')[0]
        });
      }, 1000);
    });
  },

  // Bulk upload staff
  bulkUploadStaff: async (staffArray, ministryId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = {
          successful: staffArray.filter(s => !s.validationErrors).length,
          failed: staffArray.filter(s => s.validationErrors).length,
          total: staffArray.length,
          errors: staffArray.filter(s => s.validationErrors).map(s => ({
            row: s.rowIndex,
            errors: s.validationErrors
          }))
        };
        resolve(results);
      }, 2000);
    });
  }
};

export const reportService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalMinistries: 5,
          totalStaff: 12900,
          completedVerifications: 8660,
          pendingVerifications: 2890,
          failedVerifications: 1350,
          verificationRate: 67.1,
          avgCompletionTime: 3.2,
          ghostWorkersDetected: 145,
          ministryBreakdown: [
            {
              id: 1,
              name: 'Ministry of Education',
              code: 'MOE',
              totalStaff: 2450,
              completed: 1890,
              pending: 380,
              failed: 180,
              verificationRate: 77.1,
              lastUpdated: '2024-08-30'
            },
            {
              id: 2,
              name: 'Ministry of Health',
              code: 'MOH',
              totalStaff: 3200,
              completed: 2100,
              pending: 750,
              failed: 350,
              verificationRate: 65.6,
              lastUpdated: '2024-08-30'
            },
            // Add more ministries...
          ],
          verificationTrends: [
            { date: '2024-08-01', completed: 125, failed: 15 },
            { date: '2024-08-02', completed: 210, failed: 22 },
            // Add more trend data...
          ]
        });
      }, 700);
    });
  },

  // Generate and download reports
  generateReport: async (reportType, filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          reportId: Date.now(),
          type: reportType,
          downloadUrl: '/api/reports/download/' + Date.now(),
          generatedAt: new Date().toISOString()
        });
      }, 3000);
    });
  }
};