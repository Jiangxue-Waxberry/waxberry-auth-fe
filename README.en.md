# Waxberry Auth Frontend

A modern React-based user authentication frontend system providing complete login, registration, and user management functionality with support for multiple user types.

## Features

- **Multiple Login Methods**
  - Password login
  - SMS verification code login
  - Remember login status

- **Multi-Type User Registration**
  - University user registration (school, college, major information)
  - Enterprise user registration (company name, unified social credit code)
  - Individual user registration
  - SMS verification code validation

- **Security Features**
  - JWT Token authentication
  - Form validation and password strength checking
  - Brute force protection mechanism
  - User state management

- **User Experience**
  - Responsive design
  - Internationalization support (Chinese/English)
  - Modern UI interface (Ant Design)
  - Real-time form validation

## Tech Stack

- **Frontend Framework**: React 18.2.0
- **UI Component Library**: Ant Design 5.3.0
- **Routing**: React Router DOM 6.8.2
- **HTTP Client**: Axios 1.3.4
- **State Management**: React Hooks
- **Build Tool**: Webpack 5.78.0
- **CSS Preprocessor**: Sass 1.85.1
- **Internationalization**: react-i18next 13.5.0
- **JWT Handling**: jwt-decode 4.0.0

## Quick Start

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0 or yarn >= 1.22.0

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Jiangxue-Waxberry/waxberry-auth-fe.git
cd waxberry-auth-fe
```

2. Install dependencies:
```bash
npm install
# or using yarn
yarn install
```

3. Start development server:
```bash
npm start
# or using yarn
yarn start
```

The application will start on `http://localhost:3001`.

### Build for Production

```bash
npm run build
# or using yarn
yarn build
```

## Project Structure

```
waxberry-auth-fe/
├── public/                    # Static assets
├── src/
│   ├── pages/
│   │   └── loginAndRegister/  # Login and registration pages
│   │       ├── login.jsx      # Login component
│   │       ├── register.jsx   # Registration component
│   │       ├── login.scss     # Style files
│   │       └── img/           # Image resources
│   ├── components/
│   │   └── getCurrentUser.js  # User information retrieval
│   ├── config/
│   │   └── api.js            # API interface configuration
│   ├── locales/              # Internationalization files
│   │   ├── i18n.js           # i18n configuration
│   │   └── languages/        # Language packages
│   │       ├── zh.js         # Chinese
│   │       └── en.js         # English
│   ├── layouts/              # Layout components
│   ├── utils/                # Utility functions
│   ├── assets/               # Static assets
│   ├── App.jsx               # Root component
│   └── index.js              # Entry file
├── webpack.config.js         # Webpack configuration
├── package.json              # Project configuration
└── README.md                 # Project documentation
```

## Configuration

### Environment Variables

Create `.env.development` file (development environment):

```env
# API authentication service address
REACT_APP_API_AUTH_URL=http://localhost:8000/auth/

# Application configuration
REACT_APP_NAME=Waxberry Auth
REACT_APP_VERSION=1.0.0
```

### Webpack Proxy Configuration

Development environment API proxy is configured in `webpack.config.js`:

```javascript
proxy: {
    context: '/auth/',
    target: 'http://localhost:8000',
    changeOrigin: true,
    disableHostCheck: true,
    noInfo: true,
}
```

## Feature Details

### Login Functionality

#### Password Login
- Support mobile/email login
- Password strength validation
- Remember username functionality
- Error message display

#### Verification Code Login
- Mobile number validation
- SMS verification code sending
- 60-second countdown for resend
- Verification code format validation

### Registration Functionality

#### University User Registration
- School name, college, major information
- Student/Staff ID
- Email verification
- Password strength requirements (uppercase, lowercase, numbers, minimum 8 characters)

#### Enterprise User Registration
- Company name
- Unified social credit code (18 digits)
- Enterprise administrator username
- Complete form validation

#### Individual User Registration
- Basic personal information
- Mobile number verification
- Email verification

### Security Mechanisms

- **JWT Token Management**: Use `jwt-decode` to parse user information
- **Form Validation**: Real-time validation and pre-submission validation
- **Password Policy**: Enforced password complexity requirements
- **Error Handling**: Comprehensive error message display

## API Interfaces

### Authentication Related Interfaces

```javascript
// SMS verification code login
POST /auth/sms/smsLogin

// SMS verification code registration
POST /auth/sms/smsRegister

// User registration
POST /auth/users/register

// User login
POST /login (form submission)
```

### User Information Interface

```javascript
// Get user information
const getCurrentUser = () => {
    // Get id_token from localStorage and parse
    // Return user information object
}
```

## Internationalization Support

The project supports Chinese-English bilingual switching:

- **Chinese Language Package**: `src/locales/languages/zh.js`
- **English Language Package**: `src/locales/languages/en.js`
- **Language Switching**: Store language preferences via localStorage

### Main Translation Content

- Login and registration form fields
- Error messages
- Button text
- Page titles and descriptions

## Development Guide

### Code Standards

- Use functional components and React Hooks
- Follow ESLint configuration
- Use Ant Design component library
- Write styles using SCSS

### Component Development

```javascript
// Example: Login component structure
const Login = ({ error }) => {
    const { t } = useTranslation(); // Internationalization
    const [form] = Form.useForm();  // Form management
    
    // Form submission handling
    const onFinish = (loginForm) => {
        // Handle login logic
    };
    
    return (
        <Form form={form} onFinish={onFinish}>
            {/* Form fields */}
        </Form>
    );
};
```

### Style Development

Use SCSS to write styles with support for nesting and variables:

```scss
.loginPage {
    .formContainer {
        .waxberry-type {
            .type {
                &.type-active {
                    // Active state styles
                }
            }
        }
    }
}
```

## Deployment

### Development Environment

```bash
npm start
```

### Production Environment

```bash
# Build for production
npm run build

# Deploy dist directory to web server
```

### Docker Deployment

```bash
# Build Docker image
docker build -t waxberry-auth-fe .

# Run container
docker run -p 80:80 waxberry-auth-fe
```

## FAQ

### Q: How to handle CORS issues?
A: The project has configured Webpack proxy, automatically handling cross-origin requests in development environment.

### Q: How to modify API address?
A: Modify `REACT_APP_API_AUTH_URL` configuration in `.env.development` file.

### Q: How to add new language support?
A: Add new language files in `src/locales/languages/` directory and configure in `i18n.js`.

### Q: How to customize theme colors?
A: Configure `theme.token.colorPrimary` in `ConfigProvider` in `App.jsx`.

## Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.


