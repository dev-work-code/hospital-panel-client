import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import FormInput from "../FormInput/FormInput";
import LogoInput from "../FileInput/FileInput";
import { useToast } from "@/hooks/use-toast";
import GenderRadioButton from "../FormInput/GenderRadioButton";
import api from "@/utils/api";
import FormSelect from "../FormInput/FormSelect";
import { areaSpecializations, bloodGroups, CreateProfileFormData, MAX_FILE_SIZE } from "@/components/internal/types/types";



// Custom validation function for file size
const validateFileSize = (fileList: FileList): boolean | string => {
  if (fileList.length === 0) return true; // No file, validation not required
  const file = fileList[0];
  return file.size <= MAX_FILE_SIZE || "File size must not exceed 2 MB";
};

// Main component
const CreateProfileForm: React.FC = () => {
  const { toast } = useToast(); // Toast notification handler
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Use React Hook Form for form management
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateProfileFormData>();

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
  return (
    <form onSubmit={handleSubmit(onSubmit)} aria-label="Create Profile Form" className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
      <FormInput
        id="doctorName"
        label=" Name"
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
      <div className="relative top-6 ">
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          className="w-full h-11 flex items-center justify-center"
        >
          {loading ? "Adding Doctor..." : "Add Doctor"}
        </Button>
      </div>
    </form>
  );
};

export default CreateProfileForm;
