/**
 * School Identity Usage Examples
 * This file demonstrates how to use the school identity configuration
 * across different components and pages
 */

import React from 'react'
import {
  getSchoolName,
  getSchoolShortName,
  getSchoolAddress,
  getSchoolPhone,
  getSchoolEmail,
  getSchoolLogo,
  getSchoolMotto,
  getSchoolVision,
  getSchoolMission,
  getHeadmasterName,
  getCurrentAcademicYear,
  getSchoolFullTitle,
  getSchoolContactInfo,
  getAccreditationInfo,
  SCHOOL_IDENTITY,
  PRIMARY_COLOR,
  SECONDARY_COLOR
} from '../config/schoolIdentity'

// Example 1: Login Page Header
export const LoginPageHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <img
        src={getSchoolLogo()}
        alt="Logo Sekolah"
        className="h-20 w-20 mx-auto mb-4"
      />
      <h1 className="text-2xl font-bold text-gray-900">
        {getSchoolName()}
      </h1>
      <p className="text-sm text-gray-600 mt-2">
        {getSchoolMotto()}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Sistem Informasi Akademik
      </p>
    </div>
  )
}

// Example 2: Navbar School Info
export const NavbarSchoolInfo: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <img
        src={getSchoolLogo()}
        alt="Logo"
        className="h-8 w-8"
      />
      <div className="hidden md:block">
        <div className="text-sm font-semibold text-gray-900">
          {getSchoolShortName()}
        </div>
        <div className="text-xs text-gray-600">
          {getCurrentAcademicYear()}
        </div>
      </div>
    </div>
  )
}

// Example 3: Footer School Information
export const FooterSchoolInfo: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold mb-3">{getSchoolName()}</h3>
          <p className="text-sm text-gray-300 mb-2">
            {getSchoolAddress()}
          </p>
          <p className="text-sm text-gray-300">
            Tel: {getSchoolPhone()}
          </p>
          <p className="text-sm text-gray-300">
            Email: {getSchoolEmail()}
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Visi</h4>
          <p className="text-sm text-gray-300">
            {getSchoolVision()}
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Misi</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            {getSchoolMission().map((mission, index) => (
              <li key={index}>• {mission}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// Example 4: School Profile Card
export const SchoolProfileCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start gap-4">
        <img
          src={getSchoolLogo()}
          alt="Logo Sekolah"
          className="h-16 w-16"
        />
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">
            {getSchoolFullTitle()}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {getSchoolMotto()}
          </p>
          <div className="mt-3 space-y-1 text-sm text-gray-700">
            <p>NPSN: {SCHOOL_IDENTITY.basic.npsn}</p>
            <p>Kepala Sekolah: {getHeadmasterName()}</p>
            <p>{getAccreditationInfo()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Example 5: Print Header (for documents/reports)
export const PrintDocumentHeader: React.FC = () => {
  return (
    <div className="border-b-2 border-gray-800 pb-4 mb-6 print:block">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={getSchoolLogo()}
            alt="Logo"
            className="h-12 w-12"
          />
          <div>
            <h1 className="text-lg font-bold">
              {getSchoolName()}
            </h1>
            <p className="text-sm text-gray-600">
              {getSchoolContactInfo()}
            </p>
          </div>
        </div>
        <div className="text-right text-sm text-gray-600">
          <p>NPSN: {SCHOOL_IDENTITY.basic.npsn}</p>
          <p>{getCurrentAcademicYear()}</p>
        </div>
      </div>
    </div>
  )
}

// Example 6: Dashboard Welcome Banner
export const DashboardWelcomeBanner: React.FC = () => {
  return (
    <div
      className="rounded-lg p-6 text-white"
      style={{ backgroundColor: PRIMARY_COLOR }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Selamat Datang di Sistem Informasi Akademik
          </h2>
          <p className="text-blue-100">
            {getSchoolFullTitle()}
          </p>
          <p className="text-blue-200 text-sm mt-1">
            Tahun Ajaran {getCurrentAcademicYear()}
          </p>
        </div>
        <img
          src={getSchoolLogo()}
          alt="Logo"
          className="h-16 w-16 opacity-80"
        />
      </div>
    </div>
  )
}

// Example 7: About School Modal/Page
export const AboutSchoolSection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <img
          src={getSchoolLogo()}
          alt="Logo Sekolah"
          className="h-24 w-24 mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-gray-900">
          {getSchoolName()}
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          {getSchoolMotto()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Visi</h2>
          <p className="text-gray-700 mb-6">
            {getSchoolVision()}
          </p>

          <h2 className="text-xl font-semibold mb-4">Misi</h2>
          <ul className="space-y-2">
            {getSchoolMission().map((mission, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">{index + 1}.</span>
                <span className="text-gray-700">{mission}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Informasi Sekolah</h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Alamat:</span>
              <p className="text-gray-700">{getSchoolAddress()}</p>
            </div>
            <div>
              <span className="font-medium">Telepon:</span>
              <span className="text-gray-700 ml-2">{getSchoolPhone()}</span>
            </div>
            <div>
              <span className="font-medium">Email:</span>
              <span className="text-gray-700 ml-2">{getSchoolEmail()}</span>
            </div>
            <div>
              <span className="font-medium">NPSN:</span>
              <span className="text-gray-700 ml-2">{SCHOOL_IDENTITY.basic.npsn}</span>
            </div>
            <div>
              <span className="font-medium">Kepala Sekolah:</span>
              <span className="text-gray-700 ml-2">{getHeadmasterName()}</span>
            </div>
            <div>
              <span className="font-medium">Akreditasi:</span>
              <span className="text-gray-700 ml-2">{getAccreditationInfo()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}