import { IonicModule } from '@ionic/angular';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastController, AlertController} from '@ionic/angular';
import { UsersService } from '../services/users.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, ReactiveFormsModule]
})
export class RegisterPage implements OnInit {

  typePassword: String = "password"
  userForm: FormGroup<{ name: FormControl<string>; email: FormControl<string>; password: FormControl<string>; }>;
  usersService = inject(UsersService);

  constructor(
    private router: Router,
    private toastController: ToastController,
    private alerController: AlertController
  ) {
    this.userForm = new FormGroup({
      name: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
      email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
      password: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.minLength(6)]})
    })
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
  }

  showPassword() {
    this.typePassword = this.typePassword === "password" ? "text" : "password";
  }

  async register() {
    if (this.userForm.status !== 'VALID') {
      this.toastPresent();
    } else {
      const response = await this.usersService.register(this.userForm.value);
      const status = response.status;
      const message = response.message;
      const error = response.message;

      if(!status) {
        this.alertPresent(message,error);
      } else {
        localStorage.setItem("tokenUser", response.token!);
        this.router.navigate(['my-notes']);
      }
    }
  }

  async toastPresent() {
    const toast = await this.toastController.create({
      message: "Algunos de los campos es incorrecto, por favor vuelve a corroborarlos.",
      duration: 1500,
      position: 'bottom',
      color: 'danger',
      mode: 'ios'
    });

    await toast.present();
  }

  async alertPresent(header: string, message?:string) {
    const alert = await this.alerController.create({
      header: header,
      message: message,
      mode: 'ios',
      buttons: [
        {
          text: 'Aceptar',
          htmlAttributes: {
            'arial-label': 'close'
          }
        }
      ]
    });

    await alert.present()
  }

}
