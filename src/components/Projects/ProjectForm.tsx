import InputField from "@/components/common/InputField";
import { Textarea } from "@/components/ui/textarea";

interface ProjectFormProps {
  disabled?: boolean;
}

export default function ProjectForm({ disabled = false }: ProjectFormProps) {
  return (
    <>
      <InputField
        label="Project name"
        name="name"
        placeholder="Enter project name"
        disabled={disabled}
      />

      <InputField
        as={Textarea}
        label="Description"
        name="description"
        placeholder="Describe your project"
        disabled={disabled}
      />
    </>
  );
}
