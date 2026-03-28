const Profile = () => {
  const user = {
    name: 'Ishita',
    email: 'user@flipkart.com',
    phone: '+91 9876543210',
    memberSince: 'March 2024',
    defaultAddress: {
      fullName: 'Default User',
      line1: '123, MG Road',
      line2: 'Near Metro Station',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-sm shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Personal Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Full Name</p>
                <p className="text-gray-800 font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Email Address</p>
                <p className="text-gray-800 font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Mobile Number</p>
                <p className="text-gray-800 font-medium">{user.phone}</p>
              </div>
              <div>
                <p className="text-gray-500">Member Since</p>
                <p className="text-gray-800 font-medium">{user.memberSince}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-sm shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Default Address</h2>
            <div className="text-sm text-gray-700 leading-relaxed">
              <p className="font-medium">{user.defaultAddress.fullName}</p>
              <p>{user.defaultAddress.line1}</p>
              <p>{user.defaultAddress.line2}</p>
              <p>
                {user.defaultAddress.city}, {user.defaultAddress.state} - {user.defaultAddress.pincode}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Account Security</h2>
          <div className="text-sm text-gray-600 space-y-2">
            <p>Your account is secured with email and phone verification.</p>
            <p className="text-[#2874f0] font-medium">Update Password (coming soon)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
