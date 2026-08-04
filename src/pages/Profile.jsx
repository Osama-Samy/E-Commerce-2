
import { useEffect, useState } from "react";
import { FaUserCircle, FaMapMarkerAlt, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Profile() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState({
    username: "Customer",
    email: "customer@gmail.com",
    phone: "101393372",
    role: "Customer",
    avatar: "",
    addresses: []
  });

  const [formData, setFormData] = useState({
    username: "Customer",
    phone: "101393372",
    avatar: "",
  });
  
  const [addressData, setAddressData] = useState({
    country: "",
    city: "",
    street: "",
    building: "",
    postalCode: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [passwordEmail, setPasswordEmail] = useState("customer@gmail.com");
  const [passwordStep, setPasswordStep] = useState("email");
  const [passwordData, setPasswordData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Simulating initial load
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setFormData({
      username: user.username || "",
      phone: user.phone || "",
      avatar: user.avatar || "",
    });
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    // Simulate API delay
    setTimeout(() => {
      setUser((prev) => ({ ...prev, ...formData }));
      setSaving(false);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    }, 800);
  };

  const handleSaveAddress = () => {
    // No API call, just show toast and clear fields
    toast.success("Address added successfully");
    setAddressData({
      country: "",
      city: "",
      street: "",
      building: "",
      postalCode: "",
    });
  };

  const handleSendOtp = () => {
    if (!passwordEmail.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    // Simulate sending OTP
    setTimeout(() => {
      toast.success("OTP sent to your email");
      setPasswordStep("reset");
    }, 500);
  };

  const handleResetPassword = () => {
    if (!passwordData.otp || !passwordData.newPassword) {
      toast.error("Please enter the OTP and your new password");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Simulate password reset
    setTimeout(() => {
      toast.success("Password changed successfully");
      setIsPasswordOpen(false);
      setPasswordStep("email");
      setPasswordData({ otp: "", newPassword: "", confirmPassword: "" });
    }, 800);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("username");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 pt-24 sm:pt-28 pb-16 px-4 sm:px-6 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="mx-auto max-w-4xl space-y-6">
        
        {/* Profile Header Card */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg transition-colors duration-300">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-4 text-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username || "User avatar"}
                  className="h-24 w-24 rounded-full border-4 border-violet-600 object-cover"
                />
              ) : (
                <FaUserCircle className="h-24 w-24 text-slate-300 dark:text-slate-600" />
              )}
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  {user?.role || "Customer"}
                </p>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {user?.username || "Customer"}
                </h1>
              </div>
            </div>

            <div className="grid gap-4 text-sm md:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 dark:bg-slate-800 px-4 py-4 transition-colors duration-300">
                <p className="text-slate-500 dark:text-slate-400">Email</p>
                <p className="mt-2 font-medium text-slate-800 dark:text-slate-100">
                  {user?.email || "customer@gmail.com"}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 dark:bg-slate-800 px-4 py-4 transition-colors duration-300">
                <p className="text-slate-500 dark:text-slate-400">Phone</p>
                <p className="mt-2 font-medium text-slate-800 dark:text-slate-100">
                  {user?.phone || "101393372"}
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-full border border-violet-600 bg-white dark:bg-transparent px-5 py-2 text-sm font-semibold text-violet-600 transition hover:bg-violet-50 dark:hover:bg-violet-900/20"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg transition-colors duration-300">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Edit Profile
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Update your profile and address information.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 outline-none focus:border-violet-600 transition-colors"
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 outline-none focus:border-violet-600 transition-colors"
                />
              </div>

              <input
                type="text"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="Avatar URL"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 outline-none focus:border-violet-600 transition-colors"
              />

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-transparent text-slate-700 dark:text-slate-200 px-6 py-3 text-sm font-semibold transition hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses Section */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg transition-colors duration-300">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
              <FaMapMarkerAlt />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Addresses
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Add or edit your main shipping address.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                name="country"
                value={addressData.country}
                onChange={handleAddressChange}
                placeholder="Country"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 outline-none focus:border-violet-600 transition-colors"
              />
              <input
                type="text"
                name="city"
                value={addressData.city}
                onChange={handleAddressChange}
                placeholder="City"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 outline-none focus:border-violet-600 transition-colors"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                name="street"
                value={addressData.street}
                onChange={handleAddressChange}
                placeholder="Street"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 outline-none focus:border-violet-600 transition-colors"
              />
              <input
                type="text"
                name="building"
                value={addressData.building}
                onChange={handleAddressChange}
                placeholder="Building"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 outline-none focus:border-violet-600 transition-colors"
              />
            </div>
            <input
              type="text"
              name="postalCode"
              value={addressData.postalCode}
              onChange={handleAddressChange}
              placeholder="Postal code"
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 outline-none focus:border-violet-600 transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={handleSaveAddress}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            + Add Address
          </button>
        </div>

        {/* Change Password Section */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
              <FaLock />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Change Password
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Update your account password for extra security.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setPasswordEmail(user?.email || "");
              setPasswordStep("email");
              setPasswordData({ otp: "", newPassword: "", confirmPassword: "" });
              setIsPasswordOpen(true);
            }}
            className="mt-5 inline-flex items-center justify-center rounded-2xl border border-violet-600 bg-white dark:bg-transparent px-5 py-3 text-sm font-semibold text-violet-600 transition hover:bg-violet-50 dark:hover:bg-violet-900/20"
          >
            Change Password
          </button>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-3xl bg-red-600 px-4 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          Logout
        </button>

        {/* Password Modal */}
        {isPasswordOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setIsPasswordOpen(false)}
          >
            <div 
              className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl transition-colors duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Change Password
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {passwordStep === "email"
                  ? "We'll send an OTP to your email to verify your identity."
                  : "Enter the OTP we sent and choose a new password."}
              </p>
              
              {passwordStep === "email" ? (
                <input
                  type="email"
                  value={passwordEmail}
                  onChange={(e) => setPasswordEmail(e.target.value)}
                  placeholder="Email address"
                  className="mt-5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 outline-none focus:border-violet-600 transition-colors"
                />
              ) : (
                <div className="mt-5 space-y-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={passwordData.otp}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, otp: e.target.value }))}
                    placeholder="OTP code"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 outline-none focus:border-violet-600 transition-colors"
                  />
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="New password"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 outline-none focus:border-violet-600 transition-colors"
                  />
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 outline-none focus:border-violet-600 transition-colors"
                  />
                </div>
              )}
              
              <div className="mt-6 flex gap-2">
                <button
                  type="button"
                  onClick={passwordStep === "email" ? handleSendOtp : handleResetPassword}
                  className="flex-1 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  {passwordStep === "email" ? "Send OTP" : "Change Password"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPasswordOpen(false)}
                  className ="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}














