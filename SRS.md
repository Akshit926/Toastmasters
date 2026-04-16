# Software Requirements Specification (SRS)
## Project: Wakad Toastmasters Platform
**Version:** 1.0  
**Date:** April 10, 2026

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to provide a detailed overview of the softare requirements for the **Wakad Toastmasters Platform**. This platform serves as a digital hub for members and guests of the Wakad Toastmasters Club, facilitating meeting information dissemination, role allocation, and member registration.

### 1.2 Scope
The system is a responsive web application designed for:
*   Providing club information and meeting schedules.
*   Educating users on Toastmasters procedures and roles.
*   Enabling members to claim/allocate meeting roles in a peer-to-peer manner.
*   Registering new members through a structured enrollment form.

### 1.3 Definitions, Acronyms, and Abbreviations
*   **TMOD**: Toastmaster of the Day.
*   **EXCOM**: Executive Committee (Club Leadership).
*   **SRS**: Software Requirements Specification.
*   **WCAG**: Web Content Accessibility Guidelines.

---

## 2. Overall Description

### 2.1 Product Perspective
Wakad Toastmasters Platform is a standalone web application. While currently operating as a high-fidelity frontend prototype, it is designed for future integration with a cloud-based persistence layer (e.g., Firebase) to support real-time collaboration.

### 2.2 Product Functions
*   **Information Hub**: Displaying club story, mission, and meeting details.
*   **Interactive Dashboard**: A dynamic grid for role management.
*   **Educational Repository**: Detailed breakdowns of meeting flows and role responsibilities.
*   **Lead Capture**: Form for potential and current members to share information.

### 2.3 User Classes and Characteristics
*   **Guests**: Interested individuals seeking information about the club.
*   **Members**: Active club participants who need to claim roles and attend meetings.
*   **Role Players**: Members who have committed to specific tasks for a meeting.

### 2.4 Operating Environment
*   **Platform**: Web-based.
*   **Browsers**: Modern browsers (Chrome, Firefox, Safari, Edge).
*   **Devices**: Fully responsive across Mobile, Tablet, and Desktop.

---

## 3. Functional Requirements

### 3.1 Public Portal (Home Page)
*   **REQ-1**: The system shall display the club mission and "Our Story" section.
*   **REQ-2**: The system shall provide a clear "Meeting Info" card with Venue, Time, and Google Maps integration.
*   **REQ-3**: The system shall feature an EXCOM section showcasing club leaders.
*   **REQ-4**: The system shall include a FAQ section with accordion-style interaction.

### 3.2 Role Allocation Platform
*   **REQ-5**: The system shall allow users to view role availability for specific meeting dates.
*   **REQ-6**: The system shall enable users to claim an available role by providing their name via a modal interface.
*   **REQ-7**: The system shall allow users to cancel a claimed role.
*   **REQ-8**: The system shall visually distinguish between "Available", "Taken", and "Pending" roles using color indicators (Green, Maroon, Gold).

### 3.3 Educational Hub (What to Expect)
*   **REQ-9**: The system shall provide a timeline of a typical 2-hour meeting flow.
*   **REQ-10**: The system shall explain every meeting role (TMOD, Timer, Ah-Counter, etc.) using interactive cards.

### 3.4 Member Registration
*   **REQ-11**: The system shall provide a multi-field form for member information (Name, Phone, Email, Hobbies, Preferred Role).
*   **REQ-12**: The system shall support image uploading for member profiles.

---

## 4. Technical Design Specification

### 4.1 Visual Brand Identity
The application follows a professional, modern aesthetic inspired by Toastmasters International branding with a custom "Wakad" twist.

#### 4.1.1 Color Palette
| Element | Light Mode (HEX) | Dark Mode (HEX) |
| :--- | :--- | :--- |
| **Primary Maroon** | `#772432` | `#e67c8e` |
| **Primary Blue** | `#004165` | `#8ab4f8` |
| **Accent Gold** | `#ffcc00` | `#ffcc00` |
| **Background (Main)**| `#ffffff` | `#121212` |
| **Background (Alt)** | `#f9f9f9` | `#1e1e1e` |
| **Text (Main)** | `#333333` | `#e0e0e0` |

#### 4.1.2 Typography
*   **Headings**: `Montserrat`, sans-serif (800 weight for Brand, 700 for Section Headers).
*   **Body Text**: `Poppins`, sans-serif (400 weight for text, 600 for bold highlights).

### 4.2 UI Component Architecture
*   **Theme Engine**: Global attribute-based toggle (`data-theme="dark"`) using CSS variables.
*   **Glassmorphism**: Applied to modals and navigation bars using `backdrop-filter: blur()` and semi-transparent backgrounds.
*   **Layout System**: CSS Grid for dashboards and Flexbox for navigation and cards.

---

## 5. Potential Backend & Persistence Architecture

### 5.1 Proposed Stack
To transition the current prototype into a functional production app, the following "Peer-to-Peer" collaborative architecture is proposed:

*   **Database**: NoSQL Database (e.g., Firebase Firestore or MongoDB).
*   **Authentication**: Simple Email/Phone OTP or Club Secret Key for role protection.
*   **Logic**:
    *   `GET /meetings/:date`: Fetch role status for a meeting.
    *   `PATCH /meetings/:date/role/:id`: Claim/Release a role.
    *   `POST /members`: Submit registration data.

### 5.2 Data Models

#### Meeting Object
```json
{
  "date": "2026-04-12",
  "theme": "Confidence",
  "roles": [
    { "id": "tmod", "title": "TMOD", "status": "taken", "member": "John Doe" },
    { "id": "timer", "title": "Timer", "status": "available", "member": null }
  ]
}
```

#### Member Object
```json
{
  "name": "Jane Smith",
  "contact": "+91 9876543210",
  "role_preferences": ["Speaker", "Evaluator"],
  "hobbies": "Reading, Travel"
}
```

---

## 6. Non-Functional Requirements

### 6.1 Usability
*   Mobile-first responsiveness.
*   Intuitive navigation with a maximum of 3 clicks to reach any core feature.
*   Global Light/Dark theme persistence (via `localStorage`).

### 6.2 Performance
*   Optimized asset loading (WebP images, minified CSS/JS).
*   Smooth Scroll Reveal animations with a threshold of 0.15 intersection.

### 6.3 Accessibility
*   Semantic HTML tags (`<nav>`, `<header>`, `<main>`, `<footer>`).
*   High color contrast ratios (consistent with WCAG 2.1 Level AA).

---

## 7. Verification Plan

### 7.1 Automated Testing (Proposed)
*   **UI Tests**: Playwright scripts to verify theme toggling and modal responsiveness.
*   **Lighthouse**: Target Score > 90 for SEO, Performance, and Accessibility.

### 7.2 Manual Verification
*   Visual inspection of glassmorphism effects across different background colors.
*   Cross-device testing on Android (Chrome) and iOS (Safari).
