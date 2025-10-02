/**
 * School Identity Configuration
 * Contains all school-related information used throughout the application
 * for branding, display, and institutional identity
 */

export interface SchoolIdentity {
  basic: {
    name: string
    shortName: string
    level: 'SD' | 'SMP' | 'SMA' | 'SMK' | 'UNIVERSITAS' | 'PESANTREN'
    npsn: string // Nomor Pokok Sekolah Nasional
    nss: string  // Nomor Statistik Sekolah
  }

  contact: {
    address: {
      street: string
      village: string
      district: string
      city: string
      province: string
      postalCode: string
      fullAddress: string
    }
    phone: string
    fax?: string
    email: string
    website?: string
  }

  administration: {
    headmaster: {
      name: string
      nip?: string
      position: string
    }
    accreditation: {
      grade: 'A' | 'B' | 'C' | 'Belum Terakreditasi'
      year: string
      validUntil: string
    }
    establishment: {
      date: string
      decree: {
        number: string
        date: string
        authority: string
      }
    }
  }

  branding: {
    logo: {
      primary: string    // Path to main logo
      secondary?: string // Path to alternative logo
      icon: string      // Path to favicon/icon
      watermark?: string // Path to watermark logo
    }
    colors: {
      primary: string
      secondary: string
      accent: string
    }
    motto?: string
    vision: string
    mission: string[]
  }

  academic: {
    curriculum: string
    academicYear: {
      current: string
      start: string
      end: string
    }
    programs?: string[] // Program keahlian untuk SMK
    extracurricular?: string[]
  }
}

// Default school identity configuration
export const SCHOOL_IDENTITY: SchoolIdentity = {
  basic: {
    name: 'SMK Negeri 1 Bandung',
    shortName: 'SMKN 1 Bandung',
    level: 'SMK',
    npsn: '20219445',
    nss: '321026002001'
  },

  contact: {
    address: {
      street: 'Jl. Wastukancana No. 3',
      village: 'Babakan Ciamis',
      district: 'Sumur Bandung',
      city: 'Bandung',
      province: 'Jawa Barat',
      postalCode: '40117',
      fullAddress: 'Jl. Wastukancana No. 3, Babakan Ciamis, Sumur Bandung, Bandung, Jawa Barat 40117'
    },
    phone: '(022) 4207026',
    fax: '(022) 4207026',
    email: 'info@smkn1bandung.sch.id',
    website: 'https://smkn1bandung.sch.id'
  },

  administration: {
    headmaster: {
      name: 'Dr. Ahmad Sudrajat, M.Pd',
      nip: '196512121990031003',
      position: 'Kepala Sekolah'
    },
    accreditation: {
      grade: 'A',
      year: '2023',
      validUntil: '2028'
    },
    establishment: {
      date: '1965-08-17',
      decree: {
        number: 'SK 421.3/102/Disdik',
        date: '1965-08-17',
        authority: 'Dinas Pendidikan Provinsi Jawa Barat'
      }
    }
  },

  branding: {
    logo: {
      primary: '/assets/logo/school-logo.png',
      secondary: '/assets/logo/school-logo-alt.png',
      icon: '/assets/logo/school-icon.png',
      watermark: '/assets/logo/school-watermark.png'
    },
    colors: {
      primary: '#1E40AF',    // Blue
      secondary: '#059669',   // Green
      accent: '#DC2626'      // Red
    },
    motto: 'Berkarakter, Berprestasi, Berbudaya',
    vision: 'Menjadi SMK unggul yang menghasilkan lulusan berkarakter, kompeten, dan berdaya saing global',
    mission: [
      'Menyelenggarakan pendidikan kejuruan yang berkualitas',
      'Mengembangkan karakter siswa yang berakhlak mulia',
      'Membekali siswa dengan keterampilan yang dibutuhkan dunia kerja',
      'Menjalin kerjasama dengan dunia usaha dan industri',
      'Mengembangkan budaya sekolah yang kondusif untuk pembelajaran'
    ]
  },

  academic: {
    curriculum: 'Kurikulum Merdeka',
    academicYear: {
      current: '2024/2025',
      start: '2024-07-15',
      end: '2025-06-14'
    },
    programs: [
      'Teknik Komputer dan Jaringan',
      'Rekayasa Perangkat Lunak',
      'Multimedia',
      'Teknik Kendaraan Ringan',
      'Teknik Elektronika Industri',
      'Akuntansi dan Keuangan Lembaga'
    ],
    extracurricular: [
      'Pramuka',
      'PMR (Palang Merah Remaja)',
      'OSIS',
      'Rohani Islam',
      'Basket',
      'Futsal',
      'Volley',
      'Programming Club',
      'English Club'
    ]
  }
}

