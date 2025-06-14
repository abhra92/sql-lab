import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Play, Database, Eye, EyeOff } from 'lucide-react';

const SQLLabWebsite = () => {
  const [showAnswers, setShowAnswers] = useState({});
  const [sqlDb, setSqlDb] = useState(null);
  const [queryResults, setQueryResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  // Sample lab questions with SQL answers
  const labQuestions = [
    {
      id: 1,
      question: "Retrieve all employees and their respective department names using a natural join.",
      sqlAnswer: "SELECT E.ENAME,D.DNAME FROM emp  E  JOIN dept D ON E.DEPTNO=D.DEPTNO;",
      category: "Join"
    },
    {
      id: 2,
      question: "Find the names of employees who are managers.",
      sqlAnswer: "SELECT DISTINCT E.ENAME FROM EMP E WHERE E.EMPNO IN (SELECT MGR FROM EMP WHERE MGR IS NOT NULL);",
      category: "Filtering"
    },
    {
      id: 3,
      question: "List all employees along with their department locations.",
      sqlAnswer: "SELECT e.ename, d.loc FROM emp e JOIN dept d ON e.deptno = d.deptno;",
      category: "Join"
    },
    {
      id: 4,
      question: "Retrieve the names of employees who earn a commission (comm) greater than their salary (sal).",
      sqlAnswer: "SELECT e.ename FROM E WHERE E.comm > E.sal;",
      category: "Condition"
    },
    {
      id: 5,
      question: "Find the department name and location for each employee.",
      sqlAnswer: "SELECT e.ename, d.dname, d.loc FROM emp e JOIN dept d ON e.deptno = d.deptno;",
      category: "Join"
    },
    {
      id: 6,
      question: "List the employees who work in the \"SALES\" department.",
      sqlAnswer: "SELECT e.ename FROM emp e JOIN dept d ON e.deptno = d.deptno WHERE d.dname = 'SALES';",
      category: "Condition"
    },
    {
      id: 7,
      question: "Retrieve all employees hired after January 1, 1985.",
      sqlAnswer: "SELECT e.ename FROM E WHERE E.hiredate > TO_DATE('01-JAN-1985', 'DD-MON-YYYY');",
      category: "Date Filter"
    },
    {
      id: 8,
      question: "Find the employees who work in a location containing the word 'DALLAS'.",
      sqlAnswer: "SELECT e.ename FROM emp e JOIN dept d ON e.deptno = d.deptno WHERE d.loc LIKE '%DALLAS%';",
      category: "Pattern Matching"
    },
    {
      id: 9,
      question: "List the department names along with the total number of employees in each department.",
      sqlAnswer: "SELECT d.dname, COUNT(e.empno) FROM emp e JOIN dept d ON e.deptno = d.deptno GROUP BY d.dname;",
      category: "Group By"
    },
    {
      id: 10,
      question: "Retrieve the names of employees who work under a specific manager.",
      sqlAnswer: "SELECT e.ename FROM E WHERE E.mgr = 7839;", // Example manager ID
      category: "Self Join"
    },
    {
      id: 11,
      question: "Retrieve the total salary paid in each department, ordered by department number.",
      sqlAnswer: "SELECT d.dname, SUM(e.sal) As Total_Salary FROM emp e JOIN dept d ON e.deptno = d.deptno GROUP BY d.dname ORDER BY d.deptno;",
      category: "Aggregation"
    },
    {
      id: 12,
      question: "Find the department names where the average salary of employees exceeds 5000.",
      sqlAnswer: "SELECT d.dname,AVG(e.sal) FROM emp e JOIN dept d ON e.deptno = d.deptno GROUP BY d.dname HAVING AVG(e.sal) > 5000;",
      category: "Group By"
    },
    {
      id: 13,
      question: "List the names of employees whose job titles contain the substring \"CLERK\".",
      sqlAnswer: "SELECT e.ename FROM E WHERE E.job LIKE '%CLERK%';",
      category: "Pattern Matching"
    },
    {
      id: 14,
      question: "Retrieve the department name and the maximum salary in each department where the maximum salary exceeds 8000.",
      sqlAnswer: "SELECT d.dname, MAX(e.sal) AS Max_Salary FROM emp e JOIN dept d ON e.deptno = d.deptno GROUP BY d.dname HAVING MAX(e.sal) > 8000;",
      category: "Aggregation with HAVING"
    },
    {
      id: 15,
      question: "List the employees grouped by department, showing the total salary for each group.",
      sqlAnswer: "SELECT d.dname, SUM(e.sal) AS Total_Salary FROM emp e JOIN dept d ON e.deptno = d.deptno GROUP BY d.dname;",
      category: "Group By"
    },
    {
      id: 16,
      question: "Retrieve the department names and the count of employees, but only include departments with more than 3 employees.",
      sqlAnswer: "SELECT d.dname, SUM(e.sal) AS Total_Salary FROM emp e JOIN dept d ON e.deptno = d.deptno GROUP BY d.dname ;",
      category: "Group By + HAVING"
    },
    {
      id: 17,
      question: "Find the names of employees and their department names for employees earning between 4000 and 6000, ordered by their salary.",
      sqlAnswer: "SELECT e.ename, d.dname, e.sal FROM emp e JOIN dept d ON e.deptno = d.deptno WHERE e.sal BETWEEN 4000 AND 6000 ORDER BY e.sal;",
      category: "Condition + Sorting"
    },
    {
      id: 18,
      question: "Retrieve the department names and their total salary for departments with \"A\" in the department name.",
      sqlAnswer: "SELECT d.dname, SUM(e.sal) AS Total_Salary FROM emp e JOIN dept d ON e.deptno = d.deptno WHERE d.dname LIKE '%A%' GROUP BY d.dname;",
      category: "Pattern + Aggregation"
    },
    {
      id: 19,
      question: "List the employees whose names start with the letter \"S\" and display their department details.",
      sqlAnswer: "SELECT e.ename, d.dname, d.loc FROM emp e JOIN dept d ON e.deptno = d.deptno WHERE e.ename LIKE 'S%';",
      category: "Pattern + Join"
    },
    {
      id: 20,
      question: "Retrieve the department name, job title, and average salary for each job category in a department.",
      sqlAnswer: "SELECT d.dname, e.job, AVG(e.sal) AS Avg_Salary FROM emp e JOIN dept d ON e.deptno = d.deptno GROUP BY d.dname, e.job;",
      category: "Multi-level Grouping"
    },
    {
      id: 21,
      question: "Retrieve the names of employees who do not work under any manager.",
      sqlAnswer: "SELECT ename FROM emp WHERE mgr IS NULL;",
      category: "Null Check"
    },
    {
      id: 22,
      question: "Display department-wise highest and lowest salary with employee name.",
      sqlAnswer: `SELECT e.deptno, e.ename, e.sal 
  FROM emp e 
  JOIN (
    SELECT deptno, MAX(sal) AS max_sal, MIN(sal) AS min_sal 
    FROM emp GROUP BY deptno
  ) s ON e.deptno = s.deptno AND (e.sal = s.max_sal OR e.sal = s.min_sal);`,
      category: "Aggregation + Join"
    },
    {
      id: 23,
      question: "Count the number of managers in each department.",
      sqlAnswer: "SELECT deptno, COUNT(DISTINCT empno) AS No_of_Managers FROM emp WHERE empno IN (SELECT DISTINCT mgr FROM emp WHERE mgr IS NOT NULL)  GROUP BY deptno;",
      category: "Group By"
    },
    {
      id: 24,
      question: "Retrieve employee names and their joining year using date functions.",
      sqlAnswer: "SELECT ename, YEAR(hiredate) AS joining_year FROM emp;",
      category: "Date Function"
    },
    {
      id: 25,
      question: "Find departments where no employee has a commission.",
      sqlAnswer: "SELECT d.dname,d.dname  FROM dept d WHERE d.deptno NOT IN (SELECT DISTINCT deptno FROM emp WHERE comm IS NOT NULL AND Comm > 0);",
      category: "Subquery"
    },
    {
      id: 26,
      question: "Show the second highest salary in each department.",
      sqlAnswer: `SELECT el.deptno, MAX(el.sal) AS second_highest_sal 
  FROM emp el
  WHERE el.sal < (SELECT MAX(e2.sal) FROM emp e2 WHERE e2.deptno = el.deptno) 
  GROUP BY el.deptno;`,
      category: "Advanced Query"
    },
    {
      id: 27,
      question: "List employees whose salary is above the department average.",
      sqlAnswer: `SELECT e.ename,e.sal,e.deptno 
  FROM emp e 
  JOIN (SELECT deptno,AVG(sal) AS Avg_Sal FROM emp GROUP BY deptno) d ON e.deptno = d.deptno
  WHERE e.sal > d.Avg_Sal;`,
      category: "Subquery"
    },
    {
      id: 28,
      question: "Retrieve the department(s) with the lowest total salary.",
      sqlAnswer: `SELECT deptno,SUM(sal) AS Total_Salary 
  FROM emp 
  GROUP BY deptno 
  HAVING Total_Salary = (SELECT MIN(Salary_sum) FROM (SELECT SUM(sal) AS Salary_sum FROM emp GROUP BY deptno)As dept_sums);`,
      category: "Aggregation + Subquery"
    },
    {
      id: 29,
      question: "List employee names along with their length using string function.",
      sqlAnswer: "SELECT ename, LENGTH(ename) AS name_length FROM emp;",
      category: "String Function"
    },
    {
      id: 30,
      question: "Display the employee names in reverse order and their ASCII values.",
      sqlAnswer: "SELECT ename, REVERSE(ename) AS reversed_name, ASCII(SUBSTR(ename, 1, 1)) AS ascii_first_letter FROM emp;",
      category: "String Function"
    },
    {
      id: 31,
      question: "Find the names of employees whose salary is more than the average salary of all employees.",
      sqlAnswer: "SELECT ename,sal FROM emp WHERE sal > (SELECT AVG(sal) FROM emp);",
      category: "Subquery"
    },
    {
      id: 32,
      question: "Retrieve the list of departments where no employee is assigned.",
      sqlAnswer: "SELECT dname, deptno FROM dept WHERE DEPTNO NOT IN (SELECT DISTINCT DEPTNO FROM EMP);",
      category: "Outer Join"
    },
    {
      id: 33,
      question: "Show all employees who were hired in the month of December.",
      sqlAnswer: "SELECT ename,hiredate FROM emp WHERE TO_CHAR(hiredate, 'MM') = '12';",
      category: "Date Filter"
    },
    {
      id: 34,
      question: "Display employee names along with their job title and length of service in years.",
      sqlAnswer: "SELECT ename, job, TIMESTAMPDIFF(YEAR, hiredate, CURDATE()) AS years_of_service FROM emp;",
      category: "Date Calculation"
    },
    {
      id: 35,
      question: "Find the employees who have the same job title as their manager.",
      sqlAnswer: `SELECT e.ename AS employee_name, e.job AS job_title, m.ename AS manager_name 
  FROM emp e 
  JOIN emp m ON e.mgr = m.empno 
  WHERE e.job = m.job;`,
      category: "Self Join"
    },
    {
      id: 36,
      question: "Retrieve department-wise average, minimum, and maximum salary.",
      sqlAnswer: "SELECT deptno,AVG(sal) AS avg_salary, MIN(sal) AS min_salary, MAX(sal) AS max_salary FROM emp GROUP BY deptno;",
      category: "Aggregation"
    },
    {
      id: 37,
      question: "Show the employees with the highest commission in each department.",
      sqlAnswer: `SELECT E1.*
  FROM emp E1 JOIN(
    SELECT deptno, MAX(comm) AS max_comm FROM emp GROUP BY deptno
  ) E2 ON E1.deptno = E2.deptno AND (E1.comm = E2.max_comm);`,
      category: "Aggregation + Join"
    },
    {
      id: 38,
      question: "Find the list of managers who manage more than 3 employees.",
      sqlAnswer: "SELECT m.empno,m.ename, COUNT(e.empno) AS No_of_Employees FROM emp e JOIN emp m ON e.empno = m.mgr GROUP BY m.empno,m.ename HAVING COUNT(e.empno) > 3;",
      category: "Group By + Filter"
    },
    {
      id: 39,
      question: "Display employees whose name ends with the letter 'N'.",
      sqlAnswer: "SELECT * FROM emp WHERE ename LIKE '%N';",
      category: "Pattern Matching"
    },
    {
      id: 40,
      question: "List the department with the highest number of employees.",
      sqlAnswer: `SELECT deptno, COUNT(*) AS No_of_Employees
  FROM emp 
  GROUP BY deptno 
  ORDER BY emp_count DESC 
  LIMIT 1;`,
      category: "Aggregation + Subquery"
    },
    {
      id: 41,
      question: "Retrieve the employees who do not receive any commission.",
      sqlAnswer: "SELECT * FROM emp WHERE comm IS NULL OR comm = 0;",
      category: "Null/Zero Check"
    },
    {
      id: 42,
      question: "Find employees who joined between two given dates.",
      sqlAnswer: "SELECT * FROM emp WHERE hiredate BETWEEN TO_DATE('01-JAN-1985','DD-MON-YYYY') AND TO_DATE('31-DEC-1987','DD-MON-YYYY');",
      category: "Date Filter"
    },
    {
      id: 43,
      question: "Retrieve employee details along with department and manager name using multiple joins.",
      sqlAnswer: `SELECT e.empno, e.ename AS employee_name, e.job AS job_title, d.dname AS department_name,d.loc AS location, m.ename AS manager_name 
  FROM emp e 
  LEFT JOIN dept d ON e.deptno = d.deptno 
  LEFT JOIN emp m ON e.mgr = m.empno;`,
      category: "Multiple Joins"
    },
    {
      id: 44,
      question: "Display all employee names in lowercase and uppercase.",
      sqlAnswer: "SELECT ename, LOWER(ename) AS lowercase_name, UPPER(ename) AS uppercase_name FROM emp;",
      category: "String Function"
    },
    {
      id: 45,
      question: "Show department name and total salary only for departments located in ‘NEW YORK’.",
      sqlAnswer: `SELECT d.dname, SUM(e.sal) AS total_salary
  FROM emp e 
  JOIN dept d ON e.deptno = d.deptno 
  WHERE d.loc = 'NEW YORK' 
  GROUP BY d.dname;`,
      category: "Join + Filter"
    },
    {
      id: 46,
      question: "Find the total salary paid to employees whose names contain the letter ‘A’.",
      sqlAnswer: "SELECT SUM(sal) AS total_salary FROM emp WHERE ename LIKE '%A%';",
      category: "Pattern + Aggregation"
    },
    {
      id: 47,
      question: "Retrieve names of employees who have exactly 5 characters in their names.",
      sqlAnswer: "SELECT * FROM emp WHERE LENGTH(ename) = 5;",
      category: "String Function"
    },
    {
      id: 48,
      question: "Find the youngest employee based on hire date.",
      sqlAnswer: "SELECT * FROM emp ORDER BY hiredate DESC LIMIT 1;",
      category: "Aggregation"
    },
    {
      id: 49,
      question: "Display department-wise job title counts.",
      sqlAnswer: "SELECT deptno, job, COUNT(*) AS job_count FROM emp GROUP BY deptno, job;",
      category: "Group By"
    },
    {
      id: 50,
      question: "List employees along with the number of characters in their job title.",
      sqlAnswer: "SELECT ename, job, LENGTH(job) AS job_length FROM emp;",
      category: "String Function"
    }
  ] ;

  // Initialize sql.js
  useEffect(() => {
    const initSqlJs = async () => {
      try {
        // Load sql.js from npm package instead of CDN
        const sqlPromise = window.initSqlJs({
          locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });
        
        // Wait for SQL initialization
        const SQL = await sqlPromise;
        
        // Create database and sample tables
        const db = new SQL.Database();
        
        // Create sample tables with data
        db.exec(`
          CREATE TABLE emp ( 
            empno     INT PRIMARY KEY, 
            ename     VARCHAR(50), 
            job       VARCHAR(30), 
            mgr       INT, 
            hiredate  DATE, 
            sal       DECIMAL(10,2), 
            comm      DECIMAL(10,2), 
            deptno    INT 
          ); 
          
          CREATE TABLE dept ( 
            deptno    INT PRIMARY KEY, 
            dname     VARCHAR(50), 
            loc       VARCHAR(50) 
          );
          
          -- Insert sample data for dept table
          INSERT INTO dept VALUES
            (10, 'ACCOUNTING', 'NEW YORK'),
            (20, 'RESEARCH', 'DALLAS'),
            (30, 'SALES', 'CHICAGO'),
            (40, 'OPERATIONS', 'BOSTON');
            
          -- Insert sample data for emp table
          INSERT INTO emp VALUES
            (7369, 'SMITH', 'CLERK', 7902, '1980-12-17', 800.00, NULL, 20),
            (7499, 'ALLEN', 'SALESMAN', 7698, '1981-02-20', 1600.00, 300.00, 30),
            (7521, 'WARD', 'SALESMAN', 7698, '1981-02-22', 1250.00, 500.00, 30),
            (7566, 'JONES', 'MANAGER', 7839, '1981-04-02', 2975.00, NULL, 20),
            (7654, 'MARTIN', 'SALESMAN', 7698, '1981-09-28', 1250.00, 1400.00, 30),
            (7698, 'BLAKE', 'MANAGER', 7839, '1981-05-01', 2850.00, NULL, 30),
            (7782, 'CLARK', 'MANAGER', 7839, '1981-06-09', 2450.00, NULL, 10),
            (7788, 'SCOTT', 'ANALYST', 7566, '1982-12-09', 3000.00, NULL, 20),
            (7839, 'KING', 'PRESIDENT', NULL, '1981-11-17', 5000.00, NULL, 10),
            (7844, 'TURNER', 'SALESMAN', 7698, '1981-09-08', 1500.00, 0.00, 30),
            (7876, 'ADAMS', 'CLERK', 7788, '1983-01-12', 1100.00, NULL, 20),
            (7900, 'JAMES', 'CLERK', 7698, '1981-12-03', 950.00, NULL, 30),
            (7902, 'FORD', 'ANALYST', 7566, '1981-12-03', 3000.00, NULL, 20),
            (7934, 'MILLER', 'CLERK', 7782, '1982-01-23', 1300.00, NULL, 10);
        `);
        
        setSqlDb(db);
        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize SQL.js:', error);
        setLoading(false);
      }
    };
    
    initSqlJs();
  }, []);

  const toggleAnswer = (questionId) => {
    setShowAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const toggleExpanded = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const executeQuery = (questionId, query) => {
    if (!sqlDb) {
      setQueryResults(prev => ({
        ...prev,
        [questionId]: { error: 'SQL database not initialized' }
      }));
      return;
    }

    try {
      // Handle queries that don't return results (CREATE, INSERT, UPDATE, DELETE)
      if (query.trim().toUpperCase().startsWith('CREATE') || 
          query.trim().toUpperCase().startsWith('INSERT') || 
          query.trim().toUpperCase().startsWith('UPDATE') || 
          query.trim().toUpperCase().startsWith('DELETE') ||
          query.trim().toUpperCase().startsWith('ALTER')) {
        sqlDb.exec(query);
        setQueryResults(prev => ({
          ...prev,
          [questionId]: { message: 'Query executed successfully' }
        }));
        return;
      }

      const stmt = sqlDb.prepare(query);
      const result = [];
      
      while (stmt.step()) {
        const row = stmt.getAsObject();
        result.push(row);
      }
      
      stmt.free();
      
      setQueryResults(prev => ({
        ...prev,
        [questionId]: { data: result }
      }));
    } catch (error) {
      setQueryResults(prev => ({
        ...prev,
        [questionId]: { error: error.message }
      }));
    }
  };

  const groupedQuestions = labQuestions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Database className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-700">Initializing SQL Environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Database className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">SQL Lab Questions</h1>
              <p className="text-gray-600 mt-2">50 Essential SQL Practice Questions with Interactive Execution</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>SQL.js Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>{labQuestions.length} Questions Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>{Object.keys(groupedQuestions).length} Categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {Object.entries(groupedQuestions).map(([category, questions]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
              {category}
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({questions.length} questions)
              </span>
            </h2>
            
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                            #{question.id}
                          </span>
                          <button
                            onClick={() => toggleExpanded(question.id)}
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            {expandedQuestions[question.id] ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          {question.question}
                        </h3>
                        
                        {expandedQuestions[question.id] && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleAnswer(question.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                              >
                                {showAnswers[question.id] ? (
                                  <>
                                    <EyeOff className="w-4 h-4" />
                                    Hide SQL Answer
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-4 h-4" />
                                    Show SQL Answer
                                  </>
                                )}
                              </button>
                              
                              {showAnswers[question.id] && (
                                <button
                                  onClick={() => executeQuery(question.id, question.sqlAnswer)}
                                  className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors text-sm font-medium"
                                >
                                  <Play className="w-4 h-4" />
                                  Execute Query
                                </button>
                              )}
                            </div>
                            
                            {showAnswers[question.id] && (
                              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                                  {question.sqlAnswer}
                                </pre>
                              </div>
                            )}
                            
                            {queryResults[question.id] && (
                              <div className="mt-4">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Query Result:</h4>
                                {queryResults[question.id].error ? (
                                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-red-700 text-sm font-mono">
                                      Error: {queryResults[question.id].error}
                                    </p>
                                  </div>
                                ) : queryResults[question.id].message ? (
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <p className="text-green-700 text-sm">
                                      {queryResults[question.id].message}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 overflow-x-auto">
                                    {queryResults[question.id].data && queryResults[question.id].data.length > 0 ? (
                                      <table className="w-full text-sm">
                                        <thead>
                                          <tr className="border-b border-blue-200">
                                            {Object.keys(queryResults[question.id].data[0]).map((key) => (
                                              <th key={key} className="text-left py-2 px-3 font-semibold text-blue-800">
                                                {key}
                                              </th>
                                            ))}
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {queryResults[question.id].data.map((row, index) => (
                                            <tr key={index} className="border-b border-blue-100 hover:bg-blue-25">
                                              {Object.values(row).map((value, i) => (
                                                <td key={i} className="py-2 px-3 text-gray-700">
                                                  {value === null ? (
                                                    <span className="text-gray-400 italic">NULL</span>
                                                  ) : (
                                                    String(value)
                                                  )}
                                                </td>
                                              ))}
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    ) : (
                                      <p className="text-blue-700 text-sm">No results returned</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {question.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {!expandedQuestions[question.id] && (
                    <div className="px-6 pb-4">
                      <button
                        onClick={() => toggleExpanded(question.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        Click to expand
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* Database Schema Info */}
        <div className="mt-12 bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-600" />
            Database Schema
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Tables Overview</h3>
              <div className="space-y-3 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <strong className="text-blue-600">emp</strong>
                  <p className="text-gray-600 mt-1">empno, ename, job, mgr, hiredate, sal, comm, deptno</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <strong className="text-blue-600">dept</strong>
                  <p className="text-gray-600 mt-1">deptno, dname, loc</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Sample Data</h3>
              <p className="text-sm text-gray-600 mb-3">
                The database includes sample data with 14 employees across 4 departments. 
                You can execute any query to explore the data structure and practice SQL commands.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  <strong>Tip:</strong> Try running simple queries like "SELECT * FROM emp;" 
                  to explore the data before attempting complex questions.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p className="text-sm">
            SQL Lab Questions - Practice SQL with Interactive Query Execution
          </p>
          <p className="text-xs mt-2">
            Powered by sql.js • {labQuestions.length} Questions • {Object.keys(groupedQuestions).length} Categories
          </p>
        </div>
      </div>
    </div>
  );
};

export default SQLLabWebsite;