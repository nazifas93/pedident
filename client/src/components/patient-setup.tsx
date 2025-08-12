import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FaUserCircle, FaPlay } from "react-icons/fa";
import type { Patient, InsertPatient } from "@shared/schema";

interface PatientSetupProps {
  onStartCharting: (patient: Patient) => void;
}

export default function PatientSetup({ onStartCharting }: PatientSetupProps) {
  const [formData, setFormData] = useState<InsertPatient>({
    name: "",
    icNumber: "",
    location: "Faculty",
    dentist: "Dr. Sarah Johnson",
  });

  const { toast } = useToast();

  const createPatientMutation = useMutation({
    mutationFn: async (data: InsertPatient) => {
      const response = await apiRequest("POST", "/api/patients", data);
      return await response.json() as Patient;
    },
    onSuccess: (patient) => {
      toast({
        title: "Patient created successfully",
        description: `Ready to start charting for ${patient.name}`,
      });
      onStartCharting(patient);
    },
    onError: (error: any) => {
      toast({
        title: "Error creating patient",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.icNumber) {
      toast({
        title: "Missing required fields",
        description: "Please fill in patient name and IC number",
        variant: "destructive",
      });
      return;
    }
    createPatientMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof InsertPatient, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="bg-white shadow-sm border border-slate-200" data-testid="patient-setup-card">
      <CardHeader className="border-b border-slate-200">
        <CardTitle className="flex items-center text-lg font-semibold text-slate-900">
          <FaUserCircle className="text-medical-blue mr-2" />
          Patient Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} data-testid="patient-setup-form">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Patient Name
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter patient name"
                className="w-full"
                data-testid="input-patient-name"
              />
            </div>
            
            <div>
              <Label htmlFor="icNumber" className="block text-sm font-medium text-slate-700 mb-2">
                IC Number
              </Label>
              <Input
                id="icNumber"
                type="text"
                value={formData.icNumber}
                onChange={(e) => handleInputChange("icNumber", e.target.value)}
                placeholder="Enter IC number"
                className="w-full"
                data-testid="input-ic-number"
              />
            </div>
            
            <div>
              <Label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
                Location
              </Label>
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full bg-slate-50"
                data-testid="input-location"
              />
            </div>
            
            <div>
              <Label htmlFor="dentist" className="block text-sm font-medium text-slate-700 mb-2">
                Dentist
              </Label>
              <Select value={formData.dentist} onValueChange={(value) => handleInputChange("dentist", value)}>
                <SelectTrigger className="w-full" data-testid="select-dentist">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson</SelectItem>
                  <SelectItem value="Dr. Michael Chen">Dr. Michael Chen</SelectItem>
                  <SelectItem value="Dr. Emily Rodriguez">Dr. Emily Rodriguez</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              className="bg-medical-blue text-white px-6 py-2 hover:bg-blue-700 transition-colors duration-200"
              disabled={createPatientMutation.isPending}
              data-testid="button-start-charting"
            >
              <FaPlay className="mr-2" />
              {createPatientMutation.isPending ? "Creating..." : "Start Charting"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
