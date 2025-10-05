/**
 * ============================================================================
 * KONFIGURASI APLIKASI DAN IDENTITAS SEKOLAH
 * ============================================================================
 * 
 * File ini berisi konfigurasi untuk aplikasi dan data identitas sekolah.
 * PETUNJUK: Edit bagian KONFIGURASI di bawah sesuai dengan data sekolah Anda.
 */

// ============================================================================
// BAGIAN 1: KONFIGURASI SEKOLAH (SILAKAN EDIT SESUAI DATA SEKOLAH ANDA)
// ============================================================================

export const SCHOOL_CONFIG = {
  // ---------- DATA DASAR SEKOLAH ----------
  basic: {
    name: 'SMK Negeri 1 Bandung',                    // Nama lengkap sekolah
    shortName: 'SMKN 1 Bandung',                     // Nama singkat sekolah
    level: 'SMK' as const,                           // Jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK' | 'UNIVERSITAS' | 'PESANTREN'
    npsn: '20219445',                                // Nomor Pokok Sekolah Nasional
    nss: '321026002001'                              // Nomor Statistik Sekolah
  },

  // ---------- KONTAK SEKOLAH ----------
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
  }
}

// ============================================================================
// BAGIAN 2: KONFIGURASI APLIKASI (SILAKAN EDIT SESUAI INFO APLIKASI ANDA)
// ============================================================================

export const APP_CONFIG = {
  name: 'Sistem Informasi Akademik',
  version: '1.0.0',
  description: 'Sistem Manajemen Sekolah Digital',
  
  maker: {
    company: 'Digital Innovation Labs',
    website: 'https://digitalinnovationlabs.com',
    email: 'info@digitalinnovationlabs.com',
    trademark: 'Digital Innovation Labs™'
  },
  
  copyright: {
    year: '2024',
    holder: 'Digital Innovation Labs',
    notice: '© 2024 Digital Innovation Labs. All rights reserved.'
  },
  
  build: {
    version: '1.0.0-stable',
    date: new Date().toISOString().split('T')[0]
  }
}

// ============================================================================
// BAGIAN 3: INTERFACES & TYPES (JANGAN UBAH BAGIAN INI)
// ============================================================================

export interface SchoolIdentity {
  basic: {
    name: string
    shortName: string
    level: 'SD' | 'SMP' | 'SMA' | 'SMK' | 'UNIVERSITAS' | 'PESANTREN'
    npsn: string
    nss: string
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
}

export interface AppInfo {
  name: string
  version: string
  description: string
  maker: {
    company: string
    website: string
    email: string
    trademark: string
  }
  copyright: {
    year: string
    holder: string
    notice: string
  }
  build: {
    version: string
    date: string
  }
}

// ============================================================================
// BAGIAN 4: EXPORTS UTAMA (JANGAN UBAH BAGIAN INI)
// ============================================================================

export const SCHOOL_IDENTITY: SchoolIdentity = SCHOOL_CONFIG
export const APP_INFO: AppInfo = APP_CONFIG

// ============================================================================
// BAGIAN 5: HELPER FUNCTIONS - SCHOOL (JANGAN UBAH BAGIAN INI)
// ============================================================================

// Fungsi dasar untuk mendapatkan informasi sekolah
export const getSchoolName = (): string => SCHOOL_IDENTITY.basic.name
export const getSchoolShortName = (): string => SCHOOL_IDENTITY.basic.shortName
export const getSchoolLevel = (): string => SCHOOL_IDENTITY.basic.level
export const getSchoolNPSN = (): string => SCHOOL_IDENTITY.basic.npsn
export const getSchoolNSS = (): string => SCHOOL_IDENTITY.basic.nss

export const getSchoolAddress = (): string => SCHOOL_IDENTITY.contact.address.fullAddress
export const getSchoolPhone = (): string => SCHOOL_IDENTITY.contact.phone
export const getSchoolFax = (): string => SCHOOL_IDENTITY.contact.fax || ''
export const getSchoolEmail = (): string => SCHOOL_IDENTITY.contact.email
export const getSchoolWebsite = (): string => SCHOOL_IDENTITY.contact.website || ''

// Fungsi format untuk informasi sekolah
export const getSchoolFullTitle = (): string => `${SCHOOL_IDENTITY.basic.name} (${SCHOOL_IDENTITY.basic.level})`
export const getSchoolContactInfo = (): string => {
  const { address, phone, email } = SCHOOL_IDENTITY.contact
  return `${address.fullAddress} | Tel: ${phone} | Email: ${email}`
}

// Fungsi untuk mendapatkan konfigurasi dari environment variables
export const getSchoolIdentityForEnv = (): SchoolIdentity => {
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

// ============================================================================
// BAGIAN 6: HELPER FUNCTIONS - APP (JANGAN UBAH BAGIAN INI)
// ============================================================================

export const getAppName = (): string => APP_INFO.name
export const getAppVersion = (): string => APP_INFO.version
export const getAppDescription = (): string => APP_INFO.description
export const getMakerCompany = (): string => APP_INFO.maker.company
export const getMakerWebsite = (): string => APP_INFO.maker.website
export const getMakerEmail = (): string => APP_INFO.maker.email
export const getMakerTrademark = (): string => APP_INFO.maker.trademark
export const getCopyrightNotice = (): string => APP_INFO.copyright.notice
export const getFullAppInfo = (): string => `${APP_INFO.name} v${APP_INFO.version}`

// ============================================================================
// BAGIAN 7: CONSTANTS EXPORTS (JANGAN UBAH BAGIAN INI)
// ============================================================================

// School constants - Basic
export const {
  name: SCHOOL_NAME,
  shortName: SCHOOL_SHORT_NAME,
  level: SCHOOL_LEVEL,
  npsn: SCHOOL_NPSN,
  nss: SCHOOL_NSS
} = SCHOOL_IDENTITY.basic

// School constants - Contact
export const {
  phone: SCHOOL_PHONE,
  fax: SCHOOL_FAX,
  email: SCHOOL_EMAIL,
  website: SCHOOL_WEBSITE
} = SCHOOL_IDENTITY.contact

// App constants
export const {
  name: APP_NAME,
  version: APP_VERSION,
  description: APP_DESCRIPTION
} = APP_INFO

export const {
  company: MAKER_COMPANY,
  trademark: MAKER_TRADEMARK,
  website: MAKER_WEBSITE,
  email: MAKER_EMAIL
} = APP_INFO.maker

export const {
  year: COPYRIGHT_YEAR,
  holder: COPYRIGHT_HOLDER,
  notice: COPYRIGHT_NOTICE
} = APP_INFO.copyright
