import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Auth } from '../../interfaces/auth.interfaces';
import { initFlowbite } from 'flowbite';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../../../users/services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {


  private _router: Router = inject(Router);
  private _authService: AuthService = inject(AuthService);
  private _userService: UserService = inject(UserService);
  private _fb: FormBuilder = inject(FormBuilder);;
  public loginForm: FormGroup;
  public wrongPassword: boolean = false;

  constructor() {
    this.loginForm = this._fb.group({
      user: ['', [Validators.required, Validators.minLength(3), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }
  ngOnInit(): void {
    initFlowbite();
  }
  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this._authService.login(this.loginForm.value).subscribe(res => {
      if (res.success===0) {
        this.wrongPassword = true;
        return;
      };
      this._router.navigate(['/'])
    });


  }
  isFieldValid(field: string): boolean | null {
    return this.loginForm.controls[field].errors && this.loginForm.controls[field].touched
  }

  getFieldError(field: string): string | null {
    if (!this.loginForm.contains(field)) return null;
    const error = this.loginForm.controls[field].errors || {};
    for (const key of Object.keys(error)) {

      switch (key) {
        case 'required': return "This field is required";
        case 'minlength': return `This field must have at least ${error['minlength'].requiredLength} characters`;
        case 'email': return `This field must be a valid email`;
        default: break;
      }
    }
    return "";

  }

}
