import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl
} from '@angular/forms';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpResponse
} from '@angular/common/http';
import { pipe } from 'rxjs';
import { tap, filter, map } from 'rxjs/operators';

import { requiredFileType } from './upload-file-validators';

export function uploadProgress<T>(cb: (progress: number) => void) {
  return tap((event: HttpEvent<T>) => {
    if (event.type === HttpEventType.UploadProgress) {
      cb(Math.round((100 * event.loaded) / (event.total || 1)));
    }
  });
}

export function toResponseBody<T>() {
  return pipe(
    filter((event: any) => event.type === HttpEventType.Response),
    map((res: HttpResponse<T>) => res.body)
  );
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  progress = 0;

  signup = new FormGroup({
    email: new FormControl(null, Validators.required),
    image: new FormControl(null, [Validators.required, requiredFileType('png')])
  });
  success = false;

  constructor(private http: HttpClient) {}

  submit(): void {
    this.success = false;
    if (!this.signup.valid) {
      markAllAsDirty(this.signup);

      return;
    }

    this.http
      .post('http://localhost:8080/signup', toFormData(this.signup.value), {
        reportProgress: true,
        observe: 'events'
      })
      .pipe(
        uploadProgress((progress) => (this.progress = progress)),
        toResponseBody()
      )
      .subscribe((res) => {
        this.progress = 0;
        this.success = true;
        this.signup.reset();
      });
  }

  hasError(field: string, error: string): boolean | undefined {
    const control: AbstractControl | null = this.signup.get(field);

    return control?.dirty && control?.hasError(error);
  }
}

export function markAllAsDirty(form: FormGroup): void {
  for (const control of Object.keys(form.controls)) {
    form.controls[control].markAsDirty();
  }
}

export function toFormData<T>(formValue: T): FormData {
  const formData = new FormData();

  for (const key of Object.keys(formValue)) {
    const value = (formValue as any)[key];
    formData.append(key, value);
  }

  return formData;
}
