# Sample Data for Power BI Clone

This document describes the sample data files that should be created for testing the Power BI clone. These files will be created during the implementation phase.

## Sales Data

Create a file named `sales-data.json` with the following structure:

```json
[
  {
    "Date": "2023-01-01",
    "Product": "Laptop",
    "Category": "Electronics",
    "Region": "North",
    "Sales": 1200,
    "Quantity": 2,
    "Profit": 300
  },
  {
    "Date": "2023-01-02",
    "Product": "Smartphone",
    "Category": "Electronics",
    "Region": "South",
    "Sales": 800,
    "Quantity": 4,
    "Profit": 240
  },
  {
    "Date": "2023-01-03",
    "Product": "Desk Chair",
    "Category": "Furniture",
    "Region": "East",
    "Sales": 350,
    "Quantity": 1,
    "Profit": 70
  },
  {
    "Date": "2023-01-04",
    "Product": "Coffee Table",
    "Category": "Furniture",
    "Region": "West",
    "Sales": 500,
    "Quantity": 1,
    "Profit": 150
  },
  {
    "Date": "2023-01-05",
    "Product": "Headphones",
    "Category": "Electronics",
    "Region": "North",
    "Sales": 150,
    "Quantity": 3,
    "Profit": 60
  },
  {
    "Date": "2023-01-06",
    "Product": "Bookshelf",
    "Category": "Furniture",
    "Region": "South",
    "Sales": 420,
    "Quantity": 2,
    "Profit": 100
  },
  {
    "Date": "2023-01-07",
    "Product": "Tablet",
    "Category": "Electronics",
    "Region": "East",
    "Sales": 600,
    "Quantity": 2,
    "Profit": 180
  },
  {
    "Date": "2023-01-08",
    "Product": "Office Desk",
    "Category": "Furniture",
    "Region": "West",
    "Sales": 900,
    "Quantity": 1,
    "Profit": 270
  },
  {
    "Date": "2023-01-09",
    "Product": "Monitor",
    "Category": "Electronics",
    "Region": "North",
    "Sales": 450,
    "Quantity": 3,
    "Profit": 135
  },
  {
    "Date": "2023-01-10",
    "Product": "Dining Table",
    "Category": "Furniture",
    "Region": "South",
    "Sales": 1100,
    "Quantity": 1,
    "Profit": 330
  },
  {
    "Date": "2023-01-11",
    "Product": "Laptop",
    "Category": "Electronics",
    "Region": "East",
    "Sales": 1200,
    "Quantity": 2,
    "Profit": 300
  },
  {
    "Date": "2023-01-12",
    "Product": "Smartphone",
    "Category": "Electronics",
    "Region": "West",
    "Sales": 800,
    "Quantity": 4,
    "Profit": 240
  },
  {
    "Date": "2023-01-13",
    "Product": "Desk Chair",
    "Category": "Furniture",
    "Region": "North",
    "Sales": 350,
    "Quantity": 1,
    "Profit": 70
  },
  {
    "Date": "2023-01-14",
    "Product": "Coffee Table",
    "Category": "Furniture",
    "Region": "South",
    "Sales": 500,
    "Quantity": 1,
    "Profit": 150
  },
  {
    "Date": "2023-01-15",
    "Product": "Headphones",
    "Category": "Electronics",
    "Region": "East",
    "Sales": 150,
    "Quantity": 3,
    "Profit": 60
  }
]
```

## Customer Data

Create a file named `customer-data.json` with the following structure:

```json
[
  {
    "CustomerID": 1,
    "Name": "John Smith",
    "Age": 35,
    "Gender": "Male",
    "Location": "New York",
    "Membership": "Gold",
    "JoinDate": "2022-01-15",
    "TotalSpend": 2500
  },
  {
    "CustomerID": 2,
    "Name": "Emily Johnson",
    "Age": 28,
    "Gender": "Female",
    "Location": "Los Angeles",
    "Membership": "Silver",
    "JoinDate": "2022-03-22",
    "TotalSpend": 1200
  },
  {
    "CustomerID": 3,
    "Name": "Michael Brown",
    "Age": 42,
    "Gender": "Male",
    "Location": "Chicago",
    "Membership": "Bronze",
    "JoinDate": "2022-02-10",
    "TotalSpend": 800
  },
  {
    "CustomerID": 4,
    "Name": "Sarah Davis",
    "Age": 31,
    "Gender": "Female",
    "Location": "Houston",
    "Membership": "Gold",
    "JoinDate": "2022-01-05",
    "TotalSpend": 3100
  },
  {
    "CustomerID": 5,
    "Name": "Robert Wilson",
    "Age": 45,
    "Gender": "Male",
    "Location": "Phoenix",
    "Membership": "Silver",
    "JoinDate": "2022-04-18",
    "TotalSpend": 1500
  },
  {
    "CustomerID": 6,
    "Name": "Jennifer Taylor",
    "Age": 29,
    "Gender": "Female",
    "Location": "Philadelphia",
    "Membership": "Bronze",
    "JoinDate": "2022-05-20",
    "TotalSpend": 600
  },
  {
    "CustomerID": 7,
    "Name": "David Anderson",
    "Age": 38,
    "Gender": "Male",
    "Location": "San Antonio",
    "Membership": "Gold",
    "JoinDate": "2022-02-28",
    "TotalSpend": 2800
  },
  {
    "CustomerID": 8,
    "Name": "Lisa Thomas",
    "Age": 33,
    "Gender": "Female",
    "Location": "San Diego",
    "Membership": "Silver",
    "JoinDate": "2022-03-15",
    "TotalSpend": 1350
  },
  {
    "CustomerID": 9,
    "Name": "James Jackson",
    "Age": 47,
    "Gender": "Male",
    "Location": "Dallas",
    "Membership": "Bronze",
    "JoinDate": "2022-04-05",
    "TotalSpend": 750
  },
  {
    "CustomerID": 10,
    "Name": "Mary White",
    "Age": 26,
    "Gender": "Female",
    "Location": "San Jose",
    "Membership": "Gold",
    "JoinDate": "2022-01-30",
    "TotalSpend": 2200
  }
]
```

