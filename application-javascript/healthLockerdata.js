// healthLockerdata.js


const userProperties1 = {
  id: "client1",
  name: "John Doe",
  gender: "Male",
  dob: "1990-05-15",
  address: "123 Main Street, Cityville, USA",
  contact: "john@example.com"
};
  
const userProperties2 = {
  id: "client2",
  name: "Jane Smith",
  gender: "Female",
  dob: "1985-09-28",
  address: "456 Elm Avenue, Townsville, USA",
  contact: "jane@example.com"
};
  
const healthLockerproperties = {
  id: "locker101",
  userId: "1",
  storageSize: "1000", 
  usedStorage: "250", 
  availableStorage: "750" 
};

const healthRecordProperties1 = {
  id: "201",
  lockerId: "locker101",
  userId: "client1",
  createdAt: "2023-01-15T10:30:00Z",
  title: "Annual Checkup",
  hospital: "City Medical Center",
  visitPurpose: "Routine checkup",
  description: "General health assessment and blood tests.",
  typeTag: "Checkup"
};

const healthRecordProperties2 = {
  id: "202",
  lockerId: "locker101",
  userId: "client1",
  createdAt: "2023-03-20T14:45:00Z",
  title: "Dental Cleaning",
  hospital: "Smile Dental Clinic",
  visitPurpose: "Routine dental cleaning",
  description: "Teeth cleaning and oral examination.",
  typeTag: "Dental"
};

const healthRecordProperties3 = {
  id: "203",
  lockerId: "locker101",
  userId: "client1",
  createdAt: "2023-02-10T11:15:00Z",
  title: "X-ray and Consultation",
  hospital: "Radiance Medical Center",
  visitPurpose: "Investigate persistent pain",
  description: "X-ray of the affected area and consultation with a specialist.",
  typeTag: "Diagnosis"
};

const healthRecordProperties4 = {
  id: "204",
  lockerId: "locker101",
  userId: "client1",
  createdAt: "2023-04-05T09:00:00Z",
  title: "Flu Vaccination",
  hospital: "Community Health Clinic",
  visitPurpose: "Seasonal flu vaccination",
  description: "Received the annual flu vaccine.",
  typeTag: "Vaccination"
};

const healthRecordProperties5 = {
  id: "205",
  lockerId: "locker101",
  userId: "client1",
  createdAt: "2023-03-10T16:20:00Z",
  title: "Allergy Consultation",
  hospital: "Allergy & Immunology Center",
  visitPurpose: "Identify allergens",
  description: "Discussion about allergic reactions and possible triggers.",
  typeTag: "Consultation"
};

const healthRecordProperties6 = {
  id: "206",
  lockerId: "locker101",
  userId: "client1",
  createdAt: "2023-05-12T13:10:00Z",
  title: "Prescription Refill",
  hospital: "Community Health Clinic",
  visitPurpose: "Refill of regular medication",
  description: "Renewed prescription for daily medication.",
  typeTag: "Medication"
};

const updatedHealthRecordProperties = {
  id: "201",
  lockerId: "locker101",
  userId: "client1",
  createdAt: "2023-03-20T14:45:00Z",
  title: "Emergency Surgery",
  hospital: "City Medical Center",
  visitPurpose: "Urgent surgical procedure",
  description: "Appendectomy due to acute appendicitis.",
  typeTag: "Surgery"
};

const shareTokenProperties = {
  recordId: "201",
  lockerId: "locker101",
  userId: "client1",
  recipientId: "client2",
  salt: "xG2&fP5%mC",
  createdAt: "1678254820", 
  expiryAt: "1679181220", 
  accessType: "Read"
};

const updatedShareTokenProperties = {
  recordId: "202", 
  lockerId: "locker101",
  userId: "client1",
  recipientId: "client2",
  salt: "xG2&fP5%mC",
  createdAt: "1678254820", // Example timestamp for "2023-03-07T15:13:40Z"
  expiryAt: "1698960000", // Adjusted expiry timestamp for "2023-12-02T00:00:00Z"
  accessType: "Read"
};
  
module.exports = {
  userProperties1,
  userProperties2,

  healthLockerproperties,
  
  healthRecordProperties1,
  healthRecordProperties2,
  healthRecordProperties3,
  healthRecordProperties4,
  healthRecordProperties5,
  healthRecordProperties6,
  updatedHealthRecordProperties,
  
  shareTokenProperties,
  updatedShareTokenProperties,
  
};
