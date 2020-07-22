import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { requiredFileType } from './upload-file-validators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  signup = new FormGroup({
    email: new FormControl(null, Validators.required),
    image: new FormControl(null, [Validators.required, requiredFileType('png')])
  });
}