## Budget Data

Create a file named `budget-data.json` with the following structure:

```json
[
  {
    "Department": "Marketing",
    "Category": "Advertising",
    "Month": "January",
    "Year": 2023,
    "Budget": 50000,
    "Actual": 48500,
    "Variance": 1500
  },
  {
    "Department": "Marketing",
    "Category": "Events",
    "Month": "January",
    "Year": 2023,
    "Budget": 25000,
    "Actual": 27500,
    "Variance": -2500
  },
  {
    "Department": "Sales",
    "Category": "Travel",
    "Month": "January",
    "Year": 2023,
    "Budget": 15000,
    "Actual": 12000,
    "Variance": 3000
  },
  {
    "Department": "Sales",
    "Category": "Training",
    "Month": "January",
    "Year": 2023,
    "Budget": 10000,
    "Actual": 9500,
    "Variance": 500
  },
  {
    "Department": "IT",
    "Category": "Hardware",
    "Month": "January",
    "Year": 2023,
    "Budget": 30000,
    "Actual": 32000,
    "Variance": -2000
  },
  {
    "Department": "IT",
    "Category": "Software",
    "Month": "January",
    "Year": 2023,
    "Budget": 20000,
    "Actual": 19000,
    "Variance": 1000
  },
  {
    "Department": "HR",
    "Category": "Recruitment",
    "Month": "January",
    "Year": 2023,
    "Budget": 12000,
    "Actual": 11000,
    "Variance": 1000
  },
  {
    "Department": "HR",
    "Category": "Training",
    "Month": "January",
    "Year": 2023,
    "Budget": 8000,
    "Actual": 7500,
    "Variance": 500
  },
  {
    "Department": "Marketing",
    "Category": "Advertising",
    "Month": "February",
    "Year": 2023,
    "Budget": 55000,
    "Actual": 56000,
    "Variance": -1000
  },
  {
    "Department": "Marketing",
    "Category": "Events",
    "Month": "February",
    "Year": 2023,
    "Budget": 20000,
    "Actual": 19000,
    "Variance": 1000
  },
  {
    "Department": "Sales",
    "Category": "Travel",
    "Month": "February",
    "Year": 2023,
    "Budget": 18000,
    "Actual": 20000,
    "Variance": -2000
  },
  {
    "Department": "Sales",
    "Category": "Training",
    "Month": "February",
    "Year": 2023,
    "Budget": 12000,
    "Actual": 11500,
    "Variance": 500
  },
  {
    "Department": "IT",
    "Category": "Hardware",
    "Month": "February",
    "Year": 2023,
    "Budget": 25000,
    "Actual": 24000,
    "Variance": 1000
  },
  {
    "Department": "IT",
    "Category": "Software",
    "Month": "February",
    "Year": 2023,
    "Budget": 22000,
    "Actual": 23000,
    "Variance": -1000
  },
  {
    "Department": "HR",
    "Category": "Recruitment",
    "Month": "February",
    "Year": 2023,
    "Budget": 15000,
    "Actual": 14500,
    "Variance": 500
  },
  {
    "Department": "HR",
    "Category": "Training",
    "Month": "February",
    "Year": 2023,
    "Budget": 10000,
    "Actual": 9800,
    "Variance": 200
  }
]
```

## Using the Sample Data

During implementation, create a utility function to load these sample datasets:

```javascript
// src/utils/sampleData.js
export const loadSampleData = (datasetName) => {
  switch (datasetName) {
    case 'sales':
      return salesData;
    case 'customers':
      return customerData;
    case 'budget':
      return budgetData;
    default:
      return [];
  }
};

const salesData = [
  // Copy the sales data JSON here
];

const customerData = [
  // Copy the customer data JSON here
];

const budgetData = [
  // Copy the budget data JSON here
];
```

This will allow users to quickly load sample data for testing the visualization capabilities without needing to upload their own files.