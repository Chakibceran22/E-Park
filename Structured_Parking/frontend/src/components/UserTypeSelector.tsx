import { Button } from "@/components/ui/button";
import { Shield, User, Crown } from "lucide-react";

interface UserTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
  excludeAdmin?: boolean;
}

const userTypes = [
  {
    id: "user",
    label: "Normal User",
    description: "Access standard features",
    icon: User,
  },
  
  {
    id: "admin",
    label: "Admin",
    description: "Full system access",
    icon: Crown,
  },
];

export function UserTypeSelector({ selectedType, onTypeSelect, excludeAdmin = false }: UserTypeSelectorProps) {
  const availableTypes = excludeAdmin ? userTypes.filter(type => type.id !== "admin") : userTypes;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground text-center">
        Select Account Type
      </h3>
      <div className="grid gap-3">
        {availableTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <Button
              key={type.id}
              variant="userType"
              className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                isSelected ? "border-primary bg-secondary" : ""
              }`}
              onClick={() => onTypeSelect(type.id)}
            >
              <Icon className={`h-8 w-8 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
              <div className="text-center">
                <p className={`font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                  {type.label}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {type.description}
                </p>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}