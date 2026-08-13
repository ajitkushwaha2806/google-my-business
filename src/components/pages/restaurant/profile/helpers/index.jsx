import TimingTab from "../fragments/TimingTab";
import GeneralTab from "../fragments/GeneralTab";
import LocationTab from "../fragments/LocationTab";
import SettingsTab from "../fragments/SettingsTab";

export const TABS = [
    { id: "general", label: "General Info", activeColor: "border-orange-500 text-orange-600" },
    { id: "location", label: "Location", activeColor: "border-orange-500 text-orange-600", badge: "Map", badgeClasses: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400" },
    { id: "timing", label: "Timings", activeColor: "border-orange-500 text-orange-600", badge: "7 Days", badgeClasses: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400" },
    { id: "settings", label: "System Settings", activeColor: "border-orange-500 text-orange-600" },
  ];

export const    renderTabContent = (activeTab, data) => {

  const resData = data?.data || {};

  const generalTab = {
    logo: resData?.logo || "",
    name: resData?.name || "",
    slug: resData?.slug || "",
    phone: resData?.phone || "",
    email: resData?.email || "",
    domain : resData?.domain || ""
  };

  const locationTab = resData?.address || {};
  const timingsTab = resData?.openingHours || {};
  const settingsTab = {
    settings: resData?.settings || {},
  };

  console.log("timinxdcgs" , timingsTab)

    switch (activeTab) {
      case "general":
        return <GeneralTab generalData={generalTab} />;
      case "location":
        return <LocationTab locationData={locationTab} />;
      case "timing":
        return <TimingTab timingsData={timingsTab} />;
      case "settings":
        return <SettingsTab settingData={settingsTab} />;
      default:
        return null;
    }
  };