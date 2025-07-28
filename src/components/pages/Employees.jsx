import { useNavigate } from "react-router-dom";
import EmployeeTable from "@/components/organisms/EmployeeTable";
import Button from "@/components/atoms/Button";

const Employees = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-1">Manage employee data and track security awareness progress</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate("/employees/import")}
            icon="Upload"
          >
            Import CSV
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate("/employees/new")}
            icon="Plus"
          >
            Add Employee
          </Button>
        </div>
      </div>

      <EmployeeTable />
    </div>
  );
};

export default Employees;