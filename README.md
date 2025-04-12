# MPPT P&O (Maximum Power Point Tracking - Perturb & Observe)

<p align="center">
<img align="center" alt="coding" width="450" src="https://github.com/Platypus96/MPPT-P-O/blob/main/Screenshot%202025-04-12%20224231.png">
</p>

This repository contains an implementation of an **MPPT controller** using the **Perturb and Observe (P&O)** algorithm. The system simulates and optimizes the power output from a photovoltaic (PV) system. The MPPT technique is crucial for maximizing the efficiency of solar power systems by adjusting the operating point of the system to ensure maximum power output.

## Features

- **Backend**: Implements the MPPT algorithm using Python. This handles the core computation for maximum power tracking and simulation.
- **Frontend**: Provides a user-friendly interface built using **Next.js** to visualize simulation results, including key power characteristics such as PV curves, IV curves, and dynamic step size.
- **Simulation**: The system provides real-time simulations of the PV system's performance based on input voltage and current values.
- **Interactive Charts**: Displays important graphs such as:
  - PV Curve
  - IV Curve
  - Dynamic Step Size Curve
  - Power Output Curve

## Prerequisites

Before getting started, ensure you have the following installed on your machine:

- **Python 3.8+**
- **Node.js 14+**
- **npm** or **yarn**

## Installation

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Platypus96/MPPT.git
   ```

2. Navigate to the `backend` directory:

   ```bash
   cd MPPT/backend
   ```

3. Create and activate a virtual environment (optional but recommended):

   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # On Windows
   source venv/bin/activate  # On macOS/Linux
   ```

4. Install required Python libraries:

   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:

   ```bash
   cd ../frontend
   ```

2. Install the necessary Node.js dependencies:

   ```bash
   npm install
   ```

## Running the Application

### Backend

To start the backend server, run:

```bash
python app.py
```

This will start the backend, typically on `http://localhost:5000`.

### Frontend

To start the frontend server, run:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Usage

1. The frontend interface allows users to input simulation parameters, including voltage and current.
2. Once the inputs are provided, the system calculates the **Maximum Power Point (MPP)** and plots the **PV curve**, **IV curve**, **dynamic step size curve**, and **power output curve** based on the provided data.

## Contributing

Contributions to the project are welcome! If you find any issues or want to improve the functionality, feel free to fork the repository and submit a pull request. Please follow the standard Git workflow:

1. Fork the repository
2. Clone your fork
3. Create a new branch for your feature/bugfix
4. Commit your changes
5. Push the changes to your fork
6. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
