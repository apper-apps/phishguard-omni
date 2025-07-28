import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import employeeService from "@/services/api/employeeService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const navigate = useNavigate();

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await employeeService.getAll();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (err) {
      setError(err.message || "Failed to load employees");
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const departments = [...new Set(employees.map(emp => emp.department))];

  const handleSearch = (searchTerm) => {
    let filtered = employees;
    
    if (searchTerm) {
      filtered = filtered.filter(employee => 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedDepartment !== "all") {
      filtered = filtered.filter(employee => employee.department === selectedDepartment);
    }
    
    setFilteredEmployees(filtered);
  };

  const handleDepartmentFilter = (department) => {
    setSelectedDepartment(department);
    let filtered = employees;
    
    if (department !== "all") {
      filtered = filtered.filter(employee => employee.department === department);
    }
    
    setFilteredEmployees(filtered);
  };

  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.Id));
    }
  };

  const handleAssignTraining = async () => {
    if (selectedEmployees.length === 0) {
      toast.warning("Please select employees first");
      return;
    }

    try {
      await employeeService.assignTraining(selectedEmployees, "Security Awareness Training");
      toast.success(`Training assigned to ${selectedEmployees.length} employees`);
      setSelectedEmployees([]);
      loadEmployees();
    } catch (err) {
      toast.error("Failed to assign training");
    }
  };

  const getRiskBadgeVariant = (score) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "danger";
  };

  const getRiskLabel = (score) => {
    if (score >= 80) return "Low Risk";
    if (score >= 60) return "Medium Risk";
    return "High Risk";
  };

  if (loading) return <Loading variant="table" />;
  if (error) return <Error message={error} onRetry={loadEmployees} />;

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="flex flex-col lg:flex-row gap-4">
        <SearchBar 
          placeholder="Search employees..." 
          onSearch={handleSearch}
          className="flex-1"
        />
        <div className="flex gap-2">
          <select
            value={selectedDepartment}
            onChange={(e) => handleDepartmentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {selectedEmployees.length > 0 && (
            <Button
              variant="primary"
              onClick={handleAssignTraining}
              icon="BookOpen"
            >
              Assign Training ({selectedEmployees.length})
            </Button>
          )}
        </div>
      </div>

      {/* Employee Table */}
      {filteredEmployees.length === 0 ? (
        <Empty
          icon="Users"
          title="No employees found"
          description="Import employees from CSV or add them manually to get started."
          action={() => navigate("/employees/import")}
          actionLabel="Import Employees"
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-surface">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.length === filteredEmployees.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Training
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.Id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee.Id)}
                        onChange={() => handleSelectEmployee(employee.Id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mr-4">
                          <ApperIcon name="User" className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {employee.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employee.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="default">{employee.department}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={cn(
                          "text-2xl font-bold mr-2",
                          employee.riskScore >= 80 ? "text-green-600" : 
                          employee.riskScore >= 60 ? "text-yellow-600" : "text-red-600"
                        )}>
                          {employee.riskScore}
                        </span>
                        <Badge variant={getRiskBadgeVariant(employee.riskScore)}>
                          {getRiskLabel(employee.riskScore)}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.lastActivity ? 
                        format(new Date(employee.lastActivity), "MMM dd, yyyy") : 
                        "Never"
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={employee.trainingCompleted ? "success" : "warning"}>
                        {employee.trainingCompleted ? "Completed" : "Pending"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/employees/${employee.Id}`)}
                        >
                          <ApperIcon name="Eye" className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/employees/${employee.Id}/edit`)}
                        >
                          <ApperIcon name="Edit" className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;