// Helper functions for easy access to school information
export const getSchoolName = (): string => SCHOOL_IDENTITY.basic.name
export const getSchoolShortName = (): string => SCHOOL_IDENTITY.basic.shortName
export const getSchoolAddress = (): string => SCHOOL_IDENTITY.contact.address.fullAddress
export const getSchoolPhone = (): string => SCHOOL_IDENTITY.contact.phone
export const getSchoolEmail = (): string => SCHOOL_IDENTITY.contact.email
export const getSchoolWebsite = (): string => SCHOOL_IDENTITY.contact.website || ''
export const getHeadmasterName = (): string => SCHOOL_IDENTITY.administration.headmaster.name
export const getCurrentAcademicYear = (): string => SCHOOL_IDENTITY.academic.academicYear.current
export const getSchoolMotto = (): string => SCHOOL_IDENTITY.branding.motto || ''
export const getSchoolVision = (): string => SCHOOL_IDENTITY.branding.vision
export const getSchoolMission = (): string[] => SCHOOL_IDENTITY.branding.mission
export const getSchoolLogo = (): string => SCHOOL_IDENTITY.branding.logo.primary
export const getSchoolIcon = (): string => SCHOOL_IDENTITY.branding.logo.icon
export const getPrimaryColor = (): string => SCHOOL_IDENTITY.branding.colors.primary
export const getSecondaryColor = (): string => SCHOOL_IDENTITY.branding.colors.secondary

// Formatted display functions
export const getSchoolFullTitle = (): string => {
  return `${SCHOOL_IDENTITY.basic.name} (${SCHOOL_IDENTITY.basic.level})`
}

export const getSchoolContactInfo = (): string => {
  const { address, phone, email } = SCHOOL_IDENTITY.contact
  return `${address.fullAddress} | Tel: ${phone} | Email: ${email}`
}

export const getEstablishmentInfo = (): string => {
  const establishment = SCHOOL_IDENTITY.administration.establishment
  return `Didirikan ${new Date(establishment.date).toLocaleDateString('id-ID')} - ${establishment.decree.number}`
}

export const getAccreditationInfo = (): string => {
  const accreditation = SCHOOL_IDENTITY.administration.accreditation
  return `Terakreditasi ${accreditation.grade} (${accreditation.year})`
}

// Export individual constants for easy access
export const {
  name: SCHOOL_NAME,
  shortName: SCHOOL_SHORT_NAME,
  level: SCHOOL_LEVEL,
  npsn: SCHOOL_NPSN
} = SCHOOL_IDENTITY.basic

export const {
  phone: SCHOOL_PHONE,
  email: SCHOOL_EMAIL,
  website: SCHOOL_WEBSITE
} = SCHOOL_IDENTITY.contact

export const {
  primary: PRIMARY_COLOR,
  secondary: SECONDARY_COLOR,
  accent: ACCENT_COLOR
} = SCHOOL_IDENTITY.branding.colors

export const {
  vision: SCHOOL_VISION,
  mission: SCHOOL_MISSION,
  motto: SCHOOL_MOTTO
} = SCHOOL_IDENTITY.branding

// Environment-based overrides (for different deployments)
export const getSchoolIdentityForEnv = (): SchoolIdentity => {
  // Check if there are environment variable overrides
  const envName = import.meta.env.VITE_SCHOOL_NAME
  const envAddress = import.meta.env.VITE_SCHOOL_ADDRESS
  const envPhone = import.meta.env.VITE_SCHOOL_PHONE
  const envEmail = import.meta.env.VITE_SCHOOL_EMAIL

  if (envName || envAddress || envPhone || envEmail) {
    return {
      ...SCHOOL_IDENTITY,
      basic: {
        ...SCHOOL_IDENTITY.basic,
        name: envName || SCHOOL_IDENTITY.basic.name,
      },
      contact: {
        ...SCHOOL_IDENTITY.contact,
        address: {
          ...SCHOOL_IDENTITY.contact.address,
          fullAddress: envAddress || SCHOOL_IDENTITY.contact.address.fullAddress,
        },
        phone: envPhone || SCHOOL_IDENTITY.contact.phone,
        email: envEmail || SCHOOL_IDENTITY.contact.email,
      }
    }
  }

  return SCHOOL_IDENTITY
}