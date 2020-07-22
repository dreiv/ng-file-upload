import { FormControl, ValidationErrors } from '@angular/forms';

export function requiredFileType(type: string): any {
  return ({ value: file }: FormControl): ValidationErrors | null => {
    if (file) {
      const extension = file.name.split('.')[1].toLowerCase();

      if (type.toLowerCase() !== extension.toLowerCase()) {
        return {
          requiredFileType: true
        };
      }
    }

    return null;
  };
}
