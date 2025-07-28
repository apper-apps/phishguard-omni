import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Campaigns from "@/components/pages/Campaigns";
import CampaignForm from "@/components/pages/CampaignForm";
import Employees from "@/components/pages/Employees";
import Templates from "@/components/pages/Templates";
import Reports from "@/components/pages/Reports";
import Settings from "@/components/pages/Settings";
function App() {
  return (
    <Router>
      <div className="App">
<Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="campaigns/new" element={<CampaignForm />} />
            <Route path="campaigns/:id/edit" element={<CampaignForm />} />
            <Route path="employees" element={<Employees />} />
            <Route path="templates" element={<Templates />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-50"
        />
      </div>
    </Router>
  );
}

export default App;