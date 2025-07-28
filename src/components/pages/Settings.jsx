import { useState } from "react";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const Settings = () => {
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.company.com",
    smtpPort: "587",
    smtpUsername: "phishguard@company.com",
    smtpPassword: "",
    fromName: "PhishGuard Security Team",
    replyTo: "security@company.com"
  });

  const [campaignDefaults, setCampaignDefaults] = useState({
    defaultSender: "IT Support <support@company.com>",
    landingPageUrl: "https://security.company.com/training",
    campaignDuration: "7",
    autoTraining: true,
    reportingEnabled: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    slackWebhook: "",
    notifyOnClick: true,
    notifyOnReport: true,
    dailySummary: true
  });

  const [saving, setSaving] = useState(false);

  const handleSaveEmailSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Email settings saved successfully");
    } catch (error) {
      toast.error("Failed to save email settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCampaignDefaults = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Campaign defaults saved successfully");
    } catch (error) {
      toast.error("Failed to save campaign defaults");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Notification settings saved successfully");
    } catch (error) {
      toast.error("Failed to save notification settings");
    } finally {
      setSaving(false);
    }
  };

  const testEmailConnection = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Email connection test successful!");
    } catch (error) {
      toast.error("Email connection test failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure your PhishGuard Pro platform settings</p>
      </div>

      {/* Email Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="Mail" className="w-5 h-5 mr-2 text-primary" />
            Email Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              label="SMTP Server"
              value={emailSettings.smtpServer}
              onChange={(e) => setEmailSettings({...emailSettings, smtpServer: e.target.value})}
              placeholder="smtp.company.com"
            />
            <FormField
              label="SMTP Port"
              type="number"
              value={emailSettings.smtpPort}
              onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
              placeholder="587"
            />
            <FormField
              label="SMTP Username"
              value={emailSettings.smtpUsername}
              onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
              placeholder="phishguard@company.com"
            />
            <FormField
              label="SMTP Password"
              type="password"
              value={emailSettings.smtpPassword}
              onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
              placeholder="Enter password"
            />
            <FormField
              label="From Name"
              value={emailSettings.fromName}
              onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
              placeholder="PhishGuard Security Team"
            />
            <FormField
              label="Reply-To Email"
              type="email"
              value={emailSettings.replyTo}
              onChange={(e) => setEmailSettings({...emailSettings, replyTo: e.target.value})}
              placeholder="security@company.com"
            />
          </div>
          
          <div className="flex space-x-4">
            <Button
              variant="primary"
              onClick={handleSaveEmailSettings}
              loading={saving}
              icon="Save"
            >
              Save Email Settings
            </Button>
            <Button
              variant="outline"
              onClick={testEmailConnection}
              loading={saving}
              icon="TestTube"
            >
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Defaults */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="Settings" className="w-5 h-5 mr-2 text-primary" />
            Campaign Defaults
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              label="Default Sender Address"
              value={campaignDefaults.defaultSender}
              onChange={(e) => setCampaignDefaults({...campaignDefaults, defaultSender: e.target.value})}
              placeholder="IT Support <support@company.com>"
            />
            <FormField
              label="Landing Page URL"
              type="url"
              value={campaignDefaults.landingPageUrl}
              onChange={(e) => setCampaignDefaults({...campaignDefaults, landingPageUrl: e.target.value})}
              placeholder="https://security.company.com/training"
            />
            <FormField
              label="Default Campaign Duration (days)"
              type="number"
              value={campaignDefaults.campaignDuration}
              onChange={(e) => setCampaignDefaults({...campaignDefaults, campaignDuration: e.target.value})}
              placeholder="7"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Auto-assign Training</h4>
                <p className="text-sm text-gray-600">Automatically assign training to employees who click phishing links</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={campaignDefaults.autoTraining}
                  onChange={(e) => setCampaignDefaults({...campaignDefaults, autoTraining: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Enable Reporting Button</h4>
                <p className="text-sm text-gray-600">Include a "Report Phishing" button in emails</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={campaignDefaults.reportingEnabled}
                  onChange={(e) => setCampaignDefaults({...campaignDefaults, reportingEnabled: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleSaveCampaignDefaults}
            loading={saving}
            icon="Save"
          >
            Save Campaign Defaults
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="Bell" className="w-5 h-5 mr-2 text-primary" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive email alerts for campaign events</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Notify on Click</h4>
                <p className="text-sm text-gray-600">Get notified when someone clicks a phishing link</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.notifyOnClick}
                  onChange={(e) => setNotificationSettings({...notificationSettings, notifyOnClick: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Notify on Report</h4>
                <p className="text-sm text-gray-600">Get notified when someone reports a phishing email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.notifyOnReport}
                  onChange={(e) => setNotificationSettings({...notificationSettings, notifyOnReport: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Daily Summary</h4>
                <p className="text-sm text-gray-600">Receive daily campaign performance summaries</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.dailySummary}
                  onChange={(e) => setNotificationSettings({...notificationSettings, dailySummary: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          <FormField
            label="Slack Webhook URL (Optional)"
            type="url"
            value={notificationSettings.slackWebhook}
            onChange={(e) => setNotificationSettings({...notificationSettings, slackWebhook: e.target.value})}
            placeholder="https://hooks.slack.com/services/..."
          />

          <Button
            variant="primary"
            onClick={handleSaveNotifications}
            loading={saving}
            icon="Save"
          >
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="Activity" className="w-5 h-5 mr-2 text-primary" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Email Service</h4>
                  <p className="text-sm text-gray-600">SMTP connection active</p>
                </div>
              </div>
              <Badge variant="success">Online</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Database</h4>
                  <p className="text-sm text-gray-600">All connections healthy</p>
                </div>
              </div>
              <Badge variant="success">Online</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-900">API Rate Limit</h4>
                  <p className="text-sm text-gray-600">85% of daily limit used</p>
                </div>
              </div>
              <Badge variant="warning">Moderate</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;