import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import FormInput from "../FormInput/FormInput";
import LogoInput from "../FileInput/FileInput";
import { useToast } from "@/hooks/use-toast";
import GenderRadioButton from "../FormInput/GenderRadioButton";
import api from "@/utils/api";
import FormSelect from "../FormInput/FormSelect";

// Define the form data interface
interface CreateProfileFormData {
  doctorMobileNumber: string; // Add phone number
  country: string;
  doctorEmail: string; // Updated field
  doctorName: string; // Updated field
  doctorId: string; // Updated field
  doctorDOB: string; // Updated field
  bloodType: string; // Updated field
  doctorQualification: string; // Updated field
  doctorAdditionalQualification: string; // Updated field
  doctorAddress: string; // Updated field
  practiceLocation: string; // Updated field
  areaOfSpecialization: string; // Updated field
  workplace: string; // Updated field
  doctorGender: string; // Updated field
  panCard: FileList; // Updated field
  medicalLicense: FileList; // Updated field
  aadharCard: FileList; // Updated field
  credentials: string; // Updated field for Credentials
  experience: string;  // Updated field for Experience
  doctorPhoto: FileList;
}
const areaSpecializations = [
  "Internal medicine",
  "Pediatrics",
  "Dermatology",
  "Cardiology",
  "Neurology",
  "Orthopaedics",
  "Neurosurgery",
  "General Surgery",
  "Gastroenterology",
  "Ophthalmology",
  "ENT",
  "Gynaecology",
  "Surgical gastroenterology",
  "Pulmonology",
];
// Constants
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB in bytes

// Custom validation function for file size
const validateFileSize = (fileList: FileList): boolean | string => {
  if (fileList.length === 0) return true; // No file, validation not required
  const file = fileList[0];
  return file.size <= MAX_FILE_SIZE || "File size must not exceed 2 MB";
};

