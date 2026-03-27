import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UiService } from '../../../core/service/model-services/profile/profile';
import { UserService } from '../../../core/service/model-services/user/user';
import { TextFieldComponent } from "../../../shared/components/text-field/text-field";
import { NumberFieldComponent } from "../../../shared/components/number-field/number-field";
import { AuthService } from '../../../core/service/api-services/auth/auth';

@Component({
  selector: 'app-user-profile',
  imports: [SHARED_IMPORTS, TextFieldComponent, NumberFieldComponent],
  providers: [MessageService],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfileComponent implements OnInit {

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  activeTab = 0; // default tab
  isSaving = false;
  isPasswordSaving = false;
  formSubmitted = false;
  constructor(private fb: FormBuilder,
    private messageService: MessageService,
    private uiService: UiService,
    private authService: AuthService,
    private userservice: UserService) { }



  ngOnInit() {
    this.initForms();
    this.loadUser();

    this.uiService.showProfile$.subscribe(() => {
      this.openProfileDialog();
    });
   
  }

  initForms() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile_Number: ['', [Validators.pattern(/^[6-9]\d{9}$/)]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }
  displayProfileDialog = false;
  openProfileDialog() {

    this.displayProfileDialog = true;
  }

  closeProfileDialog() {
    this.activeTab=0;
    this.displayProfileDialog = false;

    // optional reset
    this.passwordForm.reset();
  }



  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  loadUser() {

    const user = this.userservice.getUser();
    if (!user) return;
    this.profileForm.patchValue({
      name: user.name,
      email: user.email,
      mobile_Number: user.mobile_Number || ''
    });
  }

  saveProfile() {
    this.formSubmitted = true;
    if (this.profileForm.invalid) return;

    this.isSaving = true;
    const value = this.profileForm.getRawValue();
    value.mobile_Number = value.mobile_Number.toString();
    this.authService.update(value).subscribe({
      next: () => {

        this.isSaving = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated'
        });
        this.closeProfileDialog();
      },
      error: () => {

        this.isSaving = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Operation failed'
        });

      }
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) return;

    this.isPasswordSaving = true;
    const value = this.passwordForm.getRawValue();
    this.authService.changepassword(value).subscribe({
      next: () => {

        this.isPasswordSaving = false;
        this.passwordForm.reset();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated'
        });
        this.closeProfileDialog();
      },
      error: () => {

        this.isPasswordSaving = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Operation failed'
        });

      }
    });
  }
}