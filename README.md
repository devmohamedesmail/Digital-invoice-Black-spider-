# ZATCA E-Invoice System 🇸🇦

A comprehensive electronic invoicing system built for compliance with **ZATCA (Zakat, Tax and Customs Authority)** regulations in Saudi Arabia. This system enables businesses to generate, manage, and submit tax-compliant invoices according to the Saudi Arabian e-invoicing requirements.

## 📋 Overview

This application provides a complete solution for managing electronic invoices in accordance with ZATCA Phase 2 requirements, including:
- XML invoice generation
- Digital signature implementation
- QR code generation (ZATCA TLV format)
- Invoice submission to ZATCA API
- Client and service management
- Multi-language support (Arabic/English)

## ✨ Features

### Core Functionality
- **📄 Invoice Management**: Create, view, and manage invoices with comprehensive details
- **👥 Client Management**: Maintain client database with VAT registration details
- **🛠️ Service Tracking**: Manage services and pricing
- **📊 Dashboard Analytics**: Track daily, monthly, and pending invoices
- **🔍 Advanced Search & Filtering**: DataTables integration for efficient data management

### ZATCA Compliance
- **✅ Phase 2 Compliant**: Full compliance with ZATCA e-invoicing regulations
- **🔐 Digital Signatures**: XML signing using RSA-SHA256
- **📱 QR Code Generation**: ZATCA-compliant TLV (Tag-Length-Value) encoded QR codes
- **🌐 API Integration**: Direct submission to ZATCA reporting API
- **📋 XML Generation**: UBL 2.1 compliant invoice XML structure
- **🔑 JWT Authentication**: Secure API authentication with device credentials

### User Experience
- **🎨 Modern UI**: Built with React and Tailwind CSS
- **🌙 Dark Mode Support**: DaisyUI theme integration
- **🌍 Internationalization**: i18next for Arabic and English support
- **📱 Responsive Design**: Mobile-friendly interface
- **📄 PDF Generation**: Invoice PDF export using DomPDF

## 🛠️ Tech Stack

### Backend
- **Framework**: Laravel 12 (PHP 8.2+)
- **Database**: SQLite (easily switchable to MySQL/PostgreSQL)
- **Key Packages**:
  - `robrichards/xmlseclibs` - XML digital signatures
  - `firebase/php-jwt` - JWT token generation
  - `endroid/qr-code` - QR code generation
  - `barryvdh/laravel-dompdf` - PDF generation
  - `inertiajs/inertia-laravel` - Modern monolithic architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Libraries**:
  - Tailwind CSS 4.0
  - DaisyUI 5.0
  - Radix UI components
  - Headless UI
- **State Management**: Inertia.js
- **Data Tables**: DataTables.net with React integration
- **Icons**: Lucide React, React Icons
- **Internationalization**: i18next, react-i18next
- **Rich Text**: React Quill

### Development Tools
- **Build Tool**: Vite 6.0
- **Code Quality**: 
  - ESLint 9 with TypeScript support
  - Prettier with Tailwind plugin
  - Laravel Pint (PHP)
- **Testing**: Pest PHP
- **Process Management**: Concurrently

## 📦 Installation

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- SQLite (or MySQL/PostgreSQL)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Black-spider-project
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node dependencies**
   ```bash
   npm install
   ```

4. **Environment configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure ZATCA credentials in `.env`**
   ```env
   ZATCA_API_URL=https://api.fatoora.gov.sa
   ZATCA_DEVICE_UUID=your-device-uuid
   ZATCA_PRIVATE_KEY_PATH=storage/app/keys/private.key
   ```

6. **Generate RSA keys for ZATCA**
   ```bash
   mkdir -p storage/app/keys
   openssl genrsa -out storage/app/keys/private.key 2048
   openssl rsa -in storage/app/keys/private.key -pubout -out storage/app/keys/public.key
   ```

7. **Run database migrations**
   ```bash
   php artisan migrate
   ```

8. **Seed initial data (optional)**
   ```bash
   php artisan db:seed
   ```