// Main component
const CreateProfileForm: React.FC = () => {
  const { toast } = useToast(); // Toast notification handler
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [currentStep, setCurrentStep] = useState<number>(1); // Step state
  const navigate = useNavigate();

  // Use React Hook Form for form management
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    control,
  } = useForm<CreateProfileFormData>();

  // Watch specific fields for changes
  const panCard = watch("panCard");
  const medicalLicense = watch("medicalLicense");
  const doctorName = watch("doctorName");
  const doctorId = watch("doctorId");
  const country = watch("country");
  const doctorEmail = watch("doctorEmail");
  const doctorDOB = watch("doctorDOB");
  const bloodType = watch("bloodType");
  const doctorQualification = watch("doctorQualification");
  const doctorAdditionalQualification = watch("doctorAdditionalQualification");
  const doctorAddress = watch("doctorAddress");
  const practiceLocation = watch("practiceLocation");
  const areaOfSpecialization = watch("areaOfSpecialization");
  const workplace = watch("workplace");
  const phoneNumber = watch("doctorMobileNumber");
  const aadhaarCardFile = watch("aadharCard");
  const doctorGender = watch("doctorGender");
  const credentials = watch("credentials"); // Watch Credentials
  const experience = watch("experience"); // Watch Experience
  const doctorPhoto = watch("doctorPhoto")

  // Clear errors on field change
  useEffect(() => {
    if (panCard && panCard.length > 0) {
      trigger("panCard"); // Trigger validation for PanCard
    }
  }, [panCard, trigger]);

  useEffect(() => {
    if (aadhaarCardFile && aadhaarCardFile.length > 0) {
      trigger("aadharCard"); // Trigger validation for Aadhaar Card
    }
  }, [aadhaarCardFile, trigger]);

  useEffect(() => {
    if (doctorPhoto && doctorPhoto.length > 0) {
      trigger("doctorPhoto"); // Trigger validation for Aadhaar Card
    }
  }, [doctorPhoto, trigger]);

  useEffect(() => {
    if (medicalLicense && medicalLicense.length > 0) {
      trigger("medicalLicense"); // Trigger validation for GST Document
    }
  }, [medicalLicense, trigger]);

  // A single useEffect to clear all relevant errors
  useEffect(() => {
    const clearErrors = async () => {
      if (doctorName) {
        await trigger("doctorName");
      }
      if (doctorId) {
        await trigger("doctorId");
      }
      if (country) {
        await trigger("country");
      }
      if (doctorEmail) {
        await trigger("doctorEmail");
      }
      if (phoneNumber) {
        await trigger("doctorMobileNumber"); // Clear errors for phone number
      }

      // New fields for clearing errors
      if (doctorDOB) {
        await trigger("doctorDOB");
      }
      if (bloodType) {
        await trigger("bloodType");
      }
      if (doctorQualification) {
        await trigger("doctorQualification");
      }
      if (doctorAdditionalQualification) {
        await trigger("doctorAdditionalQualification");
      }
      if (doctorAddress) {
        await trigger("doctorAddress");
      }
      if (practiceLocation) {
        await trigger("practiceLocation");
      }
      if (areaOfSpecialization) {
        await trigger("areaOfSpecialization");
      }
      if (workplace) {
        await trigger("workplace");
      }
      if (doctorGender) {
        await trigger("doctorGender");
      }
      if (credentials) {
        await trigger("credentials"); // Clear errors for Credentials
      }
      if (experience) {
        await trigger("experience"); // Clear errors for Experience
      }
    };

    clearErrors();
  }, [
    doctorName,
    doctorId,
    country,
    doctorEmail,
    doctorDOB,
    bloodType,
    doctorQualification,
    doctorAdditionalQualification,
    doctorAddress,
    practiceLocation,
    areaOfSpecialization,
    workplace,
    phoneNumber,
    doctorGender,
    medicalLicense,
    panCard,
    aadhaarCardFile,
    doctorPhoto,
    trigger,
  ]);
  const bloodGroups = [
    "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "RhD+", "RhD-"
  ];

  // Handle form submission
  const onSubmit: SubmitHandler<CreateProfileFormData> = async (data) => {
    setLoading(true); // Start loading state

    // Prepare FormData for file uploads and other fields
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "panCard" || key === "medicalLicense" || key === "aadhaarCardFile") {
        if (value instanceof FileList && value.length > 0) {
          formData.append(key, value[0]); // Append the first file
        }
      } else {
        formData.append(key, value as string); // Append other fields as strings
      }
    });

    // Log the FormData key-value pairs
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      // Post the form data to the API
      const response = await api.post("/hospital/registerDoctor", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Check for success response
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Profile created successfully!",
          variant: "default",
          className: "bg-green-500 text-white",
        });
        navigate("/register/complete");
      } else {
        throw new Error("Profile creation failed.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Profile creation failed. Please try again.",
        variant: "destructive",
      });
      console.error("Profile creation failed.", error);
    } finally {
      setLoading(false); // End loading state
    }
  };


  // Move to the next step after validation
  const handleNextStep = async () => {
    const isValid = await trigger(); // Validate current step
    if (isValid) {
      setCurrentStep((prev) => prev + 1); // Move to next step
    }
  };

  const handleBackStep = () => {
    setCurrentStep((prev) => prev - 1); // Decrease step to go back
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} aria-label="Create Profile Form" className="max-w-4xl mx-auto p-6 space-y-6">
      {currentStep === 1 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
            <FormInput
              id="doctorName"
              label=" Name"
              placeholder="Name here"
              type="text"
              register={register("doctorName", {
                required: "Name is required",
                validate: (value) => value.trim() !== "" || "Name cannot be empty or just spaces",
              })}
              error={errors.doctorName}
            />
            <GenderRadioButton
              id="doctorGender"
              label="Gender"
              control={control}  // Pass the `control` prop from `useForm` instead of `register`
              error={errors.doctorGender}
            />

            <FormInput
              id="doctorEmail"
              label=" Email"
              placeholder="xyz@companyname"
              type="email"
              register={register("doctorEmail", {
                required: "email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address (e.g., name@example.com)",
                },
              })}
              error={errors.doctorEmail}
            />

            <FormInput
              id="phoneNumber"
              label="Phone Number"
              placeholder="Phone Number"
              type="text"
              register={register("doctorMobileNumber", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone number",
                },
              })}
              error={errors.doctorMobileNumber}
            />

            <FormInput
              id="doctorDOB"
              label="Date of Birth"
              placeholder="Date of Birth"
              type="date"
              register={register("doctorDOB", {
                required: "Date of Birth is required",
              })}
              error={errors.doctorDOB}
            />
            <FormSelect
              id="bloodType"
              label="Blood Group"
              options={bloodGroups}
              register={register}
              error={errors.bloodType}
            />
            <FormInput
              id="doctorQualification"
              label="Qualification"
              placeholder="Qualification"
              type="text"
              register={register("doctorQualification", {
                required: "Qualification is required",
              })}
              error={errors.doctorQualification}
            />
            <FormInput
              id="doctorAdditionalQualification"
              label="Additional Qualifications"
              placeholder="Additional Qualifications"
              type="text"
              register={register("doctorAdditionalQualification")}
              error={errors.doctorAdditionalQualification}
            />
            <FormInput
              id="doctorAddress"
              label="Address"
              placeholder="Address"
              type="text"
              register={register("doctorAddress", {
                required: "Address is required",
              })}
              error={errors.doctorAddress}
            />
            <FormInput
              id="practiceLocation"
              label="Practicing Hospital"
              placeholder="Hospital/Clinic"
              type="text"
              register={register("practiceLocation", {
                required: "Practicing Hospital is required",
              })}
              error={errors.practiceLocation}
            />

            <FormSelect
              id="areaOfSpecialization"
              label="Area of Specialization"
              options={areaSpecializations}
              register={register}
              error={errors.areaOfSpecialization}
            />
            <FormInput
              id="workplace"
              label="Work Location"
              placeholder="Work Location"
              type="text"
              register={register("workplace", {
                required: "Work Location is required",
              })}
              error={errors.workplace}
            />
          </div>

          <div className="flex items-center justify-between">
            {/* Step Indicator */}
            <div className="flex-grow text-center text-base font-normal ml-8 mt-2">
              <span>{currentStep}/2</span>
            </div>

            {/* Next Button */}
            <Button
              type="button"
              onClick={handleNextStep}
              variant="primary"
              className="w-80 h-10 flex items-center justify-center"
            >
              Next
            </Button>
          </div>
        </>
      )}

      {currentStep === 2 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
            <FormInput
              id="doctorId"
              label="Doctor ID"
              placeholder="DoctorID"
              type="text"
              register={register("doctorId", {
                required: "Doctor ID is required",
                validate: (value) => value.trim() !== "" || "Doctor ID cannot be empty or just spaces",
              })}
              error={errors.doctorId}
            />
            <LogoInput
              id="medicalLicense"
              label="MedicalLicense"
              register={register("medicalLicense", {
                required: "Medical License file is required",
                validate: (value) => validateFileSize(value) || true,
              })}
              error={errors.medicalLicense}
            />

            <FormInput
              id="experience"
              label="Experience"
              placeholder="Enter your experience"
              type="text"
              register={register("experience", {
                required: "Experience is required",
              })}
              error={errors.experience}
            />
            <LogoInput
              id="panCard"
              label="PanCard"
              register={register("panCard", {
                required: "Pan Card file is required",
                validate: (value) => validateFileSize(value) || true,
              })}
              error={errors.panCard}
            />
            <FormInput
              id="credentials"
              label="Credentials"
              placeholder="Enter your credentials"
              type="text"
              register={register("credentials", {
                required: "Credentials are required",
              })}
              error={errors.credentials}
            />
            <LogoInput
              id="aadhaarCardFile"
              label="Aadhaar Card"
              register={register("aadharCard", {
                required: "Aadhaar card is required",
                validate: (value) => validateFileSize(value) || true,
              })}
              error={errors.aadharCard}
            />
            <LogoInput
              id="doctorPhoto"
              label="Doctor Photo"
              register={register("doctorPhoto", {
                required: "DoctorPhoto is required",
                validate: (value) => validateFileSize(value) || true,
              })}
              error={errors.doctorPhoto}
            />
          </div>

          <div className="flex items-center justify-between">
            {/* Back Button */}
            <Button
              type="button"
              onClick={handleBackStep}
              variant="secondary"
              className="w-80 h-10 flex items-center justify-center"
            >
              Back
            </Button>

            <div className="flex-grow text-center text-base font-normal ml-8 mt-1">
              <span>{currentStep}/2</span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-80 h-10 flex items-center justify-center"
            >
              {loading ? "Adding Doctor..." : "Add Doctor"}
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default CreateProfileForm;
