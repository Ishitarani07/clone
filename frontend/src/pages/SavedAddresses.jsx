const SavedAddresses = () => {
  const addresses = [
    {
      id: 1,
      label: 'Home',
      fullName: 'Default User',
      mobile: '9876543210',
      line1: '123, MG Road',
      line2: 'Near Metro Station',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      isDefault: true,
    },
    {
      id: 2,
      label: 'Work',
      fullName: 'Default User',
      mobile: '9876543210',
      line1: '45, Brigade Towers',
      line2: 'Residency Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560025',
      isDefault: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Saved Addresses</h1>
          <button className="bg-[#2874f0] text-white text-sm font-medium px-6 py-2 rounded-sm hover:bg-blue-600 transition">
            Add New Address
          </button>
        </div>

        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-sm shadow-sm p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {address.label}
                  </span>
                  {address.isDefault && (
                    <span className="text-xs font-semibold uppercase text-green-600">Default</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <button className="text-[#2874f0] font-medium">Edit</button>
                  <button className="text-red-500 font-medium">Remove</button>
                </div>
              </div>

              <div className="text-sm text-gray-700 leading-relaxed space-y-1">
                <p className="font-semibold text-gray-900">{address.fullName}</p>
                <p>{address.line1}</p>
                <p>{address.line2}</p>
                <p>
                  {address.city}, {address.state} - {address.pincode}
                </p>
                <p className="text-gray-500">Phone: {address.mobile}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedAddresses;