9. **Build frontend assets**
   ```bash
   npm run build
   ```

## 🚀 Usage

### Development Mode

Run all services concurrently:
```bash
composer dev
```

This starts:
- Laravel development server (port 8000)
- Queue worker
- Log viewer (Pail)
- Vite dev server

Or run services individually:
```bash
# Backend only
php artisan serve

# Frontend only
npm run dev

# Queue worker
php artisan queue:listen
```

### Production Build

```bash
npm run build
php artisan optimize
```

## 📁 Project Structure

```
├── app/
│   ├── Http/Controllers/     # Request handlers
│   ├── Models/               # Eloquent models
│   │   ├── Invoice.php       # Invoice model with ZATCA fields
│   │   ├── Client.php        # Client management
│   │   └── Service.php       # Service catalog
│   ├── Services/             # Business logic
│   │   ├── ZatcaInvoiceService.php  # ZATCA API integration
│   │   ├── ZatcaQrService.php       # QR code generation
│   │   └── InvoiceXmlService.php    # XML generation
│   └── Policies/             # Authorization policies
├── database/
│   ├── migrations/           # Database schema
│   └── seeders/              # Sample data
├── resources/
│   ├── js/                   # React components
│   │   ├── Components/       # Reusable UI components
│   │   ├── Pages/            # Page components
│   │   └── Layouts/          # Layout templates
│   └── css/                  # Stylesheets
├── routes/
│   └── web.php               # Application routes
└── storage/
    └── app/keys/             # ZATCA cryptographic keys
```

## 🔐 ZATCA Integration

### Invoice Workflow

1. **Create Invoice**: User fills invoice details through the UI
2. **Generate XML**: System creates UBL 2.1 compliant XML
3. **Sign XML**: Digital signature applied using RSA-SHA256
4. **Generate QR Code**: ZATCA TLV format QR code created
5. **Submit to ZATCA**: Signed invoice sent to ZATCA API
6. **Store Response**: ZATCA response saved for compliance

### QR Code Format

The system generates ZATCA-compliant QR codes with TLV encoding containing:
- Tag 1: Seller Name
- Tag 2: VAT Registration Number
- Tag 3: Invoice Timestamp
- Tag 4: Total Amount (with VAT)
- Tag 5: VAT Amount

### Digital Signature

Invoices are digitally signed using:
- Algorithm: RSA-SHA256
- Canonicalization: Exclusive XML Canonicalization
- Reference: Enveloped signature transform

## 🌍 Internationalization

The application supports both Arabic and English:
- RTL (Right-to-Left) support for Arabic
- Language detection and switching
- Translated UI elements and messages
- Localized date and number formatting

## 📊 Database Schema

### Key Tables
- **invoices**: Core invoice data with ZATCA fields
- **clients**: Customer information and VAT details
- **services**: Service catalog with pricing
- **invoice_types**: Invoice type definitions
- **settings**: Application configuration

## 🧪 Testing

Run PHP tests:
```bash
composer test
# or
php artisan test
```

Run TypeScript type checking:
```bash
npm run types
```

## 🎨 Code Quality

Format code:
```bash
# PHP
./vendor/bin/pint

# JavaScript/TypeScript
npm run format
```

Lint code:
```bash
npm run lint
```

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Code follows existing style guidelines
- Tests pass before submitting PR
- Documentation is updated for new features

## 📞 Support

For ZATCA compliance questions, refer to:
- [ZATCA E-Invoicing Portal](https://zatca.gov.sa)
- [ZATCA Technical Documentation](https://zatca.gov.sa/en/E-Invoicing/Pages/default.aspx)

## ⚠️ Important Notes

- Ensure you have valid ZATCA credentials before production use
- Keep private keys secure and never commit them to version control
- Test thoroughly in ZATCA sandbox environment before going live
- Maintain proper backup procedures for invoice data
- Stay updated with ZATCA regulation changes

---

**Built with ❤️ for Saudi Arabian businesses**
