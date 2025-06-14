# SQL Lab Questions

An interactive web application for practicing SQL queries with instant execution and feedback.

![SQL Lab Questions](public/logo192.png)

## Overview

SQL Lab Questions provides a collection of SQL practice problems with the following features:

- **Interactive SQL Execution**: Write and run SQL queries directly in the browser
- **Categorized Questions**: Problems organized by SQL concepts (Joins, Filtering, Aggregation, etc.)
- **Instant Feedback**: See query results immediately
- **Sample Database**: Built-in emp/dept database schema to practice on

## Database Schema

The application includes a pre-loaded database with the following tables:

### emp

- empno: Employee ID
- ename: Employee Name
- job: Job Title
- mgr: Manager ID
- hiredate: Hire Date
- sal: Salary
- comm: Commission
- deptno: Department ID

### dept

- deptno: Department ID
- dname: Department Name
- loc: Location

## Features

- **Question Categories**: Join, Filtering, Condition, Pattern Matching, Group By, Aggregation, and more
- **Show/Hide Answers**: Toggle visibility of solution SQL queries
- **Interactive Results**: View query results in a formatted table
- **Error Handling**: Clear error messages for debugging queries

## Technology Stack

- **React**: Frontend framework (v19.1.0)
- **TailwindCSS**: For styling and responsive design
- **sql.js**: In-browser SQL database engine
- **Lucide React**: Icon library for UI elements

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/sql-lab-questions.git
   cd sql-lab-questions
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. Browse through the categorized SQL questions
2. Click on a question to expand it
3. View the question details
4. Toggle the answer visibility using the eye icon
5. Run the SQL query to see results
6. Explore the database schema section for reference

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production

## Contributing

Contributions are welcome! Here are some ways you can contribute:

1. Add new SQL practice questions
2. Improve the UI/UX design
3. Fix bugs or improve performance
4. Enhance documentation

## License

This project is licensed under the MIT License - see the LICENSE file for details.